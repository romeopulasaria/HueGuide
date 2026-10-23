import React, { useState } from 'react';
import { Product, RecommendationResult } from '../types';
import {
  Heart,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface ProductCardProps {
  recommendation: RecommendationResult;
  isFavourite: boolean;
  onToggleFavourite: (productId: string) => void;
  isComparing: boolean;
  onToggleCompare: (product: RecommendationResult) => void;
  onShowAlternatives?: (product: Product) => void;
  showDebugMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  recommendation,
  isFavourite,
  onToggleFavourite,
  isComparing,
  onToggleCompare,
  onShowAlternatives,
  showDebugMode = false,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDebugExpanded, setIsDebugExpanded] = useState(showDebugMode);

  const {
    product,
    matchScore,
    recommendationConfidence,
    scoreBreakdown,
    deltaE,
    matchedReasons,
    warnings,
    badgeLabel,
  } = recommendation;

  const availabilityBadge = () => {
    switch (product.availabilityStatus) {
      case 'available':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-medium">
            In Stock
          </span>
        );
      case 'unavailable':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium">
            Out of Stock
          </span>
        );
      case 'listed_only':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
            Available Online
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-700 border border-sand-200 text-[10px] font-medium">
            In Catalogue
          </span>
        );
    }
  };

  const renderMatchBadge = () => {
    const badge = badgeLabel || 'Good Match';
    switch (badge) {
      case 'Best Match':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Best Match</span>
          </span>
        );
      case 'Great Match':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-900 border border-brand-200 text-xs font-semibold shadow-xs">
            <span>Great Match</span>
          </span>
        );
      case 'Good Match':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-100 text-sand-800 border border-sand-200 text-xs font-medium">
            <span>Good Match</span>
          </span>
        );
      case 'More Experimental':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-medium">
            <span>More Experimental</span>
          </span>
        );
      case 'Alternative':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-50 text-sand-600 border border-sand-200 text-xs font-medium">
            <span>Alternative</span>
          </span>
        );
    }
  };

  // Check if we have an authentic digital color swatch
  const hasDigitalSwatch = Boolean(
    product.shadeHex &&
    product.shadeHex.startsWith('#') &&
    (product.colourDataType === 'brand_digital' || product.colourDataType === 'lab_measured')
  );

  // Clean consumer reasons (max 3, filtering out internal technical terminology)
  const consumerReasons = matchedReasons
    .filter(
      r =>
        !r.includes('CIEDE') &&
        !r.includes('ΔE') &&
        !r.includes('digital shade swatch is unavailable') &&
        !r.includes('research records')
    )
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Card Header & Brand */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sand-500">
                {product.brand}
              </span>
              {availabilityBadge()}
            </div>
            <h3 className="font-serif text-lg font-bold text-sand-950 leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            {/* Compare toggle */}
            <button
              type="button"
              onClick={() => onToggleCompare(recommendation)}
              className={`p-2 rounded-full transition-colors ${
                isComparing
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'text-sand-400 hover:text-brand-800 hover:bg-sand-100'
              }`}
              title={isComparing ? 'Remove from comparison' : 'Compare product'}
              aria-label="Toggle comparison"
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favourite toggle */}
            <button
              type="button"
              onClick={() => onToggleFavourite(product.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavourite
                  ? 'text-rosewood-600 bg-rosewood-50'
                  : 'text-sand-400 hover:text-rosewood-600 hover:bg-sand-100'
              }`}
              title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
              aria-label="Toggle favourite"
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-rosewood-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Shade Swatch & Price Row */}
        <div className="flex items-center justify-between py-3 my-2 border-y border-sand-100">
          <div className="flex items-center gap-3">
            {hasDigitalSwatch ? (
              <div
                className="w-10 h-10 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
                style={{ backgroundColor: product.shadeHex! }}
                title={`Digital Swatch: ${product.shadeHex}`}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl bg-sand-100 border border-sand-200/80 flex items-center justify-center text-sand-400 flex-shrink-0"
                title="Shade chosen based on brand depth and undertone metadata."
              >
                <Tag className="w-4 h-4 text-sand-400" />
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-sand-950 leading-tight">
                {product.shadeCode ? `Shade ${product.shadeCode} · ` : ''}
                {product.shadeName}
              </div>
              <div className="text-[11px] text-sand-500 mt-0.5">
                {hasDigitalSwatch ? (
                  <span className="text-brand-800 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-600" />
                    Estimated colour match
                  </span>
                ) : (
                  <span>Chosen based on undertone & occasion</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-bold text-sand-950 font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-sand-500 truncate max-w-[110px]">
              {product.retailer || 'Retail Price'}
            </div>
          </div>
        </div>

        {/* Recommendation Label & Formulation Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          {renderMatchBadge()}
          <span className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 capitalize font-medium">
            {product.finish} finish
          </span>
          {product.coverage && (
            <span className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 capitalize font-medium">
              {product.coverage} coverage
            </span>
          )}
        </div>

        {/* Human-Readable "Why We Picked It" Highlights */}
        <div className="p-3 rounded-xl bg-sand-50/80 border border-sand-200/70 text-xs space-y-1.5 mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-sand-600 mb-0.5">
            Why we picked it
          </div>
          {consumerReasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-1.5 text-sand-800 leading-tight">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Warnings (if any) */}
        {warnings.length > 0 && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] mb-3 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>{warnings[0]}</div>
          </div>
        )}

        {/* Action link for alternatives */}
        {onShowAlternatives && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => onShowAlternatives(product)}
              className="text-xs text-brand-800 hover:text-brand-950 font-semibold flex items-center gap-1 py-0.5 hover:underline transition-all"
            >
              <span>See alternatives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Expandable Product Details & Ingredients (with hidden Developer Details) */}
      <div className="border-t border-sand-100 bg-sand-50/40 p-4 pt-3">
        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-sand-700 hover:text-sand-950 transition-colors py-1"
        >
          <span>Product details & ingredients</span>
          {isDetailsOpen ? <ChevronUp className="w-4 h-4 text-sand-500" /> : <ChevronDown className="w-4 h-4 text-sand-500" />}
        </button>

        {isDetailsOpen && (
          <div className="mt-3 pt-3 border-t border-sand-200/80 text-xs space-y-3 animate-fade-in">
            <p className="text-sand-600 leading-relaxed text-[11px]">
              {product.description}
            </p>

            {/* Ingredients Summary */}
            <div className="text-[11px] text-sand-600 leading-normal bg-white p-2.5 rounded-xl border border-sand-200/80">
              <span className="font-semibold text-sand-800 block mb-0.5">Ingredients:</span>
              {product.ingredients && product.ingredients.length > 0
                ? product.ingredients.join(', ')
                : 'Ingredient disclosures unavailable in research records.'}
            </div>

            {/* External Product Link */}
            {product.productUrl && (
              <div className="pt-0.5">
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800 hover:text-brand-950 underline"
                >
                  <span>View official product information</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Discrete Developer Details Toggle (Section 21) */}
            <div className="pt-2 border-t border-sand-200/60">
              <button
                type="button"
                onClick={() => setIsDebugExpanded(!isDebugExpanded)}
                className="text-[10px] uppercase font-mono text-sand-500 hover:text-sand-800 flex items-center gap-1 transition-colors"
              >
                <span>Developer details</span>
                <span>{isDebugExpanded ? '▲' : '▾'}</span>
              </button>

              {isDebugExpanded && (
                <div className="mt-2 p-2.5 rounded-xl bg-sand-100 text-[10px] font-mono space-y-1.5 border border-sand-300">
                  <div className="flex justify-between font-bold text-sand-900 border-b border-sand-200 pb-1">
                    <span>Internal Match Score:</span>
                    <span>{matchScore}/100</span>
                  </div>
                  {deltaE !== undefined && (
                    <div className="flex justify-between text-sand-700">
                      <span>CIEDE2000 ΔE:</span>
                      <span>{deltaE}</span>
                    </div>
                  )}
                  {scoreBreakdown.shadeSimilarityScore !== undefined && (
                    <div className="flex justify-between text-sand-600">
                      <span>Shade Match Score:</span>
                      <span>{scoreBreakdown.shadeSimilarityScore}/100</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sand-600">
                    <span>Undertone Alignment:</span>
                    <span>{scoreBreakdown.undertoneScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sand-600">
                    <span>Finish Preference:</span>
                    <span>{scoreBreakdown.finishScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sand-600">
                    <span>Formula & Skin:</span>
                    <span>{scoreBreakdown.formulaScore}/100</span>
                  </div>
                  <div className="text-sand-500 pt-1 border-t border-sand-200">
                    Status: {product.dataStatus} • Confidence: {recommendationConfidence}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
