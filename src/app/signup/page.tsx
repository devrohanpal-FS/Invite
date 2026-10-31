'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { registerUser } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please verify both passwords.');
      return;
    }

    const res = registerUser(fullName, email, password);
    if (!res.success) {
      setError(res.error || 'Registration failed. Please check your details.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/create');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col justify-between p-4 selection:bg-[#722f37] selection:text-[#fff8e7]">
      
      {/* Header */}
      <div className="pt-8 text-center space-y-1">
        <Link href="/" className="font-serif font-bold text-3xl text-[#722f37] tracking-wider hover:opacity-90 inline-block">
          Zareqia
        </Link>
        <p className="text-xs text-[#7d6f6a]">Create your host account to start designing your event invite</p>
      </div>

      {/* Main Signup Card */}
      <main className="w-full max-w-md mx-auto my-6">
        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-8 shadow-xl shadow-[#722f37]/5 space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Account created successfully! Redirecting to studio editor...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#2b2220] font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohan Pal"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#722f37] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#2b2220] font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#722f37] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#2b2220] font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#722f37] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#7d6f6a]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#2b2220] font-medium mb-1">
                Re-enter Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#722f37] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={success}
              className="w-full py-3 bg-[#b8860b] hover:bg-[#9a7009] text-[#fff8e7] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <Heart className="w-3.5 h-3.5 fill-[#fff8e7]" />
              <span>{success ? 'Creating Account...' : 'Create Account & Start Creating'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-[#7d6f6a] pt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-[#b8860b] font-bold hover:underline">
              Login
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e8dcc6] py-8 text-center space-y-4 text-xs text-[#7d6f6a]">
        <p className="font-serif font-bold text-base text-[#722f37] tracking-wider">
          Zareqia
        </p>
        <div className="flex flex-wrap justify-center gap-5 text-[11px] text-[#5f524e] font-medium">
          <Link href="/about" className="hover:text-[#722f37]">About</Link>
          <Link href="/contact" className="hover:text-[#722f37]">Contact</Link>
          <Link href="/terms" className="hover:text-[#722f37]">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-[#722f37]">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-[#722f37]">Refund Policy</Link>
        </div>
        <p className="text-[10px] text-[#9a8c87]">
          © 2026 Zareqia. Crafted with love. Digital invitation service • No physical products shipped.
        </p>
      </footer>

    </div>
  );
}
