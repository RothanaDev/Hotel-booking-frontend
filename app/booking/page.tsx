import React from "react";
import HistoryClient from "@/components/Booking/HistoryClient";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-[var(--font-heading)] tracking-tight">
            My Bookings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage your reservations
          </p>
        </header>
        <HistoryClient />
      </div>
    </div>
  );
}
