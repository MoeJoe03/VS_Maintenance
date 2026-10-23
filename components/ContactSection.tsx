'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface ContactSectionProps {
  cmsData: CMSData;
}

export default function ContactSection({ cmsData }: ContactSectionProps) {
  const contact = cmsData.contactSection || {
    eyebrow: 'GET IN TOUCH',
    headingPrefix: "Let's Talk About",
    headingHighlight: 'Your Pool Project.',
    description:
      'Have a question, need a quote, or want to discuss your ideas? Get in touch with our team and we’ll be happy to help.',
    phone: '082 637 1597',
    email: 'info@realvibepools.co.za',
    location: 'Sandton, South Africa',
    hoursWeekday: 'Mon – Fri: 8:00am – 5:00pm',
    hoursWeekend: 'Saturday: 8:00am – 1:00pm',
    hoursSunday: 'Sunday: Closed',
    formHeading: 'Send Us a Message',
    formSubheading: "Fill in the form below and we'll get back to you shortly.",
    submitButtonLabel: 'SEND MESSAGE',
  };

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [serviceHelp, setServiceHelp] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !emailAddress.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: emailAddress.trim(),
          phone: phoneNumber.trim(),
          service: serviceHelp,
          message: message.trim() || `Inquiry regarding ${serviceHelp}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
      setFullName('');
      setPhoneNumber('');
      setEmailAddress('');
      setMessage('');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full max-w-[1440px] mx-auto py-12 sm:py-16 lg:py-20 select-none"
      data-purpose="contact-showcase"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
        {/* Left Column: Contact Information (Matches contact_71c5c2f9.png) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start">
          {/* Eyebrow Tag */}
          <span className="text-xs font-bold tracking-[0.25em] text-[#009bbd] uppercase mb-3">
            {contact.eyebrow || 'GET IN TOUCH'}
          </span>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-6xl font-black text-[#172638] leading-[1.08] tracking-tight mb-4">
            {contact.headingPrefix || "Let's Talk About"}{' '}
            <span className="text-[#009bbd] block sm:inline">
              {contact.headingHighlight || 'Your Pool Project.'}
            </span>
          </h2>

          {/* Subheading / Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mb-8 sm:mb-10 font-normal">
            {contact.description}
          </p>

          {/* Stacked Contact Details */}
          <div className="flex flex-col gap-6 w-full">
            {/* 1. Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f7fa] flex items-center justify-center text-[#009bbd] shrink-0 shadow-xs">
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Phone
                </span>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="text-base sm:text-lg font-bold text-[#172638] hover:text-[#009bbd] transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            {/* 2. Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f7fa] flex items-center justify-center text-[#009bbd] shrink-0 shadow-xs">
                <Mail className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Email
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base sm:text-lg font-bold text-[#172638] hover:text-[#009bbd] transition-colors break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* 3. Location */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f7fa] flex items-center justify-center text-[#009bbd] shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Location
                </span>
                <span className="text-base sm:text-lg font-bold text-[#172638]">
                  {contact.location}
                </span>
              </div>
            </div>

            {/* 4. Hours */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f7fa] flex items-center justify-center text-[#009bbd] shrink-0 shadow-xs mt-0.5">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Trading Hours
                </span>
                <span className="text-sm sm:text-base font-bold text-[#172638] leading-snug whitespace-pre-line">
                  {[
                    contact.hoursWeekday,
                    contact.hoursWeekend,
                    contact.hoursSunday,
                  ].join('\n')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Send Us a Message Card (Matches contact_71c5c2f9.png) */}
        <div className="lg:col-span-7 xl:col-span-7 w-full">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 p-6 sm:p-9 lg:p-11 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172638] mb-1.5 tracking-tight">
              {contact.formHeading || 'Send Us a Message'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 font-normal">
              {contact.formSubheading || "Fill in the form below and we'll get back to you shortly."}
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#e8f7fa] border border-[#009bbd]/30 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#009bbd] text-white flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-extrabold text-[#172638] mb-1">Message Sent Successfully!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mb-4">
                  Thank you for reaching out. A real vibe pool specialist will review your details and get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="cms-button px-5 py-2 rounded-full text-xs font-bold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form id="enquiry" onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Full name */}
                <div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full rounded-2xl border border-slate-200/90 bg-[#f9fafb] px-4 py-3.5 text-sm text-[#172638] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#009bbd]/30 focus:border-[#009bbd] transition-all"
                  />
                </div>

                {/* Phone and email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number *"
                    className="w-full rounded-2xl border border-slate-200/90 bg-[#f9fafb] px-4 py-3.5 text-sm text-[#172638] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#009bbd]/30 focus:border-[#009bbd] transition-all"
                  />
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Email Address *"
                    className="w-full rounded-2xl border border-slate-200/90 bg-[#f9fafb] px-4 py-3.5 text-sm text-[#172638] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#009bbd]/30 focus:border-[#009bbd] transition-all"
                  />
                </div>

                {/* Service selection */}
                <div>
                  <div className="relative">
                    <select
                      required
                      value={serviceHelp}
                      onChange={(e) => setServiceHelp(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200/90 bg-[#f9fafb] px-4 py-3.5 pr-10 text-sm text-[#172638] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#009bbd]/30 focus:border-[#009bbd] transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a service *
                      </option>
                      <option value="Building a New Pool">Building a New Pool</option>
                      <option value="Pool Renovation & Resurfacing">Pool Renovation & Resurfacing</option>
                      <option value="Pool Maintenance & Care">Pool Maintenance & Care</option>
                      <option value="Equipment Installation & Repairs">Equipment Installation & Repairs</option>
                      <option value="Custom Consultation & Design">Custom Consultation & Design</option>
                      <option value="General Question">General Question</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message (optional)"
                    className="w-full rounded-2xl border border-slate-200/90 bg-[#f9fafb] px-4 py-3.5 text-sm text-[#172638] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#009bbd]/30 focus:border-[#009bbd] transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
                )}

                {/* Row 5: SEND MESSAGE Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cms-button w-full py-4 rounded-xl font-bold tracking-widest uppercase active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <span>{contact.submitButtonLabel || 'SEND MESSAGE'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
