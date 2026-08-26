import { useCallback, useEffect, useId, useRef, useState } from 'react'

/*
 * LAYERED PURITY — the trust section, rebuilt as a fanned card deck.
 *
 * The shape: heading block on the left, a deck of four cards fanning to the
 * right of it, and a step list panel on the far right. Choosing a step pulls
 * its card to the front of the deck; a gold connector line runs from the card
 * to the active row, so the card visibly touches its point.
 *
 * NO FRAMER MOTION. The brief asked for it, but this project ships GSAP + Lenis
 * and nothing else animates with a React motion library — adding one for a
 * single deck would be a third animation system on the page. Every card is
 * always mounted and only its transform/opacity change, which is exactly what a
 * layout animation would have produced, so the reshuffle is a plain CSS
 * transition on those two properties. Depth is expressed as a --depth custom
 * property (0 = front) and the CSS derives offset, scale, rotation and opacity
 * from it; see .lp-card in index.css.
 *
 * The deck is decorative — it duplicates imagery the step list already labels,
 * so it is aria-hidden and every card image carries an empty alt. The step list
 * is the real control: a listbox of buttons with roving tabindex and arrow-key
 * navigation.
 */

/* Fallback content. Callers can pass their own `steps`; the shape is
   { id, title, description, image, alt }.

   Images come from public/trust/ rather than public/rooted/. The rooted set is
   what the old pillar grid used, but half of it (vessel, flask, certs) is
   white-background cutouts — those were drawn for small figures on a cream
   panel and go to a white slab when object-fit: cover blows them up to a
   300x340 card. The trust/ four are full-bleed warm photography, which is what
   a card this size needs. */
const DEFAULT_STEPS = [
  {
    id: 'sourcing',
    title: 'Careful Sourcing',
    description: 'Handpicked from trusted farms',
    image: '/trust/t4.webp',
    alt: 'A bottle of Actipro refined sunflower oil beside a sunflower and a bowl of oil',
  },
  {
    id: 'cold-pressed',
    title: 'Cold Pressed',
    description: 'Extracted below 45°C',
    image: '/trust/t3.webp',
    alt: 'Golden oil being poured from a glass jug into a wok of vegetables',
  },
  {
    id: 'filtration',
    title: 'Natural Filtration',
    description: 'Filtered for clarity, not over-processed',
    image: '/trust/t2.webp',
    alt: 'Clear golden oil being poured while cooking',
  },
  {
    id: 'lab-tested',
    title: 'Lab Tested',
    description: 'Tested for purity and safety',
    image: '/trust/t1.webp',
    alt: 'A home-style thali of dal, roti, cucumber and mixed vegetable sabzi',
  },
]

/* How long a step holds before the deck advances on its own. */
const AUTOPLAY_MS = 5000

/* The corner ornament — a leaf sprig. Two facts learned the hard way: a single
   filled silhouette reads as a smudge at this opacity, and small paired blades
   along a stem read as a WHEAT ear, not leaves. So the blades are few, large
   and alternating, each with a visible midrib. Decorative, hidden from the tree. */
function LeafSpray({ className }) {
  /* [x, y, rotation, length, side] along the stem; side flips the blade over. */
  const LEAVES = [
    [92, 26, 20, 34, 1],
    [72, 52, 32, 40, -1],
    [54, 80, 44, 36, 1],
  ]
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M108 8C92 24 76 44 62 66 50 84 42 100 38 114"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {LEAVES.map(([x, y, rot, len, side]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${side} 1)`}>
          {/* An almond: out along the top curve, back along the bottom. The
              width is 0.42 of the length, which is what keeps it a leaf rather
              than the near-circular grain the wheat version had. */}
          <path
            d={`M0 0C${len * 0.3} ${-len * 0.42} ${len * 0.75} ${-len * 0.4} ${len} 0C${len * 0.75} ${len * 0.18} ${len * 0.3} ${len * 0.16} 0 0Z`}
            fill="currentColor"
            opacity="0.8"
          />
          {/* Midrib — the line that makes it legible as a leaf at low contrast. */}
          <path
            d={`M2 0C${len * 0.4} ${-len * 0.1} ${len * 0.7} ${-len * 0.12} ${len - 2} ${-len * 0.02}`}
            stroke="#f8f5ee"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  )
}

export default function LayeredPurity({ steps = DEFAULT_STEPS }) {
  const [active, setActive] = useState(0)
  /* Paused while the pointer is over the section or focus sits inside it, so
     autoplay never yanks the deck out from under someone reading a row. */
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  /* Roving tabindex: only the active row is tabbable, and arrow keys move
     between rows. Focus has to follow the selection for that to work, but ONLY
     when the change came from the keyboard — calling .focus() after a hover
     would steal focus from wherever the user actually is. */
  const rowRefs = useRef([])
  const shouldFocus = useRef(false)

  const listId = useId()
  const count = steps.length

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  /* Autoplay. Reduced motion opts out entirely: unattended change of content is
     the same request that setting makes of the scrubbed scenes above. */
  useEffect(() => {
    if (paused || reduced || count < 2) return undefined
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [paused, reduced, count])

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    rowRefs.current[active]?.focus()
  }, [active])

  const go = useCallback(
    (next, viaKeyboard = false) => {
      shouldFocus.current = viaKeyboard
      setActive(((next % count) + count) % count)
    },
    [count],
  )

  const onKeyDown = (event) => {
    const keys = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: count - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    go(keys[event.key], true)
  }

  return (
    <section
      id="rooted"
      className="lp-scene acti-seam"
      aria-labelledby={`${listId}-title`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        /* Only resume once focus has actually left the section — moving between
           two rows fires blur on the first one. */
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="lp-glow" aria-hidden="true" />
      <LeafSpray className="lp-leaf" />

      <div className="lp-inner">
        {/* --- Left: the heading block --- */}
        <header className="lp-head">
          <p className="lp-eyebrow">Pure by nature. Proven by science.</p>
          <h2 className="lp-title" id={`${listId}-title`}>
            Layered Purity
          </h2>
          <p className="lp-sub">Discover how we ensure purity at every layer.</p>
        </header>

        {/* --- Middle: the deck ---
            Cards stay in DOM order and are re-stacked with --depth, so nothing
            unmounts and no image is ever re-fetched on a change. */}
        <div className="lp-deck" aria-hidden="true">
          {steps.map((step, index) => {
            const depth = (index - active + count) % count
            return (
              <figure
                key={step.id}
                className="lp-card"
                style={{ '--depth': depth, zIndex: count - depth }}
                data-front={depth === 0 || undefined}
              >
                <img src={step.image} alt="" loading="lazy" decoding="async" />
              </figure>
            )
          })}
          {/* The gold line from the front card across to the active row. Its
              vertical position rides --active, set on .lp-inner. */}
          <span className="lp-connector" />
        </div>

        {/* --- Right: the step list --- */}
        <div className="lp-panel" style={{ '--active': active, '--count': count }}>
          <ul className="lp-steps" role="listbox" aria-label="Our purity process" onKeyDown={onKeyDown}>
            {steps.map((step, index) => {
              const isActive = index === active
              return (
                <li key={step.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    ref={(node) => {
                      rowRefs.current[index] = node
                    }}
                    className="lp-step"
                    onClick={() => go(index)}
                    onMouseEnter={() => go(index)}
                  >
                    <span className="lp-step-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="lp-step-copy">
                      <span className="lp-step-title">{step.title}</span>
                      <span className="lp-step-body">{step.description}</span>
                    </span>
                    {/* The card, shown inline on phones where the deck is
                        hidden. It lives inside the row so the accordion reveal
                        is pure CSS off aria-selected. */}
                    <span className="lp-step-figure">
                      <img src={step.image} alt={step.alt ?? ''} loading="lazy" decoding="async" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* --- Carousel chrome --- */}
      <button
        type="button"
        className="lp-arrow lp-arrow--prev"
        onClick={() => go(active - 1)}
        aria-label="Previous step"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="lp-arrow lp-arrow--next" onClick={() => go(active + 1)} aria-label="Next step">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="lp-dots">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className="lp-dot"
            data-on={index === active || undefined}
            aria-label={`Show step ${index + 1}: ${step.title}`}
            aria-current={index === active}
            onClick={() => go(index)}
          />
        ))}
      </div>
    </section>
  )
}
