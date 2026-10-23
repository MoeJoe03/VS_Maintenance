import { getCMSData } from '@/lib/cms-storage';
import ClientContactPage from '@/components/ClientContactPage';
export const dynamic = 'force-dynamic';
export function generateMetadata() { const data = getCMSData(); return { title: `Contact ${data.branding.companyName.trim()} | Pool Services in Sandton`, description: 'Contact our team about pool construction, repairs, maintenance and equipment. Send an enquiry or find our phone number, email and opening hours.' }; }
export default function ContactPage() { return <ClientContactPage cmsData={getCMSData()} />; }
