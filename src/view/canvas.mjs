export class Canvas {
  constructor ({
    canvas = document.createElement('canvas')
  } = {}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    canvas.classList.add('canvas')

    this.width = 0
    this.height = 0
  }

  setWrapper (wrapper = null) {
    if (this.wrapper) {
      wrapper.removeChild(this.canvas)
      wrapper.classList.remove('canvas-wrapper')
    }
    if (wrapper) {
      wrapper.appendChild(this.canvas)
      wrapper.classList.add('canvas-wrapper')
    }
    this.wrapper = wrapper
    return this
  }

  async resize (measurementsDone = Promise.resolve()) {
    if (this.wrapper) {
      const { width, height } = this.wrapper.getBoundingClientRect()
      const dpr = window.devicePixelRatio

      await measurementsDone

      this.canvas.width = width * dpr
      this.canvas.height = height * dpr
      this.context.scale(dpr, dpr)

      this.width = width
      this.height = height
    }

    return this
  }
}
