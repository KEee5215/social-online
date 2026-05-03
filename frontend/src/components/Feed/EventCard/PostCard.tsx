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

interface PostCardProps {
  event: Event;
}

export function PostCard({ event }: PostCardProps) {
  return (
    <div className="event-card post-card">
      <div className="event-source">📤 {event.source}</div>
      <div className="event-content">{event.content}</div>
    </div>
  );
}
