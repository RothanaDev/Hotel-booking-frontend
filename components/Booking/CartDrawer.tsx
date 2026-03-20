"use client";

import React from 'react';
import { useCart } from './CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { rooms, services, removeRoom, removeService, clear } = useCart();
  const router = useRouter();

  if (!open) return null;

  const roomSubtotal = rooms.reduce((a, r) => a + (r.price || 0), 0);
  const serviceSubtotal = services.reduce((a, s) => a + (s.price || 0) * s.quantity, 0);

  const formatCurrency = (v: number) => `$${v.toFixed(2)}`;

  const nights = (checkin?: string, checkout?: string) => {
    if (!checkin || !checkout) return 0;
    try {
      const d1 = new Date(checkin);
      const d2 = new Date(checkout);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative ml-auto w-full max-w-md bg-white p-6 overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-gray-500">×</button>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="font-medium mb-3">Room Bookings</h4>
            {rooms.length === 0 ? (
              <p className="text-sm text-gray-500">No rooms added</p>
            ) : (
              <div className="space-y-3">
                {rooms.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-md border bg-gray-50">
                    <div className="w-24 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                      {r.image ? (
                        <Image
                          src={r.image}
                          alt={r.title || "Room"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="truncate font-medium">{r.title}</div>
                        <div className="text-amber-600 font-semibold">{formatCurrency(r.price)}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div>{r.checkin || '-'} • {r.checkout || '-'}</div>
                        <div>{r.numOfAdults || 0} Adults • {r.numOfChildren || 0} Children • {nights(r.checkin, r.checkout)} night(s)</div>
                      </div>
                      <div className="mt-2">
                        <button onClick={() => removeRoom(r.id)} className="text-sm text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h4 className="font-medium mb-3">Additional Services</h4>
            {services.length === 0 ? (
              <p className="text-sm text-gray-500">No services added</p>
            ) : (
              <div className="space-y-3">
                {services.map((s) => (
                  <div key={s.serviceId} className="flex items-center justify-between p-3 rounded-md border bg-white">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{s.serviceName}</div>
                      <div className="text-sm text-gray-500">Qty: {s.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-amber-600">{formatCurrency(s.price * s.quantity)}</div>
                      <button onClick={() => removeService(s.serviceId)} className="text-sm text-red-500 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-gray-700 mb-2">
            <div>Room Subtotal</div>
            <div>{formatCurrency(roomSubtotal)}</div>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <div>Services Subtotal</div>
            <div>{formatCurrency(serviceSubtotal)}</div>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-4">
            <div>Grand Total</div>
            <div>{formatCurrency(roomSubtotal + serviceSubtotal)}</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => { clear(); }} className="py-2 border rounded">Clear</button>
            <button onClick={() => { onClose(); router.push('/booking'); }} className="py-2 bg-amber-500 text-white rounded">Checkout</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
