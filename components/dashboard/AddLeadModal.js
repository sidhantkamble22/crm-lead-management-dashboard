"use client";

import { useState } from "react";
import { LuX, LuPlus } from "react-icons/lu";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "New",
  source: "Website",
};

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

const SOURCE_OPTIONS = [
  "Website",
  "LinkedIn",
  "Referral",
  "Google",
  "Other",
];

export default function AddLeadModal({
  isOpen,
  onClose,
  onLeadAdded,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error when user starts editing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (serverError) {
      setServerError("");
    }
  }

  function validateForm() {
    const newErrors = {};

    const name = form.name.trim();
    const company = form.company.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 2) {
      newErrors.name =
        "Name must be at least 2 characters.";
    }

    if (!company) {
      newErrors.company =
        "Company is required.";
    } else if (company.length < 2) {
      newErrors.company =
        "Company must be at least 2 characters.";
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (
      phone &&
      !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone)
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian phone number.";
    }

    if (!form.status) {
      newErrors.status =
        "Status is required.";
    }

    if (!form.source) {
      newErrors.source =
        "Source is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          status: form.status,
          source: form.source,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }

        setServerError(
          result.message ||
            "Failed to create lead."
        );

        return;
      }

      // New API response:
      // {
      //   success: true,
      //   message: "...",
      //   lead: {...}
      // }

      if (result.success && result.lead) {
        setForm(INITIAL_FORM);
        setErrors({});
        setServerError("");

        if (onLeadAdded) {
          await onLeadAdded(result.lead);
        }

        onClose();
      }
    } catch (error) {
      console.error(
        "Add lead error:",
        error
      );

      setServerError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;

    setForm(INITIAL_FORM);
    setErrors({});
    setServerError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Lead
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new lead to your CRM.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-5 px-5 py-5 sm:px-6">
            {/* Server Error */}
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {serverError}
                </p>
              </div>
            )}

            {/* Name + Company */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                error={errors.name}
              />

              <FormField
                label="Company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Tech Solutions"
                required
                error={errors.company}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@gmail.com"
                error={errors.email}
              />

              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                error={errors.phone}
              />
            </div>

            {/* Status + Source */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
                required
                error={errors.status}
              />

              <SelectField
                label="Source"
                name="source"
                value={form.source}
                onChange={handleChange}
                options={SOURCE_OPTIONS}
                required
                error={errors.source}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <LuPlus size={17} />
                  Add Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -----------------------------
   Reusable Input
------------------------------ */

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full rounded-lg border bg-white px-3 py-2.5
          text-sm text-slate-700 outline-none transition
          placeholder:text-slate-400
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }
        `}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* -----------------------------
   Reusable Select
------------------------------ */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error = "",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full rounded-lg border bg-white px-3 py-2.5
          text-sm text-slate-700 outline-none transition
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }
        `}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}