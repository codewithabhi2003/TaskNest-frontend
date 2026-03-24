import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { format, isPast, isWithinInterval, addDays } from "date-fns";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

const PRIORITY_META: Record<string, { dot: string; cls: string }> = {
  High:   { dot: "bg-red-500",     cls: "bg-red-500/10 text-red-500 border-red-500/20"       },
  Medium: { dot: "bg-amber-400",   cls: "bg-amber-400/10 text-amber-500 border-amber-400/20" },
  Low:    { dot: "bg-emerald-500", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

const getDueBadge = (dueDate?: string | Date) => {
  if (!dueDate) return null;
  const d = dueDate instanceof Date ? dueDate : new Date(dueDate as string);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  if (isPast(d)) return { label: "Overdue", cls: "text-red-500" };
  if (isWithinInterval(d, { start: now, end: addDays(now, 3) }))
    return { label: "Due soon", cls: "text-amber-500" };
  return null;
};

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-start gap-3 px-5 py-4 border-b bg-muted/30">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "rgba(232,255,71,0.1)", border: "1px solid rgba(232,255,71,0.25)" }}
        >
          <CalendarClock className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Upcoming Tasks</p>
          <p className="text-xs text-muted-foreground">
            {data.length > 0
              ? `${data.length} task${data.length !== 1 ? "s" : ""} due soon`
              : "Tasks due soon will appear here"}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-3">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(232,255,71,0.07)", border: "1.5px solid rgba(232,255,71,0.18)" }}
            >
              <CalendarClock className="size-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-0.5">No upcoming tasks at the moment.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {data.map((task) => {
              const pMeta   = PRIORITY_META[task.priority ?? "Low"] ?? PRIORITY_META.Low;
              const dueBadge = getDueBadge(task.dueDate);
              const isDone  = task.status === "Done";

              return (
                <Link
                  key={task._id}
                  to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-muted/40"
                >
                  {/* status icon */}
                  <span className="shrink-0">
                    {isDone
                      ? <CheckCircle2 className="size-4 text-emerald-500" />
                      : <Circle       className="size-4 text-muted-foreground" />
                    }
                  </span>

                  {/* title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate transition-colors",
                      isDone ? "line-through text-muted-foreground" : "group-hover:text-foreground"
                    )}>
                      {task.title}
                    </p>

                    {/* due date row */}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className={cn("size-2.5 shrink-0", dueBadge ? dueBadge.cls : "text-muted-foreground")} />
                        <span className={cn("text-[10px] font-medium", dueBadge ? dueBadge.cls : "text-muted-foreground")}>
                          {dueBadge ? `${dueBadge.label} · ` : ""}
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* priority badge */}
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${pMeta.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${pMeta.dot}`} />
                    {task.priority}
                  </span>

                  {/* arrow */}
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};