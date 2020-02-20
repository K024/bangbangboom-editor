import { observable, computed, reaction } from "mobx"
import { Music } from "../../states"
import { scope } from "../../../MappingScope/scope"

export type ToolTypes = "none" | "single" | "slide" | "delete"

class State {

  @observable private _viewposition = 0

  getViewposition = () => {
    if (this.tracking) return Music.position()
    return this._viewposition
  }
  setViewposition = (v: number) => {
    if (v < 0) v = 0
    if (v > Music.duration) v = Music.duration - 0.05
    if (this.tracking) Music.seek(v)
    else this._viewposition = v
  }
  @observable tracking = false
  @observable timeHeightFactor = 400
  @observable division = 1
  @observable tool = "none" as ToolTypes
  @observable mirror = false

  @computed get paddedDuration() {
    return Music.duration * 1.2
  }

  constructor() {
    reaction(() => this.tracking, t => {
      if (!t) this._viewposition = Music.position()
    })
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
        name: `${i + 1} : ${bar} : ${innerbeat}`
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
    let beat_2 = 1
    while (true) {
      const time = tp.time + tp.ticktimecache * 24 * beat_2
      if (time >= endtime) break
      list.push(time)
      beat_2++
    }
  }
  return list
}
