import React, { useState } from 'react';
import {
  BeautyProfile,
  FullLookRecommendation,
  IntendedUseRequest,
  Product,
  ProductCategory,
  RecommendationResult,
  UserProfile,
} from '../types';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  Scale,
  RotateCcw,
  AlertCircle,
  Palette,
  Edit3,
  Calendar,
  X,
  Check,
  ArrowRight,
} from 'lucide-react';

interface ScreenRecommendationsProps {
  profile: BeautyProfile | UserProfile;
  request: IntendedUseRequest;
  recommendations: RecommendationResult[];
  categoryRecommendations: Record<ProductCategory, RecommendationResult[]>;
  fullLook: FullLookRecommendation | null;
  filteredOutCount: number;
  filterDiagnosticReasons: string[];
  favourites: string[];
  onToggleFavourite: (productId: string) => void;
  comparingProducts: RecommendationResult[];
  onToggleCompare: (rec: RecommendationResult) => void;
  onOpenCompareModal: () => void;
  onChangeContext: () => void;
  onEditProfile: () => void;
  onStartAgain: () => void;
  compareWarning?: string;
  onDismissCompareWarning?: () => void;
}

export const ScreenRecommendations: React.FC<ScreenRecommendationsProps> = ({
  profile,
  request,
  recommendations,
  categoryRecommendations,
  fullLook,
  filterDiagnosticReasons,
  favourites,
  comparingProducts,
  onToggleFavourite,
  onToggleCompare,
  onOpenCompareModal,
  onChangeContext,
  onEditProfile,
  onStartAgain,
  compareWarning,
  onDismissCompareWarning,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false);
  const [showDebugMode, setShowDebugMode] = useState<boolean>(false);

  // Active full look state (allows user to swap items live in the look)
  const [activeLook, setActiveLook] = useState<FullLookRecommendation | null>(fullLook);

  // State for the "See Alternatives / Swap" drawer/modal
  const [alternativesTarget, setAlternativesTarget] = useState<{
    role?: 'base' | 'concealer' | 'blush' | 'lip' | 'eye';
    category: ProductCategory;
    currentProduct: Product;
  } | null>(null);

  const activeCategories = (Object.keys(categoryRecommendations) as ProductCategory[]).filter(
    cat => categoryRecommendations[cat].length > 0
  );

  const displayedRecommendations =
    selectedCategory === 'all'
      ? recommendations
      : categoryRecommendations[selectedCategory as ProductCategory] || [];

  // Break recommendations into customer-facing tiers:
  // 1. Top Picks (3-5 strongest recommendations)
  // 2. More Good Options (5-10 solid recommendations)
  // 3. Explore More (the rest of the surviving catalogue)
  const TOP_PICKS_COUNT = selectedCategory === 'all' ? 4 : 3;
  const MORE_OPTIONS_COUNT = selectedCategory === 'all' ? 8 : 6;

  const topPicks = displayedRecommendations.slice(0, TOP_PICKS_COUNT);
  const moreOptions = displayedRecommendations.slice(TOP_PICKS_COUNT, TOP_PICKS_COUNT + MORE_OPTIONS_COUNT);
  const exploreMore = displayedRecommendations.slice(TOP_PICKS_COUNT + MORE_OPTIONS_COUNT);

  const occasionLabel = request.occasion.charAt(0).toUpperCase() + request.occasion.slice(1);
  const hasEverydayLook = request.goals.includes('everyday-look');

  const skin = profile.skinProfile;
  const budget =
    request.sessionBudgetMax ||
    profile.makeupPreferences?.defaultBudgetOverall ||
    (profile as any).preferences?.budgetMaxOverall ||
    2500;

  // Handle opening alternatives for a product or look role
  const handleOpenAlternatives = (
    product: Product,
    role?: 'base' | 'concealer' | 'blush' | 'lip' | 'eye'
  ) => {
    setAlternativesTarget({
      role,
      category: product.category,
      currentProduct: product,
    });
  };

  // Handle swapping an alternative product into the active full look
  const handleSwapIntoLook = (newRec: RecommendationResult) => {
    if (!activeLook || !alternativesTarget?.role) return;

    const updatedProducts = activeLook.products.map(p => {
      if (p.role === alternativesTarget.role) {
        return {
          role: p.role,
          recommendation: newRec,
        };
      }
      return p;
    });

    const newTotalPrice = updatedProducts.reduce((sum, item) => sum + item.recommendation.product.price, 0);

    setActiveLook({
      ...activeLook,
      products: updatedProducts,
      totalEstimatedPrice: newTotalPrice,
    });

    setAlternativesTarget(null);
  };

  // Alternatives to display in drawer (matching category, excluding current product)
  const currentAlternatives = alternativesTarget
    ? (categoryRecommendations[alternativesTarget.category] || []).filter(
        r => r.product.id !== alternativesTarget.currentProduct.id
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* 1. Header & Request Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-sand-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Curated Recommendations
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sand-950">
            {hasEverydayLook ? `Your ${occasionLabel} Look` : `${occasionLabel} Recommendations`}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-sand-600 mt-2 font-medium">
            <span>
              For your{' '}
              <strong className="text-sand-950 capitalize">
                {skin.depth} · {skin.undertone === 'uncertain' ? 'Balanced' : skin.undertone}
              </strong>{' '}
              complexion
            </span>
            <span>•</span>
            <span className="capitalize">{request.occasion} wear</span>
            <span>•</span>
            <span>Up to ₹{budget.toLocaleString('en-IN')}</span>
            {request.outfitColorHex && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 bg-sand-100 px-2 py-0.5 rounded text-sand-800">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: request.outfitColorHex }}
                  />
                  <span>{request.outfitColorName || 'Outfit colour'}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onChangeContext}
            className="px-4 py-2 rounded-full border border-brand-300 bg-brand-50 hover:bg-brand-100 text-xs font-semibold text-brand-900 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-700" />
            <span>Change today's request</span>
          </button>

          <button
            type="button"
            onClick={onEditProfile}
            className="px-4 py-2 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-xs font-medium text-sand-800 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-sand-600" />
            <span>Edit profile</span>
          </button>

          <button
            type="button"
            onClick={onStartAgain}
            className="px-4 py-2 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-xs font-medium text-sand-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* 2. Concise Context Statement (Section 6) */}
      <div className="mb-8 p-4 rounded-2xl bg-sand-100/70 border border-sand-200/80 text-xs text-sand-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
          </div>
          <p className="leading-relaxed">
            We matched these products to your complexion, preferences and today's occasion.{' '}
            <span className="text-sand-500">
              Colour matching is based on the information available for each shade.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowDebugMode(!showDebugMode)}
            className="text-[10px] uppercase font-mono tracking-wider text-sand-500 hover:text-sand-800 px-2 py-1 rounded border border-sand-300/80 hover:bg-white transition-colors"
          >
            {showDebugMode ? 'Developer Mode: ON' : 'Developer Mode: OFF'}
          </button>
        </div>
      </div>

      {/* 3. Coordinated Full-Look Ensemble (Sections 11 & 12) */}
      {activeLook && selectedCategory === 'all' && (
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sand-100/90 via-sand-50 to-brand-50/60 border border-brand-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-800 mb-1 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-brand-700" />
                Coordinated Full-Look
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-950">
                {activeLook.lookTitle}
              </h2>
              <p className="text-xs text-sand-600 mt-1 max-w-xl">
                {activeLook.description}
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-sand-200 sm:pl-6">
              <div className="text-xs text-sand-500 uppercase tracking-wider font-medium">
                Total Look Estimate
              </div>
              <div className="text-2xl font-bold text-sand-950 font-mono">
                ₹{activeLook.totalEstimatedPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Palette Color Strip */}
          <div className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-sm mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sand-500 block mb-2.5">
              Coordinated Palette:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeLook.cohesivePalette.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-sand-50 border border-sand-100">
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-sand-200 flex-shrink-0"
                    style={{ backgroundColor: p.hex }}
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-semibold text-sand-800 truncate">{p.role}</div>
                    <div className="text-[10px] text-sand-500 truncate">{p.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Look Ensemble Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeLook.products.map(item => (
              <div key={item.recommendation.product.id} className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sand-600 capitalize">
                    {item.role === 'base' ? 'Foundation' : item.role === 'lip' ? 'Lip' : item.role === 'blush' ? 'Cheeks' : item.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenAlternatives(item.recommendation.product, item.role)}
                    className="text-[11px] text-brand-800 hover:text-brand-950 font-semibold underline"
                  >
                    Swap product
                  </button>
                </div>
                <ProductCard
                  recommendation={item.recommendation}
                  isFavourite={favourites.includes(item.recommendation.product.id)}
                  onToggleFavourite={onToggleFavourite}
                  isComparing={comparingProducts.some(p => p.product.id === item.recommendation.product.id)}
                  onToggleCompare={onToggleCompare}
                  onShowAlternatives={prod => handleOpenAlternatives(prod, item.role)}
                  showDebugMode={showDebugMode}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Category Tabs (Section 3: No misleading giant number counts) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            setShowAllExpanded(false);
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
          }`}
        >
          All Recommendations
        </button>

        {activeCategories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setShowAllExpanded(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-900 text-white shadow-sm'
                : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
            }`}
          >
            {cat === 'lipstick' ? 'Lipsticks' : cat === 'lipgloss' ? 'Lip Gloss' : cat === 'foundation' ? 'Foundation' : cat}
          </button>
        ))}
      </div>

      {/* 5. Empty State Diagnostic (When no products survive filters) */}
      {displayedRecommendations.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sand-200 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-sand-950 mb-2">
            No Products Match Your Exact Settings
          </h3>
          <p className="text-xs text-sand-600 leading-relaxed mb-6">
            We strictly respect your declared price ceiling and allergen exclusions, without guessing or fabricating matches.
          </p>

          {filterDiagnosticReasons.length > 0 && (
            <div className="text-left bg-sand-50 p-4 rounded-2xl border border-sand-200 mb-6 text-xs space-y-1.5">
              <span className="font-semibold text-sand-800 block mb-1">
                Filter reasons:
              </span>
              {filterDiagnosticReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-sand-600">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onChangeContext}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-xs font-medium"
            >
              Adjust Today's Budget / Look
            </button>
            <button
              type="button"
              onClick={onEditProfile}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-sand-300 hover:bg-sand-100 text-sand-800 text-xs font-medium"
            >
              Edit Profile Settings
            </button>
          </div>
        </div>
      ) : (
        /* 6. Tiered Results Display (Sections 3 & 10) */
        <div className="space-y-10">
          {/* TIER 1: TOP PICKS (3-5 items) */}
          {topPicks.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-950">
                  Top Picks
                </h2>
                <p className="text-xs text-sand-600">
                  Our highest-confidence selections aligned directly with your complexion and preferences.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPicks.map(rec => (
                  <ProductCard
                    key={rec.product.id}
                    recommendation={rec}
                    isFavourite={favourites.includes(rec.product.id)}
                    onToggleFavourite={onToggleFavourite}
                    isComparing={comparingProducts.some(p => p.product.id === rec.product.id)}
                    onToggleCompare={onToggleCompare}
                    onShowAlternatives={prod => handleOpenAlternatives(prod)}
                    showDebugMode={showDebugMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TIER 2: MORE GOOD OPTIONS (5-10 items) */}
          {moreOptions.length > 0 && (
            <div>
              <div className="mb-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand-950">
                  More Good Options
                </h3>
                <p className="text-xs text-sand-600">
                  Flattering alternatives suited to your undertone, finish, and budget.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {moreOptions.map(rec => (
                  <ProductCard
                    key={rec.product.id}
                    recommendation={rec}
                    isFavourite={favourites.includes(rec.product.id)}
                    onToggleFavourite={onToggleFavourite}
                    isComparing={comparingProducts.some(p => p.product.id === rec.product.id)}
                    onToggleCompare={onToggleCompare}
                    onShowAlternatives={prod => handleOpenAlternatives(prod)}
                    showDebugMode={showDebugMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TIER 3: EXPLORE MORE (Expandable Section 3) */}
          {exploreMore.length > 0 && (
            <div className="pt-4 pb-8 text-center border-t border-sand-200">
              {!showAllExpanded ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAllExpanded(true)}
                    className="px-6 py-3 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-sand-800 text-xs font-semibold shadow-xs transition-all inline-flex items-center gap-2"
                  >
                    <span>Browse remaining catalogue ({exploreMore.length} more)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[11px] text-sand-500 mt-2">
                    Additional products that meet your filters with varying finish and shade profiles.
                  </p>
                </div>
              ) : (
                <div className="text-left animate-fade-in">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-sand-950">
                        Remaining Catalogue Options
                      </h3>
                      <p className="text-xs text-sand-600">
                        All surviving catalogue products matching your budget and allergy constraints.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllExpanded(false)}
                      className="text-xs text-brand-800 hover:text-brand-950 font-semibold underline"
                    >
                      Collapse extra options
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exploreMore.map(rec => (
                      <ProductCard
                        key={rec.product.id}
                        recommendation={rec}
                        isFavourite={favourites.includes(rec.product.id)}
                        onToggleFavourite={onToggleFavourite}
                        isComparing={comparingProducts.some(p => p.product.id === rec.product.id)}
                        onToggleCompare={onToggleCompare}
                        onShowAlternatives={prod => handleOpenAlternatives(prod)}
                        showDebugMode={showDebugMode}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. Alternatives / Swap Modal Drawer (Section 12 & 13) */}
      {alternativesTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sand-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-sand-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-sand-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-brand-800 font-semibold block mb-0.5">
                  Alternative Options
                </span>
                <h3 className="font-serif text-2xl font-bold text-sand-950">
                  Alternatives for {alternativesTarget.currentProduct.name}
                </h3>
                <p className="text-xs text-sand-600 mt-0.5">
                  Current shade: {alternativesTarget.currentProduct.shadeName} (₹{alternativesTarget.currentProduct.price})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAlternativesTarget(null)}
                className="p-2 rounded-full text-sand-400 hover:text-sand-700 hover:bg-sand-100 transition-colors"
                aria-label="Close alternatives modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternatives List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              {currentAlternatives.length === 0 ? (
                <div className="text-center py-8 text-xs text-sand-600">
                  No other alternatives found in this category matching your current budget and allergen filters.
                </div>
              ) : (
                currentAlternatives.slice(0, 6).map(alt => (
                  <div
                    key={alt.product.id}
                    className="p-4 rounded-2xl border border-sand-200 hover:border-brand-300 bg-sand-50/50 hover:bg-brand-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      {alt.product.shadeHex ? (
                        <div
                          className="w-10 h-10 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
                          style={{ backgroundColor: alt.product.shadeHex }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-sand-200/80 border border-sand-300 flex items-center justify-center text-xs text-sand-600 font-medium flex-shrink-0">
                          {alt.product.category.slice(0, 3)}
                        </div>
                      )}
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-sand-500">
                          {alt.product.brand}
                        </div>
                        <div className="text-sm font-bold text-sand-950">
                          {alt.product.name}
                        </div>
                        <div className="text-xs text-sand-700">
                          {alt.product.shadeCode ? `Shade ${alt.product.shadeCode} · ` : ''}
                          {alt.product.shadeName} • ₹{alt.product.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {alternativesTarget.role && (
                        <button
                          type="button"
                          onClick={() => handleSwapIntoLook(alt)}
                          className="px-4 py-2 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Use in Look</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onToggleCompare(alt);
                        }}
                        className="px-3.5 py-2 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-sand-700 text-xs font-medium transition-colors"
                      >
                        Compare
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-sand-200 bg-sand-50 flex justify-end">
              <button
                type="button"
                onClick={() => setAlternativesTarget(null)}
                className="px-5 py-2 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-sand-800 text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Compare Warning Toast */}
      {compareWarning && (
        <div className="fixed bottom-24 inset-x-4 max-w-xl mx-auto z-50 bg-sand-950 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between border border-sand-700 animate-fade-in text-xs">
          <span className="font-medium">{compareWarning}</span>
          {onDismissCompareWarning && (
            <button
              type="button"
              onClick={onDismissCompareWarning}
              className="ml-3 p-1 text-sand-400 hover:text-white transition-colors"
              aria-label="Dismiss warning"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* 9. Floating Comparison Dock */}
      {comparingProducts.length > 0 && (
        <aside
          aria-label="Product comparison drawer"
          className="fixed bottom-6 inset-x-4 max-w-2xl mx-auto z-40 bg-sand-950 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-sand-800 animate-slide-up"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">
                {comparingProducts.length} Product{comparingProducts.length > 1 ? 's' : ''} Selected
              </div>
              <div className="text-[11px] text-sand-400">
                Compare price, finish, ingredients, and shade match
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCompareModal}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow"
            >
              Compare Side-by-Side
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
