import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroProducts from './HeroProducts'
import { ArrowRightIcon } from './icons'
import { FIRST_SRC } from './kitchenFrames'
import { setSceneTone } from './sceneTone'

gsap.registerPlugin(ScrollTrigger)

/*
 * SCENE 01 → SCENE 02
 *
 * The hero is 100svh of composition plus an exit runway (--hero-exit, set in
 * index.css). Its contents are sticky, so during that runway nothing scrolls —
 * the scroll only drives the dissolve:
 *
 *   copy and packs lift away  →  a beat of pure oil-pour footage  →
 *   the black veils lift and a gold thread of oil draws across  →
 *   the hero clip dissolves into the first cabinet frame.
 *
 * Because it dissolves into the exact frame KitchenReveal's canvas starts on,
 * the join between the two components is invisible.
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
  warmIn: [0.34, 0.3], // amber wash peaks mid-dissolve
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

  /*
   * The hero footage is shot twice: hero.mp4 is 1280x720 landscape, mobile.mp4
   * is 1280x2274 portrait. On a phone the landscape cut has to be cropped so
   * hard by object-fit:cover that the pour ends up off-frame, so the portrait
   * cut is used instead. Same 10s length, so the scroll timeline is unchanged.
   *
   * 767px matches the phone breakpoint used elsewhere (see Milestones.jsx).
   */
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

    // Reduced motion: no runway, no scrub. The kitchen simply follows the hero.
    if (reduced) {
      setSceneTone(0)
      return undefined
    }

    // gsap.context scopes everything created inside it, so one revert() on
    // unmount kills the timeline and every ScrollTrigger it made — no leaks.
    const ctx = gsap.context(() => {
      // Once the dissolve is done the stage is showing the identical frame the
      // kitchen is already pinned on, so retiring it here is invisible — and it
      // stops the two sliding past each other as the hero section scrolls out.
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
    // The kitchen underlaps this section's last viewport, so the dark ground
    // lives on the stage below, not on the section — a section background
    // would paint straight over it.
    <section
      id="top"
      ref={sectionRef}
      className={`relative z-10 ${reduced ? 'min-h-svh' : 'hero-scene'}`}
    >
      <div
        ref={stageRef}
        className="sticky top-0 isolate flex h-svh flex-col overflow-hidden bg-acti-ink"
      >
        {/* Cabinet frame 45, pre-warmed underneath so the dissolve has somewhere to go */}
        {!reduced && (
          <img
            ref={plateRef}
            src={FIRST_SRC}
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
          key={phone ? 'mobile' : 'desktop'}
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

        <div ref={veilRef} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/45" />
        </div>

        <div ref={warmRef} className="hero-warm absolute inset-0 -z-10 opacity-0" />


        {/* On a phone the copy block is pushed to the bottom 55% so the footage
            above it reads as its own band (the jerrycan on the counter stays
            clear of the type), and a solid scrim behind the copy keeps the
            headline legible over whatever frame the loop happens to be on.
            From sm: up this is the original full-bleed layout, unchanged. */}
        <div
          ref={uiRef}
          className="acti-shell acti-shell--wide flex flex-1 flex-col justify-end pb-14 pt-32 sm:pb-16 max-sm:hero-panel max-sm:pt-0 max-sm:pb-12"
        >
          {/* On phone this is a single column: copy first, pack underneath and
              pushed to the right edge. Side by side at this width squeezed the
              headline into three-word lines and shrank the pack to a thumbnail,
              so the two now get the full measure in turn. */}
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between max-sm:gap-5">
            <div ref={copyRef} className="max-w-2xl max-sm:min-w-0">
              <p className="text-[12px] font-semibold uppercase sm:text-[11px] tracking-[0.24em] text-white/60 max-sm:text-[10px] max-sm:leading-[1.5]">
                Lite hai. Right hai.
              </p>

              <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-white sm:text-6xl lg:text-[4.25rem] max-sm:mt-3 max-sm:text-[2.35rem]">
                The right oil makes everything{' '}
                {/* The reference accents the last word rather than the whole line. */}
                <span className="text-acti-sun">lighter.</span>
              </h1>

              {/* Back to one row on phone now the column is full-width — the
                  stacked variant was only there to survive a 57% column. */}
              <div className="mt-8 flex flex-wrap items-center gap-4 max-sm:mt-5 max-sm:gap-3">
                <a
                  href="#range"
                  className="rounded-full bg-acti-sun px-9 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-acti-ink transition-colors hover:bg-acti-orange hover:text-white max-sm:px-7 max-sm:py-3 max-sm:text-[11px]"
                >
                  See the range
                </a>
                <a
                  href="#contact"
                  className="acti-tap inline-flex items-center gap-2 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white underline-offset-8 hover:underline max-sm:py-1 max-sm:text-[11px] max-sm:whitespace-nowrap"
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
              className="max-sm:hero-showcase max-sm:w-[52%] max-sm:shrink-0 max-sm:self-end"
            >
              <HeroProducts />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
