import SectionHeading from './SectionHeading'

const ROWS = [
  { label: 'Energy', value: '900 kcal' },
  { label: 'Total fat', value: '100 g' },
  { label: 'Saturated fat', value: '11 g' },
  { label: 'Monounsaturated fat (MUFA)', value: '24 g' },
  { label: 'Polyunsaturated fat (PUFA)', value: '63 g' },
  { label: 'Trans fat', value: '< 0.2 g' },
  { label: 'Cholesterol', value: '0 mg' },
  { label: 'Vitamin A (added)', value: '6 – 9.9 mcg RE / g' },
  { label: 'Vitamin D (added)', value: '0.11 – 0.16 mcg / g' },
]

const HIGHLIGHTS = [
  { value: '0 mg', label: 'Cholesterol per 100 g' },
  { value: '63 g', label: 'PUFA — the good fat' },
  { value: '232 °C', label: 'Typical smoke point' },
  { value: 'A + D', label: 'Fortified vitamins' },
]

export default function Nutrition() {
  return (
    <section id="nutrition" className="bg-acti-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              tone="light"
              eyebrow="Nutrition"
              title="What is actually inside the bottle"
              subtitle="Sunflower oil is naturally high in polyunsaturated fat and Vitamin E. Actipro adds Vitamin A and D on top, at the levels FSSAI prescribes for fortified edible oil."
            />

            <div className="mt-10 grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-white/5 p-6">
                  <p className="text-3xl font-bold text-acti-sun">{item.value}</p>
                  <p className="mt-2 text-sm text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-acti-ink sm:p-8">
            <div className="flex items-baseline justify-between border-b-2 border-acti-ink pb-3">
              <h3 className="text-xl font-bold">Nutrition Information</h3>
              <span className="text-sm font-medium text-acti-ink/60">per 100 g</span>
            </div>
            <dl>
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-acti-ink/10 py-3.5"
                >
                  <dt className="text-[15px] text-acti-ink/75">{row.label}</dt>
                  <dd className="text-[15px] font-semibold">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-acti-ink/45">
              Indicative values for refined sunflower oil. Actual figures printed on each pack are
              taken from the batch analysis report of that lot.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
