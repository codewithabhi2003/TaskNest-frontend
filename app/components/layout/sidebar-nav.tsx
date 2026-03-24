import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import type { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
  className?: string;
  onItemClick?: () => void; // ✅ ADDED
}

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  onItemClick, // ✅ ADDED
}: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    if (href === "/workspaces") {
      navigate(href);
    } else if (currentWorkspace?._id) {
      navigate(`${href}?workspaceId=${currentWorkspace._id}`);
    } else {
      navigate(href);
    }

    // ✅ CALL THIS AFTER NAVIGATION (for mobile close)
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className={cn("flex flex-col gap-y-0.5", className)}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href;

        return (
          <button
            key={el.href}
            onClick={() => handleClick(el.href)}
            title={isCollapsed ? el.title : undefined}
            className={cn(
              "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-[9px] text-sm font-medium transition-colors duration-150 text-left border border-transparent",
              isCollapsed && "justify-center px-0",
              !isActive && "text-sidebar-foreground hover:bg-sidebar-accent",
              isActive &&
                "bg-[rgba(232,255,71,0.1)] text-[#0d0f14] font-semibold dark:bg-[rgba(232,255,71,0.1)] dark:text-[#e8ff47]"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                isActive
                  ? "text-[#0d0f14] dark:text-[#e8ff47]"
                  : "text-muted-foreground"
              )}
            />

            {isCollapsed ? (
              <span className="sr-only">{el.title}</span>
            ) : (
              <span className="truncate">{el.title}</span>
            )}

            {isActive && !isCollapsed && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e8ff47] shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
};