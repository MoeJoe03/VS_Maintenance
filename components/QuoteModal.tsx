'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Send, Phone, MessageSquare, Mail, Sparkles, Loader2 } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CMSData;
  initialService?: string;
}

export default function QuoteModal({
  isOpen,
  onClose,
  cmsData,
  initialService = 'Building New Pools',
}: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    poolDetails: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit quote request');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${cmsData.branding.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${cmsData.branding.companyName}, I would like to inquire about ${formData.service || 'a swimming pool project'}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-white overflow-hidden p-6 sm:p-9 text-slateText">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EBFBFA] text-[#079BC5] flex items-center justify-center border-2 border-[#35D4DB]/40">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#172638] tracking-tight">
              Quote Request Received!
            </h3>
            <p className="text-sm text-[#647785] max-w-md leading-relaxed">
              Thank you, <strong className="text-slate-800">{formData.name}</strong>. Our lead master pool engineer will review your project requirements and get in touch within 24 hours.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#0682A6] hover:bg-[#079BC5] transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Direct WhatsApp Chat
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Back to Website
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#EBFBFA] flex items-center justify-center text-[#079BC5]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                Bespoke Aquatic Engineering
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172638] tracking-tight mb-2">
              Request Your Custom Quote
            </h2>
            <p className="text-xs sm:text-sm text-[#647785] mb-6">
              Tell us about your pool plans. Whether building new or upgrading equipment, our team is ready.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alishaan Deol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Needed
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  >
                    {cmsData.services.items.map((service) => <option key={service.id} value={service.title.replace(/\.$/, '')}>{service.title.replace(/\.$/, '')}</option>)}
                    <option value="Custom Consultation">Custom Architectural Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Details / Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your location, pool dimensions, or existing equipment..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5] resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-[#647785]">
                  <a
                    href={`tel:${cmsData.branding.telephone}`}
                    className="flex items-center gap-1.5 hover:text-[#079BC5] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {cmsData.branding.telephone}
                  </a>
                  <a
                    href={`mailto:${cmsData.branding.emailAddress}`}
                    className="flex items-center gap-1.5 hover:text-[#079BC5] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cms-button w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
