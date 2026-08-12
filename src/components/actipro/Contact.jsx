import { useState } from 'react'
import SectionHeading from './SectionHeading'
import { PhoneIcon, MailIcon, PinIcon, ArrowRightIcon } from './icons'
import { PRODUCTS } from './productData'

const PACK_OPTIONS = [
  ...PRODUCTS.map((product) => `${product.brand} — ${product.name}`),
  'Bulk / private label',
]

const CONTACTS = [
  {
    Icon: PhoneIcon,
    label: 'Call us',
    value: '(+91) 9425066485',
    href: 'tel:+919425066485',
  },
  {
    Icon: MailIcon,
    label: 'E-mail',
    value: 'contact@madhurioils.com',
    href: 'mailto:contact@madhurioils.com',
  },
  {
    Icon: PinIcon,
    label: 'Head office',
    value:
      '12 Race Course, Dil Pasand Kothi, Prakoshth No 301, Block No 6, Princes Empire, Indore, Madhya Pradesh 452001',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', pack: PACK_OPTIONS[0], message: '' })

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  // No backend on this site yet — the form hands the enquiry to the user's mail client.
  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = `Actipro enquiry — ${form.name || 'New enquiry'}`
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `City / District: ${form.city}`,
      `Product of interest: ${form.pack}`,
      '',
      form.message,
    ].join('\n')
    window.location.href = `mailto:contact@madhurioils.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const field =
    'w-full rounded-xl border border-acti-ink/12 bg-white px-4 py-3 text-[15px] text-acti-ink outline-none transition-colors placeholder:text-acti-ink/35 focus:border-acti-orange'

  return (
    <section id="contact" className="bg-acti-cream py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Get in touch"
            title="Stock Actipro in your shop or kitchen"
            subtitle="We are looking for distributors and stockists across Madhya Pradesh, Maharashtra and neighbouring states. Tell us your area and volume, and we will send a rate card."
          />

          <ul className="mt-10 space-y-6">
            {CONTACTS.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-acti-orange/10 text-acti-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-acti-ink/45">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="text-[15px] font-medium text-acti-ink hover:text-acti-orange">
                      {value}
                    </a>
                  ) : (
                    <p className="max-w-sm text-[15px] leading-relaxed text-acti-ink/75">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-acti-ink/50">
            Business hours: Monday – Saturday, 10 AM – 6 PM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm sm:p-9">
          <h3 className="text-xl font-semibold text-acti-ink">Send an enquiry</h3>
          <p className="mt-2 text-sm text-acti-ink/55">
            Fill this in and your mail app will open with the details ready to send.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-acti-ink/70">Name</span>
              <input required value={form.name} onChange={update('name')} className={field} placeholder="Your full name" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-acti-ink/70">Phone</span>
              <input
                required
                type="tel"
                pattern="[0-9+ ]{10,15}"
                value={form.phone}
                onChange={update('phone')}
                className={field}
                placeholder="10-digit mobile number"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-acti-ink/70">City / District</span>
              <input required value={form.city} onChange={update('city')} className={field} placeholder="e.g. Indore" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-acti-ink/70">Product of interest</span>
              <select value={form.pack} onChange={update('pack')} className={field}>
                {PACK_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-acti-ink/70">Message</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={update('message')}
              className={`${field} resize-none`}
              placeholder="Monthly volume, current brands you stock, anything else we should know"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acti-orange px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-acti-orange/25 transition-transform hover:-translate-y-0.5"
          >
            Send enquiry
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
