import { useState } from 'react'
import SectionHeading from './SectionHeading'
import { ChevronDownIcon } from './icons'

const FAQS = [
  {
    q: 'Is Actipro good for deep frying?',
    a: 'Yes. Refined sunflower oil has a smoke point of roughly 225–232 °C, comfortably above normal deep-frying temperature. Filter the oil after each use and do not reuse it more than two or three times, or once it darkens and starts to smell.',
  },
  {
    q: 'What does “fortified with Vitamin A & D” mean?',
    a: 'Vitamin A and Vitamin D are dosed into the refined oil at the levels FSSAI prescribes for fortified edible oil, and the pack carries the blue +F mark. It is a way of adding two vitamins most Indian diets fall short on, without changing the taste of the oil.',
  },
  {
    q: 'Does the oil freeze or turn cloudy in winter?',
    a: 'It should not. Actipro is winterised — the oil is chilled during refining so natural waxes crystallise out and are filtered off. Slight haze in very cold weather clears on its own at room temperature.',
  },
  {
    q: 'How long does a pack stay good?',
    a: 'Nine months from the date of packing when kept sealed, away from sunlight and heat. Once opened, close the cap tightly and use within a couple of months. The best-before date and batch number are printed on every pack.',
  },
  {
    q: 'Is it 100% vegetarian?',
    a: 'Yes. Actipro is made only from sunflower seed and carries the green vegetarian mark. No animal-origin material is used at any stage of refining.',
  },
  {
    q: 'How do I become a distributor or stockist?',
    a: 'Fill the enquiry form below or call us on the number listed. Tell us your district, the pack sizes you move and your current monthly volume, and our sales team will get back with a rate card and terms.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Questions we get asked"
          subtitle="Still unsure about something? Send us a message — we answer within a working day."
        />

        <div className="mt-12 divide-y divide-acti-ink/10 border-y border-acti-ink/10">
          {FAQS.map((faq, index) => {
            const isOpen = open === index
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[17px] font-semibold text-acti-ink">{faq.q}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 shrink-0 text-acti-orange transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="-mt-1 pb-6 pr-10 text-[15px] leading-relaxed text-acti-ink/65">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
