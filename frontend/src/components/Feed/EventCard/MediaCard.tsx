import { Card, CardContent } from "@/components/ui/card";

export function MediaCard({ event }) {
  return (
    <Card className="border-blue-500">
      <CardContent className="p-3">📢 媒体报道：{event.content}</CardContent>
    </Card>
  );
}
