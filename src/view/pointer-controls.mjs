import { Vector2 } from '../utils/vector2.mjs'

export class PointerControls {
  constructor ({
    controlling,
    element,
    mode = PointerControls.scroll
  } = {}) {
    this.controlling = controlling
    this.element = element
    this.element.classList.add('pointer-controls')

    this.scrollInfo = null
    this.mode = mode
  }

  listen () {
    this.element.addEventListener('pointerdown', this._pointerStart.bind(this))
    this.element.addEventListener('pointermove', this._pointerMove.bind(this))
    this.element.addEventListener('pointerup', this._pointerEnd.bind(this))
    this.element.addEventListener('pointercancel', this._pointerEnd.bind(this))
    return this
  }

  _pointerStart (e) {
    if (!this.scrollInfo) {
      this.scrollInfo = {
        pointerId: e.pointerId,
        state: this.mode.start ? this.mode.start(this, e) : {}
      }
      this.element.setPointerCapture(e.pointerId)
    }
  }

  _pointerMove (e) {
    if (this.scrollInfo && this.scrollInfo.pointerId === e.pointerId && this.mode.move) {
      this.mode.move(this, e, this.scrollInfo.state)
    }
  }

  _pointerEnd (e) {
    if (this.scrollInfo && this.scrollInfo.pointerId === e.pointerId) {
      if (this.mode.end) {
        this.mode.end(this, e, this.scrollInfo.state)
      }
      this.scrollInfo = null
    }
  }
}

PointerControls.scroll = {
  start: ({ controlling }, e) => ({
    start: Vector2.fromMouseEvent(e),
      oldScroll: controlling.scroll.clone()
  }),
  move: ({ controlling }, e, { start, oldScroll }) => {
    controlling.scroll.set(start.clone().sub(Vector2.fromMouseEvent(e)).add(oldScroll))
  }
}

PointerControls.paint = {
  start: ({ controlling }, e) => ({
    placing: !controlling.getBlock(controlling.getBlockPosition(e))
  }),
  move: ({ controlling }, e, { placing }) => {
    const position = controlling.getBlockPosition(e)
    if (placing) {
      controlling.placeBlock(position)
    } else {
      controlling.removeBlock(position)
    }
  }
}
