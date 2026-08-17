import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRightIcon, DropIcon, HeartIcon, LeafIcon, ShieldIcon } from './icons'

gsap.registerPlugin(ScrollTrigger)

/*
 * WHY TRUST ACTIPRO — the four-step case for the oil, read sideways.
 *
 * Same device as the reference: a pinned stage where the row of ovals travels
 * right-to-left as you scroll down. Image ovals and copy ovals alternate, so
 * the eye lands on a photo, then a claim, then a photo again.
 *
 *   .wt-rail  is translated by -(scrollWidth - viewport) across the pin,
 *             so the last oval finishes flush with the right edge.
 *
 * The translate is a single transform write per frame — nothing re-renders.
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 * The runway length (how much scroll the pin eats) is --wt-runway in index.css.
 * Longer = the row drifts more slowly. Only prefers-reduced-motion drops the pin
 * and falls back to a native swipe strip; phones get the same scrub as desktop.
 *
 * ARC_SPIN is the TOTAL sweep (deg) each kicker ring turns across the section.
 * The tween is centred: -ARC_SPIN/2 → +ARC_SPIN/2, so the label is balanced on
 * the oval's apex at the midpoint of the travel and leans equally either side.
 * 0 pins every kicker level for the whole section.
 *
 * ── WHY IT IS CENTRED ───────────────────────────────────────────────────────
 * This used to run 0 → +ARC_SPIN, which rolled the label off the apex instead
 * of rocking it about the apex. Because the whole sweep was one-directional,
 * for most of the section the kicker sat asymmetrically on the rim: its first
 * word high near the top of the oval with a lot of empty curve above it, and
 * its last word run down the right-hand side where the pill's cap is running
 * out — which read as the line having generous clearance at the start and none
 * at the end. The distance from the type to the rim is in fact constant (the
 * arc is concentric with the cap); it is the OFF-CENTRE placement that reads
 * as uneven spacing. Splitting the sweep fixes it without changing its size.
 *
 * ── WHY THIS NUMBER IS SMALL ────────────────────────────────────────────────
 * The ceiling is set by the longest kicker, not by taste. .wt-photo is a pill
 * (border-radius:999px) on a 1:1.32 box, so its rounded cap covers only the top
 * ~38% of the height — past roughly 68deg from the top the edge runs straight
 * and anything rotated that far slides off the curve and is cut by the crop.
 *
 * 'Light everyday cooking' spans ~103deg of the arc, i.e. ~52deg either side of
 * centre. Centring the sweep means the worst case is only ARC_SPIN/2 past that
 * (~59deg) rather than the full ARC_SPIN (~66deg), so the same number now sits
 * further inside the 68deg limit than it did before.
 *
 * Raising this still means shortening the longest kicker or tightening
 * .wt-arc-text's letter-spacing — not just typing a bigger number here.
 */
const ARC_SPIN = 14

const STEPS = [
  {
    Icon: DropIcon,
    kicker: 'Light everyday cooking',
    title: 'Light on\nevery plate',
    body: 'Refined to stay light in the kadhai, so dal, sabzi and roti taste of what you cooked — not of the oil you cooked them in.',
    cta: 'See the benefits',
    href: '#products',
    image: '/trust/t1.webp',
    alt: 'A home-style thali of dal, roti, cucumber and mixed vegetable sabzi',
    tone: 'sun',
  },
  {
    Icon: LeafIcon,
    kicker: 'Versatile by nature',
    title: 'One oil for\nthe whole menu',
    body: 'Deep fry, shallow fry, tempering or a quick stir-fry — a high smoke point means one bottle covers the day instead of three.',
    cta: 'Why it works',
    href: '#nutrition',
    image: '/trust/t3.webp',
    alt: 'Golden oil being poured into a wok of stir-fried vegetables',
    tone: 'green',
  },
  {
    Icon: HeartIcon,
    kicker: 'Trusted by families',
    title: 'Made for\nIndian homes',
    body: 'Fortified with Vitamin A and D, 100% vegetarian, and light enough for everyday meals — the reason it stays on the shelf.',
    cta: 'Know our promise',
    href: '#mission',
    image: '/trust/t2.webp',
    alt: 'A mother and daughter cooking together, pouring Actipro oil into a wok',
    tone: 'red',
  },
  {
    Icon: ShieldIcon,
    kicker: 'Pure and reliable',
    title: 'Refined in\nour own plants',
    body: 'Crushed and refined at our three FSSAI-licensed refineries, with every batch logged against an in-house lab report before it ships.',
    cta: 'How we make it',
    href: '#process',
    image: '/trust/t4.webp',
    alt: 'A bottle of Actipro refined sunflower oil beside a sunflower and a bowl of oil',
    tone: 'sun',
  },
]

export default function WhyTrust() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const railRef = useRef(null)

  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(motion.matches)
    apply()
    motion.addEventListener('change', apply)
    return () => motion.removeEventListener('change', apply)
  }, [])

  /*
   * Only reduced motion falls back to the swipe strip now. The pinned scrub used
   * to be gated to >=1024px as well, but the horizontal travel is the whole
   * point of the section, and on a phone a native scroller made it a row the
   * viewer had to discover by swiping — most never did. Sticky + a transform on
   * the rail costs a phone no more than it costs a laptop.
   */
  const swipe = reduced

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const rail = railRef.current
    if (!section || !stage || !rail || swipe) return undefined

    // Measured in a callback so it re-reads on refresh (fonts, resize) rather
    // than being baked in at build time — otherwise the row stops short.
    const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth)

    /*
     * The section has to be tall enough to scroll through the whole travel
     * while the sticky stage holds — one viewport of stage plus the runway.
     * Written as a custom property (see .wt-scene) and refreshed on resize,
     * so the runway always matches what the rail actually has to cover.
     */
    const sizeRunway = () => {
      section.style.setProperty('--wt-runway', `${distance()}px`)
    }
    sizeRunway()

    const ro = new ResizeObserver(() => {
      sizeRunway()
      ScrollTrigger.refresh()
    })
    ro.observe(rail)

    const ctx = gsap.context(() => {

      /*
       * No GSAP pin. The stage holds itself still with `position: sticky`
       * (see .wt-stage), and ScrollTrigger only scrubs the rail inside it.
       *
       * A GSAP pin was the original approach and it is what made the section go
       * blank: pinning switches the stage to position:fixed AND writes its own
       * translate to keep that fixed box aligned with the scroller. Lenis eases
       * the scroll underneath, so the two disagree — measured mid-scrub, the
       * stage was fixed *and* pushed 1804px down, i.e. off-screen, leaving flat
       * cream. Sticky is browser-native, needs no spacer, and cannot desync
       * from a smooth scroller because the browser positions it itself.
       */
      const trigger = {
        trigger: section,
        // The stage sticks at the top, so the travel begins when the section's
        // top reaches the top of the viewport and ends one runway later.
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      }

      gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: trigger })

      /*
       * The kicker rings turn as the row travels, so the label reads as riding
       * the curve rather than being a bent piece of type.
       *
       * The sweep is centred on the apex (-ARC_SPIN/2 → +ARC_SPIN/2) rather
       * than starting there. An oval is near the middle of the viewport — where
       * it is actually read — around the middle of the travel, which is exactly
       * where a centred sweep puts the kicker balanced on top of the oval. The
       * old one-directional version had it already rolled off to the right by
       * then, sitting visibly closer to the rim at its tail than at its head.
       *
       * One tween over all four rings: they share the scrub, so they stay in
       * step with the travel instead of each running its own trigger.
       */
      gsap.fromTo(
        section.querySelectorAll('.wt-arc'),
        { rotate: -ARC_SPIN / 2 },
        { rotate: ARC_SPIN / 2, ease: 'none', scrollTrigger: trigger },
      )
    }, section)

    return () => {
      ro.disconnect()
      ctx.revert()
      // The swipe fallback lays out at natural height; a stale runway would
      // leave a viewport of empty cream under it.
      section.style.removeProperty('--wt-runway')
    }
  }, [swipe])

  return (
    <section id="trust" ref={sectionRef} className="wt-scene" aria-labelledby="wt-heading">
      <div ref={stageRef} className="wt-stage">
        <header className="wt-head">
          <p className="wt-eyebrow">Why Actipro</p>
          <h2 id="wt-heading" className="wt-heading">
            Made for real kitchens
          </h2>
        </header>

        {/* data-lenis-prevent: the swipe strip is its own scroller, and without
            this Lenis swallows the horizontal gesture and scrolls the page. */}
        <div
          className={`wt-viewport ${swipe ? 'wt-viewport--swipe' : ''}`}
          {...(swipe ? { 'data-lenis-prevent': '' } : {})}
        >
          <ul ref={railRef} className="wt-rail">
            {STEPS.map(({ Icon, kicker, title, body, cta, href, image, alt, tone }, i) => (
              <li key={kicker} className="wt-pair">
                {/* Photo oval — the kicker rides its curved edge, as in the reference.
                    A real textPath, so the letters follow the oval instead of
                    sitting on a flat line; the whole ring is then rotated by
                    --wt-spin, which the scroll writes (see the effect above). */}
                <figure className="wt-photo">
                  {/* NOT lazy. Ovals 3 and 4 sit far to the right of the viewport,
                      so a lazy image never enters the loading viewport at all —
                      and the pin slides them in via transform, which does not
                      re-trigger the check. They would stay blank on cream. */}
                  <img src={image} alt={alt} decoding="async" fetchPriority="low" />
                  <svg className="wt-arc" viewBox="0 0 100 132" aria-hidden="true">
                    <defs>
                      {/* The arc has to match the oval's actual rim, or the
                          letters drift off the shape at both ends.

                          .wt-photo is a pill: border-radius:999px on a 100x132
                          box clamps to half the SHORTER side, so its top cap is
                          a true semicircle of r=50 centred at (50,50) — not an
                          ellipse. Inset 6 units gives r=44 about the same
                          centre: apex (50,6), ends (6,50) and (94,50).

                          The previous 39x54 ellipse from y=60 sat 41 units below
                          the real rim at x=11, which is what splayed the ends. */}
                      <path
                        id={`wt-arc-${i}`}
                        d="M 6,50 A 44,44 0 0 1 94,50"
                        fill="none"
                      />
                    </defs>
                    <text className="wt-arc-text">
                      <textPath href={`#wt-arc-${i}`} startOffset="50%" textAnchor="middle">
                        {kicker}
                      </textPath>
                    </text>
                  </svg>
                </figure>

                {/* Copy oval */}
                <article className={`wt-card wt-card--${tone}`}>
                  <span className="wt-step" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="wt-icon" aria-hidden="true">
                    <Icon className="h-8 w-8" />
                  </span>
                  <h3 className="wt-title">
                    {title.split('\n').map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <span className="wt-rule" aria-hidden="true" />
                  <p className="wt-body">{body}</p>
                  <a className="wt-cta" href={href}>
                    {cta}
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="wt-foot">
          <span aria-hidden="true">❧</span>
          Actipro cooking oil — made for real kitchens.
          <span aria-hidden="true">❧</span>
        </p>
      </div>
    </section>
  )
}
