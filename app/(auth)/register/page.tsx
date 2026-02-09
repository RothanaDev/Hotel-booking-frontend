'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) return setError('Full name is required');
    if (!formData.phone.trim()) return setError('Phone number is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    setIsLoading(true);

    try {
      await registerUser({
        name: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/images/bg-image.avif')" }}
    >
      {/* overlay fixed */}
      <div className="fixed inset-0 bg-black/40" />

      <main className="relative z-10 w-full max-w-sm">
        <div className="bg-white/95 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            {/* smaller logo */}
            <div className="mb-3">
              <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.12)]">
                <img src="/images/logo.png" alt="RN HOTEL" className="object-contain w-full h-full" />
              </div>
            </div>

            {/* smaller title/subtitle */}
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">RN HOTEL</h1>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Create your account and join our community
            </p>

            {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-xs w-full">{error}</div>}
            {success && <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-md text-xs w-full">{success}</div>}

            {/* tighter spacing */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              {/* Inputs: h-10, smaller icons, smaller padding */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10 text-sm bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10 text-sm bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10 text-sm bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 h-10 text-sm bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 h-10 text-sm bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center text-xs">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700">
                  I agree to{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Privacy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-sm text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:opacity-95"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
