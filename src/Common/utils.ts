
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

function isObject(item: any): item is object {
  return (item && typeof item === 'object'/* && !Array.isArray(item) */)
}

function _patch(obj: any, p: any): any {
  const prev: any = {}
  let changed = false
  for (const k in p) {
    if (p[k] !== undefined) {
      if (obj[k] !== p[k]) {
        prev[k] = obj[k]
        obj[k] = p[k]
        changed = true
      }
    } else {
      delete obj[k]
    }
  }
  if (changed) return prev
}

function _deepPatch(obj: any, p: any): any {
  if (!isObject(obj) && !isObject(p)) return
  const prev: any = {}
  let changed = false
  for (const k in p) {
    if (p[k] !== undefined) {
      if (isObject(p[k]) && isObject(obj[k])) {
        const changes = _deepPatch(obj[k], p[k])
        if (changes) {
          prev[k] = changes
          changed = true
        }
      } else if (obj[k] !== p[k]) {
        prev[k] = obj[k]
        obj[k] = p[k]
        changed = true
      }
    } else {
      delete obj[k]
    }
  }
  if (changed) return prev
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
export const shallowPatch = _patch as <T extends {}, R extends Partial<T>>(obj: T, p: R) => Partial<R> | undefined

/**
 * patch the object by another object 
 *  - deep patch 
 *  - iterable property only
 *  - ignores undefined patch property
 * @param obj - the object to patch
 * @param p   - the patch object
 * @returns previous value of changed items if any change applied, else undefined
 */
export const deepPatch = _deepPatch as <T extends {}, R extends Partial<T>>(obj: T, p: R) => Partial<R> | undefined

/**
 * convert a map to entry list
 * @param map - the map to convert
 */
export function entryList<K, V>(map: Map<K, V> | DeepReadonly<Map<K, V>>) {
  const list: [K, V][] = []
  for (const e of map.entries()) {
    list.push(e)
  }
  return list
}

export function itemList<T>(_set: Set<T> | DeepReadonly<Set<T>>) {
  const list: T[] = []
  for (const i of _set.entries()) {
    list.push(i[0])
  }
  return list
}

export function TimeToString(s: number) {
  if (s < 0) return "00:00:000"
  let milis = (s * 1000 + 0.5) | 0
  let minutes = (milis / 60000) | 0
  milis = (milis % 60000) | 0
  minutes = (minutes + 100) | 0
  let seconds = (milis / 1000) | 0
  milis = (milis % 1000) | 0
  seconds = (seconds + 100) | 0
  milis = (milis + 1000) | 0
  return minutes.toString().substr(1) + ":" + seconds.toString().substr(1) + "." + milis.toString().substr(1)
}

export function once<T>(fn: () => T) {
  let res: T
  let called = false
  return function () {
    if (!called) {
      called = true
      res = fn()
    }
    return res
  }
}

export function range(from: number, to?: number, step?: number) {
  if (step === undefined) {
    step = 1
  }
  if (to === undefined) {
    to = from
    from = 0
  }
  const res: number[] = []
  while ((to - from) * step > 0) {
    res.push(from)
    from += step
  }
  return res
}
