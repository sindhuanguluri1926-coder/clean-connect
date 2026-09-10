export interface SampleWastePreset {
  id: string;
  title: string;
  titleTe: string;
  location: string;
  ward: string;
  zone: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  afterImageUrl: string;
  suggestedDescription: string;
  previewCategories: string[];
}

export const SAMPLE_WASTE_PRESETS: SampleWastePreset[] = [
  {
    id: 'preset-mandi-mixed',
    title: 'Mandi Vegetable & Plastic Overflow',
    titleTe: 'సబ్జీ మండి కూరగాయలు & ప్లాస్టిక్ వ్యర్థాలు',
    location: 'Shop 42, Subzi Mandi, Central Bazaar',
    ward: 'Ward 12',
    zone: 'Central Zone',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    suggestedDescription: 'Decomposing vegetable waste mixed with single-use polybags blocking market walkway.',
    previewCategories: ['Organic Waste', 'Plastic', 'Cardboard']
  },
  {
    id: 'preset-ewaste-drain',
    title: 'E-Waste & Battery Spill near Drain',
    titleTe: 'కాలువ వద్ద ఈ-వ్యర్థాలు & బ్యాటరీల కుప్ప',
    location: 'Rear Lane, Electronics Gali, Railway Colony',
    ward: 'Ward 18',
    zone: 'South Zone',
    coordinates: { lat: 28.5822, lng: 77.2285 },
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    suggestedDescription: 'Discarded UPS batteries, broken PCB boards and tangled wires near rainwater culvert.',
    previewCategories: ['Batteries', 'E-Waste', 'Plastic', 'Metal']
  },
  {
    id: 'preset-residential-packaging',
    title: 'Cardboard & Plastic Packaging Corner',
    titleTe: 'కాలనీ మూలలో కాగితం & ప్లాస్టిక్ ప్యాకేజింగ్',
    location: 'Near Gate 3, Shanti Vihar Residential Colony',
    ward: 'Ward 7',
    zone: 'North Zone',
    coordinates: { lat: 28.6945, lng: 77.1983 },
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    suggestedDescription: 'Cardboard boxes, shipping cartons and bubble wrap piled near electrical post.',
    previewCategories: ['Cardboard / Paper', 'Plastic Film']
  },
  {
    id: 'preset-school-perimeter',
    title: 'Scattered Food Wrappers & Bottles',
    titleTe: 'పాఠశాల పరిసరాల్లో ఆహార కవర్లు & బాటిల్స్',
    location: 'Opposite Government Girls Senior Secondary School',
    ward: 'Ward 4',
    zone: 'East Zone',
    coordinates: { lat: 28.6489, lng: 77.2792 },
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    suggestedDescription: 'Discarded plastic bottles, juice cartons and snack remains along pedestrian path.',
    previewCategories: ['Plastic Bottles', 'Food Scraps', 'Paper Cartons']
  }
];
