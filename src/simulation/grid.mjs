import { Vector2 } from '../utils/vector2.mjs'

const GRID_SIZE = 40

const CREATURE_RADIUS = 15

export class Grid {
  constructor ({
    canvas,
    scroll = new Vector2()
  } = {}) {
    this.canvas = canvas

    this.scroll = scroll
    this.blocks = new Set()
    this.creatures = []
  }

  getBlock (position) {
    return this.blocks.has(position.toString())
  }

  placeBlock (position) {
    this.blocks.add(position.toString())
    return this
  }

  removeBlock (position) {
    this.blocks.delete(position.toString())
    return this
  }

  addSheep (sheep) {
    sheep.grid = this
    this.creatures.push(sheep)
    return this
  }

  getBlockPosition (event) {
    return Vector2.fromMouseEvent(event)
      .sub(this.canvas.position)
      .add(this.scroll)
      .scale(1 / GRID_SIZE)
      .map(Math.floor)
  }

  render () {
    const { context: c, size } = this.canvas
    const { x: width, y: height } = size
    const scroll = this.scroll

    c.fillStyle = '#1d4f79'
    c.fillRect(0, 0, ...size)

    const start = scroll.clone().scale(1 / GRID_SIZE).map(Math.floor)
    const end = scroll.clone().add(size).scale(1 / GRID_SIZE).map(Math.ceil)
    c.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    c.lineDashOffset = 2.5
    c.setLineDash([5, 5])
    c.beginPath()
    for (let x = start.x; x < end.x; x++) {
      const lineX = x * GRID_SIZE - scroll.x
      c.moveTo(lineX, -scroll.y % GRID_SIZE - GRID_SIZE)
      c.lineTo(lineX, height)
    }
    for (let y = start.y; y < end.y; y++) {
      const lineY = y * GRID_SIZE - scroll.y
      c.moveTo(-scroll.x % GRID_SIZE - GRID_SIZE, lineY)
      c.lineTo(width, lineY)
    }
    c.stroke()

    c.fillStyle = '#212121'
    for (let x = start.x; x < end.x; x++) {
      for (let y = start.y; y < end.y; y++) {
        const block = new Vector2(x, y)
        if (this.getBlock(block)) {
          c.fillRect(...block.scale(GRID_SIZE).sub(scroll), GRID_SIZE, GRID_SIZE)
        }
      }
    }

    const creatureOffset = new Vector2(GRID_SIZE, GRID_SIZE).scale(1 / 2)
    const creatureRadius = new Vector2(CREATURE_RADIUS, CREATURE_RADIUS)
    const lowerVisibleBound = creatureRadius.clone().scale(-1)
    const upperVisibleBound = creatureRadius.clone().add(size)
    c.fillStyle = '#53a5c6'
    c.beginPath()
    for (const creature of this.creatures) {
      const visualPos = creature.position.clone().sub(scroll).add(creatureOffset)
      if (visualPos.compare({ min: lowerVisibleBound, max: upperVisibleBound })) {
        c.moveTo(...visualPos.clone().add({ x: CREATURE_RADIUS }))
        c.arc(...visualPos, CREATURE_RADIUS, 0, Math.PI * 2)
      }
    }
    c.fill()

    return this
  }
}
