import fs from 'fs';
import path from 'path';
import { InvitationData, RSVPResponse } from '@/types/invite';
import { DEFAULT_INVITATION, SAM_SOFIA_INVITATION, VEER_ZARA_INVITATION } from './storage';

const DATA_FILE = path.join(process.cwd(), 'data', 'invitations.json');

function ensureDataFile(): Record<string, InvitationData> {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: Record<string, InvitationData> = {
        [DEFAULT_INVITATION.slug]: DEFAULT_INVITATION,
        [SAM_SOFIA_INVITATION.slug]: SAM_SOFIA_INVITATION,
        [VEER_ZARA_INVITATION.slug]: VEER_ZARA_INVITATION,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!raw.trim()) {
      const initial = {
        [DEFAULT_INVITATION.slug]: DEFAULT_INVITATION,
        [SAM_SOFIA_INVITATION.slug]: SAM_SOFIA_INVITATION,
        [VEER_ZARA_INVITATION.slug]: VEER_ZARA_INVITATION,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading invitations data file:', err);
    return {
      [DEFAULT_INVITATION.slug]: DEFAULT_INVITATION,
      [SAM_SOFIA_INVITATION.slug]: SAM_SOFIA_INVITATION,
      [VEER_ZARA_INVITATION.slug]: VEER_ZARA_INVITATION,
    };
  }
}

function writeDataFile(data: Record<string, InvitationData>) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing invitations data file:', err);
  }
}

export function getAllInvitationsServer(): Record<string, InvitationData> {
  return ensureDataFile();
}

export function getInvitationBySlugServer(slug: string): InvitationData | null {
  const all = ensureDataFile();
  if (all[slug]) {
    return all[slug];
  }
  // Try case-insensitive lookup
  const lowerSlug = slug.toLowerCase();
  for (const key of Object.keys(all)) {
    if (key.toLowerCase() === lowerSlug) {
      return all[key];
    }
  }
  return null;
}

export function saveInvitationServer(invite: InvitationData): InvitationData {
  const all = ensureDataFile();
  const slug = (invite.slug || 'my-invite').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const updatedInvite: InvitationData = {
    ...invite,
    slug,
    totalViews: invite.totalViews || 0,
    rsvps: invite.rsvps || [],
    events: invite.events || [],
  };
  all[slug] = updatedInvite;
  writeDataFile(all);
  return updatedInvite;
}

export function addRSVPServer(
  slug: string,
  rsvp: { name: string; attending: boolean; guestsCount: number; message: string }
): InvitationData | null {
  const all = ensureDataFile();
  const targetKey = Object.keys(all).find((k) => k.toLowerCase() === slug.toLowerCase()) || slug;
  if (!all[targetKey]) return null;

  const newRsvp: RSVPResponse = {
    id: 'r_' + Date.now(),
    name: rsvp.name,
    attending: rsvp.attending,
    guestsCount: rsvp.guestsCount || 1,
    message: rsvp.message || '',
    timestamp: 'Just now',
  };

  all[targetKey].rsvps = [newRsvp, ...(all[targetKey].rsvps || [])];
  writeDataFile(all);
  return all[targetKey];
}

export function recordShagunServer(slug: string, amount: number): InvitationData | null {
  const all = ensureDataFile();
  const targetKey = Object.keys(all).find((k) => k.toLowerCase() === slug.toLowerCase()) || slug;
  if (!all[targetKey]) return null;

  all[targetKey].shagunReceived = (all[targetKey].shagunReceived || 0) + amount;
  writeDataFile(all);
  return all[targetKey];
}

export function incrementViewsServer(slug: string): void {
  const all = ensureDataFile();
  const targetKey = Object.keys(all).find((k) => k.toLowerCase() === slug.toLowerCase()) || slug;
  if (!all[targetKey]) return;

  all[targetKey].totalViews = (all[targetKey].totalViews || 0) + 1;
  writeDataFile(all);
}
