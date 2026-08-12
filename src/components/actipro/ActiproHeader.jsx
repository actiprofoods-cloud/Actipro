import { useEffect, useState } from 'react'
import { MenuIcon, CloseIcon, PhoneIcon } from './icons'
import { NAV_LINKS } from './navLinks'

export default function ActiproHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Over the video the header is bare white-on-dark; once scrolled it turns solid.
  const onDark = !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        onDark ? 'bg-transparent' : 'bg-acti-cream/95 shadow-sm backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 sm:px-10">
        <a href="#top" className="flex shrink-0 items-center" aria-label="Actipro home">
          <img
            src="/logo/actipro.png"
            alt="Actipro Refined Sunflower Oil"
            className={`h-10 w-auto transition-all duration-300 sm:h-12 ${
              onDark ? 'brightness-0 invert' : ''
            }`}
          />
        </a>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-60 ${
                  onDark ? 'text-white' : 'text-acti-ink'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="tel:+919425066485"
              aria-label="Call Actipro"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                onDark
                  ? 'border-white/60 text-white hover:bg-white hover:text-acti-ink'
                  : 'border-acti-ink/25 text-acti-ink hover:bg-acti-ink hover:text-white'
              }`}
            >
              <PhoneIcon className="h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="hidden rounded-full bg-acti-sun px-5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-acti-ink transition-colors hover:bg-acti-orange hover:text-white sm:inline-flex"
            >
              Enquire
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden ${
                onDark ? 'border-white/60 text-white' : 'border-acti-ink/25 text-acti-ink'
              }`}
            >
              {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-acti-ink/10 bg-acti-cream px-5 pb-6 pt-4 lg:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-acti-ink/10 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-acti-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-full bg-acti-sun px-5 py-3 text-center text-[12px] font-bold uppercase tracking-[0.12em] text-acti-ink"
          >
            Enquire
          </a>
        </nav>
      )}
    </header>
  )
}
