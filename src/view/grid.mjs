import { Vector2 } from '../utils/vector2.mjs'

const GRID_SIZE = 40

export class Grid {
  constructor ({
    canvas,
    scroll = new Vector2()
  } = {}) {
    this.canvas = canvas

    this.scroll = scroll
    this.blocks = new Set()
  }

  getBlock ({ x, y }) {
    return this.blocks.has(`${x},${y}`)
  }

  placeBlock ({ x, y }) {
    this.blocks.add(`${x},${y}`)
    return this
  }

  removeBlock ({ x, y }) {
    this.blocks.delete(`${x},${y}`)
    return this
  }

  render () {
    const { context: c, width, height } = this.canvas

    c.fillStyle = '#1d4f79'
    c.fillRect(0, 0, width, height)

    const start = this.scroll.clone().scale(1 / GRID_SIZE).map(Math.floor)
    const end = new Vector2(width, height).add(this.scroll).scale(1 / GRID_SIZE).map(Math.ceil)
    c.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    c.lineDashOffset = 2.5
    c.setLineDash([5, 5])
    c.beginPath()
    for (let x = start.x; x < end.x; x++) {
      const lineX = x * GRID_SIZE - this.scroll.x
      c.moveTo(lineX, -this.scroll.y % GRID_SIZE - GRID_SIZE)
      c.lineTo(lineX, height)
    }
    for (let y = start.y; y < end.y; y++) {
      const lineY = y * GRID_SIZE - this.scroll.y
      c.moveTo(-this.scroll.x % GRID_SIZE - GRID_SIZE, lineY)
      c.lineTo(width, lineY)
    }
    c.stroke()

    c.fillStyle = '#212121'
    for (let x = start.x; x < end.x; x++) {
      for (let y = start.y; y < end.y; y++) {
        const block = new Vector2(x, y)
        if (this.getBlock(block)) {
          c.fillRect(...block.scale(GRID_SIZE).sub(this.scroll), GRID_SIZE, GRID_SIZE)
        }
      }
    }
  }
}
