import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col justify-between selection:bg-[#722f37] selection:text-[#fff8e7]">
      <header className="w-full px-6 py-4 border-b border-[#e8dcc6] bg-[#fbf8f1]/90 backdrop-blur-md flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-2xl text-[#722f37] tracking-wider">
          Zareqia
        </Link>
        <Link href="/" className="text-xs font-semibold text-[#7d6f6a] hover:text-[#722f37] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">Our Mission</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2b2220]">About Zareqia Studio</h1>
          <p className="text-xs text-[#7d6f6a] max-w-md mx-auto">
            Crafting India&apos;s most immersive, interactive digital celebration invitations.
          </p>
        </div>

        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-6 sm:p-8 space-y-5 text-xs text-[#5f524e] leading-relaxed shadow-lg">
          <p>
            At <strong>Zareqia</strong>, we believe every special celebration deserves an announcement as extraordinary as the love it honors. Traditional paper cards get misplaced and carry huge printing costs and ecological impact. Static PDFs lack romance and interactivity.
          </p>
          <p>
            We created a bespoke digital invitation studio where couples and event hosts can craft responsive 3D web invitations in minutes. With features like <strong>3D Palace Gates, interactive Heart Scratch Cards with auto-clear heart rain, ambient shehnai soundtracks, 1-click Google Maps navigation, direct zero-commission UPI Shagun envelopes, and real-time RSVP tracking</strong>, our invitations give guests an unforgettable royal experience from their smartphone.
          </p>
          <div className="pt-3 border-t border-[#e8dcc6] flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-[#722f37]">Crafted with love • For all celebrations</span>
            <Link href="/create" className="px-4 py-2 bg-[#722f37] text-white rounded-xl font-bold text-xs hover:bg-[#5a232b] transition-all">
              Create Your Invite Now →
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#e8dcc6] py-6 text-center text-[10px] text-[#9a8c87]">
        © 2026 Zareqia. All rights reserved.
      </footer>
    </div>
  );
}
