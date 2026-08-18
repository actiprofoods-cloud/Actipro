import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import OurPlant from './components/OurPlant'
import Actipro from './components/Actipro'
import Footer from './components/Footer'
import ActiproSite from './pages/ActiproSite'
import ContactPage from './pages/ContactPage'

function MadhuriLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* New Actipro website — landing page, its own header/footer */}
      <Route path="/" element={<ActiproSite />} />

      {/* Contact Us — its own page, not a section of the landing page. It
          reuses the Actipro header and footer, so it sits outside
          MadhuriLayout (which carries the OLDER site's chrome). */}
      <Route path="/contact" element={<ContactPage />} />

      {/* Older pages, kept together under /post-work */}
      <Route path="/our-plant" element={<MadhuriLayout />}>
        <Route index element={<OurPlant />} />
        <Route path="our-plant" element={<OurPlant />} />
        <Route path="actipro/our-plant" element={<Actipro />} />
      </Route>
    </Routes>
  )
}

export default App
