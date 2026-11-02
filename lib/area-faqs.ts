import { serviceAreas } from '@/components/ServiceAreas';

export const areaFaqs = [
  { question: 'Do you provide pool maintenance in Sandton?', answer: 'Yes. Sandton is our primary service area. Our pool maintenance service includes cleaning, water testing and balancing, filter care and equipment checks. Contact us with your address to confirm availability.' },
  ...(serviceAreas.includes('Bryanston') && serviceAreas.includes('Fourways') ? [{ question: 'Do you also serve Bryanston and Fourways?', answer: 'Yes, Bryanston and Fourways are listed service areas. Availability depends on your exact address, the work required and our current schedule, so please confirm with our team before arranging a visit.' }] : []),
  { question: 'Do you have offices in every listed suburb?', answer: 'No. These are service areas rather than separate branches. We operate from our Johannesburg base and visit customers by arrangement.' },
  { question: 'Do you cover my suburb if it is not listed?', answer: 'Send us your address or suburb and a short description of the work. We will check whether we can assist.' },
];
