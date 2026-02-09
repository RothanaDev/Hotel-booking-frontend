"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartContext";
import type { Service } from "@/types/service";
import { X, Minus, Plus } from "lucide-react";

export default function ServiceModal({
  open,
  onClose,
  service,
}: {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addService } = useCart();

  // Reset quantity every time modal opens
  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, service?.id]);

  const total = useMemo(() => {
    if (!service) return 0;
    return Number(service.price || 0) * quantity;
  }, [service, quantity]);

  if (!open || !service) return null;

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    addService({
      serviceId: service.id,
      serviceName: service.serviceName,
      price: Number(service.price || 0),
      quantity,
      image: service.image,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between border-b">
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              Book {service.serviceName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              ${service.price} per session
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* Quantity */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Quantity
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={dec}
                className="h-10 w-10 rounded-xl border bg-white grid place-items-center hover:bg-slate-50"
              >
                <Minus size={16} />
              </button>

              <div className="h-10 w-16 rounded-xl border bg-slate-50 grid place-items-center font-black text-slate-900">
                {quantity}
              </div>

              <button
                onClick={inc}
                className="h-10 w-10 rounded-xl border bg-white grid place-items-center hover:bg-slate-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm font-bold text-slate-700">Total</p>
            <p className="text-lg font-black text-green-500">
              ${total.toFixed(2)}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleAdd}
              className="px-5 py-2 rounded-xl text-sm font-black bg-blue-500 text-white hover:bg-blue-500 shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
