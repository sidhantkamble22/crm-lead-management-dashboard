import LeadRow from "./LeadRow";
import StatusBadge from "./StatusBadge";
import Link from "next/link";

export default function LeadTable({
  leads = [],
  loading = false,
  error = "",
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-80 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading leads...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-sm font-semibold text-red-700">
          Unable to load leads
        </h3>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <span className="text-lg">○</span>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No leads found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Try changing your search or filters to find
            more leads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            All Leads
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage and track your leads
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {leads.length} leads
        </span>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[950px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lead
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-slate-200 md:hidden">
        {leads.map((lead) => (
          <MobileLeadCard
            key={lead.id}
            lead={lead}
          />
        ))}
      </div>
    </div>
  );
}

function MobileLeadCard({ lead }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Lead info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
            {lead.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <Link
              href={`/leads/${lead.id}`}
              className="block truncate text-sm font-semibold text-slate-900 hover:text-indigo-600"
            >
              {lead.name}
            </Link>

            <p className="truncate text-xs text-slate-500">
              {lead.email || "No email"}
            </p>
          </div>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Company
          </p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {lead.company || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {lead.phone || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Source
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {lead.source || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Created
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDate(lead.createdAt)}
          </p>
        </div>
      </div>

      {/* View button */}
      <Link
        href={`/leads/${lead.id}`}
        className="mt-4 flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
      >
        View Lead
      </Link>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}