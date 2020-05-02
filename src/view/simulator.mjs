export class Simulator {
  constructor ({
    simulations = [],
    maxDelay = 0.5,
    simulateTime = null // `null` to use time difference between frame
  } = {}) {
    this.simulations = simulations
    this.maxDelay = maxDelay
    this.simulateTime = simulateTime

    this._lastTime = 0
    this._simulated = 0
    this._totalTime = 0
  }

  render () {
    const now = Date.now()
    const difference = (now - this._lastTime) / 1000
    this._lastTime = now

    if (difference < this.maxDelay) {
      this._totalTime += difference
    }

    const simulateTime = this.simulateTime || difference
    while (this._simulated < this._totalTime) {
      for (const simulation of this.simulations) {
        simulation.simulate(simulateTime)
      }
      this._simulated += simulateTime
    }
  }
}
