'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Shield, Clock } from "lucide-react";
import RoomFilters from "@/components/Layout/SearchFilter";
import { getAllRooms } from "@/lib/api";
import type { Room } from "@/types/Room";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const [price, setPrice] = useState("any");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAllRooms();
        if (Array.isArray(data)) {
          const availableRooms = data.filter(room => room.status === 'available');
          setRooms(availableRooms);
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

  // Filter logic
  const filterRooms = () => {
    // console.log("Filtering with:", { keyword, type, price });
    let result = rooms;

    // Filter by keyword
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (room) =>
          room.roomType.typeName.toLowerCase().includes(lowerKeyword) ||
          room.roomType.description.toLowerCase().includes(lowerKeyword)
      );
    }

    // Filter by type
    if (type !== "all") {
      result = result.filter(
        (room) => room.roomType.typeName.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Filter by price
    if (price !== "any") {
      if (price === "500+") {
        result = result.filter((room) => room.roomType.price >= 500);
      } else {
        const [min, max] = price.split("-").map(Number);
        result = result.filter(
          (room) => room.roomType.price >= min && room.roomType.price <= max
        );
      }
    }

    setFilteredRooms(result);
  };

  useEffect(() => {
    filterRooms();
  }, [keyword, type, price, rooms]);


  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[550px] w-full flex items-center justify-center text-center text-white">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/bg.jpg"
            alt="Luxury Hotel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
            Experience <span className="text-amber-500">Luxury</span> Redefined
          </h1>
          <p className="text-xl md:text-xl font-light mb-8 max-w-2xl mx-auto text-gray-200 text-primary-foreground/90">
            Discover unparalleled comfort and world-class hospitality at RNHotel.
            Your journey to extraordinary begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Browse Rooms
            </Link>
            <Link
              href="/service"
              className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10 px-8 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-start space-x-4 border border-gray-100">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-500">
                <Star size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">5 Star Experience</h3>
                <p className="text-gray-600 text-sm">Award-winning service and world-class amenities.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-start space-x-4 border border-gray-100">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-500">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Booking</h3>
                <p className="text-gray-600 text-sm">Safe and easy online reservation system.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-start space-x-4 border border-gray-100">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-500">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Concierge</h3>
                <p className="text-gray-600 text-sm">Round-the-clock assistance for all your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Our <span className="text-amber-500">Luxurious</span> Rooms
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of elegantly appointed rooms and suites,
              each designed for ultimate comfort and sophistication.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="mt-8 mb-12">
            <RoomFilters
              keyword={keyword}
              setKeyword={setKeyword}
              type={type}
              setType={setType}
              price={price}
              setPrice={setPrice}
            />
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">Loading rooms...</p>
              </div>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-md group border border-gray-100 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.roomType.typeName}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-serif font-bold text-slate-900">{room.roomType.typeName}</h3>
                      <div className="text-right">
                        <span className="text-amber-500 font-bold text-lg">${room.roomType.price}</span>
                        <span className="text-gray-400 text-xs block">/night</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{room.roomType.description}</p>
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-medium transition-colors mt-auto">
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No rooms available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
