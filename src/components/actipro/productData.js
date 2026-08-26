// Every claim below is read off the actual pack artwork in /public/product.
//
// All four are transparent-background WebP bottle shots (see the note in
// Hero.jsx / .hero-bottle in index.css). They replaced the old flat pouch
// JPEGs, which carried a baked-in white studio background — that white
// rectangle was visible as a box around the pack anywhere the card sat on a
// dark ground, and it made the 3D treatment impossible.
//
// The range is now uniformly "Madhuri Actipro": the artwork carries the Madhuri
// roundel above the Actipro wordmark on every bottle, so the old Actipro /
// Madhuri brand split no longer matches what is printed on the pack.
export const PRODUCTS = [
  {
    id: 'actipro-sunflower',
    brand: 'Madhuri Actipro',
    name: 'Refined Sunflower Oil',
    tagline: 'Lite hai. Right hai.',
    format: 'Bottle',
    image: '/product/actipro-sunflower.webp',
    blurb:
      'The everyday light oil — refined sunflower, rich in Vitamin E and light on the stomach.',
    points: ['Rich in Vitamin E', 'Light body, neutral taste', '100% vegetarian'],
  },
  {
    id: 'actipro-mustard',
    brand: 'Madhuri Actipro',
    name: 'Kachi Ghani Mustard Oil',
    tagline: 'Strong aroma, naturally pure',
    format: 'Bottle',
    image: '/product/actipro-mustard.webp',
    blurb:
      'Kachi ghani pressed mustard oil with the sharp pungency that pickles, sarson and fried food need.',
    points: ['Kachi ghani pressed', 'Rich in Omega 3', 'Naturally pure'],
  },
  {
    id: 'actipro-groundnut',
    brand: 'Madhuri Actipro',
    name: 'Refined Groundnut Oil',
    tagline: 'Rich taste, healthy choice',
    format: 'Bottle',
    image: '/product/actipro-groundnut.webp',
    blurb:
      'Refined groundnut oil that keeps the nutty character the grain is prized for, without the heaviness.',
    points: ['Good for heart', 'Rich in Vitamin E', 'Natural goodness'],
  },
  {
    id: 'actipro-ricebran',
    brand: 'Madhuri Actipro',
    name: 'Rice Bran Oil',
    tagline: 'Heart healthy choice',
    format: 'Bottle',
    image: '/product/actipro-ricebran.webp',
    blurb:
      'Physically refined rice bran oil with Oryzanol — the lightest everyday oil in the range.',
    points: ['With Oryzanol', 'Rich in antioxidants', 'Light & nutritious'],
  },
]
