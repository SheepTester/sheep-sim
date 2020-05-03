export class SimpleInfection {
  constructor ({
    sheep,
    infectionRadius = 2,
    // Chance of getting the infection per second
    infectionChance = 0.01,
    // or dying
    deathChance = 0.2,
    // Seconds until you are symptomatic
    symptomaticTime = 10,
    // Seconds until you recover or die
    duration = 100
  } = {}) {
    this.sheep = sheep
    this.time = 0
    this.symptomatic = false

    this.infectionRadius = infectionRadius
    this.infectionChance = infectionChance
    this.deathChance = deathChance
    this.symptomaticTime = symptomaticTime
    this.duration = duration
  }

  simulate (time) {
    this.time += time

    if (this.time >= this.symptomaticTime && !this.symptomatic) {
      this.symptomatic = true
    }

    if (this.time >= this.duration) {
      this.sheep.infection = null
      if (Math.random() < this.deathChance) {
        this.sheep.die()
      } else {
        this.sheep.immune.push(SimpleInfection)
      }
    }

    const nearby = this.sheep.getSheepWithin(this.infectionRadius)
    const infectionChance = this.infectionChance * time
    for (const sheep of nearby) {
      if (Math.random() < infectionChance) {
        this.infect(sheep)
      }
    }

    return this
  }

  infect (victim) {
    if (!victim.infection && !victim.immune.includes(SimpleInfection)) {
      const {
        infectionRadius,
        infectionChance,
        deathChance,
        symptomaticTime,
        duration
      } = this
      victim.infection = new SimpleInfection({
        sheep: victim,
        infectionRadius,
        infectionChance,
        deathChance,
        symptomaticTime,
        duration
      })
    }
    return this
  }
}
