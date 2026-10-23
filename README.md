# HueGuide — Personalized Makeup Recommendation Web Application

HueGuide is an applied computer-vision and colour-science prototype that delivers personalized, explainable makeup shade and product recommendations. It evaluates user complexion, preferences, intended occasion, allergen exclusions, and budget to match products from a local demonstration catalogue.

---

## Table of Contents

1. [Product Vision & Overview](#product-vision--overview)
2. [Key Features & Implemented Flow](#key-features--implemented-flow)
3. [Technology Stack & Architecture](#technology-stack--architecture)
4. [Installation & Local Execution](#installation--local-execution)
5. [The Colour-Science Pipeline](#the-colour-science-pipeline)
6. [The Recommendation Engine](#the-recommendation-engine)
7. [Product Catalogue Architecture](#product-catalogue-architecture)
   - [Catalogue Data Structure](#catalogue-data-structure)
   - [How to Add New Products](#how-to-add-new-products)
   - [How to Modify Recommendation Weights](#how-to-modify-recommendation-weights)
8. [Privacy Architecture & Image Handling](#privacy-architecture--image-handling)
9. [Limitations & Commercial Launch Roadmap](#limitations--commercial-launch-roadmap)
10. [Automated Testing & Validation](#automated-testing--validation)

---

## 1. Product Vision & Overview

HueGuide is designed to solve a fundamental challenge in beauty tech: **helping users select daily makeup products that match their complexion, preferences, and occasion, accompanied by clear, transparent explanations of why each product was chosen.**

### The Value Proposition
> *"Makeup recommendations that account for your complexion, preferences, occasion, and budget, with a clear explanation of why each product was selected."*

### Configurable Product Name
The product name is centrally configured in [`src/config/appConfig.ts`](file:///src/config/appConfig.ts). Updating `APP_CONFIG.appName` updates the brand across all screens, headers, footers, and modal disclosures.

---

## 2. Key Features & Refactored User Journey

The application is structured into two decoupled, distinct layers:

### LAYER 1 — PERSISTENT BEAUTY PROFILE (WHO THE USER IS)
Represents stable, persistent characteristics created once and edited when needed:
* **Complexion Profile**:
  - Image-based HTML5 canvas pixel sampling with interactive draggable/clickable Left & Right cheek reticles.
  - Robust median pixel extraction and glare/shadow outlier rejection.
  - Linearized sRGB $\to$ CIE XYZ (D65) $\to$ CIELAB ($L^*, a^*, b^*$).
  - Bilateral cheek consistency check ($\Delta E_{00}$) and lighting confidence rating (*high, moderate, low, uncertain*).
  - Optional neutral reference-card white-balance calibration.
  - Broad lightness bands (Fair, Light, Medium, Tan, Deep, Rich).
  - Undertone heuristics (Warm, Cool, Neutral, Olive).
  - Manual overrides allowing instant user corrections without re-sampling.
* **Skin Characteristics & Sensitivities**:
  - Skin type: Dry, Normal, Combination, Oily, Unsure.
  - Sensitivity: Yes, No, Unsure.
  - User-declared concerns (e.g. visible redness, uneven tone, dark circles, blemishes). Non-clinical: no medical diagnosis is inferred from photographs.
* **Ingredient Preferences & Allergens**:
  - Strict allergen exclusions and avoided substances (e.g. fragrance, parabens, silicones, sulfates, talc, essential oils, tree nuts, phenoxyethanol, mica).
* **Makeup Formulation & Baseline Budget**:
  - Preferred finish (matte, natural, satin, dewy), coverage (sheer, light, medium, full), and intensity (subtle, moderate, bold).
  - Preferred brands and excluded brands.
  - Baseline default budget (INR ₹500–₹5,000) with optional independent category limits.
* **Persistence**:
  - Persisted in `localStorage` under `hueguide_user_profile`.
  - Facial photographs remain strictly transient in browser RAM via Blob URLs and are revoked/cleared once the profile is confirmed.

---

### LAYER 2 — INTENDED USE REQUEST (WHAT THE USER WANTS RIGHT NOW)
Represents the lightweight, recurring daily session request:
* **What are you looking for today?**:
  - Goals: Find my foundation shade, Find my concealer shade, Choose a lipstick or gloss, Choose a blush, Choose an eyeshadow palette, Build an everyday makeup look, Find makeup to complement an outfit.
* **Context & Occasion**:
  - Everyday/natural, Office/professional, Casual outing, Dinner/evening, Festive, Wedding guest, Experimenting with colours.
* **Outfit Colour Harmonization (Optional)**:
  - Interactive colour picker + curated named fabric presets (Emerald Green, Royal Navy, Ruby Crimson, Mustard Ochre, Dusty Rose, Warm Terracotta, Champagne Gold, Deep Plum, Classic Black, Ivory White).
* **Session Budget Adjustment (Optional)**:
  - Default uses the profile's baseline budget, with an optional session adjustment slider.

---

### USER JOURNEY FLOW

1. **Welcome Screen**:
   - *First-time user*: Headline, value proposition, "Create my Beauty Profile" CTA, local privacy assurance, and medical disclaimer.
   - *Returning user*: Displays a compact **Beauty Profile Card** (swatch, depth, undertone, skin type, finish, coverage, budget, allergen count) with a primary **"Find Makeup for Today"** CTA (straight to Intended Use) and **"Edit Beauty Profile"** secondary CTA.
2. **Create / Edit Beauty Profile**:
   - Complexion $\to$ Skin & Allergens $\to$ Formulation & Budget $\to$ Confirm Profile (saves to `localStorage` and discards photo memory).
3. **What Are You Looking for Today? (Intended Use)**:
   - Goals $\to$ Occasion $\to$ Outfit colour $\to$ Session budget adjustment.
4. **Personalized Recommendations**:
   - Filtered candidate cards with CIEDE2000 shade similarity ($\Delta E_{00}$), finish/coverage badges, expandable scoring breakdown explanations, full-look ensemble, comparison modal, and favourites drawer.
   - Actions to "Change Today's Request" or "Edit Beauty Profile".

---

## 3. Technology Stack & Architecture

- **Framework**: React 18 with TypeScript (strict mode enabled)
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS with an editorial beauty-tech palette (sand, brand warm ochre, rosewood)
- **Icons**: Lucide React
- **Unit Testing**: Vitest with node/browser-safe mocks
- **Image Processing**: Native HTML5 Canvas API (browser-local)

### Project Directory Structure
```
intelligent-tesla/
├── index.html                     # HTML5 root with Google Fonts
├── package.json                   # Dependencies, scripts (dev, test, build)
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Editorial warm-neutral palette & typography
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite & Vitest configuration
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Central workflow orchestrator & state
│   ├── index.css                  # Tailwind directives & typography
│   ├── config/
│   │   └── appConfig.ts           # Configurable thresholds, weights, disclaimers
│   ├── types/
│   │   └── index.ts               # Core TypeScript models (CIELAB, Product, Profile)
│   ├── data/
│   │   └── catalogue.ts           # 32 demonstration products across 6 categories
│   ├── utils/
│   │   ├── colorScience.ts        # sRGB, XYZ, CIELAB, CIEDE2000, CIE76, Harmonies
│   │   ├── imageSampling.ts       # Canvas pixel sampling, median stats, calibration
│   │   ├── skinProfile.ts         # Depth lightness bands & undertone heuristics
│   │   ├── ingredientFilter.ts    # Alias dictionary & hard allergen filtering
│   │   ├── recommendationEngine.ts# Multi-factor scoring, explanations, full looks
│   │   ├── storage.ts             # LocalStorage & memory management
│   │   └── __tests__/             # Unit test suites (19 automated tests)
│   └── components/                # Reusable UI components & screen views
```

---

## 4. Installation & Local Execution

### Prerequisites
- Node.js version 18.0.0 or higher
- npm 9.0.0 or higher

### Steps to Run
```bash
# 1. Clone or navigate to the workspace
cd intelligent-tesla

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Build for production
npm run build

# 5. Start the local development server
npm run dev
```

The application will start locally at `http://localhost:5173/`.

---

## 5. The Colour-Science Pipeline

The colour-science module ([`src/utils/colorScience.ts`](file:///src/utils/colorScience.ts)) avoids arbitrary RGB distances and implements standard colorimetric models:

1. **sRGB Channel Linearization**:
   $$\text{linear}(c) = \begin{cases} \frac{c}{12.92} & c \le 0.04045 \\ \left(\frac{c + 0.055}{1.055}\right)^{2.4} & c > 0.04045 \end{cases}$$
2. **CIE XYZ Transformation (D65 Standard 2° Observer)**:
   Transfers linear sRGB values into CIE 1931 XYZ space.
3. **XYZ to CIELAB (D65 Reference White $X_n=0.95047, Y_n=1.00000, Z_n=1.08883$)**:
   Yields $L^*$ (lightness: 0–100), $a^*$ (green to red: -128 to +127), and $b^*$ (blue to yellow: -128 to +127).
4. **Sharma-Wu-Dalal CIEDE2000 Implementation ($\Delta E_{00}$)**:
   Perceptually uniform metric according to ISO/CIE 11664-6:2014, evaluating lightness differences, chroma differences, hue differences, and cross-term rotation ($R_T$).
5. **CIE76 ($\Delta E_{76}$)**:
   Euclidean distance in CIELAB space maintained for comparative validation.
6. **Harmonic Colour Schemes**:
   Evaluates hue angles ($h_{ab} = \text{atan2}(b^*, a^*)$) to compute monochromatic ($< 25^\circ$), analogous ($25^\circ - 55^\circ$), triadic ($105^\circ - 135^\circ$), and complementary ($145^\circ - 180^\circ$) harmonies with selected outfits and complexion tones.

---

## 6. The Recommendation Engine

The recommendation engine ([`src/utils/recommendationEngine.ts`](file:///src/utils/recommendationEngine.ts)) runs in distinct deterministic stages:

### Step 1: Strict Hard Constraints (Applied First)
A candidate product is **immediately excluded** if:
* The product brand is listed in `preferences.excludedBrands`.
* The product price exceeds category budget or overall max INR budget.
* The product ingredient list or declared allergen tags match any user allergen or avoided substance (using the normalization dictionary in `ingredientFilter.ts`).

### Step 2: Multi-Factor Ranking
Surviving products are evaluated on a 0–100 scale:
* **Base Products (Foundations, Concealers)**:
  - $\Delta E_{00}$ Colour Similarity (40% weight): Scaled from CIEDE2000 difference against estimated cheek colour.
  - Depth Compatibility (15% weight): Matches user's depth band.
  - Undertone Compatibility (15% weight): Matches warm/cool/neutral/olive undertones.
  - Finish Compatibility (10% weight): Matte, natural, satin, or dewy.
  - Coverage Compatibility (10% weight): Sheer, light, medium, or full.
  - Formula & Skin Type Synergy (5% weight): e.g. oil-control for oily skin, hydrating for dry skin.
  - Brand Preference (5% weight): Favors user-preferred brands.
* **Colour Cosmetics (Lipsticks, Gloss, Blush, Eyeshadow)**:
  - Colour Harmony (35% weight): Monochromatic, analogous, triadic, or complementary synergy with outfit or skin undertone.
  - Undertone Synergy (20% weight): Warm pigments for warm tones, cool berries for cool tones.
  - Occasion Suitability (15% weight): Everyday, office, festive, wedding, etc.
  - Intensity Match (10% weight): Subtle vs moderate vs bold.
  - Finish & Formula (15% weight).
  - Brand Preference (5% weight).

### Step 3: Explanation Construction
Every recommended product card includes structured, human-readable reasons explaining why the product was selected, which preferences matched, and any warnings regarding partial ingredient disclosures.

---

## 7. Product Catalogue Architecture

### Catalogue Data Structure
The catalogue contains 32 demonstration products across 6 categories (Foundation, Concealer, Lipstick, Lip Gloss, Blush, Eyeshadow) in [`src/data/catalogue.ts`](file:///src/data/catalogue.ts).

Each product conforms to the `Product` interface:
```typescript
export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  shadeName: string;
  shadeHex: string;
  shadeLab: CIELABColor; // Derived via hexToLab()
  price: number; // INR ₹
  finish: Finish;
  coverage?: Coverage;
  targetDepth?: readonly SkinDepth[];
  targetUndertones?: readonly Undertone[];
  suitableOccasions: readonly Occasion[];
  formulaAttributes: readonly string[];
  ingredients: readonly string[];
  declaredAllergenTags: readonly string[];
  userPreferenceTags: readonly string[];
  dataCompleteness: 'complete' | 'partial' | 'minimal';
  isDemonstration: true;
  description: string;
}
```

### How to Add New Products
To add a new product:
1. Open [`src/data/catalogue.ts`](file:///src/data/catalogue.ts).
2. Append a new object to `RAW_DEMO_PRODUCTS` with unique `id`, fictional brand name, category, indicative INR price, hex shade, ingredient list, and tags.
3. The derived `shadeLab` CIELAB coordinates are automatically computed at module initialization via `hexToLab(p.shadeHex)`.

### How to Modify Recommendation Weights
Scoring weights are defined in [`src/config/appConfig.ts`](file:///src/config/appConfig.ts) under `APP_CONFIG.scoringWeights`. You can adjust the fractional contributions (e.g. increasing `shadeSimilarity` from 0.40 to 0.50) without modifying component or UI code.

---

## 8. Privacy Architecture & Image Handling

1. **Client-Side Only**: Image sampling runs entirely inside the user's browser via `<canvas>`. User photographs are **never** uploaded to any backend server, remote storage, or third-party computer vision API.
2. **Ephemeral Memory Lifetime**: Photographs are stored as temporary Object URLs in memory and are discarded as soon as the user clears them, resets the app, or closes the tab.
3. **No Automatic Persistence of Images**: `localStorage` stores only non-image preference values (depth string, undertone string, allergen tags, budget number, favourites IDs).
4. **Explicit Consent & Disclaimers**: Displayed prominently during upload, with clear deletion controls to clear photos or delete saved data.

---

## 9. Limitations & Commercial Launch Roadmap

### Prototype Limitations
- **Digital Colour Representation**: Product shade swatches and uploaded photographs are approximate digital sRGB representations. Real cosmetic pigments interact with ambient illumination, skin texture, and natural formula oxidation.
- **Ambient Lighting**: Without controlled illumination or a calibrated 18% neutral grey card, consumer smartphone cameras introduce automatic white-balance and colour temperature shifts.
- **No Medical Assessment**: The application does not diagnose clinical skin conditions (acne, eczema, rosacea, dermatitis) or prescribe medical treatments.

### Commercial Launch Roadmap
Before commercial deployment, the following components should be upgraded:
1. **Spectrophotometer Pigment Calibration**: Replace digital sRGB shade approximations with laboratory spectrophotometer readings under standard D65 illuminants.
2. **Retailer API Feeds**: Integrate real-time merchant APIs (e.g. Nykaa, Sephora, Tira) for live inventory, pricing, and certified INCI ingredient disclosures.
3. **Local Face-Landmark Automation**: Integrate an on-device WebAssembly/TensorFlow.js facial mesh (e.g. MediaPipe Face Landmarker) while preserving 100% local processing.
4. **Physically Based Try-On (WebGL/WebGPU)**: Introduce realistic virtual makeup rendering with diffuse reflection and specular highlight shaders.

---

## 10. Automated Testing & Validation

The test suite is built on **Vitest** and covers all critical colorimetric and recommendation engine logic across 19 unit tests in [`src/utils/__tests__/`](file:///src/utils/__tests__/).

To run tests:
```bash
npm test
```

### Verified Test Suites:
- `src/utils/__tests__/colorScience.test.ts`:
  - D65 reference white conversion ($L^* \approx 100, a^* \approx 0, b^* \approx 0$)
  - Black point conversion ($L^* \approx 0, a^* \approx 0, b^* \approx 0$)
  - Hexadecimal to RGB and RGB to Hex roundtripping
  - Bidirectional Hex $\leftrightarrow$ CIELAB consistency
  - CIEDE2000 identical colour zero check ($\Delta E_{00} = 0$)
  - CIEDE2000 and CIE76 distance checks on distinct shades
  - Colour harmony evaluation (monochromatic, triadic, complementary)
  - Skin depth classification across 6 lightness bands
  - Heuristic undertone estimation on synthetic warm, cool, olive, and neutral samples
  - Confidence scoring on symmetrical vs asymmetrical lighting
- `src/utils/__tests__/recommendation.test.ts`:
  - Allergen exclusion when user declares ingredient allergy
  - Avoided substance filtering (e.g. fragrance/parfum)
  - Uncertainty warnings for partial ingredient disclosures
  - Strict INR budget enforcement as a hard filter
  - Recommendation ranking by $\Delta E_{00}$ shade proximity
  - Graceful empty results handling with itemized diagnostic reasons
  - In-browser profile persistence without image binaries
  - Stored profile deletion controls
  - Favourites toggling, storage, and clearing
