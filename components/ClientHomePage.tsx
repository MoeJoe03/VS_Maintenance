'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import ProcessSection from '@/components/ProcessSection';
import Testimonials from '@/components/Testimonials';
import CtaBanner from '@/components/CtaBanner';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import QuoteModal from '@/components/QuoteModal';
import { CMSData } from '@/lib/cms-types';

interface ClientHomePageProps {
  initialData: CMSData;
}

export default function ClientHomePage({ initialData }: ClientHomePageProps) {
  const [cmsData, setCmsData] = useState<CMSData>(initialData);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Building New Pools');
  const buttonTheme = {
    '--cms-button-background': cmsData.branding.primaryBrandColor,
    '--cms-button-text': cmsData.branding.buttonTextColor,
    '--cms-button-hover': cmsData.branding.buttonHoverColor,
    '--cms-accent-text': cmsData.branding.accentTextColor,
  } as React.CSSProperties;

  // Sync latest CMS data if user navigated back or if modified
  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && payload?.data) {
          setCmsData(payload.data);
        }
      })
      .catch(() => {
        // Fall back to initialData
      });
  }, []);

  const handleOpenQuote = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    window.location.assign('/contact#enquiry');
  };

  return (
    <main
      className="bg-white text-[#172638] min-h-screen pt-2 sm:pt-3 pb-0 selection:bg-cyan-200 selection:text-cyan-900 w-full overflow-x-clip"
      style={buttonTheme}
    >
      {/* Main Page Canvas Container */}
      <div
        className="w-full flex flex-col gap-10 md:gap-14"
        data-purpose="website-canvas"
      >
        {/* Hero Section */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
          <Hero cmsData={cmsData} onOpenQuote={() => handleOpenQuote()} />
        </div>

        {/* About Section */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
          <About cmsData={cmsData} />
        </div>

        {/* Services Section - 100% Full Width Edge-to-Edge for the Water Design SVG */}
        <Services
          cmsData={cmsData}
          onSelectService={(service) => handleOpenQuote(service)}
        />

        {/* Gallery Section - Our Work in Action (Matches user mockup image_88afc482.png) */}
        <Gallery
          cmsData={cmsData}
          onOpenQuote={(service) => handleOpenQuote(service || 'Building New Pools')}
        />

        {/* Our 3 Step Process to Your Dream Pool */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 lg:py-12">
          <ProcessSection cmsData={cmsData} onOpenQuote={() => handleOpenQuote('Maintenance')} />
        </div>

        {/* Client Testimonial / Review Showcase - Full Viewport Edge-to-Edge */}
        <Testimonials cmsData={cmsData} />

        {/* Final CTA Banner Section */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
          <CtaBanner cmsData={cmsData} onOpenQuote={() => handleOpenQuote()} />
        </div>

        {/* Contact Section - Let's Talk About Your Pool Project */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
          <ContactSection cmsData={cmsData} />
        </div>

        {/* Footer - Full Width Edge-to-Edge with Water Band */}
        <Footer cmsData={cmsData} onOpenQuote={() => handleOpenQuote()} />
      </div>

      {/* Quote & Consultation Modal */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        cmsData={cmsData}
        initialService={selectedService}
      />

    </main>
  );
}
