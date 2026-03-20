"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return trimmed.startsWith("/")
    ? `${IMAGE_BASE}${trimmed}`
    : `${IMAGE_BASE}/${trimmed}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomImageByRoomId, setRoomImageByRoomId] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId") || localStorage.getItem("user_id");
      if (!userId) {
        setBookings([]);
        setLoading(false);
        return;
      }
      try {
        const data = await getUserBookings(userId);
        setBookings(
          Array.isArray(data) ? data : (data?.bookings ?? data ?? []),
        );
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // When bookings have no image from API, fetch room by roomId to get image
  useEffect(() => {
    if (!bookings.length) return;
    const ids = [
      ...new Set(
        bookings
          .filter((b) => !getBookingRoomImage(b))
          .map((b) =>
            (b.roomId ?? b.roomResponse?.id ?? b.room?.id)?.toString(),
          )
          .filter(Boolean),
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
      }),
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
        const roomIdStr = (
          b.roomId ??
          b.roomResponse?.id ??
          b.room?.id
        )?.toString();
        const roomImage =
          getBookingRoomImage(b) ||
          (roomIdStr ? roomImageByRoomId[roomIdStr] : null);
        // const confirmationCode = b.confirmationCode || `RN-${b.id}`; // unused

        return (
          <article
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Thumbnail (smaller) */}
              <div className="relative w-30 h-30 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                {roomImage ? (
                  <Image
                    src={roomImage}
                    alt={roomName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <Bed className="w-7 h-7" />
                  </div>
                )}

                {/* Status pill (small) */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusConfig.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Main content */}
              <div className="min-w-0 flex-1">
                {/* Top row: name + price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {roomName}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-4 h-4" />
                      Room #{b.roomResponse?.id ?? b.roomId ?? "—"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-slate-900">
                      ${Number(b.amount ?? 0).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>

                {/* Middle row: checkin/checkout/guests (compact) */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(b.checkin)} - {formatDate(b.checkout)}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {b.numOfAdults ?? 1} adult{b.numOfAdults !== 1 ? "s" : ""}
                    {b.numOfChildren > 0
                      ? `, ${b.numOfChildren} child${b.numOfChildren !== 1 ? "ren" : ""}`
                      : ""}
                  </span>
                </div>

                {/* Services (kept, but compact) */}
                {b.bookingServices && b.bookingServices.length > 0 && (
                  <div className="mt-2 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {b.bookingServices.slice(0, 3).map((s: { id: React.Key; serviceResponse?: { serviceName?: string }; quantity?: number }) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] text-slate-700"
                        >
                          {s.serviceResponse?.serviceName ?? "Service"} ×
                          {s.quantity ?? 1}
                        </span>
                      ))}
                      {b.bookingServices.length > 3 && (
                        <span className="text-[11px] text-slate-500">
                          +{b.bookingServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom row: View Details (like screenshot) */}
                <div className="mt-3 flex justify-end">
                  <Link
                    href={`/booking/${b.id}`} // set this to your real details page
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
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
