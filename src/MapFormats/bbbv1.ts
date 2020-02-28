import { Timepoint, Slide, NoteType, FreshTimepointCache, SingleNote, FlickNote, SlideNote, EditMap } from "../MappingScope/EditMap"
import { randomId } from "../Common/utils"

function getTimepoint(items: string[]): Timepoint {
  const time = parseFloat(items[1])
  const bpm = parseFloat(items[2])
  const bpb = parseInt(items[3])
  return { time, bpm, bpb, id: randomId(), ticktimecache: 0 }
}

function getPos(item: string) {
  const parts = item.split(":")
  const offset = parseInt(parts[0]) * 2
  const lane = parseInt(parts[1])
  return { offset, lane }
}

function getSingle(items: string[], timepoint: number): SingleNote {
  return { type: "single", id: randomId(), timepoint, ...getPos(items[1]), realtimecache: 0 }
}

function getFlick(items: string[], timepoint: number): FlickNote {
  return { type: "flick", id: randomId(), timepoint, ...getPos(items[1]), realtimecache: 0 }
}

function getSlideNotes(items: string[], timepoint: number): [Slide, SlideNote[]] {
  const slide: Slide = { id: randomId(), flickend: items[1] === "1", notes: [] }
  const notes: SlideNote[] = []
  for (let i = 2; i < items.length; i++) {
    const n: SlideNote = { type: "slide", id: randomId(), timepoint, ...getPos(items[i]), realtimecache: 0, slide: slide.id }
    slide.notes.push(n.id)
    notes.push(n)
  }
  return [slide, notes]
}

export function fromBBBv1Format(content: string): EditMap {
  const lines = content.split(/\r?\n/).map(x => x.trim()).filter(x => x)
  const timepoints: Timepoint[] = []
  const slides: Slide[] = []
  const notes: NoteType[] = []
  let lasttp!: Timepoint
  for (const line of lines) {
    const items = line.split("|")
    switch (items[0]) {
      case "+": {
        lasttp = getTimepoint(items)
        FreshTimepointCache(lasttp)
        timepoints.push(lasttp)
        break
      }
      case "s": {
        notes.push(getSingle(items, lasttp.id))
        break
      }
      case "f": {
        notes.push(getFlick(items, lasttp.id))
        break
      }
      case "l": {
        const [s, ns] = getSlideNotes(items, lasttp.id)
        slides.push(s)
        notes.push(...ns)
        break
      }
    }
  }
  return EditMap.fromJson(JSON.stringify({ timepoints, slides, notes }))
}