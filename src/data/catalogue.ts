import {
  IngredientRecordEntity,
  Occasion,
  OfferEntity,
  Product,
  ProductEntity,
  ShadeEntity,
} from '../types';
import { hexToLab } from '../utils/colorScience';

// ============================================================================
// 1. PRODUCT ENTITIES (19 Product Families across 13 Brands)
// ============================================================================
export const RESEARCH_PRODUCTS: ProductEntity[] = [
  {
    productId: 'P01',
    brand: 'Kay Beauty',
    productName: 'Hydrating Foundation',
    category: 'foundation',
    subcategory: 'liquid_foundation',
    size: '30 g',
    finish: 'dewy',
    coverage: 'sheer',
    skinTypePositioning: 'Indian skin positioning; HA/avocado/mango',
    ingredientRecordId: 'I01',
    productUrl: 'https://www.kaybeauty.com/en-gb/products/kay-beauty-hydrating-foundation',
    dataStatus: 'research_seed',
    description: 'Enriched with hyaluronic acid, avocado and mango butter; 20 shades labeled across Light, Medium, Tan and Deep.',
  },
  {
    productId: 'P02',
    brand: 'SUGAR',
    productName: 'Ace Of Face Foundation Stick',
    category: 'foundation',
    subcategory: 'stick_foundation',
    size: '12 g',
    finish: 'matte',
    coverage: 'full',
    skinTypePositioning: 'All types, brand_stated; 24-hour claim',
    ingredientRecordId: 'I02',
    productUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataStatus: 'research_seed',
    description: 'Full-coverage buildable foundation stick with 12 published CSS selector swatches and explicit depth/undertone labels.',
  },
  {
    productId: 'P03',
    brand: 'SUGAR',
    productName: 'Ace of Face Dewy Foundation',
    category: 'foundation',
    subcategory: 'dewy_foundation',
    finish: 'dewy',
    coverage: 'medium',
    productUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-dewy-foundation',
    dataStatus: 'research_seed',
    description: 'Liquid dewy foundation variant from SUGAR. Numeric colour and undertones are not published.',
  },
  {
    productId: 'P04',
    brand: 'Lakmé',
    productName: '9 to 5 Complexion Care Face Cream',
    category: 'foundation',
    subcategory: 'cc_cream',
    finish: 'natural',
    coverage: 'light',
    productUrl: 'https://www.lakmeindia.com/products/lakme-9-to-5-complexion-care-face-cream',
    dataStatus: 'research_seed',
    description: 'CC cream with 6 observed variants. Codes, undertones, and numeric colours not established.',
  },
  {
    productId: 'P05',
    brand: 'Insight Cosmetics',
    productName: 'HD Concealer',
    category: 'concealer',
    subcategory: 'cream_concealer',
    size: '9 g',
    finish: 'natural',
    coverage: 'full',
    skinTypePositioning: 'All types, brand listing; crease-related claims',
    productUrl: 'https://insightcosmetics.in/products/hd-concealer',
    dataStatus: 'research_seed',
    description: 'High-coverage affordable concealer with 6 code-based variants. Numeric colour and complete INCI unavailable.',
  },
  {
    productId: 'P06',
    brand: 'Maybelline New York',
    productName: 'Fit Me Concealer',
    category: 'concealer',
    subcategory: 'liquid_concealer',
    size: '6.8 ml',
    finish: 'matte',
    coverage: 'medium',
    productUrl: 'https://www.tirabeauty.com/product/maybelline-new-york-fit-me-concealer---25-medium-68ml-0giyeqtuwx7',
    dataStatus: 'research_seed',
    description: 'Liquid concealer with 7 identified Indian listings on Tira. Undertones not explicitly published.',
  },
  {
    productId: 'P07',
    brand: 'Huda Beauty',
    productName: 'Easy Blur Natural Airbrush Foundation',
    category: 'foundation',
    subcategory: 'liquid_foundation',
    size: '30 ml',
    finish: 'matte',
    coverage: 'medium',
    ingredientRecordId: 'I04',
    productUrl: 'https://www.tirabeauty.com/product/huda-beauty-easy-blur-natural-airbrush-foundation-dulce-de-leche-350g-30-ml-7606332',
    dataStatus: 'research_seed',
    description: 'Airbrush-finish foundation with niacinamide and silica. Three full-size shades captured from Tira.',
  },
  {
    productId: 'P08',
    brand: 'Bobbi Brown',
    productName: 'Weightless Skin Foundation SPF 15',
    category: 'foundation',
    subcategory: 'liquid_foundation',
    size: '30 ml',
    finish: 'matte',
    coverage: 'medium',
    productUrl: 'https://www.nykaa.com',
    dataStatus: 'research_seed',
    description: 'Natural matte oil-controlling foundation with SPF 15. Selected Indian listing: Natural.',
  },
  {
    productId: 'P09',
    brand: 'Estée Lauder',
    productName: 'Double Wear Stay-In-Place Makeup SPF 10',
    category: 'foundation',
    subcategory: 'liquid_foundation',
    finish: 'matte',
    coverage: 'full',
    skinTypePositioning: 'Combination/dry/normal/oily, retailer_stated',
    ingredientRecordId: 'I05',
    productUrl: 'https://sephora.in/product/estee-lauder-double-wear-stay-in-place-makeup-spf-10-foundation-v-1n1-ivory-nude-185093',
    dataStatus: 'research_seed',
    description: '24-hour waterproof and transfer-resistant regional SPF 10 formulation on Sephora India. Shade: 1N1 Ivory Nude.',
  },
  {
    productId: 'P10',
    brand: 'Swiss Beauty',
    productName: 'Non-Transfer Lipstick',
    category: 'lipstick',
    subcategory: 'bullet_lipstick',
    size: '3 g',
    finish: 'matte',
    productUrl: 'https://swissbeauty.in/products/non-transfer-matte-lipstick-bare-sb-s17-15',
    dataStatus: 'research_seed',
    description: 'Waterproof non-transfer matte bullet lipstick with 30 observed variants across brand store and Nykaa.',
  },
  {
    productId: 'P11',
    brand: 'Swiss Beauty',
    productName: 'Non-transfer Matte Lipstick',
    category: 'lipstick',
    subcategory: 'bullet_lipstick',
    size: '2 g',
    finish: 'matte',
    productUrl: 'https://swissbeauty.in/products/non-transfer-matte-lipstick-sb-209',
    dataStatus: 'research_seed',
    description: '2 g matte lipstick range with 30 observed shades. Distinct from P10; numeric swatches unverified.',
  },
  {
    productId: 'P12',
    brand: 'Faces Canada',
    productName: 'Weightless Creme Finish Lipstick',
    category: 'lipstick',
    subcategory: 'bullet_lipstick',
    finish: 'natural',
    productUrl: 'https://www.facescanada.com/products/weightless-creme-finish-lipstick-rock-solid-02',
    dataStatus: 'research_seed',
    description: 'Creamy bullet lipstick with ultra-lightweight wear. Selected shade: Rock Solid 02.',
  },
  {
    productId: 'P13',
    brand: 'Charlotte Tilbury',
    productName: 'Matte Revolution',
    category: 'lipstick',
    subcategory: 'bullet_lipstick',
    size: '3.5 g',
    finish: 'matte',
    productUrl: 'https://www.nykaa.com',
    dataStatus: 'research_seed',
    description: 'Luminous modern matte lipstick enriched with 3D glowing pigments. Selected Indian listing: Pillow Talk Medium.',
  },
  {
    productId: 'P14',
    brand: 'SUGAR',
    productName: 'Mettle Satin Lipstick',
    category: 'lipstick',
    subcategory: 'bullet_lipstick',
    size: '2.2 g',
    finish: 'satin',
    productUrl: 'https://www.sugarcosmetics.com',
    dataStatus: 'research_seed',
    description: 'High-pigment satin finish lipstick. Selected shade: 10 Diana (Peachy pink).',
  },
  {
    productId: 'P15',
    brand: 'Fenty Beauty',
    productName: 'Gloss Bomb Universal Lip Luminizer',
    category: 'lipgloss',
    subcategory: 'lip_luminizer',
    finish: 'dewy',
    productUrl: 'https://sephora.in',
    dataStatus: 'research_seed',
    description: 'Cult high-shine lip gloss enriched with shea butter. Six India-linked shade names captured.',
  },
  {
    productId: 'P16',
    brand: 'rom&nd',
    productName: 'Juicy Lasting Tint (Original)',
    category: 'lipstick',
    subcategory: 'lip_tint',
    size: '5.5 g',
    finish: 'dewy',
    productUrl: 'https://www.tirabeauty.com',
    dataStatus: 'research_seed',
    description: 'Original 5.5 g glossy lip tint. Selected shades: 21 Deep Sangria, 13 Eat Dotori.',
  },
  {
    productId: 'P17',
    brand: 'rom&nd',
    productName: 'The Juicy Lasting Tint (Newer)',
    category: 'lipstick',
    subcategory: 'lip_tint',
    size: '3.5 g',
    finish: 'dewy',
    productUrl: 'https://www.tirabeauty.com',
    dataStatus: 'research_seed',
    description: 'Newer 3.5 g glossy tint formulation. Six identified shades including Bare Grape and Fig Fig.',
  },
  {
    productId: 'P18',
    brand: 'Kay Beauty',
    productName: 'Creme Blush',
    category: 'blush',
    subcategory: 'cream_blush',
    finish: 'dewy',
    productUrl: 'https://www.kaybeauty.com/products/kay-beauty-creme-blush-1',
    dataStatus: 'research_seed',
    description: 'Glowy mousse-like cream blush with 5 observed selector shades and shade-associated published INCI lists.',
  },
  {
    productId: 'P19',
    brand: 'Swiss Beauty',
    productName: 'Ultimate 9 Pigmented Colors Eyeshadow Palette',
    category: 'eyeshadow',
    subcategory: 'palette',
    size: '6 g',
    finish: 'various',
    productUrl: 'https://www.nykaa.com/swiss-beauty-ultimate-shadow-palette/p/8423343',
    dataStatus: 'research_seed',
    description: 'Nine-pan eyeshadow palette with eight selector variants. Individual pan swatches unavailable.',
  },
];

// ============================================================================
// 2. INGREDIENT RECORDS
// ============================================================================
export const RESEARCH_INGREDIENTS: IngredientRecordEntity[] = [
  {
    ingredientRecordId: 'I01',
    productId: 'P01',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.kaybeauty.com/en-gb/products/kay-beauty-hydrating-foundation',
    observedAt: '2026-10-23',
    formulaNotes: 'Captured from Kay Beauty official listing. Preserved full published chemical names.',
    rawText: 'Aqua, Cyclopentasiloxane, Talc, Isononyl Isononanoate, Butylene Glycol, Behenyl Dimethicone, Cetyl PEG/PPG-10.1 Dimethicone, Octyldodecanol, Disteardimonium Hectorite, Phenoxyethanol, Hydrogen Dimethicone, Sodium Dehydroacetate, Glycerin, Pentylene Glycol, Aluminium Hydroxide, Disodium EDTA, Triethoxycaprylylsilane, Citric Acid, Fructose, Sodium Hydroxide, Urea, Allantoin, Maltose, Mangifera Indica Seed Butter, Sodium Chloride, Sodium Lactate, Sodium PCA, Trehalose, Tropolone, Persea Gratissima Oil, Phytosterols, Glucose, Sodium Hyaluronate, Olea Europaea Fruit Oil, Sorbitan Oleate, Ascorbyl Palmitate, Tocopheryl Acetate, May Contain +/- CI 77891, CI 77492, CI 77491, CI 77499.',
    ingredients: [
      'Aqua', 'Cyclopentasiloxane', 'Talc', 'Isononyl Isononanoate', 'Butylene Glycol', 'Behenyl Dimethicone',
      'Cetyl PEG/PPG-10.1 Dimethicone', 'Octyldodecanol', 'Disteardimonium Hectorite', 'Phenoxyethanol',
      'Hydrogen Dimethicone', 'Sodium Dehydroacetate', 'Glycerin', 'Pentylene Glycol', 'Aluminium Hydroxide',
      'Disodium EDTA', 'Triethoxycaprylylsilane', 'Citric Acid', 'Fructose', 'Sodium Hydroxide', 'Urea',
      'Allantoin', 'Maltose', 'Mangifera Indica Seed Butter', 'Sodium Chloride', 'Sodium Lactate', 'Sodium PCA',
      'Trehalose', 'Tropolone', 'Persea Gratissima Oil', 'Phytosterols', 'Glucose', 'Sodium Hyaluronate',
      'Olea Europaea Fruit Oil', 'Sorbitan Oleate', 'Ascorbyl Palmitate', 'Tocopheryl Acetate', 'CI 77891',
      'CI 77492', 'CI 77491', 'CI 77499',
    ],
  },
  {
    ingredientRecordId: 'I02',
    productId: 'P02',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    observedAt: '2026-10-23',
    formulaNotes: 'Captured from SUGAR official foundation stick listing.',
    rawText: 'Iron Oxide Yellow (CI 77492), Phenyl Trimethicone, Titanium Dioxide (CI 77891), Caprylic/Capric Triglyceride, C12-15 Alkyl Ethylhexanoate, Ethylhexyl Methoxycinnamate, Iron Oxide Red (CI 77491), Methyl Methacrylate Crosspolymer, Polyethylene, Ceresin, Euphorbia Cerifera (Candelilla) Wax, Pentylene Glycol, Polyglyceryl-2 Triisostearate, VP/Hexadecene Copolymer, Iron Oxide Black (CI 77499), Ozokerite, Talc, Mica(CI 77019), Silica, Lauryl Peg/Ppg-18/18 Methicone, Microcrystalline Wax, Phenoxyethanol, Triethoxycaprylylsilane, Aluminum Hydroxide, Caprylyl Glycol, 1,2-Hexanediol, Macadamia Seed Oil Polyglyceryl-6 Esters Behenate, Ethylhexylglycerin, Lauryl Laurate, Propanediol, Dimethicone, Isostearyl Alcohol, Illicium Verum (Anise) Fruit Extract, Methicone, BHT.',
    ingredients: [
      'Iron Oxide Yellow (CI 77492)', 'Phenyl Trimethicone', 'Titanium Dioxide (CI 77891)', 'Caprylic/Capric Triglyceride',
      'C12-15 Alkyl Ethylhexanoate', 'Ethylhexyl Methoxycinnamate', 'Iron Oxide Red (CI 77491)',
      'Methyl Methacrylate Crosspolymer', 'Polyethylene', 'Ceresin', 'Euphorbia Cerifera (Candelilla) Wax',
      'Pentylene Glycol', 'Polyglyceryl-2 Triisostearate', 'VP/Hexadecene Copolymer', 'Iron Oxide Black (CI 77499)',
      'Ozokerite', 'Talc', 'Mica', 'Silica', 'Lauryl Peg/Ppg-18/18 Methicone', 'Microcrystalline Wax',
      'Phenoxyethanol', 'Triethoxycaprylylsilane', 'Aluminum Hydroxide', 'Caprylyl Glycol', '1,2-Hexanediol',
      'Macadamia Seed Oil Polyglyceryl-6 Esters Behenate', 'Ethylhexylglycerin', 'Lauryl Laurate', 'Propanediol',
      'Dimethicone', 'Isostearyl Alcohol', 'Illicium Verum (Anise) Fruit Extract', 'Methicone', 'BHT',
    ],
  },
  {
    ingredientRecordId: 'I03A',
    productId: 'P18',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.kaybeauty.com/products/kay-beauty-creme-blush-1',
    observedAt: '2026-10-23',
    formulaNotes: 'Applies to Cosy Coral, Rustic Rush, and Flirty Nude.',
    rawText: 'Cyclopentasiloxane, DM Water, Hydrogenated Didecene, Talc, Dimethicone, Tribehenin, Cetyl PEG/PPG-10/1 Dimethicone, Dimethicone/ Vinyl Dimethicone Crosspolymer, Silica Dimethyl Silylate, Disteardimonium Hectorite, Phenoxyethanol, Hydrogen Dimethicone, Sodium Dehydroacetate, Aluminium Hydroxide, Disodium EDTA, Persea Gratissima (Avacado) Oil, Vaccinium Macrocarpon (Cranberry) Seed Oil, Tropolone, Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate, May Contain +/- CI 77891, CI 77491.',
    ingredients: [
      'Cyclopentasiloxane', 'DM Water', 'Hydrogenated Didecene', 'Talc', 'Dimethicone', 'Tribehenin',
      'Cetyl PEG/PPG-10/1 Dimethicone', 'Dimethicone/ Vinyl Dimethicone Crosspolymer', 'Silica Dimethyl Silylate',
      'Disteardimonium Hectorite', 'Phenoxyethanol', 'Hydrogen Dimethicone', 'Sodium Dehydroacetate',
      'Aluminium Hydroxide', 'Disodium EDTA', 'Persea Gratissima (Avacado) Oil', 'Vaccinium Macrocarpon (Cranberry) Seed Oil',
      'Tropolone', 'Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate', 'CI 77891', 'CI 77491',
    ],
  },
  {
    ingredientRecordId: 'I03B',
    productId: 'P18',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.kaybeauty.com/products/kay-beauty-creme-blush-1',
    observedAt: '2026-10-23',
    formulaNotes: 'Applies to Rosy Romance shade.',
    rawText: 'Cyclopentasiloxane, DM Water, Hydrogenated Didecene, Talc, Dimethicone, Tribehenin, Cetyl PEG/PPG-10/1 Dimethicone, Dimethicone/ Vinyl Dimethicone Crosspolymer, Silica Dimethyl Silylate, Disteardimonium Hectorite, Phenoxyethanol, Hydrogen Dimethicone, Sodium Dehydroacetate, Aluminium Hydroxide, Disodium EDTA, Persea Gratissima (Avacado) Oil, Vaccinium Macrocarpon (Cranberry) Seed Oil, Triethoxycaprylsilane, Tropolone, Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate, May Contain +/- CI 77891, CI 77491, CI 15850.',
    ingredients: [
      'Cyclopentasiloxane', 'DM Water', 'Hydrogenated Didecene', 'Talc', 'Dimethicone', 'Tribehenin',
      'Cetyl PEG/PPG-10/1 Dimethicone', 'Dimethicone/ Vinyl Dimethicone Crosspolymer', 'Silica Dimethyl Silylate',
      'Disteardimonium Hectorite', 'Phenoxyethanol', 'Hydrogen Dimethicone', 'Sodium Dehydroacetate',
      'Aluminium Hydroxide', 'Disodium EDTA', 'Persea Gratissima (Avacado) Oil', 'Vaccinium Macrocarpon (Cranberry) Seed Oil',
      'Triethoxycaprylsilane', 'Tropolone', 'Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate', 'CI 77891', 'CI 77491', 'CI 15850',
    ],
  },
  {
    ingredientRecordId: 'I03C',
    productId: 'P18',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.kaybeauty.com/products/kay-beauty-creme-blush-1',
    observedAt: '2026-10-23',
    formulaNotes: 'Applies to Sweetheart Pink shade.',
    rawText: 'Cyclopentasiloxane, DM Water, Hydrogenated Didecene, Talc, Dimethicone, Tribehenin, Cetyl PEG/PPG-10/1 Dimethicone, Dimethicone/ Vinyl Dimethicone Crosspolymer, Silica Dimethyl Silylate, Disteardimonium Hectorite, Phenoxyethanol, Hydrogen Dimethicone, Sodium Dehydroacetate, Aluminium Hydroxide, Disodium EDTA, Persea Gratissima (Avacado) Oil, Vaccinium Macrocarpon (Cranberry) Seed Oil, Triethoxycaprylsilane, Tropolone, Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate, May Contain +/- CI 77891, CI 77491.',
    ingredients: [
      'Cyclopentasiloxane', 'DM Water', 'Hydrogenated Didecene', 'Talc', 'Dimethicone', 'Tribehenin',
      'Cetyl PEG/PPG-10/1 Dimethicone', 'Dimethicone/ Vinyl Dimethicone Crosspolymer', 'Silica Dimethyl Silylate',
      'Disteardimonium Hectorite', 'Phenoxyethanol', 'Hydrogen Dimethicone', 'Sodium Dehydroacetate',
      'Aluminium Hydroxide', 'Disodium EDTA', 'Persea Gratissima (Avacado) Oil', 'Vaccinium Macrocarpon (Cranberry) Seed Oil',
      'Triethoxycaprylsilane', 'Tropolone', 'Pentaerythrityl Tetra-DI-t-Butyl Hydroxycinnamate', 'CI 77891', 'CI 77491',
    ],
  },
  {
    ingredientRecordId: 'I04',
    productId: 'P07',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://www.tirabeauty.com/product/huda-beauty-easy-blur-natural-airbrush-foundation-dulce-de-leche-350g-30-ml-7606332',
    observedAt: '2026-10-23',
    formulaNotes: 'Selected 350G. Other-shade applicability requires confirmation.',
    rawText: 'Water/Aqua/Eau, Cyclopentasiloxane, Isododecane, Ethylhexyl Palmitate, Cetyl Peg/Ppg-10/1 Dimethicone, Polyglyceryl-4 Isostearate, Propylene Glycol, Diphenyl Dimethicone, Acetylated Glycol Stearate, Niacinamide, Trimethylsiloxysilicate, Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer, Disteardimonium Hectorite, Methyl Methacrylate Crosspolymer, Sodium Chloride, Prunus Cerasus (Bitter Cherry) Fruit Water, Dimethicone Crosspolymer, Phenoxyethanol, Silica, Sodium Dehydroacetate, Magnesium Stearate, Zeolite, Mica, Silica Dimethyl Silylate, Triethoxycaprylylsilane, Aluminum Hydroxide, Sodium Phytate, Butylene Glycol, Trimethylsiloxysilylcarbamoyl Pullulan, Citric Acid, Phenylpropanol, Aloe Barbadensis Leaf Extract, Laminaria Saccharina Extract, Zinc Sulfate, Pyridoxine Hcl. May Contain (+/-): Iron Oxides/Ci 77491, Iron Oxides/Ci 77492, Iron Oxides/Ci 77499, Titanium Dioxide/Ci 77891.',
    ingredients: [
      'Water', 'Cyclopentasiloxane', 'Isododecane', 'Ethylhexyl Palmitate', 'Cetyl Peg/Ppg-10/1 Dimethicone',
      'Polyglyceryl-4 Isostearate', 'Propylene Glycol', 'Diphenyl Dimethicone', 'Acetylated Glycol Stearate',
      'Niacinamide', 'Trimethylsiloxysilicate', 'Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer',
      'Disteardimonium Hectorite', 'Methyl Methacrylate Crosspolymer', 'Sodium Chloride',
      'Prunus Cerasus (Bitter Cherry) Fruit Water', 'Dimethicone Crosspolymer', 'Phenoxyethanol', 'Silica',
      'Sodium Dehydroacetate', 'Magnesium Stearate', 'Zeolite', 'Mica', 'Silica Dimethyl Silylate',
      'Triethoxycaprylylsilane', 'Aluminum Hydroxide', 'Sodium Phytate', 'Butylene Glycol',
      'Trimethylsiloxysilylcarbamoyl Pullulan', 'Citric Acid', 'Phenylpropanol', 'Aloe Barbadensis Leaf Extract',
      'Laminaria Saccharina Extract', 'Zinc Sulfate', 'Pyridoxine Hcl', 'CI 77491', 'CI 77492', 'CI 77499', 'CI 77891',
    ],
  },
  {
    ingredientRecordId: 'I05',
    productId: 'P09',
    completenessStatus: 'complete_as_published',
    sourceUrl: 'https://sephora.in/product/estee-lauder-double-wear-stay-in-place-makeup-spf-10-foundation-v-1n1-ivory-nude-185093',
    observedAt: '2026-10-23',
    formulaNotes: 'Sephora India SPF 10 listing.',
    rawText: 'Water\\Aqua\\Eau, Cyclopentasiloxane, Trimethylsiloxysilicate, Peg/Ppg-18/18 Dimethicone, Butylene Glycol, Tribehenin, Polyglyceryl-3 Diisostearate, Magnesium Sulfate, Tocopheryl Acetate, Polymethylsilsesquioxane, Methicone, Laureth-7, Xanthan Gum, Alumina, Sodium Dehydroacetate, Disteardimonium Hectorite, Cellulose Gum, Propylene Carbonate, Pentaerythrityl Tetra-Di-T-Butyl Hydroxyhydrocinnamate, Phenoxyethanol, [+/- Iron Oxides (Ci 77491, Ci 77492, Ci 77499), Mica, Titanium Dioxide (Ci 77891)].',
    ingredients: [
      'Water', 'Cyclopentasiloxane', 'Trimethylsiloxysilicate', 'Peg/Ppg-18/18 Dimethicone', 'Butylene Glycol',
      'Tribehenin', 'Polyglyceryl-3 Diisostearate', 'Magnesium Sulfate', 'Tocopheryl Acetate',
      'Polymethylsilsesquioxane', 'Methicone', 'Laureth-7', 'Xanthan Gum', 'Alumina', 'Sodium Dehydroacetate',
      'Disteardimonium Hectorite', 'Cellulose Gum', 'Propylene Carbonate',
      'Pentaerythrityl Tetra-Di-T-Butyl Hydroxyhydrocinnamate', 'Phenoxyethanol', 'CI 77491', 'CI 77492',
      'CI 77499', 'Mica', 'CI 77891',
    ],
  },
];

// ============================================================================
// 3. SHADE ENTITIES
// ============================================================================
export const RESEARCH_SHADES: ShadeEntity[] = [
  // --- P01: Kay Beauty Hydrating Foundation (20 shades) ---
  ...([
    { code: '100P', name: '100P Light', depth: 'fair' as const },
    { code: '105Y', name: '105Y Light', depth: 'fair' as const },
    { code: '110N', name: '110N Light', depth: 'light' as const },
    { code: '115P', name: '115P Light', depth: 'light' as const },
    { code: '120Y', name: '120Y Light', depth: 'light' as const },
    { code: '125Y', name: '125Y Medium', depth: 'medium' as const },
    { code: '130Y', name: '130Y Medium', depth: 'medium' as const },
    { code: '135N', name: '135N Medium', depth: 'medium' as const },
    { code: '140P', name: '140P Medium', depth: 'medium' as const },
    { code: '145N', name: '145N Medium', depth: 'medium' as const },
    { code: '150N', name: '150N Tan', depth: 'tan' as const },
    { code: '155Y', name: '155Y Tan', depth: 'tan' as const },
    { code: '160P', name: '160P Tan', depth: 'tan' as const },
    { code: '165N', name: '165N Tan', depth: 'tan' as const },
    { code: '170Y', name: '170Y Tan', depth: 'tan' as const },
    { code: '175N', name: '175N Deep', depth: 'deep' as const },
    { code: '180Y', name: '180Y Deep', depth: 'deep' as const },
    { code: '185P', name: '185P Deep', depth: 'deep' as const },
    { code: '190Y', name: '190Y Deep', depth: 'rich' as const },
    { code: '195N', name: '195N Deep', depth: 'rich' as const },
  ].map(s => ({
    shadeId: `P01-${s.code}`,
    productId: 'P01',
    shadeCode: s.code,
    shadeName: s.name,
    brandDepth: s.code.includes('Light') ? 'Light' : s.code.includes('Medium') ? 'Medium' : s.code.includes('Tan') ? 'Tan' : 'Deep',
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetDepth: [s.depth],
    targetUndertones: [s.code.includes('Y') ? 'warm' : s.code.includes('P') ? 'cool' : 'neutral'] as const,
    inferredUndertone: s.code.includes('Y') ? ('warm' as const) : s.code.includes('P') ? ('cool' as const) : ('neutral' as const),
  }))),

  // --- P02: SUGAR Ace Of Face Foundation Stick (12 shades with directly published CSS swatches) ---
  {
    shadeId: 'P02-07',
    productId: 'P02',
    shadeCode: '07',
    shadeName: 'Vanilla Latte',
    brandDepth: 'Fair',
    brandUndertone: 'Golden',
    inferredUndertone: 'warm',
    digitalHex: '#F3D3B9',
    digitalRgb: { r: 243, g: 211, b: 185 },
    digitalLab: hexToLab('#F3D3B9'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['fair'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-10',
    productId: 'P02',
    shadeCode: '10',
    shadeName: 'Latte',
    brandDepth: 'Light',
    brandUndertone: 'Warm',
    inferredUndertone: 'warm',
    digitalHex: '#DEC09C',
    digitalRgb: { r: 222, g: 192, b: 156 },
    digitalLab: hexToLab('#DEC09C'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['light'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-15',
    productId: 'P02',
    shadeCode: '15',
    shadeName: 'Cappuccino',
    brandDepth: 'Light',
    brandUndertone: 'Cool',
    inferredUndertone: 'cool',
    digitalHex: '#E4BCAA',
    digitalRgb: { r: 228, g: 188, b: 170 },
    digitalLab: hexToLab('#E4BCAA'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['light'],
    targetUndertones: ['cool'],
  },
  {
    shadeId: 'P02-17',
    productId: 'P02',
    shadeCode: '17',
    shadeName: 'Raf',
    brandDepth: 'Light',
    brandUndertone: 'Golden',
    inferredUndertone: 'warm',
    digitalHex: '#F2D5B5',
    digitalRgb: { r: 242, g: 213, b: 181 },
    digitalLab: hexToLab('#F2D5B5'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['light'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-20',
    productId: 'P02',
    shadeCode: '20',
    shadeName: 'Galão',
    brandDepth: 'Light Medium',
    brandUndertone: 'Golden',
    inferredUndertone: 'warm',
    digitalHex: '#D3AB79',
    digitalRgb: { r: 211, g: 171, b: 121 },
    digitalLab: hexToLab('#D3AB79'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-25',
    productId: 'P02',
    shadeCode: '25',
    shadeName: 'Macchiato',
    brandDepth: 'Light Medium',
    brandUndertone: 'Olive',
    inferredUndertone: 'olive',
    digitalHex: '#DEC09A',
    digitalRgb: { r: 222, g: 192, b: 154 },
    digitalLab: hexToLab('#DEC09A'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium'],
    targetUndertones: ['olive'],
  },
  {
    shadeId: 'P02-27',
    productId: 'P02',
    shadeCode: '27',
    shadeName: 'Vienna',
    brandDepth: 'Light Medium',
    brandUndertone: 'Warm',
    inferredUndertone: 'warm',
    digitalHex: '#EEC6A4',
    digitalRgb: { r: 238, g: 198, b: 164 },
    digitalLab: hexToLab('#EEC6A4'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-30',
    productId: 'P02',
    shadeCode: '30',
    shadeName: 'Chococcino',
    brandDepth: 'Medium',
    brandUndertone: 'Warm',
    inferredUndertone: 'warm',
    digitalHex: '#E5C09D',
    digitalRgb: { r: 229, g: 192, b: 157 },
    digitalLab: hexToLab('#E5C09D'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium', 'tan'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-32',
    productId: 'P02',
    shadeCode: '32',
    shadeName: 'Cortado',
    brandDepth: 'Medium',
    brandUndertone: 'Golden',
    inferredUndertone: 'warm',
    digitalHex: '#EABF97',
    digitalRgb: { r: 234, g: 191, b: 151 },
    digitalLab: hexToLab('#EABF97'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium', 'tan'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-35',
    productId: 'P02',
    shadeCode: '35',
    shadeName: 'Frappe',
    brandDepth: 'Medium',
    brandUndertone: 'Neutral',
    inferredUndertone: 'neutral',
    digitalHex: '#E5BC9C',
    digitalRgb: { r: 229, g: 188, b: 156 },
    digitalLab: hexToLab('#E5BC9C'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['medium', 'tan'],
    targetUndertones: ['neutral'],
  },
  {
    shadeId: 'P02-37',
    productId: 'P02',
    shadeCode: '37',
    shadeName: 'Freddo',
    brandDepth: 'Medium Beige',
    brandUndertone: 'Golden Peach',
    inferredUndertone: 'warm',
    digitalHex: '#EBBC98',
    digitalRgb: { r: 235, g: 188, b: 152 },
    digitalLab: hexToLab('#EBBC98'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['tan'],
    targetUndertones: ['warm'],
  },
  {
    shadeId: 'P02-40',
    productId: 'P02',
    shadeCode: '40',
    shadeName: 'Breve',
    brandDepth: 'Medium Beige',
    brandUndertone: 'Warm',
    inferredUndertone: 'warm',
    digitalHex: '#CEA078',
    digitalRgb: { r: 206, g: 160, b: 120 },
    digitalLab: hexToLab('#CEA078'),
    colourDataType: 'brand_digital',
    colourMeaning: 'website_display_swatch',
    colourSourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    dataQuality: 'high',
    targetDepth: ['tan', 'deep'],
    targetUndertones: ['warm'],
  },

  // --- P03: SUGAR Dewy Foundation (11 shades) ---
  ...([
    { code: '05', name: 'Flat White' },
    { code: '07', name: 'Vanilla Latte' },
    { code: '10', name: 'Latte' },
    { code: '15', name: 'Cappuccino' },
    { code: '17', name: 'Raf' },
    { code: '20', name: 'Galão' },
    { code: '27', name: 'Vienna' },
    { code: '35', name: 'Frappe' },
    { code: '37', name: 'Freddo' },
    { code: '40', name: 'Breve' },
    { code: '47', name: 'Borgia' },
  ].map(s => ({
    shadeId: `P03-${s.code}`,
    productId: 'P03',
    shadeCode: s.code,
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
  }))),

  // --- P04: Lakmé 9 to 5 Complexion Care Face Cream (6 shades) ---
  ...([
    { name: 'Beige', depth: 'fair' as const, undertone: 'warm' as const },
    { name: 'Honey', depth: 'light' as const, undertone: 'warm' as const },
    { name: 'Frappe', depth: 'medium' as const, undertone: 'warm' as const },
    { name: 'Almond', depth: 'medium' as const, undertone: 'neutral' as const },
    { name: 'Bronze', depth: 'tan' as const, undertone: 'warm' as const },
    { name: 'Caramel', depth: 'deep' as const, undertone: 'warm' as const },
  ].map(s => ({
    shadeId: `P04-${s.name.toLowerCase()}`,
    productId: 'P04',
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'low' as const,
    targetDepth: [s.depth],
    targetUndertones: [s.undertone],
    inferredUndertone: s.undertone,
  }))),

  // --- P05: Insight Cosmetics HD Concealer (6 shades) ---
  ...([
    { code: 'LN10', depths: ['fair', 'light'] as const, undertones: ['neutral', 'cool'] as const },
    { code: 'LNP15', depths: ['light'] as const, undertones: ['cool'] as const },
    { code: 'MN20', depths: ['medium'] as const, undertones: ['neutral'] as const },
    { code: 'MNY20', depths: ['medium'] as const, undertones: ['warm'] as const },
    { code: 'MN30', depths: ['medium', 'tan'] as const, undertones: ['neutral'] as const },
    { code: 'MN35', depths: ['tan'] as const, undertones: ['warm'] as const },
  ].map(s => ({
    shadeId: `P05-${s.code}`,
    productId: 'P05',
    shadeCode: s.code,
    shadeName: s.code,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetDepth: s.depths,
    targetUndertones: s.undertones,
    inferredUndertone: s.undertones[0],
  }))),

  // --- P06: Maybelline Fit Me Concealer (7 shades) ---
  ...([
    { code: '10', name: '10 Light', depths: ['fair', 'light'] as const, undertones: ['cool', 'neutral'] as const },
    { code: '20', name: '20 Sand', depths: ['light', 'medium'] as const, undertones: ['warm'] as const },
    { code: '25', name: '25 Medium', depths: ['medium'] as const, undertones: ['neutral', 'warm'] as const },
    { code: '30', name: '30 Honey', depths: ['medium', 'tan'] as const, undertones: ['warm'] as const },
    { code: '35', name: '35 Deep', depths: ['tan', 'deep'] as const, undertones: ['neutral', 'warm'] as const },
    { code: '36', name: '36 Golden Caramel', depths: ['tan', 'deep'] as const, undertones: ['warm'] as const },
    { code: '50', name: '50 Cafe', depths: ['deep', 'rich'] as const, undertones: ['neutral'] as const },
  ].map(s => ({
    shadeId: `P06-${s.code}`,
    productId: 'P06',
    shadeCode: s.code,
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetDepth: s.depths,
    targetUndertones: s.undertones,
    inferredUndertone: s.undertones[0],
  }))),

  // --- P07: Huda Beauty Easy Blur Natural Airbrush Foundation (3 shades) ---
  {
    shadeId: 'P07-350G',
    productId: 'P07',
    shadeCode: '350G',
    shadeName: 'Dulce De Leche',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetDepth: ['tan'],
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
  },
  {
    shadeId: 'P07-330N',
    productId: 'P07',
    shadeCode: '330N',
    shadeName: 'Butter Pecan',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetDepth: ['tan'],
    targetUndertones: ['neutral'],
    inferredUndertone: 'neutral',
  },
  {
    shadeId: 'P07-210B',
    productId: 'P07',
    shadeCode: '210B',
    shadeName: 'Chai',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetDepth: ['medium'],
    targetUndertones: ['cool'],
    inferredUndertone: 'cool',
  },

  // --- P08: Bobbi Brown Weightless Skin Foundation ---
  {
    shadeId: 'P08-natural',
    productId: 'P08',
    shadeName: 'Natural',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetDepth: ['medium'],
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
  },

  // --- P09: Estée Lauder Double Wear ---
  {
    shadeId: 'P09-1N1',
    productId: 'P09',
    shadeCode: '1N1',
    shadeName: 'Ivory Nude',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetDepth: ['fair', 'light'],
    targetUndertones: ['neutral'],
    inferredUndertone: 'neutral',
  },

  // --- P10: Swiss Beauty Non-Transfer Lipstick (30 shades) ---
  ...([
    { name: 'Bare', code: '415', tone: 'neutral' as const },
    { name: 'Mauve-Taupe', code: '416', tone: 'cool' as const },
    { name: 'Bronze', code: '417', tone: 'warm' as const },
    { name: 'Chocobar', code: '419', tone: 'warm' as const },
    { name: 'Lust-On', tone: 'neutral' as const },
    { name: 'Mulberry-Villain', tone: 'cool' as const },
    { name: 'Pink-Sugar', tone: 'cool' as const },
    { name: 'Roseate', code: '428', tone: 'neutral' as const },
    { name: 'Orange-Red', code: '405', tone: 'warm' as const },
    { name: 'Spice-Nude', code: '430', tone: 'warm' as const },
    { name: 'Purple-Villain', tone: 'cool' as const },
    { name: 'Pink-Blossom', tone: 'cool' as const },
    { name: 'Loud-Pink', code: '402', tone: 'cool' as const },
    { name: 'Cupid-Pink', tone: 'cool' as const },
    { name: 'Hot-Red', tone: 'neutral' as const },
    { name: 'Russian-Red', tone: 'cool' as const },
    { name: 'Magic-Maroon', code: '411', tone: 'cool' as const },
    { name: 'Oxblood', code: '412', tone: 'cool' as const },
    { name: 'Royal-Maroon', code: '413', tone: 'cool' as const },
    { name: 'Rusty-Nude', code: '418', tone: 'warm' as const },
    { name: 'Smoking-Red', tone: 'warm' as const },
    { name: 'Wine-Red', tone: 'cool' as const },
    { name: 'Brown-Maroon', code: '414', tone: 'warm' as const },
    { name: 'Dark-Brown', code: '420', tone: 'warm' as const },
    { name: 'Burgundy', code: '422', tone: 'cool' as const },
    { name: 'Coral-Crush', tone: 'warm' as const },
    { name: 'Mellow-Drama', tone: 'neutral' as const },
    { name: 'Vivid-Magenta', code: '404', tone: 'cool' as const },
    { name: 'Blood-Red', code: '408', tone: 'neutral' as const },
    { name: 'Fuchsia-Magenta', tone: 'cool' as const },
  ].map((s, i) => ({
    shadeId: `P10-${s.code || i + 1}`,
    productId: 'P10',
    shadeCode: s.code,
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetUndertones: [s.tone],
    inferredUndertone: s.tone,
    brandColourFamily: s.tone === 'cool' ? 'Cool Berry / Rose' : s.tone === 'warm' ? 'Warm Terracotta / Coral' : 'Neutral Nude / Classic Red',
  }))),

  // --- P11: Swiss Beauty Non-transfer Matte Lipstick (30 shades) ---
  ...([
    { name: 'Siren in Scarlet', tone: 'neutral' as const },
    { name: 'Cute Nude', code: '9', tone: 'neutral' as const },
    { name: 'Fire Pink', code: '5', tone: 'cool' as const },
    { name: 'Mauve Blush', code: '7', tone: 'cool' as const },
    { name: 'Brandy Herrington', tone: 'warm' as const },
    { name: 'Athena', tone: 'neutral' as const },
    { name: 'Berrylicious', tone: 'cool' as const },
    { name: 'Hot Cherry', code: '4', tone: 'cool' as const },
    { name: 'Coffee', code: '18', tone: 'warm' as const },
    { name: 'Orange Red', tone: 'warm' as const },
    { name: 'Pink Up', tone: 'cool' as const },
    { name: 'Chocolava', code: '11', tone: 'warm' as const },
    { name: 'First Love', tone: 'neutral' as const },
    { name: 'Peach Day', code: '8', tone: 'warm' as const },
    { name: 'Choco Kiss', tone: 'warm' as const },
    { name: 'Red Letter', tone: 'neutral' as const },
    { name: 'Pop Red', tone: 'warm' as const },
    { name: 'Lilac Blush', code: '29', tone: 'cool' as const },
    { name: 'Dark Brown', tone: 'warm' as const },
    { name: 'Plum House', code: '6', tone: 'cool' as const },
    { name: 'Attitude', tone: 'neutral' as const },
    { name: 'Sand Rose', tone: 'neutral' as const },
    { name: 'Fresh Red', tone: 'neutral' as const },
    { name: 'Shy Pink', tone: 'cool' as const },
    { name: 'Bold Wine', tone: 'cool' as const },
    { name: 'Caramel Delights', code: '30', tone: 'warm' as const },
    { name: 'Murphy Brown', tone: 'warm' as const },
    { name: 'Dynamitte Berry', tone: 'cool' as const },
    { name: 'Wine Blush', code: '10', tone: 'cool' as const },
    { name: 'Naked', tone: 'neutral' as const },
  ].map((s, i) => ({
    shadeId: `P11-${s.code || i + 1}`,
    productId: 'P11',
    shadeCode: s.code,
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetUndertones: [s.tone],
    inferredUndertone: s.tone,
    brandColourFamily: s.tone === 'cool' ? 'Cool Mauve / Wine' : s.tone === 'warm' ? 'Warm Caramel / Peach' : 'Neutral Nude / Rose',
  }))),

  // --- P12: Faces Canada Weightless Creme Finish Lipstick ---
  {
    shadeId: 'P12-02',
    productId: 'P12',
    shadeCode: '02',
    shadeName: 'Rock Solid',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetUndertones: ['neutral'],
    inferredUndertone: 'neutral',
    brandColourFamily: 'Neutral Nude / Rosy Brown',
  },

  // --- P13: Charlotte Tilbury Matte Revolution ---
  {
    shadeId: 'P13-pillowtalk-med',
    productId: 'P13',
    shadeName: 'Pillow Talk Medium',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetUndertones: ['neutral', 'cool'],
    inferredUndertone: 'neutral',
    brandColourFamily: 'Warm Berry Pink',
  },

  // --- P14: SUGAR Mettle Satin Lipstick ---
  {
    shadeId: 'P14-10',
    productId: 'P14',
    shadeCode: '10',
    shadeName: 'Diana',
    brandColourFamily: 'Peachy pink',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
  },

  // --- P15: Fenty Beauty Gloss Bomb Universal Lip Luminizer (6 shades) ---
  ...([
    { name: 'Fu$$y', tone: 'cool' as const },
    { name: 'Glass Slipper', tone: 'neutral' as const },
    { name: 'Mango Marz', tone: 'warm' as const },
    { name: '$weet Mouth', tone: 'cool' as const },
    { name: 'Champ Stamp Fantasy', tone: 'cool' as const },
    { name: 'Fenty Glow', tone: 'neutral' as const },
  ].map(s => ({
    shadeId: `P15-${s.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
    productId: 'P15',
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetUndertones: [s.tone],
    inferredUndertone: s.tone,
    brandColourFamily: s.tone === 'cool' ? 'Cool Rose / Pink Shimmer' : s.tone === 'warm' ? 'Warm Peach / Bronze' : 'Universal Rose Nude',
  }))),

  // --- P16: rom&nd Juicy Lasting Tint (Original 5.5g) ---
  {
    shadeId: 'P16-21',
    productId: 'P16',
    shadeCode: '21',
    shadeName: 'Deep Sangria',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetUndertones: ['cool'],
    inferredUndertone: 'cool',
    brandColourFamily: 'Deep Cool Sangria',
  },
  {
    shadeId: 'P16-13',
    productId: 'P16',
    shadeCode: '13',
    shadeName: 'Eat Dotori',
    colourDataType: 'unavailable',
    dataQuality: 'medium',
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
    brandColourFamily: 'Warm Acorn Brown',
  },

  // --- P17: rom&nd The Juicy Lasting Tint (Newer 3.5g) ---
  ...([
    { code: '04', name: 'Fig Fig', tone: 'cool' as const },
    { code: '17', name: 'Dark Coconut', tone: 'warm' as const },
    { code: '02', name: 'Nucadamia', tone: 'neutral' as const },
    { code: '14', name: 'Almond Rose', tone: 'cool' as const },
    { code: '03', name: 'Bare Grape', tone: 'cool' as const },
    { code: '24', name: 'Bare Juicy Oh', tone: 'warm' as const },
  ].map(s => ({
    shadeId: `P17-${s.code}`,
    productId: 'P17',
    shadeCode: s.code,
    shadeName: s.name,
    colourDataType: 'unavailable' as const,
    dataQuality: 'medium' as const,
    targetUndertones: [s.tone],
    inferredUndertone: s.tone,
    brandColourFamily: s.tone === 'cool' ? 'Cool Mauve / Fig' : s.tone === 'warm' ? 'Warm Coconut / Peach' : 'Soft Neutral Nude',
  }))),

  // --- P18: Kay Beauty Creme Blush (5 shades) ---
  {
    shadeId: 'P18-rustic-rush',
    productId: 'P18',
    shadeName: 'Rustic Rush',
    ingredientRecordId: 'I03A',
    colourDataType: 'unavailable',
    dataQuality: 'high',
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
    brandColourFamily: 'Warm Terracotta Brick',
  },
  {
    shadeId: 'P18-sweetheart-pink',
    productId: 'P18',
    shadeName: 'Sweetheart Pink',
    ingredientRecordId: 'I03C',
    colourDataType: 'unavailable',
    dataQuality: 'high',
    targetUndertones: ['cool'],
    inferredUndertone: 'cool',
    brandColourFamily: 'Cool Bubblegum Pink',
  },
  {
    shadeId: 'P18-flirty-nude',
    productId: 'P18',
    shadeName: 'Flirty Nude',
    ingredientRecordId: 'I03A',
    colourDataType: 'unavailable',
    dataQuality: 'high',
    targetUndertones: ['neutral'],
    inferredUndertone: 'neutral',
    brandColourFamily: 'Neutral Dusty Nude',
  },
  {
    shadeId: 'P18-cosy-coral',
    productId: 'P18',
    shadeName: 'Cosy Coral',
    ingredientRecordId: 'I03A',
    colourDataType: 'unavailable',
    dataQuality: 'high',
    targetUndertones: ['warm'],
    inferredUndertone: 'warm',
    brandColourFamily: 'Warm Vibrant Coral',
  },
  {
    shadeId: 'P18-rosy-romance',
    productId: 'P18',
    shadeName: 'Rosy Romance',
    ingredientRecordId: 'I03B',
    colourDataType: 'unavailable',
    dataQuality: 'high',
    targetUndertones: ['cool'],
    inferredUndertone: 'cool',
    brandColourFamily: 'Cool Rose Mauve',
  },

  // --- P19: Swiss Beauty Ultimate 9 Pigmented Colors Eyeshadow Palette (8 palette variants) ---
  ...([
    { name: 'Shade 01', tone: 'neutral' as const },
    { name: 'Shade 02', tone: 'warm' as const },
    { name: 'Shade 03', tone: 'cool' as const },
    { name: 'Shade 04', tone: 'neutral' as const },
    { name: 'Shade 05', tone: 'warm' as const },
    { name: 'Shade 06', tone: 'cool' as const },
    { name: 'Shade 07', tone: 'neutral' as const },
    { name: 'Shade 08', tone: 'warm' as const },
  ].map((s, i) => ({
    shadeId: `P19-0${i + 1}`,
    productId: 'P19',
    shadeCode: `0${i + 1}`,
    shadeName: s.name,
    colourDataType: 'unavailable' as const, // Never give a 9-pan palette one HEX!
    dataQuality: 'medium' as const,
    targetUndertones: [s.tone],
    inferredUndertone: s.tone,
  }))),
];

// ============================================================================
// 4. COMMERCIAL OFFERS
// ============================================================================
export const RESEARCH_OFFERS: OfferEntity[] = [
  // P01: Kay Beauty Foundation
  {
    offerId: 'OFF-P01-kay',
    productId: 'P01',
    retailer: 'Kay Beauty Official Store',
    priceInr: 1800,
    mrpInr: 1800,
    availabilityStatus: 'unavailable', // 20/20 unavailable in store
    sourceUrl: 'https://www.kaybeauty.com/en-gb/products/kay-beauty-hydrating-foundation',
    observedAt: '2026-10-23',
    notes: 'Kay Beauty official storefront out of stock across all 20 shades.',
  },

  // P02: SUGAR Foundation Stick
  {
    offerId: 'OFF-P02-sugar',
    productId: 'P02',
    retailer: 'SUGAR Cosmetics Store',
    priceInr: 1169, // Most shades 1169; 07/32 are 1079
    mrpInr: 1299,
    availabilityStatus: 'available', // 11/12 available
    sourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-foundation-stick',
    observedAt: '2026-10-23',
  },

  // P03: SUGAR Dewy Foundation
  {
    offerId: 'OFF-P03-sugar',
    productId: 'P03',
    retailer: 'SUGAR Cosmetics Store',
    priceInr: 699,
    mrpInr: 799,
    availabilityStatus: 'available', // Flat White available, others unavailable
    sourceUrl: 'https://www.sugarcosmetics.com/products/ace-of-face-dewy-foundation',
    observedAt: '2026-10-23',
  },

  // P04: Lakmé CC Cream
  {
    offerId: 'OFF-P04-lakme',
    productId: 'P04',
    retailer: 'Lakmé Official Store',
    priceInr: 339, // 288–369.75 by variant
    mrpInr: 399,
    availabilityStatus: 'unavailable', // all 6 variants unavailable
    sourceUrl: 'https://www.lakmeindia.com/products/lakme-9-to-5-complexion-care-face-cream',
    observedAt: '2026-10-23',
  },

  // P05: Insight HD Concealer
  {
    offerId: 'OFF-P05-insight',
    productId: 'P05',
    retailer: 'Insight Cosmetics Store',
    priceInr: 310,
    mrpInr: 310,
    availabilityStatus: 'available',
    sourceUrl: 'https://insightcosmetics.in/products/hd-concealer',
    observedAt: '2026-10-23',
  },

  // P06: Maybelline Fit Me Concealer
  {
    offerId: 'OFF-P06-tira',
    productId: 'P06',
    retailer: 'Tira Beauty',
    priceInr: 419, // 329-521 across captures
    mrpInr: 599,
    availabilityStatus: 'available',
    sourceUrl: 'https://www.tirabeauty.com/product/maybelline-new-york-fit-me-concealer---25-medium-68ml-0giyeqtuwx7',
    observedAt: '2026-10-23',
  },

  // P07: Huda Beauty Easy Blur Foundation
  {
    offerId: 'OFF-P07-tira',
    productId: 'P07',
    retailer: 'Tira Beauty',
    priceInr: 3700, // Rendered 3,700; indexed 3,380 conflict
    mrpInr: 3700,
    availabilityStatus: 'available',
    sourceUrl: 'https://www.tirabeauty.com/product/huda-beauty-easy-blur-natural-airbrush-foundation-dulce-de-leche-350g-30-ml-7606332',
    observedAt: '2026-10-23',
  },

  // P08: Bobbi Brown Foundation
  {
    offerId: 'OFF-P08-nykaa',
    productId: 'P08',
    retailer: 'Nykaa',
    priceInr: 4990,
    mrpInr: 4990,
    availabilityStatus: 'unknown',
    sourceUrl: 'https://www.nykaa.com',
    observedAt: '2026-10-23',
  },

  // P09: Estée Lauder Double Wear
  {
    offerId: 'OFF-P09-sephora',
    productId: 'P09',
    retailer: 'Sephora India',
    priceInr: 4500,
    mrpInr: 4500,
    availabilityStatus: 'unknown',
    sourceUrl: 'https://sephora.in/product/estee-lauder-double-wear-stay-in-place-makeup-spf-10-foundation-v-1n1-ivory-nude-185093',
    observedAt: '2026-10-23',
  },

  // P10: Swiss Beauty Non-Transfer Lipstick
  {
    offerId: 'OFF-P10-brand',
    productId: 'P10',
    retailer: 'Swiss Beauty Official Store',
    priceInr: 399,
    mrpInr: 399,
    availabilityStatus: 'available',
    sourceUrl: 'https://swissbeauty.in/products/non-transfer-matte-lipstick-bare-sb-s17-15',
    observedAt: '2026-10-23',
  },

  // P11: Swiss Beauty Non-transfer Matte Lipstick
  {
    offerId: 'OFF-P11-brand',
    productId: 'P11',
    retailer: 'Swiss Beauty Official Store',
    priceInr: 329,
    mrpInr: 329,
    availabilityStatus: 'available', // 7/30 available
    sourceUrl: 'https://swissbeauty.in/products/non-transfer-matte-lipstick-sb-209',
    observedAt: '2026-10-23',
  },

  // P12: Faces Canada Weightless Creme Finish Lipstick
  {
    offerId: 'OFF-P12-brand',
    productId: 'P12',
    retailer: 'Faces Canada Store',
    priceInr: 239.20,
    mrpInr: 299,
    availabilityStatus: 'available',
    sourceUrl: 'https://www.facescanada.com/products/weightless-creme-finish-lipstick-rock-solid-02',
    observedAt: '2026-10-23',
  },

  // P13: Charlotte Tilbury Matte Revolution
  {
    offerId: 'OFF-P13-nykaa',
    productId: 'P13',
    retailer: 'Nykaa',
    priceInr: 3850,
    mrpInr: 3850,
    availabilityStatus: 'unknown',
    sourceUrl: 'https://www.nykaa.com',
    observedAt: '2026-10-23',
  },

  // P14: SUGAR Mettle Satin Lipstick
  {
    offerId: 'OFF-P14-sugar',
    productId: 'P14',
    retailer: 'SUGAR Cosmetics Store',
    priceInr: 999, // Fallback indicative price; research noted specific price unestablished
    mrpInr: 999,
    availabilityStatus: 'unknown',
    sourceUrl: 'https://www.sugarcosmetics.com',
    observedAt: '2026-10-23',
    notes: 'Price unconfirmed in research; marked unknown availability.',
  },

  // P15: Fenty Beauty Gloss Bomb
  {
    offerId: 'OFF-P15-sephora',
    productId: 'P15',
    retailer: 'Sephora India',
    priceInr: 1850, // Reference price; local price unestablished in research
    mrpInr: 1850,
    availabilityStatus: 'listed_only',
    sourceUrl: 'https://sephora.in',
    observedAt: '2026-10-23',
    notes: 'Indian listing found; local checkout price not established.',
  },

  // P16: rom&nd Juicy Lasting Tint (Original)
  {
    offerId: 'OFF-P16-tira',
    productId: 'P16',
    retailer: 'Tira Beauty',
    priceInr: 801,
    mrpInr: 890,
    availabilityStatus: 'available',
    sourceUrl: 'https://www.tirabeauty.com',
    observedAt: '2026-10-23',
  },

  // P17: rom&nd The Juicy Lasting Tint (Newer)
  {
    offerId: 'OFF-P17-tira',
    productId: 'P17',
    retailer: 'Tira Beauty',
    priceInr: 918,
    mrpInr: 1020,
    availabilityStatus: 'available',
    sourceUrl: 'https://www.tirabeauty.com',
    observedAt: '2026-10-23',
  },

  // P18: Kay Beauty Creme Blush
  {
    offerId: 'OFF-P18-kay',
    productId: 'P18',
    retailer: 'Kay Beauty Store',
    priceInr: 764, // 764-899
    mrpInr: 899,
    availabilityStatus: 'available', // 4 of 5 available
    sourceUrl: 'https://www.kaybeauty.com/products/kay-beauty-creme-blush-1',
    observedAt: '2026-10-23',
  },

  // P19: Swiss Beauty Ultimate Eyeshadow Palette
  {
    offerId: 'OFF-P19-nykaa',
    productId: 'P19',
    retailer: 'Nykaa',
    priceInr: 263,
    mrpInr: 329,
    availabilityStatus: 'unavailable', // Shade 07 observed unavailable
    sourceUrl: 'https://www.nykaa.com/swiss-beauty-ultimate-shadow-palette/p/8423343',
    observedAt: '2026-10-23',
  },
];

// Map of Ingredient Records by ID for rapid access
const INGREDIENT_RECORD_MAP = new Map<string, IngredientRecordEntity>(
  RESEARCH_INGREDIENTS.map(rec => [rec.ingredientRecordId, rec])
);

// Map of Product Families by ID
const PRODUCT_FAMILY_MAP = new Map<string, ProductEntity>(
  RESEARCH_PRODUCTS.map(p => [p.productId, p])
);

// Map of Primary Offer by Product ID
const PRIMARY_OFFER_MAP = new Map<string, OfferEntity>(
  RESEARCH_OFFERS.map(o => [o.productId, o])
);

// ============================================================================
// 5. RESOLVED CATALOGUE GENERATION
// ============================================================================
/**
 * Assemble relational entities (Product + Shade + Offer + Ingredients) into
 * resolved `Product` instances consumed by the recommendation engine and UI.
 */
export const INDIAN_RESEARCH_CATALOGUE: Product[] = RESEARCH_SHADES.map(shade => {
  const family = PRODUCT_FAMILY_MAP.get(shade.productId)!;
  const offer = PRIMARY_OFFER_MAP.get(shade.productId);
  const effectiveIngredientRecordId = shade.ingredientRecordId || family.ingredientRecordId;
  const ingredientRecord = effectiveIngredientRecordId
    ? INGREDIENT_RECORD_MAP.get(effectiveIngredientRecordId)
    : undefined;

  // Specific shade price overrides (e.g. SUGAR stick 07 and 32 are ₹1,079)
  let effectivePrice = offer?.priceInr || 1500;
  if (shade.productId === 'P02' && (shade.shadeCode === '07' || shade.shadeCode === '32')) {
    effectivePrice = 1079;
  } else if (shade.productId === 'P02') {
    effectivePrice = 1169;
  } else if (shade.productId === 'P04') {
    if (shade.shadeName === 'Bronze') effectivePrice = 369.75;
    else if (shade.shadeName === 'Honey' || shade.shadeName === 'Frappe') effectivePrice = 339;
    else effectivePrice = 288;
  } else if (shade.productId === 'P06') {
    if (shade.shadeCode === '10' || shade.shadeCode === '35') effectivePrice = 359;
    else if (shade.shadeCode === '30') effectivePrice = 329;
    else if (shade.shadeCode === '50') effectivePrice = 521;
    else effectivePrice = 419;
  } else if (shade.productId === 'P18') {
    if (shade.shadeName === 'Rustic Rush') effectivePrice = 764;
    else if (shade.shadeName === 'Flirty Nude' || shade.shadeName === 'Cosy Coral') effectivePrice = 809;
    else effectivePrice = 899;
  }

  // Specific availability overrides
  let availability = offer?.availabilityStatus || 'unknown';
  if (shade.productId === 'P02' && shade.shadeCode === '37') {
    availability = 'unavailable'; // Freddo is unavailable
  } else if (shade.productId === 'P03' && shade.shadeCode !== '05') {
    availability = 'unavailable'; // Only Flat White available
  } else if (shade.productId === 'P18' && shade.shadeName === 'Flirty Nude') {
    availability = 'unavailable';
  }

  // Derive formula attributes
  const formulaAttributes: string[] = [];
  if (family.finish && family.finish !== 'unavailable') formulaAttributes.push(`${family.finish} finish`);
  if (family.coverage && family.coverage !== 'unavailable') formulaAttributes.push(`${family.coverage} coverage`);
  if (family.size) formulaAttributes.push(family.size);
  if (family.skinTypePositioning) formulaAttributes.push(family.skinTypePositioning);

  // Derive declared allergen tags from ingredient record
  const declaredAllergenTags: string[] = [];
  if (ingredientRecord) {
    const rawLower = ingredientRecord.rawText.toLowerCase();
    if (rawLower.includes('paraben')) declaredAllergenTags.push('parabens');
    if (rawLower.includes('dimethicone') || rawLower.includes('silicone') || rawLower.includes('cyclopentasiloxane')) {
      declaredAllergenTags.push('silicones');
    }
    if (rawLower.includes('talc')) declaredAllergenTags.push('talc');
    if (rawLower.includes('fragrance') || rawLower.includes('parfum')) declaredAllergenTags.push('fragrance');
    if (rawLower.includes('phenoxyethanol')) declaredAllergenTags.push('phenoxyethanol');
    if (rawLower.includes('mica')) declaredAllergenTags.push('mica');
  }

  // Derive suitable occasions based on category and shade style
  let suitableOccasions: Occasion[] = ['everyday', 'office', 'casual'];
  const shadeNameLower = shade.shadeName.toLowerCase();
  const isBoldOrEvening =
    shadeNameLower.includes('red') ||
    shadeNameLower.includes('wine') ||
    shadeNameLower.includes('burgundy') ||
    shadeNameLower.includes('oxblood') ||
    shadeNameLower.includes('maroon') ||
    shadeNameLower.includes('sangria') ||
    shadeNameLower.includes('dark');

  if (family.category === 'lipstick' || family.category === 'lipgloss') {
    if (isBoldOrEvening) {
      suitableOccasions = ['evening', 'wedding', 'festive', 'casual'];
    } else {
      suitableOccasions = ['everyday', 'office', 'casual', 'festive'];
    }
  } else if (family.category === 'foundation') {
    if (family.finish === 'matte' && family.coverage === 'full') {
      suitableOccasions = ['office', 'evening', 'wedding', 'festive'];
    } else {
      suitableOccasions = ['everyday', 'casual', 'office', 'festive'];
    }
  } else if (family.category === 'eyeshadow') {
    suitableOccasions =
      shadeNameLower.includes('01') || shadeNameLower.includes('04') || shadeNameLower.includes('07')
        ? ['everyday', 'office', 'casual']
        : ['evening', 'festive', 'wedding', 'casual'];
  } else {
    suitableOccasions = ['everyday', 'office', 'casual', 'evening', 'festive', 'wedding'];
  }

  return {
    id: shade.shadeId,
    productId: family.productId,
    shadeId: shade.shadeId,
    brand: family.brand,
    name: family.productName,
    category: family.category,
    subcategory: family.subcategory,
    shadeName: shade.shadeName,
    shadeCode: shade.shadeCode,
    shadeHex: shade.digitalHex || null,
    shadeLab: shade.digitalLab || null,
    colourDataType: shade.colourDataType,
    price: Math.round(effectivePrice),
    mrp: offer?.mrpInr || null,
    finish: family.finish,
    coverage: family.coverage,
    targetDepth: shade.targetDepth,
    targetUndertones: shade.targetUndertones,
    suitableOccasions,
    formulaAttributes,
    ingredients: ingredientRecord ? ingredientRecord.ingredients : [],
    ingredientRecordId: family.ingredientRecordId,
    ingredientCompleteness: ingredientRecord ? ingredientRecord.completenessStatus : 'ingredients_unavailable',
    declaredAllergenTags,
    userPreferenceTags: [family.category, family.brand.toLowerCase()],
    availabilityStatus: availability,
    retailer: offer?.retailer,
    productUrl: family.productUrl,
    offerSourceUrl: offer?.sourceUrl,
    dataCompleteness: ingredientRecord?.completenessStatus === 'complete_as_published' ? 'complete' : 'partial',
    dataStatus: family.dataStatus,
    dataQuality: shade.dataQuality,
    description: family.description || `${family.brand} ${family.productName} in shade ${shade.shadeName}.`,
    rawProduct: family,
    rawShade: shade,
    rawOffer: offer,
    rawIngredients: ingredientRecord,
  };
});

/**
 * Standard catalogue alias: points directly to the real researched Indian market catalogue.
 */
export const DEMO_PRODUCT_CATALOGUE: Product[] = INDIAN_RESEARCH_CATALOGUE;

/**
 * Query products by category.
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return INDIAN_RESEARCH_CATALOGUE.filter(p => p.category === category);
}

/**
 * Retrieve a single product by shade ID or product ID.
 */
export function getProductById(id: string): Product | undefined {
  return INDIAN_RESEARCH_CATALOGUE.find(p => p.id === id || p.shadeId === id || p.productId === id);
}
