import { Badge } from "@/components/ui/badge";
import type { SessionStatus } from "@/lib/types";

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  SCHEDULED: { label: "Scheduled", className: "bg-slate-100 text-slate-700 hover:bg-slate-100" },
  OPEN: { label: "Open", className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" },
  FULL: { label: "Full", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  CLOSED: { label: "Closed", className: "bg-orange-50 text-orange-700 hover:bg-orange-50" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-50 text-blue-700 hover:bg-blue-50" },
  COMPLETED: { label: "Completed", className: "bg-gray-50 text-gray-500 hover:bg-gray-50" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 hover:bg-red-50" },
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
