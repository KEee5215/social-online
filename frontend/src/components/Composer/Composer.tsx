import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function Composer({ onPost }) {
  const [text, setText] = useState("");

  return (
    <div className="p-4 border-b space-y-2">
      <Textarea
        placeholder="今天想说点什么..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        onClick={() => {
          onPost(text);
          setText("");
        }}
      >
        发布
      </Button>
    </div>
  );
}
