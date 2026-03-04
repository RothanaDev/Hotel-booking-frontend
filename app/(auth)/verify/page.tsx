"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, resendVerification } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { CheckCircle, X, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            router.push('/register');
        }
    }, [email, router]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newCode = [...code];
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otp = code.join('');
        if (otp.length !== 6 || !email) return;

        setIsLoading(true);
        setError('');

        try {
            await verifyEmail({ email, verifiedCode: otp });
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Verification failed. Please check the code.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || !email) return;

        setIsResending(true);
        setError('');

        try {
            await resendVerification({ email });
            setCountdown(60);
            // Optional: show a mini toast for resend success
        } catch (err: any) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    if (!email) return null;

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 relative overflow-hidden"
            style={{ backgroundImage: "url('/images/bg-image.avif')" }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Success Toast */}
            <div
                className={`fixed top-5 right-5 bg-white rounded-xl shadow-2xl border border-green-100 p-4 flex items-start gap-3 min-w-[320px] transition-all duration-500 z-50 ${success ? "translate-x-0 opacity-100" : "translate-x-[500px] opacity-0"
                    }`}
            >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">Email Verified!</h3>
                    <p className="text-sm text-gray-600">Your account is now active. Redirecting...</p>
                </div>
            </div>

            <main className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Verify Your Email</h1>
                    <p className="text-sm text-gray-500 mb-8">
                        We've sent a 6-digit verification code to <br />
                        <span className="font-bold text-slate-800">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                            <X className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold bg-blue-50/50 border-2 border-transparent focus:border-blue-400 focus:ring-0 transition-all rounded-xl text-slate-900"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || code.some(d => !d) || success}
                            className="w-full py-3.5 rounded-xl text-sm text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                'Verify Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 space-y-4">
                        <p className="text-sm text-gray-500">
                            Didn't receive the code?{' '}
                            {countdown > 0 ? (
                                <span className="text-blue-600 font-bold">Resend in {countdown}s</span>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                                >
                                    {isResending ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                        'Resend Code'
                                    )}
                                </button>
                            )}
                        </p>

                        <Link href="/register" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to registration
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
