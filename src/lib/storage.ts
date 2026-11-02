import type { InvitationData, RSVPResponse } from '../types/invite';
import seedInvitationsData from '../data/seed-invitations.json';

const SEED_INVITATIONS = seedInvitationsData as unknown as Record<string, InvitationData>;

export const DEFAULT_INVITATION: InvitationData = {
  id: 'royal-demo-1',
  slug: 'kabir-ananya',
  groomName: 'Kabir',
  brideName: 'Ananya',
  weddingDate: '2026-12-14',
  city: 'Udaipur, Rajasthan',
  venueName: 'The Leela Palace Udaipur',
  venueAddress: 'Lake Pichola, Udaipur, Rajasthan 313001',
  googleMapsUrl: 'https://maps.google.com/?q=The+Leela+Palace+Udaipur',
  theme: 'emerald',
  salutation: '॥ श्री गणेशाय नमः ॥',
  tagline: 'Together with their families, request the pleasure of your company to celebrate their wedding union.',
  loveStory: 'From college canteen chai in 2020 to Lake Pichola vows in 2026 — two best friends taking the sweetest leap together.',
  musicTitle: 'Kudmayi - Shehnai Flute',
  fontFamily: "'Playfair Display', serif",
  introVideoUrl: '/videos/wedding-invite.mp4',
  shagunUpiId: 'akshitamishra8000@okhdfcbank',
  shagunQrCode: '/images/upi-qr.jpg',
  shagunReceived: 54600,
  totalViews: 1248,
  events: [
    {
      id: 'e1',
      title: '💛 Haldi & Phoolon Ki Holi',
      date: 'Dec 13, 2026',
      time: '10:30 AM',
      venue: 'The Courtyard Lawn',
      dressCode: 'Sunshine Yellow',
      icon: '🌻'
    },
    {
      id: 'e2',
      title: '💃 Sangeet & Musical Night',
      date: 'Dec 13, 2026',
      time: '07:00 PM',
      venue: 'Grand Ballroom',
      dressCode: 'Indo-Western Glam',
      icon: '✨'
    },
    {
      id: 'e3',
      title: '💍 The Royal Vows (Pheras)',
      date: 'Dec 14, 2026',
      time: '05:30 PM',
      venue: 'Lake Pichola Mandap',
      dressCode: 'Royal Traditional',
      icon: '👑'
    },
    {
      id: 'e4',
      title: '🥂 Grand Reception & Dinner',
      date: 'Dec 14, 2026',
      time: '08:30 PM',
      venue: 'Palace Banquet & Royal Terrace',
      dressCode: 'Black Tie & Elegant Ethnic',
      icon: '🍷'
    }
  ],
  rsvps: [
    {
      id: 'r1',
      name: 'Vikram & Neha Singhania',
      attending: true,
      guestsCount: 3,
      message: "Can't wait to dance at the Sangeet night! Heartiest congratulations to Kabir & Ananya.",
      timestamp: '15 mins ago'
    },
    {
      id: 'r2',
      name: 'Rajesh Uncle (London)',
      attending: false,
      guestsCount: 0,
      message: 'Missing the celebration due to international travel, sending all our prayers and shagun!',
      timestamp: '1 hour ago'
    }
  ]
};

// Sam & Sofia (Celestial Lakeside Theme matching Image 1)
export const SAM_SOFIA_INVITATION: InvitationData = {
  id: 'celestial-demo-2',
  slug: 'sam-sofia',
  groomName: 'Sam',
  brideName: 'Sofia',
  weddingDate: '2026-12-24',
  city: 'Lake Como, Italy',
  venueName: 'Villa Del Balbianello',
  venueAddress: 'Via Guido Monzino 1, 22016 Tremezzina, Lake Como',
  googleMapsUrl: 'https://maps.google.com/?q=Villa+Del+Balbianello+Lake+Como',
  theme: 'bloom',
  salutation: 'Together with our families, we invite you to celebrate our Ring Ceremony',
  tagline: 'Surrounded by mountain lakes and blooming hydrangeas, we invite you to celebrate our forever love.',
  loveStory: 'Two souls brought together under the Italian stars, embarking on a lifelong adventure together.',
  musicTitle: 'Lakeside Serenade - Soft Flute',
  fontFamily: "'Cormorant Garamond', serif",
  shagunUpiId: 'sam.sofia@oksbi',
  shagunReceived: 78000,
  totalViews: 2150,
  events: [
    {
      id: 'se1',
      title: '💍 The Ring Ceremony',
      date: 'Dec 24, 2026',
      time: '04:00 PM',
      venue: 'The Lakeside Terrace',
      dressCode: 'Soft Pastels & Linen',
      icon: '💎'
    },
    {
      id: 'se2',
      title: '🥂 Sunset Cocktail & Dinner',
      date: 'Dec 24, 2026',
      time: '07:30 PM',
      venue: 'Grand Pergola Pavilion',
      dressCode: 'Cocktail Elegance',
      icon: '✨'
    }
  ],
  rsvps: [
    {
      id: 'sr1',
      name: 'Elena & Marco Rossi',
      attending: true,
      guestsCount: 2,
      message: 'So happy for you both! Looking forward to celebrating on Lake Como.',
      timestamp: '20 mins ago'
    }
  ]
};

// Veer & Zara (Sunset Terrace / Rose Blush Theme matching latest uploaded image!)
export const VEER_ZARA_INVITATION: InvitationData = {
  id: 'veer-zara-demo-3',
  slug: 'veer-zara',
  groomName: 'Veer',
  brideName: 'Zara',
  weddingDate: '2027-02-14',
  city: 'Dubai, UAE',
  venueName: 'The Grand Pavilion, Palm Jumeirah',
  venueAddress: 'Crescent Rd, The Palm Jumeirah, Dubai, United Arab Emirates',
  googleMapsUrl: 'https://maps.google.com/?q=The+Palm+Jumeirah+Dubai',
  theme: 'crimson',
  salutation: 'In the name of God, the Most Gracious, the Most Merciful',
  tagline: 'With the divine blessings of God, two souls unite in love, affection, and sacred harmony.',
  loveStory: 'A timeless bond blessed by family and destiny under the golden skyline of Dubai.',
  musicTitle: 'Afreen Afreen - Romantic Shehnai',
  fontFamily: "'Great Vibes', cursive",
  introVideoUrl: '/videos/wedding-invite.mp4',
  shagunUpiId: 'akshitamishra8000@okhdfcbank',
  shagunQrCode: '/images/upi-qr.jpg',
  shagunReceived: 92500,
  totalViews: 3420,
  events: [
    {
      id: 've1',
      title: '🌸 Barat & Welcome',
      date: 'Feb 13, 2027',
      time: '05:00 PM',
      venue: 'Palace Courtyard',
      dressCode: 'Pastels & Sherwanis',
      icon: '🕊️'
    },
    {
      id: 've2',
      title: '💍 The Sacred Nikah',
      date: 'Feb 14, 2027',
      time: '06:30 PM',
      venue: 'Grand Terrace Overlooking Marina',
      dressCode: 'Royal Rose & Gold',
      icon: '🌹'
    },
    {
      id: 've3',
      title: '🥂 Grand Dinner & Walima',
      date: 'Feb 14, 2027',
      time: '08:30 PM',
      venue: 'Royal Ballroom Pavilion',
      dressCode: 'Formal Black Tie & Lehengas',
      icon: '✨'
    }
  ],
  rsvps: [
    {
      id: 'vr1',
      name: 'Tariq & Ayesha Khan',
      attending: true,
      guestsCount: 4,
      message: 'Mubarak to Veer & Zara! Flying in from London for the big day.',
      timestamp: '5 mins ago'
    }
  ]
};

const STORAGE_KEY = 'invite_platform_data';

function sanitizeInvite(inv: InvitationData): InvitationData {
  if (!inv) return inv;
  return {
    ...inv,
    introVideoUrl: inv.introVideoUrl || '/videos/wedding-invite.mp4',
    shagunQrCode: inv.shagunQrCode || '/images/upi-qr.jpg',
    salutation: inv.salutation ? inv.salutation.replace(/allah/gi, 'God') : inv.salutation,
    tagline: inv.tagline ? inv.tagline.replace(/allah/gi, 'God') : inv.tagline,
  };
}

export function getStoredInvitations(): Record<string, InvitationData> {
  const sanitizeAll = (map: Record<string, InvitationData>) => {
    const res: Record<string, InvitationData> = {};
    for (const k of Object.keys(map)) {
      res[k] = sanitizeInvite(map[k]);
    }
    return res;
  };

  const initialDefaults: Record<string, InvitationData> = {
    [DEFAULT_INVITATION.slug]: DEFAULT_INVITATION,
    [SAM_SOFIA_INVITATION.slug]: SAM_SOFIA_INVITATION,
    [VEER_ZARA_INVITATION.slug]: VEER_ZARA_INVITATION,
    ...(SEED_INVITATIONS || {}),
  };

  if (typeof window === 'undefined') {
    return sanitizeAll(initialDefaults);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaults));
      return sanitizeAll(initialDefaults);
    }
    const parsed = JSON.parse(raw);
    for (const key of Object.keys(initialDefaults)) {
      if (!parsed[key]) {
        parsed[key] = initialDefaults[key];
      }
    }
    return sanitizeAll(parsed);
  } catch {
    return sanitizeAll(initialDefaults);
  }
}

export function getInvitationBySlug(slug: string): InvitationData {
  const invites = getStoredInvitations();
  const found = invites[slug];
  if (found) return sanitizeInvite(found);

  if (SEED_INVITATIONS && SEED_INVITATIONS[slug]) {
    return sanitizeInvite(SEED_INVITATIONS[slug]);
  }
  if (slug === 'veer-zara') return sanitizeInvite(VEER_ZARA_INVITATION);
  if (slug === 'sam-sofia') return sanitizeInvite(SAM_SOFIA_INVITATION);
  if (slug === 'kabir-ananya') return sanitizeInvite(DEFAULT_INVITATION);

  const cleanGroom = slug.split('-')[0] ? (slug.split('-')[0].charAt(0).toUpperCase() + slug.split('-')[0].slice(1)) : 'Groom';
  const cleanBride = slug.split('-')[1] ? (slug.split('-')[1].charAt(0).toUpperCase() + slug.split('-')[1].slice(1)) : 'Bride';

  return sanitizeInvite({
    ...DEFAULT_INVITATION,
    id: 'invite_' + slug,
    slug,
    groomName: cleanGroom,
    brideName: cleanBride,
  });
}

export function saveInvitation(invite: InvitationData): void {
  if (typeof window === 'undefined') return;
  try {
    const invites = getStoredInvitations();
    invites[invite.slug] = invite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));

    // Background sync to server API
    fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invite),
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save invitation', err);
  }
}

export function addRSVPToInvite(slug: string, rsvp: Omit<RSVPResponse, 'id' | 'timestamp'>): InvitationData {
  const invite = getInvitationBySlug(slug);
  const newRsvp: RSVPResponse = {
    ...rsvp,
    id: 'r_' + Date.now(),
    timestamp: 'Just now'
  };
  invite.rsvps.unshift(newRsvp);
  saveInvitation(invite);
  return invite;
}
