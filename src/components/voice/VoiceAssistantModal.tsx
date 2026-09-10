import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { processCommand, getIntentResponse, getIntentAction } from '../../services/commandProcessor';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Square,
  Camera,
  RotateCcw,
  Check,
  Upload,
  SwitchCamera,
  AlertCircle
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: Date;
}

export type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasPhoto: boolean;
  hasLocation: boolean;
  photoUrl: string | null;
  locationName: string;
  onTriggerCamera: () => void;
  onPhotoCaptured: (dataUrl: string) => void;
  onTriggerDetectLocation: () => void;
  onSubmitReport: () => void;
  isSubmitting?: boolean;
}

// ─── Browser API Detection ───────────────────────────────────────────────────

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition
    : null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

let msgCounter = 0;
function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: `msg-${Date.now()}-${++msgCounter}`, role, text, timestamp: new Date() };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  hasPhoto,
  hasLocation,
  photoUrl,
  locationName,
  onTriggerCamera,
  onPhotoCaptured,
  onTriggerDetectLocation,
  onSubmitReport,
  isSubmitting = false
}) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // ── Chat State ──
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('READY');
  const [interimText, setInterimText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // ── Embedded Camera State ──
  const [showCamera, setShowCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // ── Refs ──
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const initializedRef = useRef(false);

  // ── Auto-scroll chat ──
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  // ── Add message helper ──
  const addMessage = useCallback((role: ChatMessage['role'], text: string) => {
    setMessages(prev => [...prev, createMessage(role, text)]);
    scrollToBottom();
  }, [scrollToBottom]);

  // ── TTS: Speak assistant message ──
  const speakMessage = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isTelugu ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const targetLang = isTelugu ? 'te' : 'en';
      const matched = voices.find(v => v.lang.startsWith(targetLang));
      if (matched) utterance.voice = matched;

      utterance.onstart = () => setVoiceState('SPEAKING');
      utterance.onend = () => setVoiceState('READY');
      utterance.onerror = () => setVoiceState('READY');

      window.speechSynthesis.speak(utterance);
    } catch {
      setVoiceState('READY');
    }
  }, [isMuted, isTelugu]);

  // ── Replay TTS for a specific message ──
  const replayMessage = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speakMessage(text);
  }, [speakMessage]);

  // ── Stop TTS ──
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('READY');
  }, []);

  // ── Camera Controls ──
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async (faceMode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(t('cameraError'));
      return;
    }

    try {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch { /* ignore */ }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: faceMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch {
      setCameraError(t('cameraError'));
      setCameraActive(false);
    }
  }, [facingMode, stopCameraStream, t]);

  const handleCaptureSnapshot = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCameraStream();
    }
  }, [stopCameraStream]);

  const handleUsePhoto = useCallback(() => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage);
      setShowCamera(false);
      setCapturedImage(null);
      addMessage('system', t('voicePhotoTaken'));
      const resp = isTelugu
        ? 'ఫోటో ఆమోదించబడింది! ఇప్పుడు మీ స్థానం అవసరం. గుర్తించమంటారా?'
        : 'Photo accepted! Now I need your location. Shall I detect it?';
      addMessage('assistant', resp);
      speakMessage(resp);
    }
  }, [capturedImage, onPhotoCaptured, addMessage, t, isTelugu, speakMessage]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera(facingMode);
  }, [facingMode, startCamera]);

  const handleFallbackUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgUrl = event.target.result as string;
          stopCameraStream();
          setCapturedImage(imgUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [stopCameraStream]);

  // ── Open camera within assistant ──
  const openEmbeddedCamera = useCallback(() => {
    setShowCamera(true);
    addMessage('system', t('voiceCameraOpened'));
    setTimeout(() => {
      startCamera(facingMode);
      scrollToBottom();
    }, 100);
  }, [addMessage, t, startCamera, facingMode, scrollToBottom]);

  // ── Core: Process user input (both voice and text) ──
  const handleUserInput = useCallback((rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    // Add user message to chat
    addMessage('user', text);

    // Process through command processor
    const intent = processCommand(text);
    const state = { hasPhoto, hasLocation, isTelugu };
    const response = getIntentResponse(intent, state);
    const action = getIntentAction(intent, { hasPhoto, hasLocation });

    // Add assistant response
    addMessage('assistant', response);
    speakMessage(response);

    // Execute the real application action
    setTimeout(() => {
      switch (action) {
        case 'OPEN_CAMERA':
          openEmbeddedCamera();
          break;
        case 'DETECT_LOCATION':
          addMessage('system', isTelugu ? '📍 స్థానం గుర్తిస్తోంది...' : '📍 Detecting location...');
          onTriggerDetectLocation();
          break;
        case 'SUBMIT':
          onSubmitReport();
          break;
        case 'CLOSE':
          onClose();
          break;
        case 'NONE':
        default:
          break;
      }
    }, 300);
  }, [hasPhoto, hasLocation, isTelugu, addMessage, speakMessage, openEmbeddedCamera, onTriggerDetectLocation, onSubmitReport, onClose]);

  // ── Speech Recognition ──
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    setVoiceState('READY');
    setInterimText('');
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      addMessage('system', isTelugu
        ? '⚠️ ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.'
        : '⚠️ Voice recognition is not available in this browser. Please type your message.');
      return;
    }

    stopListening();

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.lang = isTelugu ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setVoiceState('LISTENING');
        setInterimText('');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (finalTranscript) {
          setInterimText('');
          setVoiceState('PROCESSING');
          setTimeout(() => {
            handleUserInput(finalTranscript);
            setVoiceState('READY');
          }, 300);
        }
      };

      recognition.onerror = () => {
        setVoiceState('READY');
        setInterimText('');
      };

      recognition.onend = () => {
        if (voiceState !== 'PROCESSING') {
          setVoiceState('READY');
        }
        setInterimText('');
      };

      recognition.start();
    } catch {
      setVoiceState('READY');
    }
  }, [isTelugu, stopListening, handleUserInput, addMessage, voiceState]);

  const toggleListening = useCallback(() => {
    if (voiceState === 'LISTENING') {
      stopListening();
    } else {
      startListening();
    }
  }, [voiceState, stopListening, startListening]);

  // ── Handle text send ──
  const handleSendText = useCallback(() => {
    if (textInput.trim()) {
      handleUserInput(textInput);
      setTextInput('');
    }
  }, [textInput, handleUserInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  }, [handleSendText]);

  // ── Initialize welcome message ──
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializedRef.current = true;
      const welcome = t('voiceChatWelcome');
      setMessages([createMessage('assistant', welcome)]);
      speakMessage(welcome);
    }
  }, [isOpen, t, speakMessage]);

  // ── React to external state changes (location detected, photo taken externally) ──
  useEffect(() => {
    if (!isOpen || !initializedRef.current) return;
    if (hasLocation && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'system' && lastMsg.text.includes('📍') && lastMsg.text.includes('...')) {
        addMessage('system', t('voiceLocationDetectedSystem'));
        const resp = isTelugu
          ? 'స్థానం విజయవంతంగా గుర్తించబడింది! మీ రిపోర్ట్ సిద్ధంగా ఉంది. సమర్పించాలా?'
          : 'Location detected successfully! Your report is ready. Would you like to submit it?';
        addMessage('assistant', resp);
        speakMessage(resp);
      }
    }
  }, [hasLocation]);

  // ── Cleanup on unmount / close ──
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopListening();
      stopCameraStream();
    };
  }, [stopListening, stopCameraStream]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
      setMessages([]);
      setTextInput('');
      setInterimText('');
      setShowCamera(false);
      setCapturedImage(null);
      stopCameraStream();
      stopListening();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setVoiceState('READY');
    }
  }, [isOpen, stopCameraStream, stopListening]);

  if (!isOpen) return null;

  const isReadyToSubmit = hasPhoto && hasLocation;

  // ── Voice State Info ──
  const getVoiceStateLabel = () => {
    switch (voiceState) {
      case 'LISTENING': return `🎤 ${t('voiceListening')}`;
      case 'PROCESSING': return `🧠 ${t('voiceProcessing')}`;
      case 'SPEAKING': return `🔊 ${t('voiceSpeaking')}`;
      default: return `✓ ${t('voiceReady')}`;
    }
  };

  const getVoiceStateColor = () => {
    switch (voiceState) {
      case 'LISTENING': return 'bg-rose-500 text-white';
      case 'PROCESSING': return 'bg-amber-500 text-white';
      case 'SPEAKING': return 'bg-teal-500 text-white';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black tracking-wider uppercase text-white">
            {t('voiceAssistantTitle')}
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            ({isTelugu ? 'తెలుగు' : 'English'})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Voice state badge */}
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${getVoiceStateColor()} ${voiceState === 'LISTENING' ? 'animate-pulse' : ''}`}>
            {getVoiceStateLabel()}
          </span>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (next && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Chat Messages ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'system' ? (
              /* System message */
              <div className="mx-auto bg-slate-800/60 border border-slate-700 rounded-full px-4 py-1.5 text-[11px] text-slate-400 font-medium">
                {msg.text}
              </div>
            ) : msg.role === 'assistant' ? (
              /* Assistant message */
              <div className="max-w-[85%] flex items-start space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-slate-200 leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="flex items-center space-x-2 mt-1 pl-1">
                    <button
                      type="button"
                      onClick={() => replayMessage(msg.text)}
                      className="text-[10px] text-slate-500 hover:text-emerald-400 flex items-center space-x-1 transition-colors"
                      title={t('voiceReplaySpeech')}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t('voiceReplaySpeech')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* User message */
              <div className="max-w-[85%]">
                <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ─── Embedded Camera ─── */}
        {showCamera && !hasPhoto && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera viewfinder */}
            <div className="relative bg-black min-h-[240px] sm:min-h-[300px] flex items-center justify-center">
              {cameraActive && (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover max-h-[300px]"
                />
              )}

              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain max-h-[300px]"
                />
              )}

              {!cameraActive && !capturedImage && (
                <div className="p-6 text-center text-slate-400 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-xs text-amber-200">
                    {cameraError || t('cameraPermissionDesc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    {t('btnOpenCamera')}
                  </button>
                </div>
              )}

              {cameraActive && (
                <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-full text-[10px] text-white/80 font-mono backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE</span>
                </div>
              )}
            </div>

            {/* Camera controls */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-center space-x-3">
              {cameraActive && (
                <>
                  {hasMultipleCameras && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = facingMode === 'environment' ? 'user' : 'environment';
                        setFacingMode(next);
                        startCamera(next);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <SwitchCamera className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="w-14 h-14 rounded-full bg-white text-slate-900 border-4 border-emerald-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                  <label className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    <input type="file" accept="image/*" capture="environment" onChange={handleFallbackUpload} className="hidden" />
                  </label>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('btnRetakePhoto')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUsePhoto}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('btnUsePhoto')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── Submit Button (visible when ready) ─── */}
        {isReadyToSubmit && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                addMessage('system', isTelugu ? '🚀 రిపోర్ట్ సమర్పిస్తోంది...' : '🚀 Submitting report...');
                onSubmitReport();
                setTimeout(() => {
                  addMessage('assistant', t('voiceReportSubmitted'));
                  speakMessage(t('voiceReportSubmitted'));
                }, 1500);
              }}
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 text-base disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? t('btnSubmitting') : `🚀 ${t('btnSubmitReport')}`}</span>
            </button>
          </div>
        )}

        {/* Interim (live) transcription text */}
        {interimText && (
          <div className="flex justify-end">
            <div className="max-w-[85%] bg-emerald-600/30 border border-emerald-500/30 text-emerald-200 rounded-2xl rounded-tr-md px-4 py-2 text-sm italic animate-pulse">
              {interimText}
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* ─── Voice State Bar (when listening/speaking) ─── */}
      {(voiceState === 'LISTENING' || voiceState === 'SPEAKING') && (
        <div className={`px-4 py-2 flex items-center justify-between ${voiceState === 'LISTENING' ? 'bg-rose-950/50 border-t border-rose-800/50' : 'bg-teal-950/50 border-t border-teal-800/50'}`}>
          <span className={`text-xs font-bold ${voiceState === 'LISTENING' ? 'text-rose-300' : 'text-teal-300'}`}>
            {getVoiceStateLabel()}
          </span>
          <button
            type="button"
            onClick={voiceState === 'LISTENING' ? stopListening : stopSpeaking}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${voiceState === 'LISTENING' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
          >
            <Square className="w-3 h-3" />
            <span>{voiceState === 'LISTENING' ? t('voiceStopListening') : t('voiceStopSpeaking')}</span>
          </button>
        </div>
      )}

      {/* ─── Input Bar ─── */}
      <div className="px-3 py-3 bg-slate-900 border-t border-slate-800 flex-shrink-0">
        <div className="flex items-center space-x-2 max-w-xl mx-auto">
          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('voiceChatPlaceholder')}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />

          {/* Mic button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all flex-shrink-0 ${
              voiceState === 'LISTENING'
                ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400/50 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title={voiceState === 'LISTENING' ? t('voiceStopListening') : t('voiceBtn')}
          >
            {voiceState === 'LISTENING' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSendText}
            disabled={!textInput.trim()}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            title={t('voiceChatSend')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Tip text */}
        <p className="text-[10px] text-center text-slate-500 mt-2">
          {t('voiceChatWelcomeTip')}
        </p>
      </div>
    </div>
  );
};
