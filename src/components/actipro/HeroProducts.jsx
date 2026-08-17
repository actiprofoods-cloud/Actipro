import { useEffect, useState } from 'react'
import { PRODUCTS } from './productData'

const ROTATE_MS = 4500

export default function HeroProducts() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % PRODUCTS.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, active])

  const product = PRODUCTS[active]

  return (
    <div
      className="sm:text-right"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-[12px] font-semibold uppercase sm:text-[11px] tracking-[0.24em] text-white/50 max-sm:text-[10px] max-sm:tracking-[0.16em]">
        From our range
      </p>

      <div key={product.id} className="acti-fade-up">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="mt-4 h-52 w-auto rounded-xl object-contain drop-shadow-2xl sm:ml-auto sm:h-72"
        />

        <p className="mt-5 font-serif text-2xl leading-tight text-white sm:text-3xl max-sm:mt-3 max-sm:text-xl">
          {product.brand}
        </p>
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-acti-sun max-sm:text-[10px] max-sm:leading-[1.45] max-sm:tracking-[0.1em]">
          {product.name}
        </p>
        <p className="mt-1.5 text-sm text-white/60 max-sm:text-[12px] max-sm:leading-snug">
          {product.tagline}
        </p>
      </div>

      {/* On a phone the dots sit directly under the pack, centred in their own
          column — kept as tappable controls rather than hidden, since the
          auto-rotate alone gives no way to return to a pack you just missed.
          The 44px hit-box comes from .acti-dot (see the pointer:coarse block),
          and that tall box is why they need to clear the distributor link on
          the left: the boxes do not overlap, but sharing a baseline with it
          reads as one muddled row. */}
      <div className="mt-5 flex gap-1 sm:gap-2 sm:justify-end max-sm:-mt-1 max-sm:justify-center">
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
