import {
  LuUsers,
  LuPlus,
  LuPhoneCall,
  LuBadgeCheck,
  LuCircleCheck,
  LuCircleX,
  LuPercent,
} from "react-icons/lu";

import StatCard from "./StatCard";

export default function StatsGrid({ leads = [] }) {
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  const conversionPercentage =
    totalLeads > 0
      ? ((convertedLeads / totalLeads) * 100).toFixed(1)
      : "0.0";

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      description: "All leads",
      icon: LuUsers,
      iconClass: "bg-indigo-50 text-indigo-600",
    },

    {
      title: "New",
      value: newLeads,
      description: "New leads",
      icon: LuPlus,
      iconClass: "bg-blue-50 text-blue-600",
    },

    {
      title: "Contacted",
      value: contactedLeads,
      description: "Leads contacted",
      icon: LuPhoneCall,
      iconClass: "bg-amber-50 text-amber-600",
    },

    {
      title: "Qualified",
      value: qualifiedLeads,
      description: "Qualified leads",
      icon: LuBadgeCheck,
      iconClass: "bg-violet-50 text-violet-600",
    },

    {
      title: "Converted",
      value: convertedLeads,
      description: "Successful conversions",
      icon: LuCircleCheck,
      iconClass: "bg-emerald-50 text-emerald-600",
    },

    {
      title: "Lost",
      value: lostLeads,
      description: "Lost leads",
      icon: LuCircleX,
      iconClass: "bg-red-50 text-red-600",
    },

    {
      title: "Conversion Rate",
      value: `${conversionPercentage}%`,
      description: "Overall conversion",
      icon: LuPercent,
      iconClass: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={<Icon size={20} strokeWidth={2} />}
            iconClass={stat.iconClass}
          />
        );
      })}
    </section>
  );
}