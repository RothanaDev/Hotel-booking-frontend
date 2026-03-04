"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Navigation, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import RoomSection from "@/components/Room/RoomSection";

const toISODate = (d: Date) => d.toISOString().split("T")[0];

export default function Home() {
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => new Date(Date.now() + 86400000), []);

  const [checkIn, setCheckIn] = useState(toISODate(today));
  const [checkOut, setCheckOut] = useState(toISODate(tomorrow));

  const onSearch = () => {
    if (!checkIn || !checkOut) return;

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out must be after check-in.");
      return;
    }

    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto text-gray-200">
              Discover unparalleled comfort and world-class hospitality at
              RNHotel. Your journey to extraordinary begins here.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl md:rounded-full border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 flex w-full">
                {/* Check-in */}
                <div className="flex-1 flex items-center px-6 py-3 border-r border-white/10 hover:bg-white/5 transition-colors group">
                  <div className="text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="text-left w-full">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Check-in
                    </p>
                    <input
                      type="date"
                      value={checkIn}
                      min={toISODate(today)}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCheckIn(next);

                        // Auto-fix checkout if invalid
                        if (new Date(checkOut) <= new Date(next)) {
                          const d = new Date(next);
                          d.setDate(d.getDate() + 1);
                          setCheckOut(toISODate(d));
                        }
                      }}
                      className="bg-transparent border-none outline-none text-white text-sm font-semibold w-full [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex-1 flex items-center px-6 py-3 hover:bg-white/5 transition-colors group cursor-pointer rounded-r-2xl md:rounded-r-none">
                  <div className="text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="text-left w-full">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Check-out
                    </p>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-sm font-semibold w-full [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={onSearch}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-10 py-5 rounded-xl md:rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 group"
              >
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Search Rooms</span>
              </button>
            </div>
          </motion.div>
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
                Welcome to{" "}
                <span className="text-blue-600 italic">RN Hotel</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto font-light">
                Experience a sanctuary where modern luxury meets timeless Kampot
                charm.
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
                    href="https://www.google.com/maps?q=RN+Hotel+Kampot"
                    target="_blank"
                    rel="noopener noreferrer"
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
      <RoomSection />
    </div>
  );
}