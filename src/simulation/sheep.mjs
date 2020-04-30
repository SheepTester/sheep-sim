import { Vector2 } from '../utils/vector2.mjs'
import { pathfind } from './pathfind.mjs'

export class Sheep {
  constructor ({
    position = new Vector2()
  } = {}) {
    this.position = position
  }

  setGoal (goal) {
    this.goal = goal
    this.path = pathfind(this.grid, this.position, [goal])
  }
}
