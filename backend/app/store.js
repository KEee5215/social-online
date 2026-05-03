// store.js
const store = new Map();

function getState(userId) {
  if (!store.has(userId)) {
    store.set(userId, {
      user: {
        controversy: 0,
        reputation: 0,
      },
      agents: createAgents(),
      queue: [],
      timeline: [],
    });
  }

  return store.get(userId);
}

function saveState(userId, state) {
  store.set(userId, state);
}

const { createAgents } = require("./agents");

module.exports = { getState, saveState };
