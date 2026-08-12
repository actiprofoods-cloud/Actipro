import { useEffect, useRef } from 'react'
import HeroProducts from './HeroProducts'

export default function Hero() {
  const videoRef = useRef(null)

  // React sets `muted` as a property, but belt-and-braces: force it on mount so
  // the hero can never play sound, and so autoplay is never blocked for audio.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.volume = 0
  }, [])

  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-acti-ink">
      {/* 1280x720 landscape — fills the hero edge to edge with no letterboxing. */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.45] saturate-[0.9]"
        src="/video/hero.mp4"
        poster="/video/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/10 to-black/45" />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-14 pt-32 sm:px-10 sm:pb-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
              Lite hai. Right hai.
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-white sm:text-6xl lg:text-[4.25rem]">
              The right oil makes everything lighter.
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="rounded-full bg-acti-sun px-9 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-acti-ink transition-colors hover:bg-acti-orange hover:text-white"
              >
                See the range
              </a>
              <a
                href="#contact"
                className="text-[12px] font-bold uppercase tracking-[0.18em] text-white underline-offset-8 hover:underline"
              >
                Become a distributor
              </a>
            </div>
          </div>

          <HeroProducts />
        </div>
      </div>
    </section>
  )
}
