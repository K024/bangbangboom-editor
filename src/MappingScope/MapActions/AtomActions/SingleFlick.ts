import { EditMap, SingleNote, FlickNote, NotesOrderFields, FresNoteCache as FreshNoteCache } from "../../EditMap"
import { makeAction } from "./types"
import { insertIntoSortedSet, justifySortedSet } from "../../../Common/sortedSet"
import { assert, neverHappen, patch } from "../../../Common/utils"

type SingleOrFlick = (SingleNote | FlickNote)

const add = (map: EditMap, id: number, type: SingleOrFlick["type"], timepoint: number, offset: number, lane: number) => {
  const note =
    { type: type as "single", id, timepoint, offset, lane, realtimecache: 0 } as SingleOrFlick
  FreshNoteCache(map, note)

  const res = insertIntoSortedSet(map.notes, note, NotesOrderFields)[0]
  if (res) {
    map.notesmap.set(note.id, note)
    return note
  }
}

const del = (map: EditMap, id: number) => {
  const index = map.notes.findIndex(x => x.id === id)
  if (index < 0) neverHappen()
  const note = map.notes[index]
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  map.notes.splice(index, 1)
  map.notesmap.delete(id)

  return note
}

const setsafe = (map: EditMap, id: number, type: SingleOrFlick["type"]) => {
  const note = assert(map.notesmap.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  const update = patch(note, { type })
  if (update) {
    return update
  }
}

const setbreaking = (map: EditMap, id: number, timepoint?: number, offset?: number, lane?: number) => {
  const note = assert(map.notesmap.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  const update = patch(note, { timepoint, offset, lane })
  if (update) {
    FreshNoteCache(map, note)
    const previndex = map.notes.indexOf(note)
    const res = justifySortedSet(map.notes, previndex, NotesOrderFields)[0]
    if (!res) {
      patch(note, update)
      return
    }
    return update
  }
}

type EditableFields = Exclude<keyof SingleOrFlick, "id" | "realtimecache">

const setFiled = <T extends EditableFields>(map: EditMap, id: number, field: T, value: SingleOrFlick[T]) => {
  const note = assert(map.notesmap.get(id))
  if (note.type !== "single" && note.type !== "flick") neverHappen()
  const prev = note[field]
  if (prev === value) return
  note[field] = value

  if (field === "offset") {
    FreshNoteCache(map, note)

    const prevIndex = map.notes.indexOf(note)
    const res = justifySortedSet(map.notes, prevIndex, NotesOrderFields)[0]

    if (!res) {
      note[field] = prev
      FreshNoteCache(map, note)
      return
    }
  }

  return { prev }
}


export const AddSingleFlick = makeAction((map: EditMap, id: number, type: SingleOrFlick["type"], timepoint: number, offset: number, lane: number) => {
  const res = add(map, id, type, timepoint, offset, lane)
  if (res)
    return (map: EditMap) => del(map, res.id)
})

export const DelSingleFlick = makeAction((map: EditMap, id: number) => {
  const res = del(map, id)
  if (res)
    return (map: EditMap) => add(map, res.id, res.type as SingleOrFlick["type"], res.timepoint, res.offset, res.lane)
})

export const SetSingleFlick = makeAction(<T extends EditableFields>(map: EditMap, id: number, field: T, value: SingleOrFlick[T]) => {
  const res = setFiled(map, id, field, value)
  if (res)
    return (map: EditMap) => setFiled(map, id, field, res.prev)
})
