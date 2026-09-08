import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function LeadRow({ lead }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      {/* Lead */}
      <td className="px-5 py-4">
        <Link
          href={`/leads/${lead.id}`}
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
            {lead.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
              {lead.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {lead.email}
            </p>
          </div>
        </Link>
      </td>

      {/* Phone */}
      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
        {lead.phone || "—"}
      </td>

      {/* Company */}
      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
        {lead.company}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-5 py-4">
        <StatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
        {lead.source}
      </td>

      {/* Created */}
      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
        {formatDate(lead.createdAt)}
      </td>

      {/* Action */}
      <td className="px-5 py-4 text-right">
        <Link
          href={`/leads/${lead.id}`}
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          View
        </Link>
      </td>
    </tr>
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