import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { X, ShieldCheck, Lock, EyeOff, ServerOff, Database, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-sand-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif text-2xl font-bold text-sand-950">
              Privacy Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-200 text-sand-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-sand-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5 text-sm">
              <Lock className="w-4 h-4 text-emerald-700" />
              100% Client-Side Privacy Guarantee
            </div>
            <p className="text-emerald-900 text-xs">
              {APP_CONFIG.appName} is engineered with privacy as a foundational principle. Your facial photographs never touch a backend server or third-party cloud service.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-sand-50 border border-sand-200">
              <ServerOff className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sand-900 block mb-0.5">
                  No Remote Server Uploads
                </span>
                Photographs uploaded to the application are loaded into an HTML5 Canvas completely in local browser RAM. No HTTP multipart forms, base64 payloads, or binary streams are sent across the network.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sand-50 border border-sand-200">
              <EyeOff className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sand-900 block mb-0.5">
                  Transient Memory Lifetime
                </span>
                Photographs exist solely as temporary Blob Object URLs in JavaScript memory. Closing the tab, refreshing the browser, or clicking "Clear Photographs" immediately releases the image from RAM.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sand-50 border border-sand-200">
              <Database className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sand-900 block mb-0.5">
                  Explicit Local Storage Only
                </span>
                Only non-image configuration data (such as your estimated CIELAB numbers, skin depth label, allergen exclusions, and favourites) is stored in your device's browser `localStorage`, which you can wipe at any time.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sand-50 border border-sand-200">
              <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sand-900 block mb-0.5">
                  Zero Third-Party Trackers
                </span>
                We do not include facial recognition trackers, advertising SDKs, marketing telemetry, or telemetry cookies that capture personal beauty profile information.
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-sand-500 italic">
            You may also skip photograph upload entirely and complete your profile manually with the same rich recommendation experience.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sand-200 bg-sand-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
