import React, { useState } from 'react';
import { BeautyProfile, Goal, IntendedUseRequest, Occasion, UserProfile } from '../types';
import { DEPTH_DEFAULT_SWATCHES } from '../utils/skinProfile';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  IndianRupee,
  Edit3,
} from 'lucide-react';

interface ScreenIntendedUseProps {
  profile: BeautyProfile | UserProfile;
  initialRequest: IntendedUseRequest;
  onEditProfile: () => void;
  onSubmitRequest: (request: IntendedUseRequest) => void;
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

const PRESET_OUTFIT_COLORS = [
  { name: 'Emerald Green', hex: '#165B33' },
  { name: 'Royal Navy', hex: '#1B2A4A' },
  { name: 'Ruby Crimson', hex: '#9E1B32' },
  { name: 'Mustard Ochre', hex: '#C68B2C' },
  { name: 'Dusty Rose', hex: '#C2848E' },
  { name: 'Warm Terracotta', hex: '#B85D43' },
  { name: 'Champagne Gold', hex: '#DEC99F' },
  { name: 'Deep Plum', hex: '#582B42' },
  { name: 'Classic Black', hex: '#1F1F1F' },
  { name: 'Ivory White', hex: '#F7F5EE' },
];

export const ScreenIntendedUse: React.FC<ScreenIntendedUseProps> = ({
  profile,
  initialRequest,
  onEditProfile,
  onSubmitRequest,
  onBack,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(initialRequest.goals);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>(initialRequest.occasion);
  const [outfitColorHex, setOutfitColorHex] = useState<string | undefined>(initialRequest.outfitColorHex);
  const [outfitColorName, setOutfitColorName] = useState<string | undefined>(initialRequest.outfitColorName);

  const defaultOverallBudget =
    profile.makeupPreferences?.defaultBudgetOverall ||
    (profile as any).preferences?.budgetMaxOverall ||
    2500;

  const [sessionBudget, setSessionBudget] = useState<number>(
    initialRequest.sessionBudgetMax || defaultOverallBudget
  );
  const [isAdjustingBudget, setIsAdjustingBudget] = useState(false);

  const handleToggleGoal = (goal: Goal) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length === 1) return; // Keep at least one goal
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSelectOutfit = (hex: string, name: string) => {
    if (outfitColorHex === hex) {
      setOutfitColorHex(undefined);
      setOutfitColorName(undefined);
    } else {
      setOutfitColorHex(hex);
      setOutfitColorName(name);
    }
  };

  const handleSubmit = () => {
    onSubmitRequest({
      goals: selectedGoals,
      occasion: selectedOccasion,
      outfitColorHex,
      outfitColorName,
      sessionBudgetMax: sessionBudget,
    });
  };

  const skin = profile.skinProfile;
  const characteristics = profile.skinCharacteristics || (profile as any).preferences;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Active Profile Banner Pill */}
      <div className="mb-6 p-3 rounded-2xl bg-white border border-sand-200/90 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-8 h-8 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
            style={{
              backgroundColor:
                skin.estimatedHex ||
                (skin.depth && DEPTH_DEFAULT_SWATCHES[skin.depth]) ||
                '#CAA075',
            }}
          />
          <div className="truncate text-xs">
            <span className="font-semibold text-sand-900 capitalize">
              {skin.depth} Depth • {skin.undertone} Undertone
            </span>
            <span className="text-sand-500 ml-2 hidden sm:inline">
              ({characteristics?.skinType} skin)
            </span>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1 flex-shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Today's Recommendation Request
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mt-1 mb-2">
          What are you looking for today?
        </h2>
        <p className="text-sm text-sand-600">
          Select what products you want and the context of your look. We will match them against your beauty profile.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Goals */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-3">
            1. Select Makeup Goals (Choose at least one)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map(g => {
              const isSelected = selectedGoals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleToggleGoal(g.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex items-start gap-3.5 ${
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

        {/* Section 2: Occasion */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-sand-800 mb-3">
            2. Intended Occasion
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {OCCASION_OPTIONS.map(occ => {
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                      : 'bg-white text-sand-800 border-sand-200 hover:border-sand-300'
                  }`}
                >
                  <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-sand-900'}`}>
                    {occ.title}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-sand-200' : 'text-sand-500'}`}>
                    {occ.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Outfit Colour */}
        <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-sand-100 pb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-sand-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-brand-700" />
              3. Outfit Colour (Optional)
            </label>
            {outfitColorHex && (
              <button
                type="button"
                onClick={() => {
                  setOutfitColorHex(undefined);
                  setOutfitColorName(undefined);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 underline"
              >
                Clear Outfit
              </button>
            )}
          </div>
          <p className="text-xs text-sand-600">
            Tell us what colour you are wearing so our engine can generate harmonic palettes (complementary, analogous, triadic).
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_OUTFIT_COLORS.map(c => {
              const isSelected = outfitColorHex === c.hex;
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleSelectOutfit(c.hex, c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    isSelected
                      ? 'bg-brand-900 text-white border-brand-900 shadow-sm font-medium'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="color"
              value={outfitColorHex || '#165B33'}
              onChange={e => {
                setOutfitColorHex(e.target.value);
                setOutfitColorName('Custom Fabric');
              }}
              className="w-9 h-9 rounded-xl cursor-pointer border border-sand-300 p-0.5 bg-white"
            />
            <div className="text-xs">
              <span className="font-semibold text-sand-800">Or pick an exact custom fabric shade</span>
              <div className="text-sand-500 font-mono text-[11px]">
                {outfitColorHex ? `${outfitColorHex} (${outfitColorName || 'Selected'})` : 'No outfit selected'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Budget Adjustment for Today */}
        <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <IndianRupee className="w-4 h-4 text-brand-700" />
              <div>
                <span className="font-semibold text-sand-900">Budget for Today: </span>
                <span className="font-mono font-bold text-brand-900">
                  ₹{sessionBudget.toLocaleString('en-IN')}
                </span>
                <span className="text-sand-500 ml-1 text-[11px]">
                  (Profile default: ₹{defaultOverallBudget.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAdjustingBudget(!isAdjustingBudget)}
              className="text-xs text-brand-700 underline font-medium hover:text-brand-900"
            >
              {isAdjustingBudget ? 'Keep Default' : 'Adjust for Today'}
            </button>
          </div>

          {isAdjustingBudget && (
            <div className="mt-3 pt-3 border-t border-sand-100 text-xs">
              <input
                type="range"
                min="500"
                max="6000"
                step="50"
                value={sessionBudget}
                onChange={e => setSessionBudget(Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-sand-500 font-mono mt-1">
                <span>₹500</span>
                <span>₹3,000</span>
                <span>₹6,000</span>
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
          onClick={handleSubmit}
          className="px-8 py-3.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium flex items-center gap-2 shadow-md transition-all"
        >
          <span>Get Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
