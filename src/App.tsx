import React, { useState, useEffect, useMemo } from 'react';
import {
  IntendedUseRequest,
  RecommendationResult,
  SkinAnalysisResult,
  UserProfile,
} from './types';
import { APP_CONFIG } from './config/appConfig';
import { buildFullLookRecommendation, getRecommendations } from './utils/recommendationEngine';
import {
  clearStoredFavourites,
  deleteStoredProfile,
  getStoredFavourites,
  loadStoredProfile,
  resetAllStoredData,
  saveStoredProfile,
  toggleStoredFavourite,
} from './utils/storage';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScreenWelcome } from './components/ScreenWelcome';
import { ScreenPhotoUpload } from './components/ScreenPhotoUpload';
import { ScreenSkinAnalysis } from './components/ScreenSkinAnalysis';
import { ScreenManualComplexion } from './components/ScreenManualComplexion';
import { ScreenPreferences } from './components/ScreenPreferences';
import { ScreenSummary } from './components/ScreenSummary';
import { ScreenIntendedUse } from './components/ScreenIntendedUse';
import { ScreenRecommendations } from './components/ScreenRecommendations';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { FavouritesDrawer } from './components/FavouritesDrawer';
import { ProfileManagementModal } from './components/ProfileManagementModal';
import { PrivacyModal } from './components/PrivacyModal';

type AppView =
  | 'welcome'
  | 'profile-upload'
  | 'profile-analysis'
  | 'profile-manual'
  | 'profile-preferences'
  | 'profile-confirm'
  | 'intended-use'
  | 'recommendations';

// Default initial state for a fresh profile
const DEFAULT_INITIAL_PROFILE: UserProfile = {
  goals: ['foundation', 'lipstick', 'everyday-look'],
  intendedUse: 'everyday',
  skinProfile: {
    depth: 'medium',
    undertone: 'warm',
    estimatedLab: null,
    estimatedHex: null,
    confidence: null,
    confidenceRating: null,
    confidenceReasons: ['Complexion declared manually by you.'],
    isCalibrated: false,
    sampledRegions: {},
    manualAdjustmentMade: false,
    source: 'user_declared',
    colourSource: 'none',
  },
  preferences: {
    skinType: 'normal',
    sensitivity: 'no',
    concerns: [],
    allergies: [],
    avoidedSubstances: [],
    preferredCoverage: 'medium',
    preferredFinish: 'natural',
    preferredIntensity: 'moderate',
    preferredBrands: [],
    excludedBrands: [],
    budgetMaxOverall: APP_CONFIG.defaultBudgets.overallMax,
    budgetCategory: { ...APP_CONFIG.defaultBudgets.categoryMax },
    outfitColorHex: undefined,
    outfitColorName: undefined,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_INTENDED_USE: IntendedUseRequest = {
  goals: ['foundation', 'lipstick', 'everyday-look'],
  occasion: 'everyday',
  outfitColorHex: undefined,
  outfitColorName: undefined,
  sessionBudgetMax: undefined,
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('welcome');

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = loadStoredProfile();
    return (saved as UserProfile) || DEFAULT_INITIAL_PROFILE;
  });

  // Today's Intended Use Request (What the user wants right now)
  const [intendedUseRequest, setIntendedUseRequest] = useState<IntendedUseRequest>(() => ({
    ...DEFAULT_INTENDED_USE,
    sessionBudgetMax: profile.preferences.budgetMaxOverall,
  }));

  // Uploaded photos in temporary memory
  const [uploadedPhotos, setUploadedPhotos] = useState<
    { id: string; url: string; file: File; name: string }[]
  >([]);

  // Favourites list
  const [favourites, setFavourites] = useState<string[]>(() => getStoredFavourites());

  // Products currently in side-by-side comparison
  const [comparingProducts, setComparingProducts] = useState<RecommendationResult[]>([]);

  // Modal / Drawer visibility states
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareWarning, setCompareWarning] = useState('');

  // Check if profile exists in localStorage
  const hasStoredProfile = useMemo(() => !!loadStoredProfile(), [profile]);

  // Clean up Object URLs when unmounting or clearing
  useEffect(() => {
    return () => {
      uploadedPhotos.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, []);

  // Compute live recommendations using Persistent Profile + Intended Use Request
  const recommendationData = useMemo(() => {
    return getRecommendations(profile, intendedUseRequest);
  }, [profile, intendedUseRequest]);

  // Compute coordinated full look
  const fullLook = useMemo(() => {
    if (intendedUseRequest.goals.includes('everyday-look')) {
      return buildFullLookRecommendation(profile, intendedUseRequest);
    }
    return null;
  }, [profile, intendedUseRequest]);

  // Photo Handlers (Memory Only)
  const handleAddPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    const newPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url,
      file,
      name: file.name,
    };
    setUploadedPhotos(prev => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleClearPhotos = () => {
    uploadedPhotos.forEach(p => URL.revokeObjectURL(p.url));
    setUploadedPhotos([]);
  };

  // Complexion Analysis handler
  const handleConfirmSkinAnalysis = (result: SkinAnalysisResult) => {
    setProfile(prev => ({
      ...prev,
      skinProfile: result,
      updatedAt: new Date().toISOString(),
    }));
    setCurrentView('profile-preferences');
  };

  // Preferences handler
  const handleUpdatePreferences = (updated: UserProfile['preferences']) => {
    setProfile(prev => ({
      ...prev,
      preferences: updated,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Confirm Profile handler
  const handleConfirmProfile = () => {
    saveStoredProfile(profile);
    // Transient photos are cleared from memory once derived analysis is confirmed
    handleClearPhotos();
    setCurrentView('intended-use');
  };

  // Intended Use Submission handler
  const handleSubmitIntendedUse = (request: IntendedUseRequest) => {
    setIntendedUseRequest(request);
    // Sync into profile intendedUse/goals for consistency
    setProfile(prev => ({
      ...prev,
      goals: request.goals,
      intendedUse: request.occasion,
      preferences: {
        ...prev.preferences,
        outfitColorHex: request.outfitColorHex,
        outfitColorName: request.outfitColorName,
        budgetMaxOverall: request.sessionBudgetMax || prev.preferences.budgetMaxOverall,
      },
    }));
    setCurrentView('recommendations');
  };

  // Favourites actions
  const handleToggleFavourite = (productId: string) => {
    const updated = toggleStoredFavourite(productId);
    setFavourites(updated);
  };

  const handleClearFavourites = () => {
    clearStoredFavourites();
    setFavourites([]);
  };

  // Comparison actions
  const handleToggleCompare = (rec: RecommendationResult) => {
    const exists = comparingProducts.some(p => p.product.id === rec.product.id);
    if (exists) {
      setComparingProducts(prev => prev.filter(p => p.product.id !== rec.product.id));
    } else {
      if (comparingProducts.length >= 4) {
        setCompareWarning('Comparison is limited to 4 products. Remove one to add another.');
        setTimeout(() => setCompareWarning(''), 3000);
        return;
      }
      setComparingProducts(prev => [...prev, rec]);
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setComparingProducts(prev => prev.filter(p => p.product.id !== productId));
  };

  // Persistence actions
  const handleSaveProfileLocally = () => {
    saveStoredProfile(profile);
  };

  const handleDeleteSavedProfile = () => {
    deleteStoredProfile();
  };

  const handleResetEntireApp = () => {
    handleClearPhotos();
    resetAllStoredData();
    setProfile(DEFAULT_INITIAL_PROFILE);
    setIntendedUseRequest(DEFAULT_INTENDED_USE);
    setFavourites([]);
    setComparingProducts([]);
    setCurrentView('welcome');
  };

  // Compute navigation header labels
  const navbarStepData = useMemo(() => {
    switch (currentView) {
      case 'profile-upload':
        return { stepLabel: 'Beauty Profile: Complexion Photo' };
      case 'profile-analysis':
        return { stepLabel: 'Beauty Profile: Complexion Sampling' };
      case 'profile-manual':
        return { stepLabel: 'Beauty Profile: Manual Complexion' };
      case 'profile-preferences':
        return { stepLabel: 'Beauty Profile: Skin & Preferences' };
      case 'profile-confirm':
        return { stepLabel: 'Beauty Profile: Review & Save' };
      case 'intended-use':
        return { stepLabel: "Today's Makeup Request" };
      case 'recommendations':
        return { stepLabel: 'Personalized Recommendations' };
      default:
        return {};
    }
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-sand-950 font-sans selection:bg-brand-200">
      {/* Top Navigation Bar */}
      <Navbar
        stepLabel={navbarStepData.stepLabel}
        onNavigateHome={() => setCurrentView('welcome')}
        favouritesCount={favourites.length}
        onOpenFavourites={() => setIsFavouritesOpen(true)}
        onOpenProfileManager={() => setIsProfileManagerOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        hasStoredProfile={hasStoredProfile}
      />

      {/* Main Content Viewport */}
      <main className="flex-grow">
        {currentView === 'welcome' && (
          <ScreenWelcome
            savedProfile={hasStoredProfile ? profile : null}
            onCreateProfile={() => setCurrentView('profile-upload')}
            onStartDailyRequest={() => setCurrentView('intended-use')}
            onEditProfile={() => setCurrentView('profile-preferences')}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onResetProfile={handleResetEntireApp}
          />
        )}

        {/* --- LAYER 1: PERSISTENT BEAUTY PROFILE SETUP & EDITING --- */}
        {currentView === 'profile-upload' && (
          <ScreenPhotoUpload
            photos={uploadedPhotos}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
            onAnalyze={() => setCurrentView('profile-analysis')}
            onSkipToManual={() => setCurrentView('profile-manual')}
            onBack={() => setCurrentView('welcome')}
          />
        )}

        {currentView === 'profile-analysis' && (
          <ScreenSkinAnalysis
            photoUrl={uploadedPhotos[0]?.url || null}
            initialResult={profile.skinProfile}
            onConfirm={handleConfirmSkinAnalysis}
            onBack={() => setCurrentView('profile-upload')}
            onSwitchToManual={() => setCurrentView('profile-manual')}
          />
        )}

        {currentView === 'profile-manual' && (
          <ScreenManualComplexion
            initialResult={profile.skinProfile}
            onConfirm={handleConfirmSkinAnalysis}
            onBack={() => setCurrentView('profile-upload')}
            onSwitchToPhoto={() => setCurrentView('profile-upload')}
          />
        )}

        {currentView === 'profile-preferences' && (
          <ScreenPreferences
            preferences={profile.preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onNext={() => setCurrentView('profile-confirm')}
            onBack={() =>
              setCurrentView(
                profile.skinProfile.source === 'photo_analysis'
                  ? 'profile-analysis'
                  : 'profile-manual'
              )
            }
          />
        )}

        {currentView === 'profile-confirm' && (
          <ScreenSummary
            profile={profile}
            onEditSection={section => {
              if (section === 'complexion') {
                setCurrentView(
                  profile.skinProfile.source === 'photo_analysis'
                    ? 'profile-upload'
                    : 'profile-manual'
                );
              } else {
                setCurrentView('profile-preferences');
              }
            }}
            onConfirmProfile={handleConfirmProfile}
            onBack={() => setCurrentView('profile-preferences')}
          />
        )}

        {/* --- LAYER 2: INTENDED USE REQUEST (WHAT THE USER WANTS TODAY) --- */}
        {currentView === 'intended-use' && (
          <ScreenIntendedUse
            profile={profile}
            initialRequest={intendedUseRequest}
            onEditProfile={() => setCurrentView('profile-preferences')}
            onSubmitRequest={handleSubmitIntendedUse}
            onBack={() => setCurrentView('welcome')}
          />
        )}

        {/* --- LAYER 3: RECOMMENDATIONS SCREEN --- */}
        {currentView === 'recommendations' && (
          <ScreenRecommendations
            profile={profile}
            request={intendedUseRequest}
            recommendations={recommendationData.recommendations}
            categoryRecommendations={recommendationData.categoryRecommendations}
            fullLook={fullLook}
            filteredOutCount={recommendationData.filteredOutCount}
            filterDiagnosticReasons={recommendationData.filterDiagnosticReasons}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
            comparingProducts={comparingProducts}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
            onChangeContext={() => setCurrentView('intended-use')}
            onEditProfile={() => setCurrentView('profile-preferences')}
            onStartAgain={() => setCurrentView('welcome')}
            compareWarning={compareWarning}
            onDismissCompareWarning={() => setCompareWarning('')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Modals & Slide-out Drawers */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        comparingProducts={comparingProducts}
        onRemoveProduct={handleRemoveFromCompare}
        onClose={() => setIsCompareModalOpen(false)}
      />

      <FavouritesDrawer
        isOpen={isFavouritesOpen}
        onClose={() => setIsFavouritesOpen(false)}
        favouriteIds={favourites}
        onRemoveFavourite={handleToggleFavourite}
        onClearFavourites={handleClearFavourites}
      />

      <ProfileManagementModal
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
        hasStoredProfile={hasStoredProfile}
        hasUploadedPhotos={uploadedPhotos.length > 0}
        onSaveProfileLocally={handleSaveProfileLocally}
        onClearUploadedPhotos={handleClearPhotos}
        onDeleteSavedProfile={handleDeleteSavedProfile}
        onClearFavourites={handleClearFavourites}
        onResetEntireApp={handleResetEntireApp}
        onEditProfile={() => setCurrentView('profile-preferences')}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};

export default App;
