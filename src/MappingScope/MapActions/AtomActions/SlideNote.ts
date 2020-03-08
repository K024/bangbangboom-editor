import { EditMap, SlideNote, FreshNoteCache, ResortSlide } from "../../EditMap"
import { assert, neverHappen, shallowPatch } from "../../../Common/utils"
import { makeAction } from "./types"
import { observable } from "mobx"


const add = (map: EditMap, id: number, slide: number, timepoint: number, offset: number, lane: number) => {
  const note: SlideNote = observable({
    type: "slide",
    id, slide, timepoint, offset, lane,
    realtimecache: 0
  })

  const s = assert(map.slides.get(slide))
  s.notes.push(id)
  map.notes.set(id, note)

  FreshNoteCache(map, note)
  ResortSlide(map, s)

  return note
}

const del = (map: EditMap, id: number) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "slide") neverHappen()

  const s = assert(map.slides.get(note.slide))
  s.notes = s.notes.filter(x => x !== note.id)
  map.notes.delete(id)
  
  ResortSlide(map, s)

  return note
}

type PatchType = Partial<Pick<SlideNote, "timepoint" | "offset" | "lane">>

const setv = (map: EditMap, id: number, patch: PatchType) => {
  const note = assert(map.notes.get(id))
  if (note.type !== "slide") neverHappen()
  const changes = shallowPatch(note, patch)
  if (changes) {

    FreshNoteCache(map, note)

    const s = assert(map.slides.get(note.slide))
    ResortSlide(map, s)

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
