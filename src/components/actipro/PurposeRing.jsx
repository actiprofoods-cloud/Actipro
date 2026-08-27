import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { Target, Droplet, Eye, Globe } from 'lucide-react'

/*
 * MISSION & VISION — the circular-progress scene.
 *
 * A 400vh runway with a sticky 100vh stage inside it. Nothing on screen
 * scrolls; the scroll only drives one value (scrollYProgress, 0 → 1), and
 * everything else is derived from it:
 *
 *   the olive arc sweeps clockwise from 12 o'clock   (continuous)
 *   the gold dashed accent follows, slightly behind  (continuous)
 *   four dot markers light as the arc passes them    (stepped, off the arc)
 *   a mission/vision PAIR cross-fades, both at once  (stepped, off the stage)
 *
 * ── WHY FRAMER MOTION HERE AND GSAP EVERYWHERE ELSE ────────────────────────
 * The rest of the page (Hero, KitchenReveal, Milestones) pins with GSAP
 * ScrollTrigger, which is driven by Lenis. This section was specified in
 * Framer Motion, so it uses CSS `position: sticky` for the pin instead of a
 * ScrollTrigger pin — the two pinning systems must not both own this element.
 * useScroll reads native scroll position, which Lenis also updates, so the
 * progress value stays in step with the smooth scrolling on the rest of the
 * page. Do NOT add a ScrollTrigger to this section.
 *
 * ── TUNING ────────────────────────────────────────────────────────────────
 * Runway length          .pr-runway's height in index.css — one viewport
 *                        per stage plus a beat to read each.
 * Where a stage flips    STAGE_AT below; the scroll fractions at which each
 *                        PAIR (mission + vision) becomes the active one.
 * Arc speed              ARC_END — the progress value at which the ring is
 *                        full. Slightly under 1 so the ring completes just
 *                        before the section releases, rather than on the
 *                        very last pixel.
 */

/* Geometry is in viewBox units, and the viewBox is BOX square, so a radius
   reads directly as a fraction of the rendered ring. */
const BOX = 440
/*
 * THREE marks. There is still NO drawn track — the circle behind the arc is fully
 * transparent, so the only marks are the olive progress arc and the gold
 * dotted line inside it:
 *
 *   outline r=209.5 w=1.25 dark hairline, the ring's outer boundary
 *   olive   r=202  w=12    the progress arc
 *   dotted  r=182  w=2.5   gold dots, plus the four step markers
 *
 * A glass/frosted groove was tried here and removed on request: the empty
 * part of the ring is meant to be nothing at all, not a visible channel
 * waiting to be filled. Do not reintroduce a track stroke on R_PROGRESS.
 * The consequence is intended — for most of the scroll the arc IS partial
 * and there is nothing behind it.
 *
 * Outer edge lands at 208 against the 220 half-box, so nothing clips.
 */
const R_PROGRESS = 202 // olive arc
const R_ACCENT = 182 // dotted gold ring, inside it
/* Thin dark ring just OUTSIDE the progress arc. The arc is w12 on r=202, so it
   occupies 196..208; this sits at 209.5 — clear of the stroke, and still inside
   the 220 half-box so it cannot clip. Unlike the glass track that was removed,
   this is a HAIRLINE, not a filled groove: it outlines the circle without
   putting anything behind the arc. */
const R_OUTLINE = 209.5
const C_PROGRESS = 2 * Math.PI * R_PROGRESS
const C_ACCENT = 2 * Math.PI * R_ACCENT

// The ring is full a little before the runway ends, so the last step has a
// beat to be read against a completed circle.
const ARC_END = 0.92

// Scroll fraction at which each STAGE takes over. Two stages, so the swap
// lands at the halfway point of the runway. Stage 1 is active the moment the
// section pins, rather than fading in from nothing.
const STAGE_AT = [0, 0.5]

/*
 * Copy is lifted from the existing MissionVision.jsx rather than invented, so
 * this section does not start making claims the rest of the site does not
 * back up.
 *
 * PAIRED, not sequential. Each stage carries a mission AND a vision, and both
 * appear at the same time — mission on the left, vision on the right. The
 * scroll steps through the PAIRS, so the two columns always change together
 * and the section never has one side lit and the other dark.
 *
 * The ring keeps its four quarter-turn markers; a stage spans two of them, so
 * the dots continue to track the arc rather than the copy.
 */
const STAGES = [
  {
    id: 'stage-1',
    mission: {
      label: 'Mission',
      heading: 'Nourish with purity and care.',
      body: 'To bring pure, healthy and honest cooking oils to every Indian kitchen.',
      Icon: Target,
    },
    vision: {
      label: 'Vision',
      heading: 'Inspiring a better, sustainable future.',
      body: 'To be India’s most trusted edible oil brand, known for quality, purity and care.',
      Icon: Eye,
    },
  },
  {
    id: 'stage-2',
    mission: {
      label: 'Mission',
      heading: 'Refined six times over.',
      body: 'Fortified with Vitamin A and D, and 100% vegetarian across the range.',
      Icon: Droplet,
    },
    vision: {
      label: 'Vision',
      heading: 'Made on our own lines.',
      body: 'Three plants, three FSSAI licences, and no third-party packing.',
      Icon: Globe,
    },
  },
]

/* The four dots sit at 12, 3, 6 and 9 o'clock on the accent radius. Angles are
   offset -90deg because SVG's 0deg is 3 o'clock and the ring starts at 12. */
const DOTS = [0, 90, 180, 270].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { deg, x: BOX / 2 + R_ACCENT * Math.cos(rad), y: BOX / 2 + R_ACCENT * Math.sin(rad) }
})

function StepBlock({ step, active, reduced }) {
  const { Icon, label, heading, body, side } = step
  const right = side === 'right'
  return (
    <motion.div
      /*
       * The two blocks in a slot share ONE grid cell (see .pr-slot), which is
       * what keeps the column's width reserved so the ring never shifts as
       * steps alternate sides.
       *
       * Because they overlap, the inactive one must not paint: at opacity 0.12
       * its heading printed straight through the active heading and both were
       * unreadable. It fades to 0 and is taken out of hit-testing instead. The
       * cell still holds its size, so nothing moves — the ghost is gone, the
       * layout stability it was there for is not.
       *
       * Under reduced motion there is no scrub driving `active`, so the blocks
       * are un-stacked in CSS and every one is shown in full.
       */
      animate={reduced ? { opacity: 1, y: 0 } : { opacity: active ? 1 : 0, y: active ? 0 : 10 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={reduced ? undefined : { pointerEvents: active ? 'auto' : 'none' }}
      className={`pr-block ${right ? 'items-start text-left' : 'items-end text-right'}`}
      aria-hidden={!reduced && !active}
    >
      <span className="pr-icon">
        <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="pr-label">{label}</span>
      <h3 className="pr-heading">{heading}</h3>
      <p className="pr-body">{body}</p>
    </motion.div>
  )
}

export default function PurposeRing({ image = '/purpose/bottle.webp' }) {
  const sectionRef = useRef(null)
  const [stageIndex, setStageIndex] = useState(0)
  const reduced = useReducedMotion()

  // offset: the runway starts advancing when the section's top hits the top of
  // the viewport, and finishes when its bottom does — i.e. exactly the span
  // over which the inner stage is stuck.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // A light spring keeps the arc from stepping on a wheel notch (which arrives
  // as one jump, not a ramp) without letting it visibly lag the scroll.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 })

  // Continuous, NOT stepped: dashoffset runs the full circumference → 0.
  const dashProgress = useTransform(p, [0, ARC_END], [C_PROGRESS, 0], { clamp: true })
  // The accent trails the olive arc slightly, so the two do not read as one
  // thick stroke moving together.
  const dashAccent = useTransform(p, [0.06, ARC_END + 0.04], [C_ACCENT, 0], { clamp: true })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let next = 0
    for (let i = 0; i < STAGE_AT.length; i += 1) if (v >= STAGE_AT[i]) next = i
    setStageIndex(next)
  })

  // The four ring markers still track the ARC, not the copy — a dot lights as
  // the olive stroke sweeps past it, which is a quarter turn each.
  const [dotsLit, setDotsLit] = useState(0)
  useMotionValueEvent(p, 'change', (v) => {
    setDotsLit(Math.min(3, Math.floor((v / ARC_END) * 4)))
  })

  const stage = STAGES[stageIndex] ?? STAGES[0]

  return (
    <section id="purpose" ref={sectionRef} className="pr-runway">
      <div className="pr-sticky">
        <div className="pr-card">
          <div className="pr-grid">
            {/* LEFT — mission, every stage */}
            <div className="pr-slot">
              {STAGES.map((st, i) => (
                <StepBlock
                  key={`${st.id}-mission`}
                  step={{ ...st.mission, side: 'left' }}
                  active={i === stageIndex}
                  reduced={reduced}
                />
              ))}
            </div>

            {/* CENTRE — the ring */}
            <div className="pr-ring">
              <svg viewBox={`0 0 ${BOX} ${BOX}`} className="pr-svg" aria-hidden="true">
                {/* -90deg so both arcs start at 12 o'clock and fill clockwise */}
                <g transform={`rotate(-90 ${BOX / 2} ${BOX / 2})`}>
                  {/* The outline — a full, always-drawn dark hairline sitting
                      just outside the progress arc. It does NOT sit behind the
                      arc (that was the glass track, removed): the space the
                      green sweeps through stays completely transparent. This
                      only draws the circle's outer boundary, so the ring reads
                      as a defined shape even where the arc has not reached. */}
                  <circle
                    cx={BOX / 2}
                    cy={BOX / 2}
                    r={R_OUTLINE}
                    fill="none"
                    stroke="rgba(58, 51, 36, 0.55)"
                    strokeWidth="1.25"
                  />
                  <motion.circle
                    cx={BOX / 2}
                    cy={BOX / 2}
                    r={R_PROGRESS}
                    fill="none"
                    stroke="#6B7F3A"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={C_PROGRESS}
                    style={{ strokeDashoffset: dashProgress }}
                  />
                  {/* The dotted gold ring.
                      One element cannot carry both dash patterns: strokeDasharray
                      is what makes it dotted ("2 10") AND what a dashoffset
                      reveal needs (one full-circumference dash). So the dots are
                      drawn in full and REVEALED by a mask — a thick white arc on
                      the same radius whose own dashoffset is animated. The dots
                      appear as that arc sweeps over them. */}
                  {/* The dots' own unfilled state: the SAME dotted circle at
                      low opacity and NOT masked, so all the way round the ring
                      there is a faint gold track showing where the dots will
                      land. The masked, full-strength copy below lights them up
                      as the reveal arc passes. Without this the gold dots pop
                      into existence out of blank cream. */}
                  <circle
                    cx={BOX / 2}
                    cy={BOX / 2}
                    r={R_ACCENT}
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="0 10"
                    opacity="0.22"
                  />
                  {/* strokeDasharray "0 10" with a ROUND cap draws pure dots
                      rather than short dashes: the dash length is zero, so the
                      cap alone becomes the mark. */}
                  <circle
                    cx={BOX / 2}
                    cy={BOX / 2}
                    r={R_ACCENT}
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="0 10"
                    mask="url(#pr-accent-reveal)"
                  />
                </g>

                <defs>
                  <mask id="pr-accent-reveal" maskUnits="userSpaceOnUse">
                    {/* Wide enough to cover the 2.5px dotted stroke with margin,
                        so the mask edge never clips a dot lengthwise. */}
                    <motion.circle
                      cx={BOX / 2}
                      cy={BOX / 2}
                      r={R_ACCENT}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="8"
                      strokeDasharray={C_ACCENT}
                      style={{ strokeDashoffset: dashAccent }}
                    />
                  </mask>
                </defs>

                {DOTS.map((d, i) => (
                  <motion.circle
                    key={d.deg}
                    cx={d.x}
                    cy={d.y}
                    r="4"
                    animate={{
                      fill: i <= dotsLit ? '#C9A227' : '#E3D9C6',
                      scale: i <= dotsLit ? 1.4 : 1,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ transformOrigin: `${d.x}px ${d.y}px` }}
                  />
                ))}
              </svg>

              {/* The bottle, standing inside the ring. Height-constrained
                  rather than width-constrained: it is a tall portrait cutout,
                  so sizing it by width would push its cap and base outside
                  the arcs. */}
              <span className="pr-shadow" aria-hidden="true" />
              <img className="pr-bottle" src={image} alt="" aria-hidden="true" />
            </div>

            {/* RIGHT — vision, every stage. Same index as the left column,
                so the two always change together. */}
            <div className="pr-slot">
              {STAGES.map((st, i) => (
                <StepBlock
                  key={`${st.id}-vision`}
                  step={{ ...st.vision, side: 'right' }}
                  active={i === stageIndex}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>

          {/* The active heading, announced once per step. The visual blocks are
              aria-hidden while inactive, so without this a screen reader would
              hear all four at once. */}
          <p className="sr-only" aria-live="polite">
            {stage.mission.heading} {stage.vision.heading}
          </p>
        </div>
      </div>
    </section>
  )
}
