import { listShift, patch } from "./utils"

describe("util", () => {
  it.each([
    { list: [0, 1, 2, 3, 4, 5, 6, 7], from: 2, to: 6, expected: [0, 1, 3, 4, 5, 6, 2, 7] },
    { list: [0, 1, 2, 3, 4, 5, 6, 7], from: 6, to: 2, expected: [0, 1, 6, 2, 3, 4, 5, 7] },
    { list: [0, 1, 2, 3, 4, 5, 6, 7], from: 3, to: 3, expected: [0, 1, 2, 3, 4, 5, 6, 7] },
  ])
    ("listShift", ({ list, from, to, expected }) => {

      listShift(list, from, to)

      expect(list).toEqual(expected)
    })

  it("patch", () => {
    const obj = { a: 0, b: 1, c: 2 }
    const p = { a: 1, b: undefined, c: 2 }
    const expectedRes = { a: 1, b: 1, c: 2 }
    const expectedUpdate = { a: 0, }
    const expectedRevert = { a: 0, b: 1, c: 2 }

    const res = patch(obj, p)

    expect(obj).toStrictEqual(expectedRes)
    expect(res).toStrictEqual(expectedUpdate)

    patch(obj, res as any)

    expect(obj).toStrictEqual(expectedRevert)
  })

})
