import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from './productData'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

const ROTATE_MS = 4500

// How many packs the strip shows at once. The window slides through all of
// PRODUCTS rather than showing a fixed subset, so the fourth pack is reachable.
const WINDOW = 3

export default function ProductShowcase() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (paused || reduced) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % PRODUCTS.length), ROTATE_MS)
    return () => clearInterval(id)
    // No `active` here: the updater is functional, so the interval never reads a
    // stale index — listing it would rebuild the timer on every rotation and
    // reset the countdown.
  }, [paused, reduced])

  // One-time entrance. A class toggle rather than a GSAP scrub: nothing here is
  // driven by scroll position, it just needs to arrive once.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    if (reduced) {
      section.dataset.in = 'true'
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        section.dataset.in = 'true'
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [reduced])

  const product = PRODUCTS[active]
  const step = (delta) =>
    setActive((i) => (i + delta + PRODUCTS.length) % PRODUCTS.length)

  return (
    <section
      id="range"
      ref={sectionRef}
      className="ps-scene acti-seam"
      data-in="false"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="acti-shell acti-shell--wide ps-inner">
        {/* Left: the name at the top, the description at the foot, the pack
            strip under it — the copy column carries everything but the photo. */}
        <div className="ps-copy">
          <p className="ps-eyebrow">Our range</p>

          <div key={`head-${product.id}`} className="acti-fade-up">
            <h2 className="ps-title">{product.brand}</h2>
            <p className="ps-name">{product.name}</p>
          </div>

          <div key={`body-${product.id}`} className="acti-fade-up ps-body">
            <p className="ps-blurb">{product.blurb}</p>
            <ul className="ps-points">
              {product.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="ps-strip">
            <ul className="ps-thumbs">
              {Array.from({ length: WINDOW }, (_, offset) => {
                const index = (active + offset) % PRODUCTS.length
                const pack = PRODUCTS[index]
                return (
                  <li key={pack.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show ${pack.brand} ${pack.name}`}
                      aria-current={offset === 0}
                      className="ps-thumb"
                      data-active={offset === 0}
                    >
                      <img src={pack.image} alt="" loading="lazy" decoding="async" />
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="ps-nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous product">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next product">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: the pack itself, as large as the column allows. */}
        <div className="ps-stage">
          <img
            key={product.id}
            className="acti-fade-up ps-pack"
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
