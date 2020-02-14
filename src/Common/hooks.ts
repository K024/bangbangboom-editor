import { useState, useEffect } from "react"

export function createShared<T>(init: T | (() => T)) {

  let lastV = init instanceof Function ? init() : init

  const setters = new Set<React.Dispatch<React.SetStateAction<T>>>()

  function getValue() {
    return lastV
  }

  function setValue(value: React.SetStateAction<T>) {
    for (const setter of setters) {
      setter(value)
    }
    lastV = value instanceof Function ? value(lastV) : value
  }

  function useShared() {

    const [v, setV] = useState(init)

    useEffect(() => {
      setters.add(setV)
      return () => {
        setters.delete(setV)
      }
    }, [])

    return v
  }

  return {
    getValue, setValue, useShared
  }
}

export function createAnimLoop(fn: () => void) {
  return () => {
    let unmounted = false
    const loop = () => {
      if (unmounted) return
      requestAnimationFrame(loop)
      fn()
    }
    requestAnimationFrame(loop)
    return () => {
      unmounted = true
    }
  }
}
