'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log('Logged in:', response);
      window.location.href = '/';
    } catch (err) {
      console.error('Login error', err);
      const message = (err as any)?.response?.data?.message || (err as any)?.message || 'Invalid email or password';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/bg-image.avif')" }}
    >
      <div className="absolute  bg-black/30 "></div>

      <main className="relative z-10 w-full max-w-2xl px-4">
        <div className="mx-auto max-w-md">
          <div className="bg-white/95 rounded-2xl p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <div className="w-20 h-20 rounded-xl bg-white p-3 flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.12)]">
                  <img src="/images/logo.png" alt="RN HOTEL" className="object-contain w-full h-full" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">RN HOTEL</h1>
              <p className="text-sm text-gray-500 mb-6 text-center">Sign in to your premium hotel management dashboard</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm w-full">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="rothana@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="•••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 pr-12 h-12 bg-blue-50 border-transparent focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Remember me</span>
                  </label>
                  <Link href="#" className="text-blue-600 hover:underline">Forgot password?</Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:opacity-95"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 font-medium">Create one</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}