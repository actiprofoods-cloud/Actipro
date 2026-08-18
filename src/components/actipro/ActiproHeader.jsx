import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MenuIcon, CloseIcon, PhoneIcon } from './icons'
import { NAV_LINKS } from './navLinks'
import { setSceneTone } from './sceneTone'

/* How far the page must travel in one direction before the bar reacts. This is
   measured from the last turning point, NOT frame to frame — Lenis eases the
   scroll into 1-4px steps, so a per-frame threshold would never be crossed.

   The two directions are deliberately not symmetrical. Hiding should take a
   committed downward gesture, but REVEALING has to feel instant: wanting the
   nav back is a deliberate act, and making the user drag 24px up before the bar
   admits it reads as the header being broken. Revealing is therefore hair
   -trigger, hiding stays conservative. */
const REVEAL_THRESHOLD = 4
const HIDE_THRESHOLD = 24
/* Frames (~0.6s at 60fps) for which a just-revealed bar refuses to hide again,
   so Lenis's remaining momentum cannot immediately flap it away. */
const REVEAL_HOLD = 36
/* Above this the bar may hide; inside the hero it always stays put */
const HIDE_AFTER = 120
/* --acti-tone above which the bar is opaque enough to be worth frosting. Below
   it the bar is essentially clear and a backdrop blur would only smear whatever
   is playing behind it. */
const FROST_AT = 0.35

/* Sections that own the whole viewport and must never have chrome over them.
   The kitchen is a full-bleed scrubbed scene — a nav bar sliding in over the
   cabinet on an upward scroll breaks the shot, so inside it the bar stays
   hidden in BOTH directions, not just on the way down. */
const BLACKOUT_IDS = ['range']
/* How much of the viewport a blackout section must cover before it takes over.
   Below 1 so the bar is already gone as the section fills the screen, rather
   than switching exactly on the boundary. */
const BLACKOUT_COVERAGE = 0.6

/* While the hero's sticky stage is still under the bar, the phone layout runs
   the bar fully transparent over the footage — see the max-width:767px block on
   .acti-header in index.css. This is measured from the stage's box rather than
   from --acti-tone, because on the reduced-motion path nothing is scrubbing the
   tone and a threshold flip would leave the bar cream over the video. */
const HERO_ID = 'top'

/*
 * The one piece of chrome that survives both scenes. It never re-renders on
 * scroll: Hero.jsx writes --acti-tone (0 = over the dark hero, 1 = over the
 * bright kitchen) and every colour below is derived from that variable in CSS.
 * See the ".acti-header" block in index.css.
 *
 * Show/hide is handled the same way — a data-hidden attribute written straight
 * to the node, never React state, so a scroll costs no render. The page is
 * driven by Lenis, so this reads window.scrollY inside a rAF rather than
 * listening for native scroll events, which Lenis does not emit on its own.
 */
export default function ActiproHeader() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  /* The nav is a list of hash anchors (#why, #products …) and those ids only
     exist on the landing page. Left as bare "#why" they are dead links on
     /contact — the browser looks for the id on the CURRENT page, finds
     nothing, and does nothing. Prefixing with "/" on any other route turns
     them into "navigate home, THEN jump to the section". */
  const { pathname } = useLocation()
  const onLanding = pathname === '/'
  const sectionHref = (hash) => (onLanding ? hash : `/${hash}`)

  useEffect(() => {
    const node = headerRef.current
    if (!node) return undefined

    // Travel is measured from the furthest point reached in the current
    // direction (`extreme`), so an eased 3px-per-frame glide accumulates
    // instead of being thrown away as jitter, while a few pixels of trackpad
    // counter-movement is not enough to flip the direction.
    let extreme = window.scrollY
    let hidden = false
    let frame = 0
    /* Resolved once — these sections are mounted for the life of the page.
       Looked up by id rather than passed in, so adding a full-bleed scene to
       the blackout list is a one-line change to BLACKOUT_IDS. */
    const blackouts = BLACKOUT_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    /* The sticky STAGE, not the hero section: the section runs on for the whole
       of --hero-exit, so its own box is still under the bar long after the
       footage has dissolved into the cabinet. The stage is the element that
       actually holds the video, and Hero fades it out (autoAlpha) the moment the
       dissolve completes — so its opacity is checked too. */
    const heroStage = document.getElementById(HERO_ID)?.firstElementChild ?? null
    /* Frames left before a freshly revealed bar may hide again. Revealing is
       hair-trigger, so without this the momentum that Lenis is still paying out
       after an upward flick immediately reads as "scrolling down" and the bar
       flaps straight back off screen. */
    let hold = 0

    const setHidden = (next) => {
      if (next === hidden) return
      hidden = next
      node.dataset.hidden = String(hidden)
      extreme = window.scrollY // measure the next run from here
      if (!next) hold = REVEAL_HOLD
    }

    // True while a blackout section covers enough of the viewport to own it.
    const inBlackout = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      return blackouts.some((el) => {
        const r = el.getBoundingClientRect()
        // How much of the viewport this section currently covers.
        const covered = Math.min(r.bottom, vh) - Math.max(r.top, 0)
        return covered / vh >= BLACKOUT_COVERAGE
      })
    }

    /* True while the hero footage is still the thing behind the bar. Both tests
       matter: the box test catches the hero scrolling away, and the opacity test
       catches the dissolve finishing while the stage is still pinned in place. */
    const overHero = () => {
      if (!heroStage) return false
      const r = heroStage.getBoundingClientRect()
      if (r.bottom <= node.offsetHeight) return false
      return parseFloat(getComputedStyle(heroStage).opacity) > 0.5
    }

    const tick = () => {
      const y = window.scrollY
      if (hold > 0) hold -= 1

      const hero = String(overHero())
      if (node.dataset.hero !== hero) node.dataset.hero = hero

      /* Frost the bar only once it actually has a cream background to frost.
         Over the hero --acti-tone is 0, so the bar is fully transparent and a
         backdrop blur would have nothing of its own to sit behind — it just
         smears the playing video into a band across the top of the scene.
         Reading the variable (rather than tracking scroll again) keeps this in
         step with the colour, which Hero.jsx already drives. */
      const tone = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--acti-tone'),
      )
      const frosted = String((Number.isNaN(tone) ? 0 : tone) > FROST_AT)
      if (node.dataset.frosted !== frosted) node.dataset.frosted = frosted

      /* A blackout section outranks the direction logic entirely: the bar goes
         and stays gone, whichever way the page is moving. `extreme` is kept in
         step so that on leaving the section the next gesture is measured from
         here rather than from wherever the bar was last toggled. */
      if (inBlackout()) {
        setHidden(true)
        extreme = y
        frame = requestAnimationFrame(tick)
        return
      }

      if (hidden) {
        // Hidden: watch for upward travel from the lowest point seen.
        extreme = Math.max(extreme, y)
        if (extreme - y > REVEAL_THRESHOLD) setHidden(false)
      } else {
        // Visible: watch for sustained downward travel from the highest point.
        extreme = Math.min(extreme, y)
        if (hold === 0 && y - extreme > HIDE_THRESHOLD && y > HIDE_AFTER) setHidden(true)
      }

      // Never leave it hidden at the top of the page.
      if (y <= HIDE_AFTER) setHidden(false)

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // An open mobile menu must not slide away underneath the user's finger.
  useEffect(() => {
    if (open && headerRef.current) headerRef.current.dataset.hidden = 'false'
  }, [open])

  // With the scrub disabled there is nothing driving the tone, so fall back to
  // a plain threshold. index.css gives the header a transition in this mode.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!media.matches) return undefined

    const onScroll = () => setSceneTone(window.scrollY > window.innerHeight * 0.6 ? 1 : 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // data-hero starts true because the page always opens on the hero: on phone
    // that attribute is what keeps the bar transparent (see index.css), and
    // starting false would flash a cream bar before the first rAF corrects it.
    /* data-hero drives the light-on-dark inversion used over the hero video.
       Only the landing page has one; starting it 'true' on another route
       flashes a white-on-cream bar for a frame before the rAF tick corrects
       it, so it is bound to the route rather than hard-coded. */
    <header
      ref={headerRef}
      className="acti-header fixed inset-x-0 top-0 z-50"
      data-solid={open ? 'true' : 'false'}
      data-hidden="false"
      data-frosted="false"
      data-hero={onLanding ? 'true' : 'false'}
    >
      <div className="acti-shell acti-shell--wide flex items-center justify-between gap-6 py-4">
        <Link to="/" className="relative flex shrink-0 items-center" aria-label="Actipro home">
          {/* Two stacked prints crossfade — cleaner than filtering one through grey */}
          <img
            src="/logo/actipro.png"
            alt="Actipro Refined Sunflower Oil"
            className="acti-logo-light h-10 w-auto sm:h-12"
          />
          <img
            src="/logo/actipro.png"
            alt=""
            aria-hidden="true"
            className="acti-logo-dark absolute left-0 top-0 h-10 w-auto brightness-0 invert sm:h-12"
          />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={sectionHref(link.href)}
                className="acti-tone-ink text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ))}

            {/* Contact is a ROUTE, not a section, so it is a <Link> rather
                than one of the hash anchors above. */}
            <Link
              to="/contact"
              className="acti-tone-ink text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="tel:+919425066485"
              aria-label="Call Actipro"
              className="acti-tap acti-tone-ink acti-tone-border flex h-9 w-9 items-center justify-center rounded-full border"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>

            <Link
              to="/contact"
              className="acti-tone-cta hidden rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] sm:inline-flex"
            >
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="acti-tap acti-tone-ink acti-tone-border flex h-9 w-9 items-center justify-center rounded-full border lg:hidden"
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
                  href={sectionHref(link.href)}
                  onClick={() => setOpen(false)}
                  className="block border-b border-acti-ink/10 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-acti-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block border-b border-acti-ink/10 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-acti-ink"
              >
                Contact Us
              </Link>
            </li>
          </ul>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="acti-tap mt-5 flex items-center justify-center rounded-full bg-acti-sun px-5 py-3 text-center text-[12px] font-bold uppercase tracking-[0.12em] text-acti-ink"
          >
            Enquire
          </Link>
        </nav>
      )}
    </header>
  )
}
