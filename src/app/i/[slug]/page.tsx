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
  const slug = (params?.slug as string) || 'kabir-ananya';
  const [invite, setInvite] = useState<InvitationData | null>(null);

  useEffect(() => {
    const data = getInvitationBySlug(slug);
    data.totalViews = (data.totalViews || 0) + 1;
    saveInvitation(data);
    setInvite({ ...data });
  }, [slug]);

  const handleRSVP = (rsvpData: { name: string; attending: boolean; guestsCount: number; message: string }) => {
    if (!invite) return;
    const updated = addRSVPToInvite(slug, rsvpData);
    setInvite({ ...updated });
  };

  const handleShagun = (amount: number) => {
    if (!invite) return;
    const updated = {
      ...invite,
      shagunReceived: (invite.shagunReceived || 0) + amount,
    };
    saveInvitation(updated);
    setInvite({ ...updated });
  };

  if (!invite) {
    return (
      <div className="min-h-screen bg-[#020b06] flex items-center justify-center text-amber-300 font-serif">
        Loading Royal Invitation...
      </div>
    );
  }

  // Choose component based on slug or selected theme
  const renderTemplateView = () => {
    if (slug === 'veer-zara' || invite.theme === 'rose') {
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
    <div className="min-h-screen bg-slate-950 flex justify-center">
      {/* Pure Guest Invitation Viewport: Only the invitation, zero host controls */}
      <main className="w-full max-w-[440px] min-h-screen flex flex-col bg-slate-900 shadow-2xl overflow-x-hidden relative">
        {renderTemplateView()}
      </main>
    </div>
  );
}
