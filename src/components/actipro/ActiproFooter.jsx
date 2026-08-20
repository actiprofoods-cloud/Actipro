import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from './navLinks'

/* The footer carries a short list, not the full nav — the first three links
   plus Our plants. Slicing here rather than trimming NAV_LINKS keeps the
   header's own navigation complete. */
const FOOTER_LINKS = NAV_LINKS.slice(0, 3)

const PLANTS = [
  { name: 'Madhuri Refiners Pvt. Ltd., Dhannad (Indore)', fssai: '11423999000077' },
  { name: 'Madhuri Refiners Pvt. Ltd., Mandsaur', fssai: '10016026000970' },
  { name: 'Parshvakrupa Trading Co., Nashik', fssai: '11522999000229' },
]

export default function ActiproFooter() {
  /* Same problem the header has: FOOTER_LINKS are hash anchors to sections
     that only exist on the landing page, and this footer now renders on
     /contact too. Off the landing page they are prefixed so they mean
     "go home, then jump". */
  const { pathname } = useLocation()
  const sectionHref = (hash) => (pathname === '/' ? hash : `/${hash}`)

  return (
    // No background on the <footer> itself: the curve is a shape cut out of the
    // ink, so what sits behind it has to be the PAGE. With bg-acti-ink here the
    // negative space above the arc was filled with ink too and the sweep was
    // invisible against it. The ink starts at .af-body, under the curve.
    <footer className="text-white">
      {/*
        The sweep that carries the cream page down into the ink footer.

        Every other junction on the site is either feathered (.acti-seam) or
        cut by an arc (the Mission/Vision cards); this join was the last hard
        straight line, cream butted directly against #17110d.

        The shape echoes the cards' CURVE rather than inventing a new one: it
        rises on the left, crosses low through the middle and lifts again at
        the right, so it reads as the same hand. preserveAspectRatio="none"
        lets one path stretch to any width — the alternative, a fixed arc,
        flattens to nothing at 1440px and swallows a phone screen at 390px.

        aria-hidden because it carries no information: the colour change is
        what tells a reader the footer has begun.
      */}
      <svg
        className="af-curve"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Fill, not stroke: the path closes down the sides and along the
            bottom, so the shape IS the top of the footer block. */}
        <path
          d="M0 20 L0 9 C 18 1, 34 0, 50 6 C 66 12, 82 13, 100 5 L100 20 Z"
          fill="currentColor"
          className="text-acti-ink"
        />
      </svg>

      <div className="af-body bg-acti-ink">
        <div className="acti-shell grid gap-12 py-16 lg:grid-cols-4">
          <div className="lg:col-span-2">
            {/* The print is transparent-backed, so no plate is needed. It is
                knocked out to solid white the same way the header does over dark
                scenes — the tagline is near-black in the artwork and would sit at
                ~1.15:1 against the ink footer if left in its own colours. */}
            <img
              src="/logo/actipro.png"
              alt="Actipro Refined Sunflower Oil"
              className="h-11 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
              Actipro Refined Sunflower Oil is a brand of Madhuri Refiners Pvt. Ltd. — refining and
              packing edible oil in Madhya Pradesh and Maharashtra.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <img src="/logo/fssai-logo.png" alt="FSSAI" className="h-7 w-auto bg-white/90 px-1.5 py-0.5" />
              <span className="text-sm text-white/70">Head office licence: 11424999000132</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-acti-sun">Explore</h3>
            <ul className="mt-5 space-y-3 text-[15px] text-white/70">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={sectionHref(link.href)}
                    className="acti-tap inline-flex items-center py-2 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/post-work/our-plant" className="acti-tap inline-flex items-center py-2 hover:text-white">
                  Our plants
                </Link>
              </li>
              <li>
                <Link to="/healthy-tips" className="acti-tap inline-flex items-center py-2 hover:text-white">
                  Healthy tips
                </Link>
              </li>
              <li>
                <Link to="/contact" className="acti-tap inline-flex items-center py-2 hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-acti-sun">
              Our refineries
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              {PLANTS.map((plant) => (
                <li key={plant.fssai}>
                  <p>{plant.name}</p>
                  <p className="mt-1 text-white/45">FSSAI {plant.fssai}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="acti-shell flex flex-col gap-3 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Madhuri Refiners Pvt. Ltd. All rights reserved.</p>
            <p>
              <a href="tel:+919425066485" className="acti-tap inline-flex items-center py-2 hover:text-white">
                (+91) 9425066485
              </a>
              <span className="px-2 text-white/25">|</span>
              <a href="mailto:contact@madhurioils.com" className="acti-tap inline-flex items-center py-2 hover:text-white">
                contact@madhurioils.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
