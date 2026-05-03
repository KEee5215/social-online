// server.js
require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");

const { getState, saveState } = require("./store");
const { runSimulation } = require("./simulation");

const app = express();
app.use(express.json());

//测试接口
app.get("/test", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// 发动态
app.post("/post", async (req, res) => {
  const { userId, content } = req.body;

  const state = getState(userId);

  state.queue.push({
    type: "POST",
    content,
    source: "USER",
  });

  await runSimulation(state, 5);

  saveState(userId, state);

  res.json({
    timeline: state.timeline.slice(-20),
    userState: state.user,
  });
});

// 获取feed
app.get("/feed", (req, res) => {
  const { userId } = req.query;

  const state = getState(userId);

  res.json({
    timeline: state.timeline,
    userState: state.user,
  });
});

app.listen(3000, () => {
  console.log("🚀 server running at http://localhost:3000");
});
