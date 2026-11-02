import type { CMSData } from './cms-types';

export function getBusinessDetails(data: CMSData) {
  const phone = data.branding.telephone.trim();
  const digits = phone.replace(/\D/g, '');
  return {
    name: data.branding.companyName.trim(), phone,
    telephone: digits ? (digits.startsWith('0') ? `+27${digits.slice(1)}` : `+${digits}`) : '',
    email: data.branding.emailAddress.trim(),
    address: data.branding.address.trim(),
  };
}
