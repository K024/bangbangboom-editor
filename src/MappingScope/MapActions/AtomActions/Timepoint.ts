import { EditMap, Timepoint, TimepointOrderFields, FreshTimepointCache } from "../../EditMap"
import { removeIndex, assert, neverHappen, patch } from "../../../Common/utils"
import { makeAction } from "./types"
import { insertIntoSortedSet, justifySortedSet } from "../../../Common/sortedSet"

const add = (map: EditMap, id: number, time: number, bpm: number, bpb: number) => {
  const newtp: Timepoint =
    { id, time, bpm, bpb, ticktimecache: 0 }
  FreshTimepointCache(newtp)

  const res = insertIntoSortedSet(map.timepoints, newtp, TimepointOrderFields)[0]

  if (res) {
    map.timepointsmap.set(newtp.id, newtp)
    return newtp
  }
}

const del = (map: EditMap, id: number) => {
  const index = map.timepoints.findIndex(x => x.id === id)
  if (index < 0) neverHappen()
  map.timepointsmap.delete(id)
  return removeIndex(map.timepoints, index)
}

const setsafe = (map: EditMap, id: number, bpm?: number, bpb?: number) => {
  const tp = assert(map.timepointsmap.get(id))
  const update = patch(tp, { bpm, bpb })
  if (update) {
    if (update.bpm !== undefined)
      FreshTimepointCache(tp)

    return update
  }
}

const setbreaking = (map: EditMap, id: number, time: number) => {
  const tp = assert(map.timepointsmap.get(id))
  const update = patch(tp, { time })
  if (update) {
    const previndex = map.timepoints.indexOf(tp)
    const res = justifySortedSet(map.timepoints, previndex, TimepointOrderFields)[0]
    if (!res) {
      patch(tp, update)
      return
    }
    return update as { time: number }
  }
}

export const TimepointActions = {
  Add: makeAction((map: EditMap, id: number, time: number, bpm: number, bpb: number) => {
    const res = add(map, id, time, bpm, bpb)
    if (res)
      return (map: EditMap) => del(map, id)
  }),
  Remove: makeAction((map: EditMap, id: number) => {
    const res = del(map, id)
    if (res)
      return (map: EditMap) => add(map, res.id, res.time, res.bpm, res.bpb)
  }),
  SetSafe: makeAction((map: EditMap, id: number, bpm?: number, bpb?: number) => {
    const res = setsafe(map, id, bpm, bpb)
    if (res)
      return (map: EditMap) => setsafe(map, id, res.bpm, res.bpb)

  }),
  SetBreaking: makeAction((map: EditMap, id: number, time: number) => {
    const res = setbreaking(map, id, time)
    if (res)
      return (map: EditMap) => setbreaking(map, id, res.time)
  })
}
