import { CommentCard } from "./CommentCard";
import { MediaCard } from "./MediaCard";
import { PostCard } from "./PostCard";
import { SystemCard } from "./SystemCard";

interface Event {
  type: string;
  content: string;
  source: string;
  target?: string;
  meta?: {
    stance: string;
    intensity: number;
  };
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  if (!event) return null;

  switch (event.type) {
    case "POST":
      return <PostCard event={event} />;

    case "COMMENT":
      return <CommentCard event={event} />;

    case "MEDIA":
      return <MediaCard event={event} />;

    case "TREND":
      return <SystemCard event={event} />;

    default:
      return null;
  }
}
