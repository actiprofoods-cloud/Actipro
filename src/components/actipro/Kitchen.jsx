import SectionHeading from './SectionHeading'
import { PlayIcon } from './icons'

const USES = [
  { title: 'Deep frying', body: 'Pooris, samosas, pakoras and fries — high smoke point, less absorption, reusable within safe limits.' },
  { title: 'Everyday sabzi & dal', body: 'Neutral flavour lets the tadka and masala come through instead of the oil.' },
  { title: 'Tawa & shallow fry', body: 'Parathas, cutlets and dosas brown evenly without turning heavy or sticky.' },
  { title: 'Baking & batters', body: 'A clean, colourless oil that works in cakes, muffins and pancake batters as a butter substitute.' },
  { title: 'Salads & dressings', body: 'Light body and no aftertaste — good base for a simple lemon-and-herb dressing.' },
]

export default function Kitchen() {
  return (
    <section id="kitchen" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl">
          <video
            className="aspect-4/3 w-full object-cover"
            src="/video/Chef_cooking_vegetarian_meal_202608071753.mp4"
            poster="/logo/acti-pro-logo.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-label="Chef cooking a vegetarian meal with Actipro sunflower oil"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
          <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-acti-orange">
              <PlayIcon className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold">Actipro in a working kitchen</p>
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="In the kitchen"
            title="One bottle that handles the whole menu"
            subtitle="Sunflower oil is the closest thing to an all-purpose oil in an Indian kitchen. Here is where Actipro pulls its weight."
          />

          <ul className="mt-9 divide-y divide-acti-ink/8">
            {USES.map((use) => (
              <li key={use.title} className="py-5">
                <h3 className="text-base font-semibold text-acti-ink">{use.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-acti-ink/65">{use.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
