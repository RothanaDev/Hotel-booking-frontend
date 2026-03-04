"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import CartDrawer from '@/components/Booking/CartDrawer';
import { useCart } from '@/components/Booking/CartContext';
import { logout as apiLogout, isAuthenticated as checkAuth } from '@/lib/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine if a link is active
  const isActive = (href: string) => {
    const normPath = (pathname || '').split('?')[0].replace(/\/+$/g, '') || '/';
    const normHref = (href || '').split('?')[0].replace(/\/+$/g, '') || '/';

    // Special case for Home
    if (normHref === '/') return normPath === '/';

    // For others, use exact match for 'My Bookings' so Cart doesn't highlight it
    if (normHref === '/booking') return normPath === '/booking';

    return normPath === normHref || normPath.startsWith(normHref + '/');
  };

  const baseLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/service', label: 'Services' },
    { href: '/about', label: 'About' },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isLoggedIn = checkAuth();
    setIsAuthenticated(isLoggedIn);
    const email = localStorage.getItem('currentUser');
    if (email) {
      setCurrentUserEmail(email);
      if (email.includes('@')) {
        const namePart = email.split('@')[0];
        setDisplayName(namePart);
      } else {
        setDisplayName(email);
      }
    }
  }, []);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const initials = (() => {
    const src = displayName || currentUserEmail || 'U';
    return src
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  })();

  const navLinks = isAuthenticated
    ? [...baseLinks, { href: '/booking', label: 'My Bookings' }]
    : baseLinks;

  function CartButton() {
    try {
      const { count } = useCart();
      const [mounted, setMounted] = useState(false);
      useEffect(() => {
        setMounted(true);
      }, []);

      const isCartActive = pathname === '/booking/checkout';

      return (
        <button
          onClick={() => router.push('/booking/checkout')}
          className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg ${isCartActive
            ? 'bg-blue-500 text-white shadow-blue-500/30'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30 hover:scale-110'
            }`}
          aria-label="View Cart"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          {mounted && count > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center shadow-sm border-2 border-transparent group-hover:scale-110 transition-transform">
              {count}
            </span>
          )}
        </button>
      );
    } catch (e) {
      return (
        <button onClick={() => router.push('/booking/checkout')} className="p-2 rounded-full hover:bg-gray-100">
          <ShoppingCart size={18} />
        </button>
      );
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group outline-none">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <img
                src="/images/logo.png"
                alt="RNHotel Logo"
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              RN<span className="text-amber-500">Hotel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium ${active
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Cart + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <CartButton />
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((s) => !s)}
                  className="inline-flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {initials}
                  </div>
                  <span className="text-gray-700 font-medium">{displayName || 'User'}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {(((displayName || currentUserEmail || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')).toUpperCase())}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{displayName}</div>
                          <div className="text-xs text-gray-500">{currentUserEmail || ''}</div>
                        </div>
                      </div>
                    </div>
                    <nav className="flex flex-col">
                      <button
                        onClick={() => {
                          apiLogout();
                          setIsAuthenticated(false);
                          setIsDropdownOpen(false);
                          router.push('/');
                        }}
                        className="text-red-600 text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-amber-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-all duration-300 font-medium px-4 py-2 rounded-md ${active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:text-amber-500'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <span className="text-gray-700">{displayName}</span>
                    <button
                      onClick={() => {
                        apiLogout();
                        setIsMenuOpen(false);
                        router.push('/');
                      }}
                      className="bg-white border border-gray-200 px-4 py-2 rounded-md text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-amber-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-blue-500 hover:bg-blue-500 text-white px-6 py-2 rounded-md transition-colors font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
        <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </header>
  );
}