import Breadcrumb from './Breadcrumb'

export default function Actipro() {
  return (
    <section id="actipro">
      <Breadcrumb title="ACTIPRO" trail={['Home', 'Actipro']} />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <img src="/logo/acti-pro-logo.jpg" alt="Actipro" className="mx-auto h-auto w-full max-w-md" />
      </div>
    </section>
  )
}
