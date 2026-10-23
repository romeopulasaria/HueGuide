import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { BeautyProfile, UserProfile } from '../types';
import { DEPTH_DEFAULT_SWATCHES } from '../utils/skinProfile';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sliders,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Edit3,
  UserCheck,
  ShieldAlert,
  IndianRupee,
} from 'lucide-react';

interface ScreenWelcomeProps {
  savedProfile: BeautyProfile | UserProfile | null;
  onCreateProfile: () => void;
  onStartDailyRequest: () => void;
  onEditProfile: () => void;
  onOpenPrivacy: () => void;
  onResetProfile: () => void;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({
  savedProfile,
  onCreateProfile,
  onStartDailyRequest,
  onEditProfile,
  onOpenPrivacy,
  onResetProfile,
}) => {
  const isReturningUser = !!savedProfile;

  // Resolve profile attributes safely whether structured as BeautyProfile or legacy UserProfile
  const skin = savedProfile?.skinProfile;
  const characteristics = savedProfile?.skinCharacteristics || {
    skinType: (savedProfile as any)?.preferences?.skinType || 'normal',
    sensitivity: (savedProfile as any)?.preferences?.sensitivity || 'no',
    concerns: (savedProfile as any)?.preferences?.concerns || [],
  };
  const ingredientExclusions = savedProfile?.ingredientPreferences?.allergies || (savedProfile as any)?.preferences?.allergies || [];
  const makeup = savedProfile?.makeupPreferences || {
    preferredFinish: (savedProfile as any)?.preferences?.preferredFinish || 'natural',
    preferredCoverage: (savedProfile as any)?.preferences?.preferredCoverage || 'medium',
    defaultBudgetOverall: (savedProfile as any)?.preferences?.budgetMaxOverall || APP_CONFIG.defaultBudgets.overallMax,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-fade-in">
      {/* Returning User View: Compact Beauty Profile Card */}
      {isReturningUser ? (
        <div className="max-w-2xl mx-auto mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold tracking-wide uppercase mb-4 shadow-sm border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            Beauty Profile Active
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-sand-950 mb-3">
            Welcome back to {APP_CONFIG.appName}
          </h1>
          <p className="text-sm sm:text-base text-sand-600 font-light mb-8">
            Your persistent beauty profile is loaded. Tell us what look or occasion you are shopping for today.
          </p>

          {/* Compact Beauty Profile Card */}
          <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-md text-left mb-8 hover:border-brand-300 transition-colors">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-sand-500">
                Your Saved Beauty Profile
              </span>
              <button
                onClick={onEditProfile}
                className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5 pb-5 border-b border-sand-100">
              <div
                className="w-16 h-16 rounded-2xl shadow-inner border border-sand-300 flex-shrink-0"
                style={{
                  backgroundColor:
                    skin?.estimatedHex ||
                    (skin?.depth && DEPTH_DEFAULT_SWATCHES[skin.depth]) ||
                    '#CAA075',
                }}
              />
              <div className="flex-grow">
                <div className="text-xl font-serif font-bold text-sand-950 capitalize">
                  {skin?.depth || 'Medium'} Depth • {skin?.undertone === 'uncertain' ? 'Undertone Not Specified' : `${skin?.undertone || 'Warm'} Undertone`}
                </div>
                <div className="text-xs text-sand-500 mt-0.5">
                  {skin?.source === 'user_declared' ? (
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md">
                        Source: Entered by you
                      </span>
                      {skin?.estimatedHex && (
                        <span className="font-mono text-sand-600 uppercase">
                          {skin.estimatedHex}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="font-mono uppercase">
                      {skin?.estimatedHex || '#CAA075'}
                      {skin?.isCalibrated ? ' • Calibrated Reference' : ' • Natural Lighting'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-sand-700 capitalize mt-1">
                  {characteristics.skinType} skin • {characteristics.sensitivity === 'yes' ? 'Sensitive' : 'Not sensitive'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-sand-700">
              <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-100">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Formulation</span>
                <span className="font-semibold capitalize text-sand-900">
                  {makeup.preferredFinish} finish
                </span>
                <span className="block text-[11px] text-sand-600 capitalize">
                  {makeup.preferredCoverage} coverage
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-100">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Default Budget</span>
                <div className="font-semibold text-brand-900 flex items-center gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>₹{makeup.defaultBudgetOverall.toLocaleString('en-IN')} max</span>
                </div>
                <span className="text-[11px] text-sand-500">Baseline price cap</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Exclusions</span>
                <div className="font-semibold text-rosewood-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rosewood-600" />
                  <span>{ingredientExclusions.length} excluded</span>
                </div>
                <span className="text-[11px] text-sand-500 truncate block">
                  {ingredientExclusions.length > 0 ? ingredientExclusions.slice(0, 2).join(', ') : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs for Returning User */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartDailyRequest}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-800 hover:bg-brand-900 text-sand-50 font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Find Makeup for Today</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onEditProfile}
              className="w-full sm:w-auto px-6 py-4 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-sand-800 font-semibold text-sm transition-colors"
            >
              Edit Beauty Profile
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={onResetProfile}
              className="text-xs text-sand-500 hover:text-rosewood-700 underline transition-colors"
            >
              Reset profile and start fresh
            </button>
          </div>
        </div>
      ) : (
        /* First-Time User View: Hero & Onboarding Pitch */
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Intelligent Beauty Guidance
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-sand-950 mb-6 leading-tight">
            Find makeup that works for you.
          </h1>
          <p className="text-lg sm:text-xl text-sand-700 font-light leading-relaxed mb-8">
            Personalized shade and product recommendations based on your complexion, preferences, and budget.
          </p>

          {/* Primary CTA for New User */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCreateProfile}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-800 hover:bg-brand-900 text-sand-50 font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Create my Beauty Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Privacy micro-banner */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-sand-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Photos never leave your device. 100% processed locally in your browser.</span>
            <button
              onClick={onOpenPrivacy}
              className="text-brand-700 underline font-medium hover:text-brand-900 ml-1"
            >
              Learn more
            </button>
          </div>
        </div>
      )}

      {/* 3 Core Pillars & How It Works (For New Visitors) */}
      {!isReturningUser && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5 text-brand-700" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-sand-950 mb-2">
                Local Colour Sampling
              </h3>
              <p className="text-sm text-sand-600 leading-relaxed">
                Our browser-based colour analysis samples pixel data from your cheek regions using median statistics to estimate depth and undertone without cloud uploads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sand-200 text-sand-800 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5 text-sand-700" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-sand-950 mb-2">
                Tailored Preferences
              </h3>
              <p className="text-sm text-sand-600 leading-relaxed">
                Input your skin type, desired finish, coverage, allergen exclusions, INR budget, and outfit colours. You control every preference.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rosewood-100 text-rosewood-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-rosewood-700" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-sand-950 mb-2">
                Explainable Matching
              </h3>
              <p className="text-sm text-sand-600 leading-relaxed">
                Every product recommendation is backed by transparent CIEDE2000 shade similarity scores, formula suitability reasons, and colour harmony logic.
              </p>
            </div>
          </div>

          {/* How It Works & Transparency Section */}
          <div className="p-8 rounded-3xl bg-sand-100/70 border border-sand-200/80 mb-12">
            <h2 className="font-serif text-2xl font-bold text-sand-950 mb-6 text-center">
              How {APP_CONFIG.appName} Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-sand-700">
              <div>
                <h4 className="font-semibold text-sand-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  How Photographs Are Processed
                </h4>
                <p className="text-sand-600 leading-relaxed text-xs">
                  When you upload a photograph, the image is loaded into an HTML5 Canvas completely in your browser's local memory. The pixels are linearized into sRGB, converted to CIE XYZ (D65 illuminant), and mapped into perceptual CIELAB space. We sample your left and right cheeks separately, reject glare and deep shadows, and compute robust medians.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sand-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  How Recommendations Are Generated
                </h4>
                <p className="text-sand-600 leading-relaxed text-xs">
                  Hard constraints (your INR budget limit and declared allergen exclusions) are enforced first. Candidate products are then ranked using CIEDE2000 colour difference (ΔE), finish preferences, skin type compatibility, and colour harmony with your outfit.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sand-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Limitations of Image-Based Analysis
                </h4>
                <p className="text-sand-600 leading-relaxed text-xs">
                  Ambient lighting, warm light bulbs, mobile camera processing, and screen brightness can alter digital colors. Recommendations are informed estimates to narrow down your options, not guaranteed laboratory shade matches. You can easily adjust your estimated undertone and depth at any time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sand-900 mb-2 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-brand-600" />
                  Not Medical or Dermatological Advice
                </h4>
                <p className="text-sand-600 leading-relaxed text-xs">
                  {APP_CONFIG.appName} is a cosmetic shade and product discovery prototype. It cannot and does not diagnose skin conditions (such as acne, rosacea, or eczema) or provide clinical skincare treatment advice.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
