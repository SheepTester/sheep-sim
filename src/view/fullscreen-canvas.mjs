export class FullscreenCanvas {
  constructor ({
    canvas = document.createElement('canvas')
  } = {}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    canvas.classList.add('fullscreen-canvas')
  }

  addTo (parent) {
    parent.appendChild(this.canvas)
    return this
  }

  async resize (measurementsDone = Promise.resolve()) {
    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = window.devicePixelRatio

    await measurementsDone

    this.canvas.width = width
    this.canvas.height = height
    this.context.scale(dpr, dpr)

    this.width = width
    this.height = height

    return this
  }
}
