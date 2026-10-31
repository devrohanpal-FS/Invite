import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Gift } from 'lucide-react';

export default function AffiliatePage() {
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
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">Partnership</span>
          <h1 className="text-3xl font-serif font-bold text-[#2b2220]">Become an Affiliate Partner</h1>
          <p className="text-xs text-[#7d6f6a]">Earn 30% commission per referral with India&apos;s luxury invitation studio</p>
        </div>

        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-[#5f524e] leading-relaxed shadow-lg">
          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">For Wedding Planners &amp; Creators</h2>
            <p>Are you a wedding photographer, event planner, or lifestyle influencer? Recommend Zareqia digital invitations to your couples and earn generous payouts on every card created.</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">How It Works</h2>
            <p>1. Sign up for our affiliate partner program.<br />2. Share your custom referral link or partner promo code.<br />3. Receive direct weekly bank payouts for every published celebration invite.</p>
          </section>

          <div className="pt-2 text-center">
            <Link href="/contact" className="inline-block px-6 py-2.5 bg-[#722f37] text-white rounded-xl font-bold text-xs hover:bg-[#5a232b] transition-all">
              Apply to Partner Program →
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
