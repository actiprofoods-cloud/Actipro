/*
 * Data for /products — the six-oil range page.
 *
 * Kept separate from productData.js on purpose. That file describes the OLD
 * pack design (Madhuri roundel, red label, jerry-can bottle) and is still used
 * by the landing page's showcase. This file describes the NEW range artwork in
 * /public/page/product.png: white label, ActiPro wordmark, slim bottle,
 * coloured cap. The two designs must not be mixed in one row.
 *
 * Bottle art: the four cooking oils use the supplied pack renders in
 * /public/product (the ChatGPT-named PNGs), converted to WebP as range-*.webp.
 * They are proper product shots — real alpha, no foreground clutter — and
 * replace an earlier set that had been cut out of the banner render.
 *
 * Ratings are the figures printed on the supplied page reference — they are
 * marketing copy, not a live review feed.
 */

// The four benefit pills under the hero headline.
export const HERO_BENEFITS = [
  { icon: 'drop', title: 'Omega 6', body: 'Supports overall wellness' },
  { icon: 'drop', title: 'Vitamin A & D', body: 'Supports strong bones & immunity' },
  { icon: 'atom', title: 'Antioxidants', body: 'Help fight free radicals' },
  { icon: 'heart', title: 'Low Cholesterol', body: 'Helps maintain heart health' },
]

// Filter tabs above the grid. `all` is the default.
/* Finishing and Gifting were the Coconut/Olive tabs. Those two products are
   not in the range, so both tabs would now filter to an empty grid - they are
   dropped rather than left to render "No oils in this range yet." */
export const RANGE_TABS = [
  { key: 'all', label: 'All Oils' },
  { key: 'cooking', label: 'Cooking' },
]

export const SORT_OPTIONS = ['Popular', 'Rating', 'Name']

/*
 * The range. `tags` drives the filter tabs; `icons` picks which of the four
 * benefit glyphs show on the card.
 *
 * Four oils, matching the four supplied pack renders. Coconut and Olive were
 * dropped: no pack shot exists for either, and the stand-ins cut from the
 * banner were a different bottle design (white ActiPro label vs the Madhuri
 * Actipro packaging), so the row read as two brands side by side.
 */
export const RANGE = [
  {
    id: 'sunflower',
    name: 'ActiPro Sunflower Oil',
    short: 'Sunflower',
    image: '/product/range-sunflower.webp',
    alt: 'ActiPro Refined Sunflower Oil bottle with a yellow cap',
    rating: 4.6,
    reviews: 1254,
    tags: ['cooking'],
    icons: ['drop', 'bottle', 'atom', 'heart'],
    note: 'Refined · Source of Vitamin E',
  },
  {
    id: 'mustard',
    name: 'ActiPro Mustard Oil',
    short: 'Mustard',
    image: '/product/range-mustard.webp',
    alt: 'ActiPro Kachi Ghani Mustard Oil bottle with an orange cap',
    rating: 4.6,
    reviews: 986,
    tags: ['cooking'],
    icons: ['drop', 'bottle', 'atom', 'heart'],
    note: 'Kachi Ghani · Rich in MUFA',
  },
  {
    id: 'groundnut',
    name: 'ActiPro Groundnut Oil',
    short: 'Groundnut',
    image: '/product/range-groundnut.webp',
    alt: 'ActiPro Refined Groundnut Oil bottle with a red cap',
    rating: 4.7,
    reviews: 1105,
    tags: ['cooking'],
    icons: ['drop', 'bottle', 'atom', 'heart'],
    note: 'Refined · Rich in Vitamin E',
  },
  {
    id: 'ricebran',
    name: 'ActiPro Rice Bran Oil',
    short: 'Rice Bran',
    image: '/product/range-ricebran.webp',
    alt: 'ActiPro Rice Bran Oil bottle with a green cap',
    rating: 4.6,
    reviews: 745,
    tags: ['cooking'],
    icons: ['drop', 'bottle', 'atom', 'heart'],
    note: 'Refined · Oryzanol goodness',
  },
]

/* "How It's Made — Our ADT Process".
 * `art` is a real photo now — the three supplied images in /public/page,
 * background-removed and converted to WebP. They replaced the placeholder
 * SVGs that stood in while no illustration set existed. */
export const ADT_STEPS = [
  {
    n: 1,
    title: 'Advanced Selection',
    body: 'We source the best quality seeds, cleaned and graded for purity.',
    alt: 'Oilseeds in a wooden bowl with a wooden scoop',
    art: '/page/adt-seeds.webp',
  },
  {
    n: 2,
    title: 'Refined with Care (ADT)',
    body: 'Advanced refining at optimized temperature preserves nutrients and purity.',
    alt: 'Stainless steel refinery towers and tanks',
    art: '/page/adt-plant.webp',
  },
  {
    n: 3,
    title: 'Naturally Filtered',
    body: 'Filtered to retain goodness, aroma and authentic taste.',
    alt: 'Golden oil straining through muslin into a steel bowl',
    art: '/page/adt-filter.webp',
  },
]

// "What's Inside, For You"
export const INSIDE = [
  { icon: 'heart', title: 'Heart Friendly', body: 'Helps maintain healthy cholesterol levels.' },
  { icon: 'drop', title: 'Strong From Within', body: 'Rich in Vitamin A & D for stronger bones and immunity.' },
  { icon: 'leaf', title: 'Packed With Antioxidants', body: 'Helps fight free radicals and supports overall well-being.' },
  { icon: 'pot', title: 'Light & Easy to Digest', body: 'Perfect for everyday cooking, light on your stomach.' },
]

// Nutritional Information (Approx.) — serving 10g, 100 servings per pack.
export const NUTRITION = {
  serving: 'Serving Size: 10g | Servings per pack: 100',
  rows: [
    ['Energy', '900 kcal', '90 kcal'],
    ['Total Fat', '100 g', '10 g'],
    ['Saturated Fat', '15 g', '1.5 g'],
    ['Trans Fat', '2 g', '0.2 g'],
    ['MUFA', '28 g', '2.8 g'],
    ['PUFA', '55 g', '5.5 g'],
    ['Omega-3', '1 g', '5.1 g'],
    ['Omega-6', '55 g', '5.5 g'],
    ['Cholesterol', '0 mg', '0 mg'],
  ],
}

export const COMPLIANCE = [
  { kind: 'check', text: 'Free from Argemone oil' },
  { kind: 'check', text: 'Contains permitted antifoaming agent (DMPS, INS 900a) and antioxidant (TBHQ, INS 319)' },
  { kind: 'fssai', text: 'FSSAI Lic. No. 11424999000132' },
  { kind: 'building', text: 'Marketed by Madhuri Refiners Pvt. Ltd. Indore (M.P.)' },
  { kind: 'mail', text: 'contact@madhurioils.com' },
  { kind: 'phone', text: '72248 70701' },
]

/* Recipe thumbnails reuse the food photography already in /public/tips and
 * /public/trust. The reference page shows four dishes; these are the closest
 * real images on disk, so nothing here points at a file that does not exist. */
export const RECIPES = [
  { title: 'Crispy Pakoras', image: '/tips/monsoon-crispy.webp' },
  { title: 'Veg Stir Fry', image: '/trust/t3.webp' },
  { title: 'Hakka Noodles', image: '/tips/healthier-cooking.webp' },
  { title: 'Moong Dal Tadka', image: '/trust/t1.webp' },
]

export const DISCLAIMER =
  'Any information given on this page does not claim any diagnosis, treatment, cure, or prevention of any disease.'
