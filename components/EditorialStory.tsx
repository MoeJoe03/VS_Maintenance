'use client';

import React from 'react';
import ProcessSection from '@/components/ProcessSection';
import { CMSData } from '@/lib/cms-types';

interface EditorialStoryProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

export default function EditorialStory({ cmsData, onOpenQuote }: EditorialStoryProps) {
  return <ProcessSection cmsData={cmsData} onOpenQuote={onOpenQuote} />;
}
