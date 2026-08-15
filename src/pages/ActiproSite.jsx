import { useEffect } from 'react'
import ActiproHeader from '../components/actipro/ActiproHeader'
import Hero from '../components/actipro/Hero'
import ScrollReveal from '../components/actipro/ScrollReveal'
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
        <ScrollReveal />
      </main>
      <ActiproFooter />
    </div>
  )
}
