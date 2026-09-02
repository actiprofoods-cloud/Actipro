import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Droplet,
  Heart,
  Leaf,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import {
  ADT_STEPS,
  COMPLIANCE,
  HERO_BENEFITS,
  INSIDE,
  NUTRITION,
  RANGE,
  RANGE_TABS,
  RECIPES,
  SORT_OPTIONS,
} from './rangeData'

/*
 * PRODUCTS — the six-oil range page, built to the supplied reference.
 *
 * Section order matches the reference top to bottom:
 *   hero band → range grid (tabs + sort) → ADT process → what's inside →
 *   the four-panel footer row (nutrition, compliance, verify, recipes) →
 *   disclaimer + CTA bar.
 *
 * ── THE BOTTLE ART ─────────────────────────────────────────────────────────
 * All six pack shots are cut from /public/page/product.png, the same render
 * used for the hero. The older /public/product/actipro-*.webp files are a
 * DIFFERENT pack design (Madhuri roundel, red label, jerry-can bottle) and are
 * deliberately not used here — see rangeData.js.
 *
 * ── THE VERIFY BOX ─────────────────────────────────────────────────────────
 * Presentational only. There is no batch-lookup backend and this is a static
 * Vite build, so the form holds its input and reports that checking is not
 * available yet rather than inventing a LOT number. It never fakes a success.
 */

const AMAZON_URL = 'https://www.amazon.in/s?k=madhuri+actipro+oil'

// The small round glyphs on each product card.
const CARD_ICONS = {
  drop: Droplet,
  bottle: ShieldCheck,
  atom: Sparkles,
  heart: Heart,
}

const BENEFIT_ICONS = {
  drop: Droplet,
  atom: Sparkles,
  heart: Heart,
  leaf: Leaf,
  pot: ShieldCheck,
}

const COMPLIANCE_ICONS = {
  check: Check,
  fssai: ShieldCheck,
  building: Building2,
  mail: Mail,
  phone: Phone,
}

function Stars({ rating }) {
  return (
    <span className="rp-stars" aria-hidden="true">
      <Star size={13} strokeWidth={0} fill="#e8a33d" />
      <b>{rating.toFixed(1)}</b>
    </span>
  )
}

function AmazonButton({ className = '' }) {
  return (
    <a className={`rp-amazon ${className}`.trim()} href={AMAZON_URL} target="_blank" rel="noreferrer noopener">
      Explore on Amazon
      <span className="rp-amazon-mark" aria-hidden="true">a</span>
    </a>
  )
}

function VerifyButton({ className = '' }) {
  return (
    <a className={`rp-verify-btn ${className}`.trim()} href="#verify">
      <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />
      Verify Your Batch
    </a>
  )
}

export default function RangePage() {
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('Popular')

  // Batch verify: presentational. `note` is the message shown after a submit.
  const [batch, setBatch] = useState('')
  const [note, setNote] = useState('')

  const shown = useMemo(() => {
    const list = RANGE.filter((p) => tab === 'all' || p.tags.includes(tab))
    if (sort === 'Rating') return [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'Name') return [...list].sort((a, b) => a.short.localeCompare(b.short))
    /* 'Popular' is the DEFAULT, so it keeps the order the range is authored in
       — the same left-to-right order as the pack render and the reference
       page. Sorting it by review count put Coconut first, which made the
       page open on a different bottle than the artwork above it. */
    return list
  }, [tab, sort])

  const onVerify = (e) => {
    e.preventDefault()
    /* No batch-lookup service exists. Saying so is the honest outcome —
       inventing a LOT number here would read as a real verification. */
    setNote(
      batch.trim().length < 2
        ? 'Enter the first two characters of your Lot Number.'
        : 'Batch checking is not available online yet — please use the QR code on your pack.',
    )
  }

  return (
    <div className="rp">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="rp-hero">
        <div className="rp-hero-inner">
          <div className="rp-hero-copy">
            <h1 className="rp-hero-title">
              Good oils.
              <span className="rp-hero-line">
                Goodness <em>in every drop.</em>
              </span>
            </h1>
            <p className="rp-hero-sub">
              Pure ingredients. Trusted process.
              <br />
              Goodness in every drop.
            </p>

            <ul className="rp-benefits">
              {HERO_BENEFITS.map((b) => {
                const Icon = BENEFIT_ICONS[b.icon] ?? Droplet
                return (
                  <li key={b.title}>
                    <span className="rp-benefit-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.4} />
                    </span>
                    <b>{b.title}</b>
                    <span className="rp-benefit-body">{b.body}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* On wide screens the render is the SECTION BACKGROUND (see .rp-hero
              in index.css) and this tag is hidden — the artwork was composed
              with an empty left half for exactly that. Below 1024px there is
              no room for the copy beside the bottles, so the same file shows
              here as a band under the text instead.

              Decorative either way: every bottle it shows is listed as a real
              card below, so alt text would only repeat the grid. */}
          <img className="rp-hero-band" src="/page/hero-products.png" alt="" aria-hidden="true" />
        </div>
      </section>

      {/* ── RANGE GRID ───────────────────────────────────────────────── */}
      <section className="rp-range" id="range">
        <div className="rp-wrap">
          <div className="rp-range-head">
            <h2 className="rp-h2">Our Range of Oils</h2>

            <div className="rp-sort">
              <label htmlFor="rp-sort-select">Sort by:</label>
              <div className="rp-select">
                <select
                  id="rp-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={1.6} aria-hidden="true" />
              </div>
            </div>
          </div>

          <ul className="rp-tabs" role="tablist" aria-label="Filter the range">
            {RANGE_TABS.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  data-on={tab === t.key}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>

          {shown.length === 0 ? (
            <p className="rp-empty">No oils in this range yet.</p>
          ) : (
            <ul className="rp-grid">
              {shown.map((p) => (
                <li key={p.id} className="rp-card">
                  <div className="rp-card-shot">
                    <img src={p.image} alt={p.alt} loading="lazy" />
                  </div>

                  <div className="rp-card-body">
                    <h3 className="rp-card-name">{p.name}</h3>

                    <ul className="rp-card-icons" aria-hidden="true">
                      {p.icons.map((k) => {
                        const Icon = CARD_ICONS[k] ?? Droplet
                        return (
                          <li key={k}>
                            <Icon size={15} strokeWidth={1.5} />
                          </li>
                        )
                      })}
                    </ul>

                    <p className="rp-card-rating">
                      <Stars rating={p.rating} />
                      <span className="rp-card-reviews">({p.reviews.toLocaleString('en-IN')})</span>
                    </p>

                    <div className="rp-card-ctas">
                      <AmazonButton className="rp-card-amazon" />
                      <VerifyButton className="rp-card-verify" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── ADT PROCESS ──────────────────────────────────────────────── */}
      <section className="rp-adt">
        <div className="rp-wrap">
          <h2 className="rp-h2 rp-h2-center">How It’s Made – Our ADT Process</h2>

          <div className="rp-adt-row">
            {ADT_STEPS.map((s, i) => (
              <div className="rp-adt-step" key={s.n}>
                <div className="rp-adt-copy">
                  <p className="rp-adt-n">
                    <span aria-hidden="true">{s.n}</span>
                    <b>{s.title}</b>
                  </p>
                  <p className="rp-adt-body">{s.body}</p>
                </div>
                <img className="rp-adt-art" src={s.art} alt={s.alt} loading="lazy" />
                {i < ADT_STEPS.length - 1 && (
                  <ArrowRight className="rp-adt-arrow" size={20} strokeWidth={1.5} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────── */}
      <section className="rp-inside">
        <div className="rp-wrap">
          <h2 className="rp-h2 rp-h2-center">What’s Inside, For You</h2>

          <ul className="rp-inside-row">
            {INSIDE.map((it) => {
              const Icon = BENEFIT_ICONS[it.icon] ?? Droplet
              return (
                <li key={it.title}>
                  <span className="rp-inside-icon" aria-hidden="true">
                    <Icon size={30} strokeWidth={1.2} />
                  </span>
                  <div>
                    <b>{it.title}</b>
                    <p>{it.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── FOUR-PANEL FOOTER ROW ────────────────────────────────────── */}
      <section className="rp-panels">
        <div className="rp-wrap">
          <div className="rp-panel-row">
            {/* Nutrition */}
            <div className="rp-panel">
              <h3 className="rp-panel-h">Nutritional Information (Approx.)</h3>
              <p className="rp-serving">{NUTRITION.serving}</p>
              <table className="rp-table">
                <thead>
                  <tr>
                    <th scope="col">Nutrients</th>
                    <th scope="col">Per 100g</th>
                    <th scope="col">Per 10g</th>
                  </tr>
                </thead>
                <tbody>
                  {NUTRITION.rows.map(([n, a, b]) => (
                    <tr key={n}>
                      <th scope="row">{n}</th>
                      <td>{a}</td>
                      <td>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="rp-approx">*The above values are approximate and may vary.</p>
            </div>

            {/* Compliance */}
            <div className="rp-panel">
              <h3 className="rp-panel-h">Quality &amp; Compliance</h3>
              <ul className="rp-compliance">
                {COMPLIANCE.map((c) => {
                  const Icon = COMPLIANCE_ICONS[c.kind] ?? Check
                  return (
                    <li key={c.text}>
                      <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                      <span>{c.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Verify — presentational, see the note at the top of the file */}
            <div className="rp-panel" id="verify">
              <h3 className="rp-panel-h">Verify Your Batch</h3>
              <p className="rp-panel-sub">
                Enter the first two characters of your Lot Number to see this batch’s manufacturing
                and packing details.
              </p>

              <form className="rp-verify-form" onSubmit={onVerify}>
                <label className="rp-sr" htmlFor="rp-batch">
                  First two characters of your Lot Number
                </label>
                <input
                  id="rp-batch"
                  type="text"
                  maxLength={2}
                  placeholder="Enter first 2 characters"
                  value={batch}
                  onChange={(e) => {
                    setBatch(e.target.value)
                    setNote('')
                  }}
                />
                <button type="submit">
                  <Search size={14} strokeWidth={2} aria-hidden="true" />
                  Verify
                </button>
              </form>

              {/* aria-live so the message is announced, not just drawn */}
              <p className="rp-verify-note" role="status" aria-live="polite">
                {note}
              </p>

              <p className="rp-qr-note">Scan the QR code on the pack for easy verification.</p>
            </div>

            {/* Recipes */}
            <div className="rp-panel">
              <h3 className="rp-panel-h">What can you make?</h3>
              <p className="rp-panel-sub">
                Discover simple, delicious recipes made better with ActiPro oils.
              </p>

              <a className="rp-recipes-cta" href="/healthy-tips">
                View All Recipes
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>

              <ul className="rp-recipes">
                {RECIPES.map((r) => (
                  <li key={r.title}>
                    <img src={r.image} alt="" aria-hidden="true" loading="lazy" />
                    <span>{r.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Closing CTA pair. The disclaimer line that used to sit on the left
              of this row was removed on request; the row now holds only the
              buttons, aligned to the right (see .rp-foot / justify-end). */}
          <div className="rp-foot rp-foot--cta-only">
            <div className="rp-foot-cta">
              <AmazonButton className="rp-foot-amazon" />
              <VerifyButton className="rp-foot-verify" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
