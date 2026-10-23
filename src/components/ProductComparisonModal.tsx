import React from 'react';
import { RecommendationResult } from '../types';
import { X, Scale, Info, Sparkles } from 'lucide-react';

interface ProductComparisonModalProps {
  isOpen: boolean;
  comparingProducts: RecommendationResult[];
  onRemoveProduct: (productId: string) => void;
  onClose: () => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  comparingProducts,
  onRemoveProduct,
  onClose,
}) => {
  if (!isOpen || comparingProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-sand-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-700" />
              <h2 className="font-serif text-2xl font-bold text-sand-950">
                Side-by-Side Product Comparison
              </h2>
            </div>
            <p className="text-xs text-sand-600 mt-1">
              Comparing {comparingProducts.length} candidate products. Notice the trade-offs between price, finish, formula, and colour similarity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-200 text-sand-600 transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table / Grid Viewport */}
        <div className="p-6 overflow-x-auto flex-grow">
          {comparingProducts.length < 2 && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Select at least 2 products by clicking the scale icon on any product card to compare side-by-side.</span>
            </div>
          )}

          <div className="grid grid-flow-col auto-cols-[280px] sm:auto-cols-[300px] gap-4 min-w-full">
            {comparingProducts.map(rec => {
              const { product, matchScore, deltaE } = rec;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-sand-200 bg-white p-5 flex flex-col justify-between shadow-sm relative"
                >
                  {/* Remove pill */}
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-sand-400 hover:text-rosewood-700 hover:bg-sand-100 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="pr-6">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-sand-500">
                        {product.brand}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-sand-950 leading-tight">
                        {product.name}
                      </h4>
                      <div className="text-xs font-semibold text-brand-800 capitalize mt-0.5">
                        {product.category}
                      </div>
                    </div>

                    {/* Shade swatch & Hex */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-sand-50 border border-sand-200/80">
                      {product.shadeHex ? (
                        <div
                          className="w-10 h-10 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
                          style={{ backgroundColor: product.shadeHex }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sand-200 border border-dashed border-sand-300 flex-shrink-0 flex items-center justify-center text-[9px] text-sand-500 font-medium text-center">
                          No Swatch
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-sand-900 leading-tight">
                          {product.shadeCode ? `${product.shadeCode} - ` : ''}{product.shadeName}
                        </div>
                        <div className="text-[10px] font-mono text-sand-500 uppercase mt-0.5">
                          {product.shadeHex || 'Colour code only'}
                        </div>
                      </div>
                    </div>

                    {/* Overall Match Score */}
                    <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 text-xs">
                      <div className="flex items-center justify-between font-semibold text-brand-900 mb-1">
                        <span>Match Rating</span>
                        <span className="font-mono font-bold">{matchScore}/100</span>
                      </div>
                      {deltaE !== undefined ? (
                        <div className="text-[11px] text-brand-800 flex items-center justify-between">
                          <span>Shade Match (ΔE):</span>
                          <span className="font-mono font-semibold">{deltaE}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-sand-500 italic">
                          No digital colour (weighted via metadata)
                        </div>
                      )}
                    </div>

                    {/* Attributes Comparison List */}
                    <div className="text-xs space-y-2 border-t border-sand-100 pt-3">
                      <div className="flex justify-between py-1 border-b border-sand-50">
                        <span className="text-sand-500">Price & Offer:</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sand-950">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <div className="text-[10px] text-sand-500">
                            {product.retailer || 'Retailer offer'}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between py-1 border-b border-sand-50">
                        <span className="text-sand-500">Finish:</span>
                        <span className="capitalize font-semibold text-sand-800">{product.finish}</span>
                      </div>

                      {product.coverage && (
                        <div className="flex justify-between py-1 border-b border-sand-50">
                          <span className="text-sand-500">Coverage:</span>
                          <span className="capitalize font-semibold text-sand-800">{product.coverage}</span>
                        </div>
                      )}

                      <div className="py-1 border-b border-sand-50">
                        <span className="text-sand-500 block mb-1">Formula Highlights:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.formulaAttributes && product.formulaAttributes.length > 0 ? (
                            product.formulaAttributes.map(attr => (
                              <span
                                key={attr}
                                className="px-1.5 py-0.5 rounded bg-sand-100 text-[10px] text-sand-700 capitalize"
                              >
                                {attr}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-sand-400 italic">Standard formula</span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <span className="text-sand-500 block mb-1">Ingredients:</span>
                        <p className="text-[10px] text-sand-600 line-clamp-3 leading-relaxed">
                          {product.ingredients && product.ingredients.length > 0
                            ? product.ingredients.join(', ')
                            : 'Full ingredient list unavailable in research.'}
                        </p>
                      </div>
                    </div>

                    {/* Trade-Off Highlights */}
                    <div className="p-2.5 rounded-xl bg-sand-50 text-[11px] text-sand-700 leading-normal border border-sand-200">
                      <div className="font-semibold text-sand-900 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        Selected Trade-Off:
                      </div>
                      {deltaE !== undefined && deltaE < 3.0 ? (
                        <span>Provides excellent estimated shade proximity, though check finish suitability.</span>
                      ) : product.price < 1000 ? (
                        <span>Offers great price value within budget with reliable performance.</span>
                      ) : (
                        <span>Premium botanical formulation matching your finish preference.</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-sand-200 bg-sand-50 flex items-center justify-between text-xs text-sand-600">
          <div>
            Trade-off summary: Recommendation ranking balances colour difference, price, and formula compatibility.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-sand-900 hover:bg-black text-white text-xs font-medium"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
