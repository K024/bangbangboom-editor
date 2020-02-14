import { useState, useEffect } from "react"
import { scope } from "../MappingScope/scope"
import { createShared } from "../Common/hooks"

export function useMapChange() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const listener = () => setI(i => i + 1)
    scope.actions.changeListeners.add(listener)
    return () => { scope.actions.changeListeners.delete(listener) }
  }, [])

  return i
}

class BackgroundState {
  src = createShared("")
  dim = createShared(0.8)
  cover = createShared(true)
}

export const Background = new BackgroundState()

class MusicState {

  howl = createShared(null as null | Howl)
  soundid = createShared(0)
  duration = createShared(5)
  playing = createShared(false)
  playbackrate = createShared(1)
  seekcounter = createShared(0)

  load = (src: string, onerror: () => void, format?: string) => {
    const m = this
    m.howl.setValue(null)
    if (src) {
      const music = new Howl({ src, format })
      const start = () => {
        const soundid = music.play()
        music.pause(soundid)
        music.seek(0, soundid)
        music.rate(m.playbackrate.getValue(), soundid)
        m.soundid.setValue(soundid)
        m.playing.setValue(false)
      }

      music.once("load", () => {
        m.duration.setValue(music.duration())
        start()
        music.on("end", start)
      })
      music.once("loaderror", onerror)
    }
  }

  position = () => {
    const h = this.howl.getValue()
    if (h) {
      return h.seek(undefined, this.soundid.getValue()) as number
    }
    return 1
  }

  seek = (time: number) => {
    const h = this.howl.getValue()
    if (!h) return
    const duration = this.duration.getValue()
    if (time < 0) time = 0
    if (time >= duration) time = duration - 0.05
    h.seek(time, this.soundid.getValue())
  }

  toggle = () => {

  }

  scrollSeek(e: React.WheelEvent<HTMLDivElement>) {
    e.stopPropagation()
    const dt = e.deltaY / 100
    const target = this.position() - dt
    this.seek(target)
  }
}

export const Music = new MusicState()

export function playAnimEffect(el?: HTMLElement) {
  
} 
