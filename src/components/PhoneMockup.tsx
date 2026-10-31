import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export default function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="relative w-full max-w-[395px] h-[785px] bg-[#020b06] rounded-[48px] border-[8px] border-slate-800 shadow-[0_0_80px_rgba(212,175,55,0.18)] overflow-hidden flex flex-col mx-auto">
      {/* Phone Notch & Status Bar */}
      <div className="h-9 bg-black/60 backdrop-blur-sm px-6 flex items-center justify-between text-xs text-slate-400 z-50 shrink-0">
        <span className="font-semibold text-slate-200 text-[11px]">9:41</span>
        <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
        <div className="flex items-center gap-1 text-slate-300 text-[10px]">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Screen Viewport */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
}
