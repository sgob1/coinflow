import Color from '@/utils/colors/Color.js'

function generateSpectrum(numOfSamples) {
  let spectrum = []
  const firstColor = Color.random()
  console.log(firstColor.toString())
  const hueStep = 1.0 / numOfSamples

  let currentColor = firstColor
  for (let i = 0; i < numOfSamples; i++) {
    console.log(`color -> ${currentColor.toHSVAString()} ${currentColor.toRGBAString()}`)
    const newHue = currentColor.getHue() + hueStep
    const newColor = currentColor.withHue(newHue > 1.0 ? newHue - 1.0 : newHue)
    spectrum[i] = newColor.toRGBAString()
    currentColor = newColor
  }

  return spectrum
}

export default {
  generateSpectrum
}
