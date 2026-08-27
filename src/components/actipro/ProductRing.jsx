import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

/*
 * PRODUCT RING — a scroll-driven circular progress ring framing a product shot.
 *
 * Self-contained and unopinionated about where it sits: it brings its own
 * sizing, its own scroll tracking and its own colours (all overridable by
 * prop), and paints nothing behind itself, so the section's background shows
 * through.
 *
 * NOT to be confused with PurposeRing.jsx, which is a different thing: that is
 * a 400vh pinned mission/vision scene with stepped copy. This is a compact,
 * in-flow ornament that fills once as it scrolls into view.
 *
 * ── GEOMETRY ───────────────────────────────────────────────────────────────
 * The viewBox is 200x200 and the container is square, so every radius below
 * reads as a fraction of the rendered box at any breakpoint.
 *
 *   track     r=86  w=9    full ring, always visible
 *   progress  r=86  w=10   the arc that fills on scroll, over the track
 *   accent    r=72  w=1.5  static partial arc + a dot at each end
 *
 * Progress is one unit WIDER than the track by design: the darker stroke then
 * covers the track cleanly as it sweeps, instead of leaving a pale fringe
 * either side of it.
 */

/* Both rings share this radius; the progress arc is drawn directly over the
   track, so the fill reads as the track darkening rather than as a second ring. */
const R_RING = 86
const R_ACCENT = 72

/*
 * The accent is a fixed 200deg arc starting at 10 o'clock.
 *
 * With pathLength="1" the dash values below are FRACTIONS OF THE CIRCLE, not
 * user units — which is the whole reason pathLength is set here too: 200/360
 * is the visible run and the remainder is the gap, and neither has to be
 * recomputed if R_ACCENT changes.
 */
const ACCENT_SWEEP = 200 / 360
/* SVG's 0deg is 3 o'clock, so 10 o'clock is -150deg. */
const ACCENT_START_DEG = -150
const ACCENT_SPAN_DEG = 200

/* Endpoint dots, in viewBox coordinates. Derived from the same constants as
   the arc, so the dots cannot drift off the ends of the stroke if the sweep is
   retuned. The -90 converts a clock-face angle into SVG's 3-o'clock zero. */
const accentPoint = (deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: 100 + R_ACCENT * Math.cos(rad), y: 100 + R_ACCENT * Math.sin(rad) }
}
const ACCENT_DOTS = [
  accentPoint(ACCENT_START_DEG + 90),
  accentPoint(ACCENT_START_DEG + 90 + ACCENT_SPAN_DEG),
]

export default function ProductRing({
  src,
  alt,
  branchSrc,
  branchAlt = '',
  trackColor = '#EFE7DA',
  progressColor = '#55692B',
  accentColor = '#C9A961',
  glowColor = '#FFFDF8',
  className = '',
}) {
  const containerRef = useRef(null)
  const reduced = useReducedMotion()

  /* offset: starts filling as the ring's top edge reaches 85% down the
     viewport (just as it appears) and completes when its centre is 40% down
     (comfortably read, before it leaves). Deliberately short — this fills once
     on approach rather than being scrubbed across a long runway. */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'center 0.4'],
  })

  /* A light spring: a wheel notch arrives as one jump rather than a ramp, and
     without this the arc steps instead of sweeping. */
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  // 1 = empty, 0 = full. pathLength="1" normalises this against the circle.
  const dashOffset = useTransform(smooth, [0, 1], [1, 0])

  return (
    <div
      ref={containerRef}
      /* aspect-square is set up front so the box occupies its final height on
         first paint — the ring and image load into reserved space and nothing
         below them shifts. */
      className={`relative mx-auto aspect-square w-[300px] md:w-[380px] lg:w-[520px] ${className}`}
    >
      {/* Cream glow, behind everything, lifting the product off the section
          colour without painting an opaque panel over it. The 8-digit hex is
          the same colour at zero alpha, so the fade ends transparent rather
          than in white. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${glowColor} 0%, ${glowColor}00 72%)`,
        }}
      />

      {/* Decorative: the ring carries no information the copy does not. */}
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {/* 1 — TRACK. Always whole, whatever the scroll is doing. */}
        <circle
          cx="100"
          cy="100"
          r={R_RING}
          fill="none"
          stroke={trackColor}
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* 2 — PROGRESS. rotate(-90) starts the fill at 12 o'clock and sweeps
            clockwise. pathLength="1" normalises the dash maths, so "1 1" is
            exactly one circumference of dash followed by one of gap, and the
            offset runs 1 → 0 whatever R_RING happens to be.

            Under reduced motion this renders statically full (no dash at all):
            the ring is the point, the sweep is the decoration. */}
        {reduced ? (
          <circle
            cx="100"
            cy="100"
            r={R_RING}
            fill="none"
            stroke={progressColor}
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        ) : (
          <motion.circle
            cx="100"
            cy="100"
            r={R_RING}
            pathLength="1"
            fill="none"
            stroke={progressColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="1 1"
            transform="rotate(-90 100 100)"
            style={{ strokeDashoffset: dashOffset }}
          />
        )}

        {/* 3 — ACCENT. Static: a fixed 200deg run of hairline inside the main
            ring, with a dot pinning each end. */}
        <circle
          cx="100"
          cy="100"
          r={R_ACCENT}
          pathLength="1"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray={`${ACCENT_SWEEP} ${1 - ACCENT_SWEEP}`}
          transform={`rotate(${ACCENT_START_DEG} 100 100)`}
        />
        {ACCENT_DOTS.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="3" fill={accentColor} />
        ))}
      </svg>

      {/* The product. The only non-decorative element here, so the only one
          carrying alt text. ~45% of the box, centred, in front of the ring. */}
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 top-1/2 z-10 w-[45%] -translate-x-1/2 -translate-y-1/2 object-contain"
      />

      {/* Olive branch, crossing IN FRONT of the stroke at the lower right.
          Optional: with no branchSrc nothing renders, rather than a broken
          image box — the component ships without an asset to point at. */}
      {branchSrc && (
        <img
          src={branchSrc}
          alt={branchAlt}
          aria-hidden={branchAlt ? undefined : 'true'}
          className="pointer-events-none absolute bottom-[2%] right-[-4%] z-20 w-[42%] object-contain"
        />
      )}
    </div>
  )
}
