import { Vector2 } from '../utils/vector2.mjs'

export class Canvas {
  constructor ({
    canvas = document.createElement('canvas')
  } = {}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    canvas.classList.add('canvas')

    this.position = new Vector2()
    this.size = new Vector2()
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
      const { left, top, width, height } = this.wrapper.getBoundingClientRect()
      const dpr = window.devicePixelRatio

      await measurementsDone

      this.position.set({ x: left, y: top })
      this.size.set({ x: width, y: height })

      ;({ x: this.canvas.width, y: this.canvas.height } = this.size.clone().scale(dpr))
      this.context.scale(dpr, dpr)
    }

    return this
  }
}
