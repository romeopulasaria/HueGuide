import React, { useEffect, useRef, useState } from 'react';
import {
  SampledRegionData,
  SkinAnalysisResult,
  SkinDepth,
  Undertone,
} from '../types';
import { calculateCalibrationGain, sampleImageRegion } from '../utils/imageSampling';
import { applyUserCorrection, buildSkinAnalysisResult } from '../utils/skinProfile';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Pipette,
  Layers,
} from 'lucide-react';

interface ScreenSkinAnalysisProps {
  photoUrl: string | null;
  initialResult: SkinAnalysisResult;
  onConfirm: (result: SkinAnalysisResult) => void;
  onBack: () => void;
  onSwitchToManual?: () => void;
}

export const ScreenSkinAnalysis: React.FC<ScreenSkinAnalysisProps> = ({
  photoUrl,
  initialResult,
  onConfirm,
  onBack,
  onSwitchToManual,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Normalized coordinates (0 to 1)
  const [leftCheekPos, setLeftCheekPos] = useState({ x: 0.38, y: 0.54 });
  const [rightCheekPos, setRightCheekPos] = useState({ x: 0.62, y: 0.54 });
  const [activeTarget, setActiveTarget] = useState<'left' | 'right' | 'card'>('left');

  // Sampling data states
  const [leftSample, setLeftSample] = useState<SampledRegionData | undefined>(
    initialResult.sampledRegions.leftCheek
  );
  const [rightSample, setRightSample] = useState<SampledRegionData | undefined>(
    initialResult.sampledRegions.rightCheek
  );

  // Calibration state
  const [isCalibrated, setIsCalibrated] = useState(initialResult.isCalibrated);
  const [calibrationGain, setCalibrationGain] = useState<{ r: number; g: number; b: number; factor: number } | null>(null);
  const [cardSample, setCardSample] = useState<SampledRegionData | null>(null);

  // Analysis result
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult>(initialResult);

  // User manual correction overrides
  const [selectedDepth, setSelectedDepth] = useState<SkinDepth>(initialResult.depth);
  const [selectedUndertone, setSelectedUndertone] = useState<Undertone>(initialResult.undertone);
  const [isManualEditOpen, setIsManualEditOpen] = useState(false);

  // Image load & canvas setup
  useEffect(() => {
    if (!photoUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      imageObjRef.current = img;
      runSampling(img, leftCheekPos, rightCheekPos, calibrationGain);
      drawCanvas(img);
    };
  }, [photoUrl]);

  // Redraw canvas whenever sampling points change
  const drawCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Display scaled to container
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw base photo
    ctx.drawImage(img, 0, 0, width, height);

    // 2. Draw Left Cheek Target
    const lx = leftCheekPos.x * width;
    const ly = leftCheekPos.y * height;
    drawTargetReticle(ctx, lx, ly, 'Left Cheek', '#3B82F6', activeTarget === 'left');

    // 3. Draw Right Cheek Target
    const rx = rightCheekPos.x * width;
    const ry = rightCheekPos.y * height;
    drawTargetReticle(ctx, rx, ry, 'Right Cheek', '#10B981', activeTarget === 'right');

    // 4. Draw Card Target (if sampled)
    if (cardSample && activeTarget === 'card') {
      // draw indication
    }
  };

  const drawTargetReticle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    color: string,
    isActive: boolean
  ) => {
    const radius = 22;

    // Outer glow
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, 2 * Math.PI);
    ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    // Sampling boundary disc
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Center crosshair
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label tag
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.font = 'bold 14px sans-serif';
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x - textWidth / 2 - 6, y - radius - 26, textWidth + 12, 22);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - radius - 10);
  };

  // Perform actual pixel sampling
  const runSampling = (
    img: HTMLImageElement,
    lPos = leftCheekPos,
    rPos = rightCheekPos,
    gain = calibrationGain
  ) => {
    const left = sampleImageRegion(img, lPos.x, lPos.y, 18, gain ? { r: gain.r, g: gain.g, b: gain.b } : undefined);
    const right = sampleImageRegion(img, rPos.x, rPos.y, 18, gain ? { r: gain.r, g: gain.g, b: gain.b } : undefined);

    setLeftSample(left);
    setRightSample(right);

    const result = buildSkinAnalysisResult(left, right, !!gain, gain?.factor);
    setAnalysisResult(result);
    setSelectedDepth(result.depth);
    setSelectedUndertone(result.undertone);
  };

  // Handle Canvas Click or Tap to reposition target
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const clampedX = Math.max(0.05, Math.min(0.95, clickX));
    const clampedY = Math.max(0.05, Math.min(0.95, clickY));

    if (activeTarget === 'left') {
      const newPos = { x: clampedX, y: clampedY };
      setLeftCheekPos(newPos);
      runSampling(imageObjRef.current, newPos, rightCheekPos, calibrationGain);
    } else if (activeTarget === 'right') {
      const newPos = { x: clampedX, y: clampedY };
      setRightCheekPos(newPos);
      runSampling(imageObjRef.current, leftCheekPos, newPos, calibrationGain);
    } else if (activeTarget === 'card') {
      // Sample reference card
      const card = sampleImageRegion(imageObjRef.current, clampedX, clampedY, 15);
      setCardSample(card);
      const gain = calculateCalibrationGain(card.rgb, 'white');
      if (gain) {
        setCalibrationGain(gain);
        setIsCalibrated(true);
        runSampling(imageObjRef.current, leftCheekPos, rightCheekPos, gain);
      }
      setActiveTarget('left'); // return to cheek
    }

    if (imageObjRef.current) {
      drawCanvas(imageObjRef.current);
    }
  };

  // Reset sampling reticles to default positions
  const handleResetPositions = () => {
    const defaultLeft = { x: 0.38, y: 0.54 };
    const defaultRight = { x: 0.62, y: 0.54 };
    setLeftCheekPos(defaultLeft);
    setRightCheekPos(defaultRight);
    setCalibrationGain(null);
    setIsCalibrated(false);
    setCardSample(null);
    setActiveTarget('left');

    if (imageObjRef.current) {
      runSampling(imageObjRef.current, defaultLeft, defaultRight, null);
      drawCanvas(imageObjRef.current);
    }
  };

  // User manually edits depth or undertone
  const handleApplyUserCorrection = (depth: SkinDepth, undertone: Undertone) => {
    setSelectedDepth(depth);
    setSelectedUndertone(undertone);
    const corrected = applyUserCorrection(analysisResult, depth, undertone);
    setAnalysisResult(corrected);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950 mb-1">
            Image-Based Skin Profile Analysis
          </h2>
          <p className="text-sm text-sand-600">
            Cheek regions are sampled using median pixel analysis. Tap on the image to adjust reticle locations if needed.
          </p>
        </div>
        {onSwitchToManual && (
          <button
            type="button"
            onClick={onSwitchToManual}
            className="text-xs text-brand-700 hover:text-brand-900 font-semibold underline whitespace-nowrap self-start sm:self-center"
          >
            Switch to manual input
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Interactive Canvas Viewer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Target Selection Switcher */}
          <div className="flex items-center justify-between mb-3 bg-white p-2 rounded-xl border border-sand-200">
            <span className="text-xs font-semibold text-sand-700 px-2 flex items-center gap-1.5">
              <Pipette className="w-3.5 h-3.5 text-brand-600" />
              Active Reticle:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTarget('left')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTarget === 'left'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                }`}
              >
                Left Cheek
              </button>
              <button
                type="button"
                onClick={() => setActiveTarget('right')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTarget === 'right'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                }`}
              >
                Right Cheek
              </button>
              <button
                type="button"
                onClick={() => setActiveTarget('card')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  activeTarget === 'card'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
                title="Click on a neutral white or grey reference card in the photo"
              >
                Reference Card
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-sand-300 bg-sand-900 shadow-inner aspect-[3/4] max-h-[520px] flex items-center justify-center cursor-crosshair">
            {photoUrl ? (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 text-sand-300 text-xs max-w-sm space-y-3">
                <p className="font-semibold text-sand-200 text-sm">No photograph loaded</p>
                <p className="text-sand-400">
                  To perform image-based sampling, please upload a photograph or switch to manual complexion input.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 rounded-full bg-sand-800 text-white hover:bg-sand-700"
                  >
                    Upload Photo
                  </button>
                  {onSwitchToManual && (
                    <button
                      type="button"
                      onClick={onSwitchToManual}
                      className="px-4 py-2 rounded-full border border-sand-600 text-sand-200 hover:bg-sand-800"
                    >
                      Enter Manually
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Instruction overlay pill */}
            <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md rounded-xl py-2 px-3 text-center text-white text-[11px] pointer-events-none">
              Click anywhere on the photo to position the {activeTarget === 'card' ? 'Reference Card sampler' : `${activeTarget} cheek target`}.
            </div>
          </div>

          {/* Reset & Sampling Actions */}
          <div className="flex items-center justify-between mt-3 text-xs text-sand-600">
            <button
              onClick={handleResetPositions}
              className="flex items-center gap-1.5 hover:text-brand-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset reticles to default positions</span>
            </button>
            {isCalibrated && (
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Calibrated (Gain: {calibrationGain?.factor}x)
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Measurements & Estimates (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Main Complexion Card */}
            <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-sand-500">
                  Estimated Complexion
                </span>
                <span
                  className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    analysisResult.confidenceRating === 'high'
                      ? 'bg-emerald-100 text-emerald-800'
                      : analysisResult.confidenceRating === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {analysisResult.confidenceRating
                    ? `${analysisResult.confidenceRating} Confidence (${((analysisResult.confidence || 0) * 100).toFixed(0)}%)`
                    : 'Sampling In Progress'}
                </span>
              </div>

              {/* Representative Swatch & Values */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-sand-100">
                <div
                  className="w-16 h-16 rounded-2xl shadow-inner border border-sand-300 flex-shrink-0"
                  style={{ backgroundColor: analysisResult.estimatedHex || '#CAA075' }}
                />
                <div>
                  <div className="text-lg font-serif font-bold text-sand-950 capitalize">
                    {analysisResult.depth} Depth • {analysisResult.undertone}
                  </div>
                  <div className="text-xs font-mono text-sand-500 uppercase mt-0.5">
                    {analysisResult.estimatedHex || 'Sampling...'}
                  </div>
                  {analysisResult.estimatedLab && (
                    <div className="text-[11px] text-sand-500 mt-1">
                      L*: {analysisResult.estimatedLab.L.toFixed(1)} • a*: {analysisResult.estimatedLab.a.toFixed(1)} • b*: {analysisResult.estimatedLab.b.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>

              {/* Bilateral Cheek Verification */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-sand-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-600" />
                    Bilateral Cheek Consistency
                  </span>
                  {analysisResult.sampledRegions.differenceDeltaE !== undefined && (
                    <span className="text-[11px] font-mono text-sand-600">
                      ΔE = {analysisResult.sampledRegions.differenceDeltaE.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200/80 flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md border border-stone-200"
                      style={{ backgroundColor: leftSample?.hex || '#C4AF94' }}
                    />
                    <div>
                      <div className="font-medium text-sand-800">Left Cheek</div>
                      <div className="text-[10px] text-sand-500 font-mono">{leftSample?.hex || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200/80 flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md border border-stone-200"
                      style={{ backgroundColor: rightSample?.hex || '#C4AF94' }}
                    />
                    <div>
                      <div className="font-medium text-sand-800">Right Cheek</div>
                      <div className="text-[10px] text-sand-500 font-mono">{rightSample?.hex || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence reasons breakdown */}
              <div className="mt-4 pt-3 border-t border-sand-100 text-[11px] text-sand-600 space-y-1">
                {analysisResult.confidenceReasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-brand-600 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User-Controlled Profile Corrections */}
            <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
              <button
                type="button"
                onClick={() => setIsManualEditOpen(!isManualEditOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-sand-900"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-600" />
                  Adjust or Correct Estimated Profile
                </span>
                <span className="text-brand-700 underline text-[11px]">
                  {isManualEditOpen ? 'Hide' : 'Edit'}
                </span>
              </button>

              {isManualEditOpen && (
                <div className="mt-4 space-y-3 pt-3 border-t border-sand-100 text-xs">
                  <div>
                    <label className="block font-medium text-sand-700 mb-1.5">
                      Skin Depth Category:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['fair', 'light', 'medium', 'tan', 'deep', 'rich'] as SkinDepth[]).map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleApplyUserCorrection(d, selectedUndertone)}
                          className={`py-1.5 px-2 rounded-lg text-xs capitalize border transition-colors ${
                            selectedDepth === d
                              ? 'bg-brand-800 text-white border-brand-800 font-semibold'
                              : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-sand-700 mb-1.5">
                      Undertone:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['warm', 'cool', 'neutral', 'olive', 'uncertain'] as Undertone[]).map(u => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => handleApplyUserCorrection(selectedDepth, u)}
                          className={`py-1.5 px-2 rounded-lg text-xs capitalize border transition-colors ${
                            selectedUndertone === u
                              ? 'bg-brand-800 text-white border-brand-800 font-semibold'
                              : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-sand-500 italic">
                    Shade recommendations adapt instantly to manual corrections.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy guarantee reminder */}
          <div className="mt-4 text-[11px] text-sand-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Image pixels analysed entirely in temporary browser memory.</span>
          </div>
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
          onClick={() => onConfirm(analysisResult)}
          className="px-7 py-3 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
