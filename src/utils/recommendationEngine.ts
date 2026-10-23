import { APP_CONFIG } from '../config/appConfig';
import { DEMO_PRODUCT_CATALOGUE } from '../data/catalogue';
import {
  BeautyProfile,
  FullLookRecommendation,
  Goal,
  IntendedUseRequest,
  Product,
  ProductCategory,
  RecommendationBadgeLabel,
  RecommendationResult,
  RecommendationScoringDetails,
  SkinAnalysisResult,
  SkinDepth,
  SkinType,
  SkinSensitivity,
  Coverage,
  Finish,
  ColorIntensity,
  UserProfile,
} from '../types';
import { deltaE00, evaluateColorHarmony } from './colorScience';
import { evaluateProductIngredients } from './ingredientFilter';

/**
 * Check if a product's target depths are compatible with a user's declared or estimated depth.
 * Handles sub-band mapping (e.g. very-fair to fair, very-deep to deep/rich).
 */
export function isDepthCompatible(
  productDepths: readonly SkinDepth[] | undefined,
  userDepth: SkinDepth
): boolean {
  if (!productDepths || productDepths.length === 0) return true;
  if (productDepths.includes(userDepth)) return true;
  if (userDepth === 'very-fair' && productDepths.includes('fair')) return true;
  if (userDepth === 'fair' && productDepths.includes('very-fair')) return true;
  if (userDepth === 'very-deep' && (productDepths.includes('deep') || productDepths.includes('rich'))) return true;
  if (userDepth === 'rich' && (productDepths.includes('deep') || productDepths.includes('very-deep'))) return true;
  if (userDepth === 'deep' && (productDepths.includes('very-deep') || productDepths.includes('rich'))) return true;
  return false;
}

/**
 * Convert numerical scoring and ranking position into customer-understandable recommendation badges.
 * Follows Section 4 guidelines: Best Match, Great Match, Good Match, Alternative, More Experimental.
 */
export function getRecommendationBadgeLabel(
  rankIndex: number,
  matchScore: number,
  confidence: 'high' | 'moderate' | 'low',
  harmonyType?: string
): RecommendationBadgeLabel {
  if (harmonyType === 'triadic' || harmonyType === 'complementary') {
    return 'More Experimental';
  }
  // Top 1-2 products with strong match and verified or moderate confidence
  if (rankIndex <= 1 && matchScore >= 82 && confidence !== 'low') {
    return 'Best Match';
  }
  // Strong match
  if (matchScore >= 80 && confidence !== 'low') {
    return 'Great Match';
  }
  // Solid match
  if (matchScore >= 70) {
    return 'Good Match';
  }
  // Alternate lower-ranked or exploratory option
  return 'Alternative';
}

export interface NormalizedEvaluationContext {
  skinProfile: SkinAnalysisResult;
  skinCharacteristics: {
    skinType: SkinType;
    sensitivity: SkinSensitivity;
    concerns: string[];
  };
  ingredientPreferences: {
    allergies: string[];
    avoidedSubstances: string[];
  };
  makeupPreferences: {
    preferredCoverage: Coverage;
    preferredFinish: Finish;
    preferredIntensity: ColorIntensity;
    preferredBrands: string[];
    excludedBrands: string[];
    defaultBudgetOverall: number;
    defaultBudgetCategory: Partial<Record<ProductCategory, number>>;
  };
  request: IntendedUseRequest;
}

export function resolveContext(
  profile: BeautyProfile | UserProfile,
  request?: IntendedUseRequest
): NormalizedEvaluationContext {
  const rawSkin = profile.skinProfile;
  const skinProfile: SkinAnalysisResult = {
    ...rawSkin,
    source: rawSkin.source || (rawSkin.estimatedLab ? 'photo_analysis' : 'user_declared'),
    colourSource: rawSkin.colourSource || (rawSkin.estimatedLab ? 'photo_measured' : 'none'),
  };
  const legacyProfile = profile as Partial<UserProfile>;

  const skinCharacteristics = profile.skinCharacteristics || {
    skinType: legacyProfile.preferences?.skinType || 'normal',
    sensitivity: legacyProfile.preferences?.sensitivity || 'no',
    concerns: legacyProfile.preferences?.concerns || [],
  };

  const ingredientPreferences = profile.ingredientPreferences || {
    allergies: legacyProfile.preferences?.allergies || [],
    avoidedSubstances: legacyProfile.preferences?.avoidedSubstances || [],
  };

  const makeupPreferences = profile.makeupPreferences || {
    preferredCoverage: legacyProfile.preferences?.preferredCoverage || 'medium',
    preferredFinish: legacyProfile.preferences?.preferredFinish || 'natural',
    preferredIntensity: legacyProfile.preferences?.preferredIntensity || 'moderate',
    preferredBrands: legacyProfile.preferences?.preferredBrands || [],
    excludedBrands: legacyProfile.preferences?.excludedBrands || [],
    defaultBudgetOverall: legacyProfile.preferences?.budgetMaxOverall || APP_CONFIG.defaultBudgets.overallMax,
    defaultBudgetCategory: legacyProfile.preferences?.budgetCategory || { ...APP_CONFIG.defaultBudgets.categoryMax },
  };

  const resolvedRequest: IntendedUseRequest = request || {
    goals: legacyProfile.goals || ['foundation', 'lipstick', 'everyday-look'],
    occasion: legacyProfile.intendedUse || 'everyday',
    outfitColorHex: legacyProfile.preferences?.outfitColorHex,
    outfitColorName: legacyProfile.preferences?.outfitColorName,
    sessionBudgetMax: legacyProfile.preferences?.budgetMaxOverall,
    sessionBudgetCategory: legacyProfile.preferences?.budgetCategory,
  };

  return {
    skinProfile,
    skinCharacteristics,
    ingredientPreferences,
    makeupPreferences,
    request: resolvedRequest,
  };
}

/**
 * Maps user goals to the relevant product categories.
 */
export function getCategoriesForGoals(goals: Goal[]): ProductCategory[] {
  const categories = new Set<ProductCategory>();

  for (const goal of goals) {
    switch (goal) {
      case 'foundation':
        categories.add('foundation');
        break;
      case 'concealer':
        categories.add('concealer');
        break;
      case 'lipstick':
        categories.add('lipstick');
        categories.add('lipgloss');
        break;
      case 'blush':
        categories.add('blush');
        break;
      case 'eyeshadow':
        categories.add('eyeshadow');
        break;
      case 'everyday-look':
        categories.add('foundation');
        categories.add('concealer');
        categories.add('blush');
        categories.add('lipstick');
        break;
      case 'outfit-match':
        categories.add('lipstick');
        categories.add('blush');
        categories.add('eyeshadow');
        break;
    }
  }

  return Array.from(categories);
}

/**
 * Filter and score a single product for a user profile and intended use request.
 * Returns null if hard constraints (budget, allergen, brand exclusion) fail.
 */
export function evaluateProduct(
  product: Product,
  profile: BeautyProfile | UserProfile,
  request?: IntendedUseRequest
): { result: RecommendationResult | null; filterFailureReason?: string } {
  const context = resolveContext(profile, request);
  const { skinProfile, skinCharacteristics, ingredientPreferences, makeupPreferences, request: sessionRequest } = context;

  // 1. Hard Filter: Brand Exclusion
  if (makeupPreferences.excludedBrands && makeupPreferences.excludedBrands.length > 0) {
    const isBrandExcluded = makeupPreferences.excludedBrands.some(
      b => b.toLowerCase().trim() === product.brand.toLowerCase().trim()
    );
    if (isBrandExcluded) {
      return {
        result: null,
        filterFailureReason: `Brand '${product.brand}' is in your excluded brands list.`,
      };
    }
  }

  // 2. Hard Filter: Budget
  // Check category-specific budget first, then overall budget
  const categoryMax = sessionRequest.sessionBudgetCategory?.[product.category] ?? makeupPreferences.defaultBudgetCategory?.[product.category];
  const maxPrice = categoryMax ?? sessionRequest.sessionBudgetMax ?? makeupPreferences.defaultBudgetOverall ?? APP_CONFIG.defaultBudgets.overallMax;

  if (product.price > maxPrice) {
    return {
      result: null,
      filterFailureReason: `Price (₹${product.price}) exceeds your maximum budget of ₹${maxPrice} for ${product.category}.`,
    };
  }

  // 3. Hard Filter: Ingredient Exclusion & Allergens
  const ingredientEvaluation = evaluateProductIngredients(
    product,
    ingredientPreferences.allergies,
    ingredientPreferences.avoidedSubstances
  );

  if (ingredientEvaluation.isExcluded) {
    return {
      result: null,
      filterFailureReason: `Ingredient exclusion triggered: ${ingredientEvaluation.exclusionReasons.join('; ')}`,
    };
  }

  // --- Scoring Phase ---
  const isBaseProduct = product.category === 'foundation' || product.category === 'concealer';
  const matchedReasons: string[] = [];
  const warnings: string[] = [];

  if (ingredientEvaluation.hasUncertaintyWarning && ingredientEvaluation.uncertaintyMessage) {
    warnings.push(ingredientEvaluation.uncertaintyMessage);
  }

  // Preference Matches
  let finishScore = 70;
  if (product.finish === makeupPreferences.preferredFinish) {
    finishScore = 100;
    matchedReasons.push(`Matches preferred ${product.finish} finish.`);
  } else if (
    (product.finish === 'natural' && (makeupPreferences.preferredFinish === 'dewy' || makeupPreferences.preferredFinish === 'matte')) ||
    (makeupPreferences.preferredFinish === 'natural' && (product.finish === 'dewy' || product.finish === 'matte'))
  ) {
    finishScore = 80;
  } else {
    finishScore = 55;
  }

  let coverageScore = 70;
  if (product.coverage && product.coverage === makeupPreferences.preferredCoverage) {
    coverageScore = 100;
    matchedReasons.push(`Matches preferred ${product.coverage} coverage.`);
  }

  let brandPreferenceScore = 60;
  if (
    makeupPreferences.preferredBrands &&
    makeupPreferences.preferredBrands.some(b => b.toLowerCase().trim() === product.brand.toLowerCase().trim())
  ) {
    brandPreferenceScore = 100;
    matchedReasons.push(`From your preferred brand: ${product.brand}.`);
  }

  // Formula & Concern synergy
  let formulaScore = 70;
  if (skinCharacteristics.skinType === 'oily' && (product.finish === 'matte' || product.formulaAttributes.includes('oil-control'))) {
    formulaScore += 15;
    matchedReasons.push('Formulated with oil-control attributes for oily/combination skin.');
  } else if (skinCharacteristics.skinType === 'dry' && (product.finish === 'dewy' || product.formulaAttributes.includes('hydrating'))) {
    formulaScore += 15;
    matchedReasons.push('Formulated with moisture-enriching ingredients for dry skin.');
  }

  if (skinCharacteristics.concerns.includes('visible-redness') && product.formulaAttributes.includes('fragrance-free')) {
    formulaScore += 10;
    matchedReasons.push('Gentle fragrance-free formula to soothe redness-prone skin.');
  }

  formulaScore = Math.min(100, formulaScore);

  // Price accessibility score (closer to 60-70% of max budget is optimal value)
  const priceRatio = product.price / maxPrice;
  const priceScore = Math.round(100 - priceRatio * 25);

  let finalMatchScore = 70;
  let deltaE: number | undefined;
  let similarityLabel: string | undefined;
  let harmonyType: RecommendationResult['harmonyType'] | undefined;

  let shadeSimilarityScore = 70;
  let depthScore = 70;
  let undertoneScore = 70;
  let colorHarmonyScore: number | undefined;

  const hasDigitalColor = product.colourDataType === 'brand_digital' && product.shadeHex !== null;
  const isPhotoSource = skinProfile.source === 'photo_analysis' || (!skinProfile.source && skinProfile.estimatedLab !== null);
  const isUserColor = skinProfile.source === 'user_declared' && (skinProfile.colourSource === 'user_selected' || skinProfile.estimatedLab !== null) && skinProfile.estimatedLab !== null;
  const canDoColorMatch = hasDigitalColor && product.shadeLab && (isPhotoSource || isUserColor) && skinProfile.estimatedLab !== null;

  if (isBaseProduct) {
    // Base Product Logic: Shade Matching via CIEDE2000
    if (canDoColorMatch && skinProfile.estimatedLab && product.shadeLab) {
      deltaE = Number(deltaE00(skinProfile.estimatedLab, product.shadeLab).toFixed(2));
      shadeSimilarityScore = Math.max(10, Math.round(100 - deltaE * 6.5));

      if (isUserColor) {
        similarityLabel = `Approximate shade match to chosen tone (ΔE = ${deltaE})`;
        matchedReasons.push(`Close proximity to your manually selected reference colour (approximate ΔE = ${deltaE}).`);
      } else {
        if (deltaE <= 2.2) {
          similarityLabel = `Exceptional estimated shade match (ΔE = ${deltaE})`;
          matchedReasons.push(`Close chromatic alignment with your estimated complexion (ΔE = ${deltaE}).`);
        } else if (deltaE <= 4.5) {
          similarityLabel = `Good experimental shade match (ΔE = ${deltaE})`;
          matchedReasons.push(`Harmonious shade proximity to your cheek tone (ΔE = ${deltaE}).`);
        } else if (deltaE <= 7.5) {
          similarityLabel = `Moderate shade proximity (ΔE = ${deltaE})`;
          matchedReasons.push(`Plausible match with sheer blending (ΔE = ${deltaE}).`);
        } else {
          similarityLabel = `Noticeable shade contrast (ΔE = ${deltaE})`;
        }
      }
    } else {
      deltaE = undefined;
      similarityLabel = undefined;
      if (skinProfile.source === 'user_declared') {
        matchedReasons.push(`Scored using your declared ${skinProfile.depth} depth and ${skinProfile.undertone === 'uncertain' ? 'versatile' : skinProfile.undertone} undertone.`);
      } else {
        matchedReasons.push(`Chosen based on ${skinProfile.depth} depth, ${skinProfile.undertone} undertone, and formula.`);
      }
    }

    // Depth Match (using multi-band compatibility)
    if (isDepthCompatible(product.targetDepth, skinProfile.depth)) {
      depthScore = 100;
      matchedReasons.push(`Curated specifically for ${skinProfile.depth} skin depth.`);
    } else {
      depthScore = 55;
    }

    // Undertone Match
    if (skinProfile.undertone === 'uncertain') {
      undertoneScore = 80;
      matchedReasons.push('Versatile shade formula selected for unspecified undertone.');
    } else if (product.targetUndertones && product.targetUndertones.includes(skinProfile.undertone)) {
      undertoneScore = 100;
      matchedReasons.push(`Optimized for ${skinProfile.undertone} undertones.`);
    } else {
      undertoneScore = 60;
    }

    if (canDoColorMatch && product.shadeLab) {
      const weights = APP_CONFIG.scoringWeights.baseProduct;
      finalMatchScore = Math.round(
        shadeSimilarityScore * weights.shadeSimilarity +
        depthScore * weights.depthMatch +
        undertoneScore * weights.undertoneMatch +
        finishScore * weights.finishMatch +
        coverageScore * weights.coverageMatch +
        formulaScore * weights.formulaMatch +
        brandPreferenceScore * weights.brandPreference
      );
    } else {
      // Dynamic Weight Redistribution when digital colour is unavailable
      // Redistribute shadeSimilarity (40%) across depth (25%), undertone (25%), finish (20%), coverage (15%), formula (10%), brand (5%)
      finalMatchScore = Math.round(
        depthScore * 0.25 +
        undertoneScore * 0.25 +
        finishScore * 0.20 +
        coverageScore * 0.15 +
        formulaScore * 0.10 +
        brandPreferenceScore * 0.05
      );
    }
  } else {
    // Colour Cosmetics (Lipstick, Gloss, Blush, Eyeshadow)
    const referenceHex = sessionRequest.outfitColorHex || skinProfile.estimatedHex;
    if (hasDigitalColor && product.shadeHex && referenceHex) {
      const harmony = evaluateColorHarmony(referenceHex, product.shadeHex);

      colorHarmonyScore = harmony.harmonyScore;
      harmonyType = harmony.type;

      if (sessionRequest.outfitColorHex) {
        matchedReasons.push(
          `Curated to create ${harmony.type} harmony with your selected outfit colour (${sessionRequest.outfitColorName || sessionRequest.outfitColorHex}).`
        );
      } else if (skinProfile.colourSource === 'user_selected') {
        matchedReasons.push(`Creates an aesthetic ${harmony.type} tone balance with your selected complexion shade.`);
      } else {
        matchedReasons.push(`Creates an aesthetic ${harmony.type} tone balance with your complexion.`);
      }
    } else {
      colorHarmonyScore = undefined;
      harmonyType = undefined;
      matchedReasons.push(`Chosen based on ${skinProfile.undertone === 'uncertain' ? 'versatile' : skinProfile.undertone} undertone, finish, and ${sessionRequest.occasion} occasion.`);
    }

    // Undertone synergy
    if (skinProfile.undertone === 'uncertain') {
      undertoneScore = 80;
      matchedReasons.push('Versatile pigment formula suitable for general undertones.');
    } else if (product.targetUndertones && product.targetUndertones.includes(skinProfile.undertone)) {
      undertoneScore = 95;
      matchedReasons.push(`Flattering pigment base for ${skinProfile.undertone} undertone.`);
    } else if (product.targetUndertones && product.targetUndertones.includes('neutral')) {
      undertoneScore = 85;
      matchedReasons.push(`Balanced neutral tone that complements ${skinProfile.undertone} complexions.`);
    } else if (product.targetUndertones && product.targetUndertones.length > 0) {
      undertoneScore = 50;
    } else {
      undertoneScore = 65;
    }

    // Occasion synergy
    let occasionScore = 70;
    if (product.suitableOccasions.includes(sessionRequest.occasion)) {
      occasionScore = 95;
      matchedReasons.push(`Recommended for ${sessionRequest.occasion} occasions.`);
    }

    // Intensity alignment
    let intensityScore = 75;
    if (makeupPreferences.preferredIntensity === 'subtle' && (product.finish === 'natural' || product.category === 'lipgloss')) {
      intensityScore = 95;
      matchedReasons.push('Matches preference for subtle, soft-focus colour intensity.');
    } else if (makeupPreferences.preferredIntensity === 'bold' && (product.finish === 'matte' || product.category === 'lipstick')) {
      intensityScore = 95;
      matchedReasons.push('High-impact pigment aligns with preference for bold intensity.');
    }

    if (hasDigitalColor && colorHarmonyScore !== undefined) {
      const weights = APP_CONFIG.scoringWeights.colorProduct;
      finalMatchScore = Math.round(
        colorHarmonyScore * weights.colorHarmony +
        undertoneScore * weights.undertoneSynergy +
        occasionScore * weights.occasionMatch +
        intensityScore * weights.intensityMatch +
        finishScore * weights.finishMatch +
        formulaScore * weights.formulaMatch +
        brandPreferenceScore * weights.brandPreference
      );
    } else {
      // Dynamic Weight Redistribution when digital colour is unavailable
      // Redistribute colorHarmony (35%) across undertone (35%), occasion (25%), intensity (15%), finish (15%), formula (5%), brand (5%)
      finalMatchScore = Math.round(
        undertoneScore * 0.35 +
        occasionScore * 0.25 +
        intensityScore * 0.15 +
        finishScore * 0.15 +
        formulaScore * 0.05 +
        brandPreferenceScore * 0.05
      );
    }
  }

  // --- Recommendation Confidence Determination ---
  let recommendationConfidence: 'high' | 'moderate' | 'low' = 'moderate';
  const hasReliableColor = product.colourDataType === 'brand_digital' || product.colourDataType === 'lab_measured';
  const hasExplicitUndertone = product.targetUndertones && product.targetUndertones.length > 0;
  const hasCompleteInci =
    product.ingredientCompleteness === 'complete' ||
    product.ingredientCompleteness === 'complete_as_published';
  const isAvailable = product.availabilityStatus === 'available';

  if (isPhotoSource && hasReliableColor && hasExplicitUndertone && hasCompleteInci && isAvailable) {
    recommendationConfidence = 'high';
  } else if (!hasCompleteInci && !hasReliableColor) {
    recommendationConfidence = 'low';
  } else if (!isAvailable || !hasExplicitUndertone) {
    recommendationConfidence = 'low';
  } else {
    recommendationConfidence = 'moderate';
  }

  // --- Data Quality & Provenance Notes ---
  const dataQualityNotes: string[] = [];

  // 1. Complexion Provenance
  if (skinProfile.source === 'user_declared') {
    if (skinProfile.colourSource === 'user_selected') {
      dataQualityNotes.push(`Complexion entered by you (${skinProfile.depth} depth, ${skinProfile.undertone === 'uncertain' ? 'unspecified' : skinProfile.undertone} undertone) with approximate colour reference.`);
    } else {
      dataQualityNotes.push(`Complexion entered by you (${skinProfile.depth} depth, ${skinProfile.undertone === 'uncertain' ? 'unspecified' : skinProfile.undertone} undertone).`);
    }
  } else {
    dataQualityNotes.push(`Complexion derived from photograph pixel analysis (${skinProfile.depth} depth, ${skinProfile.undertone} undertone).`);
  }

  // 1. Retailer Offer Provenance
  if (product.retailer) {
    const stockNote =
      product.availabilityStatus === 'available'
        ? 'In Stock'
        : product.availabilityStatus === 'unavailable'
        ? 'Out of Stock'
        : 'Listed Only';
    dataQualityNotes.push(`Observed on ${product.retailer} at ₹${product.price} (MRP: ₹${product.mrp || product.price}). Status: ${stockNote}.`);
  }

  // 2. Swatch Color Provenance
  if (product.colourDataType === 'brand_digital') {
    dataQualityNotes.push(
      `Digital swatch obtained directly from brand display assets (${product.shadeCode ? product.shadeCode + ' - ' : ''}${product.shadeName}). Display swatches are web CSS approximations, not spectrophotometer reflectance readings.`
    );
  } else {
    dataQualityNotes.push(
      'Digital colour data is unavailable in research records for this shade. Recommendation calculated without synthetic colour assumptions.'
    );
  }

  // 3. INCI Completeness
  if (hasCompleteInci) {
    dataQualityNotes.push('Complete INCI ingredient disclosure verified from brand or retailer listing.');
  } else if (product.ingredientCompleteness === 'partial_disclosure') {
    dataQualityNotes.push('Partial key ingredient disclosure recorded in research; complete INCI unavailable.');
  } else {
    dataQualityNotes.push('Complete ingredient disclosure was unavailable from observed Indian retailer listings.');
  }

  const scoreBreakdown: RecommendationScoringDetails = {
    shadeSimilarityScore: isBaseProduct && hasDigitalColor ? shadeSimilarityScore : undefined,
    undertoneScore,
    depthScore: isBaseProduct ? depthScore : undefined,
    colorHarmonyScore: !isBaseProduct && hasDigitalColor ? colorHarmonyScore : undefined,
    finishScore,
    coverageScore,
    formulaScore,
    brandPreferenceScore,
    priceScore,
  };

  const result: RecommendationResult = {
    product,
    matchScore: Math.max(1, Math.min(100, finalMatchScore)),
    recommendationConfidence,
    scoreBreakdown,
    deltaE,
    similarityLabel,
    matchedReasons,
    warnings,
    dataQualityNotes,
    harmonyType,
  };

  return { result };
}

/**
 * Generate sorted recommendations across candidate categories.
 * Enforces hard constraints and orders by transparent match score.
 */
export function getRecommendations(
  profile: BeautyProfile | UserProfile,
  request?: IntendedUseRequest,
  catalogue: Product[] = DEMO_PRODUCT_CATALOGUE
): {
  recommendations: RecommendationResult[];
  categoryRecommendations: Record<ProductCategory, RecommendationResult[]>;
  filteredOutCount: number;
  filterDiagnosticReasons: string[];
} {
  const context = resolveContext(profile, request);
  const targetCategories = getCategoriesForGoals(context.request.goals);
  const eligibleProducts = catalogue.filter(p => targetCategories.includes(p.category));

  const recommendations: RecommendationResult[] = [];
  const categoryRecommendations: Record<ProductCategory, RecommendationResult[]> = {
    foundation: [],
    concealer: [],
    lipstick: [],
    lipgloss: [],
    blush: [],
    eyeshadow: [],
  };

  const filterDiagnosticReasons: string[] = [];
  let filteredOutCount = 0;

  for (const product of eligibleProducts) {
    const { result, filterFailureReason } = evaluateProduct(product, profile, request);
    if (result) {
      recommendations.push(result);
      categoryRecommendations[product.category].push(result);
    } else {
      filteredOutCount++;
      if (filterFailureReason && !filterDiagnosticReasons.includes(filterFailureReason)) {
        filterDiagnosticReasons.push(filterFailureReason);
      }
    }
  }

  // Sort by overall matchScore descending, then tiebreak by recommendationConfidence and stock availability
  const sortFn = (a: RecommendationResult, b: RecommendationResult) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    const confWeight = { high: 3, moderate: 2, low: 1 };
    const confDiff = confWeight[b.recommendationConfidence] - confWeight[a.recommendationConfidence];
    if (confDiff !== 0) return confDiff;

    const availWeight = { available: 3, listed_only: 2, unknown: 1, unavailable: 0 };
    return (availWeight[b.product.availabilityStatus] || 0) - (availWeight[a.product.availabilityStatus] || 0);
  };

  recommendations.sort(sortFn);

  // Assign consumer-facing badge labels based on position and ranking
  recommendations.forEach((rec, idx) => {
    rec.badgeLabel = getRecommendationBadgeLabel(idx, rec.matchScore, rec.recommendationConfidence, rec.harmonyType);
  });

  for (const cat of Object.keys(categoryRecommendations) as ProductCategory[]) {
    categoryRecommendations[cat].sort(sortFn);
    categoryRecommendations[cat].forEach((rec, idx) => {
      // Ensure top product in each specific category gets recognized
      if (idx === 0 && rec.matchScore >= 80) {
        rec.badgeLabel = 'Best Match';
      }
    });
  }

  return {
    recommendations,
    categoryRecommendations,
    filteredOutCount,
    filterDiagnosticReasons,
  };
}

/**
 * Generate a coordinated everyday full-look ensemble.
 * Selects one foundation/tint, one concealer (if needed), one blush, one lip, and one eyeshadow.
 */
export function buildFullLookRecommendation(
  profile: BeautyProfile | UserProfile,
  request?: IntendedUseRequest,
  catalogue: Product[] = DEMO_PRODUCT_CATALOGUE
): FullLookRecommendation | null {
  const context = resolveContext(profile, request);
  const { categoryRecommendations } = getRecommendations(profile, request, catalogue);

  const bestBase = categoryRecommendations.foundation[0];
  const bestConcealer = categoryRecommendations.concealer[0];
  const bestBlush = categoryRecommendations.blush[0];
  const bestLip = categoryRecommendations.lipstick[0] || categoryRecommendations.lipgloss[0];
  const bestEye = categoryRecommendations.eyeshadow[0];

  const lookProducts: FullLookRecommendation['products'] = [];
  let totalEstimatedPrice = 0;

  if (bestBase) {
    lookProducts.push({ role: 'base', recommendation: bestBase });
    totalEstimatedPrice += bestBase.product.price;
  }
  if (bestConcealer) {
    lookProducts.push({ role: 'concealer', recommendation: bestConcealer });
    totalEstimatedPrice += bestConcealer.product.price;
  }
  if (bestBlush) {
    lookProducts.push({ role: 'blush', recommendation: bestBlush });
    totalEstimatedPrice += bestBlush.product.price;
  }
  if (bestLip) {
    lookProducts.push({ role: 'lip', recommendation: bestLip });
    totalEstimatedPrice += bestLip.product.price;
  }
  if (bestEye) {
    lookProducts.push({ role: 'eye', recommendation: bestEye });
    totalEstimatedPrice += bestEye.product.price;
  }

  if (lookProducts.length === 0) {
    return null;
  }

  const cohesivePalette = [
    ...(bestBase ? [{ role: 'Complexion Base', hex: bestBase.product.shadeHex || '#E5C49E', name: bestBase.product.shadeName }] : []),
    ...(bestBlush ? [{ role: 'Cheek Warmth', hex: bestBlush.product.shadeHex || '#E07A5F', name: bestBlush.product.shadeName }] : []),
    ...(bestLip ? [{ role: 'Lip Shade', hex: bestLip.product.shadeHex || '#B03A48', name: bestLip.product.shadeName }] : []),
    ...(bestEye ? [{ role: 'Eye Accent', hex: bestEye.product.shadeHex || '#A87954', name: bestEye.product.shadeName }] : []),
  ];

  return {
    id: `look-${context.request.occasion}-${Date.now()}`,
    lookTitle: `${context.request.occasion.charAt(0).toUpperCase() + context.request.occasion.slice(1)} Ensemble`,
    occasion: context.request.occasion,
    description: `A thoughtfully curated makeup look tailored to your ${context.skinProfile.depth} depth and ${context.skinProfile.undertone} undertones, designed for ${context.request.occasion} wear.`,
    cohesivePalette,
    products: lookProducts,
    totalEstimatedPrice,
  };
}
