import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import HealthyTips from '../components/actipro/HealthyTips'
import ActiproFooter from '../components/actipro/ActiproFooter'

/*
 * /healthy-tips — Healthy Tips as its own page.
 *
 * Built the same way as ContactPage: a page rather than a section of the
 * landing page, carrying the Actipro header and footer so it reads as part of
 * the same site, with the tips between them.
 *
 * No Lenis, for the same reason ContactPage has none — that easing exists to
 * serve the landing page's GSAP scrubs, and this page has none. A second Lenis
 * instance would add a dependency and a lag to what is a page of text.
 *
 * .healthy-tips-page is what scopes the header override: like /contact this
 * route never writes --acti-tone (only Hero.jsx does), so without pinning it
 * the bar would sit at the :root default of 0 and render white-on-cream. See
 * the ".healthy-tips-page .acti-header" block in index.css.
 */
export default function HealthyTipsPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Healthy Tips — Actipro by Madhuri Refiners'
    return () => {
      document.title = previous
    }
  }, [])

  /* Arriving from a link should start at the top; otherwise the browser
     restores the scroll position of whatever page was left behind. */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="healthy-tips-page bg-acti-cream">
      <ActiproHeader />
      <main>
        <HealthyTips />
      </main>
      <ActiproFooter />
    </div>
  )
}
