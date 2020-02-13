import { EditMap, SingleNote, FlickNote, FreshNoteCache, NoteSignature } from "../../EditMap"
import { makeAction } from "./types"
import { assert, neverHappen, shallowPatch } from "../../../Common/utils"

type SingleOrFlick = (SingleNote | FlickNote)

const add = (map: EditMap, id: number, type: SingleOrFlick["type"], timepoint: number, offset: number, lane: number) => {
  const note =
    { type: type as "single", id, timepoint, offset, lane, realtimecache: 0 } as SingleOrFlick
  const sig = NoteSignature(note)

  if (map.notesignature.has(sig)) return
  map.notes.set(note.id, note)
  map.notesignature.set(sig, note)

  FreshNoteCache(map, note)
  return note
}

const del = (map: EditMap, id: number) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  
  const sig = NoteSignature(note)
  map.notes.delete(id)
  map.notesignature.delete(sig)

  return note
}

type PatchType = Partial<Pick<SingleOrFlick, "type" | "timepoint" | "offset" | "lane">>

const setv = (map: EditMap, id: number, patch: PatchType) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  const prevsig = NoteSignature(note)
  const changes = shallowPatch(note, patch)
  if (changes) {
    const sig = NoteSignature(note)
    if (sig !== prevsig && map.notesignature.has(sig)) {
      shallowPatch(note, changes)
      return
    }

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
