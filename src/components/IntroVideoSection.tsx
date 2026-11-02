'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronDown, Play, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // 1. GUARANTEED AUTOPLAY (Muted + PlaysInline on mount + User gesture fallbacks)
  useEffect(() => {
    const mainVideo = videoRef.current;
    const bgVideo = bgVideoRef.current;

    const startAutoplay = async () => {
      if (mainVideo) {
        mainVideo.defaultMuted = true;
        mainVideo.muted = true;
        mainVideo.setAttribute('muted', '');
        mainVideo.setAttribute('playsinline', '');
        mainVideo.setAttribute('webkit-playsinline', 'true');
        try {
          await mainVideo.play();
          setIsPlaying(true);
        } catch {
          // If browser policy blocked zero-gesture autoplay, wait for first interaction
          setIsPlaying(false);
        }
      }
      if (bgVideo) {
        bgVideo.defaultMuted = true;
        bgVideo.muted = true;
        bgVideo.setAttribute('muted', '');
        bgVideo.setAttribute('playsinline', '');
        bgVideo.setAttribute('webkit-playsinline', 'true');
        try {
          await bgVideo.play();
        } catch {}
      }
    };

    startAutoplay();

    // Foolproof autoplay on first user interaction anywhere on the screen
    const handleFirstGesture = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      if (bgVideoRef.current && bgVideoRef.current.paused) {
        bgVideoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };
  }, []);

  // 2. Track Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 3. Pause video if scrolled past, resume if scrolled back
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

  // Request native browser fullscreen
  const requestBrowserFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    }
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestBrowserFullscreen();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    requestBrowserFullscreen();
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
      ref={containerRef}
      onClick={togglePlay}
      className="relative w-full w-screen h-full h-screen min-h-[100dvh] bg-black flex flex-col justify-between overflow-hidden cursor-pointer select-none group"
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
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
      />

      {/* Main Crisp Video (Edge-to-Edge Full Screen) */}
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
          className="w-full h-full w-screen h-screen min-h-[100dvh] object-cover transition-all duration-700 shadow-2xl"
        />
      </div>

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/70 pointer-events-none" />

      {/* Top Floating Control Bar */}
      <div className="relative z-20 pt-6 px-4 sm:px-8 flex items-center justify-between text-white safe-area-top max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-black/40 border border-white/30 text-[11px] font-sans font-medium shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span className="font-serif tracking-wider">Royal Wedding Invitation</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Native Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-black/50 hover:bg-black/70 border border-white/40 text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 text-white"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-[11px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isMuted
                ? 'bg-rose-950/70 border-rose-400/60 text-rose-200 animate-pulse'
                : 'bg-emerald-950/70 border-emerald-400/60 text-emerald-200'
            }`}
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
            className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/40 text-[11px] font-sans font-semibold tracking-wider transition-all cursor-pointer hover:scale-105 text-white"
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

      {/* Bottom Scroll CTA */}
      <div className="relative z-20 pb-8 px-5 text-center max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              requestBrowserFullscreen();
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
          <span className="text-[10px] sm:text-xs text-rose-100/90 tracking-widest uppercase font-sans font-medium drop-shadow-sm">
            Swipe up or scroll to explore website
          </span>
        </div>
      </div>
    </div>
  );
}
