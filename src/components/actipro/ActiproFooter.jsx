import { Link } from 'react-router-dom'
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
  return (
    <footer className="bg-acti-ink text-white">
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
                <a href={link.href} className="acti-tap inline-flex items-center py-2 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/post-work/our-plant" className="acti-tap inline-flex items-center py-2 hover:text-white">
                Our plants
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
    </footer>
  )
}
