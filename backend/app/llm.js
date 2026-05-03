const QWEN_API_URL = process.env.QWEN_API_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const QWEN_API_KEY = process.env.QWEN_API_KEY || "";
const QWEN_MODEL = process.env.QWEN_MODEL || "qwen-plus";

async function callLLM(prompt, systemPrompt = "你是一个社交媒体模拟器中的AI角色，请根据角色设定生成符合角色的回复。") {
  if (!QWEN_API_KEY) {
    throw new Error("QWEN_API_KEY environment variable is not set");
  }

  const response = await fetch(QWEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { callLLM };