import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Leaf, Droplet, ShieldCheck, Sprout, FlaskConical } from 'lucide-react'

/*
 * TRUST — "Trust in every drop."
 *
 * A full-bleed art plate with everything set in a 900px column down the middle.
 * That column is not a style choice: the background photograph already has
 * leaves in the top-left, a bottle on the right and a bowl bottom-right, so the
 * centre is the only part of the frame that is actually empty. Content that
 * escapes the column lands on top of the bottle.
 *
 * Readability is ONE soft cream radial, no dark overlay — the art is airy and a
 * scrim would flatten it. The gradient is stronger on phones, where the crop
 * puts more of the artwork behind the text (see --trust-veil).
 *
 * Motion runs once, on scroll into view, and is skipped entirely under
 * prefers-reduced-motion (the variants collapse to a static state rather than
 * animating to it, so nothing ever moves).
 */

const GREEN = '#1E3B2C'
const GOLD = '#C08A1E'

const DEFAULT_FEATURES = [
  {
    key: 'traceability',
    Icon: Sprout,
    title: '100% Traceability',
    body: 'We trace our oils from trusted farms to your kitchen.',
  },
  {
    key: 'certified',
    Icon: ShieldCheck,
    title: 'Certified Quality',
    body: 'Tested and certified to meet the highest safety and quality standards.',
  },
  {
    key: 'small-batch',
    Icon: Droplet,
    title: 'Small Batch Made',
    body: 'Made in small batches to retain natural goodness and freshness.',
  },
  {
    key: 'purity',
    Icon: Leaf,
    title: 'Purity You Can See',
    body: 'No additives. No compromises. Just pure, healthy oil.',
  },
]

/*
 * Three of the four marks are real artwork, split out of the combined
 * certification strip that shipped with the old section (public/rooted/
 * certs.webp) and re-cut with their card background knocked out so they sit on
 * the glass bar rather than on a beige rectangle of their own.
 *
 * The fourth has no logo — there is no "lab tested" mark in the repo — so it
 * renders an outlined flask instead of inventing a badge. `logo: null` is the
 * signal for that, not an oversight.
 */
const DEFAULT_BADGES = [
  { key: 'fssai', logo: '/trust/badges/fssai.webp', line1: 'FSSAI', line2: 'Approved' },
  { key: 'iso', logo: '/trust/badges/iso22000.webp', line1: 'ISO 22000', line2: 'Certified' },
  { key: 'gmp', logo: '/trust/badges/gmp.webp', line1: 'GMP', line2: 'Certified' },
  { key: 'lab', logo: null, Icon: FlaskConical, line1: 'Lab Tested', line2: 'For Purity' },
]

const EASE = [0.22, 1, 0.36, 1]

export default function TrustSection({
  bgImage = '/trust/trust-bg.webp',
  bgImageMobile = '/trust/trust-bg-mobile.webp',
  features = DEFAULT_FEATURES,
  badges = DEFAULT_BADGES,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  // once:true — the section animates the first time it is reached and then
  // stays put; re-running on every scroll-by is distracting on a long page.
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const show = reduced || inView

  /* Header children stagger 80ms; the feature columns pick up after the header
     has finished (4 header items x 80ms + the 0.5s item duration), and the
     certification bar lands last. Delays are expressed as functions of the
     index so the sequence stays right if items are added. */
  const rise = (delay) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay },
  })

  const HEADER_STEP = 0.08
  const FEATURES_AT = 5 * HEADER_STEP + 0.2

  return (
    <section id="rooted" ref={ref} className="trust-scene">
      {/* object-cover on a <picture>, not a CSS background, so the phone crop
          can be swapped with a media query and the browser only fetches one. */}
      <picture>
        <source media="(max-width: 639px)" srcSet={bgImageMobile} />
        <img className="trust-bg" src={bgImage} alt="" aria-hidden="true" />
      </picture>

      {/* The single readability layer. Cream, never dark. */}
      <div className="trust-veil" aria-hidden="true" />

      <div className="trust-inner">
        <header className="trust-head">
          <motion.div {...rise(0)}>
            <Leaf size={32} strokeWidth={1.5} color={GOLD} aria-hidden="true" />
          </motion.div>

          <motion.p className="trust-eyebrow" {...rise(HEADER_STEP)}>
            <span className="trust-rule" aria-hidden="true" />
            Rooted in trust
            <span className="trust-rule" aria-hidden="true" />
          </motion.p>

          <motion.h2 className="trust-title" {...rise(HEADER_STEP * 2)}>
            Trust in <em>every drop.</em>
          </motion.h2>

          <motion.div className="trust-divider" {...rise(HEADER_STEP * 3)} aria-hidden="true">
            <span className="trust-rule trust-rule--wide" />
            <Droplet size={18} strokeWidth={1.5} color={GOLD} />
            <span className="trust-rule trust-rule--wide" />
          </motion.div>

          <motion.p className="trust-sub" {...rise(HEADER_STEP * 4)}>
            Purity. Quality. Care. In every step.
          </motion.p>
        </header>

        <ul className="trust-grid">
          {features.map(({ key, Icon, title, body }, i) => (
            <motion.li
              key={key}
              className="trust-cell"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={
                reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: FEATURES_AT + i * 0.1 }
              }
            >
              <motion.span
                className="trust-badge"
                initial={reduced ? false : { scale: 0.92 }}
                animate={show ? { scale: 1 } : undefined}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.5, ease: EASE, delay: FEATURES_AT + i * 0.1 }
                }
              >
                <Icon size={34} strokeWidth={1.5} color={GREEN} aria-hidden="true" />
              </motion.span>

              <h3 className="trust-cell-title">{title}</h3>
              <span className="trust-dot" aria-hidden="true" />
              <p className="trust-cell-body">{body}</p>
            </motion.li>
          ))}
        </ul>

        <motion.ul
          className="trust-certs"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE, delay: FEATURES_AT + features.length * 0.1 }
          }
        >
          {badges.map(({ key, logo, Icon, line1, line2 }) => (
            <li key={key}>
              {logo ? (
                <img src={logo} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              ) : (
                /* No artwork for this mark, so an outlined icon stands in at
                   the same optical size rather than a fabricated badge. */
                <span className="trust-cert-icon">
                  <Icon size={30} strokeWidth={1.5} color={GREEN} aria-hidden="true" />
                </span>
              )}
              <p>
                {line1}
                <br />
                {line2}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
