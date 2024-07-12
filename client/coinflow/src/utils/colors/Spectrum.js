import Color from '@/utils/colors/Color.js'

class Spectrum {
  #colors

  constructor(colors) {
    this.#colors = colors
  }

  static #generate(saturationCenter = 0.6, valueCenter = 0.55, spread = 0.2, numOfSamples) {
    let spectrum = []
    const firstColor = Color.random(saturationCenter, valueCenter, spread)
    const hueStep = 1.0 / numOfSamples

    let currentColor = firstColor
    for (let i = 0; i < numOfSamples; i++) {
      const newHue = currentColor.getHue() + hueStep
      const newColor = currentColor.withHue(newHue > 1.0 ? newHue - 1.0 : newHue)
      spectrum[i] = newColor
      currentColor = newColor
    }

    return new Spectrum(spectrum)
  }

  static generatePastel(numOfSamples) {
    return Spectrum.#generate(0.6, 0.55, 0.2, numOfSamples)
  }

  static generateVivid(numOfSamples) {
    return Spectrum.#generate(0.9, 0.65, 0.1, numOfSamples)
  }

  withAlpha(alpha) {
    let newColors = []
    for (let color of this.#colors) {
      newColors.push(color.withAlpha(alpha))
    }
    return new Spectrum(newColors)
  }

  toRGBAStringArray() {
    let strArray = []
    for (let color of this.#colors) {
      strArray.push(color.toRGBAString())
    }
    return strArray
  }
}

export default Spectrum
