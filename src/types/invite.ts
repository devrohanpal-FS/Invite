export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  dressCode?: string;
  icon?: string;
}

export interface RSVPResponse {
  id: string;
  name: string;
  attending: boolean;
  guestsCount: number;
  message: string;
  timestamp: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // YYYY-MM-DD
  city: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl?: string;
  theme: 'emerald' | 'crimson' | 'gold' | 'bloom' | 'rose';
  salutation: string;
  tagline: string;
  loveStory?: string;
  musicTitle: string;
  musicUrl?: string;
  fontFamily?: string;
  couplePhoto?: string;
  photoSubtitle?: string;
  introVideoUrl?: string;
  shagunUpiId: string;
  shagunQrCode?: string;
  shagunReceived: number;
  events: EventItem[];
  rsvps: RSVPResponse[];
  totalViews: number;
}
