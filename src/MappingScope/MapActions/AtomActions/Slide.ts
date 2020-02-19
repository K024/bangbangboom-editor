import { EditMap, Slide } from "../../EditMap"
import { assert, neverHappen, shallowPatch } from "../../../Common/utils"
import { makeAction } from "./types"


const add = (map: EditMap, id: number, flickend: boolean) => {
  const slide: Slide = {
    id, flickend, notes: []
  }
  map.slides.set(id, slide)

  return slide
}

const del = (map: EditMap, id: number) => {
  const s = assert(map.slides.get(id))
  if (s.notes.length > 0) neverHappen()

  map.slides.delete(id)

  return s
}

type PatchType = Partial<Pick<Slide, "flickend">>

const set = (map: EditMap, id: number, patch: PatchType) => {
  const s = assert(map.slides.get(id))
  const changes = shallowPatch(s, patch)
  if (changes) {

    return changes
  }
}

export const SlideActions = {
  Add: makeAction((map: EditMap, id: number, flickend: boolean) => {
    const res = add(map, id, flickend)
    if (res)
      return (map: EditMap) => del(map, res.id)
  }),
  Remove: makeAction((map: EditMap, id: number) => {
    const res = del(map, id)
    if (res)
      return (map: EditMap) => add(map, res.id, res.flickend)
  }),
  Set: makeAction((map: EditMap, id: number, patch: PatchType) => {
    const res = set(map, id, patch)
    if (res)
      return (map: EditMap) => set(map, id, res)
  })
}
