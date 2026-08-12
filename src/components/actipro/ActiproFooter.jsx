import { Link } from 'react-router-dom'
import { NAV_LINKS } from './navLinks'

const PLANTS = [
  { name: 'Madhuri Refiners Pvt. Ltd., Dhannad (Indore)', fssai: '11423999000077' },
  { name: 'Madhuri Refiners Pvt. Ltd., Mandsaur', fssai: '10016026000970' },
  { name: 'Parshvakrupa Trading Co., Nashik', fssai: '11522999000229' },
]

export default function ActiproFooter() {
  return (
    <footer className="bg-acti-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <span className="inline-flex rounded-xl bg-white p-3">
            <img src="/logo/actipro.png" alt="Actipro Refined Sunflower Oil" className="h-11 w-auto" />
          </span>
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
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/post-work/our-plant" className="hover:text-white">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Madhuri Refiners Pvt. Ltd. All rights reserved.</p>
          <p>
            <a href="tel:+919425066485" className="hover:text-white">
              (+91) 9425066485
            </a>
            <span className="px-2 text-white/25">|</span>
            <a href="mailto:contact@madhurioils.com" className="hover:text-white">
              contact@madhurioils.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
