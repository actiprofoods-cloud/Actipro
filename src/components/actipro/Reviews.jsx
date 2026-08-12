import SectionHeading from './SectionHeading'
import { StarIcon } from './icons'

const REVIEWS = [
  {
    quote:
      'We fry roughly 40 kg of snacks a day. Actipro holds up through the shift and the pakoras do not turn dark — that alone saves us oil every week.',
    name: 'Rajesh Patidar',
    role: 'Namkeen shop owner, Indore',
  },
  {
    quote:
      'The kids notice when food feels heavy. With this oil the pooris stay crisp and nobody complains after lunch. The 5 litre jar lasts us the month.',
    name: 'Sunita Sharma',
    role: 'Home cook, Ujjain',
  },
  {
    quote:
      'Supply has been steady for two years, packing is clean and the batch reports come with the invoice. That is what a distributor actually needs.',
    name: 'Imran Shaikh',
    role: 'Distributor, Nashik',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="bg-acti-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What kitchens tell us"
          subtitle="Homes, halwais and distributors across Madhya Pradesh and Maharashtra."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure key={review.name} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex gap-1 text-acti-sun">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-acti-ink/75">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-acti-ink/8 pt-5">
                <p className="font-semibold text-acti-ink">{review.name}</p>
                <p className="text-sm text-acti-ink/55">{review.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
