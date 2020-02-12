import { EditMap, Slide, SlideOrderFields } from "../../EditMap"
import { insertIntoSortedSet } from "../../../Common/sortedSet"
import { neverHappen, assert } from "../../../Common/utils"
import { makeAction } from "./types"


const add = (map: EditMap, id: number, flickend: boolean) => {
  const slide: Slide = {
    id, notes: [], flickend
  }

  const res = insertIntoSortedSet(map.slides, slide, SlideOrderFields)[0]
  if (!res) neverHappen()

  return slide
}

const del = (map: EditMap, id: number) => {
  const index = map.slides.findIndex(x => x.id === id)
  if (index < 0) neverHappen()
  const s = map.slides[index]
  if (s.notes.length > 0) neverHappen()
  map.slides.splice(index, 1)
  map.slidesmap.delete(s.id)

  return s
}

const setField = (map: EditMap, id: number, flickend: boolean) => {
  const s = assert(map.slidesmap.get(id))

  if (s.flickend === flickend) return
  const prev = s.flickend
  s.flickend = flickend

  return { prev }
}

export const AddSlide = makeAction((map: EditMap, id: number, flickend: boolean) => {
  const res = add(map, id, flickend)
  if (res)
    return (map: EditMap) => del(map, res.id)
})

export const RemoveSlide = makeAction((map: EditMap, id: number) => {
  const res = del(map, id)
  if (res)
    return (map: EditMap) => add(map, res.id, res.flickend)
})

export const SetSlide = makeAction((map: EditMap, id: number, flickend: boolean) => {
  const res = setField(map, id, flickend)
  if (res)
    return (map: EditMap) => setField(map, id, res.prev)
})
