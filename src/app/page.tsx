'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEMPLATES } from '@/lib/templates';
import { getCurrentUser, logoutUser, User } from '@/lib/auth';
import {
  Sparkles,
  Crown,
  ArrowRight,
  Check,
  X,
  Star,
  ChevronDown,
  Eye,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'wedding' | 'birthday' | 'anniversary'>('wedding');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Filter templates for current category (exactly 3 designs per category)
  const currentTemplates = TEMPLATES.filter((t) => t.category === selectedCategory);

  const faqs = [
    {
      q: 'How does the digital webpage invitation work?',
      a: 'Instead of sending a heavy video or static PDF, you receive a beautiful unique link (e.g. invite.com/sam-sofia). When guests open the link on WhatsApp, they experience a 3D animated opening, live background music, Google Maps venue directions, an interactive heart scratch card, and an RSVP form.',
    },
    {
      q: 'What happens when guests scratch the card?',
      a: 'Our signature interactive Heart Scratch Card allows guests to scratch the date. Once 60% is scratched, an automated Heart Rain burst effect triggers, clearing the remaining 40% smoothly and revealing the full celebration date.',
    },
    {
      q: 'How does the Digital Shagun UPI feature work?',
      a: 'Guests who cannot attend or wish to gift money can tap "Send Shagun" on your webpage. An animated golden envelope unfolds showing your direct UPI QR code (GPay, PhonePe, Paytm). 100% of the money goes straight to your bank account with zero platform commission.',
    },
    {
      q: 'Can I edit the details after sharing the link?',
      a: 'Yes, absolutely! You have unlimited edits. If the wedding timing, venue hall, or schedule changes, simply update it in your dashboard, and the live link immediately reflects the changes for all guests.',
    },
    {
      q: 'Is there a limit on how many guests can view the link?',
      a: 'No limits! Your one-time payment covers unlimited guests and unlimited page views. Share it with 50 guests or 5,000 guests at no extra charge.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col justify-between selection:bg-[#722f37] selection:text-[#fff8e7]">
      
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR                                            */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#fbf8f1]/90 backdrop-blur-md border-b border-[#e8dcc6]/80 px-4 md:px-8 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-serif font-bold text-2xl text-[#722f37] tracking-wider group-hover:opacity-90 transition-opacity">
              Zareqia
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#e8dcc6] text-[#722f37] font-semibold">
              Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide text-[#5f524e]">
            <a href="#templates" className="hover:text-[#722f37] transition-colors">Catalog (3 Per Category)</a>
            <a href="#features" className="hover:text-[#722f37] transition-colors">Features</a>
            <a href="#comparison" className="hover:text-[#722f37] transition-colors">Paper vs Digital</a>
            <a href="#pricing" className="hover:text-[#722f37] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#722f37] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#722f37] bg-[#e8dcc6] px-3 py-1.5 rounded-xl">
                  👤 {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-[#7d6f6a] hover:text-[#722f37] transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-[#722f37] hover:text-[#531f25] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#722f37] border border-[#d7c5a4] rounded-xl hover:bg-[#e8dcc6] transition-colors hidden sm:inline-block"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-xl bg-[#722f37] hover:bg-[#5a232b] text-[#fff8e7] text-xs font-bold shadow-md shadow-[#722f37]/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Create Invite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative pt-16 pb-20 px-4 text-center overflow-hidden bg-gradient-to-b from-[#fff8e7]/90 via-[#fbf8f1] to-[#fbf8f1]">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8dcc6]/80 border border-[#d7c5a4] text-[#722f37] text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b2d]" />
            <span>Interactive 3D Glassmorphism Invitations</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-[#2b2220] tracking-tight leading-[1.15]">
            Create All Events Invitation{' '}
            <span className="italic font-normal text-[#c59b2d] block md:inline font-serif">
              Webpage Online
            </span>{' '}
            in Minutes
          </h1>

          <p className="text-sm md:text-base text-[#5f524e] max-w-2xl mx-auto leading-relaxed">
            Just enter your details and your invitation card is instantly ready. Featuring 3D Palace Gate openings,
            Heart Scratch Cards with auto-clear rain effect, Glassmorphism UI, and direct WhatsApp sharing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#722f37] hover:bg-[#5a232b] text-[#fff8e7] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#722f37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CREATE INVITATION NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#templates"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#f2ebe0] hover:bg-[#e8dcc6] text-[#722f37] font-bold text-xs uppercase tracking-wider border border-[#d7c5a4] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE 9 DESIGNS</span>
            </a>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-[#7d6f6a] font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#722f37]" /> One-Time Fee (₹1,499)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#722f37]" /> Unlimited Guests
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#722f37]" /> Unlimited Edits
            </span>
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 3. 3 DISTINCT DESIGNS PER CATEGORY (User Request!)       */}
      {/* ======================================================== */}
      <section id="templates" className="py-20 px-4 bg-[#f5eee1]/70 border-y border-[#e8dcc6]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">
              Turnkey Templates
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2b2220]">
              3 Signature Designs for Every Event
            </h2>
            <p className="text-xs text-[#7d6f6a] max-w-md mx-auto">
              Choose your category below. Select a design, enter your info, and your live invite link is ready instantly!
            </p>

            {/* Category Selector Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <button
                onClick={() => setSelectedCategory('wedding')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'wedding'
                    ? 'bg-[#722f37] text-[#fff8e7] shadow-md'
                    : 'bg-[#fff8e7] text-[#5f524e] border border-[#d7c5a4] hover:bg-[#e8dcc6]'
                }`}
              >
                <span>💍</span>
                <span>Weddings (3 Designs)</span>
              </button>

              <button
                onClick={() => setSelectedCategory('birthday')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'birthday'
                    ? 'bg-[#722f37] text-[#fff8e7] shadow-md'
                    : 'bg-[#fff8e7] text-[#5f524e] border border-[#d7c5a4] hover:bg-[#e8dcc6]'
                }`}
              >
                <span>🎂</span>
                <span>Birthdays (3 Designs)</span>
              </button>

              <button
                onClick={() => setSelectedCategory('anniversary')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'anniversary'
                    ? 'bg-[#722f37] text-[#fff8e7] shadow-md'
                    : 'bg-[#fff8e7] text-[#5f524e] border border-[#d7c5a4] hover:bg-[#e8dcc6]'
                }`}
              >
                <span>🥂</span>
                <span>Anniversaries & Rings (3 Designs)</span>
              </button>
            </div>
          </div>

          {/* 3 Designs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {currentTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group relative rounded-3xl overflow-hidden bg-[#fff8e7] border-2 border-[#e8dcc6] hover:border-[#722f37] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Visual Header Mockup */}
                <div className={`h-64 ${tpl.bgStyle} p-4 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${tpl.badgeColor}`}>
                      {tpl.tag}
                    </span>
                    <span className="text-2xl">{tpl.coverImage}</span>
                  </div>

                  {/* Centered Graphic Emblem */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white/60 mx-auto flex items-center justify-center font-serif text-white text-lg shadow-xl backdrop-blur-md bg-white/20">
                      {tpl.coverImage}
                    </div>
                    <span className="text-[11px] font-serif tracking-widest uppercase mt-2 block font-bold text-white drop-shadow">
                      Glassmorphism UI
                    </span>
                  </div>

                  {/* View Demo Button */}
                  <div className="flex justify-center">
                    <Link
                      href={
                        tpl.id === 'veer-zara'
                          ? '/i/veer-zara'
                          : tpl.id === 'celestial-lakeside'
                          ? '/i/sam-sofia'
                          : '/i/kabir-ananya'
                      }
                      className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-[11px] font-semibold text-white hover:bg-black/80 transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Live 3D Preview</span>
                    </Link>
                  </div>
                </div>

                {/* Card Info & CTA */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-[#2b2220] text-base">{tpl.name}</h3>
                    <p className="text-xs text-[#7d6f6a] mt-1 leading-relaxed">{tpl.desc}</p>
                  </div>

                  <Link
                    href={`/create?template=${tpl.id}`}
                    className="block w-full py-2.5 bg-[#722f37] hover:bg-[#5a232b] text-[#fff8e7] text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Use This Design →
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. PAPER VS DIGITAL COMPARISON                           */}
      {/* ======================================================== */}
      <section id="comparison" className="py-20 px-4 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">
            The Smarter Choice
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2b2220]">
            Paper vs. Digital Webpage
          </h2>
        </div>

        <div className="rounded-3xl bg-[#fff8e7] border border-[#e8dcc6] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8dcc6] bg-[#f2ebe0]/80">
                  <th className="p-4 font-serif font-bold text-[#2b2220] text-sm">Feature</th>
                  <th className="p-4 font-serif font-bold text-[#7d6f6a] text-sm">Paper Cards</th>
                  <th className="p-4 font-serif font-bold text-[#722f37] text-sm bg-[#e8dcc6]/40">
                    Zareqia Webpage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dcc6]">
                <tr>
                  <td className="p-4 font-semibold text-[#2b2220]">Total Cost</td>
                  <td className="p-4 text-[#7d6f6a]">₹25,000 – ₹80,000+</td>
                  <td className="p-4 font-bold text-[#722f37] bg-[#e8dcc6]/20">₹1,499 Flat</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#2b2220]">Heart Scratch Card</td>
                  <td className="p-4 text-rose-500 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> Static print
                  </td>
                  <td className="p-4 font-bold text-emerald-700 bg-[#e8dcc6]/20 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 60% Auto-Clear + Heart Rain
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#2b2220]">Venue GPS Navigation</td>
                  <td className="p-4 text-rose-500 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> Not possible
                  </td>
                  <td className="p-4 font-bold text-emerald-700 bg-[#e8dcc6]/20 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 1-Click Google Maps & Uber
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#2b2220]">RSVP Attendance Tracking</td>
                  <td className="p-4 text-rose-500 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> Manual phone calls
                  </td>
                  <td className="p-4 font-bold text-emerald-700 bg-[#e8dcc6]/20 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Real-time Host Dashboard
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#2b2220]">Digital Shagun UPI</td>
                  <td className="p-4 text-rose-500 font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" /> Not possible
                  </td>
                  <td className="p-4 font-bold text-emerald-700 bg-[#e8dcc6]/20 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Direct QR Envelope (0% fee)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. FAQ ACCORDION                                         */}
      {/* ======================================================== */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">
            Got Questions?
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2b2220]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#fff8e7] border border-[#e8dcc6] overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex justify-between items-center text-xs md:text-sm font-serif font-bold text-[#2b2220] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#722f37] transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-[#5f524e] leading-relaxed border-t border-[#f2ebe0] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ======================================================== */}
      {/* 6. MINIMALIST FOOTER                                     */}
      {/* ======================================================== */}
      <footer className="w-full border-t border-[#e8dcc6] py-10 px-4 text-center space-y-4 bg-[#fbf8f1] text-[#7d6f6a] text-xs">
        <p className="font-serif font-bold text-lg text-[#722f37] tracking-wider">
          Zareqia
        </p>

        <div className="flex flex-wrap justify-center gap-6 font-medium text-[11px] text-[#5f524e]">
          <Link href="/about" className="hover:text-[#722f37]">About</Link>
          <Link href="/contact" className="hover:text-[#722f37]">Contact</Link>
          <Link href="/terms" className="hover:text-[#722f37]">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-[#722f37]">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-[#722f37]">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-[#722f37]">Shipping & Delivery</Link>
          <Link href="/affiliate" className="hover:text-[#722f37]">Become an Affiliate</Link>
        </div>

        <p className="text-[10px] text-[#9a8c87] pt-2">
          © 2026 Zareqia. Crafted with love. Digital invitation service • No physical products shipped.
        </p>
      </footer>

    </div>
  );
}
