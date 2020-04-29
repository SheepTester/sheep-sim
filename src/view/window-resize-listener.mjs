export class WindowResizeListener {
  constructor ({ resizers = [] } = {}) {
    this.resizers = resizers
  }

  listen () {
    window.addEventListener('resize', this.resizeNow.bind(this))
    return this
  }

  resizeNow () {
    let measurementsDone
    const allMeasurementsDone = new Promise(resolve => (measurementsDone = resolve))
    const promises = this.resizers.map(resizer => resizer.resize(allMeasurementsDone))
    measurementsDone()
    return Promise.all(promises)
  }
}
