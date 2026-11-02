'use client';

import React, { useState, useEffect } from 'react';
import { InvitationData } from '@/types/invite';
import ScratchCard from './ScratchCard';
import ShagunModal from './ShagunModal';
import RSVPForm from './RSVPForm';
import AudioPlayer from './AudioPlayer';
import {
  Heart,
  MapPin,
  Navigation,
  Car,
  Clock,
  Share2,
  Sparkles,
  Gift,
  Calendar,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface RoyalMonarchProps {
  invite: InvitationData;
  onUpdateRSVP?: (data: { name: string; attending: boolean; guestsCount: number; message: string }) => void;
  onUpdateShagun?: (amt: number) => void;
  showCurtainInitial?: boolean;
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

export default function RoyalMonarchView({
  invite,
  onUpdateRSVP,
  onUpdateShagun,
  showCurtainInitial = true,
}: RoyalMonarchProps) {
  const [curtainsOpened, setCurtainsOpened] = useState(!showCurtainInitial);
  const [shagunOpen, setShagunOpen] = useState(false);
  const [cabModalOpen, setCabModalOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'gu'>('en');

  // Real-time dynamic countdown timer calculated from invite.weddingDate
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(invite.weddingDate));

  useEffect(() => {
    setTimeLeft(getTimeRemaining(invite.weddingDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(invite.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [invite.weddingDate]);

  const handleOpenCurtains = () => {
    setCurtainsOpened(true);
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `💍 *Ring Ceremony & Wedding: ${invite.groomName} & ${invite.brideName}*\n\nTogether with our families, we invite you to celebrate with us!\n\nOpen your personal interactive invitation here:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const salutations: Record<string, string> = {
    en: 'Together with our families, we invite you to celebrate our Ring Ceremony',
    hi: '॥ श्री गणेशाय नमः ॥ हमारे सगाई एवं विवाह उत्सव में आपका हार्दिक स्वागत है',
    gu: '॥ શ્રી ગણેશાય નમઃ ॥ અમારા સગાઈ અને લગ્ન ઉત્સવમાં આપનું સ્નેહપૂર્ણ સ્વાગત છે',
  };

  return (
    <div className="relative w-full h-full min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#a9d0f5] via-[#cde4f7] to-[#eaf4fc] text-[#1c3554] flex flex-col overflow-hidden font-serif selection:bg-[#38bdf8] selection:text-white">
      
      {/* 3D DRAPED SILK CURTAINS OPENING OVERLAY */}
      {!curtainsOpened && (
        <div
          className="absolute inset-0 z-50 bg-[#16293d] flex flex-col justify-between overflow-hidden transition-all duration-1000 safe-area-top safe-area-bottom"
          style={{ perspective: '1200px' }}
        >
          {/* Top arch & pearls */}
          <div className="relative z-10 pt-10 text-center px-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/60 mx-auto flex items-center justify-center font-serif text-white text-2xl shadow-2xl backdrop-blur-md bg-white/20">
              💎
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-sky-200 mt-2 font-sans font-semibold">
              Royal Monarch • Engagement Reveal
            </p>
            <h2 className="text-3xl font-serif font-black text-white mt-1 drop-shadow-md">
              {invite.groomName} & {invite.brideName}
            </h2>
          </div>

          {/* Double Silk Draped Curtains */}
          <div className="relative flex-1 mx-4 sm:mx-auto my-2 flex overflow-hidden rounded-3xl border-2 border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.6)] max-w-xl w-full">
            {/* Left Curtain */}
            <div className="w-1/2 h-full bg-gradient-to-r from-[#22405d] via-[#355b82] to-[#4a77a5] border-r border-white/40 flex flex-col justify-between p-4 shadow-2xl relative">
              <span className="text-white/40 text-2xl">⚜</span>
              <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white text-sm font-serif">
                {invite.groomName[0]}
              </div>
              <span className="text-white/40 text-2xl">⚜</span>
            </div>

            {/* Right Curtain */}
            <div className="w-1/2 h-full bg-gradient-to-l from-[#22405d] via-[#355b82] to-[#4a77a5] border-l border-white/40 flex flex-col justify-between p-4 shadow-2xl relative items-end">
              <span className="text-white/40 text-2xl">⚜</span>
              <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white text-sm font-serif">
                {invite.brideName[0]}
              </div>
              <span className="text-white/40 text-2xl">⚜</span>
            </div>

            {/* Center Pearl Wax Seal Trigger */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
              <button
                onClick={handleOpenCurtains}
                className="group px-7 py-7 rounded-full bg-gradient-to-br from-white via-sky-100 to-sky-300 text-[#16293d] font-bold shadow-[0_0_40px_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-white cursor-pointer animate-pulse"
              >
                <span className="text-3xl">🕊️</span>
                <span className="text-[10px] tracking-widest uppercase font-serif mt-1 font-black">
                  Open Drapes
                </span>
              </button>
            </div>
          </div>

          <div className="relative z-10 pb-6 sm:pb-8 text-center px-6 max-w-xl mx-auto w-full">
            <button
              onClick={handleOpenCurtains}
              className="w-full py-3 bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl text-xs text-white font-bold tracking-wider uppercase font-sans transition-all cursor-pointer"
            >
              ✨ Tap to Enter Lakeside Ceremony
            </button>
          </div>
        </div>
      )}

      {/* Floating White Petals Animation */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-white/70 animate-float"
            style={{
              left: `${(i * 9) + 5}%`,
              top: `${(i * 8)}%`,
              fontSize: `${Math.random() * 8 + 10}px`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 relative z-20 max-w-2xl mx-auto w-full overscroll-contain">
        
        {/* Sticky Music & Language Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <AudioPlayer title={invite.musicTitle || 'Lakeside Serenade - Flute'} musicUrl={invite.musicUrl} autoPlay={curtainsOpened} />
          </div>
          
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value as 'en' | 'hi' | 'gu')}
            className="backdrop-blur-xl bg-white/40 text-[#1c3554] text-[10px] font-bold rounded-full px-3 py-1.5 border border-white/60 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Scenic Floral Arch Pergola Header (Exact Match to Image 1) */}
        <div className="text-center pt-2 space-y-2">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full backdrop-blur-md bg-white/30 border border-white/50 text-[11px] text-[#2c4c70] shadow-sm">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Ring Ceremony</span>
          </div>

          <p className="text-[11px] font-sans tracking-[0.2em] text-[#3d6594] uppercase font-semibold">
            {salutations[activeLang]}
          </p>

          <h2
            style={{ fontFamily: invite.fontFamily || undefined }}
            className="text-4xl md:text-5xl font-serif font-black tracking-widest text-[#152e4d] drop-shadow-sm uppercase"
          >
            {invite.groomName} <span className="text-sky-600 italic font-normal text-3xl">&amp;</span> {invite.brideName}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#3d6594] to-transparent mx-auto my-1"></div>

          <p className="text-xs text-[#2c4c70] italic max-w-xs mx-auto leading-relaxed">
            {invite.tagline || 'Surrounded by mountain lakes and blooming hydrangeas, we invite you to celebrate our forever love.'}
          </p>
        </div>

        {/* Couple Photo Frame (Glassmorphism Frosted Border - Unobstructed Photo) */}
        <div className="relative mx-auto max-w-[300px] rounded-3xl p-3.5 backdrop-blur-2xl bg-white/50 border-2 border-white/70 shadow-2xl shadow-sky-900/10 text-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#6ba3d6]/20 to-[#b0d5f8]/30 border border-white/50 shadow-inner">
            {invite.couplePhoto ? (
              <div className="relative">
                <img
                  src={invite.couplePhoto}
                  alt={`${invite.groomName} & ${invite.brideName}`}
                  className="w-full h-72 object-cover object-top rounded-2xl"
                />
                {invite.photoSubtitle && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/75 via-slate-900/30 to-transparent pt-6 pb-2.5 px-3 rounded-b-2xl">
                    <p className="text-[11px] text-sky-100 font-sans italic tracking-wide">
                      {invite.photoSubtitle}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-[#6ba3d6] to-[#b0d5f8]">
                <span className="text-5xl mb-2 drop-shadow-md">💍</span>
                <p
                  style={{ fontFamily: invite.fontFamily || undefined }}
                  className="font-serif font-bold text-white text-lg drop-shadow"
                >
                  {invite.groomName} &amp; {invite.brideName}
                </p>
                <p className="text-xs text-sky-100 italic font-sans mt-0.5">
                  {invite.photoSubtitle || 'Two Souls, One Forever Promise'}
                </p>
                <div className="mt-3 px-3 py-1 rounded-full backdrop-blur-md bg-white/80 border border-white text-[10px] text-[#152e4d] font-mono font-bold shadow-sm">
                  ✦ {invite.weddingDate} ✦
                </div>
              </div>
            )}
          </div>
          {invite.photoSubtitle && !invite.couplePhoto && (
            <p className="text-xs text-[#2c4c70] italic font-sans mt-2">
              &ldquo;{invite.photoSubtitle}&rdquo;
            </p>
          )}
        </div>

        {/* 10X INTERACTIVE HEART SCRATCH CARD (With 60% Auto-Clear + Heart Rain!) */}
        <ScratchCard
          weddingDate={invite.weddingDate}
          venueCity={invite.city}
          shape="heart"
          accentColor="#38bdf8"
        />

        {/* FOREVER LIVE COUNTDOWN (Image 1 Frosted Glass Pills) */}
        <div className="p-4 rounded-3xl backdrop-blur-2xl bg-white/35 border border-white/60 shadow-xl shadow-sky-900/5 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans uppercase tracking-widest text-[#2c4c70] font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Forever Begins In</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="backdrop-blur-md bg-white/50 border border-white/80 rounded-2xl p-2.5 shadow-sm">
              <span className="text-2xl font-bold font-serif text-[#152e4d]">{timeLeft.days}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#3d6594] mt-0.5 font-sans font-bold">Days</span>
            </div>
            <div className="backdrop-blur-md bg-white/50 border border-white/80 rounded-2xl p-2.5 shadow-sm">
              <span className="text-2xl font-bold font-serif text-[#152e4d]">{timeLeft.hours}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#3d6594] mt-0.5 font-sans font-bold">Hours</span>
            </div>
            <div className="backdrop-blur-md bg-white/50 border border-white/80 rounded-2xl p-2.5 shadow-sm">
              <span className="text-2xl font-bold font-serif text-[#152e4d]">{timeLeft.mins}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#3d6594] mt-0.5 font-sans font-bold">Mins</span>
            </div>
            <div className="backdrop-blur-md bg-white/50 border border-white/80 rounded-2xl p-2.5 shadow-sm">
              <span className="text-2xl font-bold font-serif text-sky-600">{timeLeft.secs}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#3d6594] mt-0.5 font-sans font-bold">Secs</span>
            </div>
          </div>
        </div>

        {/* PROGRAM TIMELINE (Frosted Glass Cards) */}
        <div className="space-y-3">
          <h3 className="text-center font-serif text-sm tracking-widest text-[#152e4d] uppercase font-bold">
            Program Timeline
          </h3>

          {invite.events.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl backdrop-blur-2xl bg-white/35 border-l-4 border-sky-500 border border-white/60 space-y-1.5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-[#152e4d] flex items-center gap-1.5">
                  <span>{ev.icon || '💎'}</span>
                  <span>{ev.title}</span>
                </h4>
                <span className="text-[10px] backdrop-blur-md bg-sky-500/20 text-[#152e4d] border border-sky-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {ev.time}
                </span>
              </div>
              <p className="text-xs text-[#2c4c70]">{ev.date} • {ev.venue}</p>
              {ev.dressCode && (
                <p className="text-[11px] text-sky-700 italic">Dress Code: {ev.dressCode}</p>
              )}
            </div>
          ))}
        </div>

        {/* VENUE & SMART NAVIGATION */}
        <div className="p-5 rounded-3xl backdrop-blur-2xl bg-white/35 border border-white/60 text-center space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-full backdrop-blur-md bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-700 mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-[#152e4d] text-base">{invite.venueName}</h4>
            <p className="text-xs text-[#2c4c70] mt-0.5">{invite.venueAddress}</p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <a
              href={invite.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(invite.venueName + ' ' + invite.venueAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:opacity-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
            <button
              type="button"
              onClick={() => setCabModalOpen(true)}
              className="flex-1 py-2.5 rounded-xl backdrop-blur-md bg-white/70 border border-sky-400 text-[#152e4d] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Car className="w-3.5 h-3.5 text-emerald-600" />
              <span>Book Cab (Uber / Ola)</span>
            </button>
          </div>
        </div>

        {/* DIGITAL SHAGUN UPI ENVELOPE (Glassmorphic) */}
        <div className="p-5 rounded-3xl backdrop-blur-2xl bg-white/35 border border-white/60 text-center space-y-3 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-[#152e4d] font-serif font-bold text-sm">
            <Gift className="w-4 h-4 text-sky-600" />
            <span>Send Digital Shagun &amp; Blessings</span>
          </div>
          <p className="text-xs text-[#2c4c70] leading-relaxed">
            Cannot attend in person? Send your heartfelt shagun directly to {invite.groomName} &amp; {invite.brideName} via UPI.
          </p>

          <button
            onClick={() => setShagunOpen(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✉️</span> Open Digital Shagun Envelope
          </button>
        </div>

        {/* INTERACTIVE RSVP FORM (Hidden for now as requested) */}
        {/*
        <RSVPForm
          onSubmitRSVP={(data) => {
            if (onUpdateRSVP) onUpdateRSVP(data);
          }}
        />
        */}

        {/* WHATSAPP SHARE CTA */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg font-sans"
        >
          <Share2 className="w-4 h-4" />
          <span>Share This Invite on WhatsApp</span>
        </button>

        {/* CLOSING FOOTER MESSAGE (Exact Match to Image 1) */}
        <div className="pt-4 pb-8 text-center space-y-2">
          <p className="font-serif italic text-lg text-[#152e4d]">
            &ldquo;We can&apos;t wait to celebrate with you!&rdquo;
          </p>
          <p className="font-serif font-bold text-[#2c4c70] text-xs tracking-widest uppercase">
            {invite.groomName} &amp; {invite.brideName}
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

      {/* Cab Booking Modal (Uber & Ola Launcher) */}
      {cabModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f0f7fd] border-2 border-sky-400 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 text-center shadow-2xl relative text-slate-800">
            <button
              type="button"
              onClick={() => setCabModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-sky-100 border-2 border-sky-400 flex items-center justify-center text-2xl mx-auto shadow-inner text-sky-700">
              🚕
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-800 bg-sky-200 px-3 py-0.5 rounded-full">
                Instant Ride Booking
              </span>
              <h3 className="text-xl font-serif font-bold text-[#152e4d]">
                Book Cab to Venue
              </h3>
              <p className="text-xs text-[#2c4c70] leading-relaxed max-w-xs mx-auto">
                Choose your cab app. Venue destination will be pre-filled automatically:
              </p>
              <div className="p-3 bg-white/80 rounded-2xl border border-sky-200 text-xs text-sky-950 font-medium mt-1">
                📍 <strong className="font-bold">{invite.venueName}</strong>
                <span className="block text-[11px] text-[#2c4c70] mt-0.5">{invite.venueAddress}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Uber Launcher */}
              <a
                href={`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(invite.venueName + ', ' + (invite.venueAddress || invite.city))}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCabModalOpen(false)}
                className="w-full py-3.5 px-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-bold text-sm flex items-center justify-between shadow-lg transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shadow-inner">
                    Uber
                  </span>
                  <div className="text-left">
                    <span className="block text-sm font-bold leading-tight">Book on Uber</span>
                    <span className="block text-[10px] text-neutral-400 font-sans">Opens Uber App / Mobile Web</span>
                  </div>
                </div>
                <span className="text-xs text-neutral-300 font-mono">Launch App →</span>
              </a>

              {/* Ola Launcher */}
              <a
                href={`https://book.olacabs.com/?drop_name=${encodeURIComponent(invite.venueName + ', ' + (invite.venueAddress || invite.city))}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCabModalOpen(false)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#c5e840] hover:bg-[#b0d42f] text-neutral-950 font-bold text-sm flex items-center justify-between shadow-lg transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-black text-[#c5e840] font-black text-xs flex items-center justify-center shadow-inner">
                    Ola
                  </span>
                  <div className="text-left">
                    <span className="block text-sm font-bold leading-tight">Book on Ola Cabs</span>
                    <span className="block text-[10px] text-neutral-800 font-sans">Opens Ola App with Destination</span>
                  </div>
                </div>
                <span className="text-xs text-neutral-800 font-mono">Launch App →</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setCabModalOpen(false)}
              className="text-xs text-sky-800 font-semibold hover:underline cursor-pointer pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
