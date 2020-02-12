import { binarySearch, binarySearchRange, binarySearchEx } from "./binarySearch"
import { RunIntoNeverError } from "./utils"

describe("binarySearch", () => {

  const simpleUniqueList = [{
    list: [],
    target: 0, expected: [0, false]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 2, expected: [3, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 2.99, expected: [3, false]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 3, expected: [4, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 3.99, expected: [4, false]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 0, expected: [1, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: -0.01, expected: [0, false]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 7, expected: [8, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 7.01, expected: [8, false]
  }]

  it.each(simpleUniqueList)("simple", ({ list, target, expected }) => {

    const actual = binarySearch(i => list[i], list.length, target)

    expect(actual).toEqual(expected)
  })

  it.each(simpleUniqueList.slice(0, 3))("ex simple", ({ list, target, expected }) => {

    const actual = binarySearchEx(i => list[i], list.length, target, [i => i])

    expect(actual).toEqual(expected)
  })

  const simpleNotUniqueList = [{
    list: [],
    target: -1, expected: [0, 0, false]
  }, {
    list: [0, 1, 2],
    target: -1, expected: [0, 0, false]
  }, {
    list: [0, 0, 0],
    target: 0, expected: [0, 3, true]
  }, {
    list: [0, 0, 1, 1, 1, 1, 1],
    target: 1, expected: [2, 7, true]
  }, {
    list: [0, 1, 2],
    target: 3, expected: [3, 3, false]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 2, expected: [2, 3, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 6, 7],
    target: 2.5, expected: [3, 3, false]
  }, {
    list: [0, 0, 0, 3, 4, 5, 6, 7],
    target: 0, expected: [0, 3, true]
  }, {
    list: [0, 1, 2, 3, 4, 5, 5, 5],
    target: 5, expected: [5, 8, true]
  }]

  it.each(simpleNotUniqueList)("range", ({ list, target, expected }) => {

    const actual = binarySearchRange(i => list[i], list.length, target)

    expect(actual).toEqual(expected)
  })

  it("range throw error", () => {
    const illegalList = [3, 2, 1, 0, 0, 0]

    const act = () => {
      binarySearchRange(i => illegalList[i], illegalList.length, 0)
    }

    expect(act).toThrow(RunIntoNeverError)
  })

  const complexList = [{
    list: [], target: [0, 0], expected: [0, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [0, 0.99], expected: [0, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [0, 1], expected: [1, true]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [0, 1.99], expected: [1, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [0, 2], expected: [2, true]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [0, 2.01], expected: [2, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [1, 2.99], expected: [4, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [1, 3], expected: [5, true]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [1, 3.01], expected: [5, false]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [3, 2], expected: [8, true]
  }, {
    list: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0], [2, 2], [3, 2]],
    target: [3, 2.01], expected: [8, false]
  },]

  it.each(complexList)("ex complex", ({ list, target, expected }) => {

    const actual = binarySearchEx(i => list[i], list.length, target, [i => i[0], i => i[1]])

    expect(actual).toEqual(expected)
  })
})