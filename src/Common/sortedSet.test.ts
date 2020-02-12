import { insertIntoSortedSet, justifySortedSet } from "./sortedSet"


describe("sortedSet", () => {

  it.each([
    [[1, 2, 3, 4, 5, 6, 7]],
    [[7, 6, 5, 4, 3, 2, 1]],
    [[1, 2, 3, 7, 6, 5, 4]],
    [[2, 3, 3, 5, 6, 1, 1]],
  ])
    ("insertIntoSortedSet", (list) => {
      const set = new Set(list)
      const expected: number[] = []
      set.forEach(x => expected.push(x))
      const actual: number[] = []

      list.forEach(x => {
        insertIntoSortedSet(actual, x, [i => i])
      })

      expect(actual).toEqual(expected.sort())
    })


  it.each([
    [[[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [0, 0]]],
    [[[1, 0], [0, 0], [0, 1], [1, 0], [0, 1], [0, 0]]],
    [[[0, 1], [1, 0], [0, 0], [0, 1], [1, 0], [0, 0]]],
    [[[0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3]]],
    [[[2, 1], [0, 3], [0, 1], [2, 3], [1, 3], [1, 1], [0, 2], [2, 2], [1, 2]]],
    [[[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3], [2, 1], [1, 1], [2, 2]]],
    [[[0, 3], [2, 2], [1, 2], [1, 3], [0, 2], [0, 1], [1, 1], [2, 3], [2, 1]]],
    [[[1, 1], [2, 2], [2, 3], [0, 3], [1, 2], [0, 2], [0, 1], [2, 1], [1, 3]]],
    [[[2, 1], [2, 2], [0, 2], [0, 3], [2, 3], [1, 3], [1, 2], [0, 1], [1, 1]]],
  ])
    ("insertIntoSortedSet multi props", (list) => {
      const map = new Map(list.map(x => [x[0] + "~" + x[1], x] as [string, [number, number]]))
      const expected: [number, number][] = []
      map.forEach(x => expected.push(x))
      const actual: [number, number][] = []

      list.forEach(x => {
        insertIntoSortedSet(actual, x, [i => i[0], i => i[1]])
      })

      expect(actual).toEqual(expected.sort((a, b) => {
        let d = a[0] - b[0]
        if (d) return d
        return a[1] - b[1]
      }))
    })


  it.each([
    { list: [0, 1, 2, 3, 1.5, 5, 6, 7], index: 4, expected: [0, 1, 1.5, 2, 3, 5, 6, 7] },
    { list: [0, 1, 2, 3, 6.5, 5, 6, 7], index: 4, expected: [0, 1, 2, 3, 5, 6, 6.5, 7] },
    { list: [0, 1, 2, 3, 4.5, 5, 6, 7], index: 4, expected: [0, 1, 2, 3, 4.5, 5, 6, 7] },
  ])
    ("justifySortedSet", ({ list, index, expected }) => {

      const [res] = justifySortedSet(list, index, [i => i])

      expect(res).toBe(true)
      expect(list).toEqual(expected)
    })


  it.each([{
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [0, 1], [2, 2], [2, 3]],
    index: 4, noConflict: false,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [0, 1], [2, 2], [2, 3]],
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 2], [2, 2], [2, 3]],
    index: 4, noConflict: false,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 2], [2, 2], [2, 3]],
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]],
    index: 4, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]]
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]],
    index: 4, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]]
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 0], [2, 3]],
    index: 5, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 0], [2, 1], [2, 3]],
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 4], [2, 3]],
    index: 5, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 3], [2, 4]],
  }, {
    list: [[0, 1], [0, 2], [1, 1], [1, 2], [1, 0], [2, 2], [2, 3]],
    index: 4, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]],
  }, {
    list: [[0, 1], [0, 2], [2, 1], [1, 2], [2, 0], [2, 2], [2, 3]],
    index: 2, noConflict: true,
    expected: [[0, 1], [0, 2], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3]],
  },])
    ("justifySortedSet multi props", ({ list, index, noConflict, expected }) => {

      const [res] = justifySortedSet(list, index, [i => i[0], i => i[1]])

      expect(res).toBe(noConflict)
      expect(list).toEqual(expected)
    })
})