/*
 * One shared "which scene are we in" value, 0 → 1.
 *
 *   0 = Scene 01, the dark hero over the oil-pour footage
 *   1 = the bright cream page below it
 *
 * Hero.jsx writes it every scroll frame; the header reads it purely through
 * CSS (--acti-tone), so a 60fps scrub never re-renders a single component.
 */

let current = -1

export function setSceneTone(value) {
  // Quantising to 3dp stops us writing the same style hundreds of times a second.
  const next = Math.round(Math.min(1, Math.max(0, value)) * 1000) / 1000
  if (next === current) return
  current = next
  document.documentElement.style.setProperty('--acti-tone', String(next))
}

export function resetSceneTone() {
  current = -1
  document.documentElement.style.removeProperty('--acti-tone')
}
