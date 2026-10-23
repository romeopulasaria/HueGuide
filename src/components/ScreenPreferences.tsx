import React, { useState } from 'react';
import {
  ColorIntensity,
  Coverage,
  Finish,
  ProductCategory,
  SkinSensitivity,
  SkinType,
  UserPreferences,
} from '../types';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  IndianRupee,
  ShieldAlert,
  Plus,
  X,
  Check,
} from 'lucide-react';

interface ScreenPreferencesProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: UserPreferences) => void;
  onNext: () => void;
  onBack: () => void;
}

const COMMON_ALLERGEN_PRESETS = [
  'Fragrance',
  'Parabens',
  'Silicones',
  'Sulfates',
  'Talc',
  'Essential Oils',
  'Tree Nuts',
  'Phenoxyethanol',
  'Mica',
];

export const ScreenPreferences: React.FC<ScreenPreferencesProps> = ({
  preferences,
  onUpdatePreferences,
  onNext,
  onBack,
}) => {
  const [customAllergen, setCustomAllergen] = useState('');
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);

  // Toggle skin concern
  const handleToggleConcern = (concernId: string) => {
    const current = preferences.concerns;
    const exists = current.includes(concernId);
    const updated = exists ? current.filter(c => c !== concernId) : [...current, concernId];
    onUpdatePreferences({ ...preferences, concerns: updated });
  };

  // Toggle allergen / avoided substance
  const handleToggleAllergen = (term: string) => {
    const normalized = term.toLowerCase().trim();
    const current = preferences.allergies;
    const exists = current.includes(normalized);
    const updated = exists ? current.filter(a => a !== normalized) : [...current, normalized];
    onUpdatePreferences({ ...preferences, allergies: updated });
  };

  // Add custom allergen
  const handleAddCustomAllergen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAllergen.trim()) return;
    const normalized = customAllergen.toLowerCase().trim();
    if (!preferences.allergies.includes(normalized)) {
      onUpdatePreferences({
        ...preferences,
        allergies: [...preferences.allergies, normalized],
      });
    }
    setCustomAllergen('');
  };

  // Remove allergen
  const handleRemoveAllergen = (term: string) => {
    onUpdatePreferences({
      ...preferences,
      allergies: preferences.allergies.filter(a => a !== term),
    });
  };

  // Update category budget
  const handleUpdateCategoryBudget = (category: ProductCategory, amount: number) => {
    onUpdatePreferences({
      ...preferences,
      budgetCategory: {
        ...preferences.budgetCategory,
        [category]: amount,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mb-2">
          Personal Preferences & Budget
        </h2>
        <p className="text-sm text-sand-600">
          Refine finish, coverage, allergen exclusions, INR price caps, and outfit harmony.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Skin Characteristics & Sensitivities */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-sand-950 border-b border-sand-100 pb-2">
            1. Skin Characteristics & Sensitivities
          </h3>

          {/* Skin Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Skin Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {(['oily', 'dry', 'combination', 'normal', 'unsure'] as SkinType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, skinType: t })}
                  className={`py-2 px-3 rounded-xl capitalize border transition-all text-center ${
                    preferences.skinType === t
                      ? 'bg-brand-800 text-white border-brand-800 font-semibold shadow-sm'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Self-reported sensitivity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Self-Reported Skin Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['yes', 'no', 'unsure'] as SkinSensitivity[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, sensitivity: s })}
                  className={`py-2 px-3 rounded-xl capitalize border transition-all text-center ${
                    preferences.sensitivity === s
                      ? 'bg-brand-800 text-white border-brand-800 font-semibold shadow-sm'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {s === 'yes' ? 'Sensitive Skin' : s === 'no' ? 'Not Sensitive' : 'Unsure'}
                </button>
              ))}
            </div>
          </div>

          {/* User-reported concerns */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Specific Concerns (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'visible-redness', label: 'Visible Redness' },
                { id: 'uneven-skin-tone', label: 'Uneven Skin Tone' },
                { id: 'dark-circles', label: 'Dark Circles' },
                { id: 'blemishes', label: 'Blemishes / Texture' },
              ].map(c => {
                const isSelected = preferences.concerns.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleToggleConcern(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-100 text-brand-900 border-brand-400 font-semibold'
                        : 'bg-sand-50 text-sand-700 border-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{c.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-700" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredient Exclusion & Allergens */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Exclude Allergens or Ingredients to Avoid
              </label>
              <span className="text-[11px] text-sand-500">Hard Filter</span>
            </div>
            <p className="text-[11px] text-sand-500 mb-3">
              Any products containing declared substances will be strictly removed from recommendations.
            </p>

            {/* Quick preset tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {COMMON_ALLERGEN_PRESETS.map(preset => {
                const isExcluded = preferences.allergies.includes(preset.toLowerCase());
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleToggleAllergen(preset)}
                    className={`px-3 py-1 rounded-full text-xs transition-all border ${
                      isExcluded
                        ? 'bg-rosewood-700 text-white border-rosewood-700 font-medium'
                        : 'bg-sand-100 text-sand-700 border-sand-200 hover:bg-sand-200'
                    }`}
                  >
                    {isExcluded ? `✕ ${preset}` : `+ ${preset}`}
                  </button>
                );
              })}
            </div>

            {/* Custom add allergen input */}
            <form onSubmit={handleAddCustomAllergen} className="flex gap-2 mb-3">
              <input
                type="text"
                value={customAllergen}
                onChange={e => setCustomAllergen(e.target.value)}
                placeholder="Add custom ingredient (e.g. lavender oil, talc, mica)..."
                className="flex-grow px-3 py-1.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-sand-800 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Active excluded tag pills */}
            {preferences.allergies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-rosewood-50 border border-rosewood-200 text-xs">
                <span className="text-rosewood-900 font-semibold mr-1">Currently Excluded:</span>
                {preferences.allergies.map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 bg-white text-rosewood-800 border border-rosewood-300 px-2 py-0.5 rounded-full capitalize"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergen(a)}
                      className="hover:text-rose-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medical disclaimer note */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-sand-600 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Ingredient filtering is an informational aid, not medical allergy testing. We do not diagnose psoriasis, eczema, or dermatitis.
            </span>
          </div>
        </div>

        {/* Section 2: Makeup Style & Formulation Preferences */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-sand-950 border-b border-sand-100 pb-2">
            2. Makeup Finish, Coverage & Intensity
          </h3>

          {/* Preferred Finish */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Preferred Finish
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['matte', 'natural', 'satin', 'dewy'] as Finish[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, preferredFinish: f })}
                  className={`py-2 px-3 rounded-xl capitalize border transition-all text-center ${
                    preferences.preferredFinish === f
                      ? 'bg-brand-800 text-white border-brand-800 font-semibold shadow-sm'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Coverage */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Preferred Base Coverage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['sheer', 'light', 'medium', 'full'] as Coverage[]).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, preferredCoverage: c })}
                  className={`py-2 px-3 rounded-xl capitalize border transition-all text-center ${
                    preferences.preferredCoverage === c
                      ? 'bg-brand-800 text-white border-brand-800 font-semibold shadow-sm'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Colour Intensity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-2">
              Preferred Colour Intensity (Lips, Cheeks & Eyes)
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['subtle', 'moderate', 'bold'] as ColorIntensity[]).map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, preferredIntensity: i })}
                  className={`py-2 px-3 rounded-xl capitalize border transition-all text-center ${
                    preferences.preferredIntensity === i
                      ? 'bg-brand-800 text-white border-brand-800 font-semibold shadow-sm'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Budget in INR */}
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sand-100 pb-2">
            <h3 className="font-serif text-xl font-bold text-sand-950 flex items-center gap-1.5">
              <IndianRupee className="w-5 h-5 text-brand-700" />
              3. Budget Settings (₹ INR)
            </h3>
            <button
              type="button"
              onClick={() => setShowCategoryBudgets(!showCategoryBudgets)}
              className="text-xs text-brand-700 underline font-medium hover:text-brand-900"
            >
              {showCategoryBudgets ? 'Hide category limits' : 'Customize per category'}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-sand-800">
                Maximum Price per Product:
              </label>
              <span className="font-mono text-base font-bold text-brand-900">
                ₹{preferences.budgetMaxOverall.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="50"
              value={preferences.budgetMaxOverall}
              onChange={e =>
                onUpdatePreferences({
                  ...preferences,
                  budgetMaxOverall: Number(e.target.value),
                })
              }
              className="w-full accent-brand-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-sand-500 font-mono mt-1">
              <span>₹500</span>
              <span>₹3,000</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* Expandable Category Limits */}
          {showCategoryBudgets && (
            <div className="pt-4 border-t border-sand-100 space-y-3">
              <div className="text-xs font-semibold text-sand-700">
                Independent Category Caps:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(['foundation', 'concealer', 'lipstick', 'blush', 'eyeshadow'] as ProductCategory[]).map(cat => (
                  <div key={cat} className="p-2.5 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                    <span className="capitalize text-sand-800 font-medium">{cat}:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sand-500">₹</span>
                      <input
                        type="number"
                        min="300"
                        max="5000"
                        step="50"
                        value={preferences.budgetCategory[cat] ?? preferences.budgetMaxOverall}
                        onChange={e => handleUpdateCategoryBudget(cat, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs rounded border border-sand-300 font-mono text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          onClick={onNext}
          className="px-7 py-3 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <span>Review Beauty Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
