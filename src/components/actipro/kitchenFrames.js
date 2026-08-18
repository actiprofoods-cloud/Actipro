/*
 * The cabinet clip was pre-exported to still frames so the scroll scrub is
 * frame-accurate — seeking an mp4 with video.currentTime stutters badly on
 * Windows/Chrome.
 *
 * There are two exports of the same scene, one per orientation:
 *
 *   DESKTOP  public/video/Cabinet_doors_open_revealing_oil_*.mp4  1280x720
 *            REAL source frames 45 → 175, exported 1:1 as f_000 → f_130.
 *            45 is the last fully-closed cabinet; the doors part through the
 *            middle; by 175 all four packs are lit and the camera has settled.
 *
 *            Density came from LENGTHENING the range, not from inventing
 *            frames. An earlier pass ran the clip through
 *            `minterpolate=fps=48` to double the count, and it did remove the
 *            stepping — but every synthesized frame is a blend of its
 *            neighbours, which measurably softened the picture (edge variance
 *            fell from ~260 to ~190). Frames 100..175 were simply unused, so
 *            using them gives the same count at full sharpness. Do not
 *            reintroduce interpolation here.
 *
 *            To re-export after replacing the clip:
 *              ffmpeg -i <clip>.mp4 -start_number 0 -q:v 1 /tmp/raw/r_%03d.png
 *            then save range(45, 176) as WebP q82 into cabinet-orig/.
 *
 *            WATERMARK. The clip carries a generator sparkle at x 1128-1192,
 *            y 569-632 of 1280x720. It is painted OUT of the frames rather than
 *            cropped at draw time — cropping meant cover-fitting a smaller
 *            source rect, which zoomed the scene and shifted the section's
 *            framing. The mark sits on smooth countertop, so solving Laplace
 *            over it reconstructs the gradient invisibly:
 *
 *              X0,X1,Y0,Y1 = 1128,1192,569,632
 *              patch = frame[Y0:Y1, X0:X1]
 *              mask  = interior of that patch (2px boundary ring kept)
 *              repeat 600x: patch[mask] = uniform_filter(patch, 3)[mask]
 *
 *            Run it over cabinet-orig/ and write the result to cabinet/, which
 *            is the set actually served. Keep cabinet-orig/ pristine.
 *
 *   MOBILE   public/4/mobile (2).mp4                              720x1280
 *            A portrait re-shoot of the same cabinet, 240 frames at 24fps.
 *            REAL source frames 60 → 165, exported 1:1 as f_060 → f_165.
 *
 *            Range comes from the clip's own motion profile (frame-to-frame
 *            mean difference):
 *              0-40    the camera pushing in — DROPPED, the hero already
 *                      did that move and repeating it reads as a stumble
 *              60-75   cabinet shut, camera drifting gently
 *              76-150  the door swing, difference climbing 1.9 → 5.9
 *              150-165 settling, all four packs lit
 *              165+    a static hold — DROPPED, nothing happens
 *
 *            Kept at the native 720x1280 and q78. Measured: q78 preserves
 *            99.9% of the source edge variance, so it is a size saving with
 *            no softening. Do NOT downscale — a 390pt phone at 2x wants
 *            ~780px, and less than that visibly blurs. As with the desktop
 *            set, do NOT interpolate to add frames: every synthesized frame
 *            is a blend of its neighbours and softens the picture.
 *
 *            WATERMARKS. This clip carries TWO, both painted out the same
 *            way as the desktop sparkle (Laplace solve over the mark, the
 *            surrounding pixels as a fixed boundary):
 *              x 631-720, y 40-97     the "Pr &" generator logo, top right.
 *                                     It runs off the frame edge, so the
 *                                     solver has a boundary on three sides
 *                                     only. y starts at 40, not at the
 *                                     mark's top, to spare the cabinet
 *                                     handle just above it.
 *              x 564-632, y 1130-1196 the 4-point sparkle plus a small
 *                                     stray dot 6px above it, on smooth
 *                                     wall — one box covers both.
 *            Pristine originals are kept in public/scroll/cabinet-mobile-orig.
 *
 * A landscape frame cover-fitted into a portrait viewport crops away most of
 * the cabinet, which is the whole subject — hence the second set rather than a
 * CSS fix. KitchenReveal picks between them at KITCHEN_MOBILE_QUERY and reloads
 * the sequence if the viewport crosses it.
 *
 * Hero.jsx crossfades into the desktop FIRST_SRC, and KitchenReveal.jsx starts
 * its canvas on that same frame — which is why the handoff between the two is
 * invisible.
 */

const DESKTOP = {
  dir: '/scroll/cabinet',
  /*
   * The doors first move at absolute frame 72 (measured by frame-to-frame
   * difference), and that is where the sequence now starts — the swing begins
   * on the section's first pixel of scroll.
   *
   * It used to start at 68, which bought a short beat of held cabinet before
   * anything moved. Four frames of a shut cabinet is ~6% of the range, and on
   * the phone that is a visible stall at the top of the section. Anything
   * earlier than 68 was worse still: ~720px of scrolling through frames that
   * are all identically shut.
   */
  first: 72,
  last: 130,
  /*
   * [scroll progress -> position in this set's frame range]. Deliberately
   * non-linear: the door swing is at ABSOLUTE frames 72-110, so with
   * first=68 it sits at range positions 0.06-0.68. The ramp gives that
   * swing the bulk of the scroll instead of spending it on the settle.
   *
   * The y values are FRACTIONS OF THIS SET'S RANGE, so they only mean
   * anything alongside the first/last above - which is why the ramp lives
   * here rather than in KitchenReveal. The two clips are different takes
   * and their swings do NOT land at the same fraction.
   */
  ramp: [
    [0.0, 0.0], // doors already on the move     (abs 72)
    [0.45, 0.273], // doors parting                 (abs 88)
    [0.72, 0.487], // packs readable                (abs 100)
    [0.9, 0.658], // fully open                    (abs 110)
    [1.0, 1.0], // camera settles                (abs 130)
  ],
}

const MOBILE = {
  dir: '/scroll/cabinet-mobile',
  /* The whole exported range is used. Unlike the desktop set there is no
     shut-cabinet run to skip past: the camera is already drifting at f_060,
     so every frame here is doing something. */
  first: 60,
  last: 165,
  /*
   * Not hand-placed like the desktop ramp above: this one is SOLVED so that
   * equal scroll produces equal visible change. Measure the frame-to-frame
   * difference across the range, take the cumulative sum, normalise it, and
   * invert it — the result is the frame fraction that keeps the rate of
   * change constant. Uneven rate is exactly what reads as jerky, and this
   * clip is very uneven raw: the camera drifts slowly at the head and the
   * doors swing hard through the middle (abs 76-150, i.e. range positions
   * 0.15-0.86 — much later and wider than the desktop take's swing, which
   * is why a shared ramp could not serve both).
   *
   *   d    = [mean |frame[i] - frame[i-1]| for i in range]
   *   cum  = cumsum(d) / sum(d)
   *   ramp = [(x, interp(x, cum, linspace(0,1,N))) for x in linspace(0,1,7)]
   *
   * Re-solve it if the clip or the range changes; the numbers are specific
   * to both. More than ~7 points does not help — what is left is the frame
   * quantisation itself, which the scrub easing in KitchenReveal absorbs.
   */
  ramp: [
    [0.0, 0.0], // cabinet shut, camera drifting  (abs 60)
    [0.167, 0.292], // doors already cracking         (abs 91)
    [0.333, 0.436], // opening                        (abs 106)
    [0.5, 0.554], // mid-swing                      (abs 118)
    [0.667, 0.655], // packs becoming readable        (abs 129)
    [0.833, 0.758], // doors wide                     (abs 140)
    [1.0, 1.0], // fully open, settled            (abs 165)
  ],
}

// Matches the `sm:` breakpoint the section's type already steps at, so the
// portrait frames and the small-screen copy switch over together.
export const KITCHEN_MOBILE_QUERY = '(max-width: 639px)'

// A set is { dir, first, last } plus the two counts the scrubber needs.
const withCounts = (set) => ({
  ...set,
  count: set.last - set.first + 1,
  src: (i) => `${set.dir}/f_${String(set.first + i).padStart(3, '0')}.webp`,
})

export const DESKTOP_FRAMES = withCounts(DESKTOP)
export const MOBILE_FRAMES = withCounts(MOBILE)

export const frameSetFor = (isMobile) => (isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES)

/*
 * The frame Hero.jsx dissolves INTO, and the frame KitchenReveal starts its
 * canvas ON. These must be the same picture or the handoff visibly jumps.
 *
 * It has to be picked by viewport, not fixed to the desktop set: the two
 * clips are different takes of the cabinet, so fading the hero into the
 * landscape frame and then starting the phone's portrait scrub at f_060
 * showed one image during the dissolve and a different one the instant the
 * section took over.
 *
 * Call it with the SAME isMobile that frameSetFor() is given, so the plate
 * and the sequence can never disagree.
 */
export const firstSrcFor = (isMobile) => frameSetFor(isMobile).src(0)

// Kept for callers that predate the viewport split. Prefer firstSrcFor().
export const FIRST_SRC = DESKTOP_FRAMES.src(0)

// Kept for callers that predate the two-set split.
export const FIRST_FRAME = DESKTOP.first
export const LAST_FRAME = DESKTOP.last
export const FRAME_COUNT = DESKTOP_FRAMES.count
export const frameSrc = DESKTOP_FRAMES.src
