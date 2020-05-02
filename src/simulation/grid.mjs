import { Vector2 } from '../utils/vector2.mjs'

const GRID_SIZE = 40

const SHEEP_RADIUS = 15

export class Grid {
  constructor ({
    canvas,
    scroll = new Vector2()
  } = {}) {
    this.canvas = canvas

    this.scroll = scroll
    this.blocks = new Map()
    this._sheep = []
  }

  getBlock (position) {
    return this.blocks.get(position.toString())
  }

  placeBlock (position, block = 'wall') {
    this.blocks.set(position.toString(), block)
    return this
  }

  removeBlock (position) {
    this.blocks.delete(position.toString())
    return this
  }

  addSheep (sheep) {
    sheep.grid = this
    this._sheep.push(sheep)
    sheep.welcomeToGrid(this)
    return this
  }

  getBlockPosition (event) {
    return Vector2.fromMouseEvent(event)
      .sub(this.canvas.position)
      .add(this.scroll)
      .scale(1 / GRID_SIZE)
      .map(Math.floor)
  }

  getSheep (at = new Vector2(), within = Infinity) {
    const withinSquared = within * within
    return this._sheep
      .filter(sheep => sheep.position.clone().sub(at).lengthSquared <= within)
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

    for (let x = start.x; x < end.x; x++) {
      for (let y = start.y; y < end.y; y++) {
        const position = new Vector2(x, y)
        const block = this.getBlock(position)
        if (block === 'wall') {
          c.fillStyle = '#212121'
          c.fillRect(...position.scale(GRID_SIZE).sub(scroll), GRID_SIZE, GRID_SIZE)
        }
      }
    }

    const sheepOffset = new Vector2(GRID_SIZE, GRID_SIZE).scale(1 / 2)
    const sheepRadius = new Vector2(SHEEP_RADIUS, SHEEP_RADIUS)
    const lowerVisibleBound = sheepRadius.clone().scale(-1)
    const upperVisibleBound = sheepRadius.clone().add(size)
    for (const sheep of this._sheep) {
      const visualPos = sheep.position.clone().scale(GRID_SIZE).sub(scroll).add(sheepOffset)
      if (visualPos.compare({ min: lowerVisibleBound, max: upperVisibleBound })) {
        c.fillStyle = sheep.dead
          ? 'rgba(118, 118, 118, 0.5)'
          : sheep.infection && sheep.infection.symptomatic
            ? 'rgba(199, 83, 83, 0.8)'
            : 'rgba(83, 165, 198, 0.8)'
        // c.moveTo(...visualPos.clone().add({ x: SHEEP_RADIUS }))
        c.beginPath()
        c.arc(...visualPos, SHEEP_RADIUS, 0, Math.PI * 2)
        c.fill()
      }
    }

    return this
  }

  static get GRID_SIZE () {
    return GRID_SIZE
  }
}
