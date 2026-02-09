"use client";

import React, { useEffect, useState } from "react";
import { getUserBookings, getRoomById } from "@/lib/api";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Bed,
} from "lucide-react";

const IMAGE_BASE = "http://localhost:8080";

function resolveImageUrl(raw: string | undefined): string | null {
  if (!raw || typeof raw !== "string" || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return trimmed.startsWith("/") ? `${IMAGE_BASE}${trimmed}` : `${IMAGE_BASE}/${trimmed}`;
}

function getBookingRoomImage(b: any): string | null {
  const room = b.roomResponse ?? b.room;
  const roomType = room?.roomType;
  const candidates = [
    room?.image,
    room?.photo,
    room?.roomPhotoUrl,
    roomType?.image,
    roomType?.photo,
    roomType?.roomPhotoUrl,
    b.roomResponse?.image,
    b.roomResponse?.photo,
    b.roomResponse?.roomPhotoUrl,
  ].filter(Boolean);
  for (const c of candidates) {
    const url = resolveImageUrl(c);
    if (url) return url;
  }
  return null;
}

function getRoomImageFromRoom(room: any): string | null {
  if (!room) return null;
  const roomType = room?.roomType;
  const candidates = [
    room?.image,
    room?.photo,
    room?.roomPhotoUrl,
    roomType?.image,
    roomType?.photo,
    roomType?.roomPhotoUrl,
  ].filter(Boolean);
  for (const c of candidates) {
    const url = resolveImageUrl(c);
    if (url) return url;
  }
  return null;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getStatusConfig(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "cancelled" || s === "canceled")
    return {
      label: "Cancelled",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      Icon: XCircle,
    };
  if (s === "pending")
    return {
      label: "Pending",
      className: "bg-amber-50 text-amber-800 border-amber-200",
      Icon: Clock,
    };
  return {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Icon: CheckCircle2,
  };
}

export default function HistoryClient() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomImageByRoomId, setRoomImageByRoomId] = useState<Record<string, string>>({});

  useEffect(() => {
    const userId = Number(
      localStorage.getItem("userId") || localStorage.getItem("user_id") || 0
    );
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }
    getUserBookings(userId.toString())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : data?.bookings ?? data ?? []);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  // When bookings have no image from API, fetch room by roomId to get image
  useEffect(() => {
    if (!bookings.length) return;
    const ids = [
      ...new Set(
        bookings
          .filter((b) => !getBookingRoomImage(b))
          .map((b) => (b.roomId ?? b.roomResponse?.id ?? b.room?.id)?.toString())
          .filter(Boolean)
      ),
    ];
    if (ids.length === 0) return;
    Promise.all(
      ids.map(async (roomId) => {
        try {
          const room = await getRoomById(roomId);
          const url = getRoomImageFromRoom(room);
          return { roomId, url };
        } catch {
          return { roomId, url: null as string | null };
        }
      })
    ).then((results) => {
      setRoomImageByRoomId((prev) => {
        const next = { ...prev };
        results.forEach(({ roomId, url }) => {
          if (url) next[roomId] = url;
        });
        return next;
      });
    });
  }, [bookings]);

  if (loading)
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-80 h-52 sm:h-56 bg-slate-100" />
              <div className="flex-1 p-6 sm:p-8 space-y-4">
                <div className="h-6 w-2/3 bg-slate-100 rounded" />
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 bg-slate-100 rounded-lg" />
                  ))}
                </div>
                <div className="flex justify-between items-end pt-6">
                  <div className="h-8 w-24 bg-slate-100 rounded" />
                  <div className="h-10 w-32 bg-slate-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (!bookings || bookings.length === 0)
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-center py-16 px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2 font-[var(--font-heading)]">
          No reservations yet
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          When you book a room, it will show up here. Start by exploring our
          rooms and creating your first reservation.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Browse rooms
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );

  return (
    <div className="space-y-6 pb-8">
      {bookings.map((b) => {
        const statusConfig = getStatusConfig(b.status);
        const StatusIcon = statusConfig.Icon;
        const roomName =
          b.roomResponse?.roomType?.typeName ||
          b.room?.roomType?.typeName ||
          "Room";
        const roomIdStr = (b.roomId ?? b.roomResponse?.id ?? b.room?.id)?.toString();
        const roomImage =
          getBookingRoomImage(b) || (roomIdStr ? roomImageByRoomId[roomIdStr] : null);
        const confirmationCode = b.confirmationCode || `RN-${b.id}`;

        return (
          <article
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-80 h-52 sm:h-56 shrink-0 bg-slate-100 overflow-hidden">
                {roomImage ? (
                  <img
                    src={roomImage}
                    alt={roomName}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                    <Bed className="w-12 h-12 mb-2" />
                    <span className="text-xs font-medium text-slate-400">
                      {roomName}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusConfig.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-w-0 p-5 sm:p-6 lg:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 font-[var(--font-heading)]">
                      {roomName}
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Room #{b.roomResponse?.id ?? b.roomId ?? "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                      Confirmation
                    </p>
                    <p className="text-sm font-mono font-semibold text-slate-800">
                      {confirmationCode}
                    </p>
                  </div>
                </div>

                {/* Dates & guests */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 py-4 border-y border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Check-in
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(b.checkin)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Check-out
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(b.checkout)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Guests
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {b.numOfAdults ?? 1} adult{b.numOfAdults !== 1 ? "s" : ""}
                        {b.numOfChildren > 0
                          ? `, ${b.numOfChildren} child${b.numOfChildren !== 1 ? "ren" : ""}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {b.bookingServices && b.bookingServices.length > 0 && (
                  <div className="pt-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Add-ons
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {b.bookingServices.map((s: any) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                        >
                          {s.serviceResponse?.serviceName ?? "Service"} ×
                          {s.quantity ?? 1}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & CTA */}
                <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">
                      Total amount
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 font-[var(--font-heading)]">
                      ${Number(b.amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Browse rooms
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
