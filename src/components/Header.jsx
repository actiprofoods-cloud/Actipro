import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#', hasDropdown: true },
  { label: 'Products', href: '#', hasDropdown: true },
  { label: 'Media', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact Us', href: '#' },
]

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {menuOpen && (
        <div className="flex items-center gap-2 bg-[#111] px-4 py-2 text-sm text-white sm:px-8">
          <PhoneIcon />
          <a href="tel:+919425066485" className="hover:underline">
            (+91) 9425066485
          </a>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
        <a href="#" className="flex shrink-0 items-center">
          <img src="/logo/logo.png" alt="Madhuri Cooking Oil" className="h-16 w-auto sm:h-20" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-[15px] font-medium text-gray-700 transition-colors hover:text-[#c1121f]"
            >
              {link.label}
              {link.hasDropdown && <ChevronDownIcon />}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex items-center justify-center text-gray-800 transition-colors hover:text-[#c1121f]"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-1 text-[15px] font-medium text-gray-700 hover:text-[#c1121f]"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDownIcon />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
