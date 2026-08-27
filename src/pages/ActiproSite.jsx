import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActiproHeader from '../components/actipro/ActiproHeader'
import Hero from '../components/actipro/Hero'
import KitchenReveal from '../components/actipro/KitchenReveal'
import MilestonesWave from '../components/actipro/MilestonesWave'
import PurposeRing from '../components/actipro/PurposeRing'
import WhyActipro from '../components/actipro/WhyActipro'
import TrustSection from '../components/actipro/TrustSection'
import ActiproFooter from '../components/actipro/ActiproFooter'
import { resetSceneTone } from '../components/actipro/sceneTone'

gsap.registerPlugin(ScrollTrigger)

/*
 * Page order — the hero, then the range, then the argument, then proof:
 *
 *   Hero            #top      oil pour, then the dissolve           (scrubbed)
 *   KitchenReveal   #range    cabinet doors opening, canvas frames  (scrubbed)
 *   TrustSection    #rooted   "Trust in every drop" — four pillars  (static)
<<<<<<< HEAD
 *   WhyActipro      #trust    "More than just oil" — carousel       (static)
 *   PurposeRing     #purpose  mission & vision, circular progress   (pinned)
 *   MilestonesWave  #milestones-wave  five nodes over a looping     (static)
 *                                     oil-ribbon video
=======
 *   WhyTrust        #trust    "Made for real kitchens"              (pinned)
 *   MissionVision   #purpose  mission & vision cards                (static)
 *   Milestones      #mission  "What we have built so far"           (scrubbed)
>>>>>>> 5128b544f967ea98d8360e9fdcc251466bcfbba9
 *
 * Note the ids do not match the component names — #trust belongs to
 * WhyActipro, predating the section that reads like its owner. Check the
 * component before wiring an anchor to it.
 *
<<<<<<< HEAD
 * MilestonesWave REPLACED Milestones here. The old vertical-timeline section
 * is still in the tree (components/actipro/Milestones.jsx) but is no longer
 * mounted — and with it went the #mission id, which it owned. Anything that
 * linked to #mission is now a dead anchor.
 *
 * The older sections (Ticker, Why, Products, ProductShowcase, Nutrition,
 * Process, Kitchen, KitchenDrawer, LayeredPurity, MissionVision, WhyTrust,
 * Reviews,
 * Faq) are unmounted, not deleted — their files are still under
 * src/components/actipro/ ready to be slotted back in.
=======
 * The older sections (Ticker, Why, Products, ProductShowcase, Nutrition,
 * Process, Kitchen, KitchenDrawer, LayeredPurity, Reviews, Faq) are unmounted,
 * not deleted — their files are still under src/components/actipro/ ready to
 * be slotted back in.
>>>>>>> 5128b544f967ea98d8360e9fdcc251466bcfbba9
 *
 * Contact is NOT among them: it is its own route now (/contact, see
 * src/pages/ContactPage.jsx), not a section of this page. The header's
 * "Contact Us" link and its Enquire button both navigate there.
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
      /* 1.5, up from 1.05 — the glide takes longer to settle after the wheel
         stops, so the page comes to rest gently instead of snapping. */
      duration: 1.5,
      // Gentle exponential settle — long enough to feel smooth, short enough
      // that the pinned scenes still track the wheel closely.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      /* The pace control, and the one that actually matters here. duration
         alone only changes how long the EASE runs — one notch still covers the
         same distance, so the page keeps its speed and merely floats longer,
         which reads as sluggish rather than slower. This cuts how far a single
         notch travels, so the page genuinely moves less per gesture.

         Kept at 0.7 rather than lower because every pinned scene on this page
         (Hero, KitchenReveal, Milestones, PurposeRing) is scrubbed by scroll
         DISTANCE: the smaller this gets, the more real scrolling it takes to
         play a scene through, and too low turns the 400vh runways into a
         chore. */
      wheelMultiplier: 0.7,
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
        <WhyActipro />
        <PurposeRing />
        <MilestonesWave />
      </main>
      <ActiproFooter />
    </div>
  )
}
