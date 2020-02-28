import { RawMap, NoteType, Slide } from "bangbangboom-game"
import { EditMap } from "../MappingScope/EditMap"

export function toGameContent(map: EditMap): RawMap {
  const notes: NoteType[] = []
  const slides: Slide[] = []

  const slideIdIndex: { [key: number]: number } = {}

  for (const [id, s] of map.slides) {
    slideIdIndex[id] = slides.length
    slides.push({ id: slides.length, flickend: s.flickend })
  }

  for (const [, n] of map.notes) {
    if (n.type === "single")
      notes.push({ type: "single", time: n.realtimecache, lane: n.lane, onbeat: n.offset % 48 === 0 })
    else if (n.type === "flick")
      notes.push({ type: "flick", time: n.realtimecache, lane: n.lane })
    else
      notes.push({ type: "slide", time: n.realtimecache, lane: n.lane, slideid: slideIdIndex[n.slide] })
  }

  return { notes, slides }
}
