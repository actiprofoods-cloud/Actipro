import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Leaf, ShieldCheck, Sprout } from 'lucide-react'

/*
 * WHY ACTIPRO — "More than just oil. It's everyday good."
 *
 * A carousel over a fixed art plate. One step is expanded into a card on the
 * left; the rest sit beside it as circular thumbnails. Clicking a thumbnail,
 * a dot or an arrow promotes that step.
 *
 * ── WHY THE ART DICTATES THE LAYOUT ────────────────────────────────────────
 * public/why/why-bg.webp already contains the bottle on a plinth at the RIGHT
 * and a leaf spray top-left, and it carries its own "PURER OIL · HEALTHIER
 * MEALS · HAPPIER YOU" ribbon along the bottom. So:
 *   - content stops well short of the right edge (--why-gutter-right), or it
 *     collides with the bottle;
 *   - nothing is drawn along the foot, because the plate already has a line
 *     there and a second one reads as a mistake.
 *
 * ── ROTATION ───────────────────────────────────────────────────────────────
 * Auto-advances on a timer, pauses on hover/focus, and stops permanently once
 * the visitor picks a step themselves — an interface that keeps moving after
 * you have taken hold of it is the usual carousel complaint. Reduced motion
 * never starts the timer at all.
 */

const AUTO_MS = 5200

const STEPS = [
  {
    key: 'light',
    Icon: Leaf,
    title: 'Light on\nevery plate',
    body: 'Refined to stay light in the kadhai, so dal, sabzi and roti taste of what you cooked — not the oil.',
    cta: 'Know more',
    href: '#nutrition',
    image: '/trust/t1.webp',
    alt: 'A home-style thali of dal, roti, cucumber and mixed vegetable sabzi',
  },
  {
    key: 'versatile',
    Icon: Sprout,
    title: 'Versatile\nby nature',
    body: 'Deep fry, shallow fry, tempering or a quick stir-fry — a high smoke point means one bottle covers the day.',
    cta: 'Why it works',
    href: '#nutrition',
    image: '/trust/t3.webp',
    alt: 'Golden oil being poured into a wok of stir-fried vegetables',
  },
  {
    key: 'trust',
    Icon: Heart,
    title: 'Goodness you\ncan trust',
    body: 'Fortified with Vitamin A and D, 100% vegetarian, and light enough for the meals you cook every day.',
    cta: 'Our promise',
    href: '#rooted',
    image: '/trust/t2.webp',
    alt: 'A mother and daughter cooking together, pouring Actipro oil into a wok',
  },
  {
    key: 'promise',
    Icon: ShieldCheck,
    title: 'A promise\nforward',
    body: 'Crushed and refined at our own FSSAI-licensed plants, every batch logged against a lab report before it ships.',
    cta: 'How we make it',
    href: '#purpose',
    image: '/trust/t4.webp',
    alt: 'A bottle of Actipro refined sunflower oil beside a sunflower and a bowl of oil',
  },
]

const EASE = [0.22, 1, 0.36, 1]

export default function WhyActipro({
  bgImage = '/why/why-bg.webp',
  bgImageMobile = '/why/why-bg-mobile.webp',
  steps = STEPS,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const show = reduced || inView

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  // Set once the visitor picks a step; the timer never restarts after that.
  const [taken, setTaken] = useState(false)

  const go = useCallback(
    (i) => {
      setActive((i + steps.length) % steps.length)
      setTaken(true)
    },
    [steps.length],
  )

  useEffect(() => {
    if (reduced || paused || taken || !show) return undefined
    const id = window.setInterval(() => setActive((i) => (i + 1) % steps.length), AUTO_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused, taken, show, steps.length])

  const rise = (delay) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay },
  })

  const current = steps[active]
  const others = steps.map((s, i) => ({ ...s, i })).filter((s) => s.i !== active)

  return (
    <section
      id="trust"
      ref={ref}
      className="why-scene"
      aria-labelledby="why-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <picture>
        <source media="(max-width: 639px)" srcSet={bgImageMobile} />
        <img className="why-bg" src={bgImage} alt="" aria-hidden="true" />
      </picture>
      <div className="why-veil" aria-hidden="true" />

      <div className="why-inner">
        <header className="why-head">
          <motion.p className="why-eyebrow" {...rise(0)}>
            <span className="why-rule" aria-hidden="true" />
            <Leaf size={18} strokeWidth={1.5} aria-hidden="true" />
            Why Actipro
            <span className="why-rule" aria-hidden="true" />
          </motion.p>

          <motion.h2 id="why-heading" className="why-title" {...rise(0.08)}>
            More than just oil.
            <br />
            It’s <em>everyday good.</em>
          </motion.h2>

          <motion.p className="why-sub" {...rise(0.16)}>
            Thoughtfully crafted to bring out the best in your food — and support a healthier you,
            every day.
          </motion.p>
        </header>

        <motion.div className="why-stage" {...rise(0.26)}>
          <button
            type="button"
            className="why-arrow"
            onClick={() => go(active - 1)}
            aria-label="Previous"
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>

          {/* The expanded step. `key` on the inner pieces so React swaps them
              and the fade re-runs on every change. */}
          <article className="why-card">
            <div className="why-card-photo">
              <img key={current.image} src={current.image} alt={current.alt} loading="lazy"
                   style={{ '--i': 0 }} />
            </div>

            {/* Every piece is keyed on the step, so React REPLACES the node on
                a change and the CSS animation re-runs. The index and the CTA
                used to be unkeyed: they were the same elements throughout, so
                nothing re-triggered and they snapped while their neighbours
                faded - which is what made the whole swap read as instant.

                --i staggers each line a beat after the one above it, so the
                card resolves top-to-bottom rather than four things blinking
                at once. */}
            <div className="why-card-copy">
              <p key={`${current.key}-i`} className="why-index" style={{ '--i': 0 }}>
                {String(active + 1).padStart(2, '0')}
                <span className="why-index-rule" aria-hidden="true" />
              </p>
              <h3 key={`${current.key}-t`} className="why-card-title" style={{ '--i': 1 }}>
                {current.title.split('\n').map((line, i) => (
                  <span key={line} className={i ? 'why-line' : undefined}>
                    {line}
                  </span>
                ))}
              </h3>
              <p key={`${current.key}-b`} className="why-card-body" style={{ '--i': 2 }}>
                {current.body}
              </p>
              <a key={`${current.key}-c`} className="why-cta" href={current.href} style={{ '--i': 3 }}>
                {current.cta}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </article>

          {/* The remaining steps, as thumbnails. Order is preserved (they are
              filtered, not reordered), so the row does not shuffle. */}
          <ul className="why-thumbs">
            {others.map((s) => (
              <li key={s.key}>
                <button type="button" onClick={() => go(s.i)} aria-label={`Show: ${s.title.replace('\n', ' ')}`}>
                  <span className="why-thumb-icon" aria-hidden="true">
                    <s.Icon size={19} strokeWidth={1.5} />
                  </span>
                  <span className="why-thumb-photo">
                    <img src={s.image} alt="" aria-hidden="true" loading="lazy" />
                  </span>
                  <span className="why-thumb-index">{String(s.i + 1).padStart(2, '0')}</span>
                  <span className="why-thumb-title">{s.title.replace('\n', ' ')}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="why-arrow"
            onClick={() => go(active + 1)}
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </motion.div>

        <motion.ul className="why-dots" {...rise(0.34)}>
          {steps.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                data-on={i === active}
                onClick={() => go(i)}
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === active}
              />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
