import { SkinDepth, ProductCategory } from '../types';

export const APP_CONFIG = {
  appName: 'HueGuide',
  tagline: 'Personalized shade and product recommendations based on your complexion, preferences, and budget.',
  version: '0.1.0-prototype',
  currencySymbol: '₹',
  currencyCode: 'INR',

  // Configurable Skin Depth Lightness (L*) Bands in CIELAB
  // L* ranges from 0 (black) to 100 (diffuse white)
  depthLightnessBands: [
    { depth: 'fair' as SkinDepth, minL: 74, maxL: 100, label: 'Fair' },
    { depth: 'light' as SkinDepth, minL: 64, maxL: 74, label: 'Light' },
    { depth: 'medium' as SkinDepth, minL: 54, maxL: 64, label: 'Medium' },
    { depth: 'tan' as SkinDepth, minL: 44, maxL: 54, label: 'Tan' },
    { depth: 'deep' as SkinDepth, minL: 34, maxL: 44, label: 'Deep' },
    { depth: 'rich' as SkinDepth, minL: 0, maxL: 34, label: 'Rich' },
  ],

  // Heuristic Undertone thresholds based on CIELAB a* (redness) and b* (yellowness)
  // along with hue angle h = atan2(b*, a*) in degrees.
  undertoneThresholds: {
    // Olive skin typically has moderate lightness, noticeable yellowness (b* > 12) but relatively suppressed redness (a* < 10)
    // or an individual hue angle tending towards yellow-green / muted warm
    oliveMaxA: 11.5,
    oliveMinB: 11.0,
    // Warm: higher b* relative to a* (b* - a* > 3.5)
    warmDiffThreshold: 3.5,
    // Cool: a* is high relative to b* (a* - b* > 1.5 or b* - a* < 1.0)
    coolDiffThreshold: 1.0,
    // High discrepancy deltaE between left and right cheeks to trigger low confidence
    asymmetryWarningDeltaE: 4.5,
    asymmetrySevereDeltaE: 7.0,
  },

  // Recommendation Scoring Weights (Configurable)
  scoringWeights: {
    baseProduct: {
      shadeSimilarity: 0.40, // 40% weight on CIEDE2000 shade match
      depthMatch: 0.15,
      undertoneMatch: 0.15,
      finishMatch: 0.10,
      coverageMatch: 0.10,
      formulaMatch: 0.05,
      brandPreference: 0.05,
    },
    colorProduct: {
      colorHarmony: 0.35,   // 35% color harmony with complexion/outfit
      undertoneSynergy: 0.20,
      occasionMatch: 0.15,
      intensityMatch: 0.10,
      finishMatch: 0.10,
      formulaMatch: 0.05,
      brandPreference: 0.05,
    },
  },

  // Default Budget Limits in INR
  defaultBudgets: {
    overallMax: 3000,
    categoryMax: {
      foundation: 2500,
      concealer: 1800,
      lipstick: 1500,
      lipgloss: 1200,
      blush: 1600,
      eyeshadow: 2200,
    } as Record<ProductCategory, number>,
  },

  // Disclaimers
  disclaimers: {
    medical: 'HueGuide is a prototype beauty recommendation aid. It does not provide medical, clinical, or dermatological advice, nor does it diagnose any skin conditions.',
    privacy: 'Your photographs are processed entirely locally in your web browser using HTML5 Canvas. Photographs are never uploaded to any external server or saved without explicit consent.',
    colorScience: 'Digital shade recommendations are estimates based on standard sRGB/CIELAB colour-difference approximations. Actual cosmetic appearance may vary based on lighting conditions, skin undertones, formula oxidation, and application technique.',
    demonstrationData: 'The catalogue contains Indian-market research-seed product data across 19 product families and 13 brands. Prices, availability, and stock status reflect research observations only and may not be current. Always verify with the retailer before purchasing.',
  },
};
