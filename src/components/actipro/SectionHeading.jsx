export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', tone = 'dark' }) {
  const isLight = tone === 'light'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold uppercase tracking-[0.22em] ${
            isLight ? 'text-acti-sun' : 'text-acti-orange'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 font-serif text-3xl leading-tight sm:text-[2.6rem] ${
          isLight ? 'text-white' : 'text-acti-ink'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[17px] leading-relaxed ${isLight ? 'text-white/75' : 'text-acti-ink/65'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
