import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { manager } from "@/lib/mock-data";

export function TopBar() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-foreground flex items-center justify-center">
          <span className="text-background text-xs font-bold">PN</span>
        </div>
        <span className="font-semibold text-sm">Padel NonStop</span>
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">
            {manager.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{manager.name}</span>
      </div>
    </div>
  );
}
