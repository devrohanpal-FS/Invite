export interface TemplateConfig {
  id: string;
  name: string;
  category: 'wedding' | 'birthday' | 'anniversary';
  tag: string;
  desc: string;
  coverImage: string;
  accentColor: string;
  badgeColor: string;
  // Visual Theme Styles
  bgStyle: string; // Tailwind gradient / background
  cardStyle: string; // Glassmorphism container style
  textColor: string;
  fontClass: string;
  scratchShape: 'heart' | 'rectangle';
  musicDefault: string;
}

export const TEMPLATES: TemplateConfig[] = [
  // ==========================================
  // 1. WEDDING INVITATIONS (3 DESIGNS)
  // ==========================================
  {
    id: 'celestial-lakeside',
    name: 'Celestial Lakeside (Sam & Sofia)',
    category: 'wedding',
    tag: 'Trending',
    desc: 'Painterly mountain lake scenery, draped floral hydrangeas, sky-blue clouds, and silver heart reveal.',
    coverImage: '🏞️',
    accentColor: '#38bdf8',
    badgeColor: 'bg-sky-500/20 text-sky-700 border-sky-400',
    bgStyle: 'bg-gradient-to-b from-[#b8daf8] via-[#d4e9fc] to-[#f0f7fe]',
    cardStyle: 'backdrop-blur-xl bg-white/40 border border-white/60 shadow-xl shadow-sky-900/5',
    textColor: 'text-slate-800',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Lakeside Serenade - Soft Flute',
  },
  {
    id: 'veer-zara',
    name: 'Veer & Zara (Sunset Terrace)',
    category: 'wedding',
    tag: 'Cinematic',
    desc: 'Sunset balcony terrace, pink climbing roses, flying white doves, romantic calligraphy, and rose-blush glassmorphism.',
    coverImage: '🕊️',
    accentColor: '#fb7185',
    badgeColor: 'bg-rose-500/20 text-rose-800 border-rose-400',
    bgStyle: 'bg-gradient-to-b from-[#fcdde2] via-[#fae8eb] to-[#fcf5f6]',
    cardStyle: 'backdrop-blur-xl bg-white/50 border border-rose-300/60 shadow-xl shadow-rose-900/5',
    textColor: 'text-slate-800',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Kudmayi - Shehnai Flute',
  },
  {
    id: 'royal-grandeur',
    name: 'Royal Palace Grandeur (Kabir & Ananya)',
    category: 'wedding',
    tag: 'Bestseller',
    desc: 'Majestic ballroom red carpet staircase, golden banisters, deep burgundy & champagne royal luxury.',
    coverImage: '🏰',
    accentColor: '#c59b2d',
    badgeColor: 'bg-amber-500/20 text-amber-800 border-amber-400',
    bgStyle: 'bg-gradient-to-b from-[#3b1118] via-[#5c1d27] to-[#fbf8f1]',
    cardStyle: 'backdrop-blur-xl bg-black/40 border border-[#c59b2d]/40 shadow-2xl text-slate-100',
    textColor: 'text-slate-100',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Kudmayi - Shehnai Flute',
  },

  // ==========================================
  // 2. BIRTHDAY INVITATIONS (3 DESIGNS)
  // ==========================================
  {
    id: 'midnight-sparkle',
    name: 'Midnight Gold & Confetti',
    category: 'birthday',
    tag: 'Popular',
    desc: 'Obsidian charcoal black with glowing neon gold lights, floating party balloons, and champagne cheers.',
    coverImage: '✨',
    accentColor: '#fbbf24',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400',
    bgStyle: 'bg-gradient-to-b from-[#0f0e13] via-[#1a1724] to-[#0d0c12]',
    cardStyle: 'backdrop-blur-xl bg-white/10 border border-amber-400/30 shadow-2xl text-slate-100',
    textColor: 'text-slate-100',
    fontClass: 'font-sans',
    scratchShape: 'heart',
    musicDefault: 'Upbeat Acoustic Celebration',
  },
  {
    id: 'pastel-bloom',
    name: 'Blush Floral & Macaron',
    category: 'birthday',
    tag: 'Sweet 16 / Kids',
    desc: 'Soft blush pink, pastel lavender glow, gold embossed butterflies, and whimsical fairytale fonts.',
    coverImage: '🌸',
    accentColor: '#f472b6',
    badgeColor: 'bg-pink-500/20 text-pink-700 border-pink-400',
    bgStyle: 'bg-gradient-to-b from-[#fed7e2] via-[#fce7f3] to-[#fdf2f8]',
    cardStyle: 'backdrop-blur-xl bg-white/50 border border-white/70 shadow-xl shadow-pink-900/5',
    textColor: 'text-slate-800',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Fairytale Music Box Chime',
  },
  {
    id: 'neon-cyber-party',
    name: 'Neon Cyber Lounge',
    category: 'birthday',
    tag: 'Modern',
    desc: 'Electric violet and cyan lasers, sleek dark glass cards, live DJ music vibe, and party countdown.',
    coverImage: '🎧',
    accentColor: '#a855f7',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400',
    bgStyle: 'bg-gradient-to-b from-[#180929] via-[#2c104d] to-[#0f041c]',
    cardStyle: 'backdrop-blur-xl bg-white/10 border border-purple-400/30 shadow-2xl text-slate-100',
    textColor: 'text-slate-100',
    fontClass: 'font-sans',
    scratchShape: 'rectangle',
    musicDefault: 'Chill Lounge Beats',
  },

  // ==========================================
  // 3. ANNIVERSARY & ENGAGEMENT (3 DESIGNS)
  // ==========================================
  {
    id: 'antique-seal',
    name: 'Crimson Velvet & Wax Seal',
    category: 'anniversary',
    tag: 'Romantic',
    desc: 'Deep burgundy velvet drapery, personalized monogram wax seal, flickering candlelight, and piano melody.',
    coverImage: '💌',
    accentColor: '#722f37',
    badgeColor: 'bg-rose-500/20 text-rose-800 border-rose-400',
    bgStyle: 'bg-gradient-to-b from-[#2e0e14] via-[#48161f] to-[#1a060a]',
    cardStyle: 'backdrop-blur-xl bg-black/45 border border-rose-500/40 shadow-2xl text-slate-100',
    textColor: 'text-slate-100',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Romantic Grand Piano Chords',
  },
  {
    id: 'botanical-glasshouse',
    name: 'Botanical Glasshouse & Gold',
    category: 'anniversary',
    tag: 'Minimalist',
    desc: 'Sage eucalyptus leaves, warm ivory glassmorphism, golden serif typography, and natural garden serenity.',
    coverImage: '🌿',
    accentColor: '#84cc16',
    badgeColor: 'bg-lime-500/20 text-lime-800 border-lime-400',
    bgStyle: 'bg-gradient-to-b from-[#e8efe6] via-[#d5e2d1] to-[#f4f7f2]',
    cardStyle: 'backdrop-blur-xl bg-white/50 border border-white/70 shadow-xl shadow-stone-800/5',
    textColor: 'text-slate-800',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Acoustic Guitar Serenade',
  },
  {
    id: 'rose-gold-eternity',
    name: 'Rose Gold Eternity',
    category: 'anniversary',
    tag: 'Luxury',
    desc: 'Shimmering metallic rose gold, floating champagne bubbles, interlocking diamond wedding rings.',
    coverImage: '🥂',
    accentColor: '#fb7185',
    badgeColor: 'bg-rose-500/20 text-rose-700 border-rose-400',
    bgStyle: 'bg-gradient-to-b from-[#4a242c] via-[#66323d] to-[#2b1319]',
    cardStyle: 'backdrop-blur-xl bg-black/40 border border-rose-400/30 shadow-2xl text-slate-100',
    textColor: 'text-slate-100',
    fontClass: 'font-serif',
    scratchShape: 'heart',
    musicDefault: 'Timeless Cello & Violin',
  },
];
