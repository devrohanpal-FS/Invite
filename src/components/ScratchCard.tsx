'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface ScratchCardProps {
  weddingDate: string;
  venueCity: string;
  shape?: 'heart' | 'rectangle';
  accentColor?: string;
  onFullyRevealed?: () => void;
}

export default function ScratchCard({
  weddingDate,
  venueCity,
  shape = 'heart',
  accentColor = '#c59b2d',
  onFullyRevealed,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [showHeartRain, setShowHeartRain] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; size: number; delay: number; icon: string }>>([]);

  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const clean = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [y, m, d] = clean.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const parsed = new Date(clean);
    return isNaN(parsed.getTime())
      ? clean
      : parsed.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
  };

  const formattedDate = getFormattedDate(weddingDate);

  // Trigger Heart Rain & Auto-Clear 100%
  const triggerAutoClearAndHeartRain = useCallback(() => {
    setIsFullyRevealed(true);
    setShowHeartRain(true);
    setScratchProgress(100);

    // Generate 35 raining heart particles
    const emojis = ['💖', '❤️', '💕', '✨', '💐', '💍'];
    const newHearts = Array.from({ length: 35 }, (_, idx) => ({
      id: idx,
      left: Math.random() * 92 + 4,
      size: Math.random() * 14 + 16,
      delay: Math.random() * 1.5,
      icon: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(newHearts);

    if (onFullyRevealed) onFullyRevealed();

    // Fade out canvas automatically
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      canvas.style.opacity = '0';
      canvas.style.transform = 'scale(1.04)';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 600);
    }
  }, [onFullyRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isFullyRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width || canvas.offsetWidth || 300;
    const cssHeight = rect.height || canvas.offsetHeight || 130;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    ctx.scale(dpr, dpr);

    // Render Metallic Gold / Silver Foil
    const grad = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    if (shape === 'heart') {
      grad.addColorStop(0, '#fce38a');
      grad.addColorStop(0.3, '#d4af37');
      grad.addColorStop(0.7, '#f6d365');
      grad.addColorStop(1, '#996515');
    } else {
      grad.addColorStop(0, '#e8dcc6');
      grad.addColorStop(0.5, '#f5eee1');
      grad.addColorStop(1, '#c5ae84');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Decorative Text & Emblem
    ctx.fillStyle = '#422800';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', cssWidth / 2, cssHeight / 2 + 4);

    let isScratching = false;

    // Calculate how much has been scratched
    const checkProgress = () => {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        const totalSampled = pixels.length / 4;

        // Sample every 8th pixel for high performance on mobile devices
        for (let i = 3; i < pixels.length; i += 32) {
          if (pixels[i] === 0) transparentPixels++;
        }

        const percentage = Math.round((transparentPixels / (totalSampled / 8)) * 100);
        setScratchProgress(Math.min(100, percentage));

        // When >= 50% is scratched, trigger Heart Rain & Auto-Clear 100%!
        if (percentage >= 50) {
          triggerAutoClearAndHeartRain();
        }
      } catch (err) {
        console.error('Scratch checkProgress error:', err);
      }
    };

    const scratchAt = (clientX: number, clientY: number) => {
      const currentRect = canvas.getBoundingClientRect();
      const x = clientX - currentRect.left;
      const y = clientY - currentRect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      // Generous 28px scratch radius for easy mobile finger touch
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      checkProgress();
    };

    const onMouseDown = (e: MouseEvent) => {
      isScratching = true;
      scratchAt(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isScratching) scratchAt(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      isScratching = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      isScratching = true;
      if (e.touches[0]) {
        if (e.cancelable) e.preventDefault();
        scratchAt(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isScratching) return;
      if (e.cancelable) e.preventDefault();
      if (e.touches[0]) scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      isScratching = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch events attached strictly to CANVAS so the rest of the page scrolls natively!
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isFullyRevealed, shape, triggerAutoClearAndHeartRain]);

  return (
    <div
      ref={containerRef}
      className="relative p-4 sm:p-5 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/40 shadow-2xl text-center space-y-3 overflow-hidden select-none"
    >
      {/* HEART BURST & HEART RAIN OVERLAY */}
      {showHeartRain && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute"
              style={{
                left: `${h.left}%`,
                top: '-20px',
                fontSize: `${h.size}px`,
                animation: `heartFall 3s linear ${h.delay}s forwards`,
              }}
            >
              {h.icon}
            </span>
          ))}
          <style>{`
            @keyframes heartFall {
              0% {
                transform: translateY(0px) rotate(0deg) scale(0.6);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                transform: translateY(280px) rotate(360deg) scale(1.2);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Header title */}
      <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
        <Heart className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
        <span>Scratch to Reveal Wedding Date</span>
      </div>

      {/* Scratch Box */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-amber-400/40 bg-gradient-to-tr from-amber-950/70 via-black/60 to-amber-950/70 flex items-center justify-center shadow-inner">
        {/* Date revealed underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center space-y-0.5">
          <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold">
            The Celebration Begins
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-amber-100 tracking-wide drop-shadow-md">
            {formattedDate.toUpperCase()}
          </span>
          <span className="text-xs text-amber-200/90 font-medium italic">{venueCity}</span>
        </div>

        {/* Scratch Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
        />
      </div>

      {/* Live status / progress hint */}
      <div className="flex items-center justify-between text-[11px] px-1 font-medium">
        <span className="text-amber-200/90 text-left">
          {isFullyRevealed ? (
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 100% Unveiled! Date Revealed
            </span>
          ) : (
            '👉 Scratch with finger to reveal'
          )}
        </span>

        <span className="font-mono text-amber-400 bg-black/40 px-2 py-0.5 rounded-full border border-amber-500/30 text-[10px] shrink-0 ml-2">
          {isFullyRevealed ? '100%' : `${scratchProgress}%`}
        </span>
      </div>
    </div>
  );
}
