import { Factory, Sprout, Droplet, ShieldCheck, Users } from 'lucide-react'

/*
 * MILESTONES (WAVE) — the looping-oil-wave variant.
 *
 * NOT the same section as Milestones.jsx, which is the vertical timeline with
 * the oil ribbon running down its spine. This one lays five nodes ACROSS a
 * looping video of a moving oil wave, each node sitting on a crest or trough.
 *
 * ── WHY EVERYTHING IS A PERCENTAGE ─────────────────────────────────────────
 * The nodes have to stay on their part of the wave at every width. The stage
 * therefore has a LOCKED aspect ratio matching the video, and every node is
 * placed with percentage left/top against that stage — so the whole layout
 * scales with the footage instead of drifting off it. A pixel offset anywhere
 * in here is a bug: it would hold its size while the video scaled and slide
 * off the crest it was pinned to.
 *
 * The stage's ratio MUST match the source clip. Swap the clip for one of a
 * different shape and STAGE_RATIO has to be changed with it: the video is
 * object-CONTAIN, so a mismatch letterboxes the footage inside the stage and
 * every node percentage then refers to a band of empty frame rather than to
 * the part of the ribbon it was placed against.
 */

/* Tailwind's aspect-[…] needs a literal at build time, so this is a class
   rather than a computed style. Change it here and the nodes follow.

   16/9 because the source clip is 1280x720 — VERIFIED with ffprobe against the
   file, not assumed. This must track the real footage: matching ratios is what
   lets object-contain fill the stage exactly, with no letterbox band for a
   node to land in. */
const STAGE_RATIO = 'aspect-[16/9]'

/* Set true to overlay a labelled 5% grid and a magenta dot at every anchor.
   The node y values are meant to be READ off the real frame with this on, not
   estimated — turn it on, pause the video, note where the ribbon's surface
   crosses each node's x, and copy those numbers into NODES. Ships false. */
const DEBUG = false

/*
 * The five nodes.
 *
 * x/y are percentages of the STAGE, not of the viewport, and they are the
 * single place positions are tuned — nothing downstream hard-codes a position.
 *
 * ONE RULE FOR ALL FIVE. Every node hangs BELOW the wave: the badge sits on the
 * line and the text hangs beneath it. No alternation, no per-node placement
 * flag — the only thing that varies between nodes is `y`, the wave's surface at
 * that x. That is what makes every node touch the line by construction.
 *
 * An earlier version alternated above/below and had to reverse the DOM order of
 * the above-nodes to keep their badge near the line. That is why it is not done
 * that way: reversing children puts the body copy first in the document, which
 * is the wrong reading order, and column-reverse would do the same. The
 * children are now in one fixed order for every node —
 * badge → number → label → body — and nothing flips.
 *
 *   02 and 04  y=49%  CRESTS   (high points of the ribbon)
 *   01, 03, 05 y=62%  TROUGHS  (low points)
 *
 * The 13-point spread is the wave's actual vertical travel across the frame.
 * Set DEBUG below to read these off the real footage rather than guess them.
 *
 * Icons are lucide components (the project's convention — see TrustSection and
 * PurposeRing) stored directly on the node rather than as a string key, so
 * there is no name→component lookup table to keep in sync.
 */
const NODES = [
  { id: '01', x: '12%', y: '62%', Icon: Factory,     label: 'Three plants',    body: 'Own refining lines, no third-party packing.' },
  { id: '02', x: '31%', y: '49%', Icon: Sprout,      label: 'Finest seeds',    body: 'Sourced and pressed for a clean, light oil.' },
  { id: '03', x: '50%', y: '62%', Icon: Droplet,     label: 'Refined 6×',      body: 'Six stages, degumming to winterising.' },
  { id: '04', x: '68%', y: '49%', Icon: ShieldCheck, label: 'FSSAI certified', body: 'Three licences, tested batch by batch.' },
  { id: '05', x: '85%', y: '62%', Icon: Users,       label: 'Trusted daily',   body: 'In kitchens across central India.' },
]

/* The stats bar, under the stage. Carried over from Milestones.jsx (the
   vertical-timeline section this replaced) so the hard numbers it published are
   not lost with it — the copy is the same, trimmed to bar length. */
const STATS = [
  { stat: '03', label: 'Refineries running' },
  { stat: '04', label: 'Oils in the range' },
  { stat: '100%', label: 'Batches on record' },
]

/* A leaf drawn inline rather than pulled from lucide: it sits INSIDE the
   divider rule at 10px, where lucide's 1.5-weight strokes turn to mush. */
function LeafGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
      <path
        d="M6 1c2.5 1 4 3 4 5.2A4 4 0 0 1 2 6.2C2 4 3.5 2 6 1Z"
        fill="none"
        stroke="#C9A961"
        strokeWidth="1"
      />
      <path d="M6 2.4V9" fill="none" stroke="#C9A961" strokeWidth="0.8" />
    </svg>
  )
}

export default function MilestonesWave({
  /* The real file in public/path. Named exactly as delivered, timestamp and
     all, so this keeps working if another clip is dropped in beside it. */
  videoSrc = '/path/Sunflower_oil_ribbon_floating_202608271835.mp4',
  /* No poster shipped with the clip. Left undefined rather than pointing at a
     PNG that does not exist: a broken poster URL makes some browsers paint a
     black box over the stage until the first frame decodes, which is worse
     than the cream background showing through for a moment. */
  poster,
}) {
  return (
    <section id="milestones-wave" className="w-full overflow-hidden bg-[#F5E9D9]">
      {/* THE STAGE — the locked-ratio box EVERYTHING is measured against, the
          heading included. Its aspect ratio is reserved up front, so the
          section holds its final height before the video has loaded a single
          byte and nothing under it shifts on load. */}
      <div className={`relative w-full ${STAGE_RATIO}`}>
        <video
          /* object-CONTAIN, not cover. The clip is 16:9 and the stage matches
             it, but a browser window wider than 16:9 makes the stage wider
             than tall relative to the footage, and cover then scales to fill
             the width and slices the top and bottom off — which is exactly
             what "the video is cut from the top" was. Contain always shows the
             whole frame, so the ribbon is never cropped and the node
             percentages below stay meaningful at every window shape. */
          className="absolute inset-0 h-full w-full object-contain"
          src={videoSrc}
          {...(poster ? { poster } : {})}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          /* No controls: this is wallpaper, not media the user operates.
             muted + playsInline are both required for autoplay to be allowed
             on iOS — without either, Safari blocks it and the poster is all
             anyone ever sees. */
        />

        {/* NO SCRIM. There was a top-weighted cream wash here to protect the
            heading, and it was the pale band washing out the top of the frame —
            it greyed the leaves and the bottle in the upper corners for no
            benefit. It is not needed: the clip's own background is already the
            same cream as the section, and with object-contain the heading sits
            on empty frame rather than on the oil, so the type has plenty of
            contrast unaided. Do not reintroduce a full-width wash here; if a
            future clip does need help, scope it to the text block instead of
            laying it over the whole stage. */}

        {/* Heading, INSIDE the stage and over the footage. Positioned from the
            top rather than centred: the nodes own the middle of the frame, so
            the copy has to stay in the upper band and keep out of their way. */}
        <div className="absolute inset-x-0 top-0 z-10 px-5 pt-[5%] text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8A7A5C]">
            Milestones
          </p>

          {/* Thin gold rule broken by a leaf. Two flex-1 rules rather than one
              centred glyph over a full-width line, so the gap around the leaf
              is exact at any width and the rule never shows through it. */}
          <div className="mx-auto mt-3 flex max-w-[220px] items-center gap-3">
            <span className="h-px flex-1 bg-[#C9A961]/50" />
            <LeafGlyph />
            <span className="h-px flex-1 bg-[#C9A961]/50" />
          </div>

          {/* Smaller than the 52px it was in normal flow. It shares the frame
              with five nodes now instead of owning a band of its own, and at
              52px the two lines pushed straight into the node row. */}
          <h2 className="mx-auto mt-4 max-w-[16ch] font-serif text-[26px] leading-[1.12] text-[#2F4A21] sm:text-[34px] md:max-w-none md:text-[42px]">
            Built over years, poured every day.
          </h2>

          {/* Hidden on phones: at that width the stage is short, and the
              subcopy is what collides with the top row of nodes first. */}
          <p className="mx-auto mt-3 hidden max-w-[48ch] text-[15px] leading-relaxed text-[#5C5347] sm:block">
            From our own refining lines to the kitchens we reach, every step is
            held to the same standard.
          </p>
        </div>

        {/* Content layer over the footage. pointer-events-none so the nodes
            never swallow a scroll gesture that started on the video. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {NODES.map(({ id, x, y, Icon, label, body }) => (
            <div
              key={id}
              /* left is the node's TRUE CENTRE thanks to the -50% translate,
                 so x reads as "centre of this node" and stays tunable by eye.

                 ONE RULE, no exceptions and no per-node branch: x is the
                 node's centre, y is the wave's surface, and the block always
                 hangs downward from there. The 8px is the gap between the
                 anchor point and the top of the badge — the badge therefore
                 sits ON the line rather than floating under it.

                 translate(-50%, 0) — the Y half is deliberately 0. A -100%
                 there would shift the block up by its own height to sit above
                 the wave, which is what the alternating version did; it puts
                 the badge at the FAR side of the block from the line, so the
                 icon no longer touches the wave. */
              className="absolute w-[128px] text-center md:w-[150px]"
              style={{ left: x, top: `calc(${y} + 8px)`, transform: 'translate(-50%, 0)' }}
            >
              {/* Fixed child order for EVERY node: badge → number → label →
                  body. Nothing reverses it — not a conditional, not
                  flex-col-reverse. Because all five nodes hang below the wave,
                  the badge is nearest the line in every case without any
                  mirroring, and the DOM order matches the reading order. */}

              {/* Circular badge, cream on the wave with a gold rim so it holds
                  its edge against both the light crests and dark troughs. */}
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A961] bg-[#FFFDF8] shadow-sm md:h-12 md:w-12">
                <Icon size={19} strokeWidth={1.6} className="text-[#55692B]" aria-hidden="true" />
              </span>

              <span className="my-1 block text-[11px] font-semibold tracking-[0.18em] text-[#8A7A5C]">
                {id}
              </span>

              <span className="block text-[13px] font-bold uppercase tracking-[0.08em] text-[#2F4A21] md:text-[14px]">
                {label}
              </span>

              {/* Hidden below md: five nodes of body copy across a phone would
                  be two words a line and would collide with each other. The
                  badge, number and label still read at that width.

                  line-clamp-2: every body is capped at two lines so the five
                  nodes keep one rhythm and none of them pushes the section
                  bottom down on its own. */}
              <span className="mt-1 line-clamp-2 hidden text-[12px] leading-snug text-[#5C5347] md:block">
                {body}
              </span>
            </div>
          ))}
        </div>

        {/* DEBUG overlay — a labelled 5% grid plus a magenta dot at every
            anchor, so the y values above can be READ off the frame instead of
            guessed. Flip DEBUG at the top of this file to switch it on; it is
            never shipped on. */}
        {DEBUG && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {Array.from({ length: 21 }, (_, i) => i * 5).map((pct) => (
              <div key={pct} className="absolute inset-x-0" style={{ top: `${pct}%` }}>
                <div className="h-px w-full bg-fuchsia-500/30" />
                <span className="absolute left-1 -top-2 bg-white/70 px-1 text-[9px] leading-none text-fuchsia-700">
                  {pct}%
                </span>
              </div>
            ))}
            {Array.from({ length: 21 }, (_, i) => i * 5).map((pct) => (
              <div
                key={`v${pct}`}
                className="absolute inset-y-0 w-px bg-fuchsia-500/20"
                style={{ left: `${pct}%` }}
              />
            ))}
            {NODES.map(({ id, x, y }) => (
              <div
                key={`d${id}`}
                className="absolute h-2.5 w-2.5 rounded-full bg-fuchsia-600 ring-2 ring-white"
                style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
              >
                <span className="absolute left-3 top-0 whitespace-nowrap bg-white/80 px-1 text-[10px] leading-none text-fuchsia-700">
                  {id} {x} {y}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STATS BAR. Sits under the stage in normal flow — it is a summary of
          the section, not something pinned to a point on the wave, so it does
          not belong inside the locked-ratio box. */}
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-5 pb-16 pt-8 md:pb-20">
        {STATS.map(({ stat, label }) => (
          <div key={label} className="text-center">
            <p className="font-serif text-[32px] leading-none text-[#55692B] md:text-[44px]">
              {stat}
            </p>
            <p className="mx-auto mt-2 max-w-[18ch] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A7A5C] md:text-[12px]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
