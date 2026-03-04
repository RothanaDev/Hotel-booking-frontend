"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RoomFilters from "@/components/Layout/SearchFilter";
import { getAllRooms } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { Room } from "@/types/room";
import { useAllServices } from "@/hooks/use-queries";
import BookingModal from "@/components/Booking/BookingModal";
import RoomCard from "./RoomCard";

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
                        </div>
                        <div className="mt-6 h-12 rounded-xl skeleton" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default function RoomSection() {
    const [loading, setLoading] = useState(true);
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
                        (room) =>
                            room.status === "available" || room.status === "Available",
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
                getRoomTypeName(room.roomType).toLowerCase().includes(type.toLowerCase()),
            );
        }
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
                            Choose from our collection of elegantly appointed rooms and
                            suites, each designed for ultimate comfort and sophistication.
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
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {filteredRooms.map((room, idx) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    idx={idx}
                                    onBook={openBookingModal}
                                    getRoomTypeName={getRoomTypeName}
                                    getRoomTypeDescription={getRoomTypeDescription}
                                    getRoomTypePrice={getRoomTypePrice}
                                />
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
    );
}
