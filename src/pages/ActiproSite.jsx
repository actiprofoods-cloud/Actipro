import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import Hero from '../components/actipro/Hero'
import Ticker from '../components/actipro/Ticker'
import Why from '../components/actipro/Why'
import ScrollReveal from '../components/actipro/ScrollReveal'
import Products from '../components/actipro/Products'
import Nutrition from '../components/actipro/Nutrition'
import Process from '../components/actipro/Process'
import Kitchen from '../components/actipro/Kitchen'
import Reviews from '../components/actipro/Reviews'
import Faq from '../components/actipro/Faq'
import Contact from '../components/actipro/Contact'
import ActiproFooter from '../components/actipro/ActiproFooter'

export default function ActiproSite() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Actipro — Refined Sunflower Oil by Madhuri Refiners'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="bg-white">
      <ActiproHeader />
      <main>
        <Hero />
        <Ticker />
        <Why />
        <ScrollReveal />
        <Products />
        <Nutrition />
        <Process />
        <Kitchen />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <ActiproFooter />
    </div>
  )
}
