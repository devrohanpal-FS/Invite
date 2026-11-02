import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react';

export default function ContactPage() {
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

      <main className="max-w-2xl mx-auto w-full px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#722f37]">Get in Touch</span>
          <h1 className="text-3xl font-serif font-bold text-[#2b2220]">Contact Celebration Concierge</h1>
          <p className="text-xs text-[#7d6f6a] max-w-sm mx-auto">
            Have questions about custom themes, bulk events, or technical help? We are here for you 24/7.
          </p>
        </div>

        <div className="bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-[#5f524e] shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#fbf8f1] border border-[#e8dcc6]">
              <div className="w-9 h-9 rounded-xl bg-[#722f37]/10 text-[#722f37] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#2b2220]">Email Support</p>
                <p className="text-[#7d6f6a]">support@zareqia.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#fbf8f1] border border-[#e8dcc6]">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#2b2220]">WhatsApp Concierge</p>
                <p className="text-[#7d6f6a]">+91 98765 43210 (Mon-Sun, 9 AM – 9 PM IST)</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link to="/create" className="inline-block px-6 py-2.5 bg-[#722f37] text-white rounded-xl font-bold text-xs hover:bg-[#5a232b] transition-all">
              Start Designing Now
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
