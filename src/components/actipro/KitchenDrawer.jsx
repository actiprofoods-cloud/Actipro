import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import { PRODUCTS } from './productData'

export default function KitchenDrawer() {
  const sceneRef = useRef(null)
  const [open, setOpen] = useState(false)

  // The drawer opens by itself once the scene is properly in view.
  useEffect(() => {
    const node = sceneRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOpen(true)
      },
      { threshold: 0.45 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="range" className="bg-acti-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Our range"
          title="Open the drawer"
          subtitle="Four oils from one refinery — refined sunflower, a soyabean and rice bran blend, cold pressed groundnut and kachi ghani mustard."
        />

        <div
          ref={sceneRef}
          data-open={open}
          className="kd-scene mt-14 shadow-2xl shadow-acti-ink/20"
        >
          <div className="kd-uppers">
            <div className="kd-door" />
            <div className="kd-door kd-door-wide" />
            <div className="kd-door" />
            <div className="kd-door kd-door-wide" />
          </div>

          <div className="kd-backsplash" />
          <div className="kd-glow" />
          <div className="kd-counter" />

          <div className="kd-run">
            <div className="kd-cab kd-cab-left kd-wood" />

            <div className="kd-bay">
              <div className="kd-interior">
                <div className="kd-back" />
                <div className="kd-side kd-side-l" />
                <div className="kd-side kd-side-r" />
                <div className="kd-floor" />
                <div className="kd-cavity-shade" />
              </div>

              <div className="kd-items">
                {PRODUCTS.map((product) => (
                  <a
                    key={product.id}
                    href="#products"
                    className="kd-item"
                    aria-label={`${product.brand} — ${product.name}`}
                  >
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.name}`}
                      loading="lazy"
                    />
                    {/* Card rides above the pack and only shows on hover / keyboard focus */}
                    <span className="kd-label" aria-hidden="true">
                      <span className="kd-label-brand">{product.brand}</span>
                      <span className="kd-label-name">{product.name}</span>
                      <span className="kd-label-meta">
                        {product.tagline} · {product.format}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close the drawer' : 'Open the drawer'}
                aria-expanded={open}
                className="kd-front kd-wood"
              >
                <span className="kd-handle" />
                <span className="kd-seam" />
              </button>
            </div>

            <div className="kd-cab kd-cab-right kd-wood" />
          </div>

          <div className="kd-plinth" />
        </div>

        <p className="mt-6 text-center text-sm text-acti-ink/50">
          Tap the drawer to open or close it.
        </p>
      </div>
    </section>
  )
}
