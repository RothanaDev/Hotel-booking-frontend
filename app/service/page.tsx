"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAllServices } from "@/hooks/use-queries";
import type { Service } from "@/types/service";
import { Sparkles, Search } from "lucide-react";
import { isAuthenticated } from "@/lib/api";
import ServiceModal from '@/components/Booking/ServiceModal';
import { useCart } from '@/components/Booking/CartContext';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServicesPage() {
  const [authRequired, setAuthRequired] = useState(false);
  const router = useRouter();

  console.log("Rendering ServicesPage");

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");


  // Use react-query hook for services
  const { data: services = [], isLoading, error } = useAllServices();

  useEffect(() => {
    setAuthRequired(!!(error as any)?.isUnauthorized);
  }, [error]);

  const loading = !!isLoading;

  // Filter logic (derived from `services`)
  const filteredServices = useMemo(() => {
    console.log("Filtering services with:", { keyword, category });
    const list = Array.isArray(services) ? services : [];
    const lowerKeyword = keyword.trim().toLowerCase();

    return list.filter((service) => {
      if (lowerKeyword) {
        const matchesKeyword =
          (service.serviceName || "").toLowerCase().includes(lowerKeyword) ||
          (service.description || "").toLowerCase().includes(lowerKeyword);
        if (!matchesKeyword) return false;
      }

      if (category !== "all") {
        if (!service.category || service.category.toLowerCase() !== category.toLowerCase()) return false;
      }

      return true;
    });
  }, [services, keyword, category]);

  // Clear filters
  const handleClearFilters = () => {
    setKeyword("");
    setCategory("all");
  };

  // Get unique categories from the query data (avoid reading refs during render)
  const categories = useMemo(() => {
    const list = Array.isArray(services) ? services.map((s) => s.category).filter(Boolean) : [];
    return Array.from(new Set(list));
  }, [services]);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ height: "300px" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-linear-to-r bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Our <span className="text-amber-500">Premium</span> Services
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto text-gray-100">
            Enhance your stay with our exclusive range of world-class services,
            designed to provide you with an unforgettable experience.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">


          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-[400px] shadow-sm">
                    <div className="relative h-48 skeleton" />
                    <div className="p-5 flex flex-col flex-1 space-y-4">
                      <div className="h-4 w-16 rounded bg-slate-100 skeleton" />
                      <div className="h-6 w-3/4 rounded bg-slate-100 skeleton" />
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-slate-100 skeleton" />
                        <div className="h-3 w-5/6 rounded bg-slate-100 skeleton" />
                      </div>
                      <div className="mt-auto h-10 w-full rounded bg-slate-100 skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : authRequired ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 font-medium mb-6 text-lg">Please sign in to experience our premium services.</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push('/login')}
                    className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                  >
                    Login to Access
                  </button>
                </div>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md group border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    {service.image || service.photo ? (
                      <Image
                        src={service.image || service.photo || ""}
                        alt={service.serviceName}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-amber-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${service.price}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="mb-2">
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-2">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
                      {service.serviceName}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 grow">
                      {service.description}
                    </p>
                    <button
                      onClick={() => {
                        if (!isAuthenticated()) {
                          router.push("/register");
                          return;
                        }
                        setSelectedService(service);
                        setServiceModalOpen(true);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-500 text-white py-2 rounded font-medium transition-colors mt-auto"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No services available matching your criteria.
              </div>
            )}
          </div>
          <ServiceModal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} service={selectedService} />
        </div>
      </section>
    </div>
  );
}
