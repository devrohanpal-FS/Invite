'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronDown, Play, Pause, Sparkles } from 'lucide-react';

interface IntroVideoSectionProps {
  videoUrl?: string;
  groomName: string;
  brideName: string;
  weddingDate?: string;
  city?: string;
  onScrollToInvite: () => void;
  isScrolledPast: boolean;
}

export default function IntroVideoSection({
  videoUrl = '/videos/wedding-invite.mp4',
  groomName,
  brideName,
  weddingDate,
  city,
  onScrollToInvite,
  isScrolledPast,
}: IntroVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Pause video if scrolled past, resume if scrolled back
  useEffect(() => {
    if (!videoRef.current) return;
    if (isScrolledPast) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isScrolledPast]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  return (
    <div
      onClick={togglePlay}
      className="relative w-full h-full min-h-[720px] bg-black flex flex-col justify-between overflow-hidden cursor-pointer select-none group"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        muted={isMuted}
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/70 pointer-events-none" />

      {/* Top Floating Bar */}
      <div className="relative z-20 pt-6 px-4 flex items-center justify-between text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/40 border border-white/30 text-[11px] font-sans font-medium shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>Wedding Invitation</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="px-3 py-1 rounded-full backdrop-blur-xl bg-black/50 hover:bg-black/70 border border-white/40 text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                <span>Tap for Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>Sound On</span>
              </>
            )}
          </button>

          {/* Quick Skip to Website */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onScrollToInvite();
            }}
            className="px-3 py-1 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/40 text-[11px] font-sans font-semibold tracking-wider transition-all cursor-pointer hover:scale-105"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Center Play/Pause Indicator (Only briefly visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white text-2xl backdrop-blur-md shadow-2xl animate-scaleIn">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Bottom Information & Scroll CTA */}
      <div className="relative z-20 pb-7 px-5 text-center space-y-4">
        {/* Couple Names Overlay */}
        <div className="space-y-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <p className="text-[11px] tracking-[0.25em] uppercase text-rose-200 font-sans font-semibold">
            The Wedding Celebration Of
          </p>
          <h1 className="text-4xl md:text-5xl font-['Great_Vibes',cursive] text-white tracking-wide">
            {groomName} &amp; {brideName}
          </h1>
          {weddingDate && (
            <p className="text-xs text-rose-100 font-sans tracking-widest mt-1">
              ✦ {weddingDate} {city ? `• ${city}` : ''} ✦
            </p>
          )}
        </div>

        {/* Video Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden max-w-xs mx-auto shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pulsating Scroll to Enter CTA */}
        <div className="pt-1 flex flex-col items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onScrollToInvite();
            }}
            className={`group px-6 py-3 rounded-full backdrop-blur-2xl text-white shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center gap-2.5 text-xs font-serif font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border ${
              videoEnded
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 border-amber-300 animate-pulse scale-105'
                : 'bg-white/25 hover:bg-white/35 border-white/60 animate-bounce'
            }`}
          >
            <span>Scroll to Enter Invitation</span>
            <ChevronDown className="w-4 h-4 text-rose-200 group-hover:translate-y-1 transition-transform" />
          </button>
          <span className="text-[10px] text-rose-100/80 tracking-widest uppercase font-sans font-medium">
            Swipe up or scroll to explore website
          </span>
        </div>
      </div>
    </div>
  );
}
