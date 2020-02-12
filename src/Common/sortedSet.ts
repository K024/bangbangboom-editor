import { Fields, binarySearchEx } from "./binarySearch"
import { listShift } from "./utils"


/**
 * insert into a sorted set
 * @param list  - the list represents the set
 * @param item  - the item to insert
 * @param field - the function to get the field
 * @returns [ success, newIndex ]
 */
export function insertIntoSortedSet<T>(list: T[], item: T, fields: Fields<T>): [boolean, number] {
  const [pos, equal] = binarySearchEx(i => list[i], list.length, item, fields)
  if (equal) return [false, -1]
  list.splice(pos, 0, item)
  return [true, pos]
}

function compareFields<T>(a: T, b: T, fields: Fields<T>): number {
  let res = 0
  for (const f of fields) {
    res = f(a) - f(b)
    if (res !== 0) return Math.sign(res)
  }
  return Math.sign(res)
}

/**
 * justify the sorted set after item changed
 * @param list         - the list
 * @param changedIndex - the index of item changed
 * @param smaller      - will the index be smaller or not
 * @param field        - the function to get the field
 * @returns [ success, newIndex ]
 */
export function justifySortedSet<T>(list: T[], changedIndex: number, fields: Fields<T>): [boolean, number] {
  if (list.length <= 1) return [true, 0]
  const smaller = changedIndex === 0
    ? compareFields(list[0], list[1], fields) < 0
    : compareFields(list[changedIndex], list[changedIndex - 1], fields) < 0
  const [base, end] = smaller
    ? [0, changedIndex]
    : [changedIndex + 1, list.length]
  const changed = list[changedIndex]
  const [index, equal] = binarySearchEx(i => list[base + i], end - base, changed, fields)
  if (equal) return [false, -1]
  const target = base + index - (smaller ? 0 : 1)
  listShift(list, changedIndex, target)
  return [true, target]
}
