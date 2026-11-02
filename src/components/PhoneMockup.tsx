import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export default function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[395px] h-[660px] sm:h-[785px] bg-[#020b06] rounded-[36px] sm:rounded-[48px] border-[6px] sm:border-[8px] border-slate-800 shadow-[0_0_80px_rgba(212,175,55,0.18)] overflow-hidden flex flex-col mx-auto">
      {/* Phone Notch & Status Bar */}
      <div className="h-8 sm:h-9 bg-black/60 backdrop-blur-sm px-5 sm:px-6 flex items-center justify-between text-xs text-slate-400 z-50 shrink-0 select-none">
        <span className="font-semibold text-slate-200 text-[10px] sm:text-[11px]">9:41</span>
        <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-slate-900 rounded-full mx-auto"></div>
        <div className="flex items-center gap-1 text-slate-300 text-[9px] sm:text-[10px]">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Screen Viewport with smooth scrollability for studio testing */}
      <div className="flex-1 overflow-y-auto relative flex flex-col overscroll-contain">
        {children}
      </div>
    </div>
  );
}
