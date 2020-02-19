import { EditMap, SingleNote, FlickNote, FreshNoteCache } from "../../EditMap"
import { makeAction } from "./types"
import { neverHappen, shallowPatch, assert } from "../../../Common/utils"

type SingleOrFlick = (SingleNote | FlickNote)

const add = (map: EditMap, id: number, type: SingleOrFlick["type"], timepoint: number, offset: number, lane: number) => {
  const note =
    { type: type as "single", id, timepoint, offset, lane, realtimecache: 0 } as SingleOrFlick

  map.notes.set(note.id, note)

  FreshNoteCache(map, note)
  return note
}

const del = (map: EditMap, id: number) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  
  map.notes.delete(id)

  return note
}

type PatchType = Partial<Pick<SingleOrFlick, "type" | "timepoint" | "offset" | "lane">>

const setv = (map: EditMap, id: number, patch: PatchType) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  const changes = shallowPatch(note, patch)
  if (changes) {

    FreshNoteCache(map, note)
    return changes
  }
}

export const SingleFlickActions = {
  Add: makeAction((map: EditMap, id: number, type: SingleOrFlick["type"], timepoint: number, offset: number, lane: number) => {
    const res = add(map, id, type, timepoint, offset, lane)
    if (res)
      return (map: EditMap) => del(map, res.id)
  }),
  Remove: makeAction((map: EditMap, id: number) => {
    const res = del(map, id)
    if (res)
      return (map: EditMap) => add(map, res.id, res.type as SingleOrFlick["type"], res.timepoint, res.offset, res.lane)
  }),
  Set: makeAction((map: EditMap, id: number, patch: PatchType) => {
    const res = setv(map, id, patch)
    if (res)
      return (map: EditMap) => setv(map, id, res)
  })
}
