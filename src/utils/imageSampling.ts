import { CIELABColor, RGBColor, SampledRegionData } from '../types';
import { calculateMedian, rgbToHex, rgbToLab } from './colorScience';

export interface SamplingPoint {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  radius: number; // pixel radius on actual image dimensions
}

export interface CalibrationReference {
  targetHex: string; // e.g. '#EEEEEE' (neutral white) or '#777777' (18% neutral grey)
  sampledRgb: RGBColor;
}

/**
 * Extract pixel data from an HTMLImageElement using an offscreen canvas,
 * sampling a circular region around (x, y) with the specified radius.
 *
 * Implements robust median statistical filtering and outlier rejection.
 */
export function sampleImageRegion(
  image: HTMLImageElement,
  normX: number,
  normY: number,
  radius: number = 18,
  calibrationGain?: { r: number; g: number; b: number }
): SampledRegionData {
  const canvas = document.createElement('canvas');
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    const fallbackLab: CIELABColor = { L: 58, a: 12, b: 16 };
    return {
      hex: '#A88060',
      rgb: { r: 168, g: 128, b: 96 },
      lab: fallbackLab,
      pixelCount: 0,
    };
  }

  ctx.drawImage(image, 0, 0, width, height);

  const centerX = Math.max(radius, Math.min(width - radius, Math.round(normX * width)));
  const centerY = Math.max(radius, Math.min(height - radius, Math.round(normY * height)));

  const startX = Math.max(0, centerX - radius);
  const startY = Math.max(0, centerY - radius);
  const boxWidth = Math.min(width - startX, radius * 2);
  const boxHeight = Math.min(height - startY, radius * 2);

  const imageData = ctx.getImageData(startX, startY, boxWidth, boxHeight);
  const data = imageData.data;

  const rValues: number[] = [];
  const gValues: number[] = [];
  const bValues: number[] = [];

  const r2 = radius * radius;

  for (let dy = 0; dy < boxHeight; dy++) {
    for (let dx = 0; dx < boxWidth; dx++) {
      const px = startX + dx;
      const py = startY + dy;
      const distSq = (px - centerX) * (px - centerX) + (py - centerY) * (py - centerY);

      // Only evaluate pixels within circular sampling disc
      if (distSq <= r2) {
        const index = (dy * boxWidth + dx) * 4;
        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];
        const alpha = data[index + 3];

        if (alpha < 128) continue; // Exclude transparent pixels

        // Outlier rejection:
        // Reject deep shadows (eyebrow, shadow crevice, hair strands: RGB < 25)
        if (r < 25 && g < 25 && b < 25) continue;
        // Reject specular highlights / glare reflections (RGB > 246)
        if (r > 246 && g > 246 && b > 246) continue;

        // Apply white balance calibration gains if provided
        if (calibrationGain) {
          r = Math.max(0, Math.min(255, Math.round(r * calibrationGain.r)));
          g = Math.max(0, Math.min(255, Math.round(g * calibrationGain.g)));
          b = Math.max(0, Math.min(255, Math.round(b * calibrationGain.b)));
        }

        rValues.push(r);
        gValues.push(g);
        bValues.push(b);
      }
    }
  }

  // If all pixels were filtered out, relax outlier filters and take all disc pixels
  if (rValues.length === 0) {
    for (let dy = 0; dy < boxHeight; dy++) {
      for (let dx = 0; dx < boxWidth; dx++) {
        const index = (dy * boxWidth + dx) * 4;
        rValues.push(data[index]);
        gValues.push(data[index + 1]);
        bValues.push(data[index + 2]);
      }
    }
  }

  // Compute robust median for each channel
  const medianR = calculateMedian(rValues);
  const medianG = calculateMedian(gValues);
  const medianB = calculateMedian(bValues);

  const medianRgb: RGBColor = {
    r: Math.round(medianR),
    g: Math.round(medianG),
    b: Math.round(medianB),
  };

  const lab = rgbToLab(medianRgb);
  const hex = rgbToHex(medianRgb);

  return {
    hex,
    rgb: medianRgb,
    lab,
    pixelCount: rValues.length,
  };
}

/**
 * Compute white balance correction gains from an optional neutral reference card sample.
 * Reference targets: Neutral grey (18% reflectance, ~#777777, sRGB ~119) or Neutral white (~#EEEEEE, sRGB ~238).
 */
export function calculateCalibrationGain(
  sampledCardRgb: RGBColor,
  targetType: 'white' | 'grey' = 'white'
): { r: number; g: number; b: number; factor: number } | null {
  const targetVal = targetType === 'white' ? 238 : 119;

  // Protect against division by zero or extreme outliers
  if (sampledCardRgb.r < 30 || sampledCardRgb.g < 30 || sampledCardRgb.b < 30) {
    return null;
  }

  const gainR = targetVal / sampledCardRgb.r;
  const gainG = targetVal / sampledCardRgb.g;
  const gainB = targetVal / sampledCardRgb.b;

  // Restrict gain range to reasonable limits (0.5 to 2.0) to avoid distortion
  const clampedGainR = Math.max(0.5, Math.min(2.0, gainR));
  const clampedGainG = Math.max(0.5, Math.min(2.0, gainG));
  const clampedGainB = Math.max(0.5, Math.min(2.0, gainB));

  const avgGain = (clampedGainR + clampedGainG + clampedGainB) / 3;

  return {
    r: clampedGainR,
    g: clampedGainG,
    b: clampedGainB,
    factor: Number(avgGain.toFixed(2)),
  };
}
