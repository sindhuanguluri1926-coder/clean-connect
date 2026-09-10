import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';

export type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export type ReportingStep =
  | 'idle'
  | 'need_photo'
  | 'photo_taken'
  | 'location_detected'
  | 'submitting'
  | 'submitted';

interface VoiceAssistantProps {
  step: ReportingStep;
  onVoiceCommand?: (command: string) => void;
}

// Check for Web Speech API Support
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    : null;

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  step,
  onVoiceCommand
}) => {
  const { language, t } = useLanguage();

  const [voiceState, setVoiceState] = useState<VoiceState>('READY');
  const [spokenText, setSpokenText] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Get current guidance prompt based on step and language
  const getStepPrompt = (currentStep: ReportingStep): string => {
    switch (currentStep) {
      case 'need_photo':
      case 'idle':
        return t('voicePromptCapture');
      case 'photo_taken':
        return t('voicePromptCaptured');
      case 'location_detected':
        return t('voicePromptLocationDetected');
      case 'submitting':
        return t('voicePromptSubmitting');
      case 'submitted':
        return t('voicePromptSubmitted');
      default:
        return t('voicePromptCapture');
    }
  };

  // Speak message using browser SpeechSynthesis API
  const speakMessage = (text: string) => {
    if (isAudioMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      setSpokenText(text);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any previous utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95; // Clear and intelligible pace

      // Attempt to pick matching voice
      const voices = window.speechSynthesis.getVoices();
      const targetLang = language === 'te' ? 'te' : 'en';
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setVoiceState('SPEAKING');
      };

      utterance.onend = () => {
        setVoiceState('READY');
      };

      utterance.onerror = () => {
        setVoiceState('READY');
      };

      setSpokenText(text);
      window.speechSynthesis.speak(utterance);
    } catch {
      setVoiceState('READY');
      setSpokenText(text);
    }
  };

  // Whenever the reporting step changes, announce the step guidance
  useEffect(() => {
    const prompt = getStepPrompt(step);
    speakMessage(prompt);
  }, [step, language]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Toggle voice recognition listening
  const toggleListening = () => {
    if (voiceState === 'LISTENING') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceState('READY');
      return;
    }

    if (!SpeechRecognitionAPI) {
      // Fallback if browser doesn't support recognition: re-read prompt
      const prompt = getStepPrompt(step);
      speakMessage(prompt);
      return;
    }

    try {
      const recognition = new (SpeechRecognitionAPI as any)();
      recognitionRef.current = recognition;
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceState('LISTENING');
      };

      recognition.onresult = (event: any) => {
        setVoiceState('PROCESSING');
        const transcript = event.results[0][0].transcript.toLowerCase();
        setSpokenText(`"${transcript}"`);

        // Check for simple trigger phrases
        if (onVoiceCommand) {
          onVoiceCommand(transcript);
        }

        setTimeout(() => {
          setVoiceState('READY');
        }, 1000);
      };

      recognition.onerror = () => {
        setVoiceState('READY');
      };

      recognition.onend = () => {
        if (voiceState !== 'PROCESSING') {
          setVoiceState('READY');
        }
      };

      recognition.start();
    } catch {
      setVoiceState('READY');
    }
  };

  const getStatusBadgeColor = () => {
    switch (voiceState) {
      case 'LISTENING':
        return 'bg-rose-500 text-white animate-pulse';
      case 'PROCESSING':
        return 'bg-amber-500 text-white animate-pulse';
      case 'SPEAKING':
        return 'bg-emerald-500 text-white';
      case 'READY':
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>{t('voiceAssistantTitle')}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({language === 'te' ? 'తెలుగు' : 'English'})
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {t('voiceHelperTooltip')}
            </p>
          </div>
        </div>

        {/* State Badge & Mute Toggle */}
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadgeColor()}`}>
            {voiceState === 'LISTENING' && t('voiceListening')}
            {voiceState === 'PROCESSING' && t('voiceProcessing')}
            {voiceState === 'SPEAKING' && t('voiceSpeaking')}
            {voiceState === 'READY' && t('voiceReady')}
          </span>

          <button
            type="button"
            onClick={() => {
              const nextMute = !isAudioMuted;
              setIsAudioMuted(nextMute);
              if (nextMute && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Voice Prompt Text Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-ping" />
          <p className="text-xs font-medium text-emerald-300 truncate">
            {spokenText || getStepPrompt(step)}
          </p>
        </div>

        {/* Mic Action Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
            voiceState === 'LISTENING'
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/50 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {voiceState === 'LISTENING' ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>{t('voiceListening')}</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>{t('voiceBtn')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
