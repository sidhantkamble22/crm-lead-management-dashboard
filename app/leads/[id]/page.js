"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft, LuX } from "react-icons/lu";

import LeadDetails from "@/components/leads/LeadDetails";
import LeadForm from "@/components/leads/LeadForm";
import ActivityTimeline from "@/components/leads/ActivityTimeline";
import DeleteLeadModal from "@/components/leads/DeleteLeadModal";
import Toast from "@/components/dashboard/Toast";

export default function LeadDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

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

  // Fetch lead
  async function fetchLead() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/leads/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Lead not found."
        );
      }

      setLead(data);
    } catch (error) {
      console.error("Fetch lead error:", error);
      setError("Unable to load this lead.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  // Change status
  async function handleStatusChange(event) {
    const newStatus = event.target.value;

    if (!lead || newStatus === lead.status) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update status."
        );
      }

      setLead(result.lead);

      showToast(
        "Lead status updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Status update error:", error);

      showToast(
        error.message || "Failed to update lead status.",
        "error"
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  // Edit lead
  async function handleEditSubmit(formData) {
    try {
      setSaving(true);

      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update lead."
        );
      }

      setLead(result.lead);
      setIsEditOpen(false);

      showToast(
        "Lead updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Edit lead error:", error);

      showToast(
        error.message ||
          "Failed to update lead. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete lead
  async function handleDelete() {
    try {
      setDeleting(true);

      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete lead."
        );
      }

      showToast(
        "Lead deleted successfully.",
        "success"
      );

      setIsDeleteOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Delete lead error:", error);

      showToast(
        error.message ||
          "Failed to delete lead. Please try again.",
        "error"
      );

      setDeleting(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading lead...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !lead) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-red-700">
              Lead Not Found
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error || "This lead does not exist."}
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <LuArrowLeft size={17} />

            Back to Leads
          </Link>
        </div>

        {/* Lead Details */}
        <LeadDetails
          lead={lead}
          onStatusChange={handleStatusChange}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
          updating={updatingStatus}
        />

        {/* Activity Timeline */}
        <div className="mt-5">
          <ActivityTimeline
            activities={lead.activities || []}
          />
        </div>
      </main>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Lead
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update lead information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditOpen(false)
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close edit modal"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">
              <LeadForm
                lead={lead}
                onSubmit={handleEditSubmit}
                onCancel={() =>
                  setIsEditOpen(false)
                }
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteLeadModal
        isOpen={isDeleteOpen}
        lead={lead}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      {/* Toast */}
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