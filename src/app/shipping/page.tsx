import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ShippingPage() {
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
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">Delivery</span>
          <h1 className="text-3xl font-serif font-bold text-[#2b2220]">Shipping &amp; Delivery Policy</h1>
          <p className="text-xs text-[#7d6f6a]">Digital Delivery Service • Zero Physical Shipping</p>
        </div>

        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-[#5f524e] leading-relaxed shadow-lg">
          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">100% Digital Delivery</h2>
            <p>Zareqia is an eco-friendly digital invitation studio. We do not manufacture or ship physical paper invitation cards, boxes, or parcels.</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">Instant Fulfillment</h2>
            <p>Your unique invitation webpage link is generated instantly upon creation. You receive real-time access to share via WhatsApp, SMS, and email immediately with zero shipping delay.</p>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-[#e8dcc6] py-6 text-center text-[10px] text-[#9a8c87]">
        © 2026 Zareqia. All rights reserved.
      </footer>
    </div>
  );
}
