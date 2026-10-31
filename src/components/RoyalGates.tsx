'use client';

import React, { useState, useEffect, useRef } from 'react';

interface RoyalGatesProps {
  groomName: string;
  brideName: string;
  onOpen: () => void;
}

export default function RoyalGates({ groomName, brideName, onOpen }: RoyalGatesProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background gold dust floating particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const particles: Array<{ x: number; y: number; r: number; dy: number; dx: number; op: number }> = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dy: Math.random() * 0.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.4,
        op: Math.random() * 0.7 + 0.3,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.op})`;
        ctx.fill();
        p.y += p.dy;
        p.x += p.dx;
        if (p.y > h) p.y = 0;
        if (p.x > w) p.x = 0;
        if (p.x < 0) p.x = w;
      });
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleUnlock = () => {
    if (isOpening) return;
    setIsOpening(true);
    onOpen();

    setTimeout(() => {
      setIsHidden(true);
    }, 1800);
  };

  if (isHidden) return null;

  return (
    <div
      className={`absolute inset-0 z-40 bg-[#020b06] flex flex-col justify-between overflow-hidden transition-opacity duration-700 ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ perspective: '1200px' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Top Header */}
      <div className="relative z-10 pt-10 text-center px-4">
        <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 bg-amber-500/10 mx-auto flex items-center justify-center font-serif text-amber-300 text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          {groomName[0]} & {brideName[0]}
        </div>
        <p className="text-[11px] font-serif tracking-[0.25em] text-amber-300/80 uppercase mt-2">
          A Royal Celebration
        </p>
        <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mt-0.5">
          {groomName} & {brideName}
        </h2>
      </div>

      {/* 3D Gate Doors */}
      <div
        className="relative flex-1 mx-4 my-3 flex overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Left Gate Panel */}
        <div
          className="w-1/2 h-full bg-gradient-to-r from-[#03150d] via-[#092b1a] to-[#0c3923] border-r-2 border-amber-400/80 flex flex-col justify-between p-4 shadow-2xl transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transformOrigin: 'left center',
            transform: isOpening ? 'rotateY(-115deg)' : 'rotateY(0deg)',
          }}
        >
          <div className="border border-amber-500/30 rounded-xl h-full p-2 flex flex-col justify-between items-center">
            <span className="text-amber-400/50 text-xl font-serif">⚜</span>
            <div className="w-9 h-9 rounded-full border border-amber-400/60 flex items-center justify-center text-amber-300 text-xs font-serif">
              {groomName[0]}
            </div>
            <span className="text-amber-400/50 text-xl font-serif">⚜</span>
          </div>
        </div>

        {/* Right Gate Panel */}
        <div
          className="w-1/2 h-full bg-gradient-to-l from-[#03150d] via-[#092b1a] to-[#0c3923] border-l-2 border-amber-400/80 flex flex-col justify-between p-4 shadow-2xl transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transformOrigin: 'right center',
            transform: isOpening ? 'rotateY(115deg)' : 'rotateY(0deg)',
          }}
        >
          <div className="border border-amber-500/30 rounded-xl h-full p-2 flex flex-col justify-between items-center">
            <span className="text-amber-400/50 text-xl font-serif">⚜</span>
            <div className="w-9 h-9 rounded-full border border-amber-400/60 flex items-center justify-center text-amber-300 text-xs font-serif">
              {brideName[0]}
            </div>
            <span className="text-amber-400/50 text-xl font-serif">⚜</span>
          </div>
        </div>

        {/* Center Wax Seal Button */}
        {!isOpening && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <button
              onClick={handleUnlock}
              className="group px-6 py-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-slate-950 font-bold shadow-[0_0_40px_rgba(212,175,55,0.9)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-amber-200 cursor-pointer animate-pulse"
            >
              <span className="text-3xl">🗝️</span>
              <span className="text-[10px] tracking-widest uppercase font-serif mt-1 font-black">Open Gates</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="relative z-10 pb-6 text-center px-6">
        <button
          onClick={handleUnlock}
          className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs text-amber-300 font-bold tracking-wider uppercase font-serif transition-all cursor-pointer"
        >
          ✨ Tap to Unlock Royal Invitation
        </button>
      </div>
    </div>
  );
}
