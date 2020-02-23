
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