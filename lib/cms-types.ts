export interface ServiceItem {
  afterImage?: string;
  included?: string[];
  id: string;
  title: string;
  image: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  mainImage: string;
  quoteTitle: string;
  quoteBody: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  location?: string;
  stars?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'New Pools' | 'Pool Renovation' | 'Paving' | 'Pool Repairs' | 'Maintenance' | 'Equipment Installs' | 'Transformations';
  imageUrl: string;
  layoutType?: 'tall' | 'stacked-top' | 'stacked-bottom';
  slideGroup?: number; // 1, 2, 3, 4
  location?: string;
  description?: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  poolDetails?: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface CMSData {
  branding: {
    companyName: string;
    companyNameWordColors: string[];
    companyTagline: string;
    logoUrl: string; // If empty, renders original SVG wave logo
    footerLogoUrl: string; // If empty, uses logoUrl or SVG logo
    browserTitle: string;
    shortDescription: string;
    primaryBrandColor: string;
    secondaryBrandColor: string;
    buttonTextColor: string;
    buttonHoverColor: string;
    accentTextColor: string;
    telephone: string;
    whatsappNumber: string;
    emailAddress: string;
    address: string;
    copyrightText: string;
    facebookUrl: string;
    instagramUrl: string;
    linkedinUrl: string;
  };
  hero: {
    backgroundImage: string;
    headlinePrefix: string;
    headlineHighlight: string;
    headlineSuffix: string;
    supportingText: string;
    ctaLabel: string;
    navCtaLabel: string;
  };
  about: {
    heading: string;
    leadParagraph: {
      part1: string;
      inlineImage1: string;
      part2: string;
      inlineImage2: string;
      part3: string;
      inlineImage3: string;
      part4: string;
      inlineImage4: string;
      part5: string;
      inlineImage5: string;
      part6: string;
      part7: string;
      part8: string;
      part9: string;
      part10: string;
      part11: string;
    };
    ctaLabel: string;
  };
  services: {
    heading: string;
    description: string;
    thumbnailImage: string;
    guaranteeBanner: string;
    items: ServiceItem[];
  };
  gallery: {
    eyebrow: string;
    heading: string;
    headingHighlight: string;
    description: string;
    items: GalleryItem[];
  };
  editorialStory: {
    heading: string;
    highlightSubtitle: string;
    mainImage: string;
    overlappingImage: string;
    paragraph1: string;
    paragraph2: string;
    ctaLabel: string;
  };
  processSection?: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    ctaLabel: string;
    steps: {
      id: string;
      stepNumber: number;
      image: string;
      iconType: 'calendar' | 'cleaning' | 'ladder';
    }[];
  };
  testimonials: {
    heading: string;
    headingHighlight: string;
    headingSuffix: string;
    infoCardText: string;
    items: TestimonialItem[];
  };
  ctaBanner: {
    topBadge: string;
    heading: string;
    buttonLabel: string;
    buttonAction: string; // e.g. "quote", "email", "phone"
    backgroundImage: string;
    stampBadgeMonogram: string;
    stampBadgeText: string;
  };
  footer: {
    taglineLine1?: string;
    taglineLine2?: string;
    servicesTagline?: string;
    phone?: string;
    email?: string;
    ctaButtonLabel?: string;
    newsletterHeading: string;
    newsletterHighlight: string;
    newsletterDescription: string;
  };
  contactSection?: {
    eyebrow: string;
    headingPrefix: string;
    headingHighlight: string;
    description: string;
    phone: string;
    email: string;
    location: string;
    hoursWeekday: string;
    hoursWeekend: string;
    hoursSunday: string;
    formHeading: string;
    formSubheading: string;
    submitButtonLabel: string;
  };
}
