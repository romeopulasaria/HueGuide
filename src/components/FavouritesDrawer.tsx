import React from 'react';
import { DEMO_PRODUCT_CATALOGUE } from '../data/catalogue';
import { X, Heart, Trash2 } from 'lucide-react';

interface FavouritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favouriteIds: string[];
  onRemoveFavourite: (id: string) => void;
  onClearFavourites: () => void;
}

export const FavouritesDrawer: React.FC<FavouritesDrawerProps> = ({
  isOpen,
  onClose,
  favouriteIds,
  onRemoveFavourite,
  onClearFavourites,
}) => {
  if (!isOpen) return null;

  const favouriteProducts = DEMO_PRODUCT_CATALOGUE.filter(p =>
    favouriteIds.includes(p.id)
  );

  const totalPrice = favouriteProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-sand-200 animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rosewood-600 fill-rosewood-600" />
            <h3 className="font-serif text-xl font-bold text-sand-950">
              Saved Favourites ({favouriteProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-200 text-sand-600 transition-colors"
            aria-label="Close favourites"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-grow space-y-3">
          {favouriteProducts.length === 0 ? (
            <div className="text-center py-16 text-sand-500 text-xs">
              <Heart className="w-10 h-10 text-sand-300 mx-auto mb-3" />
              <p className="font-medium text-sand-700">No favourites saved yet.</p>
              <p className="mt-1 text-sand-500">
                Click the heart icon on any product recommendation to save it here.
              </p>
            </div>
          ) : (
            favouriteProducts.map(p => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-sand-200 bg-sand-50/50 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {p.shadeHex ? (
                    <div
                      className="w-10 h-10 rounded-full shadow-inner border border-sand-300 flex-shrink-0"
                      style={{ backgroundColor: p.shadeHex }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sand-200 border border-dashed border-sand-300 flex-shrink-0 flex items-center justify-center text-[9px] text-sand-500 font-medium text-center">
                      No Swatch
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-sand-500 truncate">
                      {p.brand}
                    </div>
                    <div className="text-xs font-bold text-sand-950 truncate">{p.name}</div>
                    <div className="text-[11px] text-sand-600 font-mono">
                      {p.shadeName} • ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFavourite(p.id)}
                  className="p-2 text-sand-400 hover:text-rosewood-700 transition-colors flex-shrink-0"
                  title="Remove from favourites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with total & clear */}
        {favouriteProducts.length > 0 && (
          <div className="p-6 border-t border-sand-200 bg-sand-50 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-sand-700">
              <span>Total Estimated Cart:</span>
              <span className="font-mono text-base font-bold text-sand-950">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearFavourites}
                className="w-full py-2.5 rounded-full border border-sand-300 bg-white hover:bg-sand-100 text-xs font-medium text-sand-700 transition-colors"
              >
                Clear All Favourites
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
