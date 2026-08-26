import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldIcon, PinIcon, DropIcon } from './icons'

gsap.registerPlugin(ScrollTrigger)

/*
 * MILESTONES — what Madhuri Refiners has actually built, on a vertical timeline.
 *
 * The connector is public/bg/oil-line.webm: ONE element, one continuous pour.
 *
 * The source clip (public/oil/) is 720x1280 — a 1:1.78 frame, while the rail
 * needs roughly 1:6 to 1:18. It used to be tiled in the DOM to cover that, and
 * the repeats were visible. Instead the tall ribbon is baked into the file: the
 * clip is stacked four high, each copy CROSS-FADED into the next over a 150px
 * overlap and reading the clip at a different time offset, so there is no row
 * where two segments have to line up and no segment repeats another's shape.
 * The result is 352x1686 and the rail crops whatever it does not need.
 *
 * The clip is shot on WHITE, so its transparency is keyed out in ffmpeg on
 * saturation. Both the webm AND its poster must be baked with that key and
 * kept in step — if either loses its alpha it paints an opaque pale rectangle
 * down the cream page instead of a floating ribbon. See the note in index.css
 * for the exact command.
 *
 * It is fully drawn from the moment the section renders — scroll does not
 * reveal it.
 *
 * What scroll DOES drive is the reading state. Each milestone starts as a pale
 * wash and darkens to full ink as the oil passes it:
 *
 *   --ms-p   0 → 1   section progress, written on .ms-track
 *   --n-p    0 → 1   per-milestone progress, written on each <li>
 *
 * Both are plain custom-property writes, so a 60fps scrub never re-renders
 * React. The colours are interpolated in CSS (see .ms-body / .ms-label).
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 * DARKEN_LEAD  how far before its dot a milestone starts darkening.
 * DARKEN_SPAN  how much scroll it takes to go from pale to full ink.
 *              Smaller = snappier, larger = a longer gradual settle.
 */
const DARKEN_LEAD = 0.16
const DARKEN_SPAN = 0.2

/*
 * Three milestones, not five. The rail reads as one pour past three markers;
 * at five the markers came every ~13rem and the column read as a list of
 * bullets with oil behind it rather than a pour with a few landmarks on it.
 *
 * The two that were cut were not dropped — the fortification mark and the
 * per-batch lab report are folded into the entries that already carried the
 * range and the plants, so nothing on the record is lost.
 */
const MILESTONES = [
  {
    Icon: PinIcon,
    stat: '03',
    label: 'Refineries running',
    body: 'Our own crushing and refining lines at Dhannad near Indore, at Mandsaur, and at Shinde Gaon near Nashik — three plants, three FSSAI licences, no third-party packing.',
  },
  {
    Icon: DropIcon,
    stat: '04',
    label: 'Oils in the range',
    body: 'Madhuri Actipro Refined Sunflower, Kachi Ghani Mustard, Refined Groundnut and Rice Bran — refined and cold pressed under one roof, with Oryzanol in the rice bran and Vitamin E across the range.',
  },
  {
    Icon: ShieldIcon,
    stat: '100%',
    label: 'Batches on record',
    body: 'Every lot is logged against an in-house lab report before it leaves the plant, under head office licence 11424999000132 — and every pack in the range is 100% vegetarian.',
  },
]

export default function Milestones() {
  const trackRef = useRef(null)

  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(motion.matches)
    apply()
    motion.addEventListener('change', apply)
    return () => motion.removeEventListener('change', apply)
  }, [])

  /*
   * Phones USED to get a still image instead of the video. That was correct when
   * the ribbon was tiled — a short clip repeated down the rail meant six or
   * seven live decoders on screen at once, which no phone should pay for.
   *
   * The ribbon is one baked 300x1686 element now, so a phone runs exactly ONE
   * decoder, the same as desktop, and it is paused whenever the section is off
   * screen. The still was costing the pour all of its motion on the viewport
   * where the section is tallest and most of the scroll happens.
   *
   * Only prefers-reduced-motion still gets the poster, which is the one case
   * where holding it still is the point.
   */
  const still = reduced

  /*
   * One video, so one decoder — but it only runs while the section is actually
   * on screen. A 300x2136 frame is large to decode and there is no reason to
   * spend that while the viewer is up in the hero.
   */
  useEffect(() => {
    const track = trackRef.current
    if (!track || still) return undefined

    const video = track.querySelector('video')
    if (!video) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const play = video.play()
          if (play && play.catch) play.catch(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      { rootMargin: '15% 0px' },
    )
    observer.observe(track)
    return () => observer.disconnect()
  }, [still])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const nodes = Array.from(track.querySelectorAll('[data-node]'))

    // One write per frame: section progress, plus each milestone's own 0→1.
    const paint = (p) => {
      track.style.setProperty('--ms-p', String(Math.round(p * 1000) / 1000))
      nodes.forEach((node, i) => {
        // Milestones are spread over the first (1 - DARKEN_SPAN) of the scroll,
        // so even the last one has a full span left to finish darkening in —
        // spacing them across the whole range leaves the last stuck part-way.
        const spread = Math.max(0.001, 1 - DARKEN_SPAN)
        const at = nodes.length > 1 ? (i / (nodes.length - 1)) * spread : 0
        const from = Math.max(0, at - DARKEN_LEAD)
        const local = Math.min(1, Math.max(0, (p - from) / DARKEN_SPAN))
        node.style.setProperty('--n-p', String(Math.round(local * 100) / 100))
      })
    }

    // Reduced motion: everything is simply already read.
    if (reduced) {
      paint(1)
      return undefined
    }

    const ctx = gsap.context(() => {
      const state = { p: 0 }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        // Darkens as you read down the track: starts when its top nears the
        // lower viewport, finishes as its tail clears the middle.
        scrollTrigger: {
          trigger: track,
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => paint(state.p),
      })
    }, track)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="mission"
      // Padding is asymmetric on purpose: the top needs its full run (the
      // section opens on a heading, and the seam has to dissolve into the
      // section above), the bottom does not — the pour has already faded out
      // by then, so a matching pad just left empty cream above the footer.
      // The bottom pad is no longer the small one it was at five milestones.
      // With three the section is much shorter, and pb-10 left the closing card
      // only ~30px clear of the scene's busy photographic bottom edge, so the
      // garlic and star anise sat right behind the text. This gives it room to
      // finish against clean cream instead.
      className="ms-scene acti-seam relative isolate overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-28"
    >
      <div className="acti-shell">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-semibold uppercase sm:text-[11px] tracking-[0.24em] text-acti-ink/45">
            Milestones
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.12] text-acti-ink sm:text-5xl">
            What we have built so far
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-acti-ink/70">
            Madhuri Refiners has crushed and refined its own oil from the start. The record reads
            best as a list — the plants we run, the states we reach, and what goes into the pack.
          </p>
        </header>

        {/*
          Alpha steepener for the pour. VP9 stores the ribbon's alpha lossily, so
          the flat background decodes as a faint film instead of true zero — and
          a couple of percent of opacity spread down a whole column reads as a
          pale rectangle behind the oil. CSS cannot curve alpha, so this maps
          everything below ~15% to nothing and leaves the ink untouched.
          Referenced by .ms-oil-line's filter in index.css.
        */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <filter id="oil-alpha" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              {/*
                Nine evenly spaced stops (input 0, .125, .25 … 1). The first
                THREE are zero, so everything under ~25% alpha — the encode's
                film — is erased. From there it climbs back to the identity
                ramp, so the crossfaded joins and the oil's own soft edges keep
                their real translucency instead of being posterised into a hard
                cut-out.

                The third stop was 0.18 when the ribbon was baked at crf 40. The
                current clip is boomeranged (twice the frames, so a higher crf
                for the same byte budget) and its residual film measures ~4% of
                the flat area reaching 30/255 — just past the old cut. Zeroing
                the third stop puts the knee safely above it.
              */}
              <feFuncA type="table" tableValues="0 0 0 0.30 0.52 0.70 0.84 0.94 1" />
            </feComponentTransfer>
          </filter>
        </svg>

        <div ref={trackRef} className="ms-track mt-16 sm:mt-20">
          {/* The pour — a single element. The tall ribbon is baked into the
              file, not tiled here, so there is nothing to repeat. */}
          <div className="ms-oil" aria-hidden="true">
            {still ? (
              <img className="ms-oil-line" src="/bg/oil-line-poster.webp" alt="" />
            ) : (
              <video
                className="ms-oil-line"
                src="/bg/oil-line.webm"
                poster="/bg/oil-line-poster.webp"
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
              />
            )}
          </div>

          <ol className="ms-list">
            {MILESTONES.map(({ Icon, stat, label, body }) => (
              <li key={label} data-node className="ms-item">
                <span className="ms-dot" aria-hidden="true" />
                <div className="ms-card">
                  <span className="ms-icon">
                    <Icon className="h-7 w-7" />
                  </span>
                  <p className="ms-stat">{stat}</p>
                  <h3 className="ms-label">{label}</h3>
                  <p className="ms-body">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
