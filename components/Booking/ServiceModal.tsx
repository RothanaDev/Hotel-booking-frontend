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
    <div className="fixed inset-0 z-[100] flex flex-col sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm hidden sm:block"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-sm bg-white sm:rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between border-b flex-shrink-0">
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
            className="h-8 w-8 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex-1 overflow-y-auto space-y-6">
          {/* Quantity */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Quantity
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={dec}
                className="h-11 w-11 rounded-xl border bg-white grid place-items-center hover:bg-slate-50 transition-colors"
              >
                <Minus size={18} />
              </button>

              <div className="h-11 w-20 rounded-xl border bg-slate-50 grid place-items-center font-black text-lg text-slate-900">
                {quantity}
              </div>

              <button
                onClick={inc}
                className="h-11 w-11 rounded-xl border bg-white grid place-items-center hover:bg-slate-50 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-5">
            <p className="text-sm font-bold text-slate-700">Total Amount</p>
            <p className="text-xl font-black text-green-600">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="px-6 h-11 rounded-xl text-sm font-black bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
