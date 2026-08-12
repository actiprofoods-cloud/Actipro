import SectionHeading from './SectionHeading'

const STEPS = [
  {
    n: '01',
    title: 'Seed sourcing',
    body: 'Sunflower seed is bought from graded lots and checked for moisture, oil content and foreign matter before it is unloaded.',
  },
  {
    n: '02',
    title: 'Cleaning & crushing',
    body: 'Seeds are de-stoned, cleaned and crushed. The crude oil is separated and the cake goes out as cattle feed — nothing is wasted.',
  },
  {
    n: '03',
    title: 'Neutralising & bleaching',
    body: 'Free fatty acids are removed and the oil is passed through bleaching earth to strip colour pigments and trace metals.',
  },
  {
    n: '04',
    title: 'Winterising',
    body: 'The oil is chilled so waxes crystallise out. This is what keeps Actipro clear in the bottle even on a cold morning.',
  },
  {
    n: '05',
    title: 'Deodorising & fortifying',
    body: 'Steam deodorising under vacuum gives the oil its neutral smell, then Vitamin A and D are dosed in line.',
  },
  {
    n: '06',
    title: 'Filling & sealing',
    body: 'Filled, nitrogen-flushed and sealed the same day it is refined, with a batch number and lab report against every lot.',
  },
]

export default function Process() {
  return (
    <section id="process" className="bg-acti-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="How it’s made"
          title="From seed to seal in six controlled stages"
          subtitle="Every stage runs inside our own FSSAI-licensed refineries at Dhannad, Mandsaur and Nashik — no third-party job work."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm"
            >
              <span className="absolute -right-2 -top-4 text-[5rem] font-bold leading-none text-acti-orange/8">
                {step.n}
              </span>
              <span className="relative text-sm font-bold tracking-[0.2em] text-acti-orange">
                {step.n}
              </span>
              <h3 className="relative mt-4 text-lg font-semibold text-acti-ink">{step.title}</h3>
              <p className="relative mt-3 text-[15px] leading-relaxed text-acti-ink/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
