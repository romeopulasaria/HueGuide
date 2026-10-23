export type SkinDepth =
  | 'very-fair'
  | 'fair'
  | 'light'
  | 'medium'
  | 'tan'
  | 'deep'
  | 'very-deep'
  | 'rich';

export type Undertone = 'warm' | 'cool' | 'neutral' | 'olive' | 'uncertain';

export type ComplexionSource = 'photo_analysis' | 'user_declared';
export type ColourSource = 'photo_measured' | 'user_selected' | 'none';

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'unsure';

export type SkinSensitivity = 'yes' | 'no' | 'unsure';

export type Coverage = 'sheer' | 'light' | 'medium' | 'full';

export type Finish = 'matte' | 'natural' | 'satin' | 'dewy';

export type ColorIntensity = 'subtle' | 'moderate' | 'bold';

export type Goal =
  | 'foundation'
  | 'concealer'
  | 'lipstick'
  | 'blush'
  | 'eyeshadow'
  | 'everyday-look'
  | 'outfit-match';

export type Occasion =
  | 'everyday'
  | 'office'
  | 'casual'
  | 'evening'
  | 'festive'
  | 'wedding'
  | 'experimental';

export type ProductCategory =
  | 'foundation'
  | 'concealer'
  | 'lipstick'
  | 'lipgloss'
  | 'blush'
  | 'eyeshadow';

export interface RGBColor {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

export interface CIELABColor {
  L: number; // 0 - 100 (lightness)
  a: number; // -128 - 127 (green to red)
  b: number; // -128 - 127 (blue to yellow)
}

export type ColourDataType =
  | 'brand_digital'
  | 'image_estimate'
  | 'physical_measurement'
  | 'lab_measured'
  | 'unavailable';

export type AvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'listed_only'
  | 'unknown';

export type CompletenessStatus =
  | 'complete_as_published'
  | 'complete'
  | 'partial'
  | 'ingredients_unavailable'
  | 'partial_highlights'
  | 'partial_disclosure';

export type DataQuality = 'high' | 'medium' | 'low' | 'conflicting';

export type DataStatus = 'research_seed' | 'verified' | 'demo';

export interface ColourData {
  type: ColourDataType;
  hex?: string | null;
  rgb?: RGBColor | null;
  lab?: CIELABColor | null;
  sourceUrl?: string;
  confidence?: 'high' | 'medium' | 'low';
}

export interface ProductEntity {
  productId: string;
  brand: string;
  productName: string;
  category: ProductCategory;
  subcategory: string;
  formulaVersion?: string;
  size?: string;
  sizeUnit?: string;
  finish: Finish | 'various' | 'unavailable';
  coverage?: Coverage | 'unavailable';
  skinTypePositioning?: string;
  ingredientRecordId?: string;
  productUrl?: string;
  dataStatus: DataStatus;
  description?: string;
}

export interface ShadeEntity {
  shadeId: string;
  productId: string;
  shadeCode?: string;
  shadeName: string;
  ingredientRecordId?: string;
  brandDepth?: string;
  brandUndertone?: string;
  inferredUndertone?: Undertone;
  inferenceConfidence?: 'high' | 'medium' | 'low';
  brandColourFamily?: string;
  digitalHex?: string | null;
  digitalRgb?: RGBColor | null;
  digitalLab?: CIELABColor | null;
  colourDataType: ColourDataType;
  colourMeaning?: 'website_display_swatch' | 'measured_pigment' | 'unvalidated';
  colourSourceUrl?: string;
  shadeSourceUrl?: string;
  dataQuality: DataQuality;
  targetDepth?: readonly SkinDepth[];
  targetUndertones?: readonly Undertone[];
}

export interface OfferEntity {
  offerId: string;
  productId: string;
  shadeId?: string;
  retailer: string;
  priceInr: number | null;
  mrpInr?: number | null;
  availabilityStatus: AvailabilityStatus;
  sourceUrl?: string;
  observedAt: string;
  notes?: string;
}

export interface IngredientRecordEntity {
  ingredientRecordId: string;
  productId: string;
  rawText: string;
  ingredients: string[];
  completenessStatus: CompletenessStatus;
  sourceUrl?: string;
  observedAt: string;
  formulaNotes?: string;
}

export interface Product {
  id: string;
  productId: string;
  shadeId: string;
  brand: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  shadeName: string;
  shadeCode?: string;
  shadeHex?: string | null;
  shadeLab?: CIELABColor | null;
  colourDataType: ColourDataType;
  price: number;
  mrp?: number | null;
  finish: Finish | 'various' | 'unavailable';
  coverage?: Coverage | 'unavailable';
  targetDepth?: readonly SkinDepth[];
  targetUndertones?: readonly Undertone[];
  suitableOccasions: readonly Occasion[];
  formulaAttributes: readonly string[];
  ingredients: readonly string[];
  ingredientRecordId?: string;
  ingredientCompleteness: CompletenessStatus;
  declaredAllergenTags: readonly string[];
  userPreferenceTags: readonly string[];
  availabilityStatus: AvailabilityStatus;
  retailer?: string;
  productUrl?: string;
  offerSourceUrl?: string;
  dataCompleteness: 'complete' | 'partial' | 'minimal';
  dataStatus: DataStatus;
  dataQuality: DataQuality;
  isDemonstration?: boolean;
  description: string;
  rawProduct?: ProductEntity;
  rawShade?: ShadeEntity;
  rawOffer?: OfferEntity;
  rawIngredients?: IngredientRecordEntity;
}

export interface SampledRegionData {
  hex: string;
  rgb: RGBColor;
  lab: CIELABColor;
  pixelCount: number;
}

export interface SkinAnalysisResult {
  depth: SkinDepth;
  undertone: Undertone;
  estimatedLab: CIELABColor | null;
  estimatedHex: string | null;
  confidence: number | null; // 0.0 - 1.0 (null for user_declared)
  confidenceRating: 'high' | 'moderate' | 'low' | 'uncertain' | null;
  confidenceReasons: string[];
  isCalibrated: boolean;
  calibrationFactor?: number;
  sampledRegions: {
    leftCheek?: SampledRegionData;
    rightCheek?: SampledRegionData;
    differenceDeltaE?: number;
  };
  manualAdjustmentMade: boolean;
  source: ComplexionSource;
  colourSource?: ColourSource;
}

export interface BeautyProfile {
  id?: string;
  skinProfile: SkinAnalysisResult;
  skinCharacteristics: {
    skinType: SkinType;
    sensitivity: SkinSensitivity;
    concerns: string[];
  };
  ingredientPreferences: {
    allergies: string[];
    avoidedSubstances: string[];
  };
  makeupPreferences: {
    preferredCoverage: Coverage;
    preferredFinish: Finish;
    preferredIntensity: ColorIntensity;
    preferredBrands: string[];
    excludedBrands: string[];
    defaultBudgetOverall: number;
    defaultBudgetCategory: Partial<Record<ProductCategory, number>>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IntendedUseRequest {
  goals: Goal[];
  occasion: Occasion;
  outfitColorHex?: string;
  outfitColorName?: string;
  sessionBudgetMax?: number;
  sessionBudgetCategory?: Partial<Record<ProductCategory, number>>;
}

export interface UserPreferences {
  skinType: SkinType;
  sensitivity: SkinSensitivity;
  concerns: string[];
  allergies: string[]; // Normalized strings
  avoidedSubstances: string[];
  preferredCoverage: Coverage;
  preferredFinish: Finish;
  preferredIntensity: ColorIntensity;
  preferredBrands: string[];
  excludedBrands: string[];
  budgetMaxOverall: number;
  budgetCategory: Partial<Record<ProductCategory, number>>;
  outfitColorHex?: string;
  outfitColorName?: string;
}

export interface UserProfile {
  goals: Goal[];
  intendedUse: Occasion;
  skinProfile: SkinAnalysisResult;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  // Optional normalized fields when used as BeautyProfile
  skinCharacteristics?: {
    skinType: SkinType;
    sensitivity: SkinSensitivity;
    concerns: string[];
  };
  ingredientPreferences?: {
    allergies: string[];
    avoidedSubstances: string[];
  };
  makeupPreferences?: {
    preferredCoverage: Coverage;
    preferredFinish: Finish;
    preferredIntensity: ColorIntensity;
    preferredBrands: string[];
    excludedBrands: string[];
    defaultBudgetOverall: number;
    defaultBudgetCategory: Partial<Record<ProductCategory, number>>;
  };
}

export interface RecommendationScoringDetails {
  shadeSimilarityScore?: number; // 0-100 (from CIEDE2000)
  undertoneScore?: number;       // 0-100
  depthScore?: number;           // 0-100
  colorHarmonyScore?: number;    // 0-100
  finishScore: number;           // 0-100
  coverageScore: number;         // 0-100
  formulaScore: number;          // 0-100
  brandPreferenceScore: number;  // 0-100
  priceScore: number;            // 0-100
}

export type RecommendationBadgeLabel =
  | 'Best Match'
  | 'Great Match'
  | 'Good Match'
  | 'Alternative'
  | 'More Experimental';

export interface RecommendationResult {
  product: Product;
  matchScore: number; // Composite 0 - 100
  recommendationConfidence: 'high' | 'moderate' | 'low';
  scoreBreakdown: RecommendationScoringDetails;
  deltaE?: number;
  similarityLabel?: string;
  badgeLabel?: RecommendationBadgeLabel;
  matchedReasons: string[];
  warnings: string[];
  dataQualityNotes: string[];
  harmonyType?: 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'undertone-harmony' | 'versatile';
}

export interface FullLookRecommendation {
  id: string;
  lookTitle: string;
  occasion: Occasion;
  description: string;
  cohesivePalette: {
    role: string;
    hex: string;
    name: string;
  }[];
  products: {
    role: 'base' | 'concealer' | 'blush' | 'lip' | 'eye';
    recommendation: RecommendationResult;
  }[];
  totalEstimatedPrice: number;
}
