"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ServiceItemRequest } from "@/types/booking";

export interface CartRoomItem {
  id: number;
  title?: string;
  price: number;
  checkin?: string;
  checkout?: string;
  numOfAdults?: number;
  numOfChildren?: number;
  services?: ServiceItemRequest[];
  image?: string;
}

export interface CartServiceItem {
  serviceId: number;
  serviceName?: string;
  price: number;
  quantity: number;
  image?: string; // ✅ store cloudinary url here
}

type CartShape = {
  rooms: CartRoomItem[];
  services: CartServiceItem[];
  count: number;
  addRoom: (r: CartRoomItem) => void;
  removeRoom: (id: number) => void;
  addService: (s: CartServiceItem) => void;
  removeService: (serviceId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartShape | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<CartRoomItem[]>([]);
  const [services, setServices] = useState<CartServiceItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const count = useMemo(
    () => rooms.length + services.length,
    [rooms, services]
  );

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") ||
        localStorage.getItem("user_id") ||
        ""
      : "";

  // ✅ Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const keySuffix = userId ? `_${userId}` : "_guest";

      const savedRooms = localStorage.getItem(`cart_rooms${keySuffix}`);
      const savedServices = localStorage.getItem(`cart_services${keySuffix}`);

      if (savedRooms) setRooms(JSON.parse(savedRooms));

      if (savedServices) {
        const parsed = JSON.parse(savedServices) as CartServiceItem[];

        // ✅ migrate: remove placeholder if stored earlier
        const migrated = parsed.map((s) => ({
          ...s,
          quantity: Number(s.quantity || 1),
          image:
            s.image === "/images/placeholder.png" ? undefined : s.image, // ✅ kill placeholder
        }));

        setServices(migrated);
      }
    } catch (e) {
      console.error("Cart load error", e);
    }

    setIsLoaded(true);
  }, [userId]);

  // ✅ Save rooms
  useEffect(() => {
    if (!isLoaded) return;
    const keySuffix = userId ? `_${userId}` : "_guest";
    localStorage.setItem(`cart_rooms${keySuffix}`, JSON.stringify(rooms));
  }, [rooms, userId, isLoaded]);

  // ✅ Save services
  useEffect(() => {
    if (!isLoaded) return;
    const keySuffix = userId ? `_${userId}` : "_guest";
    localStorage.setItem(`cart_services${keySuffix}`, JSON.stringify(services));
  }, [services, userId, isLoaded]);

  const addRoom = (r: CartRoomItem) => {
    setRooms((prev) => [...prev, r]);
  };

  const removeRoom = (id: number) => {
    setRooms((prev) => prev.filter((x) => x.id !== id));
  };

  // ✅ addService ALWAYS preserves / stores real image
  const addService = (s: CartServiceItem) => {
    setServices((prev) => {
      const found = prev.find((x) => x.serviceId === s.serviceId);

      if (found) {
        return prev.map((x) =>
          x.serviceId === s.serviceId
            ? {
                ...x,
                quantity: x.quantity + Number(s.quantity || 1),
                image: x.image ?? s.image, // ✅ keep old image or set new one
              }
            : x
        );
      }

      return [
        ...prev,
        {
          ...s,
          quantity: Number(s.quantity || 1),
          image: s.image, // ✅ cloudinary url comes here
        },
      ];
    });
  };

  const removeService = (serviceId: number) => {
    setServices((prev) => prev.filter((x) => x.serviceId !== serviceId));
  };

  const clear = () => {
    setRooms([]);
    setServices([]);
  };

  return (
    <CartContext.Provider
      value={{
        rooms,
        services,
        count,
        addRoom,
        removeRoom,
        addService,
        removeService,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
