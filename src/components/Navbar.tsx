import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { Heart, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
  onNavigateHome: () => void;
  favouritesCount: number;
  onOpenFavourites: () => void;
  onOpenProfileManager: () => void;
  onOpenPrivacy: () => void;
  hasStoredProfile: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
  onNavigateHome,
  favouritesCount,
  onOpenFavourites,
  onOpenProfileManager,
  onOpenPrivacy,
  hasStoredProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur-md border-b border-sand-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-sand-50 font-serif text-lg font-bold shadow-sm group-hover:bg-brand-800 transition-colors">
            H
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-sand-950 group-hover:text-brand-800 transition-colors">
              {APP_CONFIG.appName}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] tracking-wider uppercase font-semibold text-brand-600 bg-brand-100/80 px-1.5 py-0.5 rounded">
              Prototype
            </span>
          </div>
        </button>

        {/* Step Progress Bar / Label */}
        {stepLabel ? (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <span>{stepLabel}</span>
          </div>
        ) : currentStep !== undefined && totalSteps !== undefined && currentStep > 0 && currentStep <= totalSteps ? (
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-sand-600">
            <span>Step {currentStep} of {totalSteps}</span>
            <div className="w-24 h-1.5 bg-sand-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy badge button */}
          <button
            onClick={onOpenPrivacy}
            className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 px-2.5 py-1 rounded-full transition-colors"
            title="Privacy status: local processing only"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">100% Local</span>
          </button>

          {/* Favourites button */}
          <button
            onClick={onOpenFavourites}
            className="relative p-2 rounded-full text-sand-700 hover:text-brand-800 hover:bg-sand-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="View saved favourites"
            title="Saved Favourites"
          >
            <Heart className="w-5 h-5" />
            {favouritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rosewood-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {favouritesCount}
              </span>
            )}
          </button>

          {/* Profile & reset manager */}
          <button
            onClick={onOpenProfileManager}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              hasStoredProfile
                ? 'bg-brand-100 text-brand-900 border-brand-300 hover:bg-brand-200'
                : 'bg-sand-100 text-sand-700 border-sand-200 hover:bg-sand-200'
            }`}
            title="Manage saved profile and privacy settings"
          >
            {hasStoredProfile ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-brand-700" />
                <span className="hidden sm:inline">Profile Saved</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
