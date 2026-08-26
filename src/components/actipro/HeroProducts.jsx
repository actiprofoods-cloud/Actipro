import { useCallback, useEffect, useRef, useState } from 'react'
import { PRODUCTS } from './productData'

const ROTATE_MS = 4500

export default function HeroProducts() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const stageRef = useRef(null)

  /*
   * The parallax tilt.
   *
   * The pointer position is written straight to the node as two custom
   * properties (--bx/--by, both -1..1) and every visual — the rotation, the
   * shadow offset, the travel of the gloss — is derived from them in CSS. No
   * React state, so moving the mouse over the hero costs zero renders while a
   * video is playing behind it.
   *
   * Pointer events rather than mouse events so a stylus behaves; coarse
   * pointers are ignored (see the `pointerType` guard) because a touch would
   * otherwise leave the bottle stuck at whatever angle the tap landed on.
   */
  const tilt = useCallback((event) => {
    const node = stageRef.current
    if (!node || event.pointerType === 'touch') return
    const rect = node.getBoundingClientRect()
    const bx = (event.clientX - rect.left) / rect.width - 0.5
    const by = (event.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty('--bx', (bx * 2).toFixed(3))
    node.style.setProperty('--by', (by * 2).toFixed(3))
  }, [])

  const untilt = useCallback(() => {
    const node = stageRef.current
    if (!node) return
    node.style.setProperty('--bx', '0')
    node.style.setProperty('--by', '0')
  }, [])

  useEffect(() => {
    if (paused) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % PRODUCTS.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, active])

  const product = PRODUCTS[active]

  return (
    <div
      className="max-sm:text-right sm:text-right"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="hero-eyebrow text-white/60">From our range</p>

      <div key={product.id} className="acti-fade-up">
        {/* The pack is a transparent WebP, so it gets the full 3D treatment —
            contact shadow, specular sweep, tilt — rather than the flat
            drop-shadow the old white-background JPEGs had to make do with.
            See the .hero-bottle block in index.css.

            --bottle-mask carries the same file as the gloss layer's mask, so
            the highlight is clipped to the bottle's own silhouette. */}
        <div
          ref={stageRef}
          onPointerMove={tilt}
          onPointerLeave={untilt}
          // w-fit, not w-auto: the stage is a block, so `auto` let it span the
          // whole column and the aspect-ratio'd child then scaled to THAT
          // width rather than to the height cap. Shrink-to-fit keeps the box
          // exactly as wide as the bottle it contains.
          className="hero-bottle mt-4 h-52 w-fit sm:ml-auto sm:h-72 max-sm:mt-1 max-sm:ml-auto max-sm:h-32"
          style={{ '--bottle-mask': `url(${product.image})` }}
        >
          <div className="hero-bottle-inner flex h-full items-end justify-center">
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="h-full w-auto max-w-full object-contain"
            />
            <span className="hero-bottle-gloss" aria-hidden="true" />
          </div>
          <span className="hero-bottle-ground" aria-hidden="true" />
        </div>

        {/* The phone step-downs are gentler than they were: this block used to
            live in a 43% column beside the copy, and now has the bottom-right
            corner to itself. */}
        <p className="hero-lede mt-5 text-white max-sm:mt-1">{product.brand}</p>
        <p /* The name is the one line that wraps: "Cold Pressed Groundnut Oil"
             takes two lines where the others take one, so without a reserved
             height the whole card grew 14px on that product and the pack, the
             tagline and the dashes all jumped — on an automatic rotation. Two
             lines' worth is reserved for every product instead. */
          className="hero-eyebrow mt-1 text-acti-sun max-sm:mt-0 max-sm:min-h-[22px]">
          {product.name}
        </p>
        <p className="hero-body mt-1.5 text-white/60 max-sm:mt-0">{product.tagline}</p>
      </div>

      {/* Kept as tappable controls rather than hidden on phone, since the
          auto-rotate alone gives no way to return to a pack you just missed.
          The 44px hit-box comes from .acti-dot (see the pointer:coarse block).
          They follow the pack to the right gutter — .hero-showcase does that,
          since the row is no longer sharing a baseline with anything. */}
      {/* gap-0 on phone: the tap padding inside .acti-dot already separates
          the rules, and a flex gap on top of it read as a wide space. */}
      <div className="mt-5 flex gap-0 sm:gap-2 sm:justify-end max-sm:mt-0.5 max-sm:justify-end">
        {PRODUCTS.map((p, i) => (
          /* The visible indicator is a 2px rule, which is far too thin to tap.
             The button is a real flex hit-box (44px tall on touch, see
             .acti-dot) with the rule centred inside it — a pseudo-element hit
             area would have had to overlap its neighbours to reach 44px. */
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${p.brand} ${p.name}`}
            aria-current={i === active}
            className="acti-dot group flex items-center justify-center"
          >
            <span
              className={`block h-0.5 transition-all duration-500 ${
                i === active ? 'w-10 bg-acti-sun' : 'w-5 bg-white/35 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
