/**
 * Command Processor — Central intent matching engine for Voice Assistant.
 * 
 * Both voice input (speech-to-text) and typed text are funneled through
 * processCommand(). It identifies simple intents using keyword/phrase matching
 * and returns the matched intent so the UI layer can execute the appropriate action.
 * 
 * Supports English and Telugu.
 */

export type AssistantIntent =
  | 'REPORT_WASTE'
  | 'OPEN_CAMERA'
  | 'CAPTURE_PHOTO'
  | 'USE_PHOTO'
  | 'RETAKE_PHOTO'
  | 'DETECT_LOCATION'
  | 'SUBMIT_REPORT'
  | 'CANCEL'
  | 'HELP'
  | 'YES'
  | 'NO'
  | 'UNKNOWN';

interface IntentPattern {
  intent: AssistantIntent;
  keywords: string[];
}

/**
 * Ordered intent patterns. More specific patterns come first to avoid
 * false matches (e.g., "retake photo" should match RETAKE_PHOTO before OPEN_CAMERA).
 */
const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'SUBMIT_REPORT',
    keywords: [
      // English
      'submit report', 'submit', 'send report', 'send it', 'send this',
      'submit this', 'file report', 'submit now',
      // Telugu
      'సమర్పించు', 'సమర్పించండి', 'పంపు', 'పంపండి', 'రిపోర్ట్ పంపండి',
      'రిపోర్ట్ సమర్పించండి', 'పంపించండి'
    ]
  },
  {
    intent: 'RETAKE_PHOTO',
    keywords: [
      // English
      'retake', 'take again', 'retake photo', 'another photo', 'reshoot',
      'no retake', 'try again', 'take new photo',
      // Telugu
      'మళ్లీ తీయండి', 'మళ్ళీ', 'కొత్త ఫోటో', 'మళ్లీ ఫోటో'
    ]
  },
  {
    intent: 'USE_PHOTO',
    keywords: [
      // English
      'use photo', 'use this photo', 'use it', 'use this', 'accept photo',
      'photo is good', 'looks good', 'keep it', 'keep photo', 'this is fine',
      // Telugu
      'ఈ ఫోటోను ఉపయోగించండి', 'ఫోటోను ఉపయోగించండి', 'ఉపయోగించు',
      'ఉపయోగించండి', 'ఫోటో బాగుంది'
    ]
  },
  {
    intent: 'CAPTURE_PHOTO',
    keywords: [
      // English
      'capture', 'take photo', 'snap', 'click photo', 'shoot',
      // Telugu
      'ఫోటో తీయండి', 'క్లిక్ చేయండి'
    ]
  },
  {
    intent: 'REPORT_WASTE',
    keywords: [
      // English
      'report waste', 'report garbage', 'report trash', 'report dumping',
      'i want to report', 'there is garbage', 'there is waste', 'there is trash',
      'garbage here', 'waste here', 'complain about waste', 'complain about garbage',
      'file a complaint', 'please report', 'report this',
      // Telugu
      'చెత్తను నివేదించండి', 'చెత్తను నివేదించాలి', 'ఇక్కడ చెత్త ఉంది',
      'చెత్త నివేదించు', 'నివేదించండి', 'నివేదించాలి', 'చెత్త ఉంది',
      'గార్బేజ్ ఉంది', 'వేస్ట్ ఉంది'
    ]
  },
  {
    intent: 'OPEN_CAMERA',
    keywords: [
      // English
      'open camera', 'camera', 'photo', 'take a photo', 'photograph',
      'open the camera', 'start camera', 'launch camera',
      // Telugu
      'కెమెరా తెరవండి', 'కెమెరా', 'ఫోటో తీయాలి'
    ]
  },
  {
    intent: 'DETECT_LOCATION',
    keywords: [
      // English
      'detect location', 'find my location', 'get location', 'find location',
      'detect my location', 'location', 'gps', 'where am i',
      'get my location', 'my location',
      // Telugu
      'నా స్థానాన్ని గుర్తించండి', 'స్థానాన్ని గుర్తించండి', 'స్థానం గుర్తించు',
      'స్థానం', 'గుర్తించండి', 'లొకేషన్'
    ]
  },
  {
    intent: 'HELP',
    keywords: [
      // English
      'help', 'what can i do', 'what can you do', 'commands', 'options',
      'how to report', 'how does this work', 'guide me',
      // Telugu
      'సహాయం', 'ఏమి చేయాలి', 'ఎలా చేయాలి', 'సూచనలు'
    ]
  },
  {
    intent: 'CANCEL',
    keywords: [
      // English
      'cancel', 'close', 'stop', 'exit', 'quit', 'never mind', 'go back',
      // Telugu
      'రద్దు', 'మూసివేయి', 'మూసివేయండి', 'ఆపండి', 'వెనక్కి'
    ]
  },
  {
    intent: 'YES',
    keywords: [
      // English
      'yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'confirm', 'go ahead',
      'do it', 'proceed', 'alright', 'of course', 'definitely',
      // Telugu
      'అవును', 'సరే', 'ఒకే', 'అలాగే', 'చేయండి', 'ముందుకు'
    ]
  },
  {
    intent: 'NO',
    keywords: [
      // English
      'no', 'nope', 'not now', 'don\'t', 'nah', 'negative', 'not yet',
      // Telugu
      'లేదు', 'వద్దు', 'ఇప్పుడు కాదు', 'వద్దు'
    ]
  }
];

/**
 * Match user input text against known intent patterns.
 * Uses case-insensitive substring matching — no NLP needed.
 */
export function processCommand(rawInput: string): AssistantIntent {
  const input = rawInput.trim().toLowerCase();

  if (!input) return 'UNKNOWN';

  // Try each pattern in priority order
  for (const pattern of INTENT_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        return pattern.intent;
      }
    }
  }

  return 'UNKNOWN';
}

/**
 * Get the assistant's response message for a given intent and reporting state.
 */
export function getIntentResponse(
  intent: AssistantIntent,
  state: {
    hasPhoto: boolean;
    hasLocation: boolean;
    isTelugu: boolean;
    pendingAction?: string;
  }
): string {
  const { hasPhoto, hasLocation, isTelugu } = state;

  switch (intent) {
    case 'REPORT_WASTE':
    case 'OPEN_CAMERA':
      if (hasPhoto) {
        return isTelugu
          ? 'మీ ఫోటో ఇప్పటికే ఉంది. మళ్లీ తీయాలా లేదా రిపోర్ట్ కొనసాగించాలా?'
          : 'You already have a photo. Would you like to retake it, or continue with the report?';
      }
      return isTelugu
        ? 'సరే. కెమెరా తెరుస్తున్నాను. దయచేసి చెత్త యొక్క ఫోటో తీయండి.'
        : 'Sure! Opening the camera. Please capture a photo of the waste.';

    case 'CAPTURE_PHOTO':
      return isTelugu
        ? 'ఫోటో తీస్తున్నాను...'
        : 'Capturing photo...';

    case 'USE_PHOTO':
      return isTelugu
        ? 'ఫోటో ఆమోదించబడింది! ఇప్పుడు మీ స్థానాన్ని గుర్తించాలి. గుర్తించమంటారా?'
        : 'Photo accepted! Now I need your location. Shall I detect it?';

    case 'RETAKE_PHOTO':
      return isTelugu
        ? 'సరే, కెమెరా మళ్లీ తెరుస్తున్నాను. కొత్త ఫోటో తీయండి.'
        : 'Alright, reopening the camera. Please take a new photo.';

    case 'DETECT_LOCATION':
      return isTelugu
        ? 'మీ ప్రస్తుత స్థానాన్ని గుర్తిస్తున్నాను...'
        : 'Detecting your current location...';

    case 'SUBMIT_REPORT':
      if (!hasPhoto && !hasLocation) {
        return isTelugu
          ? 'రిపోర్ట్ పంపడానికి ఫోటో మరియు స్థానం రెండూ అవసరం. ముందుగా ఫోటో తీద్దామా?'
          : 'I need both a photo and your location to submit. Let\'s start by taking a photo.';
      }
      if (!hasPhoto) {
        return isTelugu
          ? 'రిపోర్ట్ పంపడానికి ముందు ఫోటో అవసరం. కెమెరా తెరవమంటారా?'
          : 'I still need a photo before submitting. Would you like to open the camera?';
      }
      if (!hasLocation) {
        return isTelugu
          ? 'రిపోర్ట్ పంపడానికి ముందు స్థానం అవసరం. స్థానం గుర్తించమంటారా?'
          : 'I still need your location before submitting. Shall I detect it?';
      }
      return isTelugu
        ? 'మీ వ్యర్థాల నివేదిక SWACHH-AI కి సమర్పిస్తున్నాను...'
        : 'Submitting your waste report to SWACHH-AI...';

    case 'YES':
      // Context-sensitive YES
      if (!hasPhoto) {
        return isTelugu
          ? 'సరే. కెమెరా తెరుస్తున్నాను.'
          : 'Sure! Opening the camera.';
      }
      if (!hasLocation) {
        return isTelugu
          ? 'మీ స్థానాన్ని గుర్తిస్తున్నాను...'
          : 'Detecting your location...';
      }
      return isTelugu
        ? 'మీ రిపోర్ట్ సమర్పిస్తున్నాను...'
        : 'Submitting your report...';

    case 'NO':
      return isTelugu
        ? 'సరే. మీకు ఎప్పుడు సిద్ధమైనప్పుడు చెప్పండి.'
        : 'Okay. Just let me know when you\'re ready.';

    case 'CANCEL':
      return isTelugu
        ? 'రద్దు చేస్తున్నాను. మీకు సహాయం కావాలంటే మళ్లీ తెరవండి.'
        : 'Closing the assistant. Open it again if you need help.';

    case 'HELP':
      return isTelugu
        ? 'నేను మీకు చెత్త రిపోర్ట్ చేయడంలో సహాయపడగలను. ఇలా చెప్పండి: "చెత్తను నివేదించండి", "ఫోటో తీయండి", "స్థానం గుర్తించండి", లేదా "రిపోర్ట్ పంపండి".'
        : 'I can help you report waste. Try: "Report waste", "Take a photo", "Detect location", or "Submit report".';

    case 'UNKNOWN':
    default:
      return isTelugu
        ? 'క్షమించండి, అర్థం కాలేదు. "చెత్తను నివేదించండి" లేదా "ఫోటో తీయండి" అని చెప్పండి. మీరు టైప్ కూడా చేయవచ్చు.'
        : 'I didn\'t quite understand that. Try "report waste" or "take a photo". You can also type your message.';
  }
}

/**
 * Determine the real application action that should follow an intent,
 * given the current reporting state.
 */
export function getIntentAction(
  intent: AssistantIntent,
  state: { hasPhoto: boolean; hasLocation: boolean }
): 'OPEN_CAMERA' | 'DETECT_LOCATION' | 'SUBMIT' | 'CLOSE' | 'NONE' {
  const { hasPhoto, hasLocation } = state;

  switch (intent) {
    case 'REPORT_WASTE':
    case 'OPEN_CAMERA':
      return 'OPEN_CAMERA';

    case 'RETAKE_PHOTO':
      return 'OPEN_CAMERA';

    case 'CAPTURE_PHOTO':
      return 'NONE'; // Camera UI handles this internally

    case 'USE_PHOTO':
      // After using photo, auto-detect location if not yet done
      if (!hasLocation) return 'DETECT_LOCATION';
      return 'NONE';

    case 'DETECT_LOCATION':
      return 'DETECT_LOCATION';

    case 'SUBMIT_REPORT':
      if (hasPhoto && hasLocation) return 'SUBMIT';
      if (!hasPhoto) return 'OPEN_CAMERA';
      if (!hasLocation) return 'DETECT_LOCATION';
      return 'NONE';

    case 'YES':
      // Context-aware YES
      if (!hasPhoto) return 'OPEN_CAMERA';
      if (!hasLocation) return 'DETECT_LOCATION';
      if (hasPhoto && hasLocation) return 'SUBMIT';
      return 'NONE';

    case 'CANCEL':
      return 'CLOSE';

    case 'NO':
    case 'HELP':
    case 'UNKNOWN':
    default:
      return 'NONE';
  }
}
