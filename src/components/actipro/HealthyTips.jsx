import { LeafIcon } from './icons'
import { HEALTH_TIPS, QUICK_TIPS } from './healthTips'

/*
 * HEALTHY TIPS — the body of /healthy-tips.
 *
 * A heading, a row of four quick numbers, then one card per tip: copy on one
 * side, the campaign creative on the other. The cards alternate sides down the
 * page (CSS, via :nth-child) so it reads as a column of scenes rather than a
 * table.
 *
 * Static by design. Every other long section on this site is a GSAP scrub, but
 * this one is read, not watched — there is nothing here to animate. That is
 * also why the page mounts no Lenis (see HealthyTipsPage).
 *
 * The images are the brand's own artwork from public/tips/, served as WebP;
 * healthTips.js documents where they come from and how to add one. They are
 * NOT decorative — each carries its own message ("one move towards healthier
 * cooking" and so on), so each has a real alt describing it rather than an
 * empty one.
 */

export default function HealthyTips() {
  return (
    <section id="healthy-tips" className="ht-scene">
      <div className="acti-shell">
        <header className="ht-head">
          <p className="ht-eyebrow">
            <LeafIcon className="h-4 w-4" aria-hidden="true" />
            Healthy Tips
          </p>
          <h1 className="ht-title">Cook lighter, without cooking blander</h1>
          <p className="ht-sub">
            Small habits around the pan — how hot the oil gets, how often it is reused, how much
            actually goes in — change more than switching brands ever will. Here are the ones worth
            keeping.
          </p>
        </header>

        {/* The numbers first: a reader who only skims still leaves with the
            four figures the copy below expands on. */}
        <ul className="ht-quick">
          {QUICK_TIPS.map(({ stat, label, note }) => (
            <li key={label} className="ht-quick-item">
              <p className="ht-quick-stat">{stat}</p>
              <h2 className="ht-quick-label">{label}</h2>
              <p className="ht-quick-note">{note}</p>
            </li>
          ))}
        </ul>

        <div className="ht-list">
          {HEALTH_TIPS.map((tip, index) => (
            <article key={tip.id} className="ht-card">
              <div className="ht-copy">
                <p className="ht-index">{String(index + 1).padStart(2, '0')}</p>
                <p className="ht-card-eyebrow">{tip.eyebrow}</p>
                <h2 className="ht-card-title">{tip.title}</h2>
                <p className="ht-card-body">{tip.body}</p>
              </div>

              <div className="ht-frame">
                {/* The first card is the one visible on arrival, so it loads
                    normally; the rest are below the fold and wait. */}
                <img
                  className="ht-media"
                  src={tip.image.src}
                  alt={tip.image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            </article>
          ))}
        </div>

        {/* The page is advice about cooking fat, so it has to say plainly that
            it is not medical advice. */}
        <p className="ht-note">
          General cooking guidance, not medical advice. For diet plans tied to a health condition,
          speak to a doctor or a registered dietitian.
        </p>
      </div>
    </section>
  )
}
