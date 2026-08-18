import { useState } from 'react'
import {
  PhoneIcon,
  MailIcon,
  PinIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  LinkedInIcon,
} from './icons'
import IndiaMap from './IndiaMap'

/*
 * CONTACT US — the closing section.
 *
 * The ground is public/contact/contact.webp: a supplied plate that already
 * carries the whole scene — leaf shadows top-left, the Actipro Gold bottle with
 * its oil splash and sunflowers top-right, a wave along the foot. Nothing here
 * re-draws any of that. The section's only job is to keep the plate's middle
 * clear, because that empty cream field is where the heading and the three
 * cards land.
 *
 * The original is a 1.68 MB PNG (public/contact/contact.png, kept as the
 * master) and is served as WebP at 41 KB.
 *
 * The 48px inset is NOT optional. The master was exported with rounded
 * corners over a black background: its corner pixels are (0,0,0) and the
 * black runs ~46px in along each edge. Used uncropped it puts black wedges
 * in the corners of the section. Cropping past the radius is what makes the
 * plate a true rectangle that can bleed to the viewport edges. Re-run this
 * after replacing the master:
 *
 *   python - <<'EOF'
 *   from PIL import Image
 *   im = Image.open("public/contact/contact.png").convert("RGB")
 *   w, h = im.size
 *   I = 48
 *   im.crop((I, I, w - I, h - I)).save(
 *       "public/contact/contact.webp", "WEBP", quality=86, method=6)
 *   EOF
 *
 * Three cards, left to right: the enquiry form, the contact details, and the
 * distributor map. Below them the social row. On a phone they stack in that
 * same order.
 */

const CONTACT_ROWS = [
  {
    Icon: PhoneIcon,
    label: 'Phone Number',
    value: '+91 94250 66485',
    href: 'tel:+919425066485',
    note: 'Mon – Sat, 10:00 AM – 6:00 PM',
  },
  {
    Icon: MailIcon,
    label: 'Email Address',
    value: 'contact@madhurioils.com',
    href: 'mailto:contact@madhurioils.com',
    note: 'We’ll reply as soon as we promise.',
  },
  {
    Icon: PinIcon,
    label: 'Office Address',
    value: '12 Race Course, Dil Pasand Kothi, Prakoshth No 301, Block No 6, Princes Empire, Indore, Madhya Pradesh',
    note: 'PIN — 452001',
  },
]

/* Placeholder handles. Swap the href when the real accounts exist — the row
   renders from this list, so nothing else has to change. */
const SOCIALS = [
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com' },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  // No backend on this site yet — the form hands the enquiry to the user's mail
  // client. Every field is carried into the body so nothing typed is lost.
  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = form.subject || `Actipro enquiry — ${form.name || 'New enquiry'}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      form.message,
    ].join('\n')
    window.location.href = `mailto:contact@madhurioils.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contact" className="contact-scene">
      {/* Decorative: the plate carries no information the copy does not, and
          its bottle is the same one shown all over the site. */}
      <img className="contact-bg" src="/contact/contact.webp" alt="" aria-hidden="true" loading="lazy" />

      <div className="contact-inner acti-shell">
        <header className="contact-head">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-sub">
            We’re here to help with your questions, feedback, and distributor enquiries.
          </p>
        </header>

        <div className="contact-grid">
          {/* --- Card 1: the form ------------------------------------- */}
          <form className="contact-card contact-form" onSubmit={handleSubmit}>
            <h3 className="contact-card-title">
              <MailIcon className="h-4 w-4 text-acti-orange" aria-hidden="true" />
              Send Us a Message
            </h3>

            <label className="contact-field">
              <span>Full Name</span>
              <input required value={form.name} onChange={update('name')} placeholder="Enter your full name" />
            </label>

            <label className="contact-field">
              <span>Email Address</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="Enter your email address"
              />
            </label>

            <label className="contact-field">
              <span>Phone Number</span>
              <input
                required
                type="tel"
                pattern="[0-9+ ]{10,15}"
                value={form.phone}
                onChange={update('phone')}
                placeholder="Enter your phone number"
              />
            </label>

            <label className="contact-field">
              <span>Subject</span>
              <input value={form.subject} onChange={update('subject')} placeholder="Enter your subject" />
            </label>

            <label className="contact-field">
              <span>Message</span>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={update('message')}
                placeholder="Write your message here…"
              />
            </label>

            <button type="submit" className="contact-submit">
              <MailIcon className="h-4 w-4" aria-hidden="true" />
              Send Message
            </button>
          </form>

          {/* --- Card 2: the details ---------------------------------- */}
          <div className="contact-card contact-info">
            <h3 className="contact-card-title">
              <PhoneIcon className="h-4 w-4 text-acti-orange" aria-hidden="true" />
              Contact Information
            </h3>

            <ul className="contact-rows">
              {CONTACT_ROWS.map(({ Icon, label, value, href, note }) => (
                <li key={label}>
                  <span className="contact-row-badge">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="contact-row-copy">
                    <p className="contact-row-label">{label}</p>
                    {href ? (
                      <a className="contact-row-value" href={href}>
                        {value}
                      </a>
                    ) : (
                      <p className="contact-row-value">{value}</p>
                    )}
                    <p className="contact-row-note">{note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Card 3: the map -------------------------------------- */}
          <div className="contact-card contact-map">
            <h3 className="contact-card-title">
              <PinIcon className="h-4 w-4 text-acti-orange" aria-hidden="true" />
              Our Distributor Presence
            </h3>

            <IndiaMap className="contact-map-figure" />

            {/* There is no distributor-locator page yet, so this opens a mail
                enquiry rather than being a link that goes nowhere. Point it at
                the real route when one exists. */}
            <a
              className="contact-map-cta"
              href="mailto:contact@madhurioils.com?subject=Distributor%20locations%20enquiry"
            >
              <PinIcon className="h-4 w-4" aria-hidden="true" />
              View Distributor Locations
            </a>
          </div>
        </div>

        {/* --- Follow us ---------------------------------------------- */}
        <div className="contact-social">
          <div className="contact-social-copy">
            <h3 className="contact-card-title">Follow Us</h3>
            <p>Stay connected for the latest updates, recipes &amp; health tips.</p>
          </div>

          <ul className="contact-social-row">
            {SOCIALS.map(({ Icon, label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <span className="contact-social-badge">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="contact-social-label">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
