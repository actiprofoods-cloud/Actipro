import { motion, useReducedMotion } from 'framer-motion'
import {
  Sprout,
  Factory,
  Droplet,
  Users,
  Globe,
  Leaf,
  ShieldCheck,
  Heart,
  Settings,
  Award,
  Milk,
  MapPin,
} from 'lucide-react'

/*
 * ABOUT US — /about.
 *
 * Built to a supplied reference: a produce hero, a five-stop journey timeline,
 * four content cards, a stat strip and a closing line. It reuses the site's
 * ActiproHeader/Footer (see AboutPage.jsx) so it reads as the same site.
 *
 * ── IMAGES ──────────────────────────────────────────────────────────────────
 * The hero background is public/about/"bg (4).png" — see HERO_BG below. The
 * filename carries a space and parentheses, so the URL must stay encoded; do
 * not "fix" it to a bare name without also renaming the file on disk, or the
 * hero loses its background.
 *
 * The four card photos are the numbered files 1..4 in /about/ ("1 (5).png"
 * etc.), one per card in order. Their names carry spaces and parentheses, so
 * the paths are URL-encoded (%20, the parens left literal — browsers accept
 * them unencoded in a path). Each card's <img> has an onError that hides it,
 * leaving the cream image box, so a missing file degrades rather than breaks.
 */

/* The supplied about-page background. The filename carries a space and
   parentheses, so it is URL-encoded — bg%20(4).png. Replaces the earlier
   "hero .png"; that file is still on disk, unused. */
const HERO_BG = '/about/bg%20(4).png'

/* The five journey stops, left to right. Data-driven so the copy and icons are
   tuned in one place; the connector line and dots are drawn by the layout. */
const JOURNEY = [
  { Icon: Sprout, year: '2013', title: 'It All Started', body: 'A small idea born from decades of edible-oil expertise and a passion for better living.' },
  { Icon: Factory, title: 'Built on Expertise', body: 'Backed by Madhuri Refiners Pvt. Ltd., we combined tradition with advanced refining to craft pure, high-quality oils.' },
  { Icon: Droplet, title: 'Pure by Choice', body: 'We chose purity over shortcuts. Every drop is refined, tested and packed with care.' },
  { Icon: Users, title: 'Growing with Trust', body: 'Millions of families across India choose ActiPro for their kitchens. That trust drives us every day.' },
  { Icon: Globe, title: 'Towards a Better Tomorrow', body: 'We continue to innovate responsibly — for healthier families, stronger communities and a better nation.' },
]

/* The four content cards. `img` is the card's photo, `points` are the icon+
   heading+body rows beneath it. */
const CARDS = [
  {
    kicker: "How It's Made",
    img: '/about/1%20(5).png',
    points: [
      { Icon: Leaf, title: 'Carefully Sourced', body: 'We select the finest seeds from trusted farmers.' },
      { Icon: Droplet, title: 'Advanced Refining', body: 'Multiple refining stages to remove impurities while retaining natural goodness.' },
      { Icon: ShieldCheck, title: 'Tested & Packed', body: 'Every batch is quality tested and hygienically packed to ensure purity in every drop.' },
    ],
  },
  {
    kicker: "Why We're Different",
    img: '/about/2%20(4).png',
    points: [
      { Icon: Droplet, title: '100% Pure Oils', body: 'No additives. No fillers. Just pure, natural oils.' },
      { Icon: ShieldCheck, title: 'Transparent & Honest', body: 'Clear labeling, complete traceability and no hidden ingredients.' },
      { Icon: Heart, title: 'Health First', body: 'Oils that support a healthy life, every day.' },
      { Icon: Settings, title: 'Consistent Quality', body: 'Every drop meets the highest standards of purity.' },
    ],
  },
  {
    kicker: 'Goodness Beyond the Bottle',
    img: '/about/3%20(5).png',
    points: [
      { Icon: Sprout, title: 'Empowering Farmers', body: 'We work closely with farmers and support sustainable livelihoods.' },
      { Icon: Users, title: 'Supporting Communities', body: 'From education to wellness, we invest in initiatives that uplift lives.' },
      { Icon: Globe, title: 'Better for the Nation', body: 'Promoting healthier choices today for a stronger, healthier India tomorrow.' },
    ],
  },
  {
    kicker: 'Our Promise to You',
    img: '/about/4%20(3).png',
    points: [
      { Icon: Droplet, title: 'No Additives', body: '' },
      { Icon: ShieldCheck, title: 'No Fillers', body: '' },
      { Icon: Heart, title: 'No Compromises', body: '' },
      { Icon: Settings, title: 'Only Goodness', body: '' },
    ],
  },
]

/* The bottom stat strip. */
const STATS = [
  { Icon: Award, stat: '30+', label: 'Years of expertise in edible oil manufacturing' },
  { Icon: Milk, stat: '6', label: 'Thoughtfully crafted oil variants' },
  { Icon: Users, stat: 'Millions', label: 'Of happy families across India' },
  { Icon: MapPin, stat: '100%', label: 'Proudly made in India' },
  { Icon: Leaf, stat: '1', label: 'Promise — better oil for a better tomorrow' },
]

/* A small caps eyebrow with a short gold rule under it, used above each of the
   page's section headings so they read as one family. */
function Eyebrow({ children }) {
  return (
    <div className="text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8A7A5C]">
        {children}
      </p>
      <span className="mx-auto mt-3 block h-[3px] w-12 rounded-full bg-[#E0A42B]" />
    </div>
  )
}

/* The circular icon badge shared by the journey stops and the card points, so
   they read as the same mark at two sizes. */
function IconBadge({ Icon, size = 'md' }) {
  const box = size === 'lg' ? 'h-14 w-14' : 'h-9 w-9'
  const px = size === 'lg' ? 24 : 17
  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-full border border-[#C9A961]/60 bg-[#FFFDF8]`}
    >
      <Icon size={px} strokeWidth={1.5} className="text-[#55692B]" aria-hidden="true" />
    </span>
  )
}

/* The journey row. Each card animates itself via whileInView, so there is no
   shared observer or state here — the row is just the grid. */
function JourneyRow() {
  const reduced = useReducedMotion()

  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
      {JOURNEY.map(({ Icon, year, title, body }, i) => (
        <motion.article
          key={title}
          className="jr-card"
          /* whileInView rather than a useInView flag driving `animate`.
             With `animate={show ? {...} : undefined}` the cards sat at their
             initial opacity 0 whenever the observer had not fired yet — and
             if the section is already on screen at load, or the observer is
             slow, they simply never appeared. whileInView is self-completing:
             framer runs it the moment the element is in view, including on
             first paint, so a card can never be left invisible. */
          initial={reduced ? false : { opacity: 0, x: 64 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.11 }
          }
        >
          {/* The number tab, sitting in the notch cut from the top-right. */}
          <span className="jr-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>

          <span className="jr-badge">
            <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
          </span>

          {year && <p className="jr-year">{year}</p>}
          <h3 className="jr-title">{title}</h3>
          <p className="jr-body">{body}</p>
        </motion.article>
      ))}
    </div>
  )
}

export default function AboutUs() {
  return (
    <div className="bg-[#FBF4E8]">
      {/* HERO — the produce photo shown WHOLE, running edge-to-edge and up
          BEHIND the transparent header, so the bar has no cream band of its own
          and reads as part of the image.

          NO top padding and NO cream band on the section: an earlier version
          padded the section by the bar height, which is exactly the pale strip
          across the top that was making the header look "different" from the
          hero. The image now starts at y=0; the header (transparent, --acti
          -tone:1) sits over the image's top strip, which is empty shadowed wall,
          so it covers no real content.

          The image keeps its real aspect ratio (1717x822) with bg-contain so
          the whole frame still shows — vase/leaves at the top, produce at the
          base — cropping nothing. bg-[#FBF4E8] fills any letterbox seamlessly.

          The heading is centred in the frame, but nudged down by the bar height
          (pt on the content box) so it never rides under the nav on short
          viewports — the IMAGE runs under the bar, the TEXT does not.

          BELOW lg THE OVERLAY COMES APART: the aspect-locked box is shorter
          than the copy (at 375px it is ~180px tall against ~450px of text), so
          the absolutely-positioned copy overflowed onto the journey section.
          On narrow screens the copy sits in normal flow on the cream ground
          and the photo follows it as its own full-width band — same content,
          nothing can overlap. lg is the switch point because the overlay only
          has room for the copy from ~1024px up. */}
      <section className="relative w-full bg-[#FBF4E8]">
        <div
          className="hidden w-full bg-contain bg-top bg-no-repeat lg:block"
          style={{ backgroundImage: `url("${HERO_BG}")`, aspectRatio: '1768 / 774' }}
          aria-hidden="true"
        />
        {/* lg:justify-start (was justify-center) lifts the copy toward the top
            of the frame; pt clears the fixed bar so it sits just under it. */}
        <div className="acti-shell flex flex-col items-center pt-[88px] text-center lg:absolute lg:inset-0 lg:justify-start lg:pt-[9%]">
          {/* The "ABOUT US" eyebrow was removed on request — the heading now
              opens the hero directly. mt-0 on the h1 because there is no longer
              an eyebrow above it to space away from. */}
          <h1 className="font-serif text-[34px] leading-[1.05] text-[#2C3E1C] sm:text-[44px] lg:text-[64px]">
            Goodness has a
            <br />
            <span className="italic text-[#E0A42B]">beginning.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[#4A4438]">
            ActiPro began with a simple belief — that everyday cooking oil can do
            more than just cook. It can care, protect and contribute to a better
            life.
          </p>

          <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-relaxed text-[#4A4438]">
            From our first drop to every bottle today, our purpose has stayed the
            same:
            <br />
            <span className="font-bold text-[#2C3E1C]">
              Better oil. Better health. Better tomorrow.
            </span>
          </p>
        </div>

        {/* The narrow-screen photo band — the same file, in flow under the
            copy. Hidden at lg where the overlay layout takes over. */}
        <div
          className="mt-8 w-full bg-contain bg-top bg-no-repeat lg:hidden"
          style={{ backgroundImage: `url("${HERO_BG}")`, aspectRatio: '1768 / 774' }}
          aria-hidden="true"
        />
      </section>

      {/* OUR JOURNEY — five notched cards, built to the supplied reference.

          Each card is a panel with a DIAGONAL NOTCH cut from its top-right
          corner and a dark green number tab sitting in that notch. The shape
          is a clip-path polygon, not a border trick: a border cannot follow a
          cut corner, and an ::after triangle would sit ON the card rather than
          removing part of it.

          MOTION: the cards enter one after another, sliding in from the RIGHT
          and settling into the row. Staggered by index so the row assembles
          left to right rather than all five arriving at once. Each card runs
          its own whileInView, so it animates as soon as it is on screen;
          reduced motion skips the movement and renders the row in place. */}
      {/* pt trimmed: the hero's art already ends with clear space of its own,
          so a full py-16/20 on top of it left a visibly empty band between the
          two sections. The bottom padding is unchanged — the gap BELOW the
          cards still needs to breathe. */}
      <section className="acti-shell pb-16 pt-6 md:pb-20 md:pt-8">
        <Eyebrow>Our Journey</Eyebrow>

        <h2 className="mt-5 text-center font-serif text-[26px] leading-tight text-[#2C3E1C] sm:text-[32px]">
          Rooted in purity. Committed to tomorrow.
        </h2>

        <JourneyRow />
      </section>

      {/* FOUR CONTENT CARDS — laid out exactly like the reference:
            heading (small caps + gold rule) → image band → point list → CTA.
          No card border or panel: the cards sit open on the cream page. The
          grid's default stretch makes all four the same height, and the point
          list is flex-1 so every card's CTA lands on the same bottom line. */}
      <section className="acti-shell grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <article
            key={card.kicker}
            /* CARD PANEL — soft cream fill, hairline border, rounded corners.
               overflow-hidden clips the image to the rounded top corners, and
               there is NO padding on the article itself: the image bleeds to the
               card's top and side edges, and the text sections below carry their
               own horizontal padding instead. */
            className="flex flex-col overflow-hidden rounded-2xl border border-[#EADFC9] bg-[#FBF6EC]/70"
          >
            {/* IMAGE with the HEADING laid over it. Full-bleed to the card's
                top and sides (the article's overflow-hidden clips it to the
                rounded top). aspect-[3/4] makes it BIGGER/taller than the old
                4/3 band. A dark bottom-to-top scrim keeps the white title and
                gold rule readable over any photo. The title is the card's only
                heading now — there is no separate one below. */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE4D3]">
              <img
                src={card.img}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              {/* Scrim, top-weighted so the heading (which sits at the TOP of
                  the image) stays legible. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-2/5"
                style={{
                  background: 'linear-gradient(to bottom, rgba(20,15,8,0.6), rgba(20,15,8,0))',
                }}
              />

              {/* Heading INSIDE the image, at the top. min-h holds two lines so
                  every card's image is the same height regardless of whether
                  the title wraps. */}
              <div className="absolute inset-x-0 top-0 z-10 px-5 pt-5">
                <h3 className="flex min-h-[2.6em] items-start text-[16px] font-bold uppercase leading-tight tracking-[0.06em] text-white">
                  {card.kicker}
                </h3>
                <span className="mt-2 block h-px w-9 bg-[#C9A961]" />
              </div>
            </div>

            {/* POINT LIST — padded; flex-1 so it absorbs the height difference
                between cards and pins every CTA to the same bottom edge. */}
            <ul className="mb-2 mt-6 flex flex-1 flex-col gap-5 px-5 pb-5">
              {card.points.map(({ Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <IconBadge Icon={Icon} />
                  <div>
                    <p className="text-[13px] font-bold text-[#2C3E1C]">{title}</p>
                    {body && (
                      <p className="mt-0.5 text-[12px] leading-snug text-[#5C5347]">{body}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* STAT STRIP. */}
      <section className="acti-shell pb-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 rounded-2xl border border-[#EADFC9] bg-[#F3EAD8] px-6 py-9 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map(({ Icon, stat, label }, i) => (
            <div
              key={stat + label}
              /* A divider AFTER each stat except the last, dropping between it
                 and the next — the vertical rule the reference shows between the
                 figures. It is a left border on every item but the first (i>0),
                 shown only on the lg single-row layout where a vertical split
                 between columns reads correctly; on the wrapped 2/3-col layouts
                 a left border would land mid-row. */
              className={`flex items-center gap-4 ${
                i > 0 ? 'lg:border-l lg:border-[#D8CBB0] lg:pl-6' : ''
              }`}
            >
              {/* 44px, up from 30 — the reference icons are noticeably larger
                  than the label text they sit beside. */}
              <Icon size={44} strokeWidth={1.3} className="shrink-0 text-[#55692B]" aria-hidden="true" />
              <div>
                <p className="font-serif text-[26px] leading-none text-[#2C3E1C]">{stat}</p>
                <p className="mt-1 text-[11px] leading-tight text-[#5C5347]">{label}</p>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}
