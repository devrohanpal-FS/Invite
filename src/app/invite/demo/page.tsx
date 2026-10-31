'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAM_SOFIA_INVITATION, VEER_ZARA_INVITATION, DEFAULT_INVITATION } from '@/lib/storage';
import RoyalMonarchView from '@/components/RoyalMonarchView';
import VeerZaraView from '@/components/VeerZaraView';
import InvitationView from '@/components/InvitationView';
import PhoneMockup from '@/components/PhoneMockup';
import Link from 'next/link';
import { ArrowLeft, Edit3, Sparkles } from 'lucide-react';

function DemoInviteContent() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') || 'royal-monarch';
  const type = searchParams.get('type') || 'engagement';

  let inviteData = SAM_SOFIA_INVITATION;
  if (template === 'veer-zara') {
    inviteData = VEER_ZARA_INVITATION;
  } else if (template === 'royal-monarch' || template === 'royal-majesty') {
    inviteData = SAM_SOFIA_INVITATION;
  } else {
    inviteData = DEFAULT_INVITATION;
  }

  const [invite, setInvite] = useState(inviteData);

  return (
    <div className="min-h-screen bg-[#0d1824] flex flex-col items-center justify-center p-2 sm:p-6 selection:bg-[#38bdf8] selection:text-white">
      
      {/* Top Floating Utility Bar */}
      <div className="w-full max-w-[430px] mb-3 flex items-center justify-between text-xs text-slate-300 px-2 gap-2">
        <Link
          href="/templates?type=engagement&collection=royal"
          className="hover:text-sky-300 flex items-center gap-1.5 transition-colors font-medium bg-black/40 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Templates</span>
        </Link>

        {/* Quick Demo Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15">
          <Link
            href="/invite/demo?template=royal-monarch&type=engagement"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              template === 'royal-monarch' || template === 'royal-majesty'
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Lakeside
          </Link>
          <Link
            href="/invite/demo?template=veer-zara&type=wedding"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              template === 'veer-zara'
                ? 'bg-rose-500 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sunset Rose
          </Link>
          <Link
            href="/invite/demo?template=palace-grandeur&type=wedding"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              template === 'palace-grandeur'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Palace
          </Link>
        </div>

        <Link
          href={`/create?template=${template}&type=${type}`}
          className="hover:text-white bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Use Design</span>
          <span className="sm:hidden">Use</span>
        </Link>
      </div>

      {/* Smartphone Frame Simulation */}
      <PhoneMockup>
        {template === 'veer-zara' ? (
          <VeerZaraView
            invite={invite}
            showCurtainInitial={true}
            onUpdateRSVP={(data) => {
              alert(`RSVP Confirmed for ${data.name}!`);
            }}
          />
        ) : template === 'royal-monarch' || template === 'royal-majesty' ? (
          <RoyalMonarchView
            invite={invite}
            showCurtainInitial={true}
            onUpdateRSVP={(data) => {
              alert(`RSVP Confirmed for ${data.name}!`);
            }}
          />
        ) : (
          <InvitationView
            invite={invite}
            showGatesInitial={true}
          />
        )}
      </PhoneMockup>

      {/* Bottom Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-sky-200/80 font-serif">
          ✨ {template === 'veer-zara' ? (
            <><strong>Veer & Zara (Sunset Terrace)</strong> • Doves & Roses • Scratch 60% for Heart Rain</>
          ) : template === 'royal-monarch' ? (
            <><strong>Royal Monarch (Celestial Lakeside)</strong> • Italian Lake Vista • Scratch 60% for Heart Rain</>
          ) : (
            <><strong>Royal Palace Grandeur</strong> • Golden Ballroom • 3D Royal Gates Reveal</>
          )}
        </p>
      </div>

    </div>
  );
}

export default function DemoInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1824] flex items-center justify-center text-xs text-sky-200">Loading Royal Demo...</div>}>
      <DemoInviteContent />
    </Suspense>
  );
}
