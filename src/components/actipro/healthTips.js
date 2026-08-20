/*
 * HEALTHY TIPS — the content behind /healthy-tips.
 *
 * Kept as data rather than markup so the page is edited here, in one list,
 * without touching layout: HealthyTips.jsx renders whatever this file holds.
 *
 * ---------------------------------------------------------------------------
 * ON THE IMAGES
 * ---------------------------------------------------------------------------
 * Each tip carries an `image` — one of the supplied Actipro campaign creatives
 * in public/tips/. They are the brand's own artwork, so unlike a stock video
 * they need no clearance and load from this domain.
 *
 * The masters are the PNGs the creatives were delivered as (~1 MB each, kept
 * alongside). What the page actually serves is the WebP beside them, at about
 * a tenth of the size — five PNGs would have put 5 MB on one page. Re-run this
 * after dropping in a new creative:
 *
 *   python - <<'EOF'
 *   from PIL import Image
 *   im = Image.open("public/tips/<new>.png").convert("RGB")
 *   im.save("public/tips/<slug>.webp", "WEBP", quality=86, method=6)
 *   EOF
 *
 * Every creative is PORTRAIT, about 4:5 — they were drawn for a social feed,
 * not a widescreen frame. .ht-frame is set to that ratio, so replacing one
 * with a landscape image would letterbox it. Crop to 4:5 first, or change the
 * aspect-ratio in the .ht-frame rule.
 *
 * The `alt` on each is what a reader using a screen reader gets in place of
 * the artwork, so it describes the creative — it is not a second copy of the
 * heading, which is already on the page next to it.
 * ---------------------------------------------------------------------------
 *
 * The copy is written to the creative it sits beside: the chess creative
 * carries the "one better choice" tip, the monsoon creative carries the frying
 * tip, and so on. Re-ordering this list re-orders the page, but moving a tip
 * away from its image will read as a mismatch.
 */

export const HEALTH_TIPS = [
  {
    id: 'healthier-cooking',
    eyebrow: 'The one change',
    title: 'One better move beats a whole new diet',
    body:
      'Nobody overhauls how they eat overnight, and the attempts that start that way rarely last the month. What does last is a single swap held for good — the oil the whole kitchen runs on. It touches every dish you cook, every day, without asking anyone at the table to eat differently.',
    image: {
      src: '/tips/healthier-cooking.webp',
      alt: 'A hand lifting a bottle of Madhuri Actipro sunflower oil above a chessboard.',
    },
  },
  {
    id: 'lightness',
    eyebrow: 'Portions',
    title: 'Pour with a spoon, not from the bottle',
    body:
      'A free pour into a hot kadhai is usually two to three times what the dish needs, and it is the reason a meal sits heavy afterwards. Most Indian cooking is comfortable at three to four teaspoons per person per day across all meals. Measuring is the single change that moves that number most, and it costs nothing but the second it takes.',
    image: {
      src: '/tips/lightness.webp',
      alt: 'A woman in a bright kitchen eating a bowl of vegetable poha, with a bottle of Actipro on the counter.',
    },
  },
  {
    id: 'monsoon-crispy',
    eyebrow: 'Frying',
    title: 'Crisp comes from hot oil, not from more oil',
    body:
      'Pakoras that come out greasy were fried too cool, not with too little oil — cool oil soaks into the batter instead of sealing it. Get the oil properly hot before the first batch, fry in small lots so the temperature does not crash, and drain on a rack rather than on paper. Actipro holds up to about 232°C, so it takes the heat this needs.',
    image: {
      src: '/tips/monsoon-crispy.webp',
      alt: 'Sabudana vada and samosas with chutneys and tea on a wooden table by a rain-streaked window.',
    },
  },
  {
    id: 'taste-like-home',
    eyebrow: 'Everyday cooking',
    title: 'A neutral oil lets the food taste of itself',
    body:
      'Home cooking is built on masala, and a strongly flavoured oil competes with it. A clean refined oil carries heat and spice without adding a note of its own, so the paneer tastes of the paneer and the tempering tastes of the tempering. That is the case for keeping a neutral oil as the everyday one and saving the characterful ones for dishes built around them.',
    image: {
      src: '/tips/taste-like-home.webp',
      alt: 'Paneer curry in a kadhai with spices and herbs falling into it, beside a bottle of Actipro.',
    },
  },
  {
    id: 'richness-of-purity',
    eyebrow: 'Buying and storing',
    title: 'Read the back of the pack, and keep it out of the light',
    body:
      'The front of a pack is advertising; the back is information — the FSSAI licence, the batch code, the packed-on date and the nutrition panel. Every Actipro pack carries all four. Once it is home, light and heat are what turn good oil rancid, so store it capped in a cool dark cupboard rather than on the shelf above the stove, and never top up an old can with fresh oil.',
    image: {
      src: '/tips/richness-of-purity.webp',
      alt: 'Butter paneer masala in a bowl held in two hands, with naan and a bottle of Actipro on a banana leaf.',
    },
  },
]

/* The short list that runs above the tips — quick reads, no artwork. Kept
   separate from HEALTH_TIPS because the layout is different: these are a
   compact grid of one-liners, not cards with images. */
export const QUICK_TIPS = [
  {
    stat: '3–4 tsp',
    label: 'Oil per person, per day',
    note: 'Across all meals, not per dish.',
  },
  {
    stat: '232°C',
    label: 'Actipro smoke point',
    note: 'High enough for deep frying.',
  },
  {
    stat: '2×',
    label: 'Maximum reuse',
    note: 'Strain when cool; never a third time.',
  },
  {
    stat: '0 g',
    label: 'Trans fat, as packed',
    note: 'Kept there by how it is refined.',
  },
]
