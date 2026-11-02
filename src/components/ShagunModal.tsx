'use client';

import React, { useState, useEffect } from 'react';
import { Gift, X, QrCode, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface ShagunModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  coupleNames: string;
  onSuccess: (amount: number) => void;
  qrImageUrl?: string;
}

export default function ShagunModal({ isOpen, onClose, upiId, coupleNames, onSuccess, qrImageUrl }: ShagunModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(2100);
  const [customAmount, setCustomAmount] = useState<string>('2100');
  const [dynamicQrUrl, setDynamicQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time dynamic QR generation matching the exact selected amount
  useEffect(() => {
    if (!upiId) return;
    const cleanId = upiId.trim();
    const payeeName = coupleNames.replace(/[&]/g, 'and').trim();

    // Standard NPCI UPI URI with dynamic pre-filled amount
    let upiUri = `upi://pay?pa=${encodeURIComponent(cleanId)}&pn=${encodeURIComponent(payeeName)}&cu=INR&tn=${encodeURIComponent('Wedding Shagun Blessings')}`;
    if (selectedAmount && selectedAmount > 0) {
      upiUri += `&am=${selectedAmount}`;
    }

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0a0a0a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setDynamicQrUrl(url))
      .catch((err) => {
        console.error('Failed to generate dynamic UPI QR', err);
        setDynamicQrUrl(qrImageUrl || '/images/upi-qr.jpg');
      });
  }, [upiId, coupleNames, selectedAmount, qrImageUrl]);

  if (!isOpen) return null;

  const amounts = [501, 1100, 2100, 5100];

  const handleCopyUpi = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayment = () => {
    const cleanId = upiId.trim();
    const payeeName = coupleNames.replace(/[&]/g, 'and').trim();
    let upiUri = `upi://pay?pa=${encodeURIComponent(cleanId)}&pn=${encodeURIComponent(payeeName)}&cu=INR&tn=${encodeURIComponent('Wedding Shagun Blessings')}`;
    if (selectedAmount && selectedAmount > 0) {
      upiUri += `&am=${selectedAmount}`;
    }

    // On mobile devices, launch the user's UPI app directly with amount pre-filled
    if (typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = upiUri;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onSuccess(selectedAmount);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#181105] to-[#0a0702] border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 sm:p-6 text-center shadow-[0_0_60px_rgba(212,175,55,0.4)] space-y-3.5 relative max-h-[92dvh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 cursor-pointer rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 text-2xl mx-auto shadow-inner">
          <Gift className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-serif font-bold text-amber-200 text-base sm:text-lg">Digital Shagun Envelope</h3>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Send your heartfelt love and blessings directly to {coupleNames} via UPI.
          </p>
        </div>

        {/* Quick Amount Selector & Editable Input */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount(amt.toString());
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAmount === amt
                    ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md font-mono scale-[1.02]'
                    : 'bg-amber-500/10 text-amber-200 border border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* Editable Custom Amount Field */}
          <div className="flex items-center gap-2 bg-black/50 border border-amber-400/40 rounded-xl px-3 py-2 focus-within:border-amber-400 transition-colors">
            <span className="text-amber-400 font-bold text-sm">₹</span>
            <input
              type="number"
              min="1"
              max="100000"
              value={customAmount}
              onChange={(e) => {
                const val = e.target.value;
                setCustomAmount(val);
                const num = parseInt(val, 10);
                if (!isNaN(num) && num > 0) {
                  setSelectedAmount(num);
                } else if (val === '') {
                  setSelectedAmount(0);
                }
              }}
              placeholder="Or enter custom amount (e.g. 5001)"
              className="bg-transparent text-amber-100 placeholder-amber-400/50 text-base sm:text-xs w-full focus:outline-none font-mono"
            />
            {selectedAmount > 0 && (
              <span className="text-[10px] text-amber-400/90 font-mono shrink-0 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                ₹{selectedAmount}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic UPI QR Code with Google Pay emblem */}
        <div className="relative bg-white p-2.5 rounded-2xl w-44 h-44 sm:w-48 sm:h-48 mx-auto flex flex-col items-center justify-center shadow-2xl border-2 border-amber-400/60 overflow-hidden group">
          <img
            src={dynamicQrUrl || qrImageUrl || '/images/upi-qr.jpg'}
            alt={`UPI QR Code for ${coupleNames}`}
            className="w-full h-full object-contain rounded-xl"
          />

          {/* Google Pay Center Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-lg border border-slate-200/90 flex items-center justify-center p-1">
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#4285F4" d="M36.8 15.6c0-1.1-.9-2-2-2h-5.6l-5.6 13.5-3.3-8c-.4-1-1.3-1.6-2.4-1.6h-5.4c-1.1 0-2 .9-2 2 0 .4.1.7.3 1l8.5 20.3c.4 1 1.3 1.6 2.4 1.6h5.3c1.1 0 2-.9 2-2 0-.2-.1-.5-.2-.7l3.7-8.9 4.3 4.2c.4.4.9.6 1.4.6h4.6c1.1 0 2-.9 2-2 0-.5-.2-1-.6-1.4l-5.4-5.2 4.4-10.6c.2-.2.3-.5.3-.8z"/>
                <path fill="#34A853" d="M24.8 24.5l-3.3-8c-.4-1-1.3-1.6-2.4-1.6h-5.4c-1.1 0-2 .9-2 2 0 .4.1.7.3 1l8.5 20.3c.4 1 1.3 1.6 2.4 1.6h5.3c1.1 0 2-.9 2-2 0-.2-.1-.5-.2-.7l-3.2-7.8 2.2-4.8z"/>
                <path fill="#FBBC05" d="M36.8 15.6c0-1.1-.9-2-2-2h-5.6l-5.6 13.5 2.2 4.8 7.4-7.7c.4-.4.6-.9.6-1.4v-7.2z"/>
                <path fill="#EA4335" d="M29.8 33.7l-4.2-4.2-3.7 8.9c0 .2.1.5.2.7 0 1.1.9 2 2 2h5.3c1.1 0 2-.9 2-2l-.6-1.4-1-4z"/>
              </svg>
            </div>
          </div>

          {/* Amount Badge on the QR Code */}
          {selectedAmount > 0 && (
            <div className="absolute bottom-1.5 right-1.5 bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm border border-amber-300">
              ₹{selectedAmount}
            </div>
          )}
        </div>

        {/* UPI Details & Copy Button */}
        <div className="space-y-1">
          <div className="text-xs font-mono text-amber-300 flex items-center justify-center gap-1.5 bg-black/40 py-1.5 px-3 rounded-xl border border-amber-400/20 max-w-xs mx-auto">
            <QrCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">UPI ID: <span className="font-bold text-white">{upiId}</span></span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="ml-1 p-1 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer shrink-0"
              title="Copy UPI ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">Accepted: GPay • PhonePe • Paytm • Any UPI App</p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isSuccess}
          className="w-full min-h-[44px] py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans"
        >
          {isSuccess ? '✨ Shagun Blessing Sent! ✨' : `Pay ₹${selectedAmount || customAmount || 0} & Send Shagun`}
        </button>
      </div>
    </div>
  );
}
