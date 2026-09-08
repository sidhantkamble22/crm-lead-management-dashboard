"use client";

import { LuMenu, LuPlus } from "react-icons/lu";

export default function Header({
  onAddLead,
  onMenuClick,
}) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <LuMenu size={21} />
        </button>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Lead Dashboard
          </h1>
        </div>
      </div>

      {/* Add Lead */}
      <button
        type="button"
        onClick={onAddLead}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-4"
      >
        <LuPlus
          size={18}
          strokeWidth={2.5}
        />

        <span className="hidden sm:inline">
          Add Lead
        </span>
      </button>
    </header>
  );
}