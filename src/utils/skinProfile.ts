import { APP_CONFIG } from '../config/appConfig';
import { CIELABColor, ColourSource, SampledRegionData, SkinAnalysisResult, SkinDepth, Undertone } from '../types';
import { deltaE00, hexToLab, labToHex } from './colorScience';

export const DEPTH_DEFAULT_SWATCHES: Record<SkinDepth, string> = {
  'very-fair': '#F7E5D6',
  'fair': '#EED5C2',
  'light': '#E3C2A6',
  'medium': '#CAA075',
  'tan': '#A77A50',
  'deep': '#7D4F2A',
  'very-deep': '#4A2B15',
  'rich': '#3B200E',
};

/**
 * Classify skin depth based on CIELAB Lightness (L*) using configurable bands.
 */
export function estimateSkinDepth(L: number): SkinDepth {
  for (const band of APP_CONFIG.depthLightnessBands) {
    if (L >= band.minL && L <= band.maxL) {
      return band.depth;
    }
  }
  return L < 34 ? 'rich' : 'fair';
}

/**
 * Heuristic undertone estimation from CIELAB a* (redness), b* (yellowness), and hue angle.
 *
 * In CIELAB:
 * - High b* relative to a* (b* - a* >= 3.5) indicates warm / golden tones.
 * - High a* relative to b* (or close values with prominent pink/red) indicates cool / rosy tones.
 * - Olive: muted undertone where redness is suppressed (a* <= 9.5) with moderate golden tones (b* between 11 and 16, C* <= 18)
 * - Balanced a* and b* indicates neutral.
 */
export function estimateUndertone(lab: CIELABColor): Undertone {
  const { a, b } = lab;
  const chroma = Math.sqrt(a * a + b * b);

  // Olive heuristic: muted saturation, lower redness, moderate yellow-green cast
  if (a <= 9.5 && b >= 10.5 && b <= 17.0 && chroma <= 19.5 && (b - a >= 1.5 && b - a <= 6.5)) {
    return 'olive';
  }

  // Warm heuristic: significant yellow component over red
  if (b - a >= 3.5) {
    return 'warm';
  }

  // Cool heuristic: red component is close to or exceeds yellow
  if (a - b >= 1.0 || b - a < 1.0) {
    return 'cool';
  }

  // Neutral heuristic: balanced red and yellow
  return 'neutral';
}

/**
 * Calculate confidence and generate human-readable reasons.
 */
export function evaluateAnalysisConfidence(
  leftLab?: CIELABColor,
  rightLab?: CIELABColor,
  isCalibrated: boolean = false
): {
  confidence: number;
  rating: 'high' | 'moderate' | 'low' | 'uncertain';
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0.85; // baseline start for good conditions

  if (isCalibrated) {
    score += 0.10;
    reasons.push('Color calibrated using neutral reference card.');
  } else {
    reasons.push('Uncalibrated natural light sampling; results are subject to ambient color cast.');
  }

  if (leftLab && rightLab) {
    const diff = deltaE00(leftLab, rightLab);
    if (diff <= APP_CONFIG.undertoneThresholds.asymmetryWarningDeltaE) {
      score += 0.05;
      reasons.push(`High left-to-right cheek consistency (ΔE = ${diff.toFixed(1)}).`);
    } else if (diff <= APP_CONFIG.undertoneThresholds.asymmetrySevereDeltaE) {
      score -= 0.20;
      reasons.push(`Moderate lighting asymmetry between left and right cheeks (ΔE = ${diff.toFixed(1)}).`);
    } else {
      score -= 0.40;
      reasons.push(`Significant lighting or shadow disparity detected across face (ΔE = ${diff.toFixed(1)}).`);
    }
  } else {
    score -= 0.15;
    reasons.push('Single cheek sampled; bilateral consistency could not be verified.');
  }

  // Check lightness extremes
  const avgL = leftLab && rightLab ? (leftLab.L + rightLab.L) / 2 : (leftLab?.L || rightLab?.L || 50);
  if (avgL > 88) {
    score -= 0.25;
    reasons.push('Potential camera overexposure or intense glare detected.');
  } else if (avgL < 22) {
    score -= 0.25;
    reasons.push('Photograph appears underexposed or in deep shadow.');
  }

  const finalScore = Math.max(0.1, Math.min(0.99, score));
  let rating: 'high' | 'moderate' | 'low' | 'uncertain' = 'moderate';

  if (finalScore >= 0.80) {
    rating = 'high';
  } else if (finalScore >= 0.60) {
    rating = 'moderate';
  } else if (finalScore >= 0.40) {
    rating = 'low';
  } else {
    rating = 'uncertain';
  }

  return {
    confidence: Number(finalScore.toFixed(2)),
    rating,
    reasons,
  };
}

/**
 * Build a complete SkinAnalysisResult from left and right cheek measurements.
 */
export function buildSkinAnalysisResult(
  leftRegion?: SampledRegionData,
  rightRegion?: SampledRegionData,
  isCalibrated: boolean = false,
  calibrationFactor?: number
): SkinAnalysisResult {
  if (!leftRegion && !rightRegion) {
    return {
      depth: 'medium',
      undertone: 'uncertain',
      estimatedLab: null,
      estimatedHex: null,
      confidence: null,
      confidenceRating: null,
      confidenceReasons: ['No cheek regions sampled yet.'],
      isCalibrated: false,
      sampledRegions: {},
      manualAdjustmentMade: false,
      source: 'user_declared',
      colourSource: 'none',
    };
  }

  let finalLab: CIELABColor;
  let diffDeltaE: number | undefined;

  if (leftRegion && rightRegion) {
    // Robust combination: average L*, a*, b* of the two medians
    finalLab = {
      L: Number(((leftRegion.lab.L + rightRegion.lab.L) / 2).toFixed(2)),
      a: Number(((leftRegion.lab.a + rightRegion.lab.a) / 2).toFixed(2)),
      b: Number(((leftRegion.lab.b + rightRegion.lab.b) / 2).toFixed(2)),
    };
    diffDeltaE = Number(deltaE00(leftRegion.lab, rightRegion.lab).toFixed(2));
  } else {
    const single = (leftRegion || rightRegion)!;
    finalLab = single.lab;
  }

  const depth = estimateSkinDepth(finalLab.L);
  const undertone = estimateUndertone(finalLab);
  const confidenceData = evaluateAnalysisConfidence(
    leftRegion?.lab,
    rightRegion?.lab,
    isCalibrated
  );

  return {
    depth,
    undertone,
    estimatedLab: finalLab,
    estimatedHex: labToHex(finalLab),
    confidence: confidenceData.confidence,
    confidenceRating: confidenceData.rating,
    confidenceReasons: confidenceData.reasons,
    isCalibrated,
    calibrationFactor,
    sampledRegions: {
      leftCheek: leftRegion,
      rightCheek: rightRegion,
      differenceDeltaE: diffDeltaE,
    },
    manualAdjustmentMade: false,
    source: 'photo_analysis',
    colourSource: 'photo_measured',
  };
}

/**
 * Build a clean SkinAnalysisResult from user manual declaration.
 * Does not synthesize or guess fake photograph measurements or confidence.
 */
export function buildManualComplexionResult(
  depth: SkinDepth,
  undertone: Undertone,
  customHex?: string | null
): SkinAnalysisResult {
  let lab: CIELABColor | null = null;
  let hex: string | null = null;
  let colourSource: ColourSource = 'none';

  if (customHex && /^#[0-9A-Fa-f]{6}$/.test(customHex)) {
    hex = customHex;
    lab = hexToLab(customHex);
    colourSource = 'user_selected';
  }

  return {
    depth,
    undertone,
    estimatedLab: lab,
    estimatedHex: hex,
    confidence: null,
    confidenceRating: null,
    confidenceReasons: ['Complexion declared manually by you.'],
    isCalibrated: false,
    sampledRegions: {},
    manualAdjustmentMade: false,
    source: 'user_declared',
    colourSource,
  };
}

/**
 * Update an existing skin profile with user-controlled manual corrections.
 */
export function applyUserCorrection(
  original: SkinAnalysisResult,
  updatedDepth: SkinDepth,
  updatedUndertone: Undertone
): SkinAnalysisResult {
  // If original had Lab/hex, adjust it so subsequent shade matching reflects the adjustment
  let newLab = original.estimatedLab ? { ...original.estimatedLab } : null;

  if (newLab) {
    // Adjust L* to fit inside chosen depth band if needed
    const targetBand = APP_CONFIG.depthLightnessBands.find(b => b.depth === updatedDepth);
    if (targetBand) {
      if (newLab.L < targetBand.minL || newLab.L > targetBand.maxL) {
        newLab.L = Number(((targetBand.minL + targetBand.maxL) / 2).toFixed(1));
      }
    }

    // Adjust a* and b* for chosen undertone
    if (updatedUndertone === 'warm' && newLab.b - newLab.a < 3.5) {
      newLab.b = Number((newLab.a + 4.5).toFixed(1));
    } else if (updatedUndertone === 'cool' && newLab.a - newLab.b < 1.0) {
      newLab.a = Number((newLab.b + 1.5).toFixed(1));
    } else if (updatedUndertone === 'olive') {
      newLab.a = 10.0;
      newLab.b = 14.5;
    } else if (updatedUndertone === 'neutral') {
      newLab.b = Number((newLab.a + 2.0).toFixed(1));
    }
  }

  return {
    ...original,
    depth: updatedDepth,
    undertone: updatedUndertone,
    estimatedLab: newLab,
    estimatedHex: newLab ? labToHex(newLab) : original.estimatedHex,
    manualAdjustmentMade: true,
    confidenceReasons: [
      ...original.confidenceReasons,
      'User verified and updated complexion characteristics manually.',
    ],
  };
}
