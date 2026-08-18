import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import Contact from '../components/actipro/Contact'
import ActiproFooter from '../components/actipro/ActiproFooter'

/*
 * /contact — Contact Us as its own page.
 *
 * A page, not a section of the landing page: it carries the same header and
 * footer as ActiproSite so it reads as part of the same site, with the Contact
 * body between them.
 *
 * No Lenis here, unlike ActiproSite. That page runs smooth scroll because its
 * scenes are GSAP scrubs that need it; this page is static, and a second Lenis
 * instance would only add a dependency and an easing lag to an ordinary form.
 *
 * The header is `fixed`, so it is out of flow and would sit on top of the
 * section's heading. The clearance is padding on .contact-scene rather than on
 * this wrapper (see index.css), so the background plate runs UP behind the
 * transparent bar instead of starting below it. ActiproSite needs none of this
 * because its hero is designed to run underneath the bar.
 *
 * .contact-page is also what scopes the header and footer overrides: the bar
 * loses its cream fill and pins --acti-tone to 1 here, and the footer's curve
 * is pulled up to overlap the plate. Both are keyed off this class so the
 * landing page is untouched.
 */
export default function ContactPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Contact Us — Actipro by Madhuri Refiners'
    return () => {
      document.title = previous
    }
  }, [])

  /* Landing on /contact from a link should start at the top. Without this the
     browser restores the scroll position from whatever page you came from. */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="contact-page bg-acti-cream">
      <ActiproHeader />
      <main>
        <Contact />
      </main>
      <ActiproFooter />
    </div>
  )
}
