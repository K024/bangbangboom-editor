import { observable, computed, reaction } from "mobx"
import { Music } from "../../states"
import { scope } from "../../../MappingScope/scope"
import { assert } from "../../../Common/utils"
import { NoteType } from "../../../MappingScope/EditMap"

export type ToolTypes = "none" | "single" | "slide" | "delete"

class State {

  @observable private _viewposition = 0

  // some offset that let the progress line can be a little higher than view port bottom
  @computed get viewOffset() { return 100 / this.timeHeightFactor }

  @computed get viewduration() {
    return Music.duration - this.viewOffset
  }
  getViewposition = () => {
    if (this.tracking) return Music.position() - this.viewOffset
    return this._viewposition
  }
  setViewposition = (v: number) => {
    const offset = this.viewOffset
    if (v < -offset) v = -offset
    if (v > Music.duration - offset) v = Music.duration - 0.05 - offset
    if (this.tracking) Music.seek(v + offset)
    else this._viewposition = v
  }
  @observable tracking = false
  @observable timeHeightFactor = 400
  @observable division = 1
  @observable tool = "none" as ToolTypes

  // we mirror 1. notes layer (and bar layer) 2. action preview layer 3. input event handler
  @observable mirror = false

  @computed get paddedDuration() {
    return Music.duration * 1.2
  }


  @observable private mapChangeCounter = 1
  @computed get samePosNotes() {
    const notes = new Set<number>()
    if (this.mapChangeCounter) {
      const NoteSig = (n: NoteType) => `${n.timepoint}:${n.offset}:${n.lane}`
      for (const slide of scope.map.slidelist) {
        let from = assert(scope.map.notes.get(slide.notes[0]))
        for (let i = 1; i < slide.notes.length; i++) {
          const to = assert(scope.map.notes.get(slide.notes[i]))
          if (from.timepoint === to.timepoint && from.offset === to.offset) {
            notes.add(from.id)
            notes.add(to.id)
          }
          from = to
        }
      }
      const set = new Set<string>()
      for (const n of scope.map.notelist) {
        const sig = NoteSig(n)
        if (set.has(sig)) notes.add(n.id)
        set.add(sig)
      }
    }
    return notes
  }

  @computed get soundList() {
    const list: { time: number, type: "single" | "flick" }[] = []
    if (this.mapChangeCounter) {
      for (const n of scope.map.notelist) {
        if (n.type === "slide") {
          const s = assert(scope.map.slides.get(n.slide))
          if (s.flickend && n.id === s.notes[s.notes.length - 1])
            list.push({ time: n.realtimecache, type: "flick" })
          else
            list.push({ time: n.realtimecache, type: "single" })
        } else if (n.type === "flick")
          list.push({ time: n.realtimecache, type: "flick" })
        else
          list.push({ time: n.realtimecache, type: "single" })
      }
    }
    return list.sort((a, b) => a.time - b.time)
  }

  constructor() {
    reaction(() => this.tracking, t => {
      const offset = 100 / this.timeHeightFactor
      if (!t) this._viewposition = Music.position() - offset
    })
    scope.map.changeListeners.add(() => this.mapChangeCounter++)
  }
}

export const MappingState = new State()

export function GridD1() {
  const tps = scope.map.timepointlist
  const list: Array<{ time: number; name: string }> = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].time : Music.duration
    let beat = 1
    while (true) {
      const time = tp.time + tp.ticktimecache * 48 * beat
      if (time >= endtime) break
      const bar = ((beat / tp.bpb) | 0) + 1
      const innerbeat = (beat % tp.bpb) + 1
      list.push({
        time,
        name: `${i + 1}:${bar}:${innerbeat}`
      })
      beat++
    }
  }
  return list
}


export function GridD2() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].time : Music.duration
    let beat = 0
    const offset = tp.ticktimecache * 24
    while (true) {
      const time = tp.time + tp.ticktimecache * 48 * beat + offset
      if (time >= endtime) break
      list.push(time)
      beat++
    }
  }
  return list
}

export function GridD3() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].time : Music.duration
    let beat_3 = 1
    while (true) {
      const time = tp.time + tp.ticktimecache * 16 * beat_3
      if (time >= endtime) break
      list.push(time)
      beat_3++
      if (beat_3 % 3 === 0) beat_3++
    }
  }
  return list
}

export function GridD4() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = i < tps.length - 1 ? tps[i + 1].time : Music.duration
    let beat_2 = 0.5
    while (true) {
      const time = tp.time + tp.ticktimecache * 24 * beat_2
      if (time >= endtime) break
      list.push(time)
      beat_2++
    }
  }
  return list
}
