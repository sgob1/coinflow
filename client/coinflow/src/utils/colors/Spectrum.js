import Color from '@/utils/colors/Color.js'

class Spectrum {
  #colors

  constructor(colors) {
    this.#colors = colors
  }

  static generate(numOfSamples) {
    let spectrum = []
    const firstColor = Color.random()
    console.log(firstColor.toString())
    const hueStep = 1.0 / numOfSamples

    let currentColor = firstColor
    for (let i = 0; i < numOfSamples; i++) {
      console.log(`color -> ${currentColor.toHSVAString()} ${currentColor.toRGBAString()}`)
      const newHue = currentColor.getHue() + hueStep
      const newColor = currentColor.withHue(newHue > 1.0 ? newHue - 1.0 : newHue)
      spectrum[i] = newColor
      currentColor = newColor
    }

    return new Spectrum(spectrum)
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
