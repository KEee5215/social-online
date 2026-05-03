// agents.js
function createAgents() {
  return [
    { id: "A", role: "FAN", favorability: 0.8 },
    { id: "B", role: "HATER", aggression: 0.7 },
    { id: "C", role: "MEDIA" },
  ];
}

module.exports = { createAgents };
