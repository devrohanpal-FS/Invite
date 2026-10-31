'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { InvitationData, EventItem } from '@/types/invite';
import {
  DEFAULT_INVITATION,
  SAM_SOFIA_INVITATION,
  VEER_ZARA_INVITATION,
  saveInvitation,
  getStoredInvitations,
  getInvitationBySlug,
} from '@/lib/storage';
import { getCurrentUser, linkInviteToCurrentUser } from '@/lib/auth';
import PhoneMockup from '@/components/PhoneMockup';
import InvitationView from '@/components/InvitationView';
import RoyalMonarchView from '@/components/RoyalMonarchView';
import VeerZaraView from '@/components/VeerZaraView';
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Plus,
  Trash2,
  Music,
  Calendar,
  MapPin,
  Heart,
  Palette,
  Gift,
  FileText,
  Check,
  ExternalLink,
  Clock,
  Layers,
  Save,
  RotateCcw,
  Upload,
  Type,
  FileAudio,
  X,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';

const SALUTATION_PRESETS = [
  { label: 'Hindu (Ganesh)', value: '॥ श्री गणेशाय नमः ॥' },
  { label: 'Divine Blessing (God)', value: 'In the name of God, the Most Gracious, the Most Merciful' },
  { label: 'Sikh (Ek Onkar)', value: '॥ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥' },
  { label: 'Contemporary', value: 'Together with our families, we invite you to celebrate' },
  { label: 'Poetic', value: 'Two Hearts, One Soul — Celebrating Forever' },
];

const TAGLINE_PRESETS = [
  'Together with their families, request the pleasure of your company to celebrate their wedding union.',
  'Surrounded by our loved ones, we invite you to celebrate our sacred vows and lifelong promise.',
  'With joyful hearts and the blessings of our parents, we invite you to celebrate our wedding ceremonies.',
  'Two best friends taking the sweetest leap together. Join us for an unforgettable celebration of love.',
];

const MUSIC_PRESETS = [
  'Kudmayi - Shehnai Flute',
  'Din Shagna Da - Shehnai Flute',
  'Afreen Afreen - Romantic Shehnai',
  'Lakeside Serenade - Soft Flute',
  'A Thousand Years - Soft Piano',
  'Jashn-e-Bahara - Instrumental Flute',
];

const EMOJI_OPTIONS = ['🌻', '💃', '💍', '🥂', '🪔', '🌸', '🕊️', '💎', '✨', '🥁', '🥻', '👑', '🎉', '🌹'];

const PHOTO_PRESETS = [
  {
    label: 'Sunset Beach',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    caption: 'Under the golden sunset of Dubai',
  },
  {
    label: 'Royal Palace',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    caption: 'Two Hearts, One Journey • Forever Begins Today',
  },
  {
    label: 'Lake Como Garden',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    caption: 'Two Souls, One Forever Promise',
  },
  {
    label: 'Minimalist Chic',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    caption: 'Our Love Story Begins Here',
  },
];

const CAPTION_PRESETS = [
  'Under the golden sunset of Dubai',
  'Two Hearts, One Journey • Forever Begins Today',
  'Two Souls, One Forever Promise',
  'Our Love Story Begins Here',
  'With love, laughter, and family blessings',
];

// 10 Curated Luxury Wedding Fonts
const FONT_OPTIONS = [
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: "'Playfair Display', serif",
    category: 'Royal Heritage Serif',
    description: 'High contrast editorial serif representing regal tradition & elegance.',
  },
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    family: "'Great Vibes', cursive",
    category: 'Romantic Calligraphy',
    description: 'Graceful, flowing cursive script ideal for classic wedding invitations.',
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    family: "'Cinzel', serif",
    category: 'Imperial Palace Roman',
    description: 'Grand classical Roman proportion serif inspired by palace inscriptions.',
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    family: "'Cormorant Garamond', serif",
    category: 'Ethereal Luxury Serif',
    description: 'Delicate, traditional heritage serif with poetic curves.',
  },
  {
    id: 'alex-brush',
    name: 'Alex Brush',
    family: "'Alex Brush', cursive",
    category: 'Graceful Formal Script',
    description: 'Smooth, connected brush script with a sophisticated modern touch.',
  },
  {
    id: 'parisienne',
    name: 'Parisienne',
    family: "'Parisienne', cursive",
    category: 'French Vintage Romance',
    description: 'Free-spirited French script with vintage flair and bounce.',
  },
  {
    id: 'prata',
    name: 'Prata',
    family: "'Prata', serif",
    category: 'Haute Couture Didone',
    description: 'Refined fashion serif featuring elegant teardrop finials.',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'Modern Contemporary',
    description: 'Clean geometric lines for couples wanting modern architectural chic.',
  },
  {
    id: 'italiana',
    name: 'Italiana',
    family: "'Italiana', serif",
    category: 'Italian Riviera Serif',
    description: 'Slender, high-fashion serif inspired by classic Italian calligraphy.',
  },
  {
    id: 'marcellus',
    name: 'Marcellus',
    family: "'Marcellus', serif",
    category: 'Sculpted Classical',
    description: 'Noble inscription titling font with subtle flared terminals.',
  },
];

function parseToIsoDate(str: string): string {
  if (!str) return '';
  const cleaned = str.trim().replace(/,/g, ' ');
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;

  const dmyMatch = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return '';
}

function formatDisplayDate(isoOrStr: string): string {
  if (!isoOrStr) return '';
  const iso = parseToIsoDate(isoOrStr);
  if (!iso) return isoOrStr;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return isoOrStr;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatFullDate(isoOrStr: string): string {
  if (!isoOrStr) return '';
  const iso = parseToIsoDate(isoOrStr);
  if (!iso) return isoOrStr;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return isoOrStr;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseTimeTo24h(timeStr: string): string {
  if (!timeStr) return '12:00';
  const cleaned = timeStr.trim();
  if (/^\d{2}:\d{2}$/.test(cleaned)) return cleaned;
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '12:00';
  let [, h, m, meridiem] = match;
  let hours = parseInt(h, 10);
  if (meridiem) {
    meridiem = meridiem.toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }
  return `${String(hours).padStart(2, '0')}:${m}`;
}

function formatTimeFrom24h(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const meridiem = h >= 12 ? 'PM' : 'AM';
  const hours12 = h % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
}

type TabKey = 'all' | 'couple' | 'photo' | 'message' | 'venue' | 'events' | 'soundtrack' | 'font' | 'theme' | 'shagun';

function CreateInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const editSlug = searchParams.get('edit');

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [storedInvites, setStoredInvites] = useState<Record<string, InvitationData>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Initialize form data
  const [formData, setFormData] = useState<InvitationData>(() => {
    return {
      ...DEFAULT_INVITATION,
      id: 'invite_' + Date.now(),
      slug: 'akshita-gaurav',
      groomName: 'Akshita (Bittu)',
      brideName: 'Gaurav',
      weddingDate: '2026-12-11',
      city: 'Pushkar, Rajasthan',
      venueName: 'Sh. Akhil Bhartiye, Dadhieech Seva Trust',
      venueAddress: 'Dadhieech Bhavan, 16 Pushkar Road, Pushkar, Rajasthan',
      googleMapsUrl: 'https://maps.google.com/?q=Dadhieech+Bhavan+Pushkar+Road',
      salutation: '॥ श्री गणेशाय नमः ॥',
      tagline: 'Together with their families, request the pleasure of your company to celebrate their wedding union.',
      shagunUpiId: 'akshitamishra8000@okhdfcbank',
      shagunQrCode: '/images/upi-qr.jpg',
      musicTitle: 'Kudmayi - Shehnai Flute',
      fontFamily: "'Playfair Display', serif",
      couplePhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      photoSubtitle: 'Under the golden sunset of Dubai',
      theme: 'emerald',
      loveStory: 'Two best friends from college who realized that forever was better together.',
    };
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const all = getStoredInvitations();
    setStoredInvites(all);

    const user = getCurrentUser();
    setCurrentUser(user);

    const sanitize = (inv: InvitationData): InvitationData => ({
      ...inv,
      shagunQrCode: inv.shagunQrCode || '/images/upi-qr.jpg',
      salutation: inv.salutation ? inv.salutation.replace(/allah/gi, 'God') : inv.salutation,
      tagline: inv.tagline ? inv.tagline.replace(/allah/gi, 'God') : inv.tagline,
    });

    if (editSlug && all[editSlug]) {
      setFormData(sanitize(all[editSlug]));
      setCustomSlug(editSlug);
      setIsSlugManuallyEdited(true);
    } else if (editSlug) {
      const invite = getInvitationBySlug(editSlug);
      if (invite) {
        setFormData(sanitize(invite));
        setCustomSlug(editSlug);
        setIsSlugManuallyEdited(true);
      }
    } else if (templateId === 'veer-zara') {
      setFormData(sanitize({
        ...VEER_ZARA_INVITATION,
        id: 'invite_' + Date.now(),
        slug: 'veer-zara',
        fontFamily: "'Great Vibes', cursive",
      }));
    } else if (templateId === 'royal-majesty' || templateId === 'royal-monarch' || templateId === 'celestial-lakeside') {
      setFormData(sanitize({
        ...SAM_SOFIA_INVITATION,
        id: 'invite_' + Date.now(),
        slug: 'sam-sofia',
        fontFamily: "'Cormorant Garamond', serif",
      }));
    }
  }, [editSlug, templateId]);

  const handleGroomNameChange = (newName: string) => {
    const cleanGroom = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBride = formData.brideName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const autoSlug = cleanGroom && cleanBride ? `${cleanGroom}-${cleanBride}` : cleanGroom || cleanBride || 'my-invite';

    setFormData((prev) => ({
      ...prev,
      groomName: newName,
      slug: (!editSlug && !isSlugManuallyEdited) ? autoSlug : prev.slug,
    }));
    if (!editSlug && !isSlugManuallyEdited) {
      setCustomSlug(autoSlug);
    }
  };

  const handleBrideNameChange = (newName: string) => {
    const cleanGroom = formData.groomName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBride = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const autoSlug = cleanGroom && cleanBride ? `${cleanGroom}-${cleanBride}` : cleanGroom || cleanBride || 'my-invite';

    setFormData((prev) => ({
      ...prev,
      brideName: newName,
      slug: (!editSlug && !isSlugManuallyEdited) ? autoSlug : prev.slug,
    }));
    if (!editSlug && !isSlugManuallyEdited) {
      setCustomSlug(autoSlug);
    }
  };

  const generateAIStory = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const stories = [
        `"From awkward first dates at a crowded cafe in 2021 to dreaming under the starlit skies of Rajasthan — we found our forever in each other's smiles."`,
        `"He loved her laughter; she loved his warmth. Two souls who started as strangers, became best friends, and are now taking their sacred vows."`,
        `"A story written by destiny, laughter, and endless late-night chai. We can't wait to begin our next greatest adventure together."`,
        `"Through every high, low, and late-night conversation, our love grew stronger every day. Forever begins now."`,
      ];
      const random = stories[Math.floor(Math.random() * stories.length)];
      setFormData((prev) => ({ ...prev, loveStory: random }));
      setAiGenerating(false);
    }, 600);
  };

  const handleGenerateMapsUrl = () => {
    const query = encodeURIComponent(`${formData.venueName}, ${formData.venueAddress || formData.city}`);
    setFormData((prev) => ({
      ...prev,
      googleMapsUrl: `https://maps.google.com/?q=${query}`,
    }));
  };

  const handleAddEvent = () => {
    const defaultDate = formData.weddingDate ? formatDisplayDate(formData.weddingDate) : 'Dec 20, 2026';
    const newEvent: EventItem = {
      id: 'event_' + Date.now(),
      title: 'New Wedding Function',
      date: defaultDate,
      time: '07:00 PM',
      venue: formData.venueName || 'Banquet Hall',
      dressCode: 'Royal Festive',
      icon: '✨',
    };
    setFormData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const handleUpdateEvent = (id: string, updates: Partial<EventItem>) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
    }));
  };

  const handleRemoveEvent = (id: string) => {
    if (formData.events.length <= 1) {
      alert('You must have at least one function in the itinerary.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((ev) => ev.id !== id),
    }));
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Audio file size exceeds 15MB. Please choose a smaller MP3 or audio track.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        musicTitle: cleanTitle,
        musicUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedMusic = () => {
    setFormData((prev) => ({
      ...prev,
      musicTitle: 'Kudmayi - Shehnai Flute',
      musicUrl: undefined,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        couplePhoto: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      couplePhoto: undefined,
    }));
  };

  const handleSaveAndPublish = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGroom = formData.groomName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBride = formData.brideName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const autoSlug = cleanGroom && cleanBride ? `${cleanGroom}-${cleanBride}` : cleanGroom || cleanBride || 'my-invite';
    const chosenSlug = (editSlug || customSlug || formData.slug || autoSlug).toLowerCase().replace(/[^a-z0-9-]/g, '');
    const finalSlug = chosenSlug || autoSlug;

    const finalized: InvitationData = {
      ...formData,
      slug: finalSlug,
      events: formData.events || [],
    };
    saveInvitation(finalized);
    linkInviteToCurrentUser(finalSlug);
    setSaveSuccess(true);
    setTimeout(() => {
      router.push(`/i/${finalSlug}`);
    }, 400);
  };

  const handleSwitchEditingInvite = (slugToLoad: string) => {
    if (slugToLoad === 'new') {
      router.push('/create');
      setIsSlugManuallyEdited(false);
      setCustomSlug('');
      setFormData({
        ...DEFAULT_INVITATION,
        id: 'invite_' + Date.now(),
        slug: 'my-invite',
        groomName: 'Groom',
        brideName: 'Bride',
      });
      return;
    }
    router.push(`/create?edit=${slugToLoad}`);
    setIsSlugManuallyEdited(true);
    setCustomSlug(slugToLoad);
    const inv = storedInvites[slugToLoad] || getInvitationBySlug(slugToLoad);
    if (inv) setFormData(inv);
  };

  const isCurrentRose = formData.theme === 'rose' || formData.slug === 'veer-zara';
  const isCurrentBloom = formData.theme === 'bloom' || formData.slug === 'sam-sofia';

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#2b2220] flex flex-col selection:bg-[#722f37] selection:text-[#fff8e7]">
      {/* Top Header */}
      <header className="w-full border-b border-[#e8dcc6] bg-[#fbf8f1]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif font-bold text-2xl text-[#b8860b] tracking-wider">
            Zareqia
          </Link>
          <span className="text-[11px] text-[#7d6f6a] border-l border-[#d7c5a4] pl-3 hidden sm:inline font-medium">
            Full Studio Editor • Fonts, Music &amp; Times
          </span>
        </div>

        {/* Saved Invite Selector */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <span className="text-[11px] bg-[#e8dcc6] text-[#722f37] px-2.5 py-1 rounded-xl font-medium hidden sm:inline">
              👤 {currentUser.name}
            </span>
          )}
          <label className="text-[11px] font-semibold text-[#7d6f6a] hidden md:inline">
            Editing Invite:
          </label>
          <select
            value={editSlug || formData.slug || ''}
            onChange={(e) => handleSwitchEditingInvite(e.target.value)}
            className="px-2.5 py-1.5 bg-[#f5ede0] border border-[#d7c5a4] rounded-xl text-xs font-semibold text-[#2b2220] focus:outline-none cursor-pointer max-w-[190px] truncate"
          >
            <option value="new">+ Create Fresh Invite</option>
            {Object.keys(storedInvites).map((k) => (
              <option key={k} value={k}>
                {storedInvites[k].groomName} &amp; {storedInvites[k].brideName} ({k})
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-2 rounded-xl bg-[#b8860b] hover:bg-[#9a7009] text-[#fff8e7] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? 'Saved! Opening...' : 'Publish & View Live'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Split-Screen Studio */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Form Controls */}
        <div className="lg:col-span-7 bg-[#fff8e7] border border-[#e8dcc6] rounded-3xl p-5 sm:p-7 shadow-xl shadow-[#722f37]/5 space-y-5">
          <div className="border-b border-[#e8dcc6] pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#2b2220] font-serif">
                Full Invitation Customization Form
              </h1>
              <p className="text-xs text-[#7d6f6a] mt-0.5">
                Upload your song, pick from 10 luxury fonts, and customize event times with real-time sync.
              </p>
            </div>
            {formData.slug && (
              <a
                href={`/i/${formData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#b8860b] hover:underline flex items-center gap-1"
              >
                <span>/i/{formData.slug}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#e8dcc6] scrollbar-thin">
            {[
              { id: 'all', label: 'All Sections', icon: Layers },
              { id: 'couple', label: '💍 Couple & Date', icon: Heart },
              { id: 'photo', label: '📸 Couple Photo', icon: ImageIcon },
              { id: 'message', label: '💌 Message & Bio', icon: FileText },
              { id: 'venue', label: '📍 Venue & Map', icon: MapPin },
              { id: 'events', label: `📅 Functions (${formData.events?.length || 0})`, icon: Calendar },
              { id: 'soundtrack', label: '🎵 Music & Upload', icon: Music },
              { id: 'font', label: '🔤 Font (10)', icon: Type },
              { id: 'theme', label: '🎨 Theme', icon: Palette },
              { id: 'shagun', label: '🎁 Shagun UPI', icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                    active
                      ? 'bg-[#b8860b] text-[#fff8e7] font-bold shadow-xs'
                      : 'bg-[#f5ede0] hover:bg-[#ece2cf] text-[#5e4f48]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSaveAndPublish} className="space-y-6 text-xs">
            {/* ============================================================ */}
            {/* SECTION 1: Couple Names & Auspicious Salutation */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'couple') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>1. Couple Names &amp; Auspicious Blessing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#2b2220] font-semibold mb-1">Groom / Host Name</label>
                    <input
                      type="text"
                      required
                      value={formData.groomName}
                      onChange={(e) => handleGroomNameChange(e.target.value)}
                      placeholder="e.g. Akshita (Bittu) / Rohit"
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2b2220] font-semibold mb-1">Bride / Partner Name</label>
                    <input
                      type="text"
                      required
                      value={formData.brideName}
                      onChange={(e) => handleBrideNameChange(e.target.value)}
                      placeholder="e.g. Gaurav / Priya"
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-medium"
                    />
                  </div>
                </div>

                {/* Unique Invitation Link / Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#2b2220] font-semibold">Your Unique Invitation Link / Slug</label>
                    <span className="text-[10px] text-[#b8860b] font-mono font-bold">
                      /i/{customSlug || formData.slug}
                    </span>
                  </div>
                  <div className="flex items-center bg-[#ffffff] border border-[#d7c5a4] rounded-xl overflow-hidden focus-within:border-[#b8860b] shadow-2xs">
                    <span className="px-3 py-2 bg-[#f5ede0] text-[#7d6f6a] font-mono text-xs border-r border-[#d7c5a4] select-none">
                      zareqia.com/i/
                    </span>
                    <input
                      type="text"
                      required
                      value={customSlug || formData.slug}
                      onChange={(e) => {
                        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        setIsSlugManuallyEdited(true);
                        setCustomSlug(clean);
                        setFormData({ ...formData, slug: clean });
                      }}
                      placeholder="e.g. rahul-priya"
                      className="w-full px-3 py-2 bg-transparent text-[#2b2220] focus:outline-none font-mono text-xs font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-[#7d6f6a] mt-1">
                    Live link: Guests will visit this link on WhatsApp &amp; mobile browsers.
                  </p>
                </div>

                {/* Salutation / Blessing Presets */}
                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Auspicious Salutation / Religious Blessing
                  </label>
                  <input
                    type="text"
                    value={formData.salutation || ''}
                    onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                    placeholder="e.g. ॥ श्री गणेशाय नमः ॥ or In the name of God..."
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SALUTATION_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, salutation: p.value })}
                        className="px-2 py-1 rounded-lg bg-[#f0e7d5] hover:bg-[#e6d8be] text-[#5e4f48] text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        ✦ {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wedding Date & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#2b2220] font-semibold">Main Event Date</label>
                      {formData.weddingDate && (
                        <span className="text-[10px] font-mono text-[#b8860b] font-bold">
                          {formatFullDate(formData.weddingDate)}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs cursor-pointer font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2b2220] font-semibold mb-1">City / Destination</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pushkar, Rajasthan / Udaipur"
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 2: Couple Portrait & Photo Frame */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'photo') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                    <ImageIcon className="w-4 h-4 text-[#b8860b]" />
                    <span>2. Couple Portrait &amp; Photo Frame</span>
                    {formData.couplePhoto && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Photo Active
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-[#7d6f6a]">
                  Upload your pre-wedding picture or portrait to appear inside the royal photo frame:
                </p>

                {/* Upload or Preview Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-white to-[#fbf8f1] border-2 border-dashed border-[#b8860b]/40 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Thumbnail / Upload Area */}
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#d7c5a4] bg-[#f5ede0] shrink-0 flex items-center justify-center shadow-inner group">
                      {formData.couplePhoto ? (
                        <>
                          <img
                            src={formData.couplePhoto}
                            alt="Couple Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-[#7d6f6a] hover:text-[#b8860b] transition-colors p-2 text-center">
                          <Camera className="w-6 h-6 mb-1 text-[#b8860b]" />
                          <span className="text-[9px] font-semibold">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Upload Controls & Actions */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <span className="font-bold text-[#2b2220] text-xs block">
                          {formData.couplePhoto ? 'Custom Photo Active' : 'Upload Couple Picture'}
                        </span>
                        <span className="text-[10px] text-[#7d6f6a] block">
                          Recommended: Portrait or square photo (JPG, PNG, WebP up to 10MB)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <label className="px-3 py-1.5 rounded-xl bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{formData.couplePhoto ? 'Change Photo' : 'Choose Image File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {formData.couplePhoto && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image URL Input as Alternative */}
                  <div className="pt-2 border-t border-[#f0e7d5]">
                    <label className="block text-[#5e4f48] text-[10px] font-semibold mb-1">
                      Or Paste Image Direct URL:
                    </label>
                    <input
                      type="url"
                      value={formData.couplePhoto || ''}
                      onChange={(e) => setFormData({ ...formData, couplePhoto: e.target.value })}
                      placeholder="https://example.com/couple-photo.jpg"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b] font-mono text-[11px]"
                    />
                  </div>

                  {/* 1-Click Sample Preset Photos */}
                  <div className="pt-1">
                    <span className="text-[10px] text-[#7d6f6a] font-medium block mb-1">
                      Or Pick a Sample Couple Portrait Preset:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PHOTO_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              couplePhoto: preset.url,
                              photoSubtitle: preset.caption,
                            });
                          }}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            formData.couplePhoto === preset.url
                              ? 'border-[#b8860b] bg-amber-50 shadow-xs'
                              : 'border-[#d7c5a4] bg-white hover:border-[#b8860b]/50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-[9px] font-semibold text-[#2b2220] truncate max-w-full">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Romantic Caption / Subtitle */}
                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Photo Romantic Subtitle / Caption
                  </label>
                  <input
                    type="text"
                    value={formData.photoSubtitle || ''}
                    onChange={(e) => setFormData({ ...formData, photoSubtitle: e.target.value })}
                    placeholder="e.g. Under the golden sunset of Dubai / Two Hearts, One Journey"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs text-xs"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {CAPTION_PRESETS.map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoSubtitle: cap })}
                        className="px-2 py-1 rounded-lg bg-[#f0e7d5] hover:bg-[#e6d8be] text-[#5e4f48] text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        ✦ {cap}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 2: Invitation Tagline & Love Story Bio */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'message') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <FileText className="w-4 h-4 text-[#b8860b]" />
                  <span>2. Invitation Tagline &amp; Love Story Bio</span>
                </div>

                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Family Invitation Tagline / Welcoming Text
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs"
                  />
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[10px] text-[#7d6f6a] font-medium">Quick suggestions:</span>
                    {TAGLINE_PRESETS.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, tagline: t })}
                        className="text-left px-2.5 py-1 rounded-lg bg-[#f0e7d5]/60 hover:bg-[#e6d8be] text-[#5e4f48] text-[10px] transition-colors truncate cursor-pointer"
                      >
                        &ldquo;{t}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Bio Writer */}
                <div className="p-4 rounded-xl bg-[#f2ebe0] border border-[#d7c5a4] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#b8860b]">
                      <Wand2 className="w-4 h-4 text-[#b8860b]" />
                      <span>Couple Bio / Love Story Writer</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateAIStory}
                      disabled={aiGenerating}
                      className="px-2.5 py-1 rounded-lg bg-[#b8860b]/10 hover:bg-[#b8860b]/20 text-[#b8860b] text-[10px] font-bold border border-[#b8860b]/30 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#b8860b]" />
                      <span>{aiGenerating ? 'Writing...' : '✨ Generate with AI'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={formData.loveStory || ''}
                    onChange={(e) => setFormData({ ...formData, loveStory: e.target.value })}
                    placeholder="Write a sweet quote or couple's story..."
                    className="w-full px-3 py-2 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 3: Venue & Navigation */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'venue') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>3. Venue Location &amp; Map Navigation</span>
                </div>

                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">Venue Name / Resort / Banquet</label>
                  <input
                    type="text"
                    required
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="e.g. Sh. Akhil Bhartiye, Dadhieech Seva Trust"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">Venue Full Address</label>
                  <input
                    type="text"
                    required
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    placeholder="e.g. Dadhieech Bhavan, 16 Pushkar Road, Pushkar, Rajasthan"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#2b2220] font-semibold">Google Maps URL</label>
                    <button
                      type="button"
                      onClick={handleGenerateMapsUrl}
                      className="text-[10px] text-[#b8860b] hover:underline font-semibold cursor-pointer"
                    >
                      📍 Auto-generate from venue
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.googleMapsUrl || ''}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 4: Function Itinerary & Timeline Builder with Time Picker & Date Picker */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'events') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                    <Calendar className="w-4 h-4 text-[#b8860b]" />
                    <span>4. Wedding Functions &amp; Itinerary Timeline</span>
                    <span className="text-[10px] bg-[#b8860b]/15 text-[#b8860b] px-2 py-0.5 rounded-full font-sans font-bold">
                      {formData.events.length} Events
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="px-3 py-1.5 rounded-xl bg-[#b8860b] hover:bg-[#9a7009] text-[#fff8e7] font-bold text-[11px] shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Function</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#7d6f6a]">
                  Customize each function with interactive Date &amp; Time Pickers:
                </p>

                <div className="space-y-3.5">
                  {formData.events.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#d7c5a4] space-y-3 shadow-xs relative"
                    >
                      <div className="flex items-center justify-between border-b border-[#f0e7d5] pb-2">
                        <div className="flex items-center gap-2">
                          {/* Emoji Icon Picker */}
                          <select
                            value={event.icon || '✨'}
                            onChange={(e) => handleUpdateEvent(event.id, { icon: e.target.value })}
                            className="w-9 h-9 text-base bg-[#fbf8f1] border border-[#d7c5a4] rounded-lg text-center cursor-pointer focus:outline-none"
                          >
                            {EMOJI_OPTIONS.map((em) => (
                              <option key={em} value={em}>
                                {em}
                              </option>
                            ))}
                          </select>
                          <span className="font-bold text-[#2b2220] text-xs">
                            Function #{idx + 1}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(event.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove this function"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="block text-[#5e4f48] text-[10px] font-semibold mb-0.5">
                            Function Title
                          </label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => handleUpdateEvent(event.id, { title: e.target.value })}
                            placeholder="e.g. Sangeet & Musical Night"
                            className="w-full px-2.5 py-1.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b]"
                          />
                        </div>

                        {/* Interactive Time Picker */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[#5e4f48] text-[10px] font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#b8860b]" />
                              <span>Time Picker</span>
                            </label>
                            {event.time && (
                              <span className="text-[10px] text-[#b8860b] font-bold font-mono">
                                {event.time}
                              </span>
                            )}
                          </div>
                          <input
                            type="time"
                            value={parseTimeTo24h(event.time)}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateEvent(event.id, { time: formatTimeFrom24h(e.target.value) });
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#ffffff] border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-medium cursor-pointer"
                          />
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            {['10:00 AM', '12:00 PM', '05:00 PM', '07:30 PM', '09:00 PM'].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleUpdateEvent(event.id, { time: t })}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0e7d5] hover:bg-[#e4d6bf] text-[#5e4f48] font-semibold transition-colors cursor-pointer"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Date Picker */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[#5e4f48] text-[10px] font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#b8860b]" />
                              <span>Function Date</span>
                            </label>
                            {event.date && (
                              <span className="text-[10px] text-[#b8860b] font-bold font-mono">
                                {event.date}
                              </span>
                            )}
                          </div>
                          <input
                            type="date"
                            value={parseToIsoDate(event.date) || parseToIsoDate(formData.weddingDate) || ''}
                            onChange={(e) => {
                              const iso = e.target.value;
                              const formatted = formatDisplayDate(iso);
                              handleUpdateEvent(event.id, { date: formatted });
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#ffffff] border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-medium cursor-pointer"
                          />
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const formatted = formatDisplayDate(formData.weddingDate);
                                handleUpdateEvent(event.id, { date: formatted });
                              }}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0e7d5] hover:bg-[#e4d6bf] text-[#5e4f48] font-semibold transition-colors cursor-pointer"
                              title="Set to main wedding date"
                            >
                              📅 Wedding Day
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentIso = parseToIsoDate(event.date) || formData.weddingDate;
                                if (!currentIso) return;
                                const [y, m, d] = currentIso.split('-').map(Number);
                                const prevDay = new Date(y, m - 1, d - 1);
                                const iso = `${prevDay.getFullYear()}-${String(prevDay.getMonth() + 1).padStart(2, '0')}-${String(prevDay.getDate()).padStart(2, '0')}`;
                                handleUpdateEvent(event.id, { date: formatDisplayDate(iso) });
                              }}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0e7d5] hover:bg-[#e4d6bf] text-[#5e4f48] font-semibold transition-colors cursor-pointer"
                              title="1 day before current date"
                            >
                              ⏮ -1 Day
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentIso = parseToIsoDate(event.date) || formData.weddingDate;
                                if (!currentIso) return;
                                const [y, m, d] = currentIso.split('-').map(Number);
                                const nextDay = new Date(y, m - 1, d + 1);
                                const iso = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
                                handleUpdateEvent(event.id, { date: formatDisplayDate(iso) });
                              }}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0e7d5] hover:bg-[#e4d6bf] text-[#5e4f48] font-semibold transition-colors cursor-pointer"
                              title="1 day after current date"
                            >
                              ⏭ +1 Day
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#5e4f48] text-[10px] font-semibold mb-0.5">
                            Sub-Venue / Lawn / Hall
                          </label>
                          <input
                            type="text"
                            value={event.venue}
                            onChange={(e) => handleUpdateEvent(event.id, { venue: e.target.value })}
                            placeholder="e.g. The Courtyard Lawn"
                            className="w-full px-2.5 py-1.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#5e4f48] text-[10px] font-semibold mb-0.5">
                            Dress Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={event.dressCode || ''}
                            onChange={(e) => handleUpdateEvent(event.id, { dressCode: e.target.value })}
                            placeholder="e.g. Sunshine Yellow / Indo-Western Glam / Royal Ethnic"
                            className="w-full px-2.5 py-1.5 bg-[#fbf8f1] border border-[#d7c5a4] rounded-lg text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 5: Music & Soundtrack (With MP3/Audio Upload) */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'soundtrack') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <Music className="w-4 h-4 text-purple-600" />
                  <span>5. Ambient Music &amp; Audio Upload</span>
                </div>

                {/* Upload Music Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#ffffff] to-[#fbf8f1] border-2 border-dashed border-[#b8860b]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#b8860b]/10 text-[#b8860b] flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#2b2220] text-xs block">
                          Upload Custom Music / Song
                        </span>
                        <span className="text-[10px] text-[#7d6f6a]">
                          Upload your couple song (MP3, WAV, M4A, AAC)
                        </span>
                      </div>
                    </div>

                    <label className="px-3 py-1.5 rounded-xl bg-[#b8860b] hover:bg-[#9a7009] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Audio File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleMusicUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.musicUrl ? (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileAudio className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-emerald-900 text-xs truncate">
                            {formData.musicTitle}
                          </p>
                          <p className="text-[10px] text-emerald-700">
                            Custom audio ready &amp; synced to invitation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <audio
                          controls
                          src={formData.musicUrl}
                          className="h-8 max-w-[200px]"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveUploadedMusic}
                          className="p-1.5 text-rose-600 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                          title="Remove uploaded audio and use preset"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#7d6f6a] italic">
                      No custom audio file uploaded yet. You can upload an MP3 or pick a preset below.
                    </p>
                  )}
                </div>

                {/* Preset tracks */}
                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Or Select from Curated Wedding Instrumentals
                  </label>
                  <select
                    value={formData.musicTitle}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        musicTitle: e.target.value,
                        musicUrl: undefined,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs cursor-pointer font-medium"
                  >
                    {MUSIC_PRESETS.map((m) => (
                      <option key={m} value={m}>
                        🎵 {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Song Display Title
                  </label>
                  <input
                    type="text"
                    value={formData.musicTitle}
                    onChange={(e) => setFormData({ ...formData, musicTitle: e.target.value })}
                    placeholder="e.g. Romantic Shehnai Symphony"
                    className="w-full px-3.5 py-2 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-xs text-[#2b2220] focus:outline-none focus:border-[#b8860b]"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 6: Typography & Font Selection (10 Fonts) */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'font') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                    <Type className="w-4 h-4 text-[#b8860b]" />
                    <span>6. Typography &amp; Font Selection</span>
                    <span className="text-[10px] bg-[#b8860b]/15 text-[#b8860b] px-2 py-0.5 rounded-full font-sans font-bold">
                      10 Fonts Available
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#7d6f6a]">
                  Choose from 10 luxury typefaces for couple names and royal headlines across your invitation card:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONT_OPTIONS.map((font) => {
                    const isSelected = (formData.fontFamily || "'Playfair Display', serif") === font.family;
                    return (
                      <div
                        key={font.id}
                        onClick={() => setFormData({ ...formData, fontFamily: font.family })}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-2 border-[#b8860b] bg-amber-50/70 shadow-md scale-[1.01]'
                            : 'border-[#d7c5a4] bg-white hover:border-[#b8860b]/50 hover:bg-[#fffdfa]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-xs text-[#2b2220] block">
                              {font.name}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-[#b8860b] font-semibold">
                              {font.category}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#b8860b] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Live Couple Names Preview in this Font */}
                        <div className="p-2.5 rounded-xl bg-[#fbf8f1] border border-[#e8dcc6] text-center my-1">
                          <p
                            style={{ fontFamily: font.family }}
                            className="text-xl md:text-2xl text-[#722f37] font-normal leading-tight"
                          >
                            {formData.groomName || 'Akshita'} &amp; {formData.brideName || 'Gaurav'}
                          </p>
                        </div>

                        <p className="text-[10px] text-[#7d6f6a] mt-1.5">
                          {font.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 7: Visual Theme Switcher */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'theme') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <Palette className="w-4 h-4 text-[#b8860b]" />
                  <span>7. Visual Theme &amp; Style</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'rose' })}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      formData.theme === 'rose'
                        ? 'border-2 border-rose-500 bg-rose-50/80 shadow-md scale-[1.02]'
                        : 'border-[#d7c5a4] bg-[#ffffff] hover:bg-rose-50/30'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-500 mx-auto mb-1.5 shadow-xs"></div>
                    <span className="font-bold text-rose-900 block text-xs">Rose Terrace</span>
                    <span className="text-[9px] text-rose-700 block">Veer &amp; Zara Vibe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'bloom' })}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      formData.theme === 'bloom'
                        ? 'border-2 border-[#0284c7] bg-sky-50 shadow-md scale-[1.02]'
                        : 'border-[#d7c5a4] bg-[#ffffff] hover:bg-sky-50/30'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-sky-500 mx-auto mb-1.5 shadow-xs"></div>
                    <span className="font-bold text-[#0c4a6e] block text-xs">Lakeside Sky</span>
                    <span className="text-[9px] text-[#0369a1] block">Sam &amp; Sofia Vibe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'crimson' })}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      formData.theme === 'crimson'
                        ? 'border-2 border-[#b8860b] bg-[#fbf5eb] shadow-md scale-[1.02]'
                        : 'border-[#d7c5a4] bg-[#ffffff] hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#722f37] mx-auto mb-1.5 shadow-xs"></div>
                    <span className="font-bold text-[#722f37] block text-xs">Royal Ballroom</span>
                    <span className="text-[9px] text-[#9a3e49] block">Ruby &amp; Gold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'emerald' })}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      formData.theme === 'emerald'
                        ? 'border-2 border-emerald-600 bg-emerald-50 shadow-md scale-[1.02]'
                        : 'border-[#d7c5a4] bg-[#ffffff] hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-700 mx-auto mb-1.5 shadow-xs"></div>
                    <span className="font-bold text-emerald-900 block text-xs">Emerald Court</span>
                    <span className="text-[9px] text-emerald-700 block">Palace Majesty</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SECTION 8: Digital Shagun UPI */}
            {/* ============================================================ */}
            {(activeTab === 'all' || activeTab === 'shagun') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf8f1] border border-[#e2d5bd] space-y-4">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#b8860b]">
                  <Gift className="w-4 h-4 text-[#b8860b]" />
                  <span>8. Direct Shagun UPI ID (Zero Fee Blessings)</span>
                </div>

                <div>
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    Your Personal / Couple UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shagunUpiId}
                    onChange={(e) => setFormData({ ...formData, shagunUpiId: e.target.value })}
                    placeholder="e.g. yourname@oksbi / couple@upi"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#d7c5a4] rounded-xl text-[#2b2220] focus:outline-none focus:border-[#b8860b] shadow-2xs font-mono"
                  />
                  <p className="text-[10px] text-[#7d6f6a] mt-1.5">
                    Guests can send digital gifts directly to your bank account via GPay, PhonePe, Paytm, or BHIM.
                  </p>
                </div>

                {/* Shagun QR Code Preview & Upload */}
                <div className="pt-2">
                  <label className="block text-[#2b2220] font-semibold mb-1">
                    UPI Payment QR Code
                  </label>
                  <div className="flex items-center gap-4 p-3 bg-white border border-[#d7c5a4] rounded-2xl">
                    <div className="w-20 h-20 bg-amber-50 rounded-xl border border-amber-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      <img
                        src={formData.shagunQrCode || '/images/upi-qr.jpg'}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-[#2b2220] font-medium">Custom GPay / UPI QR Active</p>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b8860b] hover:bg-[#9a7009] text-white text-[11px] font-bold cursor-pointer transition-all shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New QR</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, shagunQrCode: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#b8860b] hover:bg-[#9a7009] text-[#fff8e7] font-bold rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-amber-900/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>
                  {saveSuccess ? 'Changes Saved! Redirecting...' : 'Save Changes &amp; Publish Live Link'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Phone Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <div className="mb-2 text-center flex items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-[#b8860b] bg-[#e8dcc6] px-3.5 py-1 rounded-full border border-[#d7c5a4] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Phone Simulator • Character Sync</span>
            </span>
          </div>

          <PhoneMockup>
            {isCurrentRose ? (
              <VeerZaraView invite={formData} showCurtainInitial={false} />
            ) : isCurrentBloom ? (
              <RoyalMonarchView invite={formData} showCurtainInitial={false} />
            ) : (
              <InvitationView invite={formData} showGatesInitial={false} />
            )}
          </PhoneMockup>
        </div>
      </main>
    </div>
  );
}

export default function CreateInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf8f1] flex items-center justify-center text-xs">
          Loading Full Studio Form...
        </div>
      }
    >
      <CreateInviteContent />
    </Suspense>
  );
}
