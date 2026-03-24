import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import { useTheme } from "@/provider/theme-provider";
import type { Workspace } from "@/types";
import {
  Archive,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

const navItems = [
  { title: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { title: "Workspaces", href: "/workspaces",  icon: Users           },
  { title: "My Tasks",   href: "/my-tasks",    icon: ListChecks      },
  { title: "Members",    href: "/members",     icon: Users           },
  { title: "Archived",   href: "/achieved",    icon: Archive         },
  { title: "Settings",   href: "/settings",    icon: Settings        },
];

/* ─── Shared sidebar inner content ─────────────────────── */
const SidebarContent = ({
  isCollapsed,
  setIsCollapsed,
  currentWorkspace,
  onNavClick,
}: {
  isCollapsed: boolean;
  setIsCollapsed?: (v: boolean) => void;
  currentWorkspace: Workspace | null;
  onNavClick?: () => void;
}) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo row ── */}
      <div className="flex h-14 items-center border-b px-3 gap-2 shrink-0">
        <Link
          to="/dashboard"
          onClick={onNavClick}
          className={cn(
            "flex items-center flex-1 min-w-0 overflow-hidden",
            isCollapsed ? "justify-center" : "gap-2"
          )}
        >
          {isCollapsed ? (
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: "#e8ff47" }} />
          ) : (
            <span className="tn-logo-text dark:text-[#f5f4ef]! truncate">
              TaskNest<span className="tn-logo-dot" />
            </span>
          )}
        </Link>

        {/* Collapse toggle — desktop only */}
        {setIsCollapsed && (
          <button
            className="tn-collapse-btn shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed
              ? <ChevronsRight className="size-3.5" />
              : <ChevronsLeft  className="size-3.5" />}
          </button>
        )}

        {/* Close button — mobile drawer only */}
        {onNavClick && !setIsCollapsed && (
          <button
            className="tn-collapse-btn shrink-0"
            onClick={onNavClick}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Nav items ── */}
      <ScrollArea className="flex-1 px-2 py-3">
        {!isCollapsed && currentWorkspace && (
          <div className="mb-3 px-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
               style={{ letterSpacing: "0.12em" }}>
              Workspace
            </p>
            <p className="text-xs font-semibold truncate text-foreground mt-0.5">
              {currentWorkspace.name}
            </p>
          </div>
        )}
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          currentWorkspace={currentWorkspace}
          onItemClick={onNavClick}
        />
      </ScrollArea>

      {/* ── Bottom actions ── */}
      <div className="px-2 py-3 border-t space-y-0.5 shrink-0">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          className={cn("tn-sidebar-action w-full", isCollapsed && "justify-center px-0")}
        >
          {theme === "dark"
            ? <Sun  className="size-4 shrink-0" />
            : <Moon className="size-4 shrink-0" />}
          {!isCollapsed && (
            <span className="text-sm truncate">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          title="Sign out"
          className={cn("tn-sidebar-action danger w-full", isCollapsed && "justify-center px-0")}
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm truncate">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

/* ─── Main export ───────────────────────────────────────── */
export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const [isCollapsed,    setIsCollapsed]    = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div
        className={cn(
          "hidden md:flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          isCollapsed ? "w-15" : "w-60"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          currentWorkspace={currentWorkspace}
        />
      </div>

      {/* ── Mobile: hamburger button (shown in top-left) ── */}
      <button
        className="md:hidden fixed top-3.5 left-3 z-50 flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-4" />
      </button>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: drawer ── */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          isCollapsed={false}
          currentWorkspace={currentWorkspace}
          onNavClick={() => setMobileOpen(false)}
        />
      </div>
    </>
  );
};