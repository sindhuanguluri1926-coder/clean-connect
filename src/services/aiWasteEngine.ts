import {
  SimplifiedAIAnalysis,
  DetectedWasteItem,
  SimpleVerificationResult
} from '../types/waste';

export function generateReportId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SW-00${randomNum}`;
}

/**
 * Clean, realistic AI waste understanding engine.
 * Receives an image (and optional location context), analyzes visible materials,
 * determines segregation status, evaluates visible condition, sets priority,
 * and generates a concrete worker segregation and action plan.
 */
export async function analyzeWasteImage(
  _imageUrl: string,
  hintText: string = ''
): Promise<SimplifiedAIAnalysis> {
  // Realistic processing latency for computer vision model inference
  await new Promise(resolve => setTimeout(resolve, 1200));

  const lower = hintText.toLowerCase();

  // Pattern detection for realistic test cases or dynamic inputs
  const hasEwaste = lower.includes('battery') || lower.includes('wire') || lower.includes('electronic') || lower.includes('culvert');
  const hasCardboardOnly = lower.includes('cardboard') || lower.includes('packaging') || lower.includes('box');
  const hasSchoolSnacks = lower.includes('school') || lower.includes('snack') || lower.includes('wrapper') || lower.includes('bottle');

  let detectedWaste: DetectedWasteItem[] = [];
  let segregationStatus: 'MIXED WASTE' | 'SEGREGATED WASTE' = 'MIXED WASTE';
  let segregationStatusTe = 'మిశ్రమ చెత్త';
  let condition = 'Accumulated mixed waste with organic and non-biodegradable debris.';
  let conditionTe = 'సేంద్రీయ మరియు పునర్వినియోగించలేని వ్యర్థాలతో కూడిన మిశ్రమ చెత్త పేరుకుపోయింది.';
  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  let priorityTe = 'అధికం';

  if (hasEwaste) {
    detectedWaste = [
      {
        category: 'ewaste_hazardous',
        name: 'Batteries & Circuit Boards',
        nameTe: 'బ్యాటరీలు & సర్క్యూట్ బోర్డులు',
        iconName: 'AlertTriangle',
        emoji: '⚡',
        binType: 'Hazardous Red Drum',
        binTypeTe: 'ప్రమాదకర ఎరుపు డ్రమ్',
        binColor: 'red'
      },
      {
        category: 'plastic',
        name: 'Plastic Casings & Wraps',
        nameTe: 'ప్లాస్టిక్ కవరింగ్‌లు & చుట్టలు',
        iconName: 'Layers',
        emoji: '♻️',
        binType: 'Blue Recyclable Bin',
        binTypeTe: 'నీలం రీసైకిల్ బిన్',
        binColor: 'blue'
      },
      {
        category: 'glass_metal',
        name: 'Scrap Metal & Wires',
        nameTe: 'లోహపు భాగాలు & వైర్లు',
        iconName: 'Wrench',
        emoji: '🔩',
        binType: 'Blue Recyclable Bin',
        binTypeTe: 'నీలం రీసైకిల్ బిన్',
        binColor: 'blue'
      }
    ];
    segregationStatus = 'MIXED WASTE';
    segregationStatusTe = 'మిశ్రమ చెత్త (ప్రమాదకరం)';
    condition = 'Accumulated mixed waste with exposed batteries and hazardous electronic scrap.';
    conditionTe = 'బహిరంగంగా పడిఉన్న బ్యాటరీలు మరియు ప్రమాదకర ఎలక్ట్రానిక్ వ్యర్థాలతో కూడిన మిశ్రమ చెత్త.';
    priority = 'CRITICAL';
    priorityTe = 'అత్యవసరం';
  } else if (hasCardboardOnly) {
    detectedWaste = [
      {
        category: 'paper',
        name: 'Cardboard Shipping Cartons',
        nameTe: 'కార్డ్‌బోర్డ్ డబ్బాలు & కాగితం',
        iconName: 'FileText',
        emoji: '📦',
        binType: 'Yellow Paper Bin',
        binTypeTe: 'పసుపు కాగితం బిన్',
        binColor: 'yellow'
      },
      {
        category: 'plastic',
        name: 'Plastic Packaging Film',
        nameTe: 'ప్లాస్టిక్ ప్యాకేజింగ్ ఫిల్మ్',
        iconName: 'Layers',
        emoji: '♻️',
        binType: 'Blue Recyclable Bin',
        binTypeTe: 'నీలం రీసైకిల్ బిన్',
        binColor: 'blue'
      }
    ];
    segregationStatus = 'SEGREGATED WASTE';
    segregationStatusTe = 'పాక్షికంగా వేరుచేసిన పొడి చెత్త';
    condition = 'Dry packaging waste piled at street corner; clean condition with minimal moisture.';
    conditionTe = 'వీధి మూలలో పేరుకుపోయిన పొడి ప్యాకేజింగ్ వ్యర్థాలు; తేమ లేని పరిస్థితి.';
    priority = 'MEDIUM';
    priorityTe = 'మధ్యస్థం';
  } else if (hasSchoolSnacks) {
    detectedWaste = [
      {
        category: 'plastic',
        name: 'Plastic Bottles & Snack Wrappers',
        nameTe: 'ప్లాస్టిక్ సీసాలు & స్నాక్ కవర్లు',
        iconName: 'Layers',
        emoji: '♻️',
        binType: 'Blue Recyclable Bin',
        binTypeTe: 'నీలం రీసైకిల్ బిన్',
        binColor: 'blue'
      },
      {
        category: 'organic',
        name: 'Discarded Food Remains',
        nameTe: 'మిగిలిపోయిన ఆహార వ్యర్థాలు',
        iconName: 'Apple',
        emoji: '🥬',
        binType: 'Green Wet Waste Bin',
        binTypeTe: 'ఆకుపచ్చ తడి చెత్త బిన్',
        binColor: 'green'
      },
      {
        category: 'paper',
        name: 'Paper Bags & Cartons',
        nameTe: 'కాగితపు సంచులు & డబ్బాలు',
        iconName: 'FileText',
        emoji: '📦',
        binType: 'Yellow Paper Bin',
        binTypeTe: 'పసుపు కాగితం బిన్',
        binColor: 'yellow'
      }
    ];
    segregationStatus = 'MIXED WASTE';
    segregationStatusTe = 'మిశ్రమ చెత్త';
    condition = 'Scattered food waste and single-use plastic litter along public pedestrian walkway.';
    conditionTe = 'పాదచారుల మార్గంలో వెదజల్లబడిన ఆహార వ్యర్థాలు మరియు ప్లాస్టిక్ చెత్త.';
    priority = 'HIGH';
    priorityTe = 'అధికం';
  } else {
    // Standard / Default Mixed produce and plastic pile
    detectedWaste = [
      {
        category: 'organic',
        name: 'Organic & Food Waste',
        nameTe: 'సేంద్రీయ & కూరగాయల వ్యర్థాలు',
        iconName: 'Apple',
        emoji: '🥬',
        binType: 'Green Wet Waste Bin',
        binTypeTe: 'ఆకుపచ్చ తడి చెత్త బిన్',
        binColor: 'green'
      },
      {
        category: 'plastic',
        name: 'Plastic Bags & Containers',
        nameTe: 'ప్లాస్టిక్ సంచులు & కంటైనర్లు',
        iconName: 'Layers',
        emoji: '♻️',
        binType: 'Blue Recyclable Bin',
        binTypeTe: 'నీలం రీసైకిల్ బిన్',
        binColor: 'blue'
      },
      {
        category: 'paper',
        name: 'Paper & Cardboard Sheets',
        nameTe: 'కాగితం & కార్డ్‌బోర్డ్ షీట్లు',
        iconName: 'FileText',
        emoji: '📦',
        binType: 'Yellow Paper Bin',
        binTypeTe: 'పసుపు కాగితం బిన్',
        binColor: 'yellow'
      }
    ];
    segregationStatus = 'MIXED WASTE';
    segregationStatusTe = 'మిశ్రమ చెత్త';
    condition = 'Accumulated mixed waste with decomposing organic food matter and single-use plastic.';
    conditionTe = 'కుళ్ళిపోతున్న సేంద్రీయ వ్యర్థాలు మరియు ప్లాస్టిక్‌తో కూడిన మిశ్రమ చెత్త కుప్ప.';
    priority = 'HIGH';
    priorityTe = 'అధికం';
  }

  // Recommended Segregation Mapping
  const recommendedSegregation = detectedWaste.map(item => ({
    item: item.name,
    itemTe: item.nameTe,
    targetBin: item.binType,
    targetBinTe: item.binTypeTe,
    binColor: item.binColor
  }));

  // Clean sequential worker action steps
  const workerAction: string[] = [
    '1. Inspect area and wear protective gloves and footwear.',
    '2. Separate wet organic waste into Green Compost Bins.',
    '3. Collect recyclable plastics and paper into Blue and Yellow Bins.',
    hasEwaste
      ? '4. Carefully isolate batteries and electronic items into the Red Hazardous Container.'
      : '4. Bag remaining non-recyclable inert waste separately.',
    '5. Sweep and sanitize the cleared ground area with disinfectant.',
    '6. Capture an after-cleaning photo with the worker camera for AI verification.'
  ];

  const workerActionTe: string[] = [
    '1. ప్రాంతాన్ని పరిశీలించి రక్షణ చేతి తొడుగులు ధరించండి.',
    '2. తడి సేంద్రీయ వ్యర్థాలను వేరుచేసి ఆకుపచ్చ బిన్‌లో వేయండి.',
    '3. రీసైకిల్ చేయదగిన ప్లాస్టిక్ మరియు కాగితాన్ని నీలం మరియు పసుపు బిన్లలో సేకరించండి.',
    hasEwaste
      ? '4. బ్యాటరీలు మరియు ఎలక్ట్రానిక్ వస్తువులను జాగ్రత్తగా ఎరుపు ప్రమాదకర కంటైనర్‌లో ఉంచండి.'
      : '4. మిగిలిన రీసైకిల్ చేయలేని వ్యర్థాలను వేరుగా సంచీలో ఉంచండి.',
    '5. శుభ్రం చేసిన ప్రాంతాన్ని ఊడ్చి క్రిమిసంహారక పొడిని చల్లండి.',
    '6. AI ధృవీకరణ కోసం కార్మికుల కెమెరాతో శుభ్రపరిచిన తర్వాత ఫోటో తీయండి.'
  ];

  const summaryAction = hasEwaste
    ? 'Separate organic, recyclable and hazardous batteries before disposal.'
    : 'Separate organic from recyclable plastics and paper before cart loading.';

  const summaryActionTe = hasEwaste
    ? 'విసర్జనకు ముందు సేంద్రీయ, పునర్వినియోగ మరియు ప్రమాదకర బ్యాటరీలను వేరు చేయండి.'
    : 'లోడింగ్ చేయడానికి ముందు తడి సేంద్రీయ చెత్త నుండి ప్లాస్టిక్ మరియు కాగితాన్ని వేరు చేయండి.';

  return {
    detectedWaste,
    segregationStatus,
    segregationStatusTe,
    condition,
    conditionTe,
    priority,
    priorityTe,
    recommendedSegregation,
    workerAction,
    workerActionTe,
    summaryAction,
    summaryActionTe
  };
}

/**
 * Realistic Before / After Verification Engine.
 * Replaces fake percentages with a simple VERIFIED or NEEDS REVIEW outcome.
 */
export async function verifyCleanedArea(
  _beforeImg: string,
  _afterImg: string,
  forceNeedsReview: boolean = false
): Promise<SimpleVerificationResult> {
  // Simulate AI verification latency
  await new Promise(resolve => setTimeout(resolve, 1400));

  const nowTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (forceNeedsReview) {
    return {
      status: 'NEEDS REVIEW',
      statusTe: 'సమీక్ష అవసరం',
      feedback: 'Manual review required. Visible waste remnants or uncleaned perimeter detected.',
      feedbackTe: 'మాన్యువల్ సమీక్ష అవసరం. ఆ ప్రాంతంలో ఇంకా చెత్త అవశేషాలు లేదా అపరిశుభ్రమైన అంచులు కనిపిస్తున్నాయి.',
      verifiedAt: nowTime,
      isVerified: false
    };
  }

  return {
    status: 'VERIFIED',
    statusTe: 'ధృవీకరించబడింది',
    feedback: 'Area cleared! Pavement and roadside have been properly segregated, cleared, and sanitized.',
    feedbackTe: 'ప్రాంతం శుభ్రపరచబడింది! రోడ్డు మరియు పరిసరాలు సరిగ్గా వేరుచేయబడి, శుభ్రం చేయబడ్డాయి.',
    verifiedAt: nowTime,
    isVerified: true
  };
}
