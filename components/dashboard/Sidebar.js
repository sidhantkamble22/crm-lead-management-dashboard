"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  LuLayoutDashboard,
  LuUsers,
  LuChartBar,
  LuSettings,
  LuLogOut,
  LuX,
} from "react-icons/lu";

export default function Sidebar({
  isMobileOpen = false,
  onClose,
}) {
  const pathname = usePathname();

  const [activeHash, setActiveHash] = useState(
    "#dashboard"
  );

  useEffect(() => {
    function updateActiveHash() {
      const hash = window.location.hash;

      if (hash === "#leads") {
        setActiveHash("#leads");
      } else if (hash === "#analytics") {
        setActiveHash("#analytics");
      } else {
        setActiveHash("#dashboard");
      }
    }

    updateActiveHash();

    window.addEventListener(
      "hashchange",
      updateActiveHash
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        updateActiveHash
      );
    };
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/#dashboard",
      icon: LuLayoutDashboard,
      active:
        pathname === "/" &&
        activeHash === "#dashboard",
    },
    {
      name: "Leads",
      href: "/#leads",
      icon: LuUsers,
      active:
        pathname.startsWith("/leads") ||
        (pathname === "/" &&
          activeHash === "#leads"),
    },
    {
      name: "Analytics",
      href: "/#analytics",
      icon: LuChartBar,
      active:
        pathname === "/" &&
        activeHash === "#analytics",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-slate-950 text-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:min-h-screen lg:translate-x-0
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Lead
              <span className="text-indigo-400">
                Flow
              </span>
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              CRM Management
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition
                    ${
                      item.active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-md
                      transition
                      ${
                        item.active
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                    />
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User / Settings */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-900 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
              SK
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                Admin
              </p>

              <p className="truncate text-xs text-slate-500">
                CRM Administrator
              </p>
            </div>
          </div>

          {/* Settings */}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <LuSettings size={17} />

            <span>Settings</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-red-400"
          >
            <LuLogOut size={17} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}