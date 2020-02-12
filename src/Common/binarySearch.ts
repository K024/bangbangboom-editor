import { neverHappen } from "./utils"

type FuncList<T = number> = (index: number) => T

/**
 * find the index to insert the item makes the list still ordered
 * @param list    - a function represets the list
 * @param listlen - list length
 * @param target  - search target
 * @returns `[ index, equal ]`
 */
export function binarySearch(list: FuncList, listlen: number, target: number): [number, boolean] {
  let l = 0
  let r = listlen
  if (listlen <= 0) return [0, false]
  if (target < list(l)) return [0, false]

  while (l < r - 1) {
    const m = ((l + r) / 2) | 0
    const v = list(m)
    if (target < v) r = m
    else if (v < target) l = m
    else return [m + 1, true]
  }
  // l = m   -->   l >= r + 1   --> list(l) not tested equality
  return [l + 1, list(l) === target]
}

/**
 * find range by binary search  
 * insert to `from` or to `to` keeps the list ordered 
 * @returns [ from, to, found ]
 */
export function binarySearchRange(list: FuncList, listlen: number, target: number): [number, number, boolean] {
  if (listlen <= 0) return [0, 0, false]
  let l = 0
  let r = listlen
  let notEqualLeft = 0

  while (l < r - 1) {
    const m = ((l + r) / 2) | 0
    const v = list(m)
    if (target < v) r = m
    else if (v < target) {
      l = m
      notEqualLeft = l
    }
    else l = m

  }

  const right = l // l never out of range
  const rvalue = list(l)
  if (rvalue > target) return [l, l, false]
  if (rvalue < target) return [r, r, false]

  r = right
  l = notEqualLeft

  while (l < r - 1) {
    const m = ((l + r) / 2) | 0
    const v = list(m)
    if (target <= v) r = m
    else l = m
  }

  const left = l
  const lvalue = list(left)
  if (lvalue < target) return [left + 1, right + 1, true]
  if (lvalue > target) neverHappen("Check if the list is ascending") // cuz we found at least one item equal at right most
  return [left, right + 1, true]
}

type AtLeastOneArray<T> = {
  '0': T
} & T[]

export type Fields<T> = AtLeastOneArray<(item: T) => number>

/**
 * do binarySearch on multiple fields  
 * falls to binarySearch if only one field passes in 
 * @param list        - the function represents the list
 * @param listlen     - list length
 * @param target      - target item
 * @param fields - the field of each order
 * @returns [ index, equal ]
 */
export function binarySearchEx<T>(list: FuncList<T>, listlen: number, target: T, fields: Fields<T>): [number, boolean] {
  if (fields.length === 1) {
    const f = fields[0]
    return binarySearch(i => f(list(i)), listlen, f(target))
  }
  let l = 0
  let r = listlen
  let found = false
  for (const field of fields) {
    const base = l
    const targetField = field(target)
      ;[l, r, found] = binarySearchRange(i => field(list(base + i)), r - l, targetField)
    l += base
    r += base
    if (!found) break
  }
  return [r, found]
}
