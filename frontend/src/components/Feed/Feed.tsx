import { EventCard } from "./EventCard/EventCard";

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

interface FeedProps {
  timeline: Event[];
}

export function Feed({ timeline }: FeedProps) {
  return (
    <div className="p-4 space-y-3">
      {timeline?.map((event: Event, index: number) =>
        event ? <EventCard key={index} event={event} /> : null,
      )}
    </div>
  );
}
