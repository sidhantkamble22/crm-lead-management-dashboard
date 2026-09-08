export default function StatusBadge({ status }) {
  const statusStyles = {
    New: "bg-blue-50 text-blue-700 ring-blue-600/10",
    Contacted: "bg-amber-50 text-amber-700 ring-amber-600/10",
    Qualified: "bg-violet-50 text-violet-700 ring-violet-600/10",
    Converted: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    Lost: "bg-red-50 text-red-700 ring-red-600/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status] ||
        "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}