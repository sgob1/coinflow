// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR
 * r, g, b
 */
function RGBtoHSV(r, g, b, a) {
  if (arguments.length === 1) {
    ;(g = r.g), (b = r.b), (r = r.r)
  }
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h,
    s = max === 0 ? 0 : d / max,
    v = max / 255

  switch (max) {
    case min:
      h = 0
      break
    case r:
      h = g - b + d * (g < b ? 6 : 0)
      h /= 6 * d
      break
    case g:
      h = b - r + d * 2
      h /= 6 * d
      break
    case b:
      h = r - g + d * 4
      h /= 6 * d
      break
  }

  return {
    hue: h,
    saturation: s,
    value: v,
    alpha: a
  }
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 */
function HSVtoRGB(h, s, v, a) {
  var r, g, b, i, f, p, q, t
  if (arguments.length === 1) {
    ;(s = h.s), (v = h.v), (h = h.h)
  }
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0:
      ;(r = v), (g = t), (b = p)
      break
    case 1:
      ;(r = q), (g = v), (b = p)
      break
    case 2:
      ;(r = p), (g = v), (b = t)
      break
    case 3:
      ;(r = p), (g = q), (b = v)
      break
    case 4:
      ;(r = t), (g = p), (b = v)
      break
    case 5:
      ;(r = v), (g = p), (b = q)
      break
  }
  return {
    red: Math.round(r * 255),
    green: Math.round(g * 255),
    blue: Math.round(b * 255),
    alpha: a
  }
}

class Color {
  #hue
  #saturation
  #value
  #alpha

  constructor(hue, saturation, value, alpha) {
    this.#hue = hue
    this.#saturation = saturation
    this.#value = value
    this.#alpha = alpha
  }

  static random(saturationCenter = 0.6, valueCenter = 0.55, spread = 0.2, alpha = 1.0) {
    let saturation = Math.random() * spread + saturationCenter
    let value = Math.random() * spread + valueCenter

    const hue = Math.random()

    return new Color(hue, saturation, value, alpha)
  }

  static fromRGBA(red = 0, green = 0, blue = 0, alpha = 0) {
    const hsla = RGBtoHSV(red, green, blue, alpha)
    return new Color(hsla.hue, hsla.saturation, hsla.value, hsla.alpha)
  }

  asHSVA() {
    return {
      hue: this.#hue,
      saturation: this.#saturation,
      value: this.#value,
      alpha: this.#alpha
    }
  }

  asRGBA() {
    return HSVtoRGB(this.#hue, this.#saturation, this.#value, this.#alpha)
  }

  toRGBAString() {
    const rgba = this.asRGBA()
    return `rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, ${rgba.alpha})`
  }

  toHSVAString() {
    return `hsv(${this.#hue} ${this.#saturation} ${this.#value} / ${this.#alpha})`
  }

  withHue(newHue) {
    return new Color(newHue, this.#saturation, this.#value, this.#alpha)
  }

  withAlpha(newAlpha) {
    return new Color(this.#hue, this.#saturation, this.#value, newAlpha)
  }

  getHue() {
    return this.#hue
  }

  getSaturation() {
    return this.#saturation
  }

  getValue() {
    return this.#value
  }

  getAlpha() {
    return this.#alpha
  }
}

export default Color
