'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData } from '@/types/invite';
import RoyalGates from './RoyalGates';
import AudioPlayer from './AudioPlayer';
import ScratchCard from './ScratchCard';
import ShagunModal from './ShagunModal';
import RSVPForm from './RSVPForm';
import { MapPin, Navigation, Car, Heart, Share2, Sparkles, Clock } from 'lucide-react';

interface InvitationViewProps {
  invite: InvitationData;
  onUpdateRSVP?: (data: { name: string; attending: boolean; guestsCount: number; message: string }) => void;
  onUpdateShagun?: (amt: number) => void;
  showGatesInitial?: boolean;
}

// Dynamic countdown calculation helper
function getTimeRemaining(targetDateStr?: string) {
  if (!targetDateStr) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }
  let targetTime: number;
  const trimmed = targetDateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    targetTime = new Date(y, m - 1, d, 10, 0, 0).getTime();
  } else {
    targetTime = new Date(trimmed).getTime();
  }

  const now = Date.now();
  const diff = targetTime - now;
  if (isNaN(targetTime) || diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function InvitationView({
  invite,
  onUpdateRSVP,
  onUpdateShagun,
  showGatesInitial = true,
}: InvitationViewProps) {
  const [gatesUnlocked, setGatesUnlocked] = useState(!showGatesInitial);
  const [shagunOpen, setShagunOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi' | 'gu'>('en');

  // Real-time dynamic countdown timer calculated from invite.weddingDate
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(invite.weddingDate));

  useEffect(() => {
    setTimeLeft(getTimeRemaining(invite.weddingDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(invite.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [invite.weddingDate]);

  const salutations: Record<string, string> = {
    en: invite.salutation || 'Together with our families, we invite you to celebrate',
    hi: '॥ श्री गणेशाय नमः ॥ परिवार सहित सादर आमंत्रण',
    gu: '॥ શ્રી ગણેશાય નમઃ ॥ સ્નેહીજનોને હાર્દિક આમંત્રણ',
  };

  const taglines: Record<string, string> = {
    en: invite.tagline,
    hi: 'हमारे विवाह उत्सव में पधारकर वर-वधू को अपना स्नेह एवं शुभाशीर्वाद प्रदान करें।',
    gu: 'અમારા શુભ લગ્ન પ્રસંગે પધારી નવદંપતીને આપના આશીર્વાદ આપશો.',
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `💍 *Wedding Invitation: ${invite.groomName} & ${invite.brideName}*\n\nYou are warmly invited to celebrate with us in ${invite.city}!\n\nOpen your personal interactive 3D invitation card here:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Determine theme styles (Default to Celestial Lakeside or Royal Staircase based on theme)
  const isSkyTheme = invite.theme === 'bloom' || invite.slug.includes('sam') || invite.slug.includes('sofia');
  const bgGradient = isSkyTheme
    ? 'bg-gradient-to-b from-[#b8daf8] via-[#d4e9fc] to-[#f0f7fe]'
    : 'bg-gradient-to-b from-[#3b1118] via-[#5c1d27] to-[#1c080c]';

  const glassCard = 'backdrop-blur-xl bg-white/20 border border-white/35 shadow-2xl';
  const textTitleColor = isSkyTheme ? 'text-[#1e3a5f]' : 'text-amber-100';
  const textSubColor = isSkyTheme ? 'text-[#335c8d]' : 'text-amber-200/90';

  return (
    <div className={`relative w-full h-full min-h-screen min-h-[100dvh] flex flex-col overflow-hidden text-slate-100 ${bgGradient}`}>
      
      {/* 3D Palace Gate Opening Overlay */}
      {!gatesUnlocked && (
        <RoyalGates
          groomName={invite.groomName}
          brideName={invite.brideName}
          onOpen={() => setGatesUnlocked(true)}
        />
      )}

      {/* Main Scrollable Invitation Page */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 overscroll-contain max-w-2xl mx-auto w-full">
        
        {/* Sticky Music & Language Bar (Glassmorphic) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <AudioPlayer title={invite.musicTitle} musicUrl={invite.musicUrl} autoPlay={gatesUnlocked} />
          </div>
          
          <select
            value={activeLanguage}
            onChange={(e) => setActiveLanguage(e.target.value as 'en' | 'hi' | 'gu')}
            className="backdrop-blur-xl bg-black/40 text-amber-300 text-[10px] font-bold rounded-full px-3 py-1.5 border border-white/30 focus:outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Hero Couple Section (Matching Sam & Sofia in Image 1 & 2) */}
        <div className="text-center pt-3 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md bg-white/20 border border-white/40 text-xs font-serif shadow-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span className={textSubColor}>Ring Ceremony & Wedding</span>
          </div>

          <p className={`text-[11px] font-serif tracking-[0.25em] uppercase font-bold ${textSubColor}`}>
            {salutations[activeLanguage]}
          </p>

          <h2
            style={{ fontFamily: invite.fontFamily || undefined }}
            className={`text-3xl md:text-4xl font-serif font-black tracking-wider ${textTitleColor}`}
          >
            {invite.groomName} <span className="text-amber-400 italic font-normal">&</span> {invite.brideName}
          </h2>

          <p className={`text-xs italic max-w-xs mx-auto leading-relaxed ${textSubColor}`}>
            {taglines[activeLanguage]}
          </p>
        </div>

        {/* Photo Gallery Frame (Glassmorphism Frame - Unobstructed Photo) */}
        <div className="relative mx-auto max-w-[290px] rounded-3xl p-3 backdrop-blur-xl bg-white/20 border-2 border-white/40 shadow-2xl shadow-black/20 text-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-900/40 to-slate-900/60 border border-white/30">
            {invite.couplePhoto ? (
              <div className="relative">
                <img
                  src={invite.couplePhoto}
                  alt={`${invite.groomName} & ${invite.brideName}`}
                  className="w-full h-72 object-cover object-top rounded-2xl"
                />
                {invite.photoSubtitle && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-6 pb-2.5 px-3 rounded-b-2xl">
                    <p className="text-[11px] text-amber-200 font-sans italic tracking-wide">
                      {invite.photoSubtitle}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-4xl mb-2">💍</span>
                <p
                  style={{ fontFamily: invite.fontFamily || undefined }}
                  className="font-serif font-bold text-amber-200 text-base"
                >
                  {invite.groomName} &amp; {invite.brideName}
                </p>
                <p className="text-[11px] text-slate-200 italic mt-1">
                  {invite.photoSubtitle || 'Two Hearts, One Journey • Forever Begins Today'}
                </p>
                <div className="mt-3 px-3 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/30 text-[10px] text-amber-300 font-mono">
                  ✦ {invite.weddingDate} ✦
                </div>
              </div>
            )}
          </div>
          {invite.photoSubtitle && !invite.couplePhoto && (
            <p className="text-xs text-amber-200/90 italic font-sans mt-2">
              &ldquo;{invite.photoSubtitle}&rdquo;
            </p>
          )}
        </div>

        {/* INTERACTIVE HEART SCRATCH CARD (60% AUTO-CLEAR + HEART RAIN) */}
        <ScratchCard
          weddingDate={invite.weddingDate}
          venueCity={invite.city}
          shape="heart"
          accentColor={isSkyTheme ? '#38bdf8' : '#c59b2d'}
          onFullyRevealed={() => {
            // Heart burst trigger completed
          }}
        />

        {/* REAL-TIME COUNTDOWN TIMER (Glassmorphism Pill Cards - Image 1 & 2) */}
        <div className={`p-4 rounded-3xl ${glassCard} text-center space-y-3`}>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-serif uppercase tracking-widest text-amber-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Counting Down To Forever</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="backdrop-blur-md bg-black/35 border border-white/20 rounded-2xl p-2.5 shadow-inner">
              <span className="text-2xl font-bold font-serif text-amber-200">{timeLeft.days}</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-300 mt-0.5">Days</span>
            </div>
            <div className="backdrop-blur-md bg-black/35 border border-white/20 rounded-2xl p-2.5 shadow-inner">
              <span className="text-2xl font-bold font-serif text-amber-200">{timeLeft.hours}</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-300 mt-0.5">Hours</span>
            </div>
            <div className="backdrop-blur-md bg-black/35 border border-white/20 rounded-2xl p-2.5 shadow-inner">
              <span className="text-2xl font-bold font-serif text-amber-200">{timeLeft.mins}</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-300 mt-0.5">Mins</span>
            </div>
            <div className="backdrop-blur-md bg-black/35 border border-white/20 rounded-2xl p-2.5 shadow-inner">
              <span className="text-2xl font-bold font-serif text-amber-400">{timeLeft.secs}</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-300 mt-0.5">Secs</span>
            </div>
          </div>
        </div>

        {/* PROGRAM TIMELINE (Glassmorphism Event Schedule) */}
        <div className="space-y-3">
          <h3 className="text-center font-serif text-sm tracking-widest text-amber-300 uppercase font-bold">
            Program Timeline
          </h3>

          {invite.events.map((ev) => (
            <div
              key={ev.id}
              className={`p-4 rounded-2xl ${glassCard} border-l-4 border-amber-400 space-y-1.5`}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-amber-100 flex items-center gap-1.5">
                  <span>{ev.icon || '✨'}</span>
                  <span>{ev.title}</span>
                </h4>
                <span className="text-[10px] backdrop-blur-md bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {ev.time}
                </span>
              </div>
              <p className="text-xs text-slate-200">{ev.date} • {ev.venue}</p>
              {ev.dressCode && (
                <p className="text-[11px] text-amber-300/80 italic">Dress Code: {ev.dressCode}</p>
              )}
            </div>
          ))}
        </div>

        {/* VENUE & MAPS (Glassmorphism Venue Card) */}
        <div className={`p-5 rounded-3xl ${glassCard} text-center space-y-3`}>
          <div className="w-10 h-10 rounded-full backdrop-blur-md bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-amber-200 text-base">{invite.venueName}</h4>
            <p className="text-xs text-slate-200 mt-0.5">{invite.venueAddress}</p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <a
              href={invite.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(invite.venueName + ' ' + invite.venueAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
            <button
              onClick={() => alert(`Opening cab app with destination set to: ${invite.venueName}!`)}
              className="flex-1 py-2.5 rounded-xl backdrop-blur-md bg-black/40 border border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-black/60 transition-all cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book Cab</span>
            </button>
          </div>
        </div>

        {/* DIGITAL SHAGUN UPI ENVELOPE (Glassmorphic) */}
        <div className={`p-5 rounded-3xl ${glassCard} text-center space-y-3 relative overflow-hidden`}>
          <div className="flex items-center justify-center gap-1.5 text-amber-300 font-serif font-bold text-sm">
            <span>🎁</span>
            <span>Send Digital Shagun & Blessings</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Cannot attend in person? Send your heartfelt shagun directly to {invite.groomName} & {invite.brideName} via UPI.
          </p>

          <button
            onClick={() => setShagunOpen(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✉️</span> Open Digital Shagun Envelope
          </button>
        </div>

        {/* INTERACTIVE RSVP FORM */}
        <RSVPForm
          onSubmitRSVP={(data) => {
            if (onUpdateRSVP) onUpdateRSVP(data);
          }}
        />

        {/* WHATSAPP SHARE CTA */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <Share2 className="w-4 h-4" />
          <span>Share This Invite on WhatsApp</span>
        </button>

        {/* FOOTER MESSAGE (Matching Image 1 & 2) */}
        <div className="pt-4 pb-8 text-center space-y-2">
          <p className="font-serif italic text-base text-amber-200">
            &ldquo;We can&apos;t wait to celebrate with you!&rdquo;
          </p>
          <p className="font-serif font-bold text-amber-300 text-xs tracking-wider">
            {invite.groomName} & {invite.brideName}
          </p>
        </div>

      </div>

      {/* Shagun Modal */}
      <ShagunModal
        isOpen={shagunOpen}
        onClose={() => setShagunOpen(false)}
        upiId={invite.shagunUpiId}
        coupleNames={`${invite.groomName} & ${invite.brideName}`}
        qrImageUrl={invite.shagunQrCode || '/images/upi-qr.jpg'}
        onSuccess={(amt) => {
          if (onUpdateShagun) onUpdateShagun(amt);
        }}
      />
    </div>
  );
}
