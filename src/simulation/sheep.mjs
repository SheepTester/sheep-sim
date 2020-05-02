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

  setGoal (goal, important = true) {
    this.goal = goal
    this.goalImportant = important
    this._pathfind()

    return this
  }

  _pathfind () {
    if (!this.goal) return
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

  _setNextBlock (nextBlock) {
    // Sets next block
    this._nextBlock = nextBlock
    this._nextBlockProgress = 0
    this.grid.placeBlock(nextBlock, this)
  }

  _setNextBlockIfNeeded () {
    if (!this._nextBlock) {
      if (this.path && this.path[0] && this._canStepOnBlock(this.path[0])) {
        this._setNextBlock(this.path.shift())
      } else {
        if (this.path) {
          this.path = null
        }
        if (this.goal) {
          if (this.goalImportant) {
            // Try to find a new path
            this._pathfind()
            // If no path can be found
            if (!this.path) {
              // Freak out and move randomly
              const neighbours = [
                new Vector2(0, -1),
                new Vector2(0, 1),
                new Vector2(-1, 0),
                new Vector2(1, 0)
              ]
                .map(offset => offset.add(this._currentBlock))
                .filter(this._canStepOnBlock.bind(this))
              if (neighbours.length) {
                this._setNextBlock(neighbours[Math.random() * neighbours.length | 0])
              } else {
                console.warn('Stuck :(')
              }
            }
          } else {
            // Give up goal
            this.goal = null
          }
        }
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
      // If suddenly walking into a solid block, reverse and recalculate
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
        if (this._currentBlock.equals(this.goal)) {
          this.goal = null
        }

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
