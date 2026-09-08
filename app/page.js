"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsGrid from "@/components/dashboard/StatsGrid";
import Analytics from "@/components/dashboard/Analytics";
import LeadToolbar from "@/components/dashboard/LeadToolbar";
import LeadTable from "@/components/dashboard/LeadTable";
import Pagination from "@/components/dashboard/Pagination";
import AddLeadModal from "@/components/dashboard/AddLeadModal";
import Toast from "@/components/dashboard/Toast";

const LEADS_PER_PAGE = 5;

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);


    const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
  useState(false);


  const [toast, setToast] = useState({
  message: "",
  type: "success",
});

  // Fetch Leads
  async function fetchLeads() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/leads", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();

      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load leads. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter + Search + Sort
  const filteredLeads = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    const result = leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.name
          ?.toLowerCase()
          .includes(searchValue) ||
        lead.email
          ?.toLowerCase()
          .includes(searchValue) ||
        lead.company
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" ||
        lead.source === sourceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSource
      );
    });

    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [
    leads,
    search,
    statusFilter,
    sourceFilter,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredLeads.length / LEADS_PER_PAGE
  );

  const paginatedLeads = useMemo(() => {
    const startIndex =
      (currentPage - 1) * LEADS_PER_PAGE;

    return filteredLeads.slice(
      startIndex,
      startIndex + LEADS_PER_PAGE
    );
  }, [filteredLeads, currentPage]);

  // Keep page valid after filtering
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handlePageChange(page) {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function showToast(message, type = "success") {
  setToast({
    message,
    type,
  });

  setTimeout(() => {
    setToast({
      message: "",
      type: "success",
    });
  }, 3500);
}

async function handleLeadAdded() {
  await fetchLeads();
  setCurrentPage(1);

  showToast(
    "Lead added successfully.",
    "success"
  );
}

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
  isMobileOpen={isMobileSidebarOpen}
  onClose={() => setIsMobileSidebarOpen(false)}
/>

        {/* Main */}
        <div className="min-w-0 flex-1">
        <Header
  onAddLead={() => setIsAddModalOpen(true)}
  onMenuClick={() => setIsMobileSidebarOpen(true)}
/>

          <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Page Intro */}
            <div className="mb-6">
              <p className="text-sm text-slate-500">
                Welcome back. Here's what's happening
                with your leads.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <StatsGrid leads={leads} />
            </div>

            {/* Analytics */}
            <Analytics leads={leads} />

            {/* Leads Section */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Lead Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and manage your CRM
                  leads.
                </p>
              </div>

              {/* Toolbar */}
              <LeadToolbar
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              {/* Table */}
              <LeadTable
                leads={paginatedLeads}
                loading={loading}
                error={error}
              />

              {/* Pagination */}
              {!loading &&
                !error &&
                filteredLeads.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={
                        handlePageChange
                      }
                    />
                  </div>
                )}

              {/* Result count */}
              {!loading &&
                !error &&
                filteredLeads.length > 0 && (
                  <div className="mt-3 text-center text-xs text-slate-400">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) *
                        LEADS_PER_PAGE +
                        1,
                      filteredLeads.length
                    )}{" "}
                    -{" "}
                    {Math.min(
                      currentPage *
                        LEADS_PER_PAGE,
                      filteredLeads.length
                    )}{" "}
                    of {filteredLeads.length} leads
                  </div>
                )}
            </section>
          </main>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onLeadAdded={handleLeadAdded}
      />

      <Toast
  message={toast.message}
  type={toast.type}
  onClose={() =>
    setToast({
      message: "",
      type: "success",
    })
  }
/>
    </div>
  );
}