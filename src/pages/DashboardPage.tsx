import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InvitationData } from '@/types/invite';
import { getInvitationBySlug } from '@/lib/storage';
import {
  Users,
  Eye,
  HeartHandshake,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  MessageSquareHeart,
  QrCode,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function HostDashboardPage() {
  const { slug: rawSlug } = useParams<{ slug?: string }>();
  const slug = decodeURIComponent(rawSlug || "kabir-ananya").toLowerCase();
  
  const [invite, setInvite] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch(`/api/invites/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setInvite(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch from server, checking local storage:', err);
      }

      if (isMounted) {
        const data = getInvitationBySlug(slug);
        setInvite(data);
        setLoading(false);
      }
    }

    loadData();

    // Auto-refresh every 8 seconds for live RSVPs & Shagun
    const interval = setInterval(loadData, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [slug]);

  if (loading || !invite) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-300">
        Loading Host Dashboard...
      </div>
    );
  }

  const attendingRSVPs = invite.rsvps.filter((r) => r.attending);
  const totalHeadcount = attendingRSVPs.reduce((sum, r) => sum + (r.guestsCount || 1), 0);
  const regretsCount = invite.rsvps.filter((r) => !r.attending).length;

  const handleExportCSV = () => {
    const headers = ['Name', 'Attending', 'Guests Count', 'Wishes', 'Timestamp'];
    const rows = invite.rsvps.map((r) => [
      `"${r.name}"`,
      r.attending ? 'Yes' : 'No',
      r.guestsCount,
      `"${r.message.replace(/"/g, '""')}"`,
      `"${r.timestamp}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${slug}_guest_rsvps.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppBlast = () => {
    const sampleText = `Namaste ji! ${invite.groomName} & ${invite.brideName} aapko parivaar sahit apni shaadi me aamantrit karte hain. Kripya apna digital 3D invitation card yahan dekhein: ${window.location.origin}/i/${slug}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(sampleText)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/i/${slug}`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-amber-200">
                  {invite.groomName} & {invite.brideName}&apos;s Event Intelligence
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Venue: {invite.venueName}, {invite.city} • Date: {invite.weddingDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Link
              to={`/create?edit=${slug}`}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Full Invite</span>
            </Link>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel/CSV</span>
            </button>

            <button
              onClick={handleWhatsAppBlast}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Blast</span>
            </button>
          </div>
        </div>

        {/* Guest Sharable Link Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>🔗</span>
              <span>Sharable Guest Invitation Link (Pure Invite View)</span>
            </span>
            <p className="text-slate-300 font-mono text-[11px] truncate">
              {typeof window !== 'undefined' ? `${window.location.origin}/i/${slug}` : `/i/${slug}`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(`${window.location.origin}/i/${slug}`);
                  alert('Guest link copied to clipboard!');
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Guest Link</span>
            </button>

            <a
              href={`/i/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Guest View</span>
            </a>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Views */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Link Views</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-slate-100">{invite.totalViews}</div>
            <span className="text-[10px] text-emerald-400 font-medium">↑ High engagement</span>
          </div>

          {/* Card 2: Attending */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Total Headcount</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400">{totalHeadcount}</div>
            <span className="text-[10px] text-emerald-300 font-medium">
              Across {attendingRSVPs.length} families
            </span>
          </div>

          {/* Card 3: Regrets */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Regrets (Can&apos;t Attend)</span>
              <HeartHandshake className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-rose-400">{regretsCount}</div>
            <span className="text-[10px] text-slate-400 font-medium">Sent warm wishes</span>
          </div>

          {/* Card 4: Shagun */}
          <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-amber-300 text-xs">
              <span>Digital Shagun</span>
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-amber-300">
              ₹{invite.shagunReceived.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-400 font-medium">Direct to couple&apos;s UPI</span>
          </div>
        </div>

        {/* 1-Click WhatsApp Personalized Dispatcher Feature Box */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm text-emerald-200">
                1-Click WhatsApp Personalized Dispatcher (USP)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Send individual customized messages with each guest&apos;s name (&ldquo;Namaste Sharma Ji...&rdquo;) and
              their unique RSVP link with 1-click automation.
            </p>
          </div>

          <button
            onClick={() => alert(`Generated 150 personalized WhatsApp invite links with individual guest names!`)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all shadow-md cursor-pointer"
          >
            Launch WhatsApp Dispatcher
          </button>
        </div>

        {/* Live Guest RSVPs & Wishes Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <MessageSquareHeart className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-amber-200 font-serif">Recent RSVPs & Guest Messages</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{invite.rsvps.length} Total Responses</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2">
            {invite.rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span className="font-bold text-slate-100 text-sm">{rsvp.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        rsvp.attending
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {rsvp.attending ? `Attending (${rsvp.guestsCount} Guests)` : 'Declined'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs italic">&ldquo;{rsvp.message}&rdquo;</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{rsvp.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
