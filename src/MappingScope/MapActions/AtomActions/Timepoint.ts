import { EditMap, Timepoint, FreshTimepointCache } from "../../EditMap"
import { assert, shallowPatch } from "../../../Common/utils"
import { makeAction } from "./types"
import { observable } from "mobx"

const add = (map: EditMap, id: number, time: number, bpm: number, bpb: number) => {
  const newtp: Timepoint =
    observable({ id, time, bpm, bpb, ticktimecache: 0 })

  map.timepoints.set(newtp.id, newtp)

  FreshTimepointCache(newtp)
  return newtp
}

const del = (map: EditMap, id: number) => {
  const tp = assert(map.timepoints.get(id))
  map.timepoints.delete(id)

  return tp
}

type PatchType = Partial<Pick<Timepoint, "time" | "bpm" | "bpb">>

const setv = (map: EditMap, id: number, patch: PatchType) => {
  const tp = assert(map.timepoints.get(id))
  const changes = shallowPatch(tp, patch)
  if (changes) {

    FreshTimepointCache(tp)
    return changes
  }
}

export const TimepointActions = {
  Add: makeAction((map: EditMap, id: number, time: number, bpm: number, bpb: number) => {
    const res = add(map, id, time, bpm, bpb)
    if (res)
      return (map: EditMap) => del(map, res.id)
  }),
  Remove: makeAction((map: EditMap, id: number) => {
    const res = del(map, id)
    if (res)
      return (map: EditMap) => add(map, res.id, res.time, res.bpm, res.bpb)
  }),
  Set: makeAction((map: EditMap, id: number, patch: PatchType) => {
    const res = setv(map, id, patch)
    if (res)
      return (map: EditMap) => setv(map, id, res)
  })
}
