import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col justify-between selection:bg-[#722f37] selection:text-[#fff8e7]">
      <header className="w-full px-6 py-4 border-b border-[#e8dcc6] bg-[#fbf8f1]/90 backdrop-blur-md flex items-center justify-between">
        <Link to="/" className="font-serif font-bold text-2xl text-[#722f37] tracking-wider">
          Zareqia
        </Link>
        <Link to="/" className="text-xs font-semibold text-[#7d6f6a] hover:text-[#722f37] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 py-12 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">Your Privacy</span>
          <h1 className="text-3xl font-serif font-bold text-[#2b2220]">Privacy Policy</h1>
          <p className="text-xs text-[#7d6f6a]">How we protect and respect your wedding &amp; guest data</p>
        </div>

        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-[#5f524e] leading-relaxed shadow-lg">
          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">Information We Collect</h2>
            <p>We collect event host contact information and event details entered during invitation creation (such as couple names, wedding dates, venues, and media uploads). We collect guest names, headcount, and wishes entered via the RSVP form.</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">How We Use Your Data</h2>
            <p>Your data is used solely to generate, host, and display your personalized digital invitation and populate your private host analytics dashboard. We never sell your personal data or your guests&apos; contact details to third-party advertisers.</p>
          </section>

          <section className="space-y-1">
            <h2 className="font-bold text-sm text-[#2b2220]">Data Security</h2>
            <p>All communication is secured via industry standard HTTPS encryption. Your uploaded photographs and media are served through optimized secure content delivery networks.</p>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-[#e8dcc6] py-6 text-center text-[10px] text-[#9a8c87]">
        © 2026 Zareqia. All rights reserved.
      </footer>
    </div>
  );
}
