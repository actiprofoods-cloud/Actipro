/*
 * The cabinet clip is pre-exported to still frames so the scroll scrub is
 * frame-accurate — seeking an mp4 with video.currentTime stutters badly on
 * Windows/Chrome.
 *
 * SOURCE  public/video/newww.mp4   1280x720, 24fps, 240 frames.
 *         Exported frames 84 → 150 as f_084 → f_150 (67 frames, 1.6 MB, q82).
 *
 *         The range is the door swing itself and nothing else: 84 is the
 *         door just cracking open, 150 is the camera closed in on the four
 *         packs. Everything outside it was cut deliberately — 0-83 is a slow
 *         approach on a shut cabinet and 151-239 is the settle plus a static
 *         hold, and neither earns the payload.
 *
 *         Note the section therefore OPENS mid-motion: frame 84 already has
 *         the door ajar. If the hero's dissolve ever needs a fully shut
 *         cabinet to land on, this range is what to revisit.
 *
 *         Density is REAL frames, not interpolated ones. Do NOT run this
 *         through `minterpolate` to add frames — every synthesized frame is a
 *         blend of its neighbours and measurably softens the picture.
 *
 *         To re-export after replacing the clip:
 *           ffmpeg -i <clip>.mp4 -start_number 0 -q:v 1 /tmp/raw/r_%03d.png
 *         then save the wanted range as WebP q82 into cabinet2/.
 *         q82 retains 98.9% of the source edge variance (measured), so it is
 *         a size saving with no visible softening.
 *
 *         WATERMARK. The clip carried a Gemini sparkle at roughly x 1136-1183,
 *         y 576-623. It is painted OUT of the frames rather than cropped at
 *         draw time — cropping means cover-fitting a smaller source rect,
 *         which zooms the scene and shifts the section's framing.
 *
 *         It could NOT be removed with the plain Laplace solve used on the old
 *         cabinet set: for roughly half this clip a hard, dark door edge sweeps
 *         diagonally through the mark, and isotropic diffusion averages across
 *         that edge and leaves a pale notch. The frames here were made with an
 *         edge-aware fill that traces the straight edge crossing the patch
 *         (robust line fit to the strongest per-column gradient) and, when one
 *         is found, reconstructs along it so the band carries straight
 *         through; frames with no such edge fall back to the isotropic solve.
 *         119 of 240 frames took the directional path, 121 the isotropic one.
 *         Pristine (inpainted, q100) originals are kept OUTSIDE public/, in
 *         assets-src/cabinet2-orig/ — everything under public/ is copied
 *         verbatim into the build, and 19 MB of masters is not worth
 *         shipping to every visitor.
 *
 * ONE SET, both orientations. The older clip needed a separate portrait
 * re-shoot because its landscape framing lost the cabinet when cover-fitted
 * into a phone. This one does not: the action stays centred, so a 390x844
 * crop keeps all four bottles legible (verified against the real frames).
 * That also halves the payload versus shipping two sets.
 *
 * Hero.jsx crossfades into FIRST_SRC and KitchenReveal.jsx starts its canvas
 * on that same frame — which is why the handoff between the two is invisible.
 */

const CABINET = {
  dir: '/scroll/cabinet2',
  first: 84,
  last: 150,
  /*
   * [scroll progress -> position in the frame range].
   *
   * SOLVED, not hand-placed: measure the frame-to-frame difference across the
   * range, take the cumulative sum, normalise, and invert it. The result is
   * the frame fraction that keeps the RATE OF VISIBLE CHANGE constant, which
   * is precisely what reads as smooth — uneven rate is what reads as jerky,
   * and this clip is very uneven raw (a slow approach, then a hard door swing,
   * then a push-in).
   *
   *   d    = [mean |frame[i] - frame[i-1]| for i in range]
   *   cum  = cumsum(d) / sum(d)
   *   ramp = [(x, interp(x, cum, linspace(0,1,N))) for x in linspace(0,1,9)]
   *
   * This range is the uniform middle of the swing, so the solved curve comes
   * out close to linear (raw evenness here is already std/mean 0.17, against
   * 0.39 across the full clip) — the ramp is doing much less work than it did
   * over the wider range, and that is expected, not a mistake. Re-solve if the
   * clip or the range changes.
   * More than ~9 points does not help — what is left is frame quantisation,
   * which the scrub easing in KitchenReveal absorbs.
   */
  ramp: [
    [0.0, 0.0], // door cracking        (abs 84)
    [0.125, 0.181], // parting              (abs 96)
    [0.25, 0.303], // opening              (abs 104)
    [0.375, 0.416], // swinging             (abs 111)
    [0.5, 0.532], // mid-swing            (abs 119)
    [0.625, 0.647], // doors wide           (abs 127)
    [0.75, 0.759], // pushing in           (abs 134)
    [0.875, 0.879], // bottles readable     (abs 142)
    [1.0, 1.0], // close on the packs   (abs 150)
  ],
}

// Kept because KitchenReveal and Hero still switch some behaviour on it (and
// they must switch on the SAME query, or the plate and the sequence could
// disagree). It no longer selects a frame set — there is only one now.
export const KITCHEN_MOBILE_QUERY = '(max-width: 639px)'

// A set is { dir, first, last } plus the two things the scrubber needs.
const withCounts = (set) => ({
  ...set,
  count: set.last - set.first + 1,
  src: (i) => `${set.dir}/f_${String(set.first + i).padStart(3, '0')}.webp`,
})

export const CABINET_FRAMES = withCounts(CABINET)

/*
 * One set now serves both orientations, so this ignores its argument. The
 * signature is kept so callers (KitchenReveal, Hero) do not have to care, and
 * so re-introducing a portrait set later is a one-line change here rather than
 * a change at every call site.
 */
export const frameSetFor = () => CABINET_FRAMES

/*
 * The frame Hero.jsx dissolves INTO, and the frame KitchenReveal starts its
 * canvas ON. These must be the same picture or the handoff visibly jumps.
 */
export const firstSrcFor = () => CABINET_FRAMES.src(0)

// Kept for callers that predate the single-set change.
export const DESKTOP_FRAMES = CABINET_FRAMES
export const MOBILE_FRAMES = CABINET_FRAMES
export const FIRST_SRC = CABINET_FRAMES.src(0)
export const FIRST_FRAME = CABINET.first
export const LAST_FRAME = CABINET.last
export const FRAME_COUNT = CABINET_FRAMES.count
export const frameSrc = CABINET_FRAMES.src
