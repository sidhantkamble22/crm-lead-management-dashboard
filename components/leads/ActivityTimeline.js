"use client";

import {
  LuActivity,
  LuCheck,
  LuClock3,
  LuPlus,
  LuRefreshCw,
} from "react-icons/lu";

export default function ActivityTimeline({
  activities = [],
}) {
  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LuActivity size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Activity Timeline
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Recent activity for this lead
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          {activities.length}{" "}
          {activities.length === 1
            ? "activity"
            : "activities"}
        </span>
      </div>

      {/* Timeline */}
      <div className="p-5 sm:p-6">
        {sortedActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <LuClock3 size={20} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No activity yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Activity will appear here as this lead
              is updated.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-5 left-[17px] top-5 w-px bg-slate-200" />

            <div className="space-y-7">
              {sortedActivities.map(
                (activity, index) => (
                  <TimelineItem
                    key={activity.id || index}
                    activity={activity}
                    isLatest={index === 0}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineItem({
  activity,
  isLatest,
}) {
  const isCreated =
    activity.title === "Lead Created";

  const Icon = isCreated
    ? LuPlus
    : activity.title === "Status Changed"
      ? LuRefreshCw
      : LuCheck;

  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div
        className={`
          relative z-10 flex h-9 w-9 shrink-0
          items-center justify-center rounded-full
          border-4 border-white
          ${
            isLatest
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        <Icon size={14} strokeWidth={2.5} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            {activity.title}
          </h3>

          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <LuClock3 size={12} />
            {formatDateTime(activity.createdAt)}
          </span>
        </div>

        {activity.description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {activity.description}
          </p>
        )}
      </div>
    </div>
  );
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
}