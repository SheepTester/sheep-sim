// Performs a lot worse than a for loop; do not use
// https://jsperf.com/sheeptester-for-loop
export function* range (start, stop, step = 1) {
  if (stop === undefined) {
    stop = start
    start = 0
  }
  if (step < 0) {
    for (let i = start; i > stop; i += step) {
      yield i
    }
  } else {
    for (let i = start; i < stop; i += step) {
      yield i
    }
  }
}
