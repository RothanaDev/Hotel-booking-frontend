

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      {" "}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {" "}
          {/* Brand Section */}{" "}
          <div>
            {" "}
            <h3 className="text-2xl font-bold mb-4">
              {" "}
              RN<span className="text-amber-500">Hotel</span>{" "}
            </h3>{" "}
            <p className="text-gray-300 text-sm leading-relaxed">
              {" "}
              Experience unparalleled luxury and world-class hospitality at
              RNHotel. Your perfect retreat awaits.{" "}
            </p>{" "}
          </div>{" "}
          {/* Quick Links */}{" "}
          <div>
            {" "}
            <h4 className="text-amber-500 font-semibold mb-4">
              Quick Links
            </h4>{" "}
            <ul className="space-y-2">
              {" "}
              <li>
                {" "}
                <Link
                  href="/"
                  className="text-gray-300 hover:text-amber-500 transition-colors text-sm"
                >
                  {" "}
                  Home{" "}
                </Link>{" "}
              </li>{" "}
              <li>
                {" "}
                <Link
                  href="/service"
                  className="text-gray-300 hover:text-amber-500 transition-colors text-sm"
                >
                  {" "}
                  Services{" "}
                </Link>{" "}
              </li>{" "}
              <li>
                {" "}
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-500 transition-colors text-sm"
                >
                  {" "}
                  About Us{" "}
                </Link>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          {/* Our Services */}{" "}
          <div>
            {" "}
            <h4 className="text-amber-500 font-semibold mb-4">
              Our Services
            </h4>{" "}
            <ul className="space-y-2">
              {" "}
              <li className="text-gray-300 text-sm">Spa & Wellness</li>{" "}
              <li className="text-gray-300 text-sm">Fine Dining</li>{" "}
              <li className="text-gray-300 text-sm">Airport Transfer</li>{" "}
              <li className="text-gray-300 text-sm">Concierge</li>{" "}
            </ul>{" "}
          </div>{" "}
          {/* Contact Us */}{" "}
          <div>
            {" "}
            <h4 className="text-amber-500 font-semibold mb-4">
              Contact Us
            </h4>{" "}
            <ul className="space-y-3">
              {" "}
              <li className="flex items-start space-x-2 text-sm">
                {" "}
                <MapPin
                  size={16}
                  className="text-amber-500 mt-1 flex-shrink-0"
                />{" "}
                <span className="text-gray-300">
                  Kampot Province, Cambodia
                </span>{" "}
              </li>{" "}
              <li className="flex items-center space-x-2 text-sm">
                {" "}
                <Phone
                  size={16}
                  className="text-amber-500 flex-shrink-0"
                />{" "}
                <span className="text-gray-300">+1 (555) 123-4567</span>{" "}
              </li>{" "}
              <li className="flex items-center space-x-2 text-sm">
                {" "}
                <Mail size={16} className="text-amber-500 flex-shrink-0" />{" "}
                <span className="text-gray-300">info@rnhotel.com</span>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
        </div>{" "}
        {/* Copyright */}{" "}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          {" "}
          <p className="text-gray-400 text-sm">
            {" "}
            © {new Date().getFullYear()} RNHotel. All rights
            reserved.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
