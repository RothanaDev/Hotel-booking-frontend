"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Award, Users, Clock, MapPin } from "lucide-react";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <div className="w-full h-[400px] skeleton" />
        <div className="container mx-auto px-4 py-16 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-10 w-1/3 bg-slate-100 rounded-xl skeleton" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded skeleton" />
                <div className="h-4 w-full bg-slate-100 rounded skeleton" />
                <div className="h-4 w-2/3 bg-slate-100 rounded skeleton" />
              </div>
            </div>
            <div className="h-96 rounded-2xl skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-slate-900">
                Our <span className="text-amber-500">Story</span>
              </h1>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 1920, GrandLuxe Hotel has been a beacon of luxury and sophistication for over a
                  century. What began as a vision to create an unparalleled hospitality experience has evolved
                  into one of the world's most prestigious hotel brands.
                </p>
                <p>
                  Our commitment to excellence is reflected in every detail — from our meticulously designed
                  rooms to our award-winning culinary offerings, and our legendary personalized service that
                  anticipates your every need.
                </p>
                <p>
                  Today, GrandLuxe continues to set the standard for luxury hospitality, welcoming discerning
                  travelers from around the globe who seek nothing but the best.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/bg-image.avif"
                  alt="Luxury Hotel Room"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute bottom-6 left-6 bg-amber-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold">100+</div>
                <div className="text-sm font-medium">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center bg-amber-50 p-8 rounded-lg">
              <div className="inline-block bg-amber-100 p-4 rounded-full mb-4">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">50+</div>
              <div className="text-gray-600 font-medium">Industry Awards</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center bg-amber-50 p-8 rounded-lg">
              <div className="inline-block bg-amber-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">1M+</div>
              <div className="text-gray-600 font-medium">Happy Guests</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center bg-amber-50 p-8 rounded-lg">
              <div className="inline-block bg-amber-100 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <div className="text-gray-600 font-medium">Concierge Service</div>
            </div>

            {/* Stat 4 */}
            <div className="text-center bg-amber-50 p-8 rounded-lg">
              <div className="inline-block bg-amber-100 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">Prime</div>
              <div className="text-gray-600 font-medium">Location</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              Our <span className="text-amber-500">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-slate-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for perfection in every interaction, ensuring our guests receive nothing but the highest
                quality service and amenities.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-slate-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Personalization</h3>
              <p className="text-gray-600">
                Every guest is unique, and we tailor our services to meet individual preferences, creating truly
                personalized experiences.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-slate-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to sustainable practices, protecting our environment while delivering exceptional
                hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}