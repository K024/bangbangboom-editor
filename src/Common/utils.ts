
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
  for (const k in p) {
    if (p[k] !== undefined) {
      if (obj[k] !== p[k]) {
        prev[k] = obj[k]
        obj[k] = p[k]
      }
    } else {
      delete obj[k]
    }
  }
  for (const k in prev) return prev
}

function _deepPatch(obj: any, p: any): any {
  if (!isObject(obj) && !isObject(p)) return
  const prev: any = {}
  for (const k in p) {
    if (p[k] !== undefined) {
      if (isObject(p[k]) && isObject(obj[k])) {
        const changes = _deepPatch(obj[k], p[k])
        if (changes) prev[k] = changes
      } else if (obj[k] !== p[k]) {
        prev[k] = obj[k]
        obj[k] = p[k]
      }
    } else {
      delete obj[k]
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
export function shallowPatch<T extends {}, R extends Partial<T>>(obj: T, p: R): Partial<R> | undefined {
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
export function deepPatch<T extends {}, R extends Partial<T>>(obj: T, p: R): Partial<R> | undefined {
  return _deepPatch(obj, p)
}

/**
 * convert a map to entry list
 * @param map - the map to convert
 */
export function entryList<K, V>(map: Map<K, V>) {
  const list: [K, V][] = []
  for (const e of map.entries()) {
    list.push(e)
  }
  return list
}
