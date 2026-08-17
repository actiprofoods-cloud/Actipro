import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  TargetIcon,
  EyeIcon,
  DropIcon,
  DropFilledIcon,
  LeafIcon,
  ShieldIcon,
  HeartIcon,
} from './icons'

gsap.registerPlugin(ScrollTrigger)

/*
 * MISSION & VISION — the two-card "our purpose" block.
 *
 * Each card is a cream copy panel and a photo, divided by a single sweeping
 * arc rather than a straight edge. The arc is one inline SVG per card:
 *
 *   .mv-figure   is clipped by that same curve (clipPath, objectBoundingBox)
 *   .mv-stroke   traces it in the card's accent colour
 *   .mv-dot      a drop that rides down that curve as the page scrolls
 *   .mv-badge    one icon per stop, each anchored ON the curve
 *   .mv-stop     one line of copy per stop, stacked and crossfaded
 *
 * The drop's position is read from the real path with getPointAtLength(), so it
 * follows the curve exactly rather than approximating it with a straight
 * translate. Both coordinates are written as custom properties (--mv-dot-x/y)
 * on the card, so a 60fps scrub costs zero React renders.
 *
 * As the drop reaches each badge, that badge's data-lit flips to "true" (the
 * icon fills with the card's accent) and the card's copy crossfades to that
 * stop's line. Once the LAST badge is reached the photo grows out of its clip to
 * fill the card and the copy fades away over it — see --mv-reveal below.
 *
 * The photo is public/bg/MISSION.png, which arrived as one two-panel image —
 * a pour on the left, a bottle in a field on the right. It is split at the
 * gutter into bg/mission.webp and bg/vision.webp (see the note in index.css),
 * so each card gets its own panel instead of both showing the same picture.
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 * stops[].at where along the curve (0-1) a stop's badge sits, 0 being the top of
 *            the card. Badge positions are MEASURED from the path at mount, so
 *            editing this number is all that is needed — nothing in index.css
 *            has to be kept in step with it.
 * ARRIVE_AT  the fraction of the section's scroll by which the drop reaches the
 *            final stop. The reveal begins at exactly this point (REVEAL_FROM),
 *            so the landing and the image opening are one moment by
 *            construction rather than two constants that can drift apart.
 */
/*
 * The drop now runs to the LAST stop rather than to a single badge, so the end
 * of its journey is the last entry in a card's `stops` array. ARRIVE_AT is the
 * fraction of the section's scroll by which it gets there; the remainder is
 * spent on the reveal (see REVEAL_FROM), which is what gives the image room to
 * open smoothly instead of snapping the moment the drop lands.
 */
const ARRIVE_AT = 0.72

/*
 * Once the drop reaches the final stop the photo grows to fill the whole card
 * and the copy fades out over it. Starting the reveal exactly at ARRIVE_AT ties
 * the two together by construction — the same mistake the original code called
 * out for the badge fill, where two independent constants drifted apart.
 */
const REVEAL_FROM = ARRIVE_AT

// One source of truth for the sweep. The clipPath in the markup below is the
// same curve at 0-1 scale — edit both together or the photo and stroke drift.
const CURVE = 'M4 0 C 4 8, 44 14, 50 32 C 55 50, 47 66, 46 82 C 45 92, 50 97, 58 100'

/*
 * The reveal clip, as a function of progress.
 *
 * Every x coordinate of the resting curve is lerped toward 0 (the card's left
 * edge) as t goes 0 -> 1, so the shape keeps its bends the whole way and ends up
 * flat against the left edge — i.e. the photo is full-bleed but the boundary was
 * a curve at every intermediate frame. y coordinates never move: the curve
 * slides sideways, it does not deform.
 *
 * Coordinates are the objectBoundingBox (0-1) form of CURVE above.
 */
const CLIP_XS = [0.04, 0.04, 0.44, 0.5, 0.55, 0.47, 0.46, 0.45, 0.5, 0.58]
const CLIP_AT = (t) => {
  const [a, b, c, d, e, f, g, h, i, j] = CLIP_XS.map((x) => (x * (1 - t)).toFixed(4))
  return (
    `M${a} 0 C ${b} 0.08, ${c} 0.14, ${d} 0.32 ` +
    `C ${e} 0.50, ${f} 0.66, ${g} 0.82 ` +
    `C ${h} 0.92, ${i} 0.97, ${j} 1 L 1 1 L 1 0 Z`
  )
}
/*
 * Each card is now a three-stop run rather than a single landing.
 *
 * STOPS are ordered top-to-bottom down the curve. `at` is the fraction along the
 * curve (0 = top of the card) where that stop's badge sits, and the drop pauses
 * at each one in turn: reaching a stop lights its badge AND swaps the card's
 * body copy to that stop's text.
 *
 * The copy is drawn from claims already on the site (see Milestones.jsx and
 * Faq.jsx) rather than newly invented, so the section does not start making
 * promises the rest of the page does not back up.
 */
const CARDS = [
  {
    key: 'mission',
    kicker: 'Our',
    title: 'Mission',
    image: '/bg/mission.webp',
    alt: 'Actipro oil being poured over a bowl of vegetables',
    Motif: LeafIcon,
    tone: 'red',
    stops: [
      {
        at: 0.3,
        Icon: TargetIcon,
        body: 'To bring pure, healthy and honest cooking oils to every Indian kitchen.',
      },
      {
        at: 0.5,
        Icon: DropIcon,
        body: 'Refined six times over, so nothing but the good stuff reaches your kadhai.',
      },
      {
        at: 0.68,
        Icon: LeafIcon,
        body: 'Fortified with Vitamin A and D, and 100% vegetarian across the range.',
      },
    ],
  },
  {
    key: 'vision',
    kicker: 'Our',
    title: 'Vision',
    image: '/bg/vision.webp',
    alt: 'A bottle of Actipro refined soyabean oil in a field at sunrise',
    Motif: DropIcon,
    tone: 'sun',
    stops: [
      {
        at: 0.3,
        Icon: EyeIcon,
        body: 'To be India’s most trusted edible oil brand, known for quality, purity and care.',
      },
      {
        at: 0.5,
        Icon: ShieldIcon,
        body: 'Crushed and refined on our own lines at Dhannad, Mandsaur and Shinde Gaon.',
      },
      {
        at: 0.68,
        Icon: HeartIcon,
        body: 'Three plants, three FSSAI licences, and no third-party packing.',
      },
    ],
  },
]

// Keyed lookup so paint() can reach a card's stops from its dataset alone,
// without closing over the render's props.
const STOPS_BY_KEY = Object.fromEntries(CARDS.map((c) => [c.key, c.stops]))

export default function MissionVision() {
  const sectionRef = useRef(null)
  const pathsRef = useRef({})
  const openPathRef = useRef(null)

  /*
   * The section pins while the drop travels, so the cards hold still and the
   * viewer actually watches the icon fill instead of it completing out in the
   * periphery. Only from 1024px up: below that the two cards stack and the pair
   * is taller than the viewport, so there is nothing to hold them in.
   */
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setPinned(wide.matches && !reduce.matches)
    apply()
    wide.addEventListener('change', apply)
    reduce.addEventListener('change', apply)
    return () => {
      wide.removeEventListener('change', apply)
      reduce.removeEventListener('change', apply)
    }
  }, [])

  const registerPath = (key, el) => {
    if (el) pathsRef.current[key] = el
    else delete pathsRef.current[key]
  }

  /*
   * Put every badge on the curve.
   *
   * Each badge's data-at is its fraction along the path; its left/top are read
   * from getPointAtLength on that same path, which is the only way to guarantee
   * the drop passes exactly through it. The original code hard-coded one badge's
   * position in CSS and left a comment warning that changing BADGE_AT meant
   * re-measuring by hand — with three stops per card that is three chances to
   * drift, so it is measured instead.
   *
   * Re-run on resize: the SVG is stretched with preserveAspectRatio="none", so
   * the on-screen position of a path point moves when the card's aspect changes.
   */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const place = () => {
      section.querySelectorAll('.mv-card').forEach((card) => {
        const path = pathsRef.current[card.dataset.key]
        if (!path || !path.getTotalLength) return
        const len = path.getTotalLength()
        if (!len) return
        card.querySelectorAll('.mv-badge').forEach((badge) => {
          const at = Number(badge.dataset.at)
          if (!Number.isFinite(at)) return
          const pt = path.getPointAtLength(len * at)
          badge.style.left = `${pt.x}%`
          badge.style.top = `${pt.y}%`
        })
      })
    }

    place()
    const ro = new ResizeObserver(place)
    section.querySelectorAll('.mv-card').forEach((c) => ro.observe(c))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const cards = Array.from(section.querySelectorAll('.mv-card'))
    if (!cards.length) return undefined

    /*
     * Paint one card's dot at progress p (0-1 along the curve).
     *
     * getPointAtLength works in the path's own viewBox units (0-100 here), and
     * the SVG is stretched with preserveAspectRatio="none" — so x and y have to
     * be written as percentages of the card and cannot share one scale factor.
     */
    const paint = (card, p) => {
      const path = pathsRef.current[card.dataset.key]
      if (!path || !path.getTotalLength) return
      const len = path.getTotalLength()
      if (!len) return

      /*
       * The run is compressed into the first ARRIVE_AT of the scroll so the drop
       * lands well inside the viewport rather than at the very end of the
       * section, where it was easy to scroll straight past.
       */
      const run = Math.min(1, Math.max(0, p) / ARRIVE_AT)

      // Where the drop has got to along the curve. The journey ends at the LAST
      // stop, so that stop's `at` is the full extent of the travel.
      const stops = STOPS_BY_KEY[card.dataset.key] || []
      const lastAt = stops.length ? stops[stops.length - 1].at : 0
      const travel = run * lastAt
      const at = len * travel
      const point = path.getPointAtLength(at)

      /*
       * Which stops the drop has passed. Each badge lights as the drop reaches
       * it, and the card's copy switches to that stop's text — so the active
       * index is simply the last stop whose `at` is behind the drop.
       *
       * A small bias means a badge lights as the drop meets its centre rather
       * than a frame after it has already gone past.
       */
      const BIAS = 0.012
      let active = 0
      stops.forEach((s, i) => {
        if (travel >= s.at - BIAS) active = i
      })
      if (card.dataset.active !== String(active)) {
        card.dataset.active = String(active)
        // Written as a data attribute, not React state: the scrub runs at 60fps
        // and a setState here would re-render the whole section every frame.
        card.querySelectorAll('.mv-stop').forEach((el, i) => {
          el.dataset.on = i === active ? 'true' : 'false'
        })
      }
      card.querySelectorAll('.mv-badge').forEach((b, i) => {
        b.dataset.lit = travel >= stops[i].at - BIAS ? 'true' : 'false'
      })

      /*
       * The reveal. Past REVEAL_FROM the photo opens out to fill the card and the
       * copy column fades under it. Written as a 0-1 progress so the easing and
       * the actual growth both live in CSS (see .mv-card[style*='--mv-reveal']),
       * which keeps this function to one property write per frame.
       */
      const reveal = Math.min(1, Math.max(0, (p - REVEAL_FROM) / (1 - REVEAL_FROM)))
      // ease-in-out: slow to start opening, slow to settle, quick through the
      // middle — a linear grow reads as a mechanical wipe.
      const eased = reveal < 0.5 ? 2 * reveal * reveal : 1 - (1 - reveal) * (1 - reveal) * 2
      card.style.setProperty('--mv-reveal', eased.toFixed(4))

      /*
       * Slide the reveal clip's curve toward the left edge. Written straight to
       * the path's `d` because clip-path cannot read a custom property — the
       * variable above drives the opacities in CSS, this drives the shape.
       *
       * Both cards share one clipPath, so this is set once per frame rather than
       * per card; the last card in the loop wins and they are in step anyway.
       */
      if (openPathRef.current) {
        openPathRef.current.setAttribute('d', CLIP_AT(eased))
      }

      /*
       * The drop sits exactly on the curve, at every size.
       *
       * There used to be a "peel" here: on phones the single badge lived below
       * the copy rather than on the path, so the last tenth of the run lerped off
       * the curve to reach it — which is what made the drop look like it left the
       * line and travelled straight. Now every stop's badge is anchored ON the
       * curve (its left/top come from the same path point, see the render below),
       * so there is nothing to divert to and the fall follows the sweep.
       */
      card.style.setProperty('--mv-dot-x', `${point.x}%`)
      card.style.setProperty('--mv-dot-y', `${point.y}%`)

      /*
       * The drop is a teardrop, not a disc, so it has to lean along the curve or
       * it reads as a straight pin stuck on a bend. The tangent comes from a
       * short chord either side of the point.
       *
       * The SVG is stretched (preserveAspectRatio="none") and the card is far
       * taller than wide, so a raw viewBox angle would be wrong on screen: dx
       * has to be scaled by the card's aspect before taking the arctangent.
       * The glyph points DOWN at rest, hence the -90 to bring 0deg to "down".
       */
      const step = Math.max(1, len * 0.01)
      const a = path.getPointAtLength(Math.max(0, at - step))
      const b = path.getPointAtLength(Math.min(len, at + step))
      const aspect = card.offsetWidth / Math.max(1, card.offsetHeight)
      const deg = (Math.atan2(b.y - a.y, (b.x - a.x) * aspect) * 180) / Math.PI - 90
      card.style.setProperty('--mv-dot-a', `${deg.toFixed(1)}deg`)
    }

    // Reduced motion: the dot is simply already home and the badge is filled.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => paint(card, 1))
      return undefined
    }

    const ctx = gsap.context(() => {
      /*
       * ONE trigger for both cards, on the section.
       *
       * Per-card triggers were the bug behind "the colour is there before the
       * drop arrives": a card's own top-85%/bottom-60% window is spent while
       * the card is still climbing into view (measured: the run completed with
       * the card top at 23vh), so by the time you looked at it, it was over.
       *
       * Pinned, the section's own progress is the runway — the cards are
       * stationary and centred for the whole of it.
       */
      const state = { p: 0 }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        scrollTrigger: pinned
          ? {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom', // i.e. the whole of --mv-runway
              scrub: 0.8, // heavier than elsewhere: this is a slow, watched drip
              invalidateOnRefresh: true,
            }
          : {
              // Unpinned, run it while the cards are genuinely on screen
              // rather than while they are still entering.
              trigger: section,
              start: 'top 70%',
              end: 'bottom 75%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
        onUpdate: () => cards.forEach((card) => paint(card, state.p)),
      })
      cards.forEach((card) => paint(card, 0))
    }, section)

    return () => ctx.revert()
  }, [pinned])

  return (
    <section
      id="purpose"
      ref={sectionRef}
      className={`mv-scene ${pinned ? 'mv-scene--pinned' : 'py-20 sm:py-28'}`}
    >
      <div className="mv-stage">
      {/* The sweep, defined once and shared by both cards. objectBoundingBox
          units (0-1) so it scales with whatever size the card ends up. This is
          CURVE at 1/100 scale, closed into a fillable shape — keep the two in
          step if either is edited. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <clipPath id="mv-curve" clipPathUnits="objectBoundingBox">
            <path
              d="M0.04 0 C 0.04 0.08, 0.44 0.14, 0.50 0.32 C 0.55 0.50, 0.47 0.66, 0.46 0.82 C 0.45 0.92, 0.50 0.97, 0.58 1 L 1 1 L 1 0 Z"
            />
          </clipPath>

          {/* The same sweep, but its x coordinates are re-written each frame by
              the scroll effect (see openCurve) so the curve slides off the left
              edge as --mv-reveal runs 0 -> 1. Shared by both cards: they reveal
              together, so one interpolated path is enough. */}
          <clipPath id="mv-curve-open" clipPathUnits="objectBoundingBox">
            <path ref={openPathRef} d={CLIP_AT(0)} />
          </clipPath>
        </defs>
      </svg>

      <div className="acti-shell">
        <header className="text-center">
          <span className="mv-eyebrow">
            <span className="mv-rule" aria-hidden="true" />
            Our purpose
            <span className="mv-rule" aria-hidden="true" />
          </span>

          <h2 className="mt-3 font-serif text-4xl leading-[1.1] text-acti-ink sm:text-5xl lg:text-[3.5rem]">
            <span className="text-acti-red">Mission</span>{' '}
            <span className="text-acti-sun">&amp;</span> Vision
          </h2>

          <span className="mv-flourish" aria-hidden="true">
            <span className="mv-rule" />
            <LeafIcon className="h-5 w-5 text-acti-sun" />
            <span className="mv-rule" />
          </span>
        </header>

        <div className="mv-grid mt-12 grid gap-7 sm:mt-16 lg:grid-cols-2 lg:gap-8">
          {CARDS.map(({ key, kicker, title, image, alt, Motif, tone, stops }) => (
            <article key={key} className="mv-card" data-key={key} data-tone={tone}>
              {/* The photo, clipped to the sweeping curve */}
              <figure className="mv-figure">
                <img src={image} alt={alt} loading="lazy" decoding="async" />
              </figure>

              {/* The same photo again, unclipped, revealed by an expanding inset
                  once the drop reaches the last stop. Two layers rather than one
                  animated clip-path: a curve path() and a rectangle cannot
                  interpolate (different node counts), so the full-bleed version
                  is wiped in over the clipped one instead. alt="" because it is
                  the same picture the figure above already describes. */}
              <figure className="mv-reveal-img" aria-hidden="true">
                <img src={image} alt="" loading="lazy" decoding="async" />
              </figure>

              {/* The curve itself, drawn over the join */}
              <svg
                className="mv-stroke"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  ref={(el) => registerPath(key, el)}
                  d={CURVE}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* The travelling drop. Its position along the curve is written as
                  --mv-dot-x/y by the scroll effect; it starts at the top of the
                  card and runs down through every stop in turn. */}
              <DropFilledIcon className="mv-dot" aria-hidden="true" />

              {/* One badge per stop, each sitting ON the curve so the drop runs
                  through them rather than veering off to reach one. Their
                  left/top are measured from the real path at mount (see the
                  placeBadges effect) — hard-coded percentages drifted from the
                  curve whenever the card's aspect changed. */}
              {stops.map(({ at, Icon: StopIcon }, i) => (
                <span
                  key={i}
                  className="mv-badge"
                  data-lit="false"
                  data-at={at}
                  aria-hidden="true"
                >
                  {/* Destructured to a capitalised local rather than rendered as
                      <stop.Icon>: `stop` is itself an SVG element name, and a
                      lowercase member expression in JSX resolves to undefined,
                      which crashed the whole section. */}
                  <StopIcon className="h-6 w-6" />
                </span>
              ))}

              <div className="mv-body">
                <p className="mv-kicker">{kicker}</p>
                <h3 className="mv-title">{title}</h3>
                <span className="mv-underline" aria-hidden="true" />

                {/* All three lines are rendered and stacked; the scroll effect
                    flips data-on so only the active one is visible. Keeping them
                    in the DOM means the block reserves the height of the tallest
                    from the start, so the card does not resize as the copy
                    changes — and a screen reader gets the whole list, not just
                    whichever line the scroll happens to be showing. */}
                <div className="mv-stops">
                  {stops.map((stop, i) => (
                    <p key={i} className="mv-stop mv-text" data-on={i === 0 ? 'true' : 'false'}>
                      {stop.body}
                    </p>
                  ))}
                </div>

                <Motif className="mv-motif" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
