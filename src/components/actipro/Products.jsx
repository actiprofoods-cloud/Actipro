import SectionHeading from './SectionHeading'
import { ArrowRightIcon } from './icons'
import { PRODUCTS } from './productData'

export default function Products() {
  return (
    <section id="products" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Our range"
          title="Four oils, one refinery"
          subtitle="Refined, blended, cold pressed and kachi ghani — every one of them pressed, packed and lab-checked at our own FSSAI-licensed plants."
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="flex flex-col">
              <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-acti-cream p-4">
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  loading="lazy"
                  className="h-full w-auto object-contain"
                />
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-acti-orange">
                {product.format}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-acti-ink">
                {product.brand}
              </h3>
              <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-acti-ink/50">
                {product.name}
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-acti-ink/65">{product.blurb}</p>

              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-acti-ink/55">
                {product.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-acti-orange transition-all hover:gap-3"
              >
                Enquire
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-14 text-center text-sm text-acti-ink/50">
          Bulk and private-label packing available on request. Write to us for a rate card.
        </p>
      </div>
    </section>
  )
}
