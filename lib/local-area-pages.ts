export interface LocalAreaPageConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  focus: string;
  serviceTypes: string[];
  projectIds: string[];
  faqs: { question: string; answer: string }[];
}

export const localAreaPages: Record<string, LocalAreaPageConfig> = {
  bedfordview: {
    slug: 'bedfordview', name: 'Bedfordview',
    title: 'Pool Services in Bedfordview | VS Maintenance Services',
    description: 'Pool maintenance, renovations and green pool treatments in Bedfordview. View local projects and check availability with VS Maintenance Services.',
    intro: 'VS Maintenance Services visits Bedfordview properties by arrangement for pool maintenance, repairs, renovations, equipment installation and outdoor work. Share your address and the work required so we can confirm availability.',
    focus: 'Our Bedfordview gallery includes pool maintenance, renovation and green water treatment. These examples show the range of existing pool conditions we can assess before discussing a suitable scope and quote.',
    serviceTypes: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Green pool treatment', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gal-3', 'gal-20', 'gallery-1792869938752'],
    faqs: [
      { question: 'Do you provide pool maintenance in Bedfordview?', answer: 'Yes. Pool maintenance can include cleaning, water testing and balancing, filter care and equipment checks. Send your address and pool details to confirm availability.' },
      { question: 'Can you renovate an existing pool in Bedfordview?', answer: 'Yes. Our gallery includes a Bedfordview renovation project. Tell us about the pool condition so we can discuss the work and whether an assessment is needed.' },
      { question: 'Can you treat a green pool in Bedfordview?', answer: 'Yes. We assess the water and filtration before recommending cleaning and treatment. Our gallery includes a Bedfordview green water treatment example.' },
      { question: 'How do I arrange a Bedfordview visit?', answer: 'Send your address, property type and a short description of the work. We will check coverage and availability, then explain the assessment and quotation process.' },
    ],
  },
  fourways: {
    slug: 'fourways', name: 'Fourways',
    title: 'Pool Services in Fourways | VS Maintenance Services',
    description: 'Pool maintenance, repairs, renovations and equipment installation in Fourways. Explore local projects and check availability with VS Maintenance Services.',
    intro: 'VS Maintenance Services visits Fourways properties by arrangement for ongoing pool care, repairs, renovations, equipment installation and outdoor work. Tell us your address and project details so we can confirm availability.',
    focus: 'Our Fourways gallery includes pool maintenance and renovation projects. We discuss the pool condition, access and intended result before recommending the next step.',
    serviceTypes: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Green pool treatment', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gal-7', 'gallery-1792868105339', 'gallery-1792869194338'],
    faqs: [
      { question: 'Do you provide regular pool maintenance in Fourways?', answer: 'Yes. We offer cleaning, water testing and balancing, filter care and equipment checks. Share your address and pool details so we can confirm a suitable plan.' },
      { question: 'Can you renovate an existing pool in Fourways?', answer: 'Yes. Our Fourways gallery includes renovation work. The scope depends on the pool condition and an agreed assessment.' },
      { question: 'Do you install pool equipment in Fourways?', answer: 'Yes. Pumps, filters, valves and lights are part of our equipment offering. Tell us about your current setup and the issue you need solved.' },
      { question: 'How do I request a Fourways quote?', answer: 'Send your address, property type and a brief description of the work. We will confirm availability and whether a site assessment is needed before quoting.' },
    ],
  },
  germiston: {
    slug: 'germiston', name: 'Germiston',
    title: 'Pool Services in Germiston | VS Maintenance Services',
    description: 'Pool maintenance, cleaning, renovations and equipment installation in Germiston. See local work and check availability with VS Maintenance Services.',
    intro: 'VS Maintenance Services visits Germiston properties by arrangement for pool care, repairs, renovations, equipment installation and outdoor work. Share your address and the work required to confirm availability.',
    focus: 'Our Germiston gallery includes pool maintenance, vacuuming and renovation work. We assess the water, pool surface or equipment as needed before agreeing on the scope.',
    serviceTypes: ['Swimming pool maintenance', 'Pool cleaning and vacuuming', 'Swimming pool repairs', 'Swimming pool renovation', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gal-6', 'gallery-1792868436834', 'gallery-1792869500262'],
    faqs: [
      { question: 'Do you provide pool maintenance in Germiston?', answer: 'Yes. Maintenance can include cleaning, water testing and balancing, filter care and equipment checks. Send your address to confirm availability.' },
      { question: 'Can you vacuum and clean a pool in Germiston?', answer: 'Yes. Pool cleaning and vacuuming are part of our pool care offering, and our gallery includes Germiston work. The scope depends on the water and equipment condition.' },
      { question: 'Can you renovate an existing pool in Germiston?', answer: 'Yes. Our gallery includes renovation work in Germiston. We discuss the condition and the work needed before preparing a scope.' },
      { question: 'How do I arrange a Germiston visit?', answer: 'Share your address, property type and a short description of the pool or outdoor work. We will confirm availability and the next step.' },
    ],
  },
  randburg: {
    slug: 'randburg', name: 'Randburg',
    title: 'Pool and Property Services in Randburg | VS Maintenance Services',
    description: 'Pool renovation, multiport valve installation, garden care and other pool services in Randburg. View local projects and check availability.',
    intro: 'VS Maintenance Services visits Randburg properties by arrangement for pool maintenance, repairs, renovations, equipment installation and outdoor work. Tell us your address and what needs attention so we can confirm availability.',
    focus: 'Our Randburg gallery includes pool renovation, multiport valve installation and lawn care. These projects show both pool equipment and outdoor property work we can discuss for your address.',
    serviceTypes: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Multiport valve installation', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gallery-1792868101501', 'gallery-1792869676094', 'gal-10'],
    faqs: [
      { question: 'Do you provide pool maintenance in Randburg?', answer: 'Yes. We offer cleaning, water testing and balancing, filter care and equipment checks. Send your address and pool details to confirm availability.' },
      { question: 'Can you renovate a pool in Randburg?', answer: 'Yes. Our Randburg gallery includes renovation work. We discuss the pool condition and the intended result before agreeing on a scope.' },
      { question: 'Do you install multiport valves in Randburg?', answer: 'Yes. Multiport valve installation is part of our equipment offering, and our gallery includes a Randburg example. Tell us about the existing filter setup.' },
      { question: 'Can you help with garden work in Randburg?', answer: 'Yes. Garden service is part of our property care offering, and our gallery includes lawn care in Randburg. Send us the work required to check availability.' },
      { question: 'How do I arrange a Randburg visit?', answer: 'Send your address, property type and a short description of the work. We will confirm coverage and availability, then explain the assessment and quote process.' },
    ],
  },
  centurion: {
    slug: 'centurion', name: 'Centurion',
    title: 'Pool Services in Centurion | VS Maintenance Services',
    description: 'Pool maintenance, pump installation, green pool treatments and paving in Centurion. View local projects and check availability with VS Maintenance Services.',
    intro: 'VS Maintenance Services visits Centurion properties by arrangement for pool maintenance, repairs, renovations, equipment installation and outdoor work. Share your address and project details so we can confirm availability.',
    focus: 'Our Centurion gallery includes pool maintenance, pump installation, paving and green water treatment. We discuss the condition of your pool or outdoor area and agree on the scope before arranging an assessment or quote.',
    serviceTypes: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Green pool treatment', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gal-1', 'gallery-1792868629615', 'gallery-1792868852392', 'gallery-1792869965506'],
    faqs: [
      { question: 'Do you provide pool maintenance in Centurion?', answer: 'Yes. We offer cleaning, water testing and balancing, filter care and equipment checks. Send your address and pool details so we can confirm availability.' },
      { question: 'Can you install a pool pump in Centurion?', answer: 'Yes. Pump installation is part of our equipment work, and our gallery includes a Centurion example. Tell us about the current pump and filtration setup.' },
      { question: 'Can you treat green pool water in Centurion?', answer: 'Yes. We assess the water and filtration before recommending cleaning and treatment. Share the current condition when you enquire.' },
      { question: 'Do you offer paving in Centurion?', answer: 'Yes. Paving installation is part of our outdoor work, and our gallery includes a Centurion project. Send us the area and work required.' },
      { question: 'How do I arrange a Centurion visit?', answer: 'Send your address, property type and a short description of the work. We will check coverage and availability, then explain the assessment and quotation process.' },
    ],
  },
  'kempton-park': {
    slug: 'kempton-park',
    name: 'Kempton Park',
    title: 'Pool Services in Kempton Park | VS Maintenance Services',
    description: 'Pool maintenance, renovations, green pool treatments and outdoor property work in Kempton Park. See local projects and check availability with VS Maintenance Services.',
    intro: 'VS Maintenance Services visits Kempton Park properties by arrangement for pool care, repairs, renovations, equipment installation and outdoor work. Tell us your address and what needs attention so we can confirm availability.',
    focus: 'Our Kempton Park gallery includes pool renovation, green pool treatment and paving work. These projects show the kinds of existing pools and outdoor areas we can assess. We will discuss the condition, access and scope before arranging a visit or quote.',
    serviceTypes: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Green pool treatment', 'Pool equipment installation', 'Garden service', 'Paving installation'],
    projectIds: ['gal-18', 'gallery-1792869495435', 'gallery-1792869979314', 'gal-16'],
    faqs: [
      { question: 'Do you provide pool maintenance in Kempton Park?', answer: 'Yes. We offer pool maintenance, including cleaning, water testing and balancing, filter care and equipment checks. Share your Kempton Park address and pool details so we can confirm a suitable plan and availability.' },
      { question: 'Can you renovate an existing pool in Kempton Park?', answer: 'Yes. Our Kempton Park gallery includes pool renovation work. Tell us about the pool surface, leaks or equipment concerns so we can discuss the scope and whether an assessment is needed.' },
      { question: 'Can you treat a green pool in Kempton Park?', answer: 'Yes. We assess the water condition and filtration before recommending cleaning and treatment. The gallery includes a green water treatment project in Kempton Park.' },
      { question: 'Do you also offer paving in Kempton Park?', answer: 'Yes. Paving installation is part of our outdoor property work, and the gallery includes a Kempton Park paving project. Send us the area and work required so we can confirm availability.' },
      { question: 'How do I arrange a visit in Kempton Park?', answer: 'Send your suburb or address, property type and a short description of the pool or outdoor work. We will check coverage and current availability, then explain the assessment and quotation process.' },
    ],
  },
  bryanston: {
    slug: 'bryanston',
    name: 'Bryanston',
    title: 'Pool Maintenance and Repairs in Bryanston | VS Maintenance Services',
    description: 'Pool cleaning, maintenance, repairs and outdoor property services in Bryanston. Explore real projects and confirm availability with VS Maintenance Services.',
    intro: 'From routine pool cleaning and water care to repairs and related outdoor work, VS Maintenance Services visits Bryanston properties by arrangement. Share your address and the work required so we can confirm availability.',
    focus: 'Our Bryanston gallery includes pool cleaning and vacuuming, paving installation and pool lighting work. We can discuss the condition of your pool or outdoor area and recommend an appropriate scope before quoting.',
    serviceTypes: ['Swimming pool maintenance', 'Pool cleaning and vacuuming', 'Swimming pool repairs', 'Pool light installation', 'Paving installation'],
    projectIds: ['gal-5', 'gallery-1792868865082', 'gallery-1792869785781'],
    faqs: [
      { question: 'Do you provide pool maintenance in Bryanston?', answer: 'Yes. Pool maintenance can include cleaning, vacuuming, water testing and balancing, filter care and equipment checks. Contact us with your Bryanston address to confirm a suitable plan and availability.' },
      { question: 'Can you help with pool cleaning and vacuuming in Bryanston?', answer: 'Yes. Pool cleaning and vacuuming are part of our pool care offering. The scope depends on the water condition, pool equipment and work required.' },
      { question: 'Do you offer paving and pool light installation in Bryanston?', answer: 'These services are part of our offering, and the gallery includes Bryanston examples. Share your property details so we can confirm availability and the right scope.' },
      { question: 'How do I arrange a Bryanston visit?', answer: 'Send us your suburb or address, property type and a short description of the pool or outdoor work. We will confirm availability and whether an assessment is needed before providing a quote.' },
    ],
  },
  morningside: {
    slug: 'morningside',
    name: 'Morningside',
    title: 'Pool Repairs and Equipment Installation in Morningside | VS Maintenance Services',
    description: 'Pool pump and multiport valve installation, pool repairs, renovation and maintenance in Morningside. View local work and request availability.',
    intro: 'VS Maintenance Services works on Morningside pools, including maintenance, repairs, renovations and equipment installation. Tell us about your pool and equipment so we can confirm a suitable visit.',
    focus: 'Our Morningside gallery includes multiport valve installation, pool pump installation and pool renovation. We assess the existing setup and discuss the work needed before agreeing a scope.',
    serviceTypes: ['Pool pump installation', 'Multiport valve installation', 'Swimming pool renovation', 'Swimming pool maintenance', 'Filter tank installation'],
    projectIds: ['gal-14', 'gallery-1792868633492', 'gallery-1792869228781'],
    faqs: [
      { question: 'Can you install a pool pump in Morningside?', answer: 'Yes. We install or replace pool pumps suited to the pool and filtration system. Send us the equipment details and your address so we can confirm availability.' },
      { question: 'Do you work on multiport valves in Morningside?', answer: 'Yes. We offer compatible multiport valve installation and replacement to support filter operation. We can discuss the existing filter setup before arranging the work.' },
      { question: 'Can you renovate an existing Morningside pool?', answer: 'Yes. Our renovation work can include leak investigation, surface restoration, tile repairs and updated finishes. The scope depends on the pool condition and an agreed assessment.' },
      { question: 'How do I request a quote in Morningside?', answer: 'Share your address, pool condition and a description of the repair, renovation or equipment work. We will confirm availability, discuss whether a site assessment is needed and provide a quote for review.' },
    ],
  },
  sunninghill: {
    slug: 'sunninghill',
    name: 'Sunninghill',
    title: 'Pool Renovation and Filtration Services in Sunninghill | VS Maintenance Services',
    description: 'Filter tank installation, pool renovation, green pool treatments and maintenance in Sunninghill. Explore local projects and check service availability.',
    intro: 'For Sunninghill pools needing clearer water, filtration work, repair or renovation, VS Maintenance Services can discuss the condition of the pool and the right scope. Visits are arranged after we confirm your address and availability.',
    focus: 'Our Sunninghill gallery includes filter tank installation, pool renovation, pool lighting and green water treatment. These examples show the range of work we can discuss for an existing pool.',
    serviceTypes: ['Filter tank installation', 'Swimming pool renovation', 'Green pool treatment', 'Swimming pool maintenance', 'Pool light installation'],
    projectIds: ['gal-8', 'gallery-1792868090054', 'gallery-1792869792899', 'gallery-1792869974938'],
    faqs: [
      { question: 'Can you install a filter tank in Sunninghill?', answer: 'Yes. We install or replace pool filter tanks suited to the pump and filtration requirements. Tell us about the existing setup so we can confirm the next step.' },
      { question: 'Do you treat green pool water in Sunninghill?', answer: 'Yes. We assess green pool water and filtration, then recommend cleaning and treatment based on the water condition. Share the current condition and your address when you enquire.' },
      { question: 'Can you renovate a pool in Sunninghill?', answer: 'Yes. We work on existing pools, including repairs, surface restoration, tile repairs and updated finishes. We confirm the scope after understanding the pool condition.' },
      { question: 'How do I arrange a Sunninghill visit?', answer: 'Send us your suburb or address, property type and a short description of the pool or equipment work. We will confirm availability and discuss whether an assessment is needed before quoting.' },
    ],
  },
};

export function getLocalAreaPage(slug: string) {
  return localAreaPages[slug];
}
