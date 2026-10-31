'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, ChevronDown, Check, MessageCircle } from 'lucide-react';

interface TemplateItem {
  id: string;
  title: string;
  badge: 'Cinematic' | 'New' | 'Premium';
  badgeStyle: string;
  desc: string;
  bgGradient: string;
  previewSlug: string;
  collection: 'royal' | 'classic';
  types: string[]; // event types this applies to
  coverArt: string;
}

const ALL_TEMPLATES: TemplateItem[] = [
  {
    id: 'veer-zara',
    title: 'Veer & Zara (Sunset Terrace)',
    badge: 'Cinematic',
    badgeStyle: 'bg-rose-500/90 text-white font-bold',
    desc: 'Sunset balcony drapes, pink climbing roses, flying doves, and rose blush glassmorphism',
    bgGradient: 'from-[#4a1c28] via-[#2d111b] to-[#17080f]',
    previewSlug: 'veer-zara',
    collection: 'royal',
    types: ['wedding', 'engagement', 'wedding_reception', 'reception', 'anniversary'],
    coverArt: '🕊️',
  },
  {
    id: 'royal-monarch',
    title: 'Royal Monarch',
    badge: 'Cinematic',
    badgeStyle: 'bg-sky-500/90 text-white font-bold',
    desc: 'Sky-blue florals, pearl drapes, and a serene lakeside cinematic reveal',
    bgGradient: 'from-[#2b4c68] via-[#1a3044] to-[#0f1d2b]',
    previewSlug: 'sam-sofia',
    collection: 'royal',
    types: ['wedding', 'engagement', 'wedding_reception', 'baby_shower', 'anniversary'],
    coverArt: '🏞️',
  },
  {
    id: 'royal-imperial',
    title: 'Royal Imperial',
    badge: 'Cinematic',
    badgeStyle: 'bg-amber-500/80 text-black',
    desc: 'Cinematic rose-gold opening with luxurious motion storytelling',
    bgGradient: 'from-[#3a221b] via-[#24130d] to-[#140905]',
    previewSlug: 'kabir-ananya',
    collection: 'royal',
    types: ['wedding', 'engagement', 'wedding_reception', 'reception', 'anniversary'],
    coverArt: '🏛️',
  },
  {
    id: 'royal-majesty',
    title: 'Royal Majesty',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Porcelain blue ballroom romance with painterly cinematic grandeur',
    bgGradient: 'from-[#1e344a] via-[#122130] to-[#0a121c]',
    previewSlug: 'sam-sofia',
    collection: 'royal',
    types: ['wedding', 'engagement', 'anniversary'],
    coverArt: '💎',
  },
  {
    id: 'royal-elegance',
    title: 'Royal Elegance',
    badge: 'Premium',
    badgeStyle: 'bg-amber-500/80 text-black',
    desc: 'Velvet cream and crimson cinematic experience with palace motifs',
    bgGradient: 'from-[#4d1620] via-[#330c14] to-[#1c0409]',
    previewSlug: 'kabir-ananya',
    collection: 'royal',
    types: ['wedding', 'engagement', 'reception', 'opening_ceremony'],
    coverArt: '🌹',
  },
  {
    id: 'royal-prestige',
    title: 'Royal Prestige',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Prestigious cinematic opening with refined elegance and grandeur',
    bgGradient: 'from-[#462432] via-[#2d141e] to-[#19090f]',
    previewSlug: 'sam-sofia',
    collection: 'royal',
    types: ['wedding', 'birthday', 'engagement', 'anniversary'],
    coverArt: '👑',
  },
  {
    id: 'royal-heritage',
    title: 'Royal Heritage',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Timeless cinematic opening with regal heritage storytelling',
    bgGradient: 'from-[#3f1925] via-[#2a0e18] to-[#17060c]',
    previewSlug: 'kabir-ananya',
    collection: 'royal',
    types: ['wedding', 'engagement', 'housewarming', 'opening_ceremony'],
    coverArt: '🏰',
  },
  {
    id: 'royal-grace',
    title: 'Royal Grace',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Sage garden serenity with pearl drapes and graceful cinematic reveal',
    bgGradient: 'from-[#1b3626] via-[#102217] to-[#08120b]',
    previewSlug: 'sam-sofia',
    collection: 'royal',
    types: ['wedding', 'engagement', 'baby_shower', 'housewarming'],
    coverArt: '🌿',
  },
  {
    id: 'royal-crest',
    title: 'Royal Crest',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Warm ivory florals, antique burgundy wax seal, and lakeside grandeur',
    bgGradient: 'from-[#382621] via-[#241713] to-[#150c09]',
    previewSlug: 'kabir-ananya',
    collection: 'royal',
    types: ['wedding', 'engagement', 'anniversary', 'wedding_reception'],
    coverArt: '💌',
  },
  {
    id: 'royal-legacy',
    title: 'Royal Legacy',
    badge: 'New',
    badgeStyle: 'bg-amber-600/70 text-white',
    desc: 'Burgundy velvet curtains, antique gold ornament, and a timeless royal arch',
    bgGradient: 'from-[#3b1219] via-[#26090e] to-[#140306]',
    previewSlug: 'kabir-ananya',
    collection: 'royal',
    types: ['wedding', 'reception', 'opening_ceremony', 'birthday'],
    coverArt: '🥂',
  },
];

const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding Invitation' },
  { id: 'engagement', label: 'Engagement Invitation' },
  { id: 'wedding_reception', label: 'Wedding & Reception Invitation' },
  { id: 'reception', label: 'Reception only invitation' },
  { id: 'birthday', label: 'Birthday Invitation' },
  { id: 'opening_ceremony', label: 'Opening Ceremony Invitation' },
  { id: 'anniversary', label: 'Anniversary Invitation' },
  { id: 'housewarming', label: 'Housewarming Invitations' },
  { id: 'baby_shower', label: 'Baby Shower Invitations' },
];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParam = searchParams.get('type') || 'engagement';
  const collectionParam = searchParams.get('collection') || 'royal';

  const [selectedType, setSelectedType] = useState<string>(typeParam);
  const [selectedCollection, setSelectedCollection] = useState<'royal' | 'classic'>(
    collectionParam === 'classic' ? 'classic' : 'royal'
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectType = (id: string) => {
    setSelectedType(id);
    setDropdownOpen(false);
    router.replace(`/templates?type=${id}&collection=${selectedCollection}`);
  };

  const handleSelectCollection = (col: 'royal' | 'classic') => {
    setSelectedCollection(col);
    router.replace(`/templates?type=${selectedType}&collection=${col}`);
  };

  // Filter templates
  const filteredTemplates = ALL_TEMPLATES.filter((t) => {
    const matchesCollection = t.collection === selectedCollection;
    const matchesType = t.types.includes(selectedType) || selectedType === 'wedding';
    return matchesCollection && (matchesType || t.types.length > 0);
  });

  const currentTypeLabel = EVENT_TYPES.find((e) => e.id === selectedType)?.label || 'Engagement Invitation';

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col justify-between selection:bg-[#722f37] selection:text-[#fff8e7]">
      
      {/* Top Navbar */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-[#e8dcc6]/60 bg-[#fbf8f1]/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="font-serif font-bold text-2xl text-[#b8860b] tracking-wider hover:opacity-90">
          Zareqia
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-[#7d6f6a] hover:text-[#2b2220] transition-colors"
        >
          Login
        </Link>
      </header>

      {/* Main Catalog Explorer (Image 1 & 2 Exact Match) */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 space-y-6">
        
        {/* Dropdown & Collection Switcher Controls */}
        <div className="text-center space-y-3">
          <p className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#7d6f6a] font-medium">
            Invitation Type
          </p>

          {/* CUSTOM LUXURY DROPDOWN (Matches Image 2 exactly) */}
          <div ref={dropdownRef} className="relative inline-block w-full max-w-sm text-left">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-5 py-3 rounded-2xl bg-[#fff8e7] border border-[#d7c5a4] text-xs font-semibold text-[#2b2220] flex items-center justify-between shadow-sm hover:border-[#b8860b] transition-all cursor-pointer"
            >
              <span>{currentTypeLabel}</span>
              <ChevronDown className={`w-4 h-4 text-[#7d6f6a] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Options */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#fff8e7] border border-[#d7c5a4] rounded-2xl shadow-2xl py-1.5 z-50 max-h-72 overflow-y-auto">
                {EVENT_TYPES.map((type) => {
                  const isSelected = type.id === selectedType;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectType(type.id)}
                      className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#b8860b] text-white font-bold'
                          : 'text-[#2b2220] hover:bg-[#f2ebe0]'
                      }`}
                    >
                      <span>{type.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#7d6f6a]">
            Royal plan includes both royal + classic templates.
          </p>

          {/* Pill Switcher (Matches Image 1 & 2) */}
          <div className="pt-2">
            <div className="inline-flex items-center bg-[#f2ebe0] p-1 rounded-full border border-[#d7c5a4]/80 shadow-inner">
              <button
                type="button"
                onClick={() => handleSelectCollection('royal')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCollection === 'royal'
                    ? 'bg-[#b8860b] text-white shadow-md'
                    : 'text-[#5f524e] hover:text-[#2b2220]'
                }`}
              >
                <span>👑</span>
                <span>Zareqia Royal</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCollection('classic')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCollection === 'classic'
                    ? 'bg-[#b8860b] text-white shadow-md'
                    : 'text-[#5f524e] hover:text-[#2b2220]'
                }`}
              >
                <span>Zareqia Classics</span>
              </button>
            </div>
          </div>

        </div>

        {/* Templates 5-Column Responsive Cards Grid (Matches Image 1 & 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-2xl overflow-hidden bg-[#1c1817] text-white border border-[#3b3230] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Graphic Mockup Area */}
              <div className={`h-60 bg-gradient-to-b ${tpl.bgGradient} p-3 flex flex-col justify-between relative overflow-hidden`}>
                
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md ${tpl.badgeStyle}`}>
                    {tpl.badge}
                  </span>
                  <span className="text-xl opacity-90">{tpl.coverArt}</span>
                </div>

                {/* Center Arch / Icon */}
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-full border-2 border-white/40 mx-auto flex items-center justify-center font-serif text-white text-lg shadow-inner bg-black/30 backdrop-blur-sm">
                    3D
                  </div>
                </div>

                {/* View Demo Button with Eye Icon */}
                <div className="flex justify-center">
                  <Link
                    href={`/invite/demo?template=${tpl.id}&type=${selectedType}`}
                    className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-[10px] font-semibold text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Demo</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Meta & USE THIS DESIGN Button */}
              <div className="p-3.5 bg-[#171312] border-t border-[#2e2624] space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-amber-100 text-xs tracking-wide">
                    {tpl.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>

                <Link
                  href={`/create?template=${tpl.id}&type=${selectedType}`}
                  className="block w-full py-2 bg-[#2a2220] hover:bg-[#b8860b] text-[#fbf8f1] text-center font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all border border-amber-500/20"
                >
                  USE THIS DESIGN
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Minimalist Footer (Matches Image 1 & 2) */}
      <footer className="w-full border-t border-[#e8dcc6] py-10 px-4 text-center space-y-4 bg-[#fbf8f1] text-[#7d6f6a] text-xs mt-12">
        <p className="font-serif font-bold text-base text-[#b8860b] tracking-wider">
          Zareqia
        </p>

        <div className="flex flex-wrap justify-center gap-5 text-[11px] text-[#5f524e] font-medium">
          <Link href="/about" className="hover:text-[#b8860b]">About</Link>
          <Link href="/contact" className="hover:text-[#b8860b]">Contact</Link>
          <Link href="/terms" className="hover:text-[#b8860b]">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-[#b8860b]">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-[#b8860b]">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-[#b8860b]">Shipping & Delivery</Link>
          <Link href="/affiliate" className="hover:text-[#b8860b]">Become an Affiliate</Link>
        </div>

        <p className="text-[10px] text-[#9a8c87]">
          © 2026 Zareqia. Crafted with love. Digital invitation service • No physical products shipped.
        </p>
      </footer>

      {/* Floating "Need help?" Pill (Matches Image 1 & 2 bottom right) */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => alert('Need help? Our celebration support team is online! Chat with us anytime.')}
          className="px-4 py-2.5 rounded-full bg-[#fff8e7] border border-[#d7c5a4] text-xs font-semibold text-[#2b2220] shadow-xl hover:shadow-2xl flex items-center gap-2 hover:border-[#b8860b] transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#b8860b]" />
          <span>Need help?</span>
        </button>
      </div>

    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf8f1] flex items-center justify-center text-xs text-[#7d6f6a]">Loading Zareqia Templates...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
