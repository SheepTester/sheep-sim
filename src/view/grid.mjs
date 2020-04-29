import { Vector2 } from '../utils/vector2.mjs'

export class Grid {
  constructor ({
    canvas: { canvas, context },
    scroll = new Vector2()
  } = {}) {
    this.canvas = canvas
    this.context = context

    this.scroll = scroll
  }

  render () {
    const c = this.context

    c.fillRect(...this.scroll.clone().scale(-1), 10, 10)
  }
}
