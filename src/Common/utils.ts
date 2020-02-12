
export class RunIntoNeverError extends Error { }

/**
 * Describes a case will never happen  
 * throws a {@link RunIntoNeverError}  
 * @param message error message if happen
 */
export function neverHappen(message = "Ran into never happen"): never {
  throw new RunIntoNeverError(message)
}

/**
 * gard value by a default value  
 */
export function gard<T>(v: T | null | undefined, d: T) {
  return v === null || v === undefined ? d : v
}

/**
 * type gard for null | undefined assertion
 */
export function assert<T>(v: T): NonNullable<T> {
  if (v === null || v === undefined) neverHappen("Assertion for not null or undefined fail")
  return v as NonNullable<T>
}

/**
 * generate a random positive int number
 */
export function randomId() {
  return Math.random() * 0x80000000 | 0
}

/**
 * linear interpolation
 */
export function lerp(start: number, end: number, target: number, from: number, to: number) {
  const r = (target - start) / (end - start)
  return (to - from) * r + from
}

/**
 * shift an item at prev to target like insert sort  
 * assumes prev and target are valid
 * @param list   - the list
 * @param prev   - the index of item
 * @param target - the target index
 */
export function listShift<T>(list: T[], prev: number, target: number) {
  if (prev === target) return
  const step = prev > target ? -1 : 1
  const item = list[prev]
  while (prev !== target) {
    const next = prev + step
    list[prev] = list[next]
    prev = next
  }
  list[prev] = item
}


/**
 * remove one item from list
 * @param list  - the list to remove
 * @param index - the index to remove
 * @returns the removed element or undefined
 */
export function removeIndex<T>(list: T[], index: number) {
  return list.splice(index, 1)[0]
}


function _patch(obj: any, p: any): any {
  const prev: any = {}
  for (const k in p) {
    if (p[k] !== undefined)
      if (obj[k] !== p[k]) {
        prev[k] = obj[k]
        obj[k] = p[k]
      }
  }
  for (const k in prev) return prev
}

function _deepPatch(obj: any, p: any): any {
  const prev: any = {}
  for (const k in p) {
    if (p[k] !== undefined)
      switch (typeof p[k]) {
        case "number": case "boolean": case "string": case "function": case "bigint":
          if (obj[k] !== p[k]) {
            prev[k] = obj[k]
            obj[k] = p[k]
          }
          break
        case "object":
          const res = _deepPatch(obj[k], p[k])
          if (res) prev[k] = res
          break
      }
  }
  for (const k in prev) return prev
}

/**
 * patch the object by another object  
 *  - shallow patch
 *  - iterable property only
 *  - ignores undefined patch property
 * @param obj - the object to patch
 * @param p   - the patch object
 * @returns previous value of changed items if any change applied, else undefined
 */
export function patch<T extends object, R extends Partial<T>>(obj: T, p: R): Partial<R> | undefined {
  return _patch(obj, p)
}

/**
 * patch the object by another object 
 *  - deep patch 
 *  - iterable property only
 *  - ignores undefined patch property
 * @param obj - the object to patch
 * @param p   - the patch object
 * @returns previous value of changed items if any change applied, else undefined
 */
export function deepPatch<T extends object, R extends Partial<T>>(obj: T, p: R): Partial<R> | undefined {
  return _deepPatch(obj, p)
}

