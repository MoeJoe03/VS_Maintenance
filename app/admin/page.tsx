'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Image as ImageIcon,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RefreshCw,
  Phone,
  MessageSquare,
  Mail,
  Loader2,
  Check,
  Eye,
  Sliders,
  LayoutGrid,
} from 'lucide-react';
import { CMSData, ServiceItem, TestimonialItem, LeadSubmission, GalleryItem } from '@/lib/cms-types';
import { GALLERY_CATEGORIES } from '@/lib/gallery-categories';
import { defaultCMSData } from '@/lib/cms-default-data';

const tradingHourFields = [
  { key: 'hoursWeekday', label: 'Monday–Friday', defaultValue: 'Mon – Fri: 8:00am – 5:00pm' },
  { key: 'hoursWeekend', label: 'Saturday', defaultValue: 'Saturday: 8:00am – 1:00pm' },
  { key: 'hoursSunday', label: 'Sunday', defaultValue: 'Sunday: Closed' },
] as const;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'branding' | 'images' | 'gallery' | 'content' | 'inquiries' | 'settings'
  >('overview');

  const [savedData, setSavedData] = useState<CMSData>(defaultCMSData);
  const [formData, setFormData] = useState<CMSData>(defaultCMSData);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [currentUploadTarget, setCurrentUploadTarget] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial CMS data and leads from server
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [cmsRes, leadsRes] = await Promise.all([
          fetch('/api/cms'),
          fetch('/api/leads'),
        ]);

        const cmsJson = await cmsRes.json();
        const leadsJson = await leadsRes.json();

        if (cmsJson.success && cmsJson.data) {
          setSavedData(cmsJson.data);
          setFormData(cmsJson.data);
        }
        if (leadsJson.success && leadsJson.leads) {
          setLeads(leadsJson.leads);
        }
      } catch (err) {
        console.error('Failed to load CMS data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const hasUnsavedChanges = !isLoading && JSON.stringify(formData) !== JSON.stringify(savedData);

  // Handle saving to server API
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveToast(null);

      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to save changes');
      }

      setSavedData(formData);
      setSaveToast({
        type: 'success',
        message: 'All changes saved and published to the live website!',
      });

      setTimeout(() => {
        setSaveToast(null);
      }, 4000);
    } catch (err: unknown) {
      setSaveToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving changes',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel edits and revert to saved data
  const handleCancelEdits = () => {
    setFormData(JSON.parse(JSON.stringify(savedData)));
    setSaveToast({
      type: 'success',
      message: 'Unsaved edits discarded. Restored last saved version.',
    });
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Reset entire website to Stitch factory defaults
  const handleResetToDefaults = async () => {
    if (
      !confirm(
        'Are you sure you want to restore the original Google Stitch design presets? All custom edits will be reset.'
      )
    ) {
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch('/api/cms', { method: 'DELETE' });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setSavedData(resJson.data);
        setFormData(resJson.data);
        setSaveToast({
          type: 'success',
          message: 'Website restored to original Google Stitch presets!',
        });
        setTimeout(() => setSaveToast(null), 4000);
      }
    } catch {
      setSaveToast({ type: 'error', message: 'Failed to reset presets' });
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger file upload for any image field
  const triggerImageUpload = (targetFieldPath: string) => {
    setCurrentUploadTarget(targetFieldPath);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Process file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadTarget) return;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, WebP, AVIF, or SVG).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    try {
      setUploadingField(currentUploadTarget);
      const dataForm = new FormData();
      dataForm.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: dataForm,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      applyImageValue(currentUploadTarget, data.url);
      setSaveToast({
        type: 'success',
        message: 'Image uploaded! Click "Save Changes" to publish.',
      });
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploadingField(null);
      setCurrentUploadTarget(null);
    }
  };

  // Helper to update deeply nested image properties
  const applyImageValue = (pathStr: string, newUrl: string) => {
    const updated = JSON.parse(JSON.stringify(formData)) as CMSData;

    if (pathStr === 'branding.logoUrl') updated.branding.logoUrl = newUrl;
    else if (pathStr === 'branding.footerLogoUrl') updated.branding.footerLogoUrl = newUrl;
    else if (pathStr === 'hero.backgroundImage') updated.hero.backgroundImage = newUrl;
    else if (pathStr === 'about.leadParagraph.inlineImage1')
      updated.about.leadParagraph.inlineImage1 = newUrl;
    else if (pathStr === 'about.leadParagraph.inlineImage2')
      updated.about.leadParagraph.inlineImage2 = newUrl;
    else if (pathStr === 'about.leadParagraph.inlineImage3')
      updated.about.leadParagraph.inlineImage3 = newUrl;
    else if (pathStr === 'about.leadParagraph.inlineImage4')
      updated.about.leadParagraph.inlineImage4 = newUrl;
    else if (pathStr === 'about.leadParagraph.inlineImage5')
      updated.about.leadParagraph.inlineImage5 = newUrl;
    else if (pathStr === 'services.thumbnailImage') updated.services.thumbnailImage = newUrl;
    else if (pathStr.startsWith('services.items.')) {
      const idx = parseInt(pathStr.split('.')[2], 10);
      if (updated.services.items[idx]) {
        const field = pathStr.split('.')[3];
        if (field === 'afterImage') updated.services.items[idx].afterImage = newUrl;
        else updated.services.items[idx].image = newUrl;
      }
    } else if (pathStr.startsWith('processSection.steps.')) {
      const idx = parseInt(pathStr.split('.')[2], 10);
      if (!updated.processSection) updated.processSection = structuredClone(defaultCMSData.processSection!);
      if (updated.processSection.steps[idx]) updated.processSection.steps[idx].image = newUrl;
    } else if (pathStr === 'editorialStory.mainImage')
      updated.editorialStory.mainImage = newUrl;
    else if (pathStr === 'editorialStory.overlappingImage')
      updated.editorialStory.overlappingImage = newUrl;
    else if (pathStr.startsWith('testimonials.items.')) {
      const parts = pathStr.split('.');
      const idx = parseInt(parts[2], 10);
      const sub = parts[3];
      if (updated.testimonials.items[idx]) {
        if (sub === 'authorAvatar') updated.testimonials.items[idx].authorAvatar = newUrl;
        else updated.testimonials.items[idx].mainImage = newUrl;
      }
    } else if (pathStr.startsWith('gallery.items.')) {
      const idx = parseInt(pathStr.split('.')[2], 10);
      if (updated.gallery?.items?.[idx]) {
        updated.gallery.items[idx].imageUrl = newUrl;
      }
    } else if (pathStr === 'ctaBanner.backgroundImage')
      updated.ctaBanner.backgroundImage = newUrl;

    setFormData(updated);
  };

  // Reset a specific image back to its original default
  const restoreDefaultImage = (pathStr: string) => {
    let defUrl = '';
    if (pathStr === 'branding.logoUrl') defUrl = defaultCMSData.branding.logoUrl;
    else if (pathStr === 'branding.footerLogoUrl') defUrl = defaultCMSData.branding.footerLogoUrl;
    else if (pathStr === 'hero.backgroundImage') defUrl = defaultCMSData.hero.backgroundImage;
    else if (pathStr === 'about.leadParagraph.inlineImage1')
      defUrl = defaultCMSData.about.leadParagraph.inlineImage1;
    else if (pathStr === 'about.leadParagraph.inlineImage2')
      defUrl = defaultCMSData.about.leadParagraph.inlineImage2;
    else if (pathStr === 'about.leadParagraph.inlineImage3')
      defUrl = defaultCMSData.about.leadParagraph.inlineImage3;
    else if (pathStr === 'about.leadParagraph.inlineImage4')
      defUrl = defaultCMSData.about.leadParagraph.inlineImage4;
    else if (pathStr === 'about.leadParagraph.inlineImage5')
      defUrl = defaultCMSData.about.leadParagraph.inlineImage5;
    else if (pathStr === 'services.thumbnailImage')
      defUrl = defaultCMSData.services.thumbnailImage;
    else if (pathStr.startsWith('services.items.')) {
      const idx = parseInt(pathStr.split('.')[2], 10);
      defUrl = defaultCMSData.services.items[idx]?.image || '';
    } else if (pathStr.startsWith('gallery.items.')) {
      const idx = parseInt(pathStr.split('.')[2], 10);
      defUrl = defaultCMSData.gallery?.items?.[idx]?.imageUrl || '';
    } else if (pathStr === 'editorialStory.mainImage')
      defUrl = defaultCMSData.editorialStory.mainImage;
    else if (pathStr === 'editorialStory.overlappingImage')
      defUrl = defaultCMSData.editorialStory.overlappingImage;
    else if (pathStr.startsWith('testimonials.items.')) {
      const parts = pathStr.split('.');
      const idx = parseInt(parts[2], 10);
      const sub = parts[3];
      defUrl =
        sub === 'authorAvatar'
          ? defaultCMSData.testimonials.items[idx]?.authorAvatar || ''
          : defaultCMSData.testimonials.items[idx]?.mainImage || '';
    } else if (pathStr === 'ctaBanner.backgroundImage')
      defUrl = defaultCMSData.ctaBanner.backgroundImage;

    applyImageValue(pathStr, defUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <Loader2 className="w-10 h-10 text-[#079BC5] animate-spin mb-3" />
        <h2 className="text-xl font-bold">Loading CMS Dashboard...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to server storage layer</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        className="hidden"
      />

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#079BC5] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                {formData.branding.companyName}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-[#079BC5] border border-cyan-200 uppercase tracking-wider">
                CMS Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Built-in Website Management Dashboard (No Auth Mode)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasUnsavedChanges && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Unsaved changes
            </span>
          )}

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleCancelEdits}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white transition-all shadow-sm ${
              hasUnsavedChanges
                ? 'bg-[#079BC5] hover:bg-[#0682A6] ring-2 ring-[#079BC5]/30'
                : 'bg-[#10283F] hover:bg-slate-800'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Preview live website in a new window"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Website</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-fade-in ${
            saveToast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {saveToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold">{saveToast.message}</span>
        </div>
      )}

      {/* Main Layout: Sidebar Navigation + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'overview'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'branding'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Branding</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'images'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Images & Photos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'gallery'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4" />
                <span>Gallery & Our Work</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                {formData.gallery?.items?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'content'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Website Content</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'inquiries'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Quote Inquiries</span>
              </div>
              {leads.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#079BC5] text-white text-[10px]">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              type="button"
              hidden style={{ display: 'none' }}
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-left ${
                activeTab === 'settings'
                  ? 'bg-[#EBFBFA] text-[#079BC5]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Storage & Backup</span>
            </button>
          </div>

          {/* Quick Help Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 hidden md:block">
            <h4 className="font-bold text-slate-800 mb-1">Permanent Storage Active</h4>
            <p className="text-[11px] leading-relaxed mb-3">
              Edits persist on the server filesystem (<code className="bg-white px-1 py-0.5 rounded text-[10px]">data/cms-data.json</code>) and synchronize across all devices.
            </p>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Restore Factory Presets
            </button>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 min-h-[600px]">
          {/* TAB 1: OVERVIEW */}
          
{activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Dashboard Overview
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your swimming pool website branding, photos, services, and incoming customer quote leads.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-[#079BC5]">Company</span>
                  <span className="text-lg font-extrabold text-slate-900 mt-2 truncate">
                    {formData.branding.companyName}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">Live in Header & Footer</span>
                </div>

                <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-teal-700">Gallery Projects</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-2">
                    {formData.gallery?.items?.length || 0}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">Photos in Our Work</span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-sky-700">Services Active</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-2">
                    {formData.services.items.length}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">In interactive carousel</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-emerald-700">Client Reviews</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-2">
                    {formData.testimonials.items.length}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">Published testimonials</span>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-indigo-700">Quote Inquiries</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-2">
                    {leads.length}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">Captured leads</span>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Customization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('branding')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#079BC5] hover:bg-cyan-50/30 text-left transition-colors group"
                  >
                    <Building2 className="w-5 h-5 text-[#079BC5] mb-2" />
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#079BC5]">
                      Update Logo & Company
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Change logo image and contact numbers.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#079BC5] hover:bg-cyan-50/30 text-left transition-colors group"
                  >
                    <LayoutGrid className="w-5 h-5 text-[#079BC5] mb-2" />
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#079BC5]">
                      Manage Gallery & Work
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Add, reorder, or edit project photos.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('images')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#079BC5] hover:bg-cyan-50/30 text-left transition-colors group"
                  >
                    <ImageIcon className="w-5 h-5 text-[#079BC5] mb-2" />
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#079BC5]">
                      Replace Website Images
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Swap hero, service, or story photography.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#079BC5] hover:bg-cyan-50/30 text-left transition-colors group"
                  >
                    <FileText className="w-5 h-5 text-[#079BC5] mb-2" />
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#079BC5]">
                      Edit Headlines & Copy
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Modify hero banner text and services.
                    </p>
                  </button>
                </div>
              </div>

              {/* Recent Leads Preview */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800">Recent Customer Inquiries</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs font-bold text-[#079BC5] hover:underline"
                  >
                    View all ({leads.length})
                  </button>
                </div>

                {leads.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No quote requests yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Quotes submitted via &quot;Request a Quote&quot; or &quot;Start A Pool&quot; will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3">Client</th>
                          <th className="p-3">Service</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Message</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leads.slice(0, 3).map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{lead.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-[#079BC5] text-[10px] font-semibold">
                                {lead.service}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">
                              <div>{lead.email}</div>
                              <div className="text-[11px] text-slate-400">{lead.phone}</div>
                            </td>
                            <td className="p-3 max-w-xs truncate text-slate-600">
                              {lead.message}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px]">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Company Branding & Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Updates to company name and logo immediately reflect across navigation, footer, and page title.
                </p>
              </div>

              {/* Logo Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                {/* Main Logo */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Company Header Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-xs">
                      {formData.branding.logoUrl ? (
                        <Image
                          src={formData.branding.logoUrl}
                          alt="Company Logo Preview"
                          fill
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#079BC5]/20 flex items-center justify-center p-2 text-[#079BC5]">
                          <svg
                            className="w-full h-full"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M2 12c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
                            <path d="M2 17c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => triggerImageUpload('branding.logoUrl')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#079BC5] hover:bg-[#0682A6] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Logo
                      </button>
                      {formData.branding.logoUrl && (
                        <button
                          type="button"
                          onClick={() => restoreDefaultImage('branding.logoUrl')}
                          className="text-[11px] text-slate-500 hover:text-red-600 transition-colors text-left"
                        >
                          Restore Default Wave
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400">
                        Supports PNG, JPG, WebP, AVIF, SVG (Max 5MB)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Logo */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Footer Logo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-xs">
                      {formData.branding.footerLogoUrl || formData.branding.logoUrl ? (
                        <Image
                          src={formData.branding.footerLogoUrl || formData.branding.logoUrl}
                          alt="Footer Logo Preview"
                          fill
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#079BC5]/20 flex items-center justify-center p-2 text-[#079BC5]">
                          <svg
                            className="w-full h-full"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M2 12c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
                            <path d="M2 17c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => triggerImageUpload('branding.footerLogoUrl')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Separate Footer Logo
                      </button>
                      {formData.branding.footerLogoUrl && (
                        <button
                          type="button"
                          onClick={() => restoreDefaultImage('branding.footerLogoUrl')}
                          className="text-[11px] text-slate-500 hover:text-red-600 transition-colors text-left"
                        >
                          Use Main Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.branding.companyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, companyName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.branding.companyTagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, companyTagline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Browser Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.branding.browserTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, browserTitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.branding.telephone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, telephone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number (International format e.g. +27679330920)
                  </label>
                  <input
                    type="text"
                    value={formData.branding.whatsappNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, whatsappNumber: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.branding.emailAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, emailAddress: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.branding.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, shortDescription: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Brand Color (Button Background)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.branding.primaryBrandColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, primaryBrandColor: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryBrandColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, primaryBrandColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-mono"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Also sets the background color for website buttons.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secondary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.branding.secondaryBrandColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, secondaryBrandColor: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.branding.secondaryBrandColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branding: { ...formData.branding, secondaryBrandColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-xs font-bold text-slate-800 mb-1">
                    Hero Company Name Word Colors
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Choose a separate color for each word in the company name shown in the hero navigation.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {formData.branding.companyName
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((word, index) => (
                        <label
                          key={`${word}-${index}`}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                        >
                          <input
                            type="color"
                            value={
                              formData.branding.companyNameWordColors?.[index] ||
                              (index === 0 ? '#ffffff' : '#B8F4F5')
                            }
                            onChange={(e) => {
                              const colors = [...(formData.branding.companyNameWordColors || [])];
                              while (
                                colors.length <
                                formData.branding.companyName.trim().split(/\s+/).filter(Boolean).length
                              ) {
                                colors.push(colors.length === 0 ? '#ffffff' : '#B8F4F5');
                              }
                              colors[index] = e.target.value;
                              setFormData({
                                ...formData,
                                branding: { ...formData.branding, companyNameWordColors: colors },
                              });
                            }}
                            className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          {word}
                        </label>
                      ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        branding: {
                          ...formData.branding,
                          companyNameWordColors: formData.branding.companyName
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean)
                            .map((_, index) => (index === 0 ? '#ffffff' : '#B8F4F5')),
                        },
                      })
                    }
                    className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-900"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset word colors
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button Text Color
                  </label>
                  <input
                    type="color"
                    value={formData.branding.buttonTextColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, buttonTextColor: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button Hover Color
                  </label>
                  <input
                    type="color"
                    value={formData.branding.buttonHoverColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, buttonHoverColor: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blue Accent Text Color
                  </label>
                  <input
                    type="color"
                    value={formData.branding.accentTextColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, accentTextColor: e.target.value },
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        branding: {
                          ...formData.branding,
                          primaryBrandColor: defaultCMSData.branding.primaryBrandColor,
                          buttonTextColor: defaultCMSData.branding.buttonTextColor,
                          buttonHoverColor: defaultCMSData.branding.buttonHoverColor,
                          accentTextColor: defaultCMSData.branding.accentTextColor,
                        },
                      })
                    }
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Button and Accent Colors to Default
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Website Image Management
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Replace photographs across each section of the site. Image dimensions and aspect ratios are preserved.
                </p>
              </div>

              {/* 1. Hero Image */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Hero Section Background</h3>
                    <p className="text-[11px] text-slate-500">
                      Luxury modern tropical villa with crystal blue infinity swimming pool
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerImageUpload('hero.backgroundImage')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#079BC5] hover:bg-[#0682A6]"
                    >
                      <Upload className="w-3 h-3" /> Upload / Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => restoreDefaultImage('hero.backgroundImage')}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      title="Restore default Stitch image"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                  <Image
                    src={formData.hero.backgroundImage}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* 2. About Inline Photos */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    About Section Inline Photo Capsules (5 Images)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    The five oval photographic pills embedded directly into the editorial paragraph
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const key = `inlineImage${num}` as keyof typeof formData.about.leadParagraph;
                    const pathStr = `about.leadParagraph.${key}`;
                    const currentImg = formData.about.leadParagraph[key] as string;

                    return (
                      <div
                        key={num}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-2 text-center"
                      >
                        <span className="text-[10px] font-bold text-slate-500">Pill #{num}</span>
                        <div className="relative w-16 h-8 rounded-full overflow-hidden border border-slate-300 shadow-xs">
                          <Image
                            src={currentImg}
                            alt={`About pill ${num}`}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerImageUpload(pathStr)}
                          className="text-[10px] font-bold text-[#079BC5] hover:underline"
                        >
                          Replace
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Service Cards Images */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Services Section Images</h3>
                  <p className="text-[11px] text-slate-500">
                    The 4 vertical photo cards plus navigation card thumbnail
                  </p>
                </div>

                {/* Nav Thumbnail */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                      <Image
                        src={formData.services.thumbnailImage}
                        alt="Service Nav Thumb"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Navigation Card Thumbnail
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Displayed inside &quot;All our Services&quot; card
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerImageUpload('services.thumbnailImage')}
                    className="text-xs font-bold text-[#079BC5] hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* 4 Service Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {formData.services.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          {item.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => restoreDefaultImage(`services.items.${idx}.image`)}
                          title="Restore default"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerImageUpload(`services.items.${idx}.image`)}
                        className="w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Upload / Replace
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Final CTA Background */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Final CTA Banner Background</h3>
                    <p className="text-[11px] text-slate-500">
                      Sunken lounge area inside an azure luxury pool
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerImageUpload('ctaBanner.backgroundImage')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#079BC5] hover:bg-[#0682A6]"
                  >
                    <Upload className="w-3 h-3" /> Upload / Replace
                  </button>
                </div>
                <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200">
                  <Image
                    src={formData.ctaBanner.backgroundImage}
                    alt="CTA banner background preview"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: GALLERY & OUR WORK */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Gallery & Our Work Showcase
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage project photography, titles, categories, locations, and layout ordering for the &quot;Our Work in Action&quot; section.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  
                  <a
                    href="/#gallery"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview Section
                  </a>
                </div>
              </div>

              {/* 1. Gallery Section Headings */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                    1. Section Headings & Description
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        gallery: {
                          ...(formData.gallery || defaultCMSData.gallery),
                          eyebrow: defaultCMSData.gallery.eyebrow,
                          heading: defaultCMSData.gallery.heading,
                          headingHighlight: defaultCMSData.gallery.headingHighlight,
                          description: defaultCMSData.gallery.description,
                        },
                      });
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Restore Headings
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={formData.gallery?.eyebrow ?? 'GALLERY'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gallery: {
                            ...(formData.gallery || defaultCMSData.gallery),
                            eyebrow: e.target.value,
                          },
                        })
                      }
                      placeholder="GALLERY"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Heading Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.gallery?.heading ?? 'Our Work in'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gallery: {
                            ...(formData.gallery || defaultCMSData.gallery),
                            heading: e.target.value,
                          },
                        })
                      }
                      placeholder="Our Work in"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Heading Highlight
                    </label>
                    <input
                      type="text"
                      value={formData.gallery?.headingHighlight ?? 'Action'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gallery: {
                            ...(formData.gallery || defaultCMSData.gallery),
                            headingHighlight: e.target.value,
                          },
                        })
                      }
                      placeholder="Action"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Section Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.gallery?.description ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gallery: {
                            ...(formData.gallery || defaultCMSData.gallery),
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Explore a selection of our recent pool projects, repairs and transformations..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Projects Showcase Manager */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Projects Showcase ({(formData.gallery?.items || []).length} projects)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click &quot;Upload Photo&quot; or paste an image URL. Items are filterable by category and slide page.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['All', ...GALLERY_CATEGORIES].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGalleryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          galleryFilter === cat
                            ? 'bg-[#079BC5] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projects List */}
                {(!formData.gallery?.items || formData.gallery.items.length === 0) ? (
                  <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No gallery projects found</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Click &quot;Add Project&quot; below to add your first swimming pool showcase.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.gallery.items
                      .map((item, originalIndex) => ({ item, originalIndex }))
                      .filter(
                        ({ item }) =>
                          galleryFilter === 'All' || item.category === galleryFilter
                      )
                      .map(({ item, originalIndex }) => (
                        <div
                          key={item.id || originalIndex}
                          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col lg:flex-row gap-5"
                        >
                          {/* Image Column */}
                          <div className="lg:w-64 flex flex-col gap-2 shrink-0">
                            <div className="relative h-44 lg:h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                              {item.imageUrl ? <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              /> : <div className="flex h-full items-center justify-center text-xs text-slate-500">No image uploaded</div>}
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#079BC5] shadow-xs">
                                  #{originalIndex + 1}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerImageUpload(`gallery.items.${originalIndex}`)
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5"
                                >
                                  <Upload className="w-3.5 h-3.5" /> Replace Photo
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  triggerImageUpload(`gallery.items.${originalIndex}`)
                                }
                                className="flex-1 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#079BC5] text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                              >
                                <Upload className="w-3 h-3" /> Upload File
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  restoreDefaultImage(`gallery.items.${originalIndex}`)
                                }
                                title="Restore original preset photo"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Image URL
                              </label>
                              <input
                                type="text"
                                value={item.imageUrl}
                                onChange={(e) => {
                                  const items = [...(formData.gallery?.items || [])];
                                  items[originalIndex] = {
                                    ...items[originalIndex],
                                    imageUrl: e.target.value,
                                  };
                                  setFormData({
                                    ...formData,
                                    gallery: {
                                      ...(formData.gallery || defaultCMSData.gallery),
                                      items,
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono truncate focus:outline-none focus:bg-white focus:border-[#079BC5]"
                              />
                            </div>
                          </div>

                          {/* Details Column */}
                          <div className="flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Project Title
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                      const items = [...(formData.gallery?.items || [])];
                                      items[originalIndex] = {
                                        ...items[originalIndex],
                                        title: e.target.value,
                                      };
                                      setFormData({
                                        ...formData,
                                        gallery: {
                                          ...(formData.gallery || defaultCMSData.gallery),
                                          items,
                                        },
                                      });
                                    }}
                                    placeholder="Project title..."
                                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Category
                                  </label>
                                  <select
                                    value={item.category}
                                    onChange={(e) => {
                                      const items = [...(formData.gallery?.items || [])];
                                      items[originalIndex] = {
                                        ...items[originalIndex],
                                        category: e.target.value as GalleryItem['category'],
                                      };
                                      setFormData({
                                        ...formData,
                                        gallery: {
                                          ...(formData.gallery || defaultCMSData.gallery),
                                          items,
                                        },
                                      });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                                  >
                                    {GALLERY_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Location / Subtitle
                                  </label>
                                  <input
                                    type="text"
                                    value={item.location ?? ''}
                                    onChange={(e) => {
                                      const items = [...(formData.gallery?.items || [])];
                                      items[originalIndex] = {
                                        ...items[originalIndex],
                                        location: e.target.value,
                                      };
                                      setFormData({
                                        ...formData,
                                        gallery: {
                                          ...(formData.gallery || defaultCMSData.gallery),
                                          items,
                                        },
                                      });
                                    }}
                                    placeholder="e.g. Cascais · Private Residence"
                                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Gallery Page Card Style
                                  </label>
                                  <select
                                    value={item.layoutType ?? 'tall'}
                                    onChange={(e) => {
                                      const items = [...(formData.gallery?.items || [])];
                                      items[originalIndex] = {
                                        ...items[originalIndex],
                                        layoutType: e.target.value as GalleryItem['layoutType'],
                                      };
                                      setFormData({
                                        ...formData,
                                        gallery: {
                                          ...(formData.gallery || defaultCMSData.gallery),
                                          items,
                                        },
                                      });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                                  >
                                    <option value="tall">Tall / Portrait</option>
                                    <option value="stacked-top">Wide / Landscape</option>
                                    <option value="stacked-bottom">Square</option>
                                  </select>
                                  <p className="mt-1 text-[10px] text-slate-500">Changes the image shape on the Gallery page only.</p>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Slide Group Page
                                  </label>
                                  <select
                                    value={item.slideGroup ?? 1}
                                    onChange={(e) => {
                                      const items = [...(formData.gallery?.items || [])];
                                      items[originalIndex] = {
                                        ...items[originalIndex],
                                        slideGroup: parseInt(e.target.value, 10),
                                      };
                                      setFormData({
                                        ...formData,
                                        gallery: {
                                          ...(formData.gallery || defaultCMSData.gallery),
                                          items,
                                        },
                                      });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#079BC5]/30 focus:border-[#079BC5]"
                                  >
                                    <option value={1}>Slide 1 (Initial Showcase)</option>
                                    <option value={2}>Slide 2</option>
                                    <option value={3}>Slide 3</option>
                                    <option value={4}>Slide 4</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Card Actions (Reorder & Delete) */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span>Reorder:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (originalIndex === 0) return;
                                    const items = [...(formData.gallery?.items || [])];
                                    const temp = items[originalIndex - 1];
                                    items[originalIndex - 1] = items[originalIndex];
                                    items[originalIndex] = temp;
                                    setFormData({
                                      ...formData,
                                      gallery: {
                                        ...(formData.gallery || defaultCMSData.gallery),
                                        items,
                                      },
                                    });
                                  }}
                                  disabled={originalIndex === 0}
                                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                  title="Move Up"
                                >
                                  <MoveUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const items = [...(formData.gallery?.items || [])];
                                    if (originalIndex === items.length - 1) return;
                                    const temp = items[originalIndex + 1];
                                    items[originalIndex + 1] = items[originalIndex];
                                    items[originalIndex] = temp;
                                    setFormData({
                                      ...formData,
                                      gallery: {
                                        ...(formData.gallery || defaultCMSData.gallery),
                                        items,
                                      },
                                    });
                                  }}
                                  disabled={
                                    originalIndex === (formData.gallery?.items?.length || 0) - 1
                                  }
                                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                  title="Move Down"
                                >
                                  <MoveDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    !confirm(
                                      `Are you sure you want to remove "${item.title}" from the gallery?`
                                    )
                                  )
                                    return;
                                  const items = (formData.gallery?.items || []).filter(
                                    (_, i) => i !== originalIndex
                                  );
                                  setFormData({
                                    ...formData,
                                    gallery: {
                                      ...(formData.gallery || defaultCMSData.gallery),
                                      items,
                                    },
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Project
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end border-t border-slate-200 pt-5"><button
                    type="button"
                    onClick={() => {
                      const currentGallery = formData.gallery || defaultCMSData.gallery;
                      const newProject: GalleryItem = {
                        id: `gallery-${Date.now()}`,
                        title: 'Custom Architectural Pool Design',
                        category: 'New Builds',
                        imageUrl: '',
                        location: 'Cascais · Private Estate',
                        layoutType: 'tall',
                        slideGroup: 1,
                        description: 'Custom concrete and infinity pool installation with premium coping stone.',
                      };
                      setFormData({
                        ...formData,
                        gallery: {
                          ...currentGallery,
                          items: [...(currentGallery.items || []), newProject],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#079BC5] hover:bg-[#0682A6] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button></div>

            </div>
          )}

          {/* TAB 4: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Website Content Management
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Edit headlines, editorial descriptions, services, testimonials, and banners.
                </p>
              </div>

              {/* Hero Banner Copy */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                  1. Hero Section Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Headline Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headlinePrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headlinePrefix: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hero CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.hero.ctaLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, ctaLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hero Supporting Subtext
                    </label>
                    <textarea
                      rows={2}
                      value={formData.hero.supportingText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, supportingText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* About Section Copy */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                  2. About Section Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      About Title
                    </label>
                    <input
                      type="text"
                      value={formData.about.heading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.about.ctaLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, ctaLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Services Management */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                    3. Services List ({formData.services.items.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `service-${Date.now()}`;
                      const newItem: ServiceItem = {
                        id: newId,
                        title: 'New Pool Specialty',
                        image:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuD9O_MmdP4LiDzK1VZO52v1QTWaDEop1D-BBUMCeoBDtT60A8B_99HAOIF0kM5hjwUx_LjRJhu1UgkdLVAxEIWw3UbHCiB_qXYVO-GUg-bFuAZ84Tr4WVyXU0KfxJE5KTslCgZk2G09Tc_aakiI0t-f0KIojQRSq8tb8jhepb19GpXD0dRPwSTASqt51mQdj2DQreRKFUfpNiFQQpyvo2ZOI6GGOxu9IL5BZU824sCNB6xMYm_NbCqKJA',
                        description: 'Custom pool craftsmanship and architectural engineering.',
                      };
                      setFormData({
                        ...formData,
                        services: {
                          ...formData.services,
                          items: [...formData.services.items, newItem],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#079BC5] hover:bg-[#0682A6]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Service
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.services.items.map((svc, idx) => (
                    <div
                      key={svc.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                          <Image
                            src={svc.image}
                            alt={svc.title}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const updatedItems = [...formData.services.items];
                              updatedItems[idx].title = e.target.value;
                              setFormData({
                                ...formData,
                                services: { ...formData.services, items: updatedItems },
                              });
                            }}
                            className="font-bold text-xs text-slate-800 border-b border-dashed border-slate-300 focus:outline-none focus:border-[#079BC5] w-full"
                          />
                          <input
                            type="text"
                            value={svc.description}
                            onChange={(e) => {
                              const updatedItems = [...formData.services.items];
                              updatedItems[idx].description = e.target.value;
                              setFormData({
                                ...formData,
                                services: { ...formData.services, items: updatedItems },
                              });
                            }}
                            className="text-[11px] text-slate-500 border-b border-transparent focus:outline-none focus:border-slate-300 w-full mt-0.5"
                          />
                          {svc.id === 'green-pool-treatments' && <div className="mt-3 space-y-2">
                            <p className="text-xs font-bold text-slate-700">Before &amp; after comparison</p>
                            <p className="text-[11px] text-slate-500">The existing service image is the before photo. Upload an after photo to enable the slider.</p>
                            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => triggerImageUpload(`services.items.${idx}.image`)} className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">Upload before image</button><button type="button" onClick={() => triggerImageUpload(`services.items.${idx}.afterImage`)} className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">Upload after image</button></div>
                            <label className="block text-xs text-slate-600">After image URL<input type="text" value={svc.afterImage || ''} onChange={event => { const items = [...formData.services.items]; items[idx] = { ...items[idx], afterImage: event.target.value }; setFormData({ ...formData, services: { ...formData.services, items } }); }} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs" /></label>
                            {svc.afterImage && <div className="relative h-24 w-36 overflow-hidden rounded-lg"><Image src={svc.afterImage} alt="After treatment preview" fill className="object-cover" /></div>}
                          </div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === 0) return;
                            const items = [...formData.services.items];
                            const temp = items[idx - 1];
                            items[idx - 1] = items[idx];
                            items[idx] = temp;
                            setFormData({
                              ...formData,
                              services: { ...formData.services, items },
                            });
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === formData.services.items.length - 1) return;
                            const items = [...formData.services.items];
                            const temp = items[idx + 1];
                            items[idx + 1] = items[idx];
                            items[idx] = temp;
                            setFormData({
                              ...formData,
                              services: { ...formData.services, items },
                            });
                          }}
                          disabled={idx === formData.services.items.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        {formData.services.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const items = formData.services.items.filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                services: { ...formData.services, items },
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bottom Guarantee Banner Quote
                  </label>
                  <textarea
                    rows={2}
                    value={formData.services.guaranteeBanner}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, guaranteeBanner: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 resize-none"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">4. Three-Step Process Cards</h3>
                <p className="text-xs text-slate-500">Upload an image for each card, then save your changes. The card titles and descriptions are kept in the website code.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Book or Consult', 'Expert Execution & Care', 'Enjoy Your Pool'].map((title, idx) => {
                    const step = (formData.processSection || defaultCMSData.processSection)!.steps[idx];
                    return <div key={title} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100"><Image src={step.image} alt={title} fill className="object-cover" /></div>
                      <h4 className="text-sm font-bold text-slate-800">{idx + 1}. {title}</h4>
                      <button type="button" onClick={() => triggerImageUpload(`processSection.steps.${idx}.image`)} disabled={uploadingField === `processSection.steps.${idx}.image`} className="w-full rounded-lg bg-[#079BC5] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{uploadingField === `processSection.steps.${idx}.image` ? 'Uploading...' : 'Upload Image'}</button>
                      <label className="block text-xs font-semibold text-slate-600">Image URL<input type="text" value={step.image} onChange={event => applyImageValue(`processSection.steps.${idx}.image`, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal" /></label>
                    </div>;
                  })}
                </div>
              </div>

              {/* Final CTA Copy */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                  5. Final Call To Action Banner
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge</label>
                    <input
                      type="text"
                      value={formData.ctaBanner.topBadge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ctaBanner: { ...formData.ctaBanner, topBadge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.ctaBanner.buttonLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ctaBanner: { ...formData.ctaBanner, buttonLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={formData.ctaBanner.heading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ctaBanner: { ...formData.ctaBanner, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Contact Section & Message Form */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">
                  6. Contact Section & Message Form
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.contactSection?.phone ?? '067 933 0920'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactSection: {
                            ...(formData.contactSection || defaultCMSData.contactSection!),
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={formData.contactSection?.email ?? 'admin@vsmaintenanceservices.co.za'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactSection: {
                            ...(formData.contactSection || defaultCMSData.contactSection!),
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.contactSection?.location ?? 'Sandton, South Africa'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactSection: {
                            ...(formData.contactSection || defaultCMSData.contactSection!),
                            location: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-slate-800 mb-2">Trading Hours</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tradingHourFields.map(({ key, label, defaultValue }) => (
                        <label
                          key={key}
                          className="block text-xs font-bold text-slate-700"
                        >
                          {label}
                          <input
                            type="text"
                            value={formData.contactSection?.[key] ?? defaultValue}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactSection: {
                                  ...(formData.contactSection || defaultCMSData.contactSection!),
                                  [key]: e.target.value,
                                },
                              })
                            }
                            className="mt-1 w-full px-3 py-2 rounded-xl text-xs font-normal bg-white border border-slate-200"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INQUIRIES / LEADS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Customer Quote Requests ({leads.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time leads submitted through the public website quote modals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/leads');
                    const json = await res.json();
                    if (json.success) setLeads(json.leads);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-700 text-sm">No submissions recorded</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    When visitors submit the &quot;Request a Quote&quot; or &quot;Start A Pool&quot; form on the website, their details appear here permanently.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-200 transition-colors shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{lead.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-[#079BC5] text-[10px] font-bold border border-cyan-100">
                            {lead.service}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="hover:text-[#079BC5] underline"
                          >
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-[#079BC5]">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed">
                        &quot;{lead.message}&quot;
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS & STORAGE */}
          {false && activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Storage & Architecture Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Technical configuration, database persistence status, and backup controls.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#079BC5]" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Permanent Storage Layer Active
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The CMS writes directly to server-side JSON storage at{' '}
                  <code className="bg-white px-2 py-0.5 rounded font-mono text-cyan-800 font-semibold">
                    data/cms-data.json
                  </code>{' '}
                  via the Next.js API route. Content and branding edits survive browser refreshes and are synchronized across all devices.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Ready for Supabase, Cloud SQL, or Firebase database plugins if requested.</span>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Backup & Factory Reset
                </h3>
                <p className="text-xs text-slate-500">
                  You can download your entire website configuration as a JSON file, or restore the original Google Stitch design presets at any time.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(formData, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `vs-maintenance-services-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Export Backup JSON
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Restore Factory Google Stitch Presets
                  </button>
                </div>
              </div>

              {/* No-Auth Security Disclosure */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <strong>CMS access:</strong> The dashboard opens directly without a password.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
