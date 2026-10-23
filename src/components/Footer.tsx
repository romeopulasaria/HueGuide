import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { ShieldCheck, Info, AlertCircle, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="mt-20 border-t border-sand-200 bg-sand-100/50 py-12 text-sand-700 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="font-serif text-xl font-bold text-sand-950 mb-2">
              {APP_CONFIG.appName}
            </div>
            <p className="text-xs text-sand-600 leading-relaxed mb-4">
              {APP_CONFIG.tagline}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Browser-local processing</span>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              How It Works
            </h4>
            <ul className="space-y-2 text-xs text-sand-600">
              <li>1. Upload natural light photo or select manual complexion</li>
              <li>2. Real-time canvas pixel sampling & CIELAB conversion</li>
              <li>3. Multi-factor shade matching using CIEDE2000 & harmonies</li>
              <li>4. Filtered by strict INR budget & ingredient exclusions</li>
            </ul>
          </div>

          {/* Privacy & Image Processing */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              Privacy Guarantees
            </h4>
            <p className="text-xs text-sand-600 leading-relaxed mb-2">
              Facial photographs are processed entirely inside your device's browser memory via Canvas API. No images are transmitted to external servers or cloud APIs.
            </p>
            <button
              onClick={onOpenPrivacy}
              className="text-xs text-brand-700 underline hover:text-brand-900 font-medium"
            >
              Read full privacy policy & data controls
            </button>
          </div>

          {/* Scientific Limitations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-600" />
              Limitations & Estimates
            </h4>
            <p className="text-xs text-sand-600 leading-relaxed">
              Image-derived colour measurements are approximations. Screen calibration, device white-balance, camera sensors, and formula oxidation affect real-world appearance.
            </p>
          </div>
        </div>

        {/* Legal & Medical Disclaimers Banner */}
        <div className="p-4 rounded-xl bg-sand-200/60 border border-sand-300/60 text-xs text-sand-600 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sand-800">Medical & Ingredient Disclaimer: </span>
              {APP_CONFIG.disclaimers.medical} {APP_CONFIG.disclaimers.demonstrationData}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-500">
          <div>
            © {new Date().getFullYear()} {APP_CONFIG.appName}. Educational & Prototype Implementation.
          </div>
          <div className="flex items-center gap-4">
            <span>Prices in Indian Rupees (₹ INR)</span>
            <span>•</span>
            <span>Version {APP_CONFIG.version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
