import { describe, it, expect } from 'vitest';
import {
  rgbToLab,
  hexToLab,
  labToHex,
  hexToRgb,
  rgbToHex,
  deltaE00,
  deltaE76,
  evaluateColorHarmony,
} from '../colorScience';
import { estimateSkinDepth, estimateUndertone, evaluateAnalysisConfidence } from '../skinProfile';

describe('Colour Science Module', () => {
  it('converts D65 white accurately to CIELAB (L ≈ 100, a ≈ 0, b ≈ 0)', () => {
    const whiteRgb = { r: 255, g: 255, b: 255 };
    const lab = rgbToLab(whiteRgb);
    expect(lab.L).toBeCloseTo(100, 0);
    expect(Math.abs(lab.a)).toBeLessThan(1.5);
    expect(Math.abs(lab.b)).toBeLessThan(1.5);
  });

  it('converts black accurately to CIELAB (L ≈ 0, a ≈ 0, b ≈ 0)', () => {
    const blackRgb = { r: 0, g: 0, b: 0 };
    const lab = rgbToLab(blackRgb);
    expect(lab.L).toBeCloseTo(0, 0);
    expect(lab.a).toBeCloseTo(0, 0);
    expect(lab.b).toBeCloseTo(0, 0);
  });

  it('parses and formats hex accurately', () => {
    const hex = '#CAA075';
    const rgb = hexToRgb(hex);
    expect(rgb).toEqual({ r: 202, g: 160, b: 117 });
    const formatted = rgbToHex(rgb);
    expect(formatted.toUpperCase()).toBe('#CAA075');
  });

  it('converts hex directly to CIELAB and back', () => {
    const sampleHex = '#DAB38A';
    const lab = hexToLab(sampleHex);
    expect(lab.L).toBeGreaterThan(60);
    expect(lab.b).toBeGreaterThan(10); // Warm yellow tone
    const reconvertedHex = labToHex(lab);
    const lab2 = hexToLab(reconvertedHex);
    expect(lab2.L).toBeCloseTo(lab.L, 0);
  });

  it('calculates CIEDE2000 colour difference: identical colours return 0', () => {
    const lab1 = { L: 55, a: 12, b: 15 };
    const lab2 = { L: 55, a: 12, b: 15 };
    expect(deltaE00(lab1, lab2)).toBe(0);
  });

  it('calculates CIEDE2000 and CIE76 on distinct shades', () => {
    const fairSkin = hexToLab('#F6E3D4');
    const tanSkin = hexToLab('#AA7C54');
    const dE00 = deltaE00(fairSkin, tanSkin);
    const dE76 = deltaE76(fairSkin, tanSkin);

    expect(dE00).toBeGreaterThan(15);
    expect(dE76).toBeGreaterThan(15);
  });

  it('evaluates color harmony (complementary, analogous, monochromatic)', () => {
    // Monochromatic
    const ref = '#C55F6D';
    const harmony1 = evaluateColorHarmony(ref, '#C55F6D');
    expect(harmony1.type).toBe('monochromatic');

    // Triadic harmony (red vs royal blue)
    const triadic = evaluateColorHarmony('#D63B34', '#347BD6');
    expect(triadic.type).toBe('triadic');

    // Complementary harmony (warm red vs cool teal)
    const comp = evaluateColorHarmony('#D63B34', '#009087');
    expect(comp.type).toBe('complementary');
  });
});

describe('Skin Profile Estimation Module', () => {
  it('classifies skin depth into fair, medium, tan, and rich', () => {
    expect(estimateSkinDepth(85)).toBe('fair');
    expect(estimateSkinDepth(70)).toBe('light');
    expect(estimateSkinDepth(58)).toBe('medium');
    expect(estimateSkinDepth(48)).toBe('tan');
    expect(estimateSkinDepth(38)).toBe('deep');
    expect(estimateSkinDepth(25)).toBe('rich');
  });

  it('estimates undertones correctly for synthetic warm, cool, and olive samples', () => {
    // Warm: high yellowness (b*) over redness (a*)
    const warmLab = { L: 60, a: 10, b: 20 };
    expect(estimateUndertone(warmLab)).toBe('warm');

    // Cool: higher redness or low yellow
    const coolLab = { L: 65, a: 16, b: 12 };
    expect(estimateUndertone(coolLab)).toBe('cool');

    // Olive: moderate L, prominent b*, low a*
    const oliveLab = { L: 58, a: 9.5, b: 14 };
    expect(estimateUndertone(oliveLab)).toBe('olive');

    // Neutral: balanced
    const neutralLab = { L: 60, a: 12, b: 14 };
    expect(estimateUndertone(neutralLab)).toBe('neutral');
  });

  it('evaluates confidence appropriately on symmetrical vs asymmetrical lighting', () => {
    const leftCheek = { L: 60, a: 12, b: 16 };
    const rightCheekSame = { L: 60.5, a: 12.1, b: 15.9 };
    const highConf = evaluateAnalysisConfidence(leftCheek, rightCheekSame, true);
    expect(highConf.rating).toBe('high');
    expect(highConf.confidence).toBeGreaterThanOrEqual(0.85);

    // Severe asymmetry (e.g. shadow on one side)
    const rightCheekShadow = { L: 35, a: 6, b: 8 };
    const lowConf = evaluateAnalysisConfidence(leftCheek, rightCheekShadow, false);
    expect(['low', 'uncertain']).toContain(lowConf.rating);
    expect(lowConf.confidence).toBeLessThan(0.65);
  });
});
