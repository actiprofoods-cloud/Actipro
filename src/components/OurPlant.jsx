import Breadcrumb from './Breadcrumb'

const PLANTS = [
  {
    code: 'MD',
    name: 'Madhuri Refiners Pvt. Ltd.',
    address:
      'Survey No.1033 To 1037, 1067 To 1071 Village Dhannad, Tes. Depalpur, Rau Pithampur Road, Depalpur, Indore (M.P.) – 453001',
    fssai: '11423999000077',
  },
  {
    code: 'PT',
    name: 'Parshvakrupa Trading Co.',
    address: 'Gate No. 501 Tirupate Complex, Naygaon Road, Shinde Gaon, Nashik (Rural) Maharashtra – 42210',
    fssai: '11522999000229',
  },
  {
    code: 'MM',
    name: 'Madhuri Refiners Pvt. Ltd.',
    address: 'Survey No. 1202/7, Neemuch Bypass Road, Mandsaur (M.P.) – 458664',
    fssai: '10016026000970',
  },
]

function PlantCard({ plant }) {
  return (
    <div className="rounded-lg bg-gray-100 p-8">
      <p className="text-sm font-semibold tracking-wide text-gray-500">
        ({plant.code})&nbsp;&nbsp;{plant.name}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-500">{plant.address}</p>

      <div className="mt-6 flex items-center gap-2">
        <img src="/logo/fssai-logo.png" alt="FSSAI" className="h-6 w-auto" />
        <span className="text-lg font-bold text-[#c1121f]">{plant.fssai}</span>
      </div>
    </div>
  )
}

export default function OurPlant() {
  return (
    <section id="our-plant">
      <Breadcrumb title="OUR PLANT" trail={['Home', 'Our Plant']} />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PLANTS.map((plant) => (
            <PlantCard key={plant.code} plant={plant} />
          ))}
        </div>
      </div>
    </section>
  )
}
