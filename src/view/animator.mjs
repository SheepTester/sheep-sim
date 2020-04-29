export class Animator {
  constructor ({ renderers = [] } = {}) {
    this.renderers = renderers

    this.animating = false
  }

  start () {
    if (!this.animating) {
      this.animating = true
      this.animate()
    }
  }

  animate () {
    for (const renderer of this.renderers) {
      renderer.render()
    }

    if (this.animating) {
      this._lastAnimationId = window.requestAnimationFrame(this.animate.bind(this))
    }
  }

  stop () {
    if (this.animating) {
      this.animating = false
      window.cancelAnimationFrame(this._lastAnimationId)
      this._lastAnimationId = null
    }
  }
}
