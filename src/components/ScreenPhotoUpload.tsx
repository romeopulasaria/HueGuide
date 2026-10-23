import React, { useRef, useState } from 'react';
import {
  Camera,
  X,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

interface ScreenPhotoUploadProps {
  photos: { id: string; url: string; file: File; name: string }[];
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (id: string) => void;
  onAnalyze: () => void;
  onSkipToManual: () => void;
  onBack: () => void;
}

export const ScreenPhotoUpload: React.FC<ScreenPhotoUploadProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onAnalyze,
  onSkipToManual,
  onBack,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 3) {
      setErrorMessage('You can upload a maximum of 3 photographs.');
      return;
    }

    const file = files[0];
    validateAndAddFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndAddFile = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(`Unsupported format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WebP photograph.`);
      return;
    }

    // Validate size (10 MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(`The photograph is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please choose an image under 10 MB.`);
      return;
    }

    onAddPhoto(file);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mb-2">
          Upload Your Photograph
        </h2>
        <p className="text-sm text-sand-600">
          Upload 1 to 3 well-lit photographs for browser-based colour analysis, or enter your complexion manually.
        </p>
      </div>

      {/* Privacy guarantee reminder */}
      <div className="mb-6 p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Local Processing Only: </span>
          Your photographs are never sent over the internet or saved to external servers. Pixel sampling is performed directly within your browser via Canvas.
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-grow">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Box / Previews */}
      <div className="mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative rounded-2xl overflow-hidden border border-sand-300 bg-sand-100 aspect-[3/4] shadow-sm group"
            >
              <img
                src={photo.url}
                alt={`Uploaded face preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Photo {index + 1}
                  </span>
                  <button
                    onClick={() => onRemovePhoto(photo.id)}
                    className="w-7 h-7 rounded-full bg-black/60 hover:bg-rosewood-700 text-white flex items-center justify-center transition-colors shadow"
                    title="Remove photograph"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[11px] text-white/90 truncate font-mono">
                  {photo.name}
                </div>
              </div>
            </div>
          ))}

          {/* Add Photo Button Slot */}
          {photos.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sand-300 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/60 hover:bg-brand-50/40 transition-all aspect-[3/4]"
            >
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-brand-700" />
              </div>
              <span className="text-xs font-semibold text-sand-900 mb-1">
                {photos.length === 0 ? 'Upload Photograph' : 'Add Another Photo'}
              </span>
              <span className="text-[11px] text-sand-500 leading-tight">
                JPEG, PNG, or WebP up to 10MB
              </span>
              <span className="mt-3 text-[11px] text-brand-700 font-medium">
                {photos.length} of 3 uploaded
              </span>
            </button>
          )}
        </div>

        {/* Explain multi-photo purpose */}
        <p className="text-xs text-sand-500 italic text-center sm:text-left">
          Note: Multiple photographs assess consistency under natural lighting variations. We do not blindly average photographs with conflicting illuminations.
        </p>
      </div>

      {/* Practical Capture Instructions Checklist */}
      <div className="p-5 rounded-2xl bg-white border border-sand-200 mb-8 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Recommended Capture Guidelines
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-sand-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Face a window with soft, indirect daylight</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Avoid warm incandescent, yellow, or coloured lamps</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Disable beauty filters, smoothing, and HDR effects</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Keep your cheeks and face unobstructed by hair</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Prefer clean skin without foundation for shade matching</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Avoid harsh overhead sunlight or extreme shadows</span>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2 text-sand-600 bg-sand-50 p-2 rounded-lg">
            <Info className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
            <span>Optional: Hold a clean white paper or 18% neutral grey card beside your collarbone to enable white-balance calibration.</span>
          </div>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-sand-200 mt-8">
        <button
          onClick={onBack}
          className="order-last sm:order-first px-5 py-2.5 rounded-full border border-sand-300 text-sand-700 hover:bg-sand-100 text-sm font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSkipToManual}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-sand-700 font-medium text-sm transition-colors"
          >
            Enter complexion manually
          </button>

          {photos.length > 0 && (
            <button
              type="button"
              onClick={onAnalyze}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyse Complexion</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
