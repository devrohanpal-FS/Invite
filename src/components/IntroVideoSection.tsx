'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronDown, Play, Sparkles } from 'lucide-react';

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
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Pause video if scrolled past, resume if scrolled back
  useEffect(() => {
    if (!videoRef.current) return;
    if (isScrolledPast) {
      videoRef.current.pause();
      if (bgVideoRef.current) bgVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {});
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
      if (bgVideoRef.current) bgVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {});
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
      className="relative w-full h-full min-h-screen min-h-[100dvh] bg-black flex flex-col justify-between overflow-hidden cursor-pointer select-none group"
    >
      {/* Background Ambient Video (Widescreen fill on desktop/tablet) */}
      <video
        ref={bgVideoRef}
        src={videoUrl}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        aria-hidden="true"
        className="hidden md:block absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
      />

      {/* Main Crisp Video (Centered & Uncropped) */}
      <div className="absolute inset-0 flex items-center justify-center">
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
          className="w-full h-full md:max-w-xl md:h-full object-cover md:object-contain transition-opacity duration-700 shadow-2xl"
        />
      </div>

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/70 pointer-events-none" />

      {/* Top Floating Bar */}
      <div className="relative z-20 pt-6 px-4 sm:px-8 flex items-center justify-between text-white safe-area-top max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/40 border border-white/30 text-[11px] font-sans font-medium shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>Wedding Invitation</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-black/50 hover:bg-black/70 border border-white/40 text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
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
            className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/40 text-[11px] font-sans font-semibold tracking-wider transition-all cursor-pointer hover:scale-105"
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

      {/* Bottom Scroll CTA (Text overlay removed so video animations remain 100% visible) */}
      <div className="relative z-20 pb-8 px-5 text-center max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onScrollToInvite();
            }}
            className={`group px-7 py-3 rounded-full backdrop-blur-2xl text-white shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center gap-2.5 text-xs sm:text-sm font-serif font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border ${
              videoEnded
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 border-amber-300 animate-pulse scale-105'
                : 'bg-white/25 hover:bg-white/35 border-white/60 animate-bounce'
            }`}
          >
            <span>Scroll to Enter Invitation</span>
            <ChevronDown className="w-4 h-4 text-rose-200 group-hover:translate-y-1 transition-transform" />
          </button>
          <span className="text-[10px] sm:text-xs text-rose-100/80 tracking-widest uppercase font-sans font-medium drop-shadow-sm">
            Swipe up or scroll to explore website
          </span>
        </div>
      </div>
    </div>
  );
}
