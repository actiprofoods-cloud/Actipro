"""
Rebuild public/scroll/cabinet-mobile/ from public/4/mobile (2).mp4.

Same pipeline as the desktop set (see kitchenFrames.js):
  1. extract every frame 1:1 (no interpolation - it blurs)
  2. paint the generator watermarks out by solving Laplace over them,
     using the surrounding pixels as a fixed boundary
  3. save the chosen range as WebP q78 at the native 720px width.
     Measured: q78 keeps 99.9% of the source edge variance, so this is a
     size saving with no visible softening. Do NOT downscale below 720 -
     a 390pt phone at 2x needs ~780px and anything less looks blurred.

Frame range comes from the motion profile of this clip:
  0-40    camera pushing in       (dropped - the hero already did the move)
  40-73   cabinet shut, camera drifting (dropped - the scene should open on
          the swing, not on a run of near-identical shut frames)
  74-150  the door swing
  150-165 settling, packs lit
  165+    static hold             (dropped - nothing happens)
"""
import numpy as np
from PIL import Image
from scipy.ndimage import uniform_filter
import os, glob

SRC = "C:/Users/meetr/AppData/Local/Temp/claude/c--Users-meetr-Desktop-Madhuri/0c62ff81-9e62-4123-90f4-9d668c4eeb31/scratchpad/kf"
ORIG = "../assets-src/scroll/cabinet-mobile-orig"
OUT = "public/scroll/cabinet-mobile"

FIRST, LAST = 74, 165

# (x0, x1, y0, y1) of each mark, padded a little past the measured bounds so
# the boundary ring used by the solver is clean background, not mark fringe.
MARKS = [
    # "Pr &" logo, top right. Runs off the right edge of the frame, so the
    # solver gets a boundary on three sides only. y starts at 40 rather than
    # at the mark's true top so the cabinet handle just above it survives.
    (631, 720, 40, 97),
    # The 4-point sparkle plus a small stray dot 6px above it, on smooth
    # wall. One box covers both - they are close enough that two would share
    # a boundary anyway.
    (564, 632, 1130, 1196),
]

ITERS = 800


def inpaint(arr, box):
    """Solve Laplace inside `box`, keeping a 3px boundary ring as the condition."""
    x0, x1, y0, y1 = box
    x1 = min(x1, arr.shape[1])
    y1 = min(y1, arr.shape[0])
    patch = arr[y0:y1, x0:x1].astype(np.float32)
    h, w = patch.shape[:2]
    if h < 8 or w < 8:
        return

    mask = np.zeros((h, w), bool)
    mask[3:-3, 3:-3] = True
    # The logo touches the right edge of the frame, so there is no boundary
    # ring on that side to read from. Extend the mask to the edge and let the
    # solver pull from the three sides that do have one.
    if x1 >= arr.shape[1]:
        mask[3:-3, 3:] = True

    # Seed the hole with the mean of its boundary so the solve starts close.
    ring = patch[mask == False]
    for c in range(patch.shape[2]):
        ch = patch[:, :, c]
        ch[mask] = ring[:, c].mean() if ring.ndim > 1 else ring.mean()
        for _ in range(ITERS):
            ch[mask] = uniform_filter(ch, 3)[mask]
        patch[:, :, c] = ch

    arr[y0:y1, x0:x1] = np.clip(patch, 0, 255).astype(np.uint8)


def main():
    os.makedirs(ORIG, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    for f in glob.glob(os.path.join(OUT, "*.webp")):
        os.remove(f)
    for f in glob.glob(os.path.join(ORIG, "*.webp")):
        os.remove(f)

    for n in range(FIRST, LAST + 1):
        im = Image.open(f"{SRC}/r_{n:03d}.png").convert("RGB")
        # Keep a pristine copy before the paint-out, as the desktop set does.
        im.save(f"{ORIG}/f_{n:03d}.webp", "WEBP", quality=82, method=6)

        arr = np.asarray(im).copy()
        for box in MARKS:
            inpaint(arr, box)
        Image.fromarray(arr).save(f"{OUT}/f_{n:03d}.webp", "WEBP", quality=78, method=6)

    files = sorted(glob.glob(os.path.join(OUT, "*.webp")))
    total = sum(os.path.getsize(f) for f in files)
    print(f"wrote {len(files)} frames, {total/1024/1024:.2f} MB")
    print(f"range f_{FIRST:03d} .. f_{LAST:03d}")


if __name__ == "__main__":
    main()
