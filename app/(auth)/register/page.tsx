"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerUser, sendVerification } from '@/lib/api';
import { registerSchema } from '@/lib/validator/register';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
// import { z } from 'zod'; // z is defined but never used

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
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Zod Validation
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      // Clear the form fields immediately on success
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // ✅ Show Toast on Success
      setShowToast(true);

      // Trigger Send Verification Email
      try {
        await sendVerification({ email: formData.email });
      } catch (sendErr) {
        console.error('Failed to send verification email', sendErr);
      }

      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      }, 1200);
    } catch (err: unknown) {
      console.error('Registration error', err);
      let message = 'Registration failed. Please try again.';
      if (err && typeof err === 'object') {
        type ErrorData = { message?: string; error?: string };
        const errorObj = err as { response?: { data?: unknown }; message?: string };
        const data = errorObj.response?.data as ErrorData | undefined;
        const serverMessage = data?.message || data?.error;
        message = serverMessage || errorObj.message || message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundImage: "url('/images/bg-image.avif')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 bg-white rounded-xl shadow-2xl border border-green-100 p-4 flex items-start gap-3 min-w-[320px] transition-all duration-500 z-50 ${showToast ? "translate-x-0 opacity-100" : "translate-x-[500px] opacity-0"
          }`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">Registration Successful!</h3>
          <p className="text-sm text-gray-600">Redirecting to login page...</p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border border-white/20 backdrop-blur-md">
          <div className="flex flex-col items-center">
            {/* smaller logo */}
            <div className="mb-3">
              <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.12)] relative">
                <Image src="/images/logo.png" alt="RN HOTEL" fill className="object-contain" />
              </div>
            </div>

            {/* smaller title/subtitle */}
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">RN HOTEL</h1>
            <p className="text-[11px] text-gray-500 mb-4 text-center font-medium">
              Create your account and join our community
            </p>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[11px] w-full flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            {/* tighter spacing */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-700 ml-1">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 h-10 text-sm bg-blue-50/50 border-transparent focus:ring-2 focus:ring-blue-300 transition-all rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-700 ml-1">PHONE NUMBER</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 h-10 text-sm bg-blue-50/50 border-transparent focus:ring-2 focus:ring-blue-300 transition-all rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-700 ml-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address  "
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 h-10 text-sm bg-blue-50/50 border-transparent focus:ring-2 focus:ring-blue-300 transition-all rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-700 ml-1">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Pssword"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10 h-10 text-sm bg-blue-50/50 border-transparent focus:ring-2 focus:ring-blue-300 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-700 ml-1">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10 h-10 text-sm bg-blue-50/50 border-transparent focus:ring-2 focus:ring-blue-300 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-[10px] px-1 pt-1">
                <input
                  type="checkbox"
                  required
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <label className="ml-2 text-gray-600 font-medium">
                  I agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:underline font-bold">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="#" className="text-blue-600 hover:underline font-bold">
                    Privacy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-sm text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all active:scale-[0.98] mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center text-[11px] text-gray-500 pt-2">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-black hover:underline">
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
