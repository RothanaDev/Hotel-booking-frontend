"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Tv, Wifi, Wind } from "lucide-react";
import type { Room } from "@/types/room";

interface RoomCardProps {
    room: Room;
    idx: number;
    onBook: (room: Room) => void;
    getRoomTypeName: (roomType: Room['roomType']) => string;
    getRoomTypeDescription: (roomType: Room['roomType']) => string;
    getRoomTypePrice: (roomType: Room['roomType']) => number;
}

export default function RoomCard({
    room,
    idx,
    onBook,
    getRoomTypeName,
    getRoomTypeDescription,
    getRoomTypePrice,
}: RoomCardProps) {
    const img = (room as Room & { image?: string }).image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.5,
                delay: idx * 0.06,
                ease: "easeOut",
            }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col h-full group"
        >
            <div className="relative h-52 overflow-hidden">
                {img ? (
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
                )}
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
                    onClick={() => onBook(room)}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 shadow-md"
                >
                    Book Now
                </button>
            </div>
        </motion.div>
    );
}
