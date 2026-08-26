import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { KITCHEN_MOBILE_QUERY, frameSetFor } from './kitchenFrames'
import { setSceneTone } from './sceneTone'

gsap.registerPlugin(ScrollTrigger)

/*
 * SCENE 02 — the cabinet.
 *
 * The section is a tall runway (--kitchen height in index.css) with a sticky
 * 100svh stage inside it, so the kitchen holds still while the scroll drives
 * the cabinet frames forward. Frame 0 is the exact image Hero.jsx dissolved
 * into, so the viewer never sees the two components change hands.
 *
 * ONE frame set, landscape, serving both orientations — this clip keeps its
 * action centred, so a portrait cover-fit still shows the whole cabinet and
 * all four bottles. (The previous clip needed a separate portrait re-shoot.)
 * See kitchenFrames.js. Everything below — TEXT, STILL_AT — is expressed as a
 * fraction of the range, so it is independent of the frame count.
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 * The [scroll progress → position in the frame range] ramp lives on the frame
 *   set in kitchenFrames.js, as `ramp`. It is SOLVED from the clip's own
 *   motion profile so that equal scroll produces equal visible change —
 *   re-solve it if the clip or the range changes.
 * TEXT is [start, duration] as a fraction of the section's scroll.
 * Want the whole scene slower? Raise .kitchen-scene's height in index.css.
 */

const TEXT = {
  secondIn: [0.75, 0.15], // "Open it up" arrives as the packs become readable
  ctaIn: [0.88, 0.12],
}

// Piecewise-linear lookup through a set's ramp.
function rampedFrame(ramp, progress) {
  for (let i = 1; i < ramp.length; i += 1) {
    const [x1, y1] = ramp[i]
    if (progress <= x1) {
      const [x0, y0] = ramp[i - 1]
      const t = x1 === x0 ? 0 : (progress - x0) / (x1 - x0)
      return y0 + (y1 - y0) * t
    }
  }
  return 1
}

// Reduced motion gets one representative frame: doors open, all four packs lit.
const STILL_AT = 0.75

export default function KitchenReveal() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const secondRef = useRef(null)
  const ctaRef = useRef(null)

  const imagesRef = useRef([])
  const targetRef = useRef(0)
  const drawnRef = useRef(-1)
  const rafRef = useRef(0)

  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  // Which export to scrub. Crossing the breakpoint (rotating a phone, dragging a
  // desktop window narrow) swaps the set and reloads — rare enough to be worth
  // the refetch, and the alternative is a badly cropped cabinet.
  useEffect(() => {
    const media = window.matchMedia(KITCHEN_MOBILE_QUERY)
    const apply = () => setIsMobile(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  // Referentially stable per breakpoint — the effects below key off this object,
  // so a fresh one each render would refetch the whole sequence on every paint.
  const frames = useMemo(() => frameSetFor(isMobile), [isMobile])

  // ~1.6 MB / 67 frames (see kitchenFrames.js). The hero clip gets
  // the network to itself first; these only start once the browser is idle (or
  // after 1.2s, whichever comes first). They are requested in order and at low
  // priority, so the early frames — the ones the viewer reaches first — land
  // first and the scene is scrubbable long before the tail has arrived.
  // Reduced motion never scrubs, so it never pays for the sequence at all.
  useEffect(() => {
    if (reduced) return undefined
    let cancelled = false

    // The set may have just swapped under us; the old images no longer match
    // frames.count, so stand down until frame 0 of the new one has decoded.
    setReady(false)
    imagesRef.current = []
    drawnRef.current = -1

    const load = () => {
      if (cancelled) return
      imagesRef.current = Array.from({ length: frames.count }, (_, i) => {
        const img = new Image()
        img.decoding = 'async'
        img.fetchPriority = 'low'
        if (i === 0) img.onload = () => !cancelled && setReady(true)
        img.src = frames.src(i)
        return img
      })
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [reduced, frames])

  useEffect(() => {
    if (!ready || reduced) return undefined

    const draw = (index) => {
      const canvas = canvasRef.current
      const img = imagesRef.current[index]
      if (!canvas || !img || !img.complete || !img.naturalWidth) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== Math.round(width * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        drawnRef.current = -1 // the surface was cleared by the resize
      }

      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /*
       * The whole frame is drawn — no crop.
       *
       * The source frames carried a generator watermark (a 4-point sparkle at
       * x 1128-1192, y 569-632 of 1280x720). It used to be cropped out here,
       * but trimming the source rect and then cover-fitting scales the kept
       * region up: the scene zoomed and the section's framing shifted. It is now
       * painted out of the files themselves by solving Laplace over the mark
       * with the surrounding pixels as the boundary — the countertop there is a
       * smooth gradient, so it reconstructs cleanly. Pristine originals are kept
       * in public/scroll/cabinet-orig; see the inpaint recipe in kitchenFrames.js.
       */
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
      drawnRef.current = index
    }

    /*
     * The nearest frame that has actually decoded, searching outward from the
     * one we want. Frames arrive over the network in order, so scrubbing ahead
     * of the download used to hit a frame that was not there yet — draw() bailed
     * and the canvas simply held its last image, which reads as the cabinet
     * freezing and then jumping. Falling back to the closest available frame
     * keeps the sequence moving; it just moves in slightly coarser steps until
     * the rest lands.
     */
    const nearestLoaded = (want) => {
      const imgs = imagesRef.current
      const isReady = (i) => imgs[i] && imgs[i].complete && imgs[i].naturalWidth
      if (isReady(want)) return want
      for (let d = 1; d < imgs.length; d += 1) {
        if (want - d >= 0 && isReady(want - d)) return want - d
        if (want + d < imgs.length && isReady(want + d)) return want + d
      }
      return -1
    }

    const render = () => {
      rafRef.current = 0
      const want = Math.round(rampedFrame(frames.ramp, targetRef.current) * (frames.count - 1))
      const index = nearestLoaded(want)
      if (index >= 0 && index !== drawnRef.current) draw(index)
    }

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(render)
    }

    const section = sectionRef.current
    const ctx = gsap.context(() => {
      const common = {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
      }

      // Frame scrub. GSAP eases the proxy value; we only ever repaint the
      // canvas when the rounded frame index actually changes.
      const state = { p: 0 }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          ...common,
          /* A touch longer than the text timeline below. The roughness this
             absorbs is the wheel itself — a notch arrives as one jump, not a
             ramp — plus, at 67 frames over ~16px of scroll each, a little
             frame quantisation. GSAP glides the proxy value across both
             instead of snapping. Much beyond ~0.8 and the cabinet visibly
             trails the scroll. */
          scrub: 0.7,
          onEnter: () => setSceneTone(1),
          onEnterBack: () => setSceneTone(1),
          onRefresh: () => schedule(),
        },
        onUpdate: () => {
          targetRef.current = state.p
          schedule()
        },
      })

      // Text timeline. Total duration is exactly 1, so every position below
      // reads directly as a percentage of the section's scroll.
      gsap
        .timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { ...common, scrub: 0.4 },
        })
        .fromTo(
          secondRef.current,
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: TEXT.secondIn[1] },
          TEXT.secondIn[0],
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: TEXT.ctaIn[1] },
          TEXT.ctaIn[0],
        )
    }, section)

    const onResize = () => {
      drawnRef.current = -1
      schedule()
    }
    window.addEventListener('resize', onResize)

    schedule()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      ctx.revert()
    }
  }, [ready, reduced, frames])

  return (
    <section
      id="range"
      ref={sectionRef}
      className={`relative z-0 bg-acti-cream ${reduced ? 'h-svh' : 'kitchen-scene'}`}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {reduced ? (
          // No scrub to drive, so one representative frame stands in for the
          // whole sequence: doors open, all four packs on the shelf.
          <img
            src={frames.src(Math.round((frames.count - 1) * STILL_AT))}
            alt="An Actipro cabinet standing open with four bottles of oil on the shelf"
            className="kitchen-frame absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <canvas ref={canvasRef} className="kitchen-frame absolute inset-0 h-full w-full" />

            {/* Stands in until the frames arrive, so the scene is never blank.
                Always this set's own frame 0 — which is also the exact image
                Hero.jsx dissolved into, because it picks the plate from the
                same query (see firstSrcFor in kitchenFrames.js). Any other
                choice here shows one cabinet during the fade and a different
                one the moment the section takes over. */}
            {!ready && (
              <img
                src={frames.src(0)}
                alt=""
                aria-hidden="true"
                className="kitchen-frame absolute inset-0 h-full w-full object-cover"
              />
            )}
          </>
        )}

        {/* Was a warm scrim over the counter; emptied by request (see
            .kitchen-scrim in index.css). Kept in the tree so restoring it is a
            CSS-only change. */}
        <div className="kitchen-scrim pointer-events-none absolute inset-0" />

        {/* The tail of the scene dissolves into page cream so it hands off to
            the section below instead of ending on a hard dark line. It has to
            live in here: the stage is overflow:hidden, so a veil placed outside
            it (on the next section) gets clipped away and never shows. */}
        <div className="kitchen-tail pointer-events-none absolute inset-x-0 bottom-0" />

        {/* Sits in the counter band under the cabinet. On a portrait phone that
            band is only ~200px tall, so the type steps down to keep the packs clear. */}
        {/* No horizontal padding here — .acti-shell owns the gutter. Keeping the
            old px-[4vw] as well double-padded it, so the kitchen copy sat ~58px
            inboard of the hero's and the two scenes did not line up. */}
        <div className="absolute inset-x-0 bottom-0 pb-[5vh] sm:pb-[9vh]">
          <div className="acti-shell acti-shell--wide relative">
            {/* The opening "In every kitchen / The oil you reach for shapes the
                meal." block was removed — the cabinet now plays clean until the
                payoff line arrives. Nothing sits on top of it any more, so this
                one is in normal flow rather than absolutely positioned. */}
            <div ref={secondRef} className="max-w-xl">
              <p className="text-[12px] font-semibold uppercase sm:text-[11px] tracking-[0.24em] text-acti-sun">
                Open it up
              </p>
              <p className="mt-3 font-serif text-[1.6rem] leading-tight text-white sm:mt-4 sm:text-[2.75rem]">
                Behind every door,
                <br />
                a choice you can trust.
              </p>

              <a
                ref={ctaRef}
                href="#rooted"
                className={`mt-6 inline-flex rounded-full bg-acti-red px-7 py-3 sm:mt-8 sm:px-8 sm:py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-acti-orange-dark ${
                  reduced ? '' : 'invisible'
                }`}
              >
                Explore the range →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
