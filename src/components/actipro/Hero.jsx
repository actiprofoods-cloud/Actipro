import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroProducts from './HeroProducts'
import { ArrowRightIcon } from './icons'
import { firstSrcFor, KITCHEN_MOBILE_QUERY } from './kitchenFrames'
import { setSceneTone } from './sceneTone'

gsap.registerPlugin(ScrollTrigger)

/*
 * SCENE 01 → SCENE 02
 *
 * 100svh of composition plus an exit runway (--hero-exit, set in index.css).
 * The contents are sticky, so during that runway nothing scrolls — the scroll
 * only drives the dissolve:
 *
 *   copy and packs lift away  →  a beat of pure oil-pour footage  →
 *   the veils lift, the frame warms  →
 *   the hero clip dissolves into the first cabinet frame.
 *
 * That last frame is the plate below — the same image KitchenReveal starts its
 * canvas on, picked from the same query — so the handoff between the two
 * components is invisible. See firstSrcFor() in kitchenFrames.js.
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 * Every entry is [start, duration] as a fraction of the exit runway.
 * Want the copy to hold longer? Push copyOut/showcaseOut later.
 * Want a longer "only the oil" beat? Widen the gap between copyOut ending and
 * videoOut starting. Want the whole thing slower? Raise --hero-exit in index.css.
 */
const EXIT = {
  showcaseOut: [0.08, 0.26], // right-hand pack + carousel dots leave first
  copyOut: [0.14, 0.28], // label, headline, both CTAs
  drift: [0.0, 0.5], // the -18px lift, running under both of the above
  veilsOut: [0.4, 0.44], // black gradients lift → the frame warms up
  warmIn: [0.34, 0.3], // amber wash peaks mid-fade
  warmOut: [0.76, 0.22],
  videoOut: [0.52, 0.4], // …only now does the oil-pour footage leave
  plateIn: [0.5, 0.44], // …and the cabinet takes its place
  toneStart: 0.55, // header starts turning light here
}

export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const plateRef = useRef(null)
  const veilRef = useRef(null)
  const warmRef = useRef(null)
  const uiRef = useRef(null)
  const copyRef = useRef(null)
  const showcaseRef = useRef(null)

  const [reduced, setReduced] = useState(false)
  const [phone, setPhone] = useState(false)
  /* Separate from `phone` on purpose. `phone` (767px) picks the hero FOOTAGE;
     this one picks the cabinet PLATE, and it has to switch at exactly the
     query KitchenReveal uses to pick its frame set (639px). When the two were
     the same flag, viewports between 640-767px dissolved into the portrait
     cabinet and then scrubbed the landscape one. */
  const [cabinetMobile, setCabinetMobile] = useState(false)

  /*
   * The hero footage is shot twice: hero.mp4 is 1280x720 landscape, mobile.mp4
   * is 1280x2274 portrait. On a phone the landscape cut has to be cropped so
   * hard by object-fit:cover that the pour ends up off-frame, so the portrait
   * cut is used instead. Same 10s length, so the scroll timeline is unchanged.
   *
   * 767px matches the phone breakpoint used elsewhere (see Milestones.jsx).
   */
  useEffect(() => {
    const media = window.matchMedia(KITCHEN_MOBILE_QUERY)
    const apply = () => setCabinetMobile(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const apply = () => setPhone(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  // React sets `muted` as a property, but belt-and-braces: force it on mount so
  // the hero can never play sound, and so autoplay is never blocked for audio.
  // Re-runs when the source swaps, because that remounts the element (see the
  // `key` on <video>) and the fresh node needs muting before it can autoplay.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.volume = 0
  }, [phone])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    // Reduced motion: no runway, no scrub. The range simply follows the hero.
    if (reduced) {
      setSceneTone(0)
      return undefined
    }

    // gsap.context scopes everything created inside it, so one revert() on
    // unmount kills the timeline and every ScrollTrigger it made — no leaks.
    const ctx = gsap.context(() => {
      // By the end of the runway the stage has faded out entirely, so retiring
      // it here is invisible — and it stops the spent stage sliding over the
      // section below as the hero scrolls out.
      const syncStage = (self) => {
        gsap.set(stageRef.current, { autoAlpha: self.progress >= 0.999 ? 0 : 1 })
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom', // i.e. the whole of --hero-exit
          scrub: 0.6, // GSAP's own smoothing — this is what stops it feeling twitchy
          invalidateOnRefresh: true,
          onUpdate: syncStage,
          onRefresh: syncStage,
          onToggle: syncStage,
          // Past the runway the tween stops updating, so clamp the tone by hand.
          onLeave: () => setSceneTone(1),
          onLeaveBack: () => setSceneTone(0),
        },
      })

      // The whole block drifts up from the very first pixel of scroll, so the
      // runway never feels like dead travel before the fade begins.
      tl.to(uiRef.current, { y: -18, duration: EXIT.drift[1] }, EXIT.drift[0])
        .to(
          showcaseRef.current,
          { autoAlpha: 0, duration: EXIT.showcaseOut[1] },
          EXIT.showcaseOut[0],
        )
        .to(copyRef.current, { autoAlpha: 0, duration: EXIT.copyOut[1] }, EXIT.copyOut[0])

      // Dark → warm → cream.
      tl.to(veilRef.current, { opacity: 0, duration: EXIT.veilsOut[1] }, EXIT.veilsOut[0])
        .fromTo(
          warmRef.current,
          { opacity: 0 },
          { opacity: 1, duration: EXIT.warmIn[1] },
          EXIT.warmIn[0],
        )
        .to(warmRef.current, { opacity: 0, duration: EXIT.warmOut[1] }, EXIT.warmOut[0])

      // The crossfade itself. The plate settles from 1.04 → 1 so it lands at
      // exactly the scale the kitchen canvas will pick it up at.
      tl.to(videoRef.current, { opacity: 0, duration: EXIT.videoOut[1] }, EXIT.videoOut[0]).fromTo(
        plateRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: EXIT.plateIn[1] },
        EXIT.plateIn[0],
      )

      // Header tone rides the same scrub via a proxy object — no React state.
      const tone = { v: 0 }
      tl.to(
        tone,
        {
          v: 1,
          duration: 1 - EXIT.toneStart,
          onUpdate: () => setSceneTone(tone.v),
        },
        EXIT.toneStart,
      )
    }, section)

    return () => ctx.revert()
    // `phone` is a dependency because swapping the source remounts <video>, and
    // the timeline captured the OLD node's opacity tween. Without this the hero
    // footage would never fade out after a breakpoint cross.
  }, [reduced, phone])

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`relative z-10 ${reduced ? 'min-h-svh' : 'hero-scene'}`}
    >
      <div
        ref={stageRef}
        className="sticky top-0 isolate flex h-svh flex-col overflow-hidden bg-acti-ink"
      >
        {/* The cabinet's first frame, pre-warmed underneath so the dissolve has
            somewhere to go. Whichever set KitchenReveal is about to scrub —
            landscape or portrait — so the two never show different pictures
            across the handoff. */}
        {!reduced && (
          <img
            key={cabinetMobile ? 'plate-mobile' : 'plate-desktop'}
            ref={plateRef}
            src={firstSrcFor(cabinetMobile)}
            alt=""
            aria-hidden="true"
            fetchPriority="low"
            className="kitchen-plate absolute inset-0 -z-30 h-full w-full object-cover opacity-0"
          />
        )}

        {/* Desktop: 1280x720 landscape. Phone: 1280x2274 portrait. Either way
            object-cover fills the hero edge to edge with no letterboxing.
            `key` remounts on the swap — changing src alone on a live <video>
            leaves the previous footage playing until an explicit load(). */}
        <video
          key={phone ? 'video-mobile' : 'video-desktop'}
          ref={videoRef}
          className="hero-video absolute inset-0 -z-20 h-full w-full object-cover"
          src={phone ? '/video/mobile.mp4' : '/video/hero.mp4'}
          poster={phone ? '/video/mobile-poster.jpg' : '/video/hero-poster.jpg'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        />

        {/* The grade. This used to be `filter: brightness()` on the video
            itself, which cost 33ms a frame — the compositor re-filtered the
            whole 1440x900 surface on every video AND scroll frame. A flat
            multiply layer is one GPU composite and reads the same.
            Sits above the video (-z-20) and below the veils (-z-10). */}
        <div className="hero-grade -z-[15]" aria-hidden="true" />

        {/* The veils, thinned so the footage actually reads through them.
            The flat bg-black/25 sheet is gone entirely — it was a second full
            -frame darkener stacked on top of .hero-grade, and between the two
            the kitchen behind was barely visible.
            What remains is only the top-and-bottom gradient that protects the
            header and the copy, eased off hard through the middle (via-*) so
            the centre of the frame is left clear. Warm-tinted rather than pure
            black, to sit with the dusk grade instead of neutralising it. */}
        <div ref={veilRef} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(28,18,6,0.6)] via-[rgba(28,18,6,0.04)] to-[rgba(28,18,6,0.34)]" />

        </div>

        <div ref={warmRef} className="hero-warm absolute inset-0 -z-10 opacity-0" />


        {/* On a phone the copy block is pushed to the bottom 55% so the footage
            above it reads as its own band (the jerrycan on the counter stays
            clear of the type), and a solid scrim behind the copy keeps the
            headline legible over whatever frame the loop happens to be on.
            From sm: up this is the original full-bleed layout, unchanged. */}
        <div
          ref={uiRef}
          // No max-sm:justify-start any more — the panel keeps justify-end at
          // every width, so the copy and the pack stack against the BOTTOM of
          // the scrim and the footage above them is left clear. The override
          // used to pull the stack to the top, which put the headline
          // mid-screen over the face in the shot.
          //
          // max-sm:pb-1 (4px), against the 48px it started with: with the
          // stack bottom-anchored, this padding is the ONLY thing between the
          // copy and the foot of the screen, so it is the dial for how low the
          // block sits. The panel's gradient is solid ink at its base, so the
          // type stays legible this close to the edge. It is not 0 because the
          // pack's dashes sit at the very bottom of the stack and would
          // otherwise touch the screen edge.
          className="acti-shell acti-shell--wide flex flex-1 flex-col justify-end pb-14 pt-32 sm:pb-16 hero-panel max-sm:pt-20 max-sm:pb-1"
        >
          {/* On phone this is a single column: copy first, pack underneath and
              pushed to the right edge. Side by side at this width squeezed the
              headline into three-word lines and shrank the pack to a thumbnail,
              so the two now get the full measure in turn. */}
          {/* max-sm:flex-1 removed with it: stretching the row to the panel's
              height is what spread its two children apart. Content-height, so
              copy and pack read as one block.
              gap-2 rather than gap-5 on phone: with the stack anchored to the
              bottom, every pixel between the copy and the pack pushes the copy
              back UP the screen. */}
          {/* max-sm:gap-2 closes the hole between the copy and the pack. The
              row's gap was 20px (gap-5) but the pack also carries its own top
              spacing, and with the copy bottom-anchored the two together left
              an ~85px band of empty scrim between the headline and the pack. */}
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between max-sm:gap-2">
            {/* max-sm:mt-auto is what moves the copy down, and it only works
                because the row now FILLS the panel (see .hero-panel > div)
                and the pack is pinned to the foot by margin-top:auto on
                .hero-showcase. The slack between them lands above this
                column, so auto pushes the copy to the bottom of that gap —
                with the pack staying exactly where it is, at full size.

                An earlier attempt used a fixed mt-28 while the row was
                content-height. That could not work: the stack was
                bottom-anchored, so a top margin merely grew the row upward
                and the copy never moved. */}
            {/* max-sm:mb-* is the dial for how far DOWN the copy sits, and it is
                the only one that moves the copy without touching the pack: the
                row's slack all sits above the copy (mt-auto), so a bottom
                margin pushes the copy into the gap between it and the pack
                rather than resizing anything in the showcase.

                -14.5rem lands the copy's baseline level with the pack's, so the
                two columns finish together instead of the copy floating a
                screenful above it. They overlap vertically by design and are
                kept apart horizontally: the copy is left, the pack is right. */}
            {/* max-sm:mb was -14.5rem, which is a NEGATIVE margin tuned to lift
                the copy into the pack's band so the two columns finish level.
                That value assumed a two-line headline; at 13ch the headline
                takes three lines, so the extra line pushed its bottom 175px
                past the top of the pack and "everything lighter." collided
                with the "Madhuri Actipro" caption underneath it.

                -9rem restores the intended overlap (the copy still rises into
                the pack's band, which is what keeps the block compact) while
                leaving the headline clear of the caption. Measured at 390px
                and 430px with the longest product name in the rotation.

                max-w-[62%] goes with it: the two columns overlap vertically by
                design and are kept apart HORIZONTALLY (copy left, pack right).
                The copy column was full-width, so "FROM OUR RANGE" — which is
                right-aligned at the top of the pack column — was painting over
                the headline's line box. Capping the copy leaves that gutter. */}
            <div ref={copyRef} className="max-w-2xl max-sm:mt-auto max-sm:mb-[-9rem] max-sm:min-w-0 max-sm:max-w-[62%]">
              <p className="hero-eyebrow text-white/70">Lite hai. Right hai.</p>

              {/* max-w-[11ch] on phones is what sets the headline over THREE
                  lines instead of two. 13ch is measured, not guessed: 14ch and
                  above still fit two lines, 11ch spills to four. A measure cap rather than hard <br>s: the break still
                  falls between words at any width, and the desktop measure is
                  untouched. */}
              <h1 className="hero-display mt-5 text-white max-sm:mt-2.5 max-sm:max-w-[13ch]">
                The right oil makes everything{' '}
                {/* The reference accents the last word rather than the whole line. */}
                <span className="text-acti-sun">lighter.</span>
              </h1>

              {/* Back to one row on phone now the column is full-width — the
                  stacked variant was only there to survive a 57% column. */}
              {/* items-start + flex-col on phones: the distributor link moves to
                  its own line under the button rather than sitting beside it. */}
              <div className="mt-8 flex flex-wrap items-center gap-4 max-sm:mt-4 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                <a
                  href="#range"
                  className="acti-tap hero-cta-primary hero-eyebrow inline-flex items-center justify-center rounded-full bg-acti-sun px-9 py-3.5 text-acti-ink transition-colors hover:bg-acti-orange hover:text-white max-sm:px-5 max-sm:py-2"
                >
                  See the range
                </a>
                <a
                  href="#contact"
                  // Hidden on phones: the hero there is a short scrim over the
                  // footage and the button below already carries the primary
                  // action. The distributor page stays reachable from the header
                  // and footer nav, so nothing becomes unreachable.
                  className="acti-tap hero-eyebrow inline-flex items-center gap-2 py-3 text-white underline-offset-8 hover:underline max-sm:hidden"
                >
                  Become a distributor
                  <ArrowRightIcon className="h-4 w-4 shrink-0" />
                </a>
              </div>
            </div>

            {/* Bottom-right on phone: the column is now stacked, so this block
                sits under the copy and self-end pulls it to the right gutter,
                where hero-showcase right-aligns its type to match. */}
            <div
              ref={showcaseRef}
              // mt-auto dropped along with the row's flex-1 — with a
              // content-height row there is no slack for it to absorb, and
              // keeping it would push the pack away from the copy again.
              className="hero-showcase max-sm:w-[52%] max-sm:shrink-0 max-sm:self-end"
            >
              <HeroProducts />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
