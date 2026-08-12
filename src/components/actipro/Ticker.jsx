const ITEMS = [
  'Fortified with Vitamin A & D',
  'Zero cholesterol',
  'Rich in Vitamin E',
  'Light & non-sticky',
  'High smoke point',
  '100% vegetarian',
  'Six-stage refining',
  'FSSAI licensed plants',
]

export default function Ticker() {
  return (
    <div className="overflow-hidden bg-acti-orange py-3.5 text-white">
      <div className="acti-marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex gap-10 pr-10" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.14em]"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
