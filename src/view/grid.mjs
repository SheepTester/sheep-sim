import { Vector2 } from '../utils/vector2.mjs'
import { range } from '../utils/utils.mjs'

const GRID_SIZE = 40

export class Grid {
  constructor ({
    canvas,
    scroll = new Vector2()
  } = {}) {
    this.canvas = canvas

    this.scroll = scroll
  }

  render () {
    const { context: c, width, height } = this.canvas

    c.fillStyle = '#1d4f79'
    c.fillRect(0, 0, width, height)

    const start = this.scroll.clone().scale(1 / GRID_SIZE).map(Math.floor)
    const end = new Vector2(width, height).add(this.scroll).scale(1 / GRID_SIZE).map(Math.ceil)
    c.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    c.setLineDash([7, 7])
    c.beginPath()
    for (const lineX of range(start.x, end.x)) {
      const x = lineX * GRID_SIZE - this.scroll.x
      c.moveTo(x, -this.scroll.y % GRID_SIZE - GRID_SIZE)
      c.lineTo(x, height)
    }
    for (const lineY of range(start.y, end.y)) {
      const y = lineY * GRID_SIZE - this.scroll.y
      c.moveTo(-this.scroll.x % GRID_SIZE - GRID_SIZE, y)
      c.lineTo(width, y)
    }
    c.stroke()
  }
}
