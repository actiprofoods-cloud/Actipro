import { PinIcon, ShieldIcon, FlameIcon, DropIcon, LeafIcon, HeartIcon } from './icons'

/*
 * ROOTED IN TRUST — the four-pillar trust panel.
 *
 * Layout is the reference's: a full-bleed photographic scene (pour and bowl at
 * the left, bottle at the right, clear middle), a centred heading over it, and
 * a translucent card holding four columns. A slim strip of secondary
 * reassurances runs along the bottom.
 *
 * Every image comes from public/build/, resized into public/rooted/ as WebP —
 * the originals are 0.6-2.3 MB PNGs and there are eight of them. See the note
 * in index.css for the conversion, and for which build/ file became which name.
 *
 * Each pillar carries its own card image along the bottom of its column:
 * farm (illustration), certs (FSSAI / ISO 22000 / GMP marks), batch (the
 * filling line) and ripple (a drop landing in oil). certs is `contain` so the
 * marks are never cropped; the rest are `cover` and bleed to the cell edge.
 *
 * Static by design: this sits after three scroll-driven scenes, and the page
 * does not need a fourth thing competing for attention.
 */
const PILLARS = [
  {
    key: 'traceability',
    Icon: PinIcon,
    title: '100% Traceability',
    body: 'We trace our oils from trusted farms to your kitchen.',
    image: '/rooted/farm.webp',
    alt: 'A line drawing of a farmhouse above ploughed fields',
    fit: 'cover',
  },
  {
    key: 'certified',
    Icon: ShieldIcon,
    title: 'Certified Quality',
    body: 'Tested and certified to meet the highest safety and quality standards.',
    image: '/rooted/certs.webp',
    alt: 'FSSAI licence 100210220000234, ISO 22000 certified company and GMP marks',
    fit: 'contain',
  },
  {
    key: 'batch',
    Icon: FlameIcon,
    title: 'Small Batch Made',
    body: 'Made in small batches to retain natural goodness and freshness.',
    image: '/rooted/batch.webp',
    alt: 'Oil running from a bottling head into a glass flask on the filling line',
    fit: 'cover',
  },
  {
    key: 'purity',
    Icon: DropIcon,
    title: 'Purity You Can See',
    body: 'No additives. No compromises. Just pure, healthy oil.',
    image: '/rooted/ripple.webp',
    alt: 'A drop falling into golden oil, sending out rings',
    fit: 'cover',
  },
]

const ASSURANCES = [
  { Icon: ShieldIcon, title: 'Safe & Reliable', body: 'Every bottle is safe for you and your family.' },
  { Icon: LeafIcon, title: 'Sustainably Sourced', body: 'We partner with farmer communities we respect.' },
  { Icon: FlameIcon, title: 'Lab Tested', body: 'Every batch is lab-tested for purity and safety.' },
  { Icon: HeartIcon, title: 'Made with Care', body: 'Crafted with passion, packed with care.' },
]

export default function TrustSection() {
  return (
    <section id="rooted" className="trust-scene acti-seam">
      {/* The photographic ground.
          scene.webp is a 1800x1013 landscape: cover-fitting it into a tall
          phone section renders it 1452px wide and shows only the middle 27% —
          which is the scene's empty backdrop, so the pour and the bottle both
          crop away and the top of the section looked blank.
          scene-portrait.webp is a phone-shaped recomposition (the two busy
          edges kept, the dead centre dropped, seam feathered) so a narrow
          viewport still gets the subject. Decorative, hence no alt text. */}
      <picture>
        <source media="(max-width: 639px)" srcSet="/rooted/scene-portrait.webp" />
        <img className="trust-bg" src="/rooted/scene.webp" alt="" aria-hidden="true" loading="lazy" />
      </picture>
      <div className="trust-veil" aria-hidden="true" />

      <div className="trust-inner">
        <header className="trust-head">
          <LeafIcon className="mx-auto h-5 w-5 text-acti-sun" aria-hidden="true" />

          <span className="trust-eyebrow">
            <span className="trust-rule" aria-hidden="true" />
            Rooted in trust
            <span className="trust-rule" aria-hidden="true" />
          </span>

          <h2 className="trust-title">
            Trust in <em>every drop.</em>
          </h2>

          <DropIcon className="mx-auto h-4 w-4 text-acti-sun" aria-hidden="true" />
          <p className="trust-sub">Purity. Quality. Care. In every step.</p>
        </header>

        <div className="trust-panel">
          <ul className="trust-grid">
            {PILLARS.map(({ key, Icon, title, body, image, alt, fit }) => (
              <li key={key} className="trust-cell">
                <span className="trust-badge">
                  <Icon className="h-6 w-6" />
                </span>

                {/* Wrapped so the phone layout can put the icon beside the copy
                    and still stack the title over the body. Without this the
                    two become sibling flex children of the row and sit side by
                    side, which wraps every title to three lines. Full-width
                    block on desktop, so that column layout is unchanged. */}
                <div className="trust-cell-copy">
                  <h3 className="trust-cell-title">{title}</h3>
                  <p className="trust-cell-body">{body}</p>
                </div>

                {/* The certification marks are now real artwork (rooted/certs.webp)
                    rather than the typographic stand-in they used to be, so every
                    pillar carries its picture the same way. */}
                <figure className="trust-figure" data-fit={fit}>
                  <img src={image} alt={alt} loading="lazy" decoding="async" />
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <ul className="trust-strip">
          {ASSURANCES.map(({ Icon, title, body }) => (
            <li key={title}>
              {/* Nudged down off the flex-start edge so it centres against the
                  title rather than sitting proud of it. */}
              <Icon className="mt-1 h-11 w-11 shrink-0 text-acti-sun" aria-hidden="true" />
              <div>
                <p className="trust-strip-title">{title}</p>
                <p className="trust-strip-body">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
