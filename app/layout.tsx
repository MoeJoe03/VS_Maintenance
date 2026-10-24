import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import SiteParallax from '@/components/SiteParallax';
import FloatingContactButtons from '@/components/FloatingContactButtons';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Royel Pool — World-Class Aquatic Craftsmanship',
  description:
    'Bespoke architectural swimming pool engineering, maintenance, repair, and lifelong pristine water quality.',
  openGraph: {
    title: 'Royel Pool — World-Class Aquatic Craftsmanship',
    description:
      'Bespoke architectural swimming pool engineering, maintenance, repair, and lifelong pristine water quality.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Royel Pool — World-Class Aquatic Craftsmanship',
    description:
      'Bespoke architectural swimming pool engineering, maintenance, repair, and lifelong pristine water quality.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <body className="bg-white text-[#172638] antialiased min-h-screen selection:bg-cyan-200 selection:text-cyan-900" suppressHydrationWarning>
        {children}
        <SiteParallax />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
