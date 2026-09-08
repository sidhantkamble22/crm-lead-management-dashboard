"use client";

import {
  LuCheck,
  LuCircle,
  LuInfo,
  LuX,
} from "react-icons/lu";

export default function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  const config = {
    success: {
      icon: LuCheck,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    error: {
      icon: LuCircle,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },

    info: {
      icon: LuInfo,
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
  };

  const current =
    config[type] || config.success;

  const Icon = current.icon;

  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${current.className}`}
        role="alert"
      >
        {/* Icon */}
        <div className="mt-0.5 flex shrink-0 items-center justify-center">
          <Icon size={20} strokeWidth={2} />
        </div>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Close notification"
        >
          <LuX size={17} />
        </button>
      </div>
    </div>
  );
}