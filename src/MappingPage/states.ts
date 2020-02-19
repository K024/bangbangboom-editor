import { useState, useEffect } from "react"
import { scope } from "../MappingScope/scope"
import { observable, autorun } from "mobx"
import { AudioInstance, AudioSource, AudioElInstance } from "../Common/AudioCtx"

export function useMapChange() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const listener = () => setI(i => i + 1)
    scope.map.changeListeners.add(listener)
    return () => { scope.map.changeListeners.delete(listener) }
  }, [])

  return i
}

class BackgroundState {
  @observable src = ""
}

export const Background = new BackgroundState()

class MusicState {

  constructor() {
    autorun(() => {
      if (this.audio) {
        this.audio.setRate(this.playbackrate)
        this.audio.volume = scope.settings.general.song_volume
      }
    })
  }

  @observable private audio = null as null | AudioInstance | AudioElInstance
  get loaded() { return this.audio !== null }
  @observable duration = 5
  @observable playing = false
  @observable playbackrate = 1
  @observable seekcounter = 0

  musicfile: null | File = null

  load = (file: File, onerror: () => void, onload: () => void) => {
    const m = this
    if (m.audio !== null) {
      m.audio.stop()
    }
    m.audio = null
    m.duration = 5
    m.playing = false
    m.seekcounter = 0
    m.musicfile = null

    if (scope.settings.editor.keep_pitch) {
      const instance = new AudioElInstance(file)

      instance.onload.add(() => {
        this.musicfile = file
        m.duration = instance.duration
        instance.setRate(this.playbackrate)
        onload()

        this.audio = instance
        this.audio.onend.add(() => {
          this.playing = false
        })
      })

      instance.onloaderr.add(err => {
        console.error(err)
        onerror()
      })
      return
    }

    const source = AudioSource.from(file)

    source.onload.add(() => {
      this.musicfile = file
      m.duration = source.duration
      onload()

      this.audio = new AudioInstance(source)
      this.audio.setRate(this.playbackrate)
      this.audio.onend.add(() => {
        this.playing = false
      })
    })

    source.onloaderr.add(err => {
      console.error(err)
      onerror()
    })

    source.load()
  }

  position = () => {
    if (this.audio) return this.audio.position
    return 1
  }

  /**
   * valid only if playing
   */
  remaintime = () => {
    return (this.duration - this.position()) / this.playbackrate
  }

  seek = (time: number) => {
    if (!this.audio) return
    const duration = this.duration
    if (time < 0) time = 0
    if (time >= duration) time = duration - 0.05
    this.audio.seek(time)
    this.seekcounter++
  }

  toggle = () => {
    if (!this.audio) return
    if (this.playing) {
      this.audio.pause()
      this.playing = false
    } else {
      this.audio.play()
      this.playing = true
    }
  }

  scrollSeek = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const dt = e.deltaY / 100
    const target = this.position() - dt
    this.seek(target)
  }

  stop = () => {
    if (this.audio)
      this.audio.stop()
  }
}

export const Music = new MusicState()
