import { Card, CardContent } from "@/components/ui/card";

export function CommentCard({ event }) {
  const { source, content, meta } = event;

  const color =
    meta?.stance === "support"
      ? "text-green-500"
      : meta?.stance === "attack"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <Card>
      <CardContent className="p-3 space-y-1">
        <div className="text-sm font-medium">🧑 {source}</div>

        <div className={color}>{content}</div>

        <div className="text-xs text-gray-400">情绪强度: {meta?.intensity}</div>
      </CardContent>
    </Card>
  );
}
