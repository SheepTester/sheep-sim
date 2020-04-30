import { Vector2 } from '../utils/vector2.mjs'

// Uses A*: https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
// Expects that the same position will have the same Vector2
// `determineGoodness` is the heuristic function for guessing how close a position
//   is to the end.
export function aStar (start, { determineGoodness, isEnd, getValidNeighbours }) {
  // Reachable positions that need to be investigated
  const agenda = new Set([start])

  // "g score" - The distance to a position
  start._distance = 0

  // "f score" - An estimation of how good a position is for getting to the end
  // Lower is "better"
  start._goodness = determineGoodness(start)

  const cameFrom = new Map()

  while (agenda.size) {
    // Get the position in agenda with lowest (best) goodness
    let current
    for (const position of agenda) {
      if (!current || position._goodness < current._goodness) {
        current = position
      }
    }

    if (isEnd(current)) {
      // A path has been found to the end!
      const path = []
      while (current) {
        path.unshift(current)
        current = cameFrom.get(current)
      }
      return path
    }

    agenda.delete(current)

    // Assumes each neighbour is one step away
    const neighbourDistance = current._distance + 1
    for (const neighbour of getValidNeighbours(current)) {
      if (neighbourDistance < neighbour._distance) {
        // We've found the closest path to this neighbour so far
        cameFrom.set(neighbour, current)
        neighbour._distance = neighbourDistance
        neighbour._goodness = neighbour._distance + determineGoodness(neighbour)
        agenda.add(neighbour)
      }
    }
  }

  // End was not reached
  return null
}

export function pathfind (grid, start, ends) {
  // Ensure that each position has the same Vector2 instance
  const positions = new Map()
  function getPosition (position) {
    const entry = positions.get(position.toString())
    if (entry) {
      return entry
    } else {
      const clone = position.clone()
      clone._distance = Infinity
      clone._goodness = Infinity
      positions.set(position.toString(), clone)
      return clone
    }
  }

  const endPositions = ends.map(getPosition)

  return aStar(getPosition(start), {
    determineGoodness: position => {
      let endDistance = Infinity
      // Using Manhattan distance
      for (const end of ends) {
        const { x, y } = position.clone().sub(end).map(Math.abs)
        const distance = x + y
        if (distance < endDistance) {
          endDistance = distance
        }
      }
      return endDistance
    },
    isEnd: position => endPositions.includes(position),
    getValidNeighbours: position =>
      [
        new Vector2(0, -1),
        new Vector2(0, 1),
        new Vector2(-1, 0),
        new Vector2(1, 0)
      ]
        .map(offset => offset.add(position))
        .filter(neighbour => !grid.getBlock(neighbour))
        .map(getPosition)
  })
}
