"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Tv, Wifi, Wind, X, Minus, Plus } from "lucide-react";
import { useCart } from "./CartContext";

type RoomSummary = {
  id: number;
  price: number;
  title?: string;
  image?: string;
};

export default function BookingModal({
  open,
  onClose,
  room,
}: {
  open: boolean;
  onClose: () => void;
  room: RoomSummary | null;
  services?: any[]; // keep prop compatibility (not used here)
}) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { addRoom } = useCart();

  // reset when open/room changes (so it feels clean)
  useEffect(() => {
    if (open) {
      setCheckin("");
      setCheckout("");
      setAdults(1);
      setChildren(0);
      setIsLoading(false);
    }
  }, [open, room?.id]);

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkin, checkout]);

  const total = useMemo(() => {
    if (!room) return 0;
    return nights > 0 ? room.price * nights : 0;
  }, [room, nights]);

  const canSubmit = !!room && nights > 0 && adults >= 1 && !isLoading;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const decAdults = () => setAdults((v) => clamp(v - 1, 1, 10));
  const incAdults = () => setAdults((v) => clamp(v + 1, 1, 10));
  const decKids = () => setChildren((v) => clamp(v - 1, 0, 10));
  const incKids = () => setChildren((v) => clamp(v + 1, 0, 10));

  const handleSubmit = async () => {
    if (!room) return;

    setIsLoading(true);

    const roomItem = {
      id: room.id,
      title: room.title,
      price: room.price,
      checkin,
      checkout,
      numOfAdults: adults,
      numOfChildren: children,
      services: [], // keep structure
      image: room.image,
    };

    addRoom(roomItem);
    onClose();
    setIsLoading(false);
  };

  if (!open || !room) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border overflow-hidden">
        {/* header */}
        <div className="px-5 py-4 flex items-start justify-between border-b bg-slate-50">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-slate-900 truncate">
              Book {room.title || "Room"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              <span className="font-bold text-slate-900">${room.price}</span>
              <span className="text-slate-400"> / night</span>
            </p>

            <div className="flex items-center gap-3 mt-2 text-slate-500">
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Tv size={14} className="text-blue-600" /> TV
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Wifi size={14} className="text-blue-600" /> WiFi
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Wind size={14} className="text-blue-600" /> AC
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-200 text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* content */}
        <div className="p-5">
          {/* dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Check-in
              </label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => {
                  setCheckin(e.target.value);
                  // if checkout is before checkin, clear it
                  if (checkout && new Date(e.target.value) >= new Date(checkout)) {
                    setCheckout("");
                  }
                }}
                className="mt-1 w-full h-11 rounded-xl border px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Check-out
              </label>
              <input
                type="date"
                value={checkout}
                min={checkin || undefined}
                onChange={(e) => setCheckout(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
              />
            </div>
          </div>

          {/* guests */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border p-3">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Adults
              </p>
              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={decAdults}
                  className="h-9 w-9 rounded-lg border hover:bg-slate-50 grid place-items-center"
                  aria-label="Decrease adults"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base font-black text-slate-900">{adults}</span>
                <button
                  onClick={incAdults}
                  className="h-9 w-9 rounded-lg border hover:bg-slate-50 grid place-items-center"
                  aria-label="Increase adults"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="rounded-xl border p-3">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Children
              </p>
              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={decKids}
                  className="h-9 w-9 rounded-lg border hover:bg-slate-50 grid place-items-center"
                  aria-label="Decrease children"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base font-black text-slate-900">{children}</span>
                <button
                  onClick={incKids}
                  className="h-9 w-9 rounded-lg border hover:bg-slate-50 grid place-items-center"
                  aria-label="Increase children"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* summary */}
          <div className="mt-4 rounded-xl border bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <p className="text-lg text-slate-900 font-black">
                Total
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-black text-green-500">
                {nights > 0 ? `$${total.toFixed(2)}` : "$0.00"}
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="h-11 px-4 rounded-xl font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={[
                "h-11 px-5 rounded-xl font-black text-white",
                "bg-blue-500 hover:bg-blue-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}
