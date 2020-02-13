import { neverHappen, assert, entryList } from "../Common/utils"

export type WithId = {
  id: number
}

export type TimedPosition = {
  /**
   * id of timepoint to measure time in gamemap
   */
  timepoint: number

  /**
   * the count of 1/96 beats from that timepoint
   */
  offset: number

  /**
   * the lane that the note lays on (left most: 0, right most: 6)
   */
  lane: number

  /**
   * the cached real time
   * won't be update if timepoint changed
   */
  realtimecache: number
} & WithId

export type SingleNote = {
  type: "single"
} & TimedPosition

export type FlickNote = {
  type: "flick"
} & TimedPosition

export type Slide = {
  /**
   * note id from first to last ordered
   */
  notes: number[]
  flickend: boolean
} & WithId

export type SlideNote = {
  type: "slide"
  /**
   * slide id
   */
  slide: number
} & TimedPosition

export type NoteType = SingleNote | FlickNote | SlideNote

export type Timepoint = {
  /**
   * the start time of this timepoint in seconds
   */
  time: number

  /**
   * beats per minute
   */
  bpm: number

  /**
   * the cached time of 1/96 beat
   */
  ticktimecache: number

  /**
   * beats per bar (assumes one beat = 1/4)
   */
  bpb: number
} & WithId

type EditMapForJson = {
  timepoints: Array<[number, Timepoint]>
  slides: Array<[number, Slide]>
  notes: Array<[number, NoteType]>
}

export function TimepointSignature(tp: Timepoint) {
  return `tp:${tp.time}`
}
export function NoteSignature(note: NoteType) {
  return `note:${note.timepoint}:${note.offset}:${note.lane}`
}

export class EditMap {
  /**
   * id => timepoint
   */
  timepoints: Map<number, Timepoint>
  /**
   * signature => timepoint
   */
  timepointsignature: Map<string, Timepoint>

  /**
   * id => slide
   */
  slides: Map<number, Slide>

  /**
   * id => note
   */
  notes: Map<number, NoteType>
  /**
   * signature => note
   */
  notesignature: Map<string, NoteType>

  private constructor() { neverHappen() }

  static create(): EditMap {
    return {
      timepoints: new Map(),
      timepointsignature: new Map(),
      slides: new Map(),
      notes: new Map(),
      notesignature: new Map(),
    }
  }

  static toJsonString(map: DeepReadonly<EditMap>) {
    const { timepoints, slides, notes } = map as EditMap
    const forJson: EditMapForJson = {
      timepoints: entryList(timepoints),
      slides: entryList(slides),
      notes: entryList(notes)
    }
    forJson.timepoints.forEach(x => delete x[1].ticktimecache)
    forJson.notes.forEach(x => delete x[1].realtimecache)
    return JSON.stringify(forJson)
  }

  static fromJson(json: string): EditMap {
    const { timepoints, slides, notes } = JSON.parse(json) as EditMapForJson
    const map: EditMap = {
      timepoints: new Map(timepoints),
      timepointsignature: new Map(timepoints.map(x => [TimepointSignature(x[1]), x[1]])),
      slides: new Map(slides),
      notes: new Map(notes),
      notesignature: new Map(notes.map(x => [NoteSignature(x[1]), x[1]]))
    }
    if (map.timepoints.size !== map.timepointsignature.size) neverHappen()
    if (map.notes.size !== map.notesignature.size) neverHappen()
    if (slides.some(x => x[1].notes.some(n => !map.notes.has(n)))) neverHappen()
    if (notes.some(x => x[1].type === "slide" && !map.slides.has(x[1].slide))) neverHappen()
    timepoints.forEach(x => FreshTimepointCache(x[1]))
    notes.forEach(x => FreshNoteCache(map, x[1]))
    return map
  }
}

export function FreshTimepointCache(tp: Timepoint) {
  tp.ticktimecache = 60 / tp.bpm / 96
}

export function FreshNoteCache(map: EditMap, n: TimedPosition) {
  const tp = assert(map.timepoints.get(n.timepoint))
  n.realtimecache = tp.time + tp.ticktimecache * n.offset
}

export function ResortSlide(map: EditMap, slide: Slide) {
  let hasEqual = false
  const sorted = slide.notes.sort((a, b) => {
    const res = assert(map.notes.get(a)).realtimecache - assert(map.notes.get(b)).realtimecache
    if (res === 0) hasEqual = true
    return res
  })
  if (!hasEqual) slide.notes = sorted
  return hasEqual
}
