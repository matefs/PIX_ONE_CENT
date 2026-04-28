"use client";

import dynamic from "next/dynamic";

const ValidateClient = dynamic(() => import("./ValidateClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-woovi-dark" />
    </div>
  ),
});

export default function ValidatePage() {
  return <ValidateClient />;
}