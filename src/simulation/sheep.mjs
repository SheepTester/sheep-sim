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

  welcomeToGrid (grid) {
    if (!grid.getBlock(this._currentBlock)) {
      grid.placeBlock(this._currentBlock, this)
    }
  }

  setGoal (goal) {
    this.goal = goal
    this._pathfind()

    return this
  }

  _pathfind () {
    this.path = pathfind({
      grid: this.grid,
      start: this._nextBlock || this.position,
      ends: [this.goal],
      // It is ok for the sheep to go through cells that it currently occupies
      nonsolids: [this]
    })
  }

  _canStepOnBlock (position) {
    const block = this.grid.getBlock(position)
    return !block || block === this
  }

  _setNextBlockIfNeeded () {
    if (!this._nextBlock && this.path) {
      if (this.path[0] && this._canStepOnBlock(this.path[0])) {
        // Sets next block
        const nextBlock = this.path.shift()
        this._nextBlock = nextBlock
        this._nextBlockProgress = 0
        this.grid.placeBlock(nextBlock, this)
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
      if (!this._canStepOnBlock(this._nextBlock)) {
        ;[this._currentBlock, this._nextBlock] = [this._nextBlock, this._currentBlock]
        this._nextBlockProgress = 1 - this._nextBlockProgress
        this._pathfind()
      }
      if (this._nextBlockProgress >= 1) {
        this.position.set(this._nextBlock)
        this._nextBlockProgress -= 1

        // Removes next block
        if (this.grid.getBlock(this._currentBlock) === this && !this._currentBlock.equals(this._nextBlock)) {
          this.grid.removeBlock(this._currentBlock)
        }
        if (this.grid.getBlock(this._nextBlock) !== this) {
          console.warn(`Conflict at ${this._nextBlock}`)
        }
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
    return this
  }
}
