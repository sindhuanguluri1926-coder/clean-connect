import { WasteReport, RecurringHotspot, WardMetric } from '../types/waste';

export const INITIAL_MOCK_REPORTS: WasteReport[] = [
  {
    id: 'SW-00125',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    location: {
      name: 'Shop 42, Subzi Mandi, Central Bazaar',
      ward: 'Ward 12',
      zone: 'Central Zone',
      latitude: 28.6315,
      longitude: 77.2167,
      landmark: 'Near Mandi Gate 2 & Public Water Point'
    },
    reportedAt: '12 mins ago',
    status: 'Assigned',
    assignedWorker: {
      id: 'WRK-704',
      name: 'Ramesh Kumar',
      badge: 'Senior Sanitation Specialist',
      phone: '+91 98765 43210',
      vehicle: 'Electric Compactor Cart #08'
    },
    aiAnalysis: {
      detectedWaste: [
        {
          category: 'organic',
          name: 'Rotten Vegetable Scraps',
          nameTe: 'కుళ్ళిన కూరగాయల వ్యర్థాలు',
          iconName: 'Apple',
          emoji: '🥬',
          binType: 'Green Wet Waste Bin',
          binTypeTe: 'ఆకుపచ్చ తడి చెత్త బిన్',
          binColor: 'green'
        },
        {
          category: 'plastic',
          name: 'Polythene Bags & Packaging',
          nameTe: 'ప్లాస్టిక్ సంచులు & కవర్లు',
          iconName: 'Layers',
          emoji: '♻️',
          binType: 'Blue Recyclable Bin',
          binTypeTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        },
        {
          category: 'paper',
          name: 'Cardboard Box Sheets',
          nameTe: 'కార్డ్‌బోర్డ్ డబ్బాల ముక్కలు',
          iconName: 'FileText',
          emoji: '📦',
          binType: 'Yellow Paper Bin',
          binTypeTe: 'పసుపు కాగితం బిన్',
          binColor: 'yellow'
        }
      ],
      segregationStatus: 'MIXED WASTE',
      segregationStatusTe: 'మిశ్రమ చెత్త',
      condition: 'Accumulated mixed waste with decomposing organic produce and single-use plastic.',
      conditionTe: 'కుళ్ళిపోతున్న సేంద్రీయ వ్యర్థాలు మరియు ప్లాస్టిక్‌తో కూడిన మిశ్రమ చెత్త కుప్ప.',
      priority: 'HIGH',
      priorityTe: 'అధికం',
      recommendedSegregation: [
        {
          item: 'Organic Produce',
          itemTe: 'సేంద్రీయ కూరగాయలు',
          targetBin: 'Green Wet Waste Bin',
          targetBinTe: 'ఆకుపచ్చ తడి చెత్త బిన్',
          binColor: 'green'
        },
        {
          item: 'Plastic Wraps & Bags',
          itemTe: 'ప్లాస్టిక్ సంచులు',
          targetBin: 'Blue Recyclable Bin',
          targetBinTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        },
        {
          item: 'Cardboard Packaging',
          itemTe: 'కార్డ్‌బోర్డ్ ప్యాకేజింగ్',
          targetBin: 'Yellow Paper Bin',
          targetBinTe: 'పసుపు కాగితం బిన్',
          binColor: 'yellow'
        }
      ],
      workerAction: [
        '1. Inspect area and wear protective nitrile gloves.',
        '2. Shovel wet organic waste into Green Wet Compactor Bins.',
        '3. Separate dry plastic bags into Blue Recyclable Bags.',
        '4. Flatten cardboard box sheets and bundle into Yellow carrier.',
        '5. Sweep pavement clean and spray sanitation disinfectant.',
        '6. Capture after-cleaning photo with worker camera for AI verification.'
      ],
      workerActionTe: [
        '1. ప్రాంతాన్ని పరిశీలించి రక్షణ చేతి తొడుగులు ధరించండి.',
        '2. తడి సేంద్రీయ వ్యర్థాలను ఆకుపచ్చ తడి చెత్త బిన్లలో వేయండి.',
        '3. పొడి ప్లాస్టిక్ సంచులను నీలం రీసైకిల్ బ్యాగుల్లో వేరుచేయండి.',
        '4. కార్డ్‌బోర్డ్ డబ్బాలను మడతపెట్టి పసుపు క్యారియర్‌లో ఉంచండి.',
        '5. రోడ్డును ఊడ్చి క్రిమిసంహారక స్ప్రే చల్లండి.',
        '6. AI ధృవీకరణ కోసం కార్మికుల కెమెరాతో తర్వాత ఫోటో తీయండి.'
      ],
      summaryAction: 'Separate organic, recyclable and paper waste before disposal.',
      summaryActionTe: 'విసర్జనకు ముందు సేంద్రీయ, పునర్వినియోగ ప్లాస్టిక్ మరియు కాగితాన్ని వేరు చేయండి.'
    }
  },
  {
    id: 'SW-00124',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    location: {
      name: 'Rear Lane, Electronics Gali, Railway Colony',
      ward: 'Ward 18',
      zone: 'South Zone',
      latitude: 28.5822,
      longitude: 77.2285,
      landmark: 'Near Storm Drainage Culvert #4'
    },
    reportedAt: '35 mins ago',
    status: 'In Progress',
    assignedWorker: {
      id: 'WRK-512',
      name: 'Anil Yadav',
      badge: 'HazMat Sanitation Lead',
      phone: '+91 98111 22334',
      vehicle: 'Hazardous Waste E-Van #02'
    },
    aiAnalysis: {
      detectedWaste: [
        {
          category: 'ewaste_hazardous',
          name: 'Discarded Lithium Batteries',
          nameTe: 'పారవేసిన లిథియం బ్యాటరీలు',
          iconName: 'AlertTriangle',
          emoji: '⚡',
          binType: 'Hazardous Red Drum',
          binTypeTe: 'ప్రమాదకర ఎరుపు డ్రమ్',
          binColor: 'red'
        },
        {
          category: 'ewaste_hazardous',
          name: 'Electronic PCB Scrap & Cables',
          nameTe: 'ఎలక్ట్రానిక్ సర్క్యూట్ బోర్డులు & వైర్లు',
          iconName: 'Cpu',
          emoji: '🔌',
          binType: 'Authorized E-Waste Crate',
          binTypeTe: 'ఈ-వ్యర్థాల క్రేట్',
          binColor: 'yellow'
        },
        {
          category: 'plastic',
          name: 'Cracked Polymer Casing',
          nameTe: 'విరిగిన ప్లాస్టిక్ కేసింగ్',
          iconName: 'Layers',
          emoji: '♻️',
          binType: 'Blue Recyclable Bin',
          binTypeTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        }
      ],
      segregationStatus: 'MIXED WASTE',
      segregationStatusTe: 'మిశ్రమ చెత్త (ప్రమాదకరం)',
      condition: 'Accumulated mixed waste with hazardous lithium cells partially obstructing rainwater culvert.',
      conditionTe: 'వర్షపు నీటి కాలువను అడ్డుకుంటున్న ప్రమాదకర లిథియం బ్యాటరీలతో కూడిన వ్యర్థాలు.',
      priority: 'CRITICAL',
      priorityTe: 'అత్యవసరం',
      recommendedSegregation: [
        {
          item: 'Batteries & Chemicals',
          itemTe: 'బ్యాటరీలు & రసాయనాలు',
          targetBin: 'Hazardous Red Drum',
          targetBinTe: 'ప్రమాదకర ఎరుపు డ్రమ్',
          binColor: 'red'
        },
        {
          item: 'E-Waste & Wiring',
          itemTe: 'ఈ-వ్యర్థాలు & వైరింగ్',
          targetBin: 'Authorized E-Waste Crate',
          targetBinTe: 'ఈ-వ్యర్థాల క్రేట్',
          binColor: 'yellow'
        },
        {
          item: 'Plastic Shells',
          itemTe: 'ప్లాస్టిక్ కేసింగ్‌లు',
          targetBin: 'Blue Recyclable Bin',
          targetBinTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        }
      ],
      workerAction: [
        '1. Cordon off perimeter and equip heavy puncture-proof rubber gloves.',
        '2. Isolate batteries first into the acid-resistant Red Hazardous Container.',
        '3. Collect wires and circuit debris into authorized e-waste crates.',
        '4. Remove plastic casings into Blue dry recyclables.',
        '5. Restore water flow at culvert opening and clear sediment.',
        '6. Photograph cleared drain with worker camera for AI verification.'
      ],
      workerActionTe: [
        '1. ఆ ప్రాంతాన్ని రక్షిత జోన్‌గా మార్చి మందపాటి చేతి తొడుగులు ధరించండి.',
        '2. ముందుగా బ్యాటరీలను ఎరుపు ప్రమాదకర కంటైనర్‌లో వేరుచేయండి.',
        '3. వైర్లు మరియు సర్క్యూట్ ముక్కలను ఈ-వ్యర్థాల క్రేట్‌లో వేయండి.',
        '4. ప్లాస్టిక్ కేసింగ్‌లను నీలం డస్ట్‌బిన్‌లో ఉంచండి.',
        '5. కాలువ ప్రవాహాన్ని పునరుద్ధరించి అవశేషాలను తొలగించండి.',
        '6. కార్మికుల కెమెరాతో శుభ్రపరిచిన కాలువ ఫోటో తీసి సమర్పించండి.'
      ],
      summaryAction: 'Handle hazardous battery cells separately using tongs before general clearing.',
      summaryActionTe: 'సాధారణ శుభ్రతకు ముందు బ్యాటరీలను ప్రత్యేకంగా వేరుచేసి జాగ్రత్తగా తొలగించండి.'
    }
  },
  {
    id: 'SW-00120',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    location: {
      name: 'Near Gate 3, Shanti Vihar Residential Colony',
      ward: 'Ward 7',
      zone: 'North Zone',
      latitude: 28.6945,
      longitude: 77.1983,
      landmark: 'Beside Community Park Transformer'
    },
    reportedAt: '2 hours ago',
    status: 'Verified',
    assignedWorker: {
      id: 'WRK-302',
      name: 'Sunita Devi',
      badge: 'Recycling Stream Lead',
      phone: '+91 97654 32109',
      vehicle: 'Dry Waste Collector Cart #03'
    },
    aiAnalysis: {
      detectedWaste: [
        {
          category: 'paper',
          name: 'Cardboard Shipping Cartons',
          nameTe: 'కార్డ్‌బోర్డ్ బాక్సులు',
          iconName: 'FileText',
          emoji: '📦',
          binType: 'Yellow Paper Bin',
          binTypeTe: 'పసుపు కాగితం బిన్',
          binColor: 'yellow'
        },
        {
          category: 'plastic',
          name: 'Bubble Wrap & Polythene Film',
          nameTe: 'బబుల్ ర్యాప్ & ప్లాస్టిక్ ఫిల్మ్',
          iconName: 'Layers',
          emoji: '♻️',
          binType: 'Blue Recyclable Bin',
          binTypeTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        }
      ],
      segregationStatus: 'SEGREGATED WASTE',
      segregationStatusTe: 'వేరుచేసిన పొడి చెత్త',
      condition: 'Dry packaging materials neatly grouped; minimal contamination.',
      conditionTe: 'శుభ్రమైన పొడి ప్యాకేజింగ్ వ్యర్థాలు; తక్కువ కాలుష్యం.',
      priority: 'MEDIUM',
      priorityTe: 'మధ్యస్థం',
      recommendedSegregation: [
        {
          item: 'Corrugated Cardboard',
          itemTe: 'కార్డ్‌బోర్డ్ డబ్బాలు',
          targetBin: 'Yellow Paper Bin',
          targetBinTe: 'పసుపు కాగితం బిన్',
          binColor: 'yellow'
        },
        {
          item: 'Packaging Wrap',
          itemTe: 'ప్యాకేజింగ్ చుట్టలు',
          targetBin: 'Blue Recyclable Bin',
          targetBinTe: 'నీలం రీసైకిల్ బిన్',
          binColor: 'blue'
        }
      ],
      workerAction: [
        '1. Flatten all cardboard cartons to save space.',
        '2. Bundle paper and cardboard for municipal paper recycler.',
        '3. Bag plastic wraps separately for polymer baling depot.',
        '4. Sweep walkway clean.',
        '5. Capture after-cleaning photo with worker camera.'
      ],
      workerActionTe: [
        '1. స్థలం ఆదా చేయడానికి అన్ని కార్డ్‌బోర్డ్ డబ్బాలను మడతపెట్టండి.',
        '2. కాగితం మరియు కార్డ్‌బోర్డ్‌ను కట్టలుగా కట్టండి.',
        '3. ప్లాస్టిక్ చుట్టలను వేరుగా సంచులలో ఉంచండి.',
        '4. మార్గాన్ని శుభ్రంగా ఊడ్చండి.',
        '5. కార్మికుల కెమెరాతో తర్వాత ఫోటో తీయండి.'
      ],
      summaryAction: 'Flatten cardboard and bundle dry recyclables neatly.',
      summaryActionTe: 'కార్డ్‌బోర్డ్‌ను మడతపెట్టి పొడి రీసైకిల్ వ్యర్థాలను చక్కగా కట్టండి.'
    },
    verification: {
      status: 'VERIFIED',
      statusTe: 'ధృవీకరించబడింది',
      feedback: 'Area cleared! Cardboard cartons collected and sidewalk is completely clear.',
      feedbackTe: 'ప్రాంతం శుభ్రపరచబడింది! కార్డ్‌బోర్డ్ డబ్బాలు తొలగించబడ్డాయి మరియు ఫుట్‌పాత్ పూర్తిగా శుభ్రంగా ఉంది.',
      verifiedAt: '12:45 PM',
      isVerified: true
    }
  }
];

export const MOCK_RECURRING_HOTSPOTS: RecurringHotspot[] = [
  {
    id: 'HOTSPOT-01',
    title: 'Central Vegetable Market Wholesale Lane',
    titleTe: 'సెంట్రల్ కూరగాయల మార్కెట్ హోల్‌సేల్ లైన్',
    locationName: 'Subzi Mandi Axis, Ward 12',
    ward: 'Ward 12',
    zone: 'Central Zone',
    reportsCount30Days: 24,
    primaryWaste: 'Organic Rotten Produce + Single-use Plastic',
    primaryWasteTe: 'సేంద్రీయ కుళ్ళిన కూరగాయలు + ప్లాస్టిక్ సంచులు',
    recurrenceLevel: 'CRITICAL',
    rootCause: 'Insufficient wet-waste compactor bins for wholesale vendors during morning unloading.',
    rootCauseTe: 'ఉదయం అన్‌లోడింగ్ సమయంలో వ్యాపారులకు తగినన్ని తడి చెత్త బిన్లు లేకపోవడం.',
    recommendedAction: 'Deploy two 240L dedicated organic compactor bins and increase collection frequency to twice daily.',
    recommendedActionTe: 'రెండు 240 లీటర్ల తడి చెత్త బిన్లను ఏర్పాటు చేసి రోజుకు రెండుసార్లు సేకరణ నిర్వహించండి.',
    coordinates: { lat: 28.6315, lng: 77.2167 }
  },
  {
    id: 'HOTSPOT-02',
    title: 'Electronics Scrap Culvert Junction',
    titleTe: 'ఎలక్ట్రానిక్స్ స్క్రాప్ కాలువ జంక్షన్',
    locationName: 'Gali 4, Railway Colony, Ward 18',
    ward: 'Ward 18',
    zone: 'South Zone',
    reportsCount30Days: 16,
    primaryWaste: 'E-Waste + Battery Debris',
    primaryWasteTe: 'ఈ-వ్యర్థాలు + బ్యాటరీ భాగాలు',
    recurrenceLevel: 'HIGH',
    rootCause: 'Informal electronic repair shops dumping non-working batteries and PCB fragments in storm drain.',
    rootCauseTe: 'మరమ్మతు దుకాణాలు పాడైన బ్యాటరీలు మరియు సర్క్యూట్ బోర్డులను కాలువలో వేయడం.',
    recommendedAction: 'Place authorized municipal e-waste collection crate and monitor unauthorized nocturnal dumping.',
    recommendedActionTe: 'అధీకృత ఈ-వ్యర్థాల క్రేట్‌ను ఏర్పాటు చేసి రాత్రిపూట చెత్త వేయడాన్ని నిరోధించండి.',
    coordinates: { lat: 28.5822, lng: 77.2285 }
  }
];

export const MOCK_WARD_METRICS: WardMetric[] = [
  { ward: 'Ward 12', name: 'Central Bazaar', zone: 'Central Zone', totalReports: 94, activeTasks: 8, resolvedToday: 18, avgResponseHours: 2.8, segregationComplianceRate: 88 },
  { ward: 'Ward 18', name: 'Railway Colony', zone: 'South Zone', totalReports: 76, activeTasks: 5, resolvedToday: 14, avgResponseHours: 3.1, segregationComplianceRate: 82 },
  { ward: 'Ward 7', name: 'Shanti Vihar', zone: 'North Zone', totalReports: 62, activeTasks: 3, resolvedToday: 12, avgResponseHours: 2.4, segregationComplianceRate: 94 },
  { ward: 'Ward 4', name: 'East Enclave', zone: 'East Zone', totalReports: 58, activeTasks: 4, resolvedToday: 11, avgResponseHours: 3.4, segregationComplianceRate: 85 },
  { ward: 'Ward 21', name: 'Industrial Hub', zone: 'West Zone', totalReports: 88, activeTasks: 7, resolvedToday: 16, avgResponseHours: 3.6, segregationComplianceRate: 79 }
];
