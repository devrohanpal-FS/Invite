'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitationData } from '@/types/invite';
import { getInvitationBySlug, addRSVPToInvite, saveInvitation } from '@/lib/storage';
import InvitationView from '@/components/InvitationView';
import RoyalMonarchView from '@/components/RoyalMonarchView';
import VeerZaraView from '@/components/VeerZaraView';
import PhoneMockup from '@/components/PhoneMockup';
import { BarChart3, Edit3 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Floating Utility for Hosts */}
      <div className="w-full max-w-[395px] mb-2 flex items-center justify-between text-xs text-slate-400 px-2">
        <a
          href={`/create?edit=${slug}`}
          className="hover:text-amber-300 flex items-center gap-1 transition-colors text-amber-400/90 font-medium"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit This Invite</span>
        </a>

        <a
          href={`/dashboard/${slug}`}
          className="hover:text-amber-300 flex items-center gap-1 text-amber-400/90 font-medium transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Host Dashboard →</span>
        </a>
      </div>

      <PhoneMockup>
        {renderTemplateView()}
      </PhoneMockup>
    </div>
  );
}
