'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitationData } from '@/types/invite';
import { getInvitationBySlug, addRSVPToInvite, saveInvitation } from '@/lib/storage';
import InvitationView from '@/components/InvitationView';
import RoyalMonarchView from '@/components/RoyalMonarchView';
import VeerZaraView from '@/components/VeerZaraView';

export default function GuestInvitePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || 'kabir-ananya';
  const slug = decodeURIComponent(rawSlug).toLowerCase();
  const [invite, setInvite] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInvite() {
      try {
        // Attempt to fetch from server API
        const res = await fetch(`/api/invites/${slug}?view=true`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setInvite(json.data);
            saveInvitation(json.data); // sync to localStorage cache
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch from server API, falling back to local storage:', err);
      }

      // Fallback to client-side localStorage
      if (isMounted) {
        const localData = getInvitationBySlug(slug);
        localData.totalViews = (localData.totalViews || 0) + 1;
        saveInvitation(localData);
        setInvite(localData);
        setLoading(false);
      }
    }

    loadInvite();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleRSVP = async (rsvpData: { name: string; attending: boolean; guestsCount: number; message: string }) => {
    if (!invite) return;

    // 1. Optimistic update in UI
    const updated = addRSVPToInvite(slug, rsvpData);
    setInvite({ ...updated });

    // 2. Persist to server API
    try {
      const res = await fetch(`/api/invites/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setInvite(json.data);
          saveInvitation(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to post RSVP to server:', err);
    }
  };

  const handleShagun = async (amount: number) => {
    if (!invite) return;

    // 1. Optimistic update
    const updated = {
      ...invite,
      shagunReceived: (invite.shagunReceived || 0) + amount,
    };
    saveInvitation(updated);
    setInvite({ ...updated });

    // 2. Persist to server API
    try {
      const res = await fetch(`/api/invites/${slug}/shagun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setInvite(json.data);
          saveInvitation(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to post Shagun to server:', err);
    }
  };

  if (loading || !invite) {
    return (
      <div className="min-h-screen min-h-[100dvh] w-full bg-[#030705] flex flex-col items-center justify-center text-amber-300 font-serif gap-4 p-4 text-center">
        <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
        <div className="space-y-1">
          <p className="text-sm tracking-[0.2em] uppercase font-bold text-amber-200">Opening Royal Invitation</p>
          <p className="text-xs text-amber-400/60 font-sans">Preparing ceremony details & music...</p>
        </div>
      </div>
    );
  }

  // Choose component based on slug or selected theme
  const renderTemplateView = () => {
    if (slug === 'veer-zara' || invite.theme === 'rose' || invite.theme === 'crimson') {
      return (
        <VeerZaraView
          invite={invite}
          showCurtainInitial={true}
          onUpdateRSVP={handleRSVP}
          onUpdateShagun={handleShagun}
        />
      );
    }
    if (slug === 'sam-sofia' || invite.theme === 'bloom') {
      return (
        <RoyalMonarchView
          invite={invite}
          showCurtainInitial={true}
          onUpdateRSVP={handleRSVP}
          onUpdateShagun={handleShagun}
        />
      );
    }
    return (
      <InvitationView
        invite={invite}
        showGatesInitial={true}
        onUpdateRSVP={handleRSVP}
        onUpdateShagun={handleShagun}
      />
    );
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-start">
      {renderTemplateView()}
    </div>
  );
}
