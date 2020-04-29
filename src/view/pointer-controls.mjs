import { Vector2 } from '../utils/vector2.mjs'

export class PointerControls {
  constructor ({
    controlling,
    element
  } = {}) {
    this.controlling = controlling
    this.element = element

    this.scrollInfo = null
  }

  listen () {
    this.element.addEventListener('pointerdown', this._pointerStart.bind(this))
    this.element.addEventListener('pointermove', this._pointerMove.bind(this))
    this.element.addEventListener('pointerup', this._pointerEnd.bind(this))
    this.element.addEventListener('pointercancel', this._pointerEnd.bind(this))
  }

  _pointerStart (e) {
    if (!this.scrollInfo) {
      this.scrollInfo = {
        pointerId: e.pointerId,
        start: Vector2.fromMouseEvent(e),
        oldScroll: this.controlling.scroll.clone()
      }
    }
  }

  _pointerMove (e) {
    if (this.scrollInfo) {
      const { pointerId, start, oldScroll } = this.scrollInfo
      if (pointerId === e.pointerId) {
        this.controlling.scroll.set(start.clone().sub(Vector2.fromMouseEvent(e)).add(oldScroll))
      }
    }
  }

  _pointerEnd (e) {
    if (this.scrollInfo) {
      const { pointerId } = this.scrollInfo
      if (pointerId === e.pointerId) {
        this.scrollInfo = null
      }
    }
  }
}
