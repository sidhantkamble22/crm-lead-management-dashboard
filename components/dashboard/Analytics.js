"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statusColors = {
  New: "#3B82F6",
  Contacted: "#F59E0B",
  Qualified: "#8B5CF6",
  Converted: "#10B981",
  Lost: "#EF4444",
};

const sourceColors = [
  "#4F46E5",
  "#0EA5E9",
  "#8B5CF6",
  "#10B981",
];

export default function Analytics({ leads = [] }) {
  const statusData = [
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Lost",
  ].map((status) => ({
    name: status,
    leads: leads.filter(
      (lead) => lead.status === status
    ).length,
  }));

  const sourceNames = [
    "Website",
    "LinkedIn",
    "Referral",
    "Google",
  ];

  const sourceData = sourceNames.map((source) => ({
    name: source,
    value: leads.filter(
      (lead) => lead.source === source
    ).length,
  }));

  const last7DaysData = getLast7Days(leads);

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your lead performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Status Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Leads by Status
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Current distribution of leads
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={statusData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "#F8FAFC",
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="leads"
                  radius={[6, 6, 0, 0]}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        statusColors[entry.name]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Leads by Source
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Where your leads are coming from
            </p>
          </div>

          <div className="flex h-64 flex-col items-center justify-center sm:flex-row">
            <ResponsiveContainer
              width="55%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {sourceData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          sourceColors[
                            index %
                              sourceColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {sourceData.map(
                (source, index) => (
                  <div
                    key={source.name}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          sourceColors[
                            index %
                              sourceColors.length
                          ],
                      }}
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        {source.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {source.value} leads
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Leads Created — Last 7 Days
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Daily lead creation activity
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={last7DaysData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "#F8FAFC",
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="leads"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function getLast7Days(leads) {
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const dateString = `${year}-${month}-${day}`;

    const count = leads.filter((lead) =>
      lead.createdAt?.startsWith(dateString)
    ).length;

    result.push({
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      leads: count,
    });
  }

  return result;
}