/*
 * NAV LABEL — the per-letter hover on the header's three tabs.
 *
 * On hover each letter is replaced by a copy of itself dropping in from above,
 * staggered LEFT TO RIGHT so the word resolves across rather than all at once.
 *
 * ── HOW IT WORKS ────────────────────────────────────────────────────────────
 * Two full copies of the label are stacked in one clipped box, one letter-span
 * per character:
 *
 *   the resting copy   sits at y=0 and slides DOWN and out on hover
 *   the incoming copy  waits ABOVE the box and slides down into y=0
 *
 * Both moves run on the same per-letter delay, so a letter leaves exactly as
 * its replacement arrives and the two read as one movement. `overflow: hidden`
 * on the letter box is what makes them appear from nowhere rather than
 * floating above the bar.
 *
 * The stagger is set per letter as --i on the span, and the CSS multiplies it
 * by a fixed step (see .nl-letter in index.css). Index, not a random value, so
 * the sweep is strictly left to right.
 *
 * ── WHY THE SPACES ARE HANDLED SEPARATELY ───────────────────────────────────
 * A space inside an inline-block collapses, so "ABOUT US" would render as
 * "ABOUTUS". Spaces are emitted as a span carrying a non-breaking space and no
 * animation — they still occupy their width but nothing moves in them.
 *
 * ── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * The split text is aria-hidden and the real label is supplied once, visually
 * hidden, so a screen reader reads "Products" rather than "P r o d u c t s".
 * Reduced motion drops the whole effect back to the plain opacity fade the
 * links used to have (see the media query in index.css).
 */
export default function NavLabel({ text }) {
  const chars = [...text]

  return (
    <span className="nl">
      {/* Read by assistive tech; the animated copies below are decorative. */}
      <span className="sr-only">{text}</span>

      <span className="nl-stack" aria-hidden="true">
        {chars.map((ch, i) =>
          ch === ' ' ? (
            <span key={`s-${i}`} className="nl-space">
              &nbsp;
            </span>
          ) : (
            <span key={`${ch}-${i}`} className="nl-letter" style={{ '--i': i }}>
              <span className="nl-out">{ch}</span>
              <span className="nl-in">{ch}</span>
            </span>
          ),
        )}
      </span>
    </span>
  )
}
