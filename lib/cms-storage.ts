import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { CMSData, LeadSubmission, NewsletterSubscriber } from './cms-types';
import { defaultCMSData } from './cms-default-data';
import { createClient } from '@supabase/supabase-js';
import bundledCMSData from '../data/cms-data.json';

export const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'vs-maintenance-services';

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function supabaseClient(privileged = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = privileged ? process.env.SUPABASE_SECRET_KEY : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-data.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getLocalCMSData(): CMSData {
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
    console.error('Error reading CMS data, falling back to bundled content:', error);
    return bundledCMSData as CMSData;
  }
}

function saveLocalCMSData(data: CMSData): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving CMS data:', error);
    return false;
  }
}

export async function getCMSData(strict = false): Promise<CMSData> {
  const supabase = supabaseClient();
  if (!supabase) return getLocalCMSData();
  let response;
  try {
    response = await supabase.from('site_settings').select('content').eq('site_id', SITE_ID).abortSignal(AbortSignal.timeout(5000)).maybeSingle();
  } catch (error) {
    if (strict) throw error;
    console.error('Supabase CMS read failed:', error);
    return getLocalCMSData();
  }
  const { data, error } = response;
  if (error) {
    if (strict) throw new Error(`Supabase CMS read failed: ${error.message}`);
    console.error('Supabase CMS read failed:', error.message);
    return getLocalCMSData();
  }
  if (!data?.content || Object.keys(data.content).length === 0) {
    if (strict && isSupabaseConfigured()) throw new Error('The Supabase CMS has not been imported yet.');
    return getLocalCMSData();
  }
  const content = data.content as CMSData;
  return {
    ...getLocalCMSData(), ...content,
    branding: { ...defaultCMSData.branding, ...content.branding },
    services: { ...defaultCMSData.services, ...content.services, items: content.services?.items ?? [] },
    gallery: { ...defaultCMSData.gallery, ...content.gallery, items: content.gallery?.items ?? [] },
  };
}

export async function saveCMSData(data: CMSData): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = supabaseClient(true);
    if (!supabase) throw new Error('SUPABASE_SECRET_KEY is required for CMS writes.');
    const { error } = await supabase.from('site_settings').upsert({
      site_id: SITE_ID, content: data, updated_at: new Date().toISOString(),
    }, { onConflict: 'site_id' });
    if (error) throw new Error(`Supabase save failed: ${error.message}`);
    return true;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required for production CMS writes.');
  return saveLocalCMSData(data);
}

export async function resetCMSData(): Promise<CMSData> {
  if (!await saveCMSData(defaultCMSData)) throw new Error('Could not reset content.');
  return defaultCMSData;
}

export async function getLeads(): Promise<LeadSubmission[]> {
  const supabase = supabaseClient(true);
  if (supabase) {
    const { data, error } = await supabase.from('site_leads').select('id,payload,created_at').eq('site_id', SITE_ID).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({ ...row.payload, id: row.id, createdAt: row.created_at }));
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required to load enquiries.');
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

export async function addLead(lead: Omit<LeadSubmission, 'id' | 'createdAt'>): Promise<LeadSubmission> {
  const supabase = supabaseClient(true) ?? supabaseClient();
  if (supabase) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('site_leads').insert({ id, site_id: SITE_ID, payload: lead, created_at: createdAt });
    if (error) throw new Error(error.message);
    return { ...lead, id, createdAt };
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required to save enquiries.');
  ensureDataDir();
  const leads = await getLeads();
  const newLead: LeadSubmission = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return newLead;
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = supabaseClient(true);
  if (supabase) {
    const { data, error } = await supabase.from('site_subscribers').select('id,email,created_at').eq('site_id', SITE_ID).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({ id: row.id, email: row.email, subscribedAt: row.created_at }));
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required to load subscribers.');
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

export async function addSubscriber(email: string): Promise<NewsletterSubscriber> {
  const supabase = supabaseClient(true) ?? supabaseClient();
  if (supabase) {
    const id = randomUUID();
    const subscribedAt = new Date().toISOString();
    const { error } = await supabase.from('site_subscribers').insert({ id, site_id: SITE_ID, email, created_at: subscribedAt });
    if (error && error.code !== '23505') throw new Error(error.message);
    return { id, email, subscribedAt };
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required to save subscribers.');
  ensureDataDir();
  const subscribers = await getSubscribers();
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
