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
 *   MOBILE   public/4/mobile .mp4                                 1280x2274
 *            A portrait re-shoot of the same cabinet. Frames 105 → 200 are the
 *            matching arc: ~108 is the last fully-closed frame, ~112 the doors
 *            crack, ~160 onward is open with the packs lit. Exported at 720px
 *            wide, which is plenty for a phone at 2x.
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
   * difference). Starting at 68 gives a short beat of held cabinet and then the
   * swing — starting earlier meant ~720px of scrolling through frames that are
   * all identically shut before anything happened.
   */
  first: 68,
  last: 130,
}

const MOBILE = {
  dir: '/scroll/cabinet-mobile',
  first: 105,
  last: 200,
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

// Hero.jsx dissolves into the landscape cabinet, so its handoff frame is always
// the desktop one regardless of viewport.
export const FIRST_SRC = DESKTOP_FRAMES.src(0)

// Kept for callers that predate the two-set split.
export const FIRST_FRAME = DESKTOP.first
export const LAST_FRAME = DESKTOP.last
export const FRAME_COUNT = DESKTOP_FRAMES.count
export const frameSrc = DESKTOP_FRAMES.src
