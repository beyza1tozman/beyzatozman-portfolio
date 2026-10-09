import * as THREE from 'three'

const FONTS_READY =
  typeof document !== 'undefined' && document.fonts
    ? Promise.all([
        document.fonts.load('800 40px Fraunces'),
        document.fonts.load('400 40px Fraunces'),
        document.fonts.load('40px "Gochi Hand"'),
        document.fonts.load('500 20px "Work Sans"'),
      ]).catch(() => {})
    : Promise.resolve()

// Draws onto a canvas once web fonts have loaded.
// Drawn at 2x so text stays crisp when the camera zooms in.
const RESOLUTION = 2

export function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width * RESOLUTION
  canvas.height = height * RESOLUTION
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  const paint = () => {
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(RESOLUTION, RESOLUTION)
    draw(ctx, width, height)
    ctx.restore()
  }
  // Paint once the web fonts are in; the loader covers the scene until then.
  FONTS_READY.then(() => {
    paint()
    texture.needsUpdate = true
  })
  return texture
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      line = word
      y += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, y)
  return y + lineHeight
}

// Cream tiles with small dark dots, like the Leblanc floor.
export function floorTexture() {
  const t = makeCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#efe6d4'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#d9cdb5'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, w, h)
    ctx.fillStyle = '#2a2420'
    for (const [x, y] of [[0, 0], [w, 0], [0, h], [w, h]]) {
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

export function chalkboardTexture(items, width = 512, height = 700) {
  return makeCanvasTexture(width, height, (ctx, w, h) => {
    ctx.fillStyle = '#2b2f2c'
    ctx.fillRect(0, 0, w, h)
    // chalk smudges
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`
      ctx.beginPath()
      ctx.ellipse(Math.random() * w, Math.random() * h, 60 + Math.random() * 80, 20 + Math.random() * 30, Math.random() * 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#f3efe6'
    ctx.strokeStyle = '#f3efe6'
    ctx.textAlign = 'center'
    ctx.font = '74px "Gochi Hand"'
    ctx.fillText('Kissaten', w / 2, 92)
    ctx.font = '800 30px Fraunces'
    ctx.fillText('B E Y Z A', w / 2, 136)
    ctx.font = '24px "Gochi Hand"'
    ctx.fillStyle = '#e8b4b4'
    ctx.fillText('code · data viz · stories', w / 2, 172)

    // little coffee cup doodle
    ctx.lineWidth = 3
    ctx.strokeStyle = '#f3efe6'
    ctx.beginPath()
    ctx.moveTo(w / 2 - 26, 200)
    ctx.lineTo(w / 2 - 20, 238)
    ctx.lineTo(w / 2 + 20, 238)
    ctx.lineTo(w / 2 + 26, 200)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(w / 2 + 30, 215, 9, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()
    for (const dx of [-10, 4]) {
      ctx.beginPath()
      ctx.moveTo(w / 2 + dx, 194)
      ctx.quadraticCurveTo(w / 2 + dx - 8, 184, w / 2 + dx, 174)
      ctx.stroke()
    }

    ctx.textAlign = 'left'
    for (const item of items) {
      ctx.fillStyle = '#f3efe6'
      ctx.font = '46px "Gochi Hand"'
      ctx.fillText(item.label, 56, item.y)
      const labelEnd = 56 + ctx.measureText(item.label).width + 14
      ctx.textAlign = 'right'
      ctx.font = '30px "Gochi Hand"'
      ctx.fillStyle = '#e8b4b4'
      ctx.fillText(item.price, w - 56, item.y)
      const priceStart = w - 56 - ctx.measureText(item.price).width - 14
      ctx.textAlign = 'left'
      // dotted leader
      ctx.fillStyle = 'rgba(243,239,230,0.45)'
      for (let x = labelEnd; x < priceStart; x += 12) ctx.fillRect(x, item.y - 6, 3, 3)
    }
    ctx.font = '22px "Gochi Hand"'
    ctx.fillStyle = 'rgba(243,239,230,0.7)'
    ctx.textAlign = 'center'
    ctx.fillText('~ pick something from the menu ~', w / 2, h - 34)
  })
}

// Cardboard card on the back of each food sample.
export function projectCardTexture(project) {
  return makeCanvasTexture(512, 600, (ctx, w, h) => {
    ctx.fillStyle = '#d6b483'
    ctx.fillRect(0, 0, w, h)
    // corrugated speckles
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(90,60,30,${Math.random() * 0.12})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
    }
    ctx.strokeStyle = '#241c17'
    ctx.lineWidth = 10
    ctx.strokeRect(5, 5, w - 10, h - 10)
    ctx.setLineDash([10, 8])
    ctx.lineWidth = 3
    ctx.strokeRect(26, 26, w - 52, h - 52)
    ctx.setLineDash([])

    ctx.fillStyle = '#a8686a'
    ctx.font = '30px "Gochi Hand"'
    ctx.fillText(`No.${project.no} · ${project.dish}`, 50, 82)

    ctx.fillStyle = '#241c17'
    ctx.font = '800 44px Fraunces'
    let y = wrapText(ctx, project.title.toUpperCase(), 50, 140, w - 100, 48)

    ctx.font = '400 27px Fraunces'
    y = wrapText(ctx, project.summary, 50, y + 14, w - 100, 36)

    // tech chips
    ctx.font = '500 20px "Work Sans"'
    let x = 50
    y = Math.max(y + 10, 0)
    for (const tech of project.stack.slice(0, 4)) {
      const tw = ctx.measureText(tech).width + 22
      if (x + tw > w - 50) { x = 50; y += 40 }
      ctx.fillStyle = '#fbf3dc'
      ctx.fillRect(x, y - 24, tw, 34)
      ctx.lineWidth = 3
      ctx.strokeRect(x, y - 24, tw, 34)
      ctx.fillStyle = '#241c17'
      ctx.fillText(tech, x + 11, y)
      x += tw + 10
    }

    ctx.fillStyle = '#241c17'
    ctx.font = '30px "Gochi Hand"'
    ctx.textAlign = 'center'
    ctx.fillText('click to order', w / 2, h - 50)
  })
}

// Small paper price tag in front of each dish.
export function priceTagTexture(project) {
  return makeCanvasTexture(256, 96, (ctx, w, h) => {
    ctx.fillStyle = '#fbf3dc'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#241c17'
    ctx.lineWidth = 6
    ctx.strokeRect(3, 3, w - 6, h - 6)
    ctx.fillStyle = '#241c17'
    ctx.textAlign = 'center'
    let size = 26
    do ctx.font = `600 ${size--}px Fraunces`
    while (ctx.measureText(project.dish).width > w - 24 && size > 12)
    ctx.fillText(project.dish, w / 2, 42)
    ctx.font = '24px "Gochi Hand"'
    ctx.fillStyle = '#a8686a'
    ctx.fillText(`No.${project.no}`, w / 2, 76)
  })
}

export function textSignTexture(text, { bg = '#b8382f', fg = '#fbf3dc', font = '800 64px Fraunces', width = 512, height = 128 } = {}) {
  return makeCanvasTexture(width, height, (ctx, w, h) => {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = font
    ctx.fillText(text, w / 2, h / 2 + 4)
  })
}

// Cream clock dial: minute ticks, heavier hour ticks and serif numerals.
export function clockFaceTexture() {
  return makeCanvasTexture(256, 256, (ctx, w) => {
    const r = w / 2
    ctx.fillStyle = '#f6ecd6'
    ctx.fillRect(0, 0, w, w)
    ctx.translate(r, r)
    ctx.strokeStyle = '#2a211b'
    for (let i = 0; i < 60; i++) {
      const hour = i % 5 === 0
      ctx.lineWidth = hour ? 4 : 1.5
      const a = (i / 60) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(Math.sin(a) * (r - 8), -Math.cos(a) * (r - 8))
      ctx.lineTo(Math.sin(a) * (r - (hour ? 24 : 16)), -Math.cos(a) * (r - (hour ? 24 : 16)))
      ctx.stroke()
    }
    ctx.fillStyle = '#2a211b'
    ctx.font = '400 30px Fraunces'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let h = 1; h <= 12; h++) {
      const a = (h / 12) * Math.PI * 2
      ctx.fillText(String(h), Math.sin(a) * (r - 46), -Math.cos(a) * (r - 46) + 2)
    }
    ctx.font = '22px "Gochi Hand"'
    ctx.fillStyle = '#a8686a'
    ctx.fillText('kissaten', 0, 38)
  })
}

// A small naive painting of a kissaten storefront at dusk.
export function kissatenPaintingTexture() {
  return makeCanvasTexture(300, 380, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6)
    sky.addColorStop(0, '#e9b48a')
    sky.addColorStop(1, '#f4d6a8')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)
    // street
    ctx.fillStyle = '#9b8f84'
    ctx.fillRect(0, h - 58, w, 58)
    ctx.fillStyle = '#857a70'
    ctx.fillRect(0, h - 58, w, 6)
    // building
    ctx.fillStyle = '#b9787a'
    ctx.fillRect(34, 70, w - 68, h - 128)
    ctx.fillStyle = '#7d4b4f'
    ctx.fillRect(26, 58, w - 52, 16)
    // upstairs windows
    ctx.fillStyle = '#f9e3a6'
    ;[70, 176].forEach((x) => ctx.fillRect(x, 96, 54, 46))
    ctx.fillStyle = '#7d4b4f'
    ;[70, 176].forEach((x) => {
      ctx.fillRect(x + 25, 96, 4, 46)
      ctx.fillRect(x, 117, 54, 4)
    })
    // awning with scallops
    const top = 172
    ctx.fillStyle = '#4f8790'
    ctx.fillRect(34, top, w - 68, 30)
    for (let x = 34; x < w - 34; x += 26) {
      ctx.beginPath()
      ctx.arc(x + 13, top + 30, 13, 0, Math.PI)
      ctx.fill()
    }
    ctx.fillStyle = '#f6ecd6'
    for (let x = 34; x < w - 34; x += 52) ctx.fillRect(x, top, 26, 30)
    // shop window glowing, with a lamp and a cup inside
    ctx.fillStyle = '#ffd98a'
    ctx.fillRect(52, 220, 120, 96)
    ctx.fillStyle = '#e6a23c'
    ctx.beginPath()
    ctx.moveTo(98, 240)
    ctx.lineTo(126, 240)
    ctx.lineTo(132, 256)
    ctx.lineTo(92, 256)
    ctx.fill()
    ctx.fillStyle = '#5a3a26'
    ctx.fillRect(111, 220, 2, 20)
    ctx.fillRect(70, 296, 84, 6)
    ctx.fillStyle = '#fbf8f2'
    ctx.fillRect(100, 282, 18, 14)
    ctx.strokeStyle = '#fbf8f2'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(120, 289, 5, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()
    ctx.strokeStyle = '#4a2e1c'
    ctx.lineWidth = 5
    ctx.strokeRect(52, 220, 120, 96)
    // door
    ctx.fillStyle = '#4a2e1c'
    ctx.fillRect(190, 226, 58, 96)
    ctx.fillStyle = '#ffd98a'
    ctx.beginPath()
    ctx.arc(219, 256, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#d4a54a'
    ctx.fillRect(238, 274, 4, 10)
    // hanging sign
    ctx.fillStyle = '#3d2a1c'
    ctx.fillRect(w - 34, 112, 22, 4)
    ctx.fillStyle = '#f6ecd6'
    ctx.fillRect(w - 30, 116, 18, 46)
    ctx.fillStyle = '#c8423b'
    ctx.font = '800 14px Fraunces'
    ctx.textAlign = 'center'
    ;['C', 'A', 'F', 'É'].forEach((c, i) => ctx.fillText(c, w - 21, 129 + i * 10))
    // potted plant by the door
    ctx.fillStyle = '#f2ece2'
    ctx.fillRect(254, 302, 18, 20)
    ctx.fillStyle = '#4f8a4b'
    ctx.beginPath()
    ctx.ellipse(263, 292, 13, 16, 0, 0, Math.PI * 2)
    ctx.fill()
  })
}
