import { describe, it, expect, beforeEach } from 'vitest';
import { DEMO_PRODUCT_CATALOGUE } from '../../data/catalogue';
import { UserProfile } from '../../types';
import { hexToLab } from '../colorScience';
import { evaluateProductIngredients } from '../ingredientFilter';
import { evaluateProduct, getRecommendations, isDepthCompatible } from '../recommendationEngine';
import { buildManualComplexionResult } from '../skinProfile';
import {
  saveStoredProfile,
  loadStoredProfile,
  deleteStoredProfile,
  getStoredFavourites,
  toggleStoredFavourite,
  clearStoredFavourites,
  resetAllStoredData,
} from '../storage';

const mockProfile: UserProfile = {
  goals: ['foundation', 'lipstick'],
  intendedUse: 'everyday',
  skinProfile: {
    depth: 'medium',
    undertone: 'warm',
    estimatedLab: hexToLab('#DEC09C'), // Exact match to SUGAR Ace of Face 07 Vanilla Latte
    estimatedHex: '#DEC09C',
    confidence: 0.9,
    confidenceRating: 'high',
    confidenceReasons: ['Calibrated lighting', 'Cheek symmetry verified'],
    isCalibrated: true,
    sampledRegions: {},
    manualAdjustmentMade: false,
    source: 'photo_analysis',
    colourSource: 'photo_measured',
  },
  preferences: {
    skinType: 'normal',
    sensitivity: 'no',
    concerns: [],
    allergies: [],
    avoidedSubstances: [],
    preferredCoverage: 'medium',
    preferredFinish: 'natural',
    preferredIntensity: 'moderate',
    preferredBrands: [],
    excludedBrands: [],
    budgetMaxOverall: 3000,
    budgetCategory: {
      foundation: 2000,
      lipstick: 1500,
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Recommendation Engine & Ingredient Filtering', () => {
  it('excludes products when user declares an allergen that matches product ingredients', () => {
    const siliconesProduct = DEMO_PRODUCT_CATALOGUE.find(p =>
      p.ingredients.some(i => i.toLowerCase().includes('dimethicone'))
    )!;

    expect(siliconesProduct).toBeDefined();

    const evaluation = evaluateProductIngredients(
      siliconesProduct,
      ['silicones'], // User has silicone allergy
      []
    );

    expect(evaluation.isExcluded).toBe(true);
    expect(evaluation.exclusionReasons.length).toBeGreaterThan(0);
  });

  it('excludes products when user lists talc in avoided substances', () => {
    const talcProduct = DEMO_PRODUCT_CATALOGUE.find(p =>
      p.ingredients.some(i => i.toLowerCase().includes('talc'))
    )!;

    expect(talcProduct).toBeDefined();

    const evaluation = evaluateProductIngredients(
      talcProduct,
      [],
      ['talc']
    );

    expect(evaluation.isExcluded).toBe(true);
    expect(evaluation.exclusionReasons.some(r => r.toLowerCase().includes('talc'))).toBe(true);
  });

  it('flags products with partial or minimal ingredient disclosures with uncertainty warnings', () => {
    const partialProduct = DEMO_PRODUCT_CATALOGUE.find(
      p => p.ingredientCompleteness === 'ingredients_unavailable' || p.dataCompleteness === 'partial'
    )!;

    expect(partialProduct).toBeDefined();

    const evaluation = evaluateProductIngredients(partialProduct, ['parabens'], []);

    expect(evaluation.isIncomplete).toBe(true);
    expect(evaluation.hasUncertaintyWarning).toBe(true);
    expect(evaluation.uncertaintyMessage).toBeDefined();
  });

  it('enforces budget limits as a strict hard constraint', () => {
    const tightBudgetProfile: UserProfile = {
      ...mockProfile,
      preferences: {
        ...mockProfile.preferences,
        budgetMaxOverall: 250,
        budgetCategory: {
          foundation: 250, // Researched foundations are >= 339
        },
      },
    };

    const expensiveFoundation = DEMO_PRODUCT_CATALOGUE.find(p => p.category === 'foundation' && p.price > 250)!;
    const { result, filterFailureReason } = evaluateProduct(expensiveFoundation, tightBudgetProfile);

    expect(result).toBeNull();
    expect(filterFailureReason).toContain('exceeds your maximum budget');
  });

  it('calculates CIEDE2000 ΔE for shades with digital colour data', () => {
    const { categoryRecommendations } = getRecommendations(mockProfile);
    const foundations = categoryRecommendations.foundation;

    expect(foundations.length).toBeGreaterThan(0);
    // Find SUGAR Stick shade 10 (Latte #DEC09C)
    const exactMatch = foundations.find(f => f.product.shadeCode === '10' && f.product.productId === 'P02');
    expect(exactMatch).toBeDefined();
    expect(exactMatch!.deltaE).toBe(0);
    expect(exactMatch!.matchScore).toBeGreaterThan(80);
    expect(exactMatch!.recommendationConfidence).toBe('high');
  });

  it('redistributes weights dynamically without synthesizing fake hex when colour is unavailable', () => {
    // Kay Beauty Hydrating Foundation has colourDataType === 'unavailable'
    const kayFoundation = DEMO_PRODUCT_CATALOGUE.find(p => p.productId === 'P01')!;
    expect(kayFoundation.colourDataType).toBe('unavailable');
    expect(kayFoundation.shadeHex).toBeNull();

    const { result } = evaluateProduct(kayFoundation, mockProfile);
    expect(result).not.toBeNull();
    expect(result!.deltaE).toBeUndefined();
    expect(result!.scoreBreakdown.shadeSimilarityScore).toBeUndefined();
    expect(result!.scoreBreakdown.depthScore).toBeDefined();
    expect(result!.scoreBreakdown.undertoneScore).toBeDefined();
    expect(result!.matchScore).toBeGreaterThan(0);
    expect(result!.dataQualityNotes.length).toBeGreaterThan(0);
  });

  it('handles the empty results case gracefully with clear diagnostic reasons', () => {
    const impossibleProfile: UserProfile = {
      ...mockProfile,
      preferences: {
        ...mockProfile.preferences,
        budgetMaxOverall: 50, // Unrealistically low budget (no makeup in Indian market at ₹50)
        budgetCategory: { foundation: 50 },
      },
    };

    const { recommendations, filterDiagnosticReasons } = getRecommendations(impossibleProfile);
    expect(recommendations.length).toBe(0);
    expect(filterDiagnosticReasons.length).toBeGreaterThan(0);
    expect(filterDiagnosticReasons[0]).toContain('exceeds your maximum budget');
  });
});

describe('Local Storage Persistence and Deletion Controls', () => {
  beforeEach(() => {
    resetAllStoredData();
  });

  it('saves and loads profile without storing raw image binaries', () => {
    saveStoredProfile(mockProfile);
    const loaded = loadStoredProfile();
    expect(loaded).not.toBeNull();
    expect(loaded?.skinProfile.depth).toBe('medium');
    expect(loaded?.skinProfile.undertone).toBe('warm');
  });

  it('deletes saved profile and clears storage', () => {
    saveStoredProfile(mockProfile);
    deleteStoredProfile();
    expect(loadStoredProfile()).toBeNull();
  });

  it('toggles, stores, and clears favourites', () => {
    expect(getStoredFavourites()).toEqual([]);
    toggleStoredFavourite('fnd-01');
    expect(getStoredFavourites()).toEqual(['fnd-01']);
    toggleStoredFavourite('lip-01');
    expect(getStoredFavourites()).toEqual(['fnd-01', 'lip-01']);
    toggleStoredFavourite('fnd-01'); // untoggle
    expect(getStoredFavourites()).toEqual(['lip-01']);
    clearStoredFavourites();
    expect(getStoredFavourites()).toEqual([]);
  });
});

describe('Manual Complexion Input & Recommendation Flow', () => {
  it('constructs a manual complexion result without synthetic calibration or fake confidence', () => {
    const manualResult = buildManualComplexionResult('fair', 'cool');
    expect(manualResult.source).toBe('user_declared');
    expect(manualResult.colourSource).toBe('none');
    expect(manualResult.depth).toBe('fair');
    expect(manualResult.undertone).toBe('cool');
    expect(manualResult.confidence).toBeNull();
    expect(manualResult.confidenceRating).toBeNull();
    expect(manualResult.estimatedLab).toBeNull();
    expect(manualResult.estimatedHex).toBeNull();
    expect(manualResult.isCalibrated).toBe(false);
  });

  it('constructs a manual complexion result with optional color picker selection', () => {
    const manualResultWithColor = buildManualComplexionResult('tan', 'warm', '#A77A50');
    expect(manualResultWithColor.source).toBe('user_declared');
    expect(manualResultWithColor.colourSource).toBe('user_selected');
    expect(manualResultWithColor.depth).toBe('tan');
    expect(manualResultWithColor.undertone).toBe('warm');
    expect(manualResultWithColor.confidence).toBeNull();
    expect(manualResultWithColor.confidenceRating).toBeNull();
    expect(manualResultWithColor.estimatedHex).toBe('#A77A50');
    expect(manualResultWithColor.estimatedLab).not.toBeNull();
    expect(manualResultWithColor.estimatedLab!.L).toBeGreaterThan(0);
  });

  it('evaluates recommendations for user_declared complexion without fake ΔE when no color is chosen', () => {
    const manualProfile: UserProfile = {
      ...mockProfile,
      skinProfile: buildManualComplexionResult('medium', 'warm'),
    };

    const { recommendations } = getRecommendations(manualProfile);
    expect(recommendations.length).toBeGreaterThan(0);

    const foundationRec = recommendations.find(r => r.product.category === 'foundation');
    expect(foundationRec).toBeDefined();
    // In manual mode without color selection, deltaE is not fabricated
    expect(foundationRec!.deltaE).toBeUndefined();
    expect(['moderate', 'low']).toContain(foundationRec!.recommendationConfidence);
    expect(foundationRec!.dataQualityNotes.some(r => r.includes('Complexion entered by you'))).toBe(true);
    expect(foundationRec!.matchedReasons.some(r => r.includes('declared medium depth'))).toBe(true);
  });

  it('evaluates approximate proximity ΔE when user_declared complexion includes custom color swatch', () => {
    const manualProfileWithColor: UserProfile = {
      ...mockProfile,
      skinProfile: buildManualComplexionResult('medium', 'warm', '#DEC09C'),
    };

    const { recommendations } = getRecommendations(manualProfileWithColor);
    expect(recommendations.length).toBeGreaterThan(0);

    const foundationRec = recommendations.find(
      r => r.product.category === 'foundation' && r.product.shadeCode === '10' && r.product.productId === 'P02'
    );
    expect(foundationRec).toBeDefined();
    expect(foundationRec!.deltaE).toBe(0);
    expect(foundationRec!.matchedReasons.some(r => r.includes('manually selected reference colour'))).toBe(true);
  });

  it('handles "uncertain" undertone neutrally without penalizing base products', () => {
    const uncertainUndertoneProfile: UserProfile = {
      ...mockProfile,
      skinProfile: buildManualComplexionResult('light', 'uncertain'),
    };

    const { recommendations } = getRecommendations(uncertainUndertoneProfile);
    expect(recommendations.length).toBeGreaterThan(0);

    const foundationRec = recommendations.find(r => r.product.category === 'foundation');
    expect(foundationRec).toBeDefined();
    expect(foundationRec!.scoreBreakdown.undertoneScore).toBe(80);
    expect(foundationRec!.matchedReasons.some(r => r.includes('Versatile shade formula'))).toBe(true);
  });

  it('verifies depth compatibility across expanded depth categories', () => {
    expect(isDepthCompatible(['fair'], 'very-fair')).toBe(true);
    expect(isDepthCompatible(['deep', 'rich'], 'very-deep')).toBe(true);
    expect(isDepthCompatible(['medium'], 'medium')).toBe(true);
    expect(isDepthCompatible(['deep'], 'fair')).toBe(false);
  });
});

describe('Consumer-Facing Results & Quality Fix Verification (Section 20)', () => {
  it('assigns meaningfully different scores to Swiss Beauty shades based on undertone, fixing the 75/100 uniformity', () => {
    // 1. Cool-toned profile
    const coolProfile: UserProfile = {
      ...mockProfile,
      goals: ['lipstick'],
      intendedUse: 'everyday',
      skinProfile: {
        ...mockProfile.skinProfile,
        undertone: 'cool',
      },
    };

    const coolResults = getRecommendations(coolProfile).categoryRecommendations.lipstick;
    const mauveTaupe = coolResults.find(r => r.product.shadeName === 'Mauve-Taupe');
    const orangeRed = coolResults.find(r => r.product.shadeName === 'Orange-Red');

    expect(mauveTaupe).toBeDefined();
    expect(orangeRed).toBeDefined();
    // For cool skin, cool Mauve-Taupe must score significantly higher than warm Orange-Red
    expect(mauveTaupe!.matchScore).toBeGreaterThan(orangeRed!.matchScore);
    expect(mauveTaupe!.matchScore).not.toBe(75);

    // 2. Warm-toned profile
    const warmProfile: UserProfile = {
      ...mockProfile,
      goals: ['lipstick'],
      intendedUse: 'everyday',
      skinProfile: {
        ...mockProfile.skinProfile,
        undertone: 'warm',
      },
    };

    const warmResults = getRecommendations(warmProfile).categoryRecommendations.lipstick;
    const warmOrangeRed = warmResults.find(r => r.product.shadeName === 'Orange-Red');
    const warmMauveTaupe = warmResults.find(r => r.product.shadeName === 'Mauve-Taupe');

    expect(warmOrangeRed).toBeDefined();
    expect(warmMauveTaupe).toBeDefined();
    // For warm skin, Orange-Red must score higher than Mauve-Taupe
    expect(warmOrangeRed!.matchScore).toBeGreaterThan(warmMauveTaupe!.matchScore);
  });

  it('assigns customer-facing badge labels (Best Match, Great Match, etc.) instead of raw numerical scores', () => {
    const { recommendations } = getRecommendations(mockProfile);
    expect(recommendations.length).toBeGreaterThan(0);

    const topProduct = recommendations[0];
    expect(topProduct.badgeLabel).toBeDefined();
    expect(['Best Match', 'Great Match', 'Good Match', 'Alternative']).toContain(topProduct.badgeLabel);
  });

  it('generates clean consumer reasons without internal research or technical jargon', () => {
    const { recommendations } = getRecommendations(mockProfile);
    for (const rec of recommendations.slice(0, 10)) {
      for (const reason of rec.matchedReasons) {
        expect(reason).not.toContain('CIEDE2000');
        expect(reason).not.toContain('Digital shade swatch is unavailable in research; evaluated via undertone synergy, occasion, and formula.');
      }
    }
  });
});
