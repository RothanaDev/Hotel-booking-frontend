"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, X } from "lucide-react";
import { loginUser } from "@/lib/api";
import { loginSchema } from "@/lib/validator/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // const router = useRouter(); // router is defined but never used

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Zod Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await loginUser({ email, password });

      // Clear the form fields immediately on success
      setEmail("");
      setPassword("");

      // ✅ Show Toast on Success
      setShowToast(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err: unknown) {
      let message = 'Invalid email or password';
      let isUnverifiedError = false;
      if (err && typeof err === 'object') {
        type ErrorData = { message?: string; error?: { reason?: string } | string };
        const errorObj = err as { response?: { data?: ErrorData }; message?: string };
        const data = errorObj.response?.data;
        message = data?.message || (typeof data?.error === 'object' ? data?.error?.reason : data?.error) || errorObj.message || message;
        if (typeof message === 'string' && (message.toLowerCase().includes('not verified') || message.toLowerCase().includes('unverified'))) {
          isUnverifiedError = true;
        }
      }
      setIsUnverified(isUnverifiedError);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/bg-image.avif')] px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 bg-white rounded-xl shadow-2xl border border-green-100 p-4 flex items-start gap-3 min-w-[320px] transition-all duration-500 z-50 ${showToast ? "translate-x-0 opacity-100" : "translate-x-[500px] opacity-0"
          }`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">Login Successful!</h3>
          <p className="text-sm text-gray-600">Redirecting to home page...</p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-md bg-white/95 shadow-2xl border-white/20">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-20 w-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                <Image src="/images/logo.png" alt="RN HOTEL Logo" fill className="object-contain" />
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">RN HOTEL</CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Sign in to your premium hotel account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-2">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                {isUnverified && (
                  <Link
                    href={`/verify?email=${encodeURIComponent(email)}`}
                    className="text-xs font-bold text-blue-600 hover:underline ml-7 transition-all"
                  >
                    Verify your account now →
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] px-1">
              <label className="flex items-center group cursor-pointer text-gray-600">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer" />
                <span className="ml-1.5 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 font-black hover:text-blue-700 hover:underline transition-all">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
