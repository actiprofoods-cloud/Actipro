import { useState } from 'react'
import { Headset, Mail, MapPin, MessageSquare, Phone, Send, Tag, User } from 'lucide-react'
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from './icons'
import IndiaMap from './IndiaMap'

/*
 * CONTACT — /contact.
 *
 * Laid out over public/contact/contact-bg.webp, a portrait plate carrying the
 * ornament (envelope, handset, pins, speech bubbles, leaf sprays and a dotted
 * India). The plate is the page's decoration, so nothing here draws its own
 * background pattern — the cards are translucent and let it through.
 *
 * Structure, top to bottom:
 *   header          eyebrow, title, rule, subline
 *   three cards     Get in Touch | Send Us a Message | Our Presence
 *   assurance strip four support facts
 *   social block    follow row
 *
 * ── DETAILS ARE REAL ────────────────────────────────────────────────────────
 * The phone, email and address below are the actual ones. They were already in
 * this file before the redesign and are deliberately kept — do not replace
 * them with the values from a mockup.
 *
 * ── THE FORM ────────────────────────────────────────────────────────────────
 * There is no backend on this project, so submitting composes a mailto: with
 * the fields filled in and hands off to the visitor's mail client. That is
 * honest — nothing is silently dropped — but it is NOT a real form pipeline.
 * When an endpoint exists, replace the body of handleSubmit; the state and the
 * markup do not need to change.
 */

const CONTACT_ROWS = [
  {
    Icon: Mail,
    label: 'Email Us',
    value: 'contact@madhurioils.com',
    href: 'mailto:contact@madhurioils.com',
  },
  {
    Icon: Phone,
    label: 'Call Us',
    value: '+91 94250 66485',
    href: 'tel:+919425066485',
  },
  {
    Icon: MapPin,
    label: 'Our Office',
    value:
      '12 Race Course, Dil Pasand Kothi, Prakoshth No 301, Block No 6, Princes Empire, Indore, Madhya Pradesh — 452001',
  },
]

/* Placeholder handles. Swap the href when the real accounts exist — the row
   renders from this list, so nothing else has to change. */
const SOCIALS = [
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
  { Icon: YouTubeIcon, label: 'YouTube', href: 'https://youtube.com' },
]

const SUPPORT = [
  {
    Icon: Headset,
    title: 'Need Immediate Assistance?',
    body: 'Our team is ready to help with product information, orders, partnerships or any enquiry.',
  },
  {
    Icon: ClockIcon,
    title: 'Our Working Hours',
    body: 'Mon – Sat, 10:00 AM – 6:00 PM. Closed on Sundays and public holidays.',
  },
  {
    Icon: Mail,
    title: 'We Typically Reply Within 24 Hours',
    body: 'Your time matters to us. We will get back to you as soon as we can.',
  },
  {
    Icon: Phone,
    title: 'Call Us Now',
    body: '+91 94250 66485 — speak directly with our support team.',
  },
]

const FIELDS = [
  { name: 'name', label: 'Full Name', Icon: User, placeholder: 'Enter your full name', type: 'text' },
  { name: 'email', label: 'Email Address', Icon: Mail, placeholder: 'Enter your email address', type: 'email' },
  { name: 'phone', label: 'Phone Number', Icon: Phone, placeholder: 'Enter your phone number', type: 'tel' },
  { name: 'subject', label: 'Subject', Icon: Tag, placeholder: 'How can we help you?', type: 'text' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [pin, setPin] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      form.message,
    ].join('\n')
    window.location.href = `mailto:contact@madhurioils.com?subject=${encodeURIComponent(
      form.subject || 'Website enquiry',
    )}&body=${encodeURIComponent(body)}`
  }

  /* The plate is a CSS background on .contact-scene rather than an <img>: it
     has to REPEAT at its natural size down a page far taller than itself, and
     background-repeat is the only thing that tiles. An <img> can only stretch
     or crop, which is what made the ornament oversized and blurry. */
  return (
    <section id="contact" className="contact-scene">
      <div className="contact-inner">
        <header className="contact-head">
          <p className="contact-eyebrow">We’re here to help</p>
          <h1 className="contact-title">Contact Us</h1>
          <span className="contact-rule" aria-hidden="true" />
          <p className="contact-sub">
            Have a question about our products, partnership opportunities, or anything else? Send us
            a message and we’ll get back to you soon.
          </p>
        </header>

        <div className="contact-grid">
          {/* ---- Get in touch ---- */}
          <div className="contact-card contact-card--solid">
            <h2 className="contact-card-title">Get in Touch</h2>
            <span className="contact-card-rule" aria-hidden="true" />
            <p className="contact-card-lede">
              We’d love to hear from you. Reach out through any of the following.
            </p>

            <ul className="contact-rows">
              {CONTACT_ROWS.map(({ Icon, label, value, href }) => (
                <li key={label}>
                  <span className="contact-row-icon" aria-hidden="true">
                    <Icon size={19} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="contact-row-label">{label}</p>
                    {href ? (
                      <a className="contact-row-value" href={href}>
                        {value}
                      </a>
                    ) : (
                      <p className="contact-row-value">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="contact-follow-title">Follow Us</h3>
            <ul className="contact-socials">
              {SOCIALS.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- The form ---- */}
          <form className="contact-card contact-card--solid contact-form" onSubmit={handleSubmit}>
            <h2 className="contact-card-title">
              <span className="contact-title-badge" aria-hidden="true">
                <Send size={18} strokeWidth={1.7} />
              </span>
              Send Us a Message
            </h2>

            {FIELDS.map(({ name, label, Icon, placeholder, type }) => (
              <label key={name} className="contact-field">
                <span className="contact-field-label">
                  {label} <span aria-hidden="true">*</span>
                </span>
                <span className="contact-input">
                  <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type={type}
                    name={name}
                    required
                    value={form[name]}
                    onChange={set(name)}
                    placeholder={placeholder}
                  />
                </span>
              </label>
            ))}

            <label className="contact-field">
              <span className="contact-field-label">
                Message <span aria-hidden="true">*</span>
              </span>
              <span className="contact-input contact-input--area">
                <MessageSquare size={16} strokeWidth={1.6} aria-hidden="true" />
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Type your message here..."
                />
              </span>
            </label>

            <button type="submit" className="contact-submit">
              Send Message
              <Send size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>

          {/* ---- Presence ---- */}
          <div className="contact-card">
            <h2 className="contact-card-title">
              <span className="contact-title-badge" aria-hidden="true">
                <MapPin size={18} strokeWidth={1.7} />
              </span>
              Our Presence
            </h2>
            <p className="contact-card-lede">
              We reach kitchens across India. The pins mark the states we currently ship to.
            </p>

            <IndiaMap className="contact-map" active={pin?.name} onSelect={setPin} />

            {/* Reads out whichever pin was last chosen. The pins are STATES, not
                verified distributor addresses — the copy says so rather than
                implying a precision the data does not have. */}
            <p className="contact-map-note" aria-live="polite">
              {pin ? pin.name : 'Tap a pin to see the state.'}
            </p>

            <a
              className="contact-map-cta"
              href="mailto:contact@madhurioils.com?subject=Distributor%20locations%20enquiry"
            >
              <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
              Ask about distributors
            </a>
          </div>
        </div>

        {/* ---- Support strip ---- */}
        <ul className="contact-support">
          {SUPPORT.map(({ Icon, title, body }) => (
            <li key={title}>
              <span className="contact-support-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="contact-support-title">{title}</p>
                <p className="contact-support-body">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ---- Stay connected ---- */}
        <div className="contact-connect">
          <p className="contact-eyebrow">
            <span className="contact-connect-rule" aria-hidden="true" />
            Stay connected
            <span className="contact-connect-rule" aria-hidden="true" />
          </p>
          <h2 className="contact-connect-title">Follow Us for Updates</h2>
          <p className="contact-sub">
            Stay connected on social media for the latest updates, product news and healthy living
            tips.
          </p>
          <ul className="contact-socials contact-socials--lg">
            {SOCIALS.map(({ Icon, label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
