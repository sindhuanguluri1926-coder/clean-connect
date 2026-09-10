import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Camera,
  RotateCcw,
  Check,
  AlertCircle,
  SwitchCamera,
  X,
  Upload
} from 'lucide-react';

interface CameraCaptureProps {
  onPhotoSelected: (imageDataUrl: string) => void;
  onClose?: () => void;
  currentImage?: string | null;
  mode?: 'citizen' | 'worker';
  title?: string;
  subtitle?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoSelected,
  onClose,
  currentImage = null,
  mode = 'citizen',
  title
}) => {
  const { t } = useLanguage();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(currentImage);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Stop camera media tracks cleanly
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start the live camera stream
  const startCamera = async (faceMode: 'environment' | 'user' = facingMode) => {
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
      } catch {
        // Ignore
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: faceMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setCapturedImage(null);
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      setCameraError(t('cameraError'));
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snapshot frame onto canvas and generate JPEG
  const handleCaptureSnapshot = () => {
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
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoSelected(capturedImage);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleFallbackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold tracking-wide">
              {capturedImage ? t('photoPreviewTitle') : (title || t('cameraTitle'))}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {hasMultipleCameras && isCameraActive && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title={t('btnSwitchCamera')}
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Viewfinder / Captured Photo Display */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[420px]">
          <canvas ref={canvasRef} className="hidden" />

          {/* Live Camera Feed */}
          {isCameraActive && (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Captured Static Photo Preview */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured Waste"
              className="w-full h-full object-contain"
            />
          )}

          {/* Camera Error / Permission */}
          {!isCameraActive && !capturedImage && (
            <div className="p-8 text-center text-slate-400 space-y-4 max-w-xs mx-auto">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-amber-200">
                {cameraError || t('cameraPermissionDesc')}
              </p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                {t('btnOpenCamera')}
              </button>
            </div>
          )}

          {/* Live Viewfinder Frame Overlay */}
          {isCameraActive && (
            <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                <span className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE</span>
                </span>
                <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-xs">
                  SWACHH-AI VISION
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col items-center justify-center space-y-3">
          {/* If Live: Large Shutter Button */}
          {isCameraActive && (
            <div className="flex items-center justify-center w-full py-2">
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="w-18 h-18 rounded-full bg-white text-slate-900 border-4 border-emerald-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                title={t('btnCapturePhoto')}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>
            </div>
          )}

          {/* If Captured: Retake vs Use Photo */}
          {capturedImage && (
            <div className="flex items-center justify-center space-x-3 w-full max-w-sm">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('btnRetakePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={handleUsePhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{t('btnUsePhoto')}</span>
              </button>
            </div>
          )}

          {/* Fallback Option */}
          <div className="pt-1 flex items-center justify-between w-full text-[11px] text-slate-400 px-2">
            <span>{capturedImage ? t('photoCapturedBadge') : t('cameraSubtitle')}</span>
            <label className="cursor-pointer hover:text-emerald-400 flex items-center space-x-1 transition-colors">
              <Upload className="w-3 h-3" />
              <span>{t('cameraFallback')}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFallbackUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
