import { once, assert } from "../../../Common/utils"
import { AudioSource, loadFromUrl, AudioInstance } from "../../../Common/AudioCtx"
import assets from "../../assets"
import { useEffect } from "react"
import { MappingState } from "./sharedState"
import { Music } from "../../states"
import { binarySearch } from "../../../Common/binarySearch"
import { createAnimLoop } from "../../../Common/hooks"
import { autorun, observable } from "mobx"
import { scope } from "../../../MappingScope/scope"

const sounds = once(() => ({
  perfect: AudioSource.from(loadFromUrl(assets.perfect)).load(),
  flick: AudioSource.from(loadFromUrl(assets.flick)).load(),
}))

const images = once(() => {
  const list: (keyof typeof assets)[] = ["note_flick", "note_long", "note_normal", "note_slide_among"]
  list.forEach(async key => {
    const res = await fetch(assets[key])
    const file = await res.blob()
    assets[key] = URL.createObjectURL(file)
  })
})

let noSoundUntil = -1

const soundlist = observable({
  get list() {
    return MappingState.noteListOrdered.map(x => {
      if (x.type === "single") return { time: x.realtimecache, type: "single" }
      if (x.type === "flick") return { time: x.realtimecache, type: "flick" }
      const slide = assert(scope.map.slides.get(x.slide))
      if (x.id === slide.notes[slide.notes.length - 1] && slide.flickend)
        return { time: x.realtimecache, type: "flick" }
      return { time: x.realtimecache, type: "single" }
    })
  }
})

function animloop() {
  if (Music.playing) {
    const list = soundlist.list
    const position = Music.position()

    if (list.length <= 0) return
    let [index] = binarySearch(i => list[i].time, list.length, position)
    while (index < list.length && list[index].time <= position) index++
    if (index >= list.length) return

    const time = list[index].time
    if (time > position + 0.05) return
    if (time < noSoundUntil) return
    noSoundUntil = time + 0.01

    const s = sounds()

    while (index < list.length && list[index].time < noSoundUntil) {
      new AudioInstance(list[index].type === "single" ? s.perfect : s.flick)
        .play(list[index].time - position)
      index++
    }

  } else {
    noSoundUntil = -1
  }
}

autorun(() => {
  if (Music.position()) noSoundUntil = -1
})

export function useSoundEffect() {

  useEffect(() => {
    images()
  }, [])

  useEffect(() => createAnimLoop(animloop), [])

  useEffect(() => autorun(() => {
    const s = sounds()
    s.perfect.volume = scope.settings.general.effect_volume
    s.flick.volume = scope.settings.general.effect_volume
  }), [])
}