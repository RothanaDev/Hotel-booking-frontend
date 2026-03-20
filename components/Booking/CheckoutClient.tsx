"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/Booking/CartContext";
import { createBooking, createPaypalOrder } from "@/lib/api";
import { isAuthenticated as checkAuth } from "@/lib/auth";
import { Stepper, type StepKey } from "@/components/Booking/Stepper";
import {
  Trash2,
  Users,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(n) ? n : 0,
  );

export default function CheckoutClient() {
  const { rooms, services, removeRoom, removeService } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepKey>("checkout");

  useEffect(() => setMounted(true), []);

  const isAuthenticated = checkAuth();

  const userId =
    typeof window !== "undefined"
      ? Number(
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id") ||
        0,
      )
      : 0;

  const nights = (checkin?: string, checkout?: string) => {
    if (!checkin || !checkout) return 0;
    try {
      const d1 = new Date(checkin);
      const d2 = new Date(checkout);
      const diff = Math.ceil(
        (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  const roomTotal = useMemo(() => {
    return rooms.reduce(
      (acc, r) => acc + (r.price || 0) * nights(r.checkin, r.checkout),
      0,
    );
  }, [rooms]);

  const serviceTotal = useMemo(() => {
    return services.reduce((acc, s) => acc + (s.price || 0) * s.quantity, 0);
  }, [services]);

  const grandTotal = roomTotal + serviceTotal;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (rooms.length === 0 && services.length === 0) return;

    setIsProcessing(true);
    setCurrentStep("payment");

    try {
      let firstBookingId: number | null = null;

      if (rooms.length > 0) {
        const results = await Promise.all(
          rooms.map(async (r, index) => {
            const roomServices = r.services || [];

            const standaloneServices =
              index === 0
                ? services.map((s) => ({
                  serviceId: s.serviceId,
                  quantity: s.quantity,
                }))
                : [];

            const payload = {
              userId,
              roomId: r.id,
              checkin: r.checkin,
              checkout: r.checkout,
              numOfAdults: r.numOfAdults || 1,
              numOfChildren: r.numOfChildren || 0,
              services: [...roomServices, ...standaloneServices],
            } as unknown as Parameters<typeof createBooking>[0];

            return await createBooking(payload);
          }),
        );

        const first = results[0];
        firstBookingId =
          first?.id ??
          first?.bookingId ??
          first?.data?.id ??
          first?.booking?.id ??
          null;
      } else {
        alert("Please select a room.");
        setCurrentStep("checkout");
        return;
      }

      if (!firstBookingId) {
        alert("Booking created but bookingId not found in response.");
        setCurrentStep("checkout");
        return;
      }

      const { approvalUrl } = await createPaypalOrder(firstBookingId);

      if (!approvalUrl) {
        alert("PayPal approval url not found!");
        setCurrentStep("checkout");
        return;
      }

      window.location.href = approvalUrl;
    } catch (err: unknown) {
      console.error("PayPal checkout error", err);
      alert("Checkout failed. Please try again.");
      setCurrentStep("checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  const empty = rooms.length === 0 && services.length === 0;

  if (currentStep === "payment" && isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Payment
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              Redirecting you to secure payment gateway...
            </p>
            <div className="mt-2">
              <Stepper current="payment" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-10 md:p-20 text-center flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard size={32} className="text-slate-900" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Connecting to PayPal
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Please do not close this window. We are preparing your secure
              payment session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        {!empty && (
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Checkout
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              Review your stay and extras, then continue to secure payment.
            </p>
            <div className="mt-2">
              <Stepper current={currentStep} />
            </div>
          </div>
        )}

        {empty ? (
          <div className="bg-white rounded-3xl border shadow-sm p-10 md:p-14 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Add a room (and optional experiences) to continue.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-2xl font-bold hover:opacity-95"
            >
              Browse Rooms <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left */}
            <div className="lg:col-span-8 space-y-8">
              {/* Rooms */}
              <div className="bg-white rounded-3xl border shadow-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-black text-slate-900">
                    Rooms
                  </h2>
                  <span className="text-xs font-bold text-slate-500">
                    {rooms.length} item(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {rooms.map((item) => {
                    const n = nights(item.checkin, item.checkout);
                    const imgSrc =
                      item.image ||
                      (item as unknown as Record<string, unknown>).photo as string ||
                      (item as unknown as Record<string, unknown>).roomPhotoUrl as string;

                    return (
                      <div
                        key={item.id + (item.checkin || "")}
                        className="rounded-2xl border overflow-hidden flex flex-col md:flex-row bg-slate-50/50"
                      >
                        {/* Image */}
                        <div className="relative w-full md:w-56 h-44 md:h-auto bg-slate-100">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt={item.title || "Room"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-slate-300">
                              <Sparkles size={28} />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-slate-900 truncate">
                                {item.title}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">
                                {n} night{n === 1 ? "" : "s"} •{" "}
                                {money(item.price || 0)}/night
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-black text-blue-600">
                                {money((item.price || 0) * n)}
                              </p>
                              <button
                                onClick={() => removeRoom(item.id)}
                                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                            <div className="rounded-xl border bg-white px-3 py-2">
                              <div className="flex items-center gap-2">


                                <div className="flex flex-col w-full text-[11px]">
                                  {/* Check-in */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-black font-black uppercase tracking-wide">
                                      Check-in
                                    </span>
                                    <span className="text-slate-900 font-black">
                                      {item.checkin}
                                    </span>
                                  </div>

                                  <div className="h-px bg-slate-100 my-1" />

                                  {/* Check-out */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-black font-black uppercase tracking-wide">
                                      Check-out
                                    </span>
                                    <span className="text-slate-900 font-black">
                                      {item.checkout}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
                              <Users size={16} className="text-slate-500" />
                              <p className="text-xs font-bold text-slate-700">
                                {item.numOfAdults} Adult
                                {item.numOfAdults === 1 ? "" : "s"}
                                {item.numOfChildren && item.numOfChildren > 0
                                  ? ` • ${item.numOfChildren} Child`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services */}
              {services.length > 0 && (
                <div className="bg-white rounded-3xl border shadow-sm p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-black text-slate-900">
                      Service
                    </h2>
                    <span className="text-xs font-bold text-slate-500">
                      {services.length} item(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((s) => {
                      const imgSrc = s.image;

                      return (
                        <div
                          key={s.serviceId}
                          className="rounded-2xl border overflow-hidden bg-slate-50/50"
                        >
                          <div className="flex">
                            <div className="relative w-28 h-28 bg-slate-100 shrink-0">
                              {imgSrc ? (
                                <Image
                                  src={imgSrc}
                                  alt={s.serviceName || "Service"}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full grid place-items-center text-slate-300">
                                  <Sparkles size={22} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-black text-slate-900 truncate">
                                    {s.serviceName}
                                  </h3>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Qty:{" "}
                                    <span className="font-bold">
                                      {s.quantity}
                                    </span>
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm font-black text-blue-600">
                                    {money((s.price || 0) * s.quantity)}
                                  </p>
                                  <button
                                    onClick={() => removeService(s.serviceId)}
                                    className="mt-2 text-xs font-bold text-slate-500 hover:text-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4">
              <aside className="bg-white rounded-3xl border shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-slate-900">
                    Order Summary
                  </h3>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    <ShieldCheck size={14} />
                    Secure
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-bold">Room</span>
                    <span className="text-slate-900 font-black">
                      {money(roomTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 font-bold">
                      Service
                    </span>
                    <span className="text-slate-900 font-black">
                      {money(serviceTotal)}
                    </span>
                  </div>
                </div>

                <div className="my-5 h-px bg-slate-200" />

                <div className="flex items-end justify-between">
                  <span className="text-slate-900 font-black text-base">
                    Total
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    {money(grandTotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={[
                    "mt-6 w-full rounded-2xl py-4 font-black text-white",
                    "bg-slate-900 hover:opacity-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  {isProcessing ? "Processing..." : "Pay with PayPal"}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-slate-500">
                  <CreditCard size={14} />
                  <p className="text-[11px] font-bold uppercase">
                    Secure payment via PayPal
                  </p>
                </div>

                {/* Trust / Notes */}
                <div className="mt-6 rounded-2xl border bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-700">
                    What happens next?
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• You’ll be redirected to PayPal to approve payment</li>
                    <li>• After success, we confirm your booking</li>
                    <li>• Your cart clears on the success page</li>
                  </ul>
                </div>

                {/* Back link */}
                <button
                  onClick={() => router.push("/")}
                  className="mt-5 w-full text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Continue browsing
                </button>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
