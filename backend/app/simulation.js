// simulation.js
const { callLLM } = require("./llm");

async function runSimulation(state, steps = 5) {
  for (let i = 0; i < steps; i++) {
    await tick(state);
  }
}

async function tick(state) {
  const event = state.queue.shift();
  if (!event) {
    console.log("[Tick] Queue empty, skipping");
    return;
  }

  console.log(`[Tick] Processing event:`, event.type, event.content);

  state.timeline.push(event);

  if (event.type === "COMMENT") {
    state.user.controversy += 1;
  }

  for (const agent of state.agents) {
    if (!canSee(agent, event)) {
      console.log(`[Agent ${agent.id}] Cannot see event`);
      continue;
    }
    if (!shouldReact(agent, state)) {
      console.log(`[Agent ${agent.id}] Decided not to react`);
      continue;
    }

    console.log(`[Agent ${agent.id}] Reacting as ${agent.role}`);
    const newEvent = await agentDecide(agent, event, state);

    if (newEvent) {
      state.queue.push(newEvent);
      console.log(`[Agent ${agent.id}] Pushed new event:`, newEvent.content);
    }
  }

  if (state.user.controversy > 3) {
    state.queue.push({
      type: "TREND",
      content: "🔥 热度上升中",
      source: "SYSTEM",
    });
  }
}

// ===== 可见性控制 =====
function canSee(agent, event) {
  if (event.source === "USER") return true;
  if (agent.role === "MEDIA") return true;
  if (event.target === "USER") return true;
  return false;
}

// ===== 是否响应 =====
function shouldReact(agent, state) {
  if (agent.role === "FAN") return Math.random() < 0.6;
  if (agent.role === "HATER") return Math.random() < 0.5;
  if (agent.role === "MEDIA") return Math.random() < 0.3;
  return false;
}

// ===== 决策 =====
async function agentDecide(agent, event, state) {
  let systemPrompt = "";
  let userPrompt = "";

  if (agent.role === "FAN") {
    systemPrompt =
      "你是一个狂热的粉丝，非常支持你喜欢的博主。你的回复应该充满热情和鼓励。";
    userPrompt = `用户发表了: "${event.content}"，请生成一条支持鼓励的回复。`;
  } else if (agent.role === "HATER") {
    systemPrompt = "你是一个网络喷子，说话尖酸刻薄，喜欢嘲讽和批评。";
    userPrompt = `用户发表了: "${event.content}"，请生成一条嘲讽批评的回复。`;
  } else if (agent.role === "MEDIA") {
    systemPrompt = "你是一个新闻媒体账号，报道客观中立但喜欢蹭热点。";
    userPrompt = `事件: "${event.content}"，请生成一条新闻报道风格的转发。`;
  } else {
    return null;
  }

  try {
    const result = await callLLM(agent, event, state);
    return result;
  } catch (error) {
    console.error(`LLM error for agent ${agent.id}:`, error.message);
    return null;
  }
}

module.exports = { runSimulation };
