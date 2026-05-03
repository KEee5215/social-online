import { useState } from "react";

import "./App.css";
import { TopBar } from "./components/TopBar/TopBar";
import { Composer } from "./components/Composer/Composer";
import { Feed } from "./components/Feed/Feed";

type Event = {
  type: string;
  content: string;
  source: string;
  target?: string;
  meta?: {
    stance: string;
    intensity: number;
  };
};

type AppState = {
  timeline: Event[];
  userState: {
    controversy: number;
    reputation: number;
  };
};

function App() {
  const [timeline, setTimeline] = useState([]);
  const [userState, setUserState] = useState({
    controversy: 0,
    reputation: 0,
  });

  // ⭐ 渐进式动画
  function animateTimeline(newEvents) {
    let i = 0;

    const interval = setInterval(() => {
      setTimeline((prev) => [...prev, newEvents[i]]);
      i++;

      if (i >= newEvents.length) {
        clearInterval(interval);
      }
    }, 500);
  }

  // ⭐ 发帖逻辑
  async function handlePost(text) {
    const res = await fetch("/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "u1",
        content: text,
      }),
    });

    const data = await res.json();

    // ❗不要直接 setTimeline
    // setTimeline(data.timeline)

    animateTimeline(data.timeline);

    setUserState(data.userState);
  }

  return (
    <>
      <div className="max-w-xl mx-auto">
        <TopBar userState={userState} />
        <Composer onPost={handlePost} />
        <Feed timeline={timeline} />
      </div>
    </>
  );
}

export default App;
