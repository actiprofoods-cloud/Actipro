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
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
        From our range
      </p>

      <div key={product.id} className="acti-fade-up">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="mt-4 h-52 w-auto rounded-xl object-contain drop-shadow-2xl sm:ml-auto sm:h-72"
        />

        <p className="mt-5 font-serif text-2xl leading-tight text-white sm:text-3xl">
          {product.brand}
        </p>
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-acti-sun">
          {product.name}
        </p>
        <p className="mt-1.5 text-sm text-white/60">{product.tagline}</p>
      </div>

      <div className="mt-5 flex gap-2 sm:justify-end">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${p.brand} ${p.name}`}
            aria-current={i === active}
            className={`h-0.5 transition-all duration-500 ${
              i === active ? 'w-10 bg-acti-sun' : 'w-5 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
