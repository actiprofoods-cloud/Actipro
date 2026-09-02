import { useEffect, useState } from 'react'

/*
 * INDIA MAP — the "Our Presence" panel on /contact.
 *
 * Real state geometry, from public/contact/india.svg. That file is a cleaned
 * copy of the Simplemaps outline the client supplied (public/contact/in.svg):
 * 36 <path> elements, one per state and union territory, each keyed by its ISO
 * code with the state name on data-name.
 *
 * ── WHY IT IS FETCHED RATHER THAN INLINED ───────────────────────────────────
 * The path data is ~199 KB (48 KB gzipped). Inlining it would put all of that
 * in the JS bundle, downloaded by every visitor to every page. Fetched, it is
 * one cached request that only /contact ever makes, and the panel renders its
 * frame immediately while the geometry arrives.
 *
 * It is injected with dangerouslySetInnerHTML, which is safe here for a
 * specific reason: the file is a build-time asset in our own public/ directory,
 * not user input or a third-party URL. Do NOT point `src` at anything a visitor
 * can influence.
 *
 * ── PRECISION ───────────────────────────────────────────────────────────────
 * Coordinates are kept to ONE decimal. The paths use relative `l` commands with
 * sub-unit deltas (-0.3 -0.5 and the like), so rounding to whole numbers
 * collapses most segments to "0 0" and destroys the outline — that was tried
 * and it flattened every state. One decimal halves nothing but is the floor.
 *
 * ── SERVED STATES ───────────────────────────────────────────────────────────
 * SERVED lists the states Actipro currently ships to, by the same ISO code the
 * SVG uses. They are filled in the brand red and carry a pin; everything else
 * is drawn as pale, unhighlighted land. Centroids are computed from the real
 * path geometry (walked, not guessed), so a pin sits on its own state.
 *
 * These are STATES, not verified distributor addresses — the panel's copy says
 * so. When a real distributor list arrives, extend the SERVED entries with
 * whatever the tooltip should show; onSelect already hands the whole object out.
 */

const SERVED = [
  { id: 'INMP', name: 'Madhya Pradesh', x: 376.3, y: 460.8, home: true },
  { id: 'INPB', name: 'Punjab', x: 303.1, y: 250.2 },
  { id: 'INDL', name: 'Delhi', x: 344.5, y: 320.6 },
  { id: 'INRJ', name: 'Rajasthan', x: 288.5, y: 403.0 },
  { id: 'INUP', name: 'Uttar Pradesh', x: 428.2, y: 385.8 },
  { id: 'INGJ', name: 'Gujarat', x: 187.7, y: 506.6 },
  { id: 'INMH', name: 'Maharashtra', x: 323.5, y: 600.0 },
  { id: 'INTG', name: 'Telangana', x: 398.5, y: 644.2 },
  { id: 'INKA', name: 'Karnataka', x: 327.5, y: 726.9 },
]

const SERVED_IDS = SERVED.map((s) => s.id).join(',')

export default function IndiaMap({ className, active, onSelect, src = '/contact/india.svg' }) {
  const [markup, setMarkup] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        if (cancelled) return
        // Keep only what is inside <svg>…</svg>: this component supplies its
        // own <svg> wrapper so it controls the viewBox and can layer the pins
        // over the land in one coordinate space.
        const inner = text.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '')
        setMarkup(inner)
      })
      .catch(() => {
        // A failed fetch leaves the pins and the frame — the panel degrades to
        // a pin diagram rather than an empty box.
        if (!cancelled) setMarkup('')
      })
    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <svg
      className={className}
      /* Cropped to the landmass, not the file's 0 0 1000 1000 frame. India
         occupies x 100..900, y 46..954 of that square, so a tenth of the width
         was empty margin on each side — this renders the map ~25% larger in
         the same column. A small pad keeps the coast off the edge. Pin extents
         (x 167..449, y 206..727) sit well inside it. */
      viewBox="90 36 820 928"
      role="img"
      aria-label="Map of India showing the states Actipro currently ships to"
      focusable="false"
    >
      {/* The land. `im-land` styles every state pale; `im-served` (a CSS
          :is() list of the ISO ids) tints the ones we reach. */}
      {markup ? <g className="im-land" dangerouslySetInnerHTML={{ __html: markup }} /> : null}

      {SERVED.map((s) => (
        <g
          key={s.id}
          className="im-pin"
          data-on={active === s.name}
          data-home={s.home ? 'true' : undefined}
          onClick={() => onSelect?.(s)}
          role={onSelect ? 'button' : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onKeyDown={(e) => {
            if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onSelect(s)
            }
          }}
        >
          <title>{s.name}</title>
          {/* Drawn from the pin's POINT, so x/y is the location on the state
              rather than the centre of the teardrop. */}
          <path
            d={`M${s.x} ${s.y} c-14 -17 -21 -27 -21 -37 a21 21 0 0 1 42 0 c0 10 -7 20 -21 37 z`}
          />
          <circle cx={s.x} cy={s.y - 37} r="7.5" className="im-pin-dot" />
        </g>
      ))}
    </svg>
  )
}

export { SERVED, SERVED_IDS }
