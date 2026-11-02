'use client';

import React, { useState, useEffect, useRef } from 'react';
import { InvitationData } from '@/types/invite';
import ScratchCard from './ScratchCard';
import ShagunModal from './ShagunModal';
import AudioPlayer from './AudioPlayer';
import IntroVideoSection from './IntroVideoSection';
import RSVPForm from './RSVPForm';
import {
  Heart,
  MapPin,
  Navigation,
  Car,
  Clock,
  Share2,
  Sparkles,
  Gift,
  Check,
} from 'lucide-react';

interface VeerZaraProps {
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

export default function VeerZaraView({
  invite,
  onUpdateRSVP,
  onUpdateShagun,
  showCurtainInitial = true,
}: VeerZaraProps) {
  const [shagunOpen, setShagunOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'gu'>('en');
  const [showIntroVideo, setShowIntroVideo] = useState(showCurtainInitial);
  const [introScrolledPast, setIntroScrolledPast] = useState(!showCurtainInitial);

  const websiteSectionRef = useRef<HTMLDivElement | null>(null);
  const introSectionRef = useRef<HTMLDivElement | null>(null);

  // Real-time dynamic countdown timer calculated from invite.weddingDate
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(invite.weddingDate));

  useEffect(() => {
    setTimeLeft(getTimeRemaining(invite.weddingDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(invite.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [invite.weddingDate]);

  // Window/container scroll listener to auto-play audio when website is reached
  useEffect(() => {
    const handleScrollCheck = () => {
      if (websiteSectionRef.current) {
        const rect = websiteSectionRef.current.getBoundingClientRect();
        if (rect.top <= (typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600)) {
          setIntroScrolledPast(true);
        } else if (rect.top > (typeof window !== 'undefined' ? window.innerHeight * 0.9 : 800)) {
          setIntroScrolledPast(false);
        }
      }
    };

    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollCheck);
  }, []);

  const handleScrollToWebsite = () => {
    setIntroScrolledPast(true);
    if (websiteSectionRef.current) {
      websiteSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToIntro = () => {
    if (!showIntroVideo) {
      setShowIntroVideo(true);
    }
    setTimeout(() => {
      if (introSectionRef.current) {
        introSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIntroScrolledPast(false);
    }, 50);
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `💍 *Wedding Invitation: ${invite.groomName} & ${invite.brideName}*\n\nTogether with our families, we request the honor of your presence!\n\nOpen your personal interactive invitation here:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const salutations: Record<string, string> = {
    en: (invite.salutation || 'In the name of God, the Most Gracious, the Most Merciful').replace(/allah/gi, 'God'),
    hi: '॥ श्री गणेशाय नमः ॥ परिवार सहित सादर आमंत्रण',
    gu: '॥ શ્રી ગણેશાય નમઃ ॥ સ્નેહીજનોને હાર્દિક આમંત્રણ',
  };

  const subQuotes: Record<string, string> = {
    en: invite.tagline
      ? invite.tagline.replace(/allah/gi, 'God')
      : '"With the divine blessings of God, two souls unite in love, affection, and sacred harmony."',
    hi: '"दो आत्माओं का पवित्र संगम, ईश्वर के आशीर्वाद और परिवार के स्नेह के साथ।"',
    gu: 'બે હૃદયનું મંગલ મિલન, સ્નેહ અને પરિવારના આશીર્વાદ સાથે.',
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#fdf0f2] via-[#fcf3f5] to-[#f9e9ec] text-[#422227] flex flex-col font-serif selection:bg-[#943445] selection:text-white">
      
      {/* Floating White Doves & Rose Petals */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute text-rose-400/60 animate-float"
            style={{
              left: `${(i * 7) + 4}%`,
              top: `${(i * 7)}%`,
              fontSize: `${Math.random() * 8 + 10}px`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            {i % 3 === 0 ? '🕊️' : '🌸'}
          </span>
        ))}
      </div>

      {/* 1. Fullscreen Intro Video Section at the very top (If enabled or in guest view) */}
      {showIntroVideo && (
        <div
          ref={introSectionRef}
          id="intro-video-section"
          className="relative w-full min-h-screen min-h-[100dvh] shrink-0 bg-black overflow-hidden shadow-2xl"
        >
          <IntroVideoSection
            videoUrl={invite.introVideoUrl || '/videos/wedding-invite.mp4'}
            groomName={invite.groomName}
            brideName={invite.brideName}
            weddingDate={invite.weddingDate}
            city={invite.city}
            onScrollToInvite={handleScrollToWebsite}
            isScrolledPast={introScrolledPast}
          />
        </div>
      )}

      {/* 2. Main Website Content Section (Scrolls naturally without any lock or trapping) */}
      <div
        ref={websiteSectionRef}
        id="wedding-website-content"
        className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 relative z-20"
      >
        {/* Sticky Audio & Language Bar */}
        <div className="flex items-center justify-between gap-2 sticky top-2 z-30">
          <div className="flex-1">
            <AudioPlayer
              title={invite.musicTitle || 'Afreen Afreen - Shehnai Flute'}
              musicUrl={invite.musicUrl}
              autoPlay={introScrolledPast}
            />
          </div>

          <button
            type="button"
            onClick={handleScrollToIntro}
            className="backdrop-blur-xl bg-white/70 hover:bg-white/90 text-[#943445] text-[10px] font-bold rounded-full px-2.5 py-1.5 border border-rose-200 focus:outline-none cursor-pointer shadow-sm flex items-center gap-1 transition-all"
            title="Watch Intro Video"
          >
            <span>🎬</span>
            <span>Intro</span>
          </button>

          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value as 'en' | 'hi' | 'gu')}
            className="backdrop-blur-xl bg-white/60 text-[#943445] text-[10px] font-bold rounded-full px-3 py-1.5 border border-rose-200 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* HERO SECTION: Sunset Terrace with Rose Garland & Doves */}
        <div className="text-center pt-2 space-y-2">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full backdrop-blur-md bg-white/50 border border-rose-200 text-[11px] text-[#943445] shadow-sm">
            <Heart className="w-3 h-3 text-[#943445] fill-[#943445] animate-pulse" />
            <span>The Wedding Union</span>
          </div>

          <p className="text-[11px] font-sans tracking-[0.2em] text-[#943445] uppercase font-bold">
            {salutations[activeLang]}
          </p>

          <p className="text-[10px] text-[#784d53] italic font-sans">
            Together with our families, we invite you to celebrate our wedding
          </p>

          {/* Couple Calligraphy Script Names */}
          <div className="py-2 space-y-1">
            <h2
              style={{ fontFamily: invite.fontFamily || "'Great Vibes', cursive" }}
              className="text-5xl md:text-6xl text-[#852839] drop-shadow-sm tracking-wide"
            >
              {invite.groomName}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 h-px bg-[#c28490]"></span>
              <span
                style={{ fontFamily: invite.fontFamily || "'Great Vibes', cursive" }}
                className="text-3xl text-[#943445]"
              >
                &amp;
              </span>
              <span className="w-12 h-px bg-[#c28490]"></span>
            </div>
            <h2
              style={{ fontFamily: invite.fontFamily || "'Great Vibes', cursive" }}
              className="text-5xl md:text-6xl text-[#852839] drop-shadow-sm tracking-wide"
            >
              {invite.brideName}
            </h2>
          </div>

          {/* Flourish Divider */}
          <div className="text-[#943445] text-xs">❦ ❧</div>

          <p className="text-xs text-[#6e464c] italic max-w-xs mx-auto leading-relaxed">
            {subQuotes[activeLang]}
          </p>
        </div>

        {/* 1. COUPLE PORTRAIT PHOTO FRAME */}
        <div className="relative mx-auto max-w-[310px] rounded-3xl p-3 backdrop-blur-2xl bg-white/70 border-2 border-rose-200/90 shadow-2xl shadow-rose-950/10 text-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#943445]/10 to-[#f497a7]/20 border border-white/60 shadow-inner">
            {invite.couplePhoto ? (
              <div className="relative">
                <img
                  src={invite.couplePhoto}
                  alt={`${invite.groomName} & ${invite.brideName}`}
                  className="w-full h-80 object-cover object-top rounded-2xl"
                />
                {invite.photoSubtitle && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2.5 px-3 rounded-b-2xl">
                    <p className="text-[11px] text-rose-100 font-sans italic tracking-wide">
                      {invite.photoSubtitle}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-4xl mb-2">🕊️</span>
                <p
                  style={{ fontFamily: invite.fontFamily || "'Great Vibes', cursive" }}
                  className="font-serif font-bold text-[#852839] text-xl"
                >
                  {invite.groomName} &amp; {invite.brideName}
                </p>
                <p className="text-xs text-slate-700 italic mt-1 font-sans">
                  {invite.photoSubtitle || 'Two souls unite under the sacred blessings of God'}
                </p>
                <div className="mt-3 px-3.5 py-1 rounded-full backdrop-blur-md bg-[#943445]/10 border border-[#943445]/30 text-[10px] text-[#852839] font-mono font-bold">
                  ✦ {invite.weddingDate} ✦
                </div>
              </div>
            )}
          </div>
          {invite.photoSubtitle && !invite.couplePhoto && (
            <p className="text-xs text-[#784d53] italic font-sans mt-2">
              &ldquo;{invite.photoSubtitle}&rdquo;
            </p>
          )}
        </div>

        {/* 2. REAL-TIME WEDDING COUNTDOWN */}
        <div className="p-4.5 rounded-3xl backdrop-blur-2xl bg-white/60 border border-rose-200/80 text-center space-y-3 shadow-md">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-rose-300"></span>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#852839] font-bold">
              <Clock className="w-3.5 h-3.5 text-[#943445] animate-pulse" />
              <span>Counting Down to Forever</span>
            </div>
            <span className="w-6 h-px bg-rose-300"></span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="backdrop-blur-md bg-gradient-to-b from-[#ffffff]/90 to-[#fdf0f2] border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
              <span className="text-2xl font-bold font-serif text-[#852839]">{timeLeft.days}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#943445] mt-0.5 font-sans font-bold">Days</span>
            </div>
            <div className="backdrop-blur-md bg-gradient-to-b from-[#ffffff]/90 to-[#fdf0f2] border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
              <span className="text-2xl font-bold font-serif text-[#852839]">{timeLeft.hours}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#943445] mt-0.5 font-sans font-bold">Hours</span>
            </div>
            <div className="backdrop-blur-md bg-gradient-to-b from-[#ffffff]/90 to-[#fdf0f2] border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
              <span className="text-2xl font-bold font-serif text-[#852839]">{timeLeft.mins}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#943445] mt-0.5 font-sans font-bold">Mins</span>
            </div>
            <div className="backdrop-blur-md bg-gradient-to-b from-[#ffffff]/90 to-[#fdf0f2] border border-rose-200/80 rounded-2xl p-2.5 shadow-xs">
              <span className="text-2xl font-bold font-serif text-[#943445]">{timeLeft.secs}</span>
              <span className="block text-[9px] uppercase tracking-wider text-[#943445] mt-0.5 font-sans font-bold">Secs</span>
            </div>
          </div>
        </div>

        {/* 3. SAVE OUR DATE - HEART SCRATCH CARD */}
        <div className="text-center space-y-2">
          <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#943445]">
            Save Our Date
          </h3>
          <ScratchCard
            weddingDate={invite.weddingDate}
            venueCity={invite.city}
            shape="heart"
            accentColor="#943445"
          />
        </div>

        {/* 4. PROGRAM TIMELINE */}
        <div className="space-y-3">
          <div className="text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-[#943445] flex items-center justify-center mx-auto text-sm">
              💍
            </div>
            <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#852839]">
              Program Timeline
            </h3>
          </div>

          {invite.events.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl backdrop-blur-2xl bg-white/50 border-l-4 border-[#943445] border border-rose-200 space-y-1.5 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-[#852839] flex items-center gap-1.5">
                  <span>{ev.icon || '🌸'}</span>
                  <span>{ev.title}</span>
                </h4>
                <span className="text-[10px] backdrop-blur-md bg-[#f7dbe1] text-[#852839] border border-rose-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {ev.time}
                </span>
              </div>
              <p className="text-xs text-[#6e464c]">{ev.date} • {ev.venue}</p>
              {ev.dressCode && (
                <p className="text-[11px] text-[#943445] italic font-sans">Dress Code: {ev.dressCode}</p>
              )}
            </div>
          ))}
        </div>

        {/* 5. VENUE & GOOGLE MAPS */}
        <div className="p-5 rounded-3xl backdrop-blur-2xl bg-white/50 border border-rose-200 text-center space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[#943445] mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#852839]">Venue</h3>
            <h4 className="font-serif font-bold text-[#422227] text-base mt-1">{invite.venueName}</h4>
            <p className="text-xs text-[#6e464c] mt-0.5 leading-relaxed">{invite.venueAddress}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <a
              href={invite.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(invite.venueName + ' ' + invite.venueAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#852839] hover:bg-[#6e1e2d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Venue Directions</span>
            </a>
            <button
              type="button"
              onClick={() => alert(`Opening cab app with destination set to: ${invite.venueName}!`)}
              className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white border border-rose-300 text-[#852839] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book Uber / Cab</span>
            </button>
          </div>
        </div>

        {/* 6. DIGITAL SHAGUN VIA UPI */}
        <div className="p-5 rounded-3xl backdrop-blur-2xl bg-white/50 border border-rose-200 text-center space-y-3 shadow-md relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-[#943445] flex items-center justify-center mx-auto text-sm">
            🎁
          </div>
          <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#852839]">Digital Shagun</h3>
          <p className="text-xs text-[#6e464c] leading-relaxed max-w-sm mx-auto">
            Cannot attend in person? Send your heartfelt blessings and shagun directly to {invite.groomName} &amp; {invite.brideName} via UPI.
          </p>

          <button
            type="button"
            onClick={() => setShagunOpen(true)}
            className="w-full min-h-[44px] py-3 rounded-2xl bg-gradient-to-r from-[#943445] to-[#b34054] hover:from-[#802a39] hover:to-[#9e3547] text-white font-bold text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💌</span> Send Digital Shagun via UPI Envelope
          </button>
        </div>

        {/* 7. INTERACTIVE RSVP FORM */}
        <div className="space-y-2">
          <div className="text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-[#943445] flex items-center justify-center mx-auto text-sm">
              ✉️
            </div>
            <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#852839]">
              RSVP
            </h3>
          </div>

          <RSVPForm
            onSubmitRSVP={(data) => {
              if (onUpdateRSVP) onUpdateRSVP(data);
            }}
          />
        </div>

        {/* 8. WHATSAPP SHARE CTA */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full min-h-[44px] py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <Share2 className="w-4 h-4" />
          <span>Share This Invitation on WhatsApp</span>
        </button>

        {/* 9. FOOTER */}
        <div className="pt-6 pb-12 text-center space-y-2">
          <p className="font-['Great_Vibes',cursive] text-3xl text-[#852839]">
            With Warm Blessings &amp; Love
          </p>
          <p className="text-xs text-[#852839] font-serif font-bold tracking-wider">
            {invite.groomName} &amp; {invite.brideName}
          </p>
          <p className="text-[10px] text-[#a36b75] font-sans">
            Designed with Zareqia Studio
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
