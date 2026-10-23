import { CIELABColor, RGBColor } from '../types';

/**
 * Standard sRGB transfer function: linearize an sRGB channel in [0, 1].
 */
export function sRGBToLinear(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.04045
    ? clamped / 12.92
    : Math.pow((clamped + 0.055) / 1.055, 2.4);
}

/**
 * Inverse sRGB transfer function: linear value in [0, 1] to non-linear sRGB channel in [0, 1].
 */
export function linearToSRGB(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308
    ? clamped * 12.92
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

/**
 * Convert 8-bit sRGB (0-255) to CIE XYZ using D65 reference white.
 */
export function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  const rLin = sRGBToLinear(r / 255);
  const gLin = sRGBToLinear(g / 255);
  const bLin = sRGBToLinear(b / 255);

  // sRGB to XYZ matrix (D65 standard 2° observer)
  const x = rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375;
  const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.0721750;
  const z = rLin * 0.0193339 + gLin * 0.1191920 + bLin * 0.9503041;

  return { x, y, z };
}

/**
 * D65 Standard Illuminant reference white coordinates
 */
const D65_Xn = 0.95047;
const D65_Yn = 1.00000;
const D65_Zn = 1.08883;

function fLab(t: number): number {
  const delta = 6 / 29; // ~0.206896
  const delta3 = delta * delta * delta; // ~0.008856
  return t > delta3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

function fLabInv(t: number): number {
  const delta = 6 / 29;
  return t > delta ? t * t * t : 3 * delta * delta * (t - 4 / 29);
}

/**
 * Convert CIE XYZ to CIELAB under D65 illuminant.
 */
export function xyzToLab(x: number, y: number, z: number): CIELABColor {
  const fx = fLab(x / D65_Xn);
  const fy = fLab(y / D65_Yn);
  const fz = fLab(z / D65_Zn);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return {
    L: Number(L.toFixed(3)),
    a: Number(a.toFixed(3)),
    b: Number(b.toFixed(3)),
  };
}

/**
 * Convert CIELAB to CIE XYZ under D65 illuminant.
 */
export function labToXyz(lab: CIELABColor): { x: number; y: number; z: number } {
  const fy = (lab.L + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const x = D65_Xn * fLabInv(fx);
  const y = D65_Yn * fLabInv(fy);
  const z = D65_Zn * fLabInv(fz);

  return { x, y, z };
}

/**
 * Convert CIE XYZ to 8-bit sRGB (0-255).
 */
export function xyzToRgb(x: number, y: number, z: number): RGBColor {
  // XYZ to linear sRGB matrix (D65)
  const rLin = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gLin = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  const bLin = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  const r = Math.round(linearToSRGB(rLin) * 255);
  const g = Math.round(linearToSRGB(gLin) * 255);
  const b = Math.round(linearToSRGB(bLin) * 255);

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

/**
 * Convert RGB to CIELAB.
 */
export function rgbToLab(rgb: RGBColor): CIELABColor {
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

/**
 * Convert CIELAB to RGB.
 */
export function labToRgb(lab: CIELABColor): RGBColor {
  const xyz = labToXyz(lab);
  return xyzToRgb(xyz.x, xyz.y, xyz.z);
}

/**
 * Parse hexadecimal string (e.g. "#D9A87A" or "D9A87A" or "#FFF") to RGB.
 */
export function hexToRgb(hex: string): RGBColor {
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  if (cleaned.length !== 6) {
    return { r: 128, g: 128, b: 128 }; // Fallback neutral grey
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB to formatted hex string '#RRGGBB'.
 */
export function rgbToHex(rgb: RGBColor): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r))).toString(16).padStart(2, '0');
  const g = Math.max(0, Math.min(255, Math.round(rgb.g))).toString(16).padStart(2, '0');
  const b = Math.max(0, Math.min(255, Math.round(rgb.b))).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Convert Hexadecimal directly to CIELAB.
 */
export function hexToLab(hex: string): CIELABColor {
  const rgb = hexToRgb(hex);
  return rgbToLab(rgb);
}

/**
 * Convert CIELAB directly to formatted Hex.
 */
export function labToHex(lab: CIELABColor): string {
  const rgb = labToRgb(lab);
  return rgbToHex(rgb);
}

/**
 * Helper: degrees to radians and radians to degrees.
 */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * CIEDE2000 total colour difference calculation (ISO 11664-6:2014 / Sharma-Wu-Dalal).
 * Perceptually uniform metric for colour matching.
 * Returns ΔE00 >= 0.
 */
export function deltaE00(lab1: CIELABColor, lab2: CIELABColor): number {
  const kL = 1.0;
  const kC = 1.0;
  const kH = 1.0;

  const L1 = lab1.L;
  const a1 = lab1.a;
  const b1 = lab1.b;

  const L2 = lab2.L;
  const a2 = lab2.a;
  const b2 = lab2.b;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const avgC7 = Math.pow(avgC, 7);
  const G = 0.5 * (1 - Math.sqrt(avgC7 / (avgC7 + Math.pow(25, 7))));

  const a1Prime = (1 + G) * a1;
  const a2Prime = (1 + G) * a2;

  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

  // Hue angles in degrees [0, 360)
  let h1Prime = radToDeg(Math.atan2(b1, a1Prime));
  if (h1Prime < 0) h1Prime += 360;

  let h2Prime = radToDeg(Math.atan2(b2, a2Prime));
  if (h2Prime < 0) h2Prime += 360;

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;

  let deltahPrime = 0;
  if (C1Prime * C2Prime !== 0) {
    const diff = h2Prime - h1Prime;
    if (Math.abs(diff) <= 180) {
      deltahPrime = diff;
    } else if (diff > 180) {
      deltahPrime = diff - 360;
    } else {
      deltahPrime = diff + 360;
    }
  }

  const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(degToRad(deltahPrime / 2));

  const avgLPrime = (L1 + L2) / 2;
  const avgCPrime = (C1Prime + C2Prime) / 2;

  let avghPrime = 0;
  if (C1Prime * C2Prime === 0) {
    avghPrime = h1Prime + h2Prime;
  } else {
    const absDiff = Math.abs(h1Prime - h2Prime);
    if (absDiff <= 180) {
      avghPrime = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
      avghPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      avghPrime = (h1Prime + h2Prime - 360) / 2;
    }
  }

  const T =
    1 -
    0.17 * Math.cos(degToRad(avghPrime - 30)) +
    0.24 * Math.cos(degToRad(2 * avghPrime)) +
    0.32 * Math.cos(degToRad(3 * avghPrime + 6)) -
    0.20 * Math.cos(degToRad(4 * avghPrime - 63));

  const deltaTheta = 30 * Math.exp(-Math.pow((avghPrime - 275) / 25, 2));

  const avgCPrime7 = Math.pow(avgCPrime, 7);
  const RC = 2 * Math.sqrt(avgCPrime7 / (avgCPrime7 + Math.pow(25, 7)));

  const SL = 1 + (0.015 * Math.pow(avgLPrime - 50, 2)) / Math.sqrt(20 + Math.pow(avgLPrime - 50, 2));
  const SC = 1 + 0.045 * avgCPrime;
  const SH = 1 + 0.015 * avgCPrime * T;
  const RT = -Math.sin(degToRad(2 * deltaTheta)) * RC;

  const dLTerm = deltaLPrime / (kL * SL);
  const dCTerm = deltaCPrime / (kC * SC);
  const dHTerm = deltaHPrime / (kH * SH);

  const deltaEsq =
    dLTerm * dLTerm +
    dCTerm * dCTerm +
    dHTerm * dHTerm +
    RT * dCTerm * dHTerm;

  return Math.sqrt(Math.max(0, deltaEsq));
}

/**
 * CIE76 colour difference (Euclidean distance in CIELAB).
 * Kept as standard baseline / comparative reference.
 */
export function deltaE76(lab1: CIELABColor, lab2: CIELABColor): number {
  const dL = lab1.L - lab2.L;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Calculate CIELAB hue angle h_ab in degrees [0, 360).
 */
export function getLabHueAngle(lab: CIELABColor): number {
  let hue = radToDeg(Math.atan2(lab.b, lab.a));
  if (hue < 0) hue += 360;
  return hue;
}

/**
 * Calculate CIELAB chroma C*_ab = sqrt(a*^2 + b*^2)
 */
export function getLabChroma(lab: CIELABColor): number {
  return Math.sqrt(lab.a * lab.a + lab.b * lab.b);
}

/**
 * Compute the median of an array of numbers.
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[half];
  }
  return (sorted[half - 1] + sorted[half]) / 2;
}

/**
 * Color Harmony relationship evaluation.
 * Returns a harmony evaluation between a skin/outfit colour and a cosmetic product colour.
 */
export function evaluateColorHarmony(
  referenceHex: string,
  candidateHex: string
): {
  type: 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'undertone-harmony' | 'versatile';
  harmonyScore: number; // 0 - 100
  hueDifference: number; // in degrees
} {
  const refLab = hexToLab(referenceHex);
  const candLab = hexToLab(candidateHex);

  const refHue = getLabHueAngle(refLab);
  const candHue = getLabHueAngle(candLab);

  let hueDiff = Math.abs(refHue - candHue);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;

  // Monochromatic / tonal harmony (same hue family, difference < 25°)
  if (hueDiff <= 25) {
    return {
      type: 'monochromatic',
      harmonyScore: 88,
      hueDifference: hueDiff,
    };
  }

  // Analogous harmony (neighboring hues: 25° - 55°)
  if (hueDiff >= 25 && hueDiff <= 55) {
    return {
      type: 'analogous',
      harmonyScore: 92,
      hueDifference: hueDiff,
    };
  }

  // Triadic harmony (around 120° apart: 105° - 135°)
  if (hueDiff >= 105 && hueDiff <= 135) {
    return {
      type: 'triadic',
      harmonyScore: 85,
      hueDifference: hueDiff,
    };
  }

  // Complementary / split-complementary harmony (contrasting: 145° - 180°)
  if (hueDiff >= 145 && hueDiff <= 180) {
    return {
      type: 'complementary',
      harmonyScore: 95,
      hueDifference: hueDiff,
    };
  }

  // Harmonious warm/cool alignment
  const refIsWarm = refLab.b >= refLab.a;
  const candIsWarm = candLab.b >= candLab.a;
  const undertoneScore = (refIsWarm === candIsWarm) ? 80 : 70;

  return {
    type: 'undertone-harmony',
    harmonyScore: undertoneScore,
    hueDifference: hueDiff,
  };
}
