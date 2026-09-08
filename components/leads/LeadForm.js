"use client";

import { useEffect, useState } from "react";
import { LuSave, LuX } from "react-icons/lu";

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

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "New",
  source: "Website",
};

export default function LeadForm({
  lead = null,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const isEditMode = Boolean(lead);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status || "New",
        source: lead.source || "Website",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
    setServerError("");
  }, [lead]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-level error
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    // Clear general server error
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

    // Name
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 2) {
      newErrors.name =
        "Name must be at least 2 characters.";
    } else if (name.length > 100) {
      newErrors.name =
        "Name must not exceed 100 characters.";
    }

    // Company
    if (!company) {
      newErrors.company =
        "Company is required.";
    } else if (company.length < 2) {
      newErrors.company =
        "Company must be at least 2 characters.";
    } else if (company.length > 100) {
      newErrors.company =
        "Company must not exceed 100 characters.";
    }

    // Email
    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (email.length > 150) {
      newErrors.email =
        "Email must not exceed 150 characters.";
    }

    // Phone
    if (
      phone &&
      !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone)
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian phone number.";
    }

    // Status
    if (!STATUS_OPTIONS.includes(form.status)) {
      newErrors.status =
        "Please select a valid status.";
    }

    // Source
    if (!SOURCE_OPTIONS.includes(form.source)) {
      newErrors.source =
        "Please select a valid source.";
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

    const formData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      status: form.status,
      source: form.source,
    };

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Lead form submit error:", error);

      setServerError(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
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
        <InputField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Rahul Sharma"
          required
          error={errors.name}
          disabled={saving}
        />

        <InputField
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Tech Solutions"
          required
          error={errors.company}
          disabled={saving}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="rahul@gmail.com"
          error={errors.email}
          disabled={saving}
        />

        <InputField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 9876543210"
          error={errors.phone}
          disabled={saving}
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
          disabled={saving}
        />

        <SelectField
          label="Source"
          name="source"
          value={form.source}
          onChange={handleChange}
          options={SOURCE_OPTIONS}
          required
          error={errors.source}
          disabled={saving}
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuX size={16} />
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
              <LuSave size={16} />
              {isEditMode ? "Update Lead" : "Save Lead"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* =========================================
   Input Field
========================================= */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  disabled = false,
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
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-white px-3 py-2.5
          text-sm text-slate-700 outline-none transition
          placeholder:text-slate-400
          disabled:cursor-not-allowed disabled:bg-slate-50
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          }
        `}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================
   Select Field
========================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error = "",
  disabled = false,
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
        disabled={disabled}
        className={`
          w-full rounded-lg border bg-white px-3 py-2.5
          text-sm text-slate-700 outline-none transition
          disabled:cursor-not-allowed disabled:bg-slate-50
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
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}