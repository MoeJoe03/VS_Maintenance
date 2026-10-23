export const serviceAreas = ['Sandton', 'Fourways', 'Germiston', 'Morningside', 'Midrand', 'Bedfordview', 'Benoni', 'Sunninghill', 'Centurion', 'Edenvale', 'Rosebank', 'Bryanston', 'Houghton Estate', 'Kempton Park', 'Randburg', 'Kyalami'];

export default function ServiceAreas({ dark = false }: { dark?: boolean }) {
  return <ul aria-label="Areas we serve" className="mt-5 flex flex-wrap gap-2">{serviceAreas.map((area, index) => <li key={area} className={`rounded-full border px-3 py-1.5 text-xs ${dark ? 'border-white/20 bg-white/10 text-white' : 'border-[#B8F4F5] bg-[#EBFBFA] text-[#172638]'} ${index === 0 ? 'font-bold' : ''}`}>{area}{index === 0 ? ' (primary)' : ''}</li>)}</ul>;
}
