"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Tv,
  Wifi,
  Wind,
  MapPin,
  Map as MapIcon,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RoomFilters from "@/components/Layout/SearchFilter";
import { getAllRooms, isAuthenticated } from "@/lib/api";
import type { Room } from "@/types/room";
import { useAllRoomTypes, useAllServices } from "@/hooks/use-queries";
import BookingModal from "@/components/Booking/BookingModal";

const getRoomTypeName = (roomType: Room["roomType"]): string => {
  if (typeof roomType === "string") return roomType;
  return roomType?.typeName || "";
};

const getRoomTypeDescription = (roomType: Room["roomType"]): string => {
  if (typeof roomType === "string") return "";
  return roomType?.description || "";
};

const getRoomTypePrice = (roomType: Room["roomType"]): number => {
  if (typeof roomType === "string") return 0;
  return roomType?.price || 0;
};

function RoomSkeletonGrid() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full"
        >
          <div className="relative h-64">
            <div className="absolute inset-0 skeleton" />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="space-y-3">
              <div className="h-5 w-3/4 rounded-xl skeleton" />
              <div className="h-4 w-full rounded-xl skeleton" />
              <div className="h-4 w-5/6 rounded-xl skeleton" />
            </div>

            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
              <div className="h-4 w-14 rounded-xl skeleton" />
              <div className="h-4 w-16 rounded-xl skeleton" />
              <div className="h-4 w-12 rounded-xl skeleton" />
            </div>

            <div className="mt-6 h-12 rounded-xl skeleton" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  const { data: roomTypes = [] } = useAllRoomTypes();
  const { data: services = [] } = useAllServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  const allRoomsRef = useRef<Room[]>([]);

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const [price, setPrice] = useState("any");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAllRooms();
        if (Array.isArray(data)) {
          const availableRooms = data.filter(
            (room) => room.status === "available" || room.status === "Available"
          );
          allRoomsRef.current = availableRooms;
          setFilteredRooms(availableRooms);
        }
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  useEffect(() => {
    let result = [...allRoomsRef.current];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((room) => {
        const typeName = getRoomTypeName(room.roomType);
        const description = getRoomTypeDescription(room.roomType);
        return (
          typeName.toLowerCase().includes(lowerKeyword) ||
          description.toLowerCase().includes(lowerKeyword)
        );
      });
    }

    if (type !== "all") {
      result = result.filter((room) =>
        getRoomTypeName(room.roomType).toLowerCase().includes(type.toLowerCase())
      );
    }

    // NOTE: you have a "price" state, but no price filter logic in your original code.
    // Keep it as-is for now.

    setFilteredRooms(result);
  }, [keyword, type, price]);

  const openBookingModal = (room: Room) => {
    if (!isAuthenticated()) {
      router.push("/register");
      return;
    }
    const roomImage = (room as any).image || (room as any).photo || (room as any).roomPhotoUrl;
    setSelectedRoom({
      id: room.id,
      price: getRoomTypePrice(room.roomType),
      title: getRoomTypeName(room.roomType),
      image: roomImage,
    });
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ height: "600px" }}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/Hotel3.webp"
            alt="Luxury Sunset Sea Resort"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
            Experience <span className="">Luxury</span> Redefined
          </h1>
          <p className="text-xl md:text-xl font-light mb-8 max-w-2xl mx-auto text-gray-100">
            Discover unparalleled comfort and world-class hospitality at RNHotel.
            Your journey to extraordinary begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="!bg-blue-500 hover:!bg-blue-500 text-white px-8 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Browse Rooms
            </Link>
            <Link
              href="/service"
              className="border-2 border-blue-500 text-white hover:bg-blue-500/10 px-8 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* OUR HOTEL & LOCATION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Welcome to <span className="text-blue-600 italic">RN Hotel</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto font-light">
                Experience a sanctuary where modern luxury meets timeless Kampot charm.
              </p>

              {/* Compact Modern Location Bar */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-8 py-5 border-y border-slate-100 max-w-2xl mx-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    Kampot, Cambodia
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Navigation size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    5 min from Bridge
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Star size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    Riverfront Area
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image + Mini Map Grid */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-8 relative h-[450px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
                <Image
                  src="/images/Hote1.jpg"
                  alt="RN Hotel Showcase"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-80">
                    Interior Design
                  </p>
                  <p className="text-3xl font-serif">Serene Comfort</p>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="relative h-[220px] md:h-1/2 rounded-[2rem] overflow-hidden shadow-xl group border-4 border-white">
                  <Image
                    src="/images/Hotel2.jpg"
                    alt="Luxury Lobby"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                </div>

                <div className="relative h-[220px] md:h-1/2 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-slate-50 group">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.411606775!2d104.103000!3d10.610000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3108369cd7198759%3A0x67399db725f483c6!2sKampot!5e0!3m2!1sen!2skh!4v1707488338902!5m2!1sen!2skh"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    className="grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-sm border border-white/40 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                  >
                    Open Maps
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2">
          <div className="text-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Our <span className="text-blue-600 italic">Luxurious</span> Rooms
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Choose from our collection of elegantly appointed rooms and suites,
                each designed for ultimate comfort and sophistication.
              </p>
            </motion.div>
          </div>

          <div className="mb-16">
            <RoomFilters
              keyword={keyword}
              setKeyword={setKeyword}
              type={type}
              setType={setType}
              price={price}
              setPrice={setPrice}
            />
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <RoomSkeletonGrid />
            ) : filteredRooms.length > 0 ? (
              <motion.div
                key="rooms"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {filteredRooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col h-full group"
                  >
                    <div className="relative h-55 overflow-hidden">
                      {(() => {
                        const img =
                          (room as any).image 
                        return img ? (
                          <Image
                            src={img}
                            alt={getRoomTypeName(room.roomType)}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                            No Image Available
                          </div>
                        );
                      })()}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                        ${getRoomTypePrice(room.roomType)} / night
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-2">
                        <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                          {getRoomTypeName(room.roomType)}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                          {getRoomTypeDescription(room.roomType)}
                        </p>
                      </div>

                      <div className="flex items-center gap-5 mt-auto pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                          <Tv size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            TV
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                          <Wifi size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            WIFI
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                          <Wind size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            AC
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openBookingModal(room)}
                        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <p className="text-slate-400 font-medium">
                  No rooms match your criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <BookingModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            room={selectedRoom}
            services={services}
          />
        </div>
      </section>
    </div>
  );
}
