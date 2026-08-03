import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import OurPlant from './components/OurPlant'
import Actipro from './components/Actipro'
import Footer from './components/Footer'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<OurPlant />} />
          <Route path="/actipro/our-plant" element={<Actipro />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
