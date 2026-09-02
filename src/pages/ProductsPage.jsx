import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import RangePage from '../components/actipro/RangePage'
import ActiproFooter from '../components/actipro/ActiproFooter'

/*
 * /products — the six-oil range page.
 *
 * Same shape as AboutPage and ContactPage: the Actipro header and footer wrap
 * the body so the page reads as part of the same site, and it sits outside
 * MadhuriLayout (which carries the OLDER site's chrome).
 *
 * No Lenis here. The page is static, and a second smooth-scroll instance would
 * only add easing lag to ordinary scrolling.
 *
 * .about-page is reused rather than copied: that class pins --acti-tone to 1,
 * which keeps the header's nav ink dark over a light hero. This hero is the
 * same cream as About's, so it needs exactly that behaviour — a products-only
 * duplicate of the rule would be the same declarations under a new name.
 */
export default function ProductsPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Our Range of Oils — Actipro by Madhuri Refiners'
    return () => {
      document.title = previous
    }
  }, [])

  // Arriving from a link should start at the top, not restore the prior scroll.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    /* products-page scopes this page's header treatment (transparent over the
       cream hero, and PINNED so it never retracts on scroll). It kept the
       about-page class before, borrowing that page's header rules; it now has
       its own so the two can diverge. */
    <div className="products-page bg-acti-cream">
      <ActiproHeader />
      <main>
        <RangePage />
      </main>
      <ActiproFooter />
    </div>
  )
}
