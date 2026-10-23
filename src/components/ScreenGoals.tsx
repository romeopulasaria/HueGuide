import React from 'react';
import { Goal, Occasion } from '../types';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface ScreenGoalsProps {
  selectedGoals: Goal[];
  onToggleGoal: (goal: Goal) => void;
  selectedOccasion: Occasion;
  onSelectOccasion: (occasion: Occasion) => void;
  onNext: () => void;
  onBack: () => void;
}

const GOAL_OPTIONS: { id: Goal; title: string; desc: string; icon: string }[] = [
  {
    id: 'foundation',
    title: 'Find my foundation shade',
    desc: 'Match your skin depth and undertone with base products',
    icon: '✨',
  },
  {
    id: 'concealer',
    title: 'Find my concealer shade',
    desc: 'Correct dark circles and spot conceal with exact tone balance',
    icon: '🎯',
  },
  {
    id: 'lipstick',
    title: 'Choose a lipstick or gloss',
    desc: 'Discover flattering lip shades suited to your undertone',
    icon: '💄',
  },
  {
    id: 'blush',
    title: 'Choose a blush',
    desc: 'Select peaches, roses, or berries that naturally warm your complexion',
    icon: '🌸',
  },
  {
    id: 'eyeshadow',
    title: 'Choose an eyeshadow palette',
    desc: 'Harmonious palettes that accentuate your eye area',
    icon: '👁️',
  },
  {
    id: 'everyday-look',
    title: 'Build an everyday makeup look',
    desc: 'A coordinated full ensemble (base, blush, lips, eyes)',
    icon: '🌟',
  },
  {
    id: 'outfit-match',
    title: 'Find makeup to complement an outfit',
    desc: 'Harmonize your makeup shades with specific outfit colours',
    icon: '👗',
  },
];

const OCCASION_OPTIONS: { id: Occasion; title: string; desc: string }[] = [
  { id: 'everyday', title: 'Everyday or natural', desc: 'Lightweight, fresh, effortlessly polished' },
  { id: 'office', title: 'Office or professional', desc: 'Subtle, long-wearing, neat, and composed' },
  { id: 'casual', title: 'Casual outing', desc: 'Comfortable, relaxed, fresh touch-up' },
  { id: 'evening', title: 'Dinner or evening', desc: 'Slightly heightened drama, refined glam' },
  { id: 'festive', title: 'Festive', desc: 'Vibrant hues, celebratory glow, radiant' },
  { id: 'wedding', title: 'Wedding guest', desc: 'Long-lasting, photo-ready, elegant definition' },
  { id: 'experimental', title: 'Experimenting with colours', desc: 'Bold tones, artistic expression' },
];

export const ScreenGoals: React.FC<ScreenGoalsProps> = ({
  selectedGoals,
  onToggleGoal,
  selectedOccasion,
  onSelectOccasion,
  onNext,
  onBack,
}) => {
  const canProceed = selectedGoals.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-semibold tracking-wider uppercase text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full">
          Step 1 of 5
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mt-3 mb-2">
          What are your makeup goals today?
        </h2>
        <p className="text-sm text-sand-600">
          Select one or more goals to focus your personalized product recommendations.
        </p>
      </div>

      {/* Goals Multi-Select Grid */}
      <div className="mb-10">
        <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-3">
          Select Goals (Choose at least one)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {GOAL_OPTIONS.map(g => {
            const isSelected = selectedGoals.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onToggleGoal(g.id)}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 shadow-sm'
                    : 'bg-white border-sand-200 hover:border-sand-300 hover:bg-sand-50/50'
                }`}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{g.icon}</span>
                <div className="flex-grow">
                  <div className="text-sm font-semibold text-sand-900 flex items-center justify-between">
                    <span>{g.title}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-brand-700 border-brand-700 text-white'
                          : 'border-sand-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-sand-600 mt-1 leading-snug">{g.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intended Occasion Single-Select */}
      <div className="mb-12">
        <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-3">
          Intended Occasion or Look
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OCCASION_OPTIONS.map(occ => {
            const isSelected = selectedOccasion === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => onSelectOccasion(occ.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                    : 'bg-white text-sand-800 border-sand-200 hover:border-sand-300'
                }`}
              >
                <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-sand-900'}`}>
                  {occ.title}
                </div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-sand-200' : 'text-sand-500'}`}>
                  {occ.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-sand-200">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-sand-300 text-sand-700 hover:bg-sand-100 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm transition-all ${
            canProceed
              ? 'bg-brand-800 hover:bg-brand-900 text-white'
              : 'bg-sand-300 text-sand-500 cursor-not-allowed'
          }`}
        >
          <span>Continue to Photo Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
