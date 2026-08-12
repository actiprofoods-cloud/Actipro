import SectionHeading from './SectionHeading'
import { HeartIcon, FlameIcon, DropIcon, LeafIcon, SparkleIcon, ShieldIcon } from './icons'

const REASONS = [
  {
    Icon: HeartIcon,
    title: 'Light on the heart',
    body: 'Naturally low in saturated fat and free from cholesterol, so everyday food feels lighter after the meal.',
  },
  {
    Icon: SparkleIcon,
    title: 'Fortified with Vitamin A & D',
    body: 'Every batch is fortified to FSSAI’s +F standard, adding two vitamins most Indian diets fall short on.',
  },
  {
    Icon: FlameIcon,
    title: 'High smoke point',
    body: 'Holds up to deep frying, tadka and tawa cooking without breaking down or smelling burnt.',
  },
  {
    Icon: DropIcon,
    title: 'Absorbs less, stays crisp',
    body: 'A light, thin body means pooris and pakoras soak up less oil and stay crisp for longer.',
  },
  {
    Icon: LeafIcon,
    title: 'Neutral taste, 100% vegetarian',
    body: 'No overpowering aroma — your masalas lead the dish, not the oil. Made only from sunflower seed.',
  },
  {
    Icon: ShieldIcon,
    title: 'Tested at every stage',
    body: 'In-house lab checks on incoming seed, refined oil and finished packs before a single case leaves the plant.',
  },
]

export default function Why() {
  return (
    <section id="why" className="bg-acti-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Why Actipro"
          title="Six reasons it earns a place in your kitchen"
          subtitle="Sunflower oil is the lightest of the everyday cooking oils. Actipro refines it six times over so nothing but the good stuff reaches your kadhai."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl border border-acti-ink/8 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-acti-orange/30 hover:shadow-xl hover:shadow-acti-orange/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-acti-orange/10 text-acti-orange transition-colors group-hover:bg-acti-orange group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-acti-ink">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-acti-ink/65">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
