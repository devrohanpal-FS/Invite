'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Disc } from 'lucide-react';

interface AudioPlayerProps {
  title?: string;
  musicUrl?: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({
  title = 'Kudmayi - Shehnai Flute',
  musicUrl,
  autoPlay = true,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  const playLuxuryChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Melodious G-Major Indian wedding shehnai progression
      const frequencies = [392.00, 493.88, 587.33, 783.99];
      frequencies.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 1.5);
      });
    } catch {
      // Audio context restricted until interaction
    }
  };

  useEffect(() => {
    if (musicUrl && audioElRef.current) {
      if (isPlaying) {
        audioElRef.current.play().catch(() => {});
      } else {
        audioElRef.current.pause();
      }
      return;
    }

    if (isPlaying) {
      playLuxuryChime();
      intervalRef.current = setInterval(playLuxuryChime, 7000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, musicUrl]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sticky top-2 z-30 flex items-center justify-between bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-xl">
      <div className="flex items-center gap-2">
        <Disc className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin-slow' : ''}`} />
        <span className="text-[11px] text-amber-200 font-medium truncate max-w-[130px]">{title}</span>
      </div>

      <button
        onClick={toggleAudio}
        className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-[10px] text-amber-200 font-bold flex items-center gap-1 transition-all cursor-pointer"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3 h-3 text-amber-300" /> Playing
          </>
        ) : (
          <>
            <VolumeX className="w-3 h-3 text-slate-400" /> Muted
          </>
        )}
      </button>
      {musicUrl && (
        <audio
          ref={audioElRef}
          src={musicUrl}
          loop
          preload="auto"
        />
      )}
    </div>
  );
}
