import { Badge } from "@/components/ui/badge";

export function TopBar({ userState }) {
  return (
    <div className="flex gap-4 p-4 border-b">
      <Badge variant="destructive">🔥 热度: {userState.controversy}</Badge>

      <Badge variant="secondary">🎭 人设: {userState.reputation}</Badge>
    </div>
  );
}
