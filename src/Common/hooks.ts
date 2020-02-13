import { useState, useEffect } from "react"
import { deepPatch, shallowPatch } from "./utils"

type Immutable = (number | string | boolean | null | undefined | bigint | symbol)

export function createSharedState<T extends Immutable>(init: T) {

  const setters = new Set<React.Dispatch<React.SetStateAction<T>>>()
  const allset = (value: React.SetStateAction<T>) => {
    for (const setter of setters) {
      setter(value)
    }
  }

  function useSharedState(): [T, React.Dispatch<React.SetStateAction<T>>] {

    const [v, setV] = useState(init)

    useEffect(() => {
      setters.add(setV)
      return () => {
        setters.delete(setV)
      }
    }, [setV])

    return [v, allset]
  }

  return useSharedState
}

export function createSharedObject<T extends {}>(init: T) {

  const setters = new Set<React.Dispatch<React.SetStateAction<number>>>()
  const patch = (patchObj: Partial<T> | ((prev: T) => Partial<T>), deep = false) => {
    if (patchObj instanceof Function) patchObj = patchObj(init)
    const changes = deep
      ? deepPatch(init, patchObj)
      : shallowPatch(init, patchObj)
    if (changes) {
      for (const setter of setters) {
        // force all components to re-render
        setter(i => i + 1)
      }
    }
  }

  function useSharedObject(): [T, typeof patch] {

    const setV = useState(0)[1]

    useEffect(() => {
      setters.add(setV)
      return () => {
        setters.delete(setV)
      }
    }, [setV])

    return [init, patch]
  }

  return useSharedObject
}