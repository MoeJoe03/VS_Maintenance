import fs from 'fs';
import path from 'path';
import { CMSData, LeadSubmission, NewsletterSubscriber } from './cms-types';
import { defaultCMSData } from './cms-default-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-data.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getCMSData(): CMSData {
  try {
    ensureDataDir();
    if (!fs.existsSync(CMS_FILE)) {
      fs.writeFileSync(CMS_FILE, JSON.stringify(defaultCMSData, null, 2), 'utf-8');
      return defaultCMSData;
    }
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Deep merge with defaults to avoid missing keys if schema evolves
    return {
      ...defaultCMSData,
      ...parsed,
      branding: { ...defaultCMSData.branding, ...(parsed.branding || {}) },
      hero: { ...defaultCMSData.hero, ...(parsed.hero || {}) },
      about: {
        ...defaultCMSData.about,
        ...(parsed.about || {}),
        leadParagraph: {
          ...defaultCMSData.about.leadParagraph,
          ...(parsed.about?.leadParagraph || {}),
        },
      },
      services: {
        ...defaultCMSData.services,
        ...(parsed.services || {}),
        items: parsed.services?.items || defaultCMSData.services.items,
      },
      gallery: {
        ...defaultCMSData.gallery,
        ...(parsed.gallery || {}),
        items: parsed.gallery?.items || defaultCMSData.gallery.items,
      },
      editorialStory: {
        ...defaultCMSData.editorialStory,
        ...(parsed.editorialStory || {}),
      },
      processSection: {
        ...defaultCMSData.processSection!,
        ...(parsed.processSection || {}),
        steps: parsed.processSection?.steps || defaultCMSData.processSection!.steps,
      },
      testimonials: {
        ...defaultCMSData.testimonials,
        ...(parsed.testimonials || {}),
        items: parsed.testimonials?.items || defaultCMSData.testimonials.items,
      },
      ctaBanner: {
        ...defaultCMSData.ctaBanner,
        ...(parsed.ctaBanner || {}),
      },
      footer: {
        ...defaultCMSData.footer,
        ...(parsed.footer || {}),
      },
    };
  } catch (error) {
    console.error('Error reading CMS data, falling back to defaults:', error);
    return defaultCMSData;
  }
}

export function saveCMSData(data: CMSData): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving CMS data:', error);
    return false;
  }
}

export function resetCMSData(): CMSData {
  try {
    ensureDataDir();
    fs.writeFileSync(CMS_FILE, JSON.stringify(defaultCMSData, null, 2), 'utf-8');
    return defaultCMSData;
  } catch (error) {
    console.error('Error resetting CMS data:', error);
    return defaultCMSData;
  }
}

export function getLeads(): LeadSubmission[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addLead(lead: Omit<LeadSubmission, 'id' | 'createdAt'>): LeadSubmission {
  ensureDataDir();
  const leads = getLeads();
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return newLead;
}

export function getSubscribers(): NewsletterSubscriber[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(NEWSLETTER_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(NEWSLETTER_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addSubscriber(email: string): NewsletterSubscriber {
  ensureDataDir();
  const subscribers = getSubscribers();
  const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newSub: NewsletterSubscriber = {
    id: `sub_${Date.now()}`,
    email,
    subscribedAt: new Date().toISOString(),
  };
  subscribers.unshift(newSub);
  fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
  return newSub;
}
