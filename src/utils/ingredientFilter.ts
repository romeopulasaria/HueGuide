import { Product } from '../types';

/**
 * Common documented ingredient aliases and canonical keys.
 * Explicit lookup mapping to handle cosmetic naming variations without guesswork.
 */
export const INGREDIENT_CANONICAL_ALIASES: Record<string, string[]> = {
  fragrance: ['fragrance', 'parfum', 'perfume', 'aroma', 'fragrance (parfum)'],
  parabens: [
    'paraben',
    'parabens',
    'methylparaben',
    'ethylparaben',
    'propylparaben',
    'butylparaben',
    'isobutylparaben',
  ],
  silicones: [
    'silicone',
    'silicones',
    'dimethicone',
    'cyclopentasiloxane',
    'cyclohexasiloxane',
    'phenyl trimethicone',
    'amodimethicone',
  ],
  sulfates: [
    'sulfate',
    'sulfates',
    'sodium lauryl sulfate',
    'sodium laureth sulfate',
    'sls',
    'sles',
    'ammonium lauryl sulfate',
  ],
  talc: ['talc', 'talcum', 'talcum powder', 'magnesium silicate'],
  phenoxyethanol: ['phenoxyethanol', '2-phenoxyethanol', 'rose ether'],
  lanolin: ['lanolin', 'lanolin oil', 'lanolin alcohol', 'acetylated lanolin'],
  essential_oils: [
    'essential oil',
    'essential oils',
    'lavender oil',
    'citrus limon peel oil',
    'rosemary leaf oil',
    'tea tree leaf oil',
    'eucalyptus globulus leaf oil',
  ],
  tree_nuts: [
    'almond oil',
    'sweet almond oil',
    'prunus amygdalus dulcis oil',
    'walnut oil',
    'macadamia seed oil',
    'shea butter',
    'butyrospermum parkii',
  ],
  bismuth_oxychloride: ['bismuth oxychloride', 'ci 77163'],
  mica: ['mica', 'ci 77019'],
};

/**
 * Normalize an ingredient string for reliable token matching:
 * lowercase, strip non-alphanumeric punctuation except hyphens, collapse spaces.
 */
export function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a product contains any user-excluded ingredients or allergens.
 * Returns exclusion status, list of detected triggers, and uncertainty warnings.
 */
export function evaluateProductIngredients(
  product: Product,
  userAllergens: string[],
  userAvoidedSubstances: string[]
): {
  isExcluded: boolean;
  exclusionReasons: string[];
  isIncomplete: boolean;
  hasUncertaintyWarning: boolean;
  uncertaintyMessage?: string;
} {
  if (!product) {
    return {
      isExcluded: false,
      exclusionReasons: [],
      isIncomplete: true,
      hasUncertaintyWarning: false,
    };
  }

  const combinedExclusions = [
    ...userAllergens.map(a => normalizeIngredient(a)),
    ...userAvoidedSubstances.map(s => normalizeIngredient(s)),
  ].filter(s => s.length > 0);

  // Check data completeness
  const isComplete =
    (product.ingredientCompleteness === 'complete' ||
      product.ingredientCompleteness === 'complete_as_published' ||
      product.dataCompleteness === 'complete') &&
    product.ingredients &&
    product.ingredients.length > 0;

  const isIncomplete = !isComplete;

  const detectedExclusions: string[] = [];

  if (combinedExclusions.length > 0) {
    const productNormalizedIngredients = (product.ingredients || []).map(normalizeIngredient);
    const declaredTags = (product.declaredAllergenTags || []).map(normalizeIngredient);

    for (const userTerm of combinedExclusions) {
      // Find all synonyms/aliases matching the user term
      let termsToMatch = [userTerm];
      for (const [canonical, aliases] of Object.entries(INGREDIENT_CANONICAL_ALIASES)) {
        const normalizedAliases = aliases.map(normalizeIngredient);
        if (canonical === userTerm || normalizedAliases.includes(userTerm)) {
          termsToMatch = Array.from(new Set([...termsToMatch, canonical, ...normalizedAliases]));
        }
      }

      // Check against product ingredient list
      for (const ing of productNormalizedIngredients) {
        for (const matchTerm of termsToMatch) {
          if (ing === matchTerm || ing.includes(matchTerm) || matchTerm.includes(ing)) {
            detectedExclusions.push(`Contains '${ing}' (matches excluded '${userTerm}')`);
            break;
          }
        }
      }

      // Check against declared allergen tags
      for (const tag of declaredTags) {
        for (const matchTerm of termsToMatch) {
          if (tag === matchTerm || tag.includes(matchTerm)) {
            detectedExclusions.push(`Tagged with '${tag}' (matches excluded '${userTerm}')`);
            break;
          }
        }
      }
    }
  }

  const uniqueExclusions = Array.from(new Set(detectedExclusions));
  const isExcluded = uniqueExclusions.length > 0;

  let uncertaintyMessage: string | undefined;
  if (isIncomplete && combinedExclusions.length > 0) {
    if (product.ingredientCompleteness === 'ingredients_unavailable') {
      uncertaintyMessage =
        'Complete ingredient disclosure is unavailable in research records for this product. Absence of excluded substances cannot be verified.';
    } else {
      uncertaintyMessage =
        'This product has partial or minimal ingredient disclosures on file. We cannot confirm the absence of all avoided substances.';
    }
  }

  return {
    isExcluded,
    exclusionReasons: uniqueExclusions,
    isIncomplete,
    hasUncertaintyWarning: !!uncertaintyMessage,
    uncertaintyMessage,
  };
}
