'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface RSVPFormProps {
  onSubmitRSVP: (data: { name: string; attending: boolean; guestsCount: number; message: string }) => void;
}

export default function RSVPForm({ onSubmitRSVP }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestsCount, setGuestsCount] = useState(2);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmitRSVP({
      name,
      attending,
      guestsCount: attending ? guestsCount : 0,
      message: message || (attending ? 'Can’t wait to celebrate with you!' : 'Sending heartfelt blessings!'),
    });

    setSubmitted(true);
    setName('');
    setMessage('');
  };

  return (
    <div className="bg-[#05180e] border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg text-slate-100">
      <div className="text-center">
        <h3 className="font-serif font-bold text-amber-300 text-sm">Will You Be Joining Us?</h3>
        <p className="text-[11px] text-slate-400">Kindly RSVP to assist our hospitality & catering team</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-xs text-emerald-300 font-bold">Thank you for your RSVP!</p>
          <p className="text-[11px] text-slate-300">Your response and wishes have reached the couple.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[10px] text-amber-300 underline font-medium cursor-pointer"
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block text-slate-300 text-[11px] mb-1 font-medium">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 text-[11px] mb-1 font-medium">Attending?</label>
              <select
                value={attending ? 'yes' : 'no'}
                onChange={(e) => setAttending(e.target.value === 'yes')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="yes">Joyfully Accept 🎉</option>
                <option value="no">Regretfully Decline</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-[11px] mb-1 font-medium">Guests Count</label>
              <input
                type="number"
                min="1"
                max="10"
                disabled={!attending}
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-[11px] mb-1 font-medium">Leave a Blessing / Wish</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wishing you a lifetime of love and happiness..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm RSVP & Send Wishes</span>
          </button>
        </form>
      )}
    </div>
  );
}
