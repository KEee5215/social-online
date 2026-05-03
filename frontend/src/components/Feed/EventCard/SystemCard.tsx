import { Card, CardContent } from "@/components/ui/card";

export function SystemCard({ event }) {
  return (
    <Card className="border-yellow-500 bg-yellow-50">
      <CardContent className="p-3">⚠️ {event.content}</CardContent>
    </Card>
  );
}
