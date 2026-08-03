function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Breadcrumb({ title, trail }) {
  return (
    <div>
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {trail.map((crumb, index) => (
            <span key={crumb} className="flex items-center gap-2">
              {index > 0 && <ChevronRightIcon />}
              <span className={index === trail.length - 1 ? 'text-gray-800' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
