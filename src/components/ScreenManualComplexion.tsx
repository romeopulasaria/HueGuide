import React, { useState } from 'react';
import { SkinAnalysisResult, SkinDepth, Undertone } from '../types';
import { buildManualComplexionResult } from '../utils/skinProfile';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Camera,
  Palette,
  Info,
  X,
} from 'lucide-react';

interface ScreenManualComplexionProps {
  initialResult?: SkinAnalysisResult;
  onConfirm: (result: SkinAnalysisResult) => void;
  onBack: () => void;
  onSwitchToPhoto: () => void;
}

interface DepthOption {
  id: SkinDepth;
  label: string;
  description: string;
  swatchHex: string;
}

const DEPTH_OPTIONS: DepthOption[] = [
  {
    id: 'very-fair',
    label: 'Very Fair',
    description: 'Porcelain or alabaster, burns very easily in sunlight',
    swatchHex: '#F7E5D6',
  },
  {
    id: 'fair',
    label: 'Fair',
    description: 'Light ivory, subtle warmth or rosy clarity',
    swatchHex: '#EED5C2',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Light beige, soft golden or neutral balance',
    swatchHex: '#E3C2A6',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Classic medium golden, olive, or balanced beige',
    swatchHex: '#CAA075',
  },
  {
    id: 'tan',
    label: 'Tan',
    description: 'Rich honey, warm golden, or deep bronze',
    swatchHex: '#A77A50',
  },
  {
    id: 'deep',
    label: 'Deep',
    description: 'Deep espresso, rich warm or neutral brown',
    swatchHex: '#7D4F2A',
  },
  {
    id: 'very-deep',
    label: 'Very Deep',
    description: 'Very deep obsidian brown with strong richness',
    swatchHex: '#4A2B15',
  },
];

interface UndertoneOption {
  id: Undertone;
  title: string;
  description: string;
  hint: string;
}

const UNDERTONE_OPTIONS: UndertoneOption[] = [
  {
    id: 'cool',
    title: 'Cool',
    description: 'Pink, rosy, or bluish tendency.',
    hint: 'Silver jewelry often looks harmonious; burns easily.',
  },
  {
    id: 'neutral',
    title: 'Neutral',
    description: 'A relatively balanced mix of warm and cool tones.',
    hint: 'Equally flattering in gold and silver accents.',
  },
  {
    id: 'warm',
    title: 'Warm',
    description: 'Golden, yellow, or peach tendency.',
    hint: 'Gold jewelry glows; tans gradually in natural sunlight.',
  },
  {
    id: 'olive',
    title: 'Olive',
    description: 'Subtle greenish, muted golden cast.',
    hint: 'Common in South Asian complexions; standard warm can look too orange.',
  },
  {
    id: 'uncertain',
    title: 'Not sure',
    description: 'Balanced matching without forcing an assumption.',
    hint: "We'll suggest versatile, universally flattering shades.",
  },
];

export const ScreenManualComplexion: React.FC<ScreenManualComplexionProps> = ({
  initialResult,
  onConfirm,
  onBack,
  onSwitchToPhoto,
}) => {
  const [selectedDepth, setSelectedDepth] = useState<SkinDepth>(
    initialResult?.depth || 'medium'
  );
  const [selectedUndertone, setSelectedUndertone] = useState<Undertone>(
    initialResult?.undertone || 'warm'
  );
  const [showColorPicker, setShowColorPicker] = useState<boolean>(
    initialResult?.colourSource === 'user_selected'
  );
  const [customHex, setCustomHex] = useState<string | null>(
    initialResult?.colourSource === 'user_selected' && initialResult.estimatedHex
      ? initialResult.estimatedHex
      : null
  );

  const selectedDepthObj = DEPTH_OPTIONS.find(d => d.id === selectedDepth) || DEPTH_OPTIONS[3];
  const selectedUndertoneObj = UNDERTONE_OPTIONS.find(u => u.id === selectedUndertone) || UNDERTONE_OPTIONS[2];

  const handleContinue = () => {
    const result = buildManualComplexionResult(selectedDepth, selectedUndertone, customHex);
    onConfirm(result);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Top Banner / Switch to Photo Link */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-sand-700">
            Manual Complexion Setup
          </span>
        </div>
        <button
          type="button"
          onClick={onSwitchToPhoto}
          className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1.5 transition-colors group"
        >
          <Camera className="w-3.5 h-3.5 text-brand-600" />
          <span className="group-hover:underline">Prefer photo analysis? Upload photo</span>
        </button>
      </div>

      {/* Screen Title & Supporting Text */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mb-2">
          Tell us about your complexion
        </h2>
        <p className="text-sm text-sand-600 leading-relaxed max-w-2xl">
          You can change these details later. If you're unsure about any of them, choose "Not sure".
        </p>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: SKIN DEPTH */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
          <div className="border-b border-sand-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-sand-950">
              1. How would you describe your skin depth?
            </h3>
            <p className="text-xs text-sand-500 mt-0.5">
              Select the depth range closest to your natural skin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEPTH_OPTIONS.map(opt => {
              const isSelected = selectedDepth === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDepth(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 shadow-sm'
                      : 'bg-white border-sand-200 hover:border-sand-300 hover:bg-sand-50/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
                    style={{ backgroundColor: opt.swatchHex }}
                    aria-hidden="true"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-sand-900">{opt.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brand-700 border-brand-700 text-white'
                            : 'border-sand-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-sand-500 leading-tight mt-0.5 truncate">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-2 pt-2 text-[11px] text-sand-500 italic">
            <Info className="w-3.5 h-3.5 text-sand-400 flex-shrink-0 mt-0.5" />
            <span>
              Visual swatches are illustrative reference aids, not exact scientific matches to your skin.
            </span>
          </div>
        </div>

        {/* SECTION 2: UNDERTONE */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
          <div className="border-b border-sand-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-sand-950">
              2. What's your undertone?
            </h3>
            <p className="text-xs text-sand-500 mt-0.5">
              The subtle temperature under the surface of your skin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UNDERTONE_OPTIONS.map(opt => {
              const isSelected = selectedUndertone === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedUndertone(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 shadow-sm'
                      : 'bg-white border-sand-200 hover:border-sand-300 hover:bg-sand-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-sand-900">{opt.title}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-brand-700 border-brand-700 text-white'
                          : 'border-sand-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-sand-700 leading-snug">{opt.description}</p>
                  <p className="text-[10px] text-sand-500 mt-1 italic">{opt.hint}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: OPTIONAL COLOUR INPUT */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-sand-950 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-700" />
                Want to be more precise?
              </h3>
              <p className="text-xs text-sand-500 mt-0.5">
                Optionally pick an approximate complexion colour to help with visual preview.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (showColorPicker && customHex) {
                  // Keep picker visible or toggle
                  setShowColorPicker(!showColorPicker);
                } else {
                  setShowColorPicker(!showColorPicker);
                  if (!showColorPicker && !customHex) {
                    setCustomHex(selectedDepthObj.swatchHex);
                  }
                }
              }}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold underline transition-colors"
            >
              {showColorPicker ? 'Hide colour picker' : 'Pick a colour'}
            </button>
          </div>

          {showColorPicker && (
            <div className="pt-3 border-t border-sand-100 space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={customHex || selectedDepthObj.swatchHex}
                  onChange={e => setCustomHex(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-sand-300 p-1 bg-white"
                  title="Choose approximate complexion colour"
                />
                <div className="flex-grow">
                  <div className="text-xs font-semibold text-sand-900">
                    Approximate Complexion Swatch
                  </div>
                  <div className="text-xs font-mono text-sand-600 mt-0.5">
                    {customHex ? customHex.toUpperCase() : 'None selected'}
                  </div>
                  <div className="text-[11px] text-sand-500">
                    Saved as a user-selected approximation. Not a laboratory or photographic measurement.
                  </div>
                </div>

                {customHex && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomHex(null);
                      setShowColorPicker(false);
                    }}
                    className="p-1.5 rounded-full text-sand-400 hover:text-rose-600 hover:bg-sand-100 transition-colors"
                    title="Remove custom colour"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: RESULT / CONFIRMATION PREVIEW CARD */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sand-100/90 via-sand-50 to-brand-50/50 border border-brand-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-sand-200/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sand-600">
              Your Complexion
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-800 bg-brand-100/80 px-2.5 py-0.5 rounded-full">
              Source: Entered by you
            </span>
          </div>

          <div className="flex items-center gap-4">
            {customHex ? (
              <div
                className="w-14 h-14 rounded-2xl shadow-inner border border-sand-300 flex-shrink-0"
                style={{ backgroundColor: customHex }}
                title={`Approximate colour: ${customHex}`}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl shadow-inner border border-sand-300 flex-shrink-0"
                style={{ backgroundColor: selectedDepthObj.swatchHex }}
                title={`Illustrative swatch: ${selectedDepthObj.label}`}
              />
            )}

            <div>
              <div className="text-xl font-serif font-bold text-sand-950">
                {selectedDepthObj.label}
              </div>
              <div className="text-sm font-semibold text-brand-800 mt-0.5">
                {selectedUndertone === 'uncertain'
                  ? 'Undertone: Not specified (balanced matching)'
                  : `${selectedUndertoneObj.title} undertone`}
              </div>
              {customHex && (
                <div className="text-[11px] font-mono text-sand-500 mt-0.5">
                  Approximate colour: {customHex.toUpperCase()} (user selected)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-sand-200 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-sand-300 text-sand-700 hover:bg-sand-100 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-8 py-3.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium flex items-center gap-2 shadow-md transition-all"
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
