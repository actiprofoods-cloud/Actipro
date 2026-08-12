import { useEffect, useRef, useState } from 'react'

// The clip's first ~4.5s is just the camera settling, so the scrub starts at
// frame 45 — the moment the cabinet doors begin to open.
const FIRST_FRAME = 45
const LAST_FRAME = 100
const FRAME_COUNT = LAST_FRAME - FIRST_FRAME + 1
const frameSrc = (i) => `/scroll/cabinet/f_${String(FIRST_FRAME + i).padStart(3, '0')}.webp`

const CAPTIONS = [
  {
    kicker: 'In every kitchen',
    line: 'The oil you reach for shapes the meal.',
  },
  {
    kicker: 'Open it up',
    line: 'Behind the door, a shelf you can trust.',
  },
  {
    kicker: 'Our range',
    line: 'Four oils. One refinery. Every batch tested.',
  },
]

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export default function ScrollReveal() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const targetRef = useRef(0)
  const rafRef = useRef(0)

  const [ready, setReady] = useState(false)
  const [stage, setStage] = useState(0)

  // Frames are ~1.6 MB, so they only start downloading when the section is close.
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        imagesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
          const img = new Image()
          img.decoding = 'async'
          img.src = frameSrc(i)
          if (i === 0) img.onload = () => setReady(true)
          return img
        })
      },
      { rootMargin: '150% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!ready) return undefined

    const draw = (index) => {
      const canvas = canvasRef.current
      const img = imagesRef.current[index]
      if (!canvas || !img || !img.complete || !img.naturalWidth) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== Math.round(width * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }

      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // cover-fit the frame inside the canvas box
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
    }

    const render = () => {
      rafRef.current = 0
      const progress = targetRef.current
      draw(Math.round(progress * (FRAME_COUNT - 1)))
      const next = progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2
      setStage((current) => (current === next ? current : next))
    }

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(render)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      targetRef.current = 1
      schedule()
      return () => cancelAnimationFrame(rafRef.current)
    }

    const onScroll = () => {
      const node = sectionRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const runway = rect.height - window.innerHeight
      targetRef.current = runway > 0 ? clamp(-rect.top / runway, 0, 1) : 0
      schedule()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [ready])

  return (
    <section id="range" ref={sectionRef} className="relative h-[320vh] bg-acti-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Loading…
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-16 sm:px-10 sm:pb-20">
          <div className="mx-auto max-w-[1600px]">
            {CAPTIONS.map((caption, index) => (
              <div
                key={caption.kicker}
                className={`max-w-xl transition-all duration-700 ${
                  index === stage
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none absolute translate-y-4 opacity-0'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-acti-sun">
                  {caption.kicker}
                </p>
                <p className="mt-4 font-serif text-3xl leading-tight text-white sm:text-5xl">
                  {caption.line}
                </p>
                {index === 2 && (
                  <a
                    href="#products"
                    className="pointer-events-auto mt-8 inline-flex rounded-full bg-acti-sun px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-acti-ink transition-colors hover:bg-acti-orange hover:text-white"
                  >
                    See all four
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 mx-auto flex w-24 justify-center">
          <span className="h-0.5 w-full overflow-hidden rounded bg-white/20">
            <span
              className="block h-full bg-acti-sun transition-[width] duration-150"
              style={{ width: `${(stage / 2) * 100}%` }}
            />
          </span>
        </div>
      </div>
    </section>
  )
}
