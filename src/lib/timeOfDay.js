import * as THREE from 'three'

// Lighting follows the visitor's local clock: sunlight through the day,
// golden light at dawn and dusk, lamplight and a cool moon at night.
// While developing (npm run dev), add ?hour=21.5 to the URL to preview a time
// of day. Production builds drop this, so the live site always uses real time.

const previewHour = (() => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  const h = parseFloat(new URLSearchParams(window.location.search).get('hour'))
  return Number.isFinite(h) ? ((h % 24) + 24) % 24 : null
})()

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t
const col = (hex) => new THREE.Color(hex)

const SUN_NOON = col('#fff0d8')
const SUN_GOLDEN = col('#ffa860')
const SKY_DAY = col('#fff1dc')
const SKY_NIGHT = col('#8a7f8c')
const GROUND_DAY = col('#3a2620')
const GROUND_NIGHT = col('#2a1c18')
const LAMP_DAY = col('#ffcf8a')
const LAMP_NIGHT = col('#ffad5c')
const WINDOW_DAY = col('#fff3d4')
const WINDOW_DUSK = col('#ff9a5a')
const WINDOW_NIGHT = col('#1c2847')

const L = {
  sun: 0,
  sunColor: new THREE.Color(),
  sunPosition: new THREE.Vector3(),
  moon: 0,
  hemi: 0,
  skyColor: new THREE.Color(),
  groundColor: new THREE.Color(),
  ambient: 0,
  lamp: 0,
  lampColor: new THREE.Color(),
  lampGlow: 1,
  cabinet: 0,
  counter: 0,
  cardGlow: 0,
  menuGlow: 0,
  menuLamp: 0,
  windowColor: new THREE.Color(),
  windowGlow: 0,
}
let lastMinute = -1

// Shared lighting state for the current minute; cheap to call every frame.
export function lighting() {
  const now = new Date()
  const hour = previewHour ?? now.getHours() + now.getMinutes() / 60
  const minute = Math.round(hour * 60)
  if (minute === lastMinute) return L
  lastMinute = minute

  // 0 at night, 1 in full daylight
  const day = smooth(5.5, 8, hour) * (1 - smooth(18, 20.5, hour))
  // peaks around sunrise and sunset
  const golden = Math.max(clamp01(1 - Math.abs(hour - 7) / 1.5), clamp01(1 - Math.abs(hour - 19.2) / 1.5))

  // The sun stays on the right and climbs from low at dawn to high at noon.
  const arc = clamp01((hour - 5.5) / 15)
  const elevation = Math.sin(arc * Math.PI)
  L.sunPosition.set(8, 2.5 + 9 * elevation, lerp(9, 1, arc))
  L.sun = day * lerp(1.9, 1.3, golden)
  L.sunColor.lerpColors(SUN_NOON, SUN_GOLDEN, golden)
  L.moon = (1 - day) * 0.3

  // nights stay cosy and open, just warmer and more lamp-lit
  L.hemi = lerp(0.55, 0.9, day)
  L.skyColor.lerpColors(SKY_NIGHT, SKY_DAY, day)
  L.groundColor.lerpColors(GROUND_NIGHT, GROUND_DAY, day)
  L.ambient = lerp(0.2, 0.25, day)

  // At night the lamps carry the room.
  L.lamp = lerp(7, 3.5, day)
  L.lampColor.lerpColors(LAMP_NIGHT, LAMP_DAY, day)
  L.lampGlow = lerp(1.5, 1, day)
  L.cabinet = lerp(3, 1.4, day)
  L.counter = lerp(4.5, 1.2, day)
  L.cardGlow = lerp(0.18, 0.08, day)
  L.menuGlow = (1 - day) * 0.4
  L.menuLamp = (1 - day) * 2.5

  L.windowColor.lerpColors(WINDOW_NIGHT, WINDOW_DAY, day).lerp(WINDOW_DUSK, golden * 0.55)
  L.windowGlow = lerp(0.5, 0.9, day)
  return L
}
