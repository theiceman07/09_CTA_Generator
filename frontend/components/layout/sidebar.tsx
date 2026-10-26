"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  LayoutDashboard,
  FolderKanban,
  Wand2,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Layers,
  Repeat,
  Video,
  Compass,
  Workflow,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_REGISTRY,
  getApplicationsByCategory,
  ApplicationMetadata,
} from "@/lib/registry";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Tools", href: "/tools/content-repurposer", icon: Wand2 },
  { label: "Content", href: "/projects", icon: FileText },
  { label: "Settings", href: "#settings", icon: Settings },
];

const CATEGORY_ORDER = [
  "Content Creation",
  "Repurposing & Optimization",
  "Audio & Video Media",
  "Research & Strategy",
  "Workflows & Autonomous Pipelines",
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Content Creation": Sparkles,
  "Repurposing & Optimization": Repeat,
  "Audio & Video Media": Video,
  "Research & Strategy": Compass,
  "Workflows & Autonomous Pipelines": Workflow,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const groupedApps = getApplicationsByCategory();

  const allCategories = Array.from(new Set(APPLICATION_REGISTRY.map((app) => app.category)));
  const sortedCategories = allCategories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const isRouteActive = (app: ApplicationMetadata) => {
    if (!pathname) return false;
    if (pathname === app.route) return true;
    if (pathname.startsWith(`${app.route}/`)) return true;
    if (app.id === "creator-workspace" && (pathname === "/workspace" || pathname.startsWith("/workspace/"))) {
      return true;
    }
    if (app.id === "creator-research-assistant" && (pathname === "/tools/creator-research" || pathname.startsWith("/tools/creator-research/"))) {
      return true;
    }
    return false;
  };

  return (
    <aside className="w-64 bg-[#0c1222] border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent block leading-tight">
            Creator AI
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400/80">
            SaaS Suite
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Platform Suite ({APPLICATION_REGISTRY.length})</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20">
            Live
          </span>
        </div>

        <div className="space-y-3 pb-4">
          {sortedCategories.map((category) => {
            const apps = groupedApps[category] || [];
            const CategoryIcon = CATEGORY_ICONS[category] || Layers;
            const hasActiveChild = apps.some((app) => isRouteActive(app));
            const isCollapsed = Boolean(collapsedCategories[category]) && !hasActiveChild;

            return (
              <div
                key={category}
                className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full px-3 py-2 text-[10.5px] font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider flex items-center justify-between transition-colors bg-slate-900/80 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <CategoryIcon className="w-3.5 h-3.5 text-indigo-400/80 shrink-0" />
                    <span className="truncate">{category}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] text-slate-500 font-mono font-medium bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/60">
                      {apps.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 text-slate-500 transition-transform duration-200",
                        isCollapsed ? "-rotate-90" : "rotate-0"
                      )}
                    />
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="p-1.5 space-y-0.5 border-t border-slate-800/60">
                    {apps.map((app) => {
                      const isAppActive = isRouteActive(app);
                      return (
                        <Link
                          key={app.id}
                          href={app.route}
                          className={cn(
                            "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group",
                            isAppActive
                              ? "bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                                isAppActive
                                  ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                                  : "bg-emerald-400/60 group-hover:bg-emerald-400"
                              )}
                            />
                            <span className="truncate">{app.name}</span>
                          </span>
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded border shrink-0 font-medium ml-1.5 transition-colors",
                              isAppActive
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20 group-hover:text-emerald-300"
                            )}
                          >
                            Live
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090e1a]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || "Creator"}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
