import React from 'react';
import { UserProfile } from '../types';
import {
  ArrowRight,
  ArrowLeft,
  Edit2,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  Sliders,
} from 'lucide-react';

interface ScreenSummaryProps {
  profile: UserProfile;
  onEditSection: (section: 'complexion' | 'skin' | 'preferences') => void;
  onConfirmProfile: () => void;
  onBack: () => void;
}

export const ScreenSummary: React.FC<ScreenSummaryProps> = ({
  profile,
  onEditSection,
  onConfirmProfile,
  onBack,
}) => {
  const { skinProfile, preferences } = profile;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-semibold tracking-wider uppercase text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full">
          Confirm Beauty Profile
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mt-3 mb-2">
          Your Beauty Profile
        </h2>
        <p className="text-sm text-sand-600">
          This profile represents who you are and persists across sessions. You can edit it at any time.
        </p>
      </div>

      <div className="space-y-6">
        {/* Card 1: Complexion Profile */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm relative">
          <div className="flex items-center justify-between mb-4 border-b border-sand-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-sand-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-700" />
              Complexion Profile
            </h3>
            <button
              onClick={() => onEditSection('complexion')}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Complexion</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl shadow-inner border border-sand-300 flex-shrink-0"
                style={{ backgroundColor: skinProfile.estimatedHex || '#CAA075' }}
              />
              <div>
                <div className="text-xl font-serif font-bold text-sand-950 capitalize">
                  {skinProfile.depth} Depth
                </div>
                <div className="text-sm font-semibold text-brand-800 capitalize mt-0.5">
                  {skinProfile.undertone === 'uncertain'
                    ? 'Undertone: Not specified'
                    : `${skinProfile.undertone} Undertone`}
                </div>
                {skinProfile.estimatedHex ? (
                  <div className="text-xs font-mono text-sand-500 uppercase mt-1">
                    {skinProfile.estimatedHex}
                    {skinProfile.colourSource === 'user_selected' && ' • User selected'}
                  </div>
                ) : (
                  <div className="text-xs text-sand-500 mt-1">
                    Tone entered by selection
                  </div>
                )}
                {skinProfile.source === 'photo_analysis' && skinProfile.estimatedLab && (
                  <div className="text-[11px] text-sand-500 mt-0.5">
                    L*: {skinProfile.estimatedLab.L.toFixed(1)} • a*: {skinProfile.estimatedLab.a.toFixed(1)} • b*: {skinProfile.estimatedLab.b.toFixed(1)}
                  </div>
                )}
              </div>
            </div>

            {skinProfile.source === 'user_declared' ? (
              /* User Declared Provenance Display */
              <div className="bg-sand-50 p-4 rounded-xl text-xs space-y-2 border border-sand-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-sand-600 font-medium">Source:</span>
                  <span className="font-semibold text-brand-900 bg-brand-100/80 px-2.5 py-0.5 rounded-full text-[11px]">
                    Entered by you
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Depth Selection:</span>
                  <span className="font-semibold text-sand-900 capitalize">
                    {skinProfile.depth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Undertone Selection:</span>
                  <span className="font-semibold text-sand-900 capitalize">
                    {skinProfile.undertone === 'uncertain' ? 'Not sure (balanced matching)' : skinProfile.undertone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Colour Precision:</span>
                  <span className="font-medium text-sand-800">
                    {skinProfile.colourSource === 'user_selected'
                      ? 'Approximate user swatch'
                      : 'Standard category match'}
                  </span>
                </div>
              </div>
            ) : (
              /* Photo Analysis Provenance Display */
              <div className="bg-sand-50 p-4 rounded-xl text-xs space-y-2 border border-sand-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-sand-600 font-medium">Source:</span>
                  <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-[11px]">
                    Photo analysis
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Analysis Confidence:</span>
                  <span className="font-semibold text-sand-900 capitalize">
                    {skinProfile.confidenceRating} ({(skinProfile.confidence ? skinProfile.confidence * 100 : 85).toFixed(0)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Neutral Reference Card:</span>
                  <span className="font-medium text-sand-900">
                    {skinProfile.isCalibrated ? 'Yes (Calibrated)' : 'No (Natural Ambient)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sand-600">Cheek Bilateral Symmetry:</span>
                  <span className="font-mono text-sand-900">
                    {skinProfile.sampledRegions.differenceDeltaE !== undefined
                      ? `ΔE = ${skinProfile.sampledRegions.differenceDeltaE}`
                      : 'Single Region'}
                  </span>
                </div>
                {skinProfile.manualAdjustmentMade && (
                  <div className="text-brand-800 font-medium text-[11px] pt-1 border-t border-sand-200">
                    ✓ Includes manual user complexion correction
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Skin Characteristics, Allergens & Makeup Preferences */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm relative">
          <div className="flex items-center justify-between mb-4 border-b border-sand-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-sand-950 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-700" />
              Skin Characteristics & Preferences
            </h3>
            <button
              onClick={() => onEditSection('skin')}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Skin */}
            <div className="space-y-2">
              <span className="text-sand-500 font-medium block uppercase tracking-wider text-[11px]">
                Skin Profile:
              </span>
              <div>
                Type: <span className="font-semibold text-sand-900 capitalize">{preferences.skinType}</span>
              </div>
              <div>
                Sensitivity: <span className="font-semibold text-sand-900 capitalize">{preferences.sensitivity}</span>
              </div>
              {preferences.concerns.length > 0 && (
                <div>
                  Concerns: <span className="font-medium text-sand-800">{preferences.concerns.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Makeup */}
            <div className="space-y-2">
              <span className="text-sand-500 font-medium block uppercase tracking-wider text-[11px]">
                Formulation:
              </span>
              <div>
                Finish: <span className="font-semibold text-sand-900 capitalize">{preferences.preferredFinish}</span>
              </div>
              <div>
                Coverage: <span className="font-semibold text-sand-900 capitalize">{preferences.preferredCoverage}</span>
              </div>
              <div>
                Intensity: <span className="font-semibold text-sand-900 capitalize">{preferences.preferredIntensity}</span>
              </div>
            </div>

            {/* Default Budget */}
            <div className="space-y-2">
              <span className="text-sand-500 font-medium block uppercase tracking-wider text-[11px]">
                Baseline Budget:
              </span>
              <div className="flex items-center gap-1 font-semibold text-brand-900 text-sm">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>₹{preferences.budgetMaxOverall.toLocaleString('en-IN')} max</span>
              </div>
              <span className="text-[11px] text-sand-500 block">
                Standard baseline cap for product matching
              </span>
            </div>
          </div>

          {/* Allergen exclusions list */}
          {preferences.allergies.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-sand-100 text-xs">
              <span className="text-rosewood-800 font-semibold mr-1.5">Strict Allergen Exclusions:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {preferences.allergies.map(a => (
                  <span
                    key={a}
                    className="px-2 py-0.5 rounded-full bg-rosewood-50 text-rosewood-800 border border-rosewood-200 capitalize font-medium text-[11px]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-sand-100 text-xs text-sand-500">
              No specific allergen exclusions declared.
            </div>
          )}
        </div>

        {/* Pipeline Transparency Callout */}
        <div className="p-4 rounded-2xl bg-sand-100/80 border border-sand-200 text-xs text-sand-700 leading-relaxed">
          <div className="font-semibold text-sand-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
            Saved Locally in Browser Storage
          </div>
          Saving confirms your Beauty Profile. Uploaded photographs remain in temporary browser RAM and can now be cleared while preserving your skin measurements and preferences.
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-sand-200 mt-8">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-sand-300 text-sand-700 hover:bg-sand-100 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onConfirmProfile}
          className="px-8 py-3.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium flex items-center gap-2 shadow-md transition-all"
        >
          <span>Save Profile & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
