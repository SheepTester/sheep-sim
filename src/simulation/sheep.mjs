import { Vector2 } from '../utils/vector2.mjs'
import { pathfind } from './pathfind.mjs'

export class Sheep {
  constructor ({
    position = new Vector2(),
    speed = 5 // tiles/sec
  } = {}) {
    this.position = position
    this._currentBlock = position.clone().map(Math.floor)
    this.speed = speed
  }

  setGoal (goal) {
    this.goal = goal
    this.path = pathfind(this.grid, this._nextBlock || this.position, [goal])
  }

  _setNextBlockIfNeeded () {
    if (!this._nextBlock && this.path) {
      if (this.path[0]) {
        this._nextBlock = this.path.shift()
        this._nextBlockProgress = 0
      } else {
        this.path = null
      }
    }
  }

  simulate (time) {
    this._setNextBlockIfNeeded()
    if (this._nextBlock) {
      this._nextBlockProgress += time * this.speed
      if (this._nextBlock.equals(this._currentBlock)) {
        this._nextBlockProgress = 1
      }
      // If walking into a solid block, reverse and recalculate
      if (this.grid.getBlock(this._nextBlock)) {
        ;[this._currentBlock, this._nextBlock] = [this._nextBlock, this._currentBlock]
        this._nextBlockProgress = 1 - this._nextBlockProgress
        this.path = pathfind(this.grid, this._nextBlock, [this.goal])
      }
      if (this._nextBlockProgress >= 1) {
        this.position.set(this._nextBlock)
        this._nextBlockProgress -= 1
        this._currentBlock = this._nextBlock
        this._nextBlock = null
        this._setNextBlockIfNeeded()
      } else {
        this.position
          .set(this._currentBlock)
          .add(this._nextBlock
            .clone()
            .sub(this._currentBlock)
            .scale(this._nextBlockProgress))
      }
    }
  }
}
