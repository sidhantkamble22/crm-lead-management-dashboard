"use client";

import {
  LuBuilding2,
  LuCalendarDays,
  LuCheck,
  LuChevronDown,
  LuMail,
  LuPencil,
  LuPhone,
  LuTrash2,
  LuUser,
} from "react-icons/lu";

import StatusBadge from "@/components/dashboard/StatusBadge";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

export default function LeadDetails({
  lead,
  onStatusChange,
  onEdit,
  onDelete,
  updating = false,
}) {
  const initials = lead?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Top accent */}
        <div className="h-1 bg-indigo-600" />

        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Profile */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600 ring-8 ring-indigo-50/60">
                {initials || "L"}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                    {lead.name}
                  </h1>

                  <StatusBadge status={lead.status} />
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <LuBuilding2 size={15} />
                    {lead.company}
                  </span>

                  <span className="hidden text-slate-300 sm:inline">
                    •
                  </span>

                  <span>
                    Lead ID: #{lead.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex-none"
              >
                <LuPencil size={16} />
                Edit Lead
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                aria-label="Delete lead"
              >
                <LuTrash2 size={16} />
                <span className="hidden sm:inline">
                  Delete
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Information */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Lead Information
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Contact and lead details
            </p>
          </div>
        </div>

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={LuMail}
            label="Email"
            value={lead.email || "Not provided"}
          />

          <InfoItem
            icon={LuPhone}
            label="Phone"
            value={lead.phone || "Not provided"}
          />

          <InfoItem
            icon={LuBuilding2}
            label="Company"
            value={lead.company || "Not provided"}
          />

          <InfoItem
            icon={LuCalendarDays}
            label="Created"
            value={formatDate(lead.createdAt)}
          />
        </div>
      </section>

      {/* Status Control */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <LuCheck size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Lead Status
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Update the current stage of this lead
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-52">
            <select
              value={lead.status}
              onChange={onStatusChange}
              disabled={updating}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <LuChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            {updating && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}