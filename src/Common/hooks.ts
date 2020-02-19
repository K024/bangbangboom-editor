
import hotkey, { KeyHandler } from "hotkeys-js"

export function createAnimLoop(fn: (cancel: () => void) => void) {
  let unmounted = false
  const cancel = () => {
    unmounted = true
  }
  const loop = () => {
    if (unmounted) return
    requestAnimationFrame(loop)
    fn(cancel)
  }
  requestAnimationFrame(loop)
  return cancel
}

export function addHotkey(key: string, handler: KeyHandler) {
  hotkey(key, handler)
  return function () {
    hotkey.unbind(key, handler)
  }
}
