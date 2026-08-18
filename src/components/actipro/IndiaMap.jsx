/*
 * A simplified outline of India, drawn as a single path, with a pin per
 * distributor cluster.
 *
 * Deliberately NOT a real geographic projection and not a mapping library:
 * this is a decorative "where we reach" graphic in a contact card, so the
 * whole thing is ~1 KB of inline SVG instead of a tiles/GeoJSON dependency
 * plus a network request. If real, pannable geography is ever needed here,
 * this component is the only thing that has to be replaced.
 *
 * The outline traces the recognisable silhouette — Kutch and Gujarat on the
 * west, the Deccan tapering to Kanyakumari, the east coast up through Bengal,
 * and the Himalayan arc across the top. viewBox is 0 0 100 116, so the pin
 * coordinates below are read as percentages of that box and can be nudged by
 * eye without recomputing anything.
 *
 * PINS are the states Actipro currently ships to. Names carry into the
 * <title> of each pin, so a screen reader gets the list rather than 9
 * anonymous shapes — and the map itself is role="img" with one label.
 */
const PINS = [
  { name: 'Punjab', x: 33, y: 22 },
  { name: 'Delhi NCR', x: 38, y: 30 },
  { name: 'Rajasthan', x: 27, y: 38 },
  { name: 'Uttar Pradesh', x: 47, y: 36 },
  { name: 'Gujarat', x: 22, y: 51 },
  { name: 'Madhya Pradesh', x: 40, y: 47 },
  { name: 'Maharashtra', x: 31, y: 61 },
  { name: 'Telangana', x: 41, y: 68 },
  { name: 'Karnataka', x: 33, y: 78 },
]

/* Indore — the head office, and the reason the map is here at all. Drawn
   larger and in the brand red so it reads as the origin the others radiate
   from, rather than as a tenth equal pin. */
const HOME = { name: 'Indore (head office)', x: 33, y: 50 }

const OUTLINE =
  'M34 8 C39 6 44 7 48 9 C52 11 56 10 60 9 C64 8 68 10 70 13 ' +
  'C73 17 78 18 82 17 C86 16 89 18 88 22 C87 26 83 27 80 30 ' +
  'C77 33 76 37 73 40 C70 43 68 47 69 51 C70 56 73 60 74 65 ' +
  'C75 70 73 75 70 79 C67 84 62 87 58 91 C54 95 51 100 48 105 ' +
  'C46 109 44 113 41 112 C38 111 38 106 37 102 C36 97 33 93 30 89 ' +
  'C27 85 24 81 22 76 C20 71 18 66 16 61 C14 57 11 54 10 50 ' +
  'C9 46 12 43 16 42 C20 41 24 42 27 40 C30 38 30 34 28 31 ' +
  'C26 28 22 26 21 22 C20 18 24 16 28 15 C31 14 32 10 34 8 Z'

export default function IndiaMap({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 116"
      role="img"
      aria-label="Map of India showing Actipro distributor presence across nine states"
      focusable="false"
    >
      {/* The landmass. Filled pale so the pins carry the contrast, with a
          slightly darker hairline so the coast still reads on the cream card. */}
      <path
        d={OUTLINE}
        fill="rgba(245, 179, 1, 0.13)"
        stroke="rgba(193, 18, 31, 0.28)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

      {PINS.map(({ name, x, y }) => (
        <g key={name} transform={`translate(${x} ${y})`}>
          <title>{name}</title>
          {/* Teardrop: a circle's worth of head over a point, drawn as one
              path so the pin scales as a unit with the map. */}
          <path
            d="M0 0 C-3.1 -3.4 -4.6 -5.6 -4.6 -8 A4.6 4.6 0 0 1 4.6 -8 C4.6 -5.6 3.1 -3.4 0 0 Z"
            fill="var(--color-acti-red)"
          />
          <circle cy="-8" r="1.8" fill="#fff8ee" />
        </g>
      ))}

      <g transform={`translate(${HOME.x} ${HOME.y})`}>
        <title>{HOME.name}</title>
        <path
          d="M0 0 C-4 -4.4 -6 -7.2 -6 -10.3 A6 6 0 0 1 6 -10.3 C6 -7.2 4 -4.4 0 0 Z"
          fill="var(--color-acti-orange)"
          stroke="#fff8ee"
          strokeWidth="1"
        />
        <circle cy="-10.3" r="2.3" fill="#fff8ee" />
      </g>
    </svg>
  )
}
