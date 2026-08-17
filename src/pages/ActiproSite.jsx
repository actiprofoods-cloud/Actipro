import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActiproHeader from '../components/actipro/ActiproHeader'
import Hero from '../components/actipro/Hero'
import KitchenReveal from '../components/actipro/KitchenReveal'
import Milestones from '../components/actipro/Milestones'
import MissionVision from '../components/actipro/MissionVision'
import WhyTrust from '../components/actipro/WhyTrust'
import TrustSection from '../components/actipro/TrustSection'
import ActiproFooter from '../components/actipro/ActiproFooter'
import { resetSceneTone } from '../components/actipro/sceneTone'

gsap.registerPlugin(ScrollTrigger)

/*
 * Page order — the two cinematic scenes first, then the argument, then proof:
 *
 *   Hero           #top       oil pour, then the dissolve out       (scrubbed)
 *   KitchenReveal  #range     the cabinet, opened by the scroll     (scrubbed)
 *   TrustSection   #rooted    "Trust in every drop" — four pillars  (static)
 *   WhyTrust       #trust     "Made for real kitchens"              (pinned)
 *   MissionVision  #purpose   mission & vision cards                (static)
 *   Milestones     #mission   "What we have built so far"           (scrubbed)
 *
 * Note the ids do not match the component names — #trust belongs to WhyTrust and
 * #mission to Milestones, both predating the sections that read like their
 * owners. Check the component before wiring an anchor to either.
 *
 * The older sections (Ticker, Why, Products, Nutrition, Process, Kitchen,
 * Reviews, Faq, Contact) are unmounted, not deleted — their files are still
 * under src/components/actipro/ ready to be slotted back in.
 */
export default function ActiproSite() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Actipro — Refined Sunflower Oil by Madhuri Refiners'
    return () => {
      document.title = previous
      resetSceneTone()
    }
  }, [])

  /*
   * Smooth scroll (Lenis), driving every scrubbed scene on the page.
   *
   * Lenis has to own the page, not one section — the scenes here are GSAP pins,
   * and a scroller scoped to a single section would be fighting them. The three
   * lines that matter are the handshake with ScrollTrigger:
   *
   *   lenis.on('scroll', ScrollTrigger.update)  ScrollTrigger reads Lenis's
   *                                             position instead of the native one
   *   gsap.ticker drives lenis.raf              one clock for both, so the pin and
   *                                             the eased scroll never disagree
   *   lagSmoothing(0)                           GSAP's frame-skip recovery would
   *                                             desync the scrub after a stall
   *
   * Reduced motion gets the native scroller — easing the page is exactly the
   * kind of motion that setting is asking us not to do.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential settle — long enough to feel smooth, short enough
      // that the pinned scenes still track the wheel closely.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      // Touch devices already have momentum of their own; doubling it feels wrong.
      smoothWheel: true,
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-acti-cream">
      <ActiproHeader />
      <main>
        <Hero />
        <KitchenReveal />
        <TrustSection />
        <WhyTrust />
        <MissionVision />
        <Milestones />
      </main>
      <ActiproFooter />
    </div>
  )
}
