import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import AboutUs from '../components/actipro/AboutUs'
import ActiproFooter from '../components/actipro/ActiproFooter'

/*
 * /about — About Us as its own page.
 *
 * Same shape as ContactPage: it reuses the Actipro header and footer so it
 * reads as part of the same site, with the About body between them, and it sits
 * outside MadhuriLayout (which carries the OLDER site's chrome).
 *
 * No Lenis: this page is static, and a second smooth-scroll instance would only
 * add an easing lag to ordinary scrolling. The header is fixed; the About hero
 * carries its own top padding to clear it (see AboutUs.jsx).
 *
 * .about-page scopes the header override — the bar pins --acti-tone to 1 here,
 * exactly as /contact does, so the nav ink stays dark over the light produce
 * hero. Keyed off this class so the landing page is untouched.
 */
export default function AboutPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'About Us — Actipro by Madhuri Refiners'
    return () => {
      document.title = previous
    }
  }, [])

  // Arriving from a link should start at the top, not restore the prior scroll.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="about-page bg-acti-cream">
      <ActiproHeader />
      <main>
        <AboutUs />
      </main>
      <ActiproFooter />
    </div>
  )
}
