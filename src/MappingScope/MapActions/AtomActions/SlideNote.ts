import { EditMap, SlideNote, FreshNoteCache, NoteSignature, ResortSlide } from "../../EditMap"
import { assert, neverHappen, shallowPatch } from "../../../Common/utils"
import { makeAction } from "./types"


const add = (map: EditMap, id: number, slide: number, timepoint: number, offset: number, lane: number) => {
  const note: SlideNote = {
    type: "slide",
    id, slide, timepoint, offset, lane,
    realtimecache: 0
  }

  const sig = NoteSignature(note)
  if (map.notesignature.has(sig)) return

  const s = assert(map.slides.get(slide))
  s.notes.push(id)
  const hasEqual = ResortSlide(map, s)
  if (hasEqual) {
    s.notes.pop()
    return
  }

  map.notes.set(id, note)
  map.notesignature.set(sig, note)

  FreshNoteCache(map, note)
  return note
}

const del = (map: EditMap, id: number) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "slide") neverHappen()
  const s = assert(map.slides.get(note.slide))

  s.notes = s.notes.filter(x => x !== note.id)
  const hasEqual = ResortSlide(map, s)
  if (hasEqual) neverHappen()

  map.notes.delete(id)
  const sig = NoteSignature(note)
  map.notesignature.delete(sig)

  return note
}

type PatchType = Partial<Pick<SlideNote, "timepoint" | "offset" | "lane">>

const setv = (map: EditMap, id: number, patch: PatchType) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "slide") neverHappen()
  const prevsig = NoteSignature(note)
  const changes = shallowPatch(note, patch)
  if (changes) {
    const sig = NoteSignature(note)
    if (sig !== prevsig && map.notesignature.has(sig)) {
      shallowPatch(note, changes)
      return
    }

    FreshNoteCache(map, note)

    const s = assert(map.slides.get(note.slide))
    const hasEqual = ResortSlide(map, s)
    if (hasEqual) {
      shallowPatch(note, changes)
      FreshNoteCache(map, note)
      return
    }

    return changes
  }
}

export const SlideNoteActions = {
  Add: makeAction((map: EditMap, id: number, slide: number, timepoint: number, offset: number, lane: number) => {
    const res = add(map, id, slide, timepoint, offset, lane)
    if (res)
      return (map: EditMap) => del(map, res.id)
  }),
  Remove: makeAction((map: EditMap, id: number) => {
    const res = del(map, id)
    if (res)
      return (map: EditMap) => add(map, res.id, res.slide, res.timepoint, res.offset, res.lane)
  }),
  Set: makeAction((map: EditMap, id: number, patch: PatchType) => {
    const res = setv(map, id, patch)
    if (res)
      return (map: EditMap) => setv(map, id, res)
  })
}
