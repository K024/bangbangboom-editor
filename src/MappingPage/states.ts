
import { createSharedObject } from "../Common/hooks"
import { useState, useEffect } from "react"
import { scope } from "../MappingScope/scope"

export const useBackgroundStyle = createSharedObject({
  imageSrc: "",
  dim: 0.8,
  cover: true
})

export const useMapScope = () => {
  const setI = useState(0)[1]

  useEffect(() => {
    const listener = () => setI(i => i + 1)
    scope.actions.changeListeners.add(listener)
    return () => { scope.actions.changeListeners.delete(listener) }
  }, [setI])

  return scope
}

export const useMusicInfo = createSharedObject({
  music: null as null | Howl,
  length: 5
})
