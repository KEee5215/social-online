const QWEN_API_URL =
  process.env.QWEN_API_URL ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const QWEN_API_KEY = process.env.QWEN_API_KEY || "";
const QWEN_MODEL = process.env.QWEN_MODEL || "qwen-plus";

// llm.js

const axios = require("axios");

// 控制层（核心 ⭐） 👉 系统决定AI“该怎么说”
function buildControl(agent, state) {
  let stance = "neutral";
  let intensity = 3;

  if (agent.role === "FAN") {
    stance = "support";
    intensity = 3 + Math.floor(state.user.reputation / 5);
  }

  if (agent.role === "HATER") {
    stance = "attack";
    intensity = 2 + Math.floor(state.user.controversy / 3);
  }

  if (agent.role === "MEDIA") {
    stance = "neutral";
    intensity = 2;
  }

  // 限制范围
  intensity = Math.max(1, Math.min(5, intensity));

  return { stance, intensity };
}
// Prompt设计（可控关键）
function buildPrompt(agent, event, control) {
  return `
你是一个社交平台用户。

【角色】
${agent.role}

【用户发言】
"${event.content}"

【强制要求】
- 你的立场必须是：${control.stance}
- 情绪强度为：${control.intensity}（1最弱，5最强）
- 不允许改变立场
- 输出必须是严格JSON

【输出格式】
{
  "stance": "${control.stance}",
  "intensity": ${control.intensity},
  "content": "一句自然的评论"
}

不要输出markdown，不要输出解释。
`;
}

//安全解析（防止AI乱输出）
function cleanJSON(text) {
  text = text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  throw new Error("No JSON found");
}

function safeParse(text) {
  try {
    const cleaned = cleanJSON(text);
    const json = JSON.parse(cleaned);

    return {
      stance: json.stance || "neutral",
      intensity: json.intensity || 3,
      content: json.content || "...",
    };
  } catch (e) {
    console.log("parse failed:", text);
    return fallbackParse(text);
  }
}

function fallbackParse(text) {
  return {
    stance: "neutral",
    intensity: 3,
    content:
      text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、]/g, "").slice(0, 50) ||
      "...",
  };
}

async function callLLM(agent, event, state) {
  // console.log(`[callLLM] Calling LLM for agent:`, agent);
  // if (!agent || !agent.id) {
  //   throw new Error("❌ agent.id 丢了");
  // }

  const control = buildControl(agent, state); // 控制层, 决定AI强度

  const prompt = buildPrompt(agent, event, control); // Prompt设计, 输出格式可控

  try {
    const res = await axios.post(
      QWEN_API_URL,
      {
        model: QWEN_MODEL, // 或你用的模型
        messages: [
          {
            role: "system",
            content:
              "你是一个严格按照JSON格式输出的助手，不要输出任何多余文本。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${QWEN_API_KEY}`,
        },
      },
    );

    const text = res.data.choices[0].message.content;

    console.log(`[callLLM] Raw response:`, text);

    const parsed = safeParse(text); // 安全解析, 防止AI乱输出
    const final = enforceControl(parsed, control);

    const result = {
      type: "COMMENT",
      content: final.content,
      source: agent.id,
      target: "USER",
      meta: final,
    };

    console.log(`[callLLM] Returning:`, result);
    return result;
  } catch (err) {
    console.log("LLM error:", err.message);

    const result = fallback(agent, event, control);
    console.log(`[callLLM] Fallback returning:`, result);
    return result;
  }
}

function enforceControl(parsed, control) {
  return {
    stance: control.stance,
    intensity: control.intensity,
    content: parsed.content,
  };
}

// fallback（没有AI也能跑 ⭐）最后兜底策略
function fallback(agent, event, control) {
  if (control.stance === "support") {
    return {
      type: "COMMENT",
      content: `支持你：${event.content}`,
      source: agent.id,
      target: "USER",
      meta: {
        stance: control.stance,
        intensity: control.intensity,
      },
    };
  }

  if (control.stance === "attack") {
    return {
      type: "COMMENT",
      content: `这也太离谱了吧：${event.content}`,
      source: agent.id,
      target: "USER",
      meta: {
        stance: control.stance,
        intensity: control.intensity,
      },
    };
  }

  return {
    type: "COMMENT",
    content: `有人在讨论：${event.content}`,
    source: agent.id,
    target: "USER",
    meta: {
      stance: "neutral",
      intensity: 3,
    },
  };
}
module.exports = { callLLM };
