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
   * the count of 1/48 beats from that timepoint
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
   * the cached time of 1/48 beat
   */
  ticktimecache: number

  /**
   * beats per bar (assumes one beat = 1/4)
   */
  bpb: number
} & WithId

type EditMapForJson = {
  timepoints: Timepoint[]
  slides: Slide[]
  notes: NoteType[]
}


export class EditMap {
  /**
   * id => timepoint
   */
  timepoints: Map<number, Timepoint>

  /**
   * id => slide
   */
  slides: Map<number, Slide>

  /**
   * id => note
   */
  notes: Map<number, NoteType>

  private constructor(map: EditMap) {
    this.timepoints = map.timepoints
    this.slides = map.slides
    this.notes = map.notes
  }

  static create(): EditMap {
    return new EditMap({
      timepoints: new Map(),
      slides: new Map(),
      notes: new Map(),
    })
  }

  static toJsonString(map: DeepReadonly<EditMap>) {
    const { timepoints, slides, notes } = map as EditMap
    const forJson: EditMapForJson = {
      timepoints: entryList(timepoints).map(x => ({ ...x[1] })),
      slides: entryList(slides).map(x => ({ ...x[1] })),
      notes: entryList(notes).map(x => ({ ...x[1] }))
    }
    forJson.timepoints.forEach(x => delete x.ticktimecache)
    forJson.notes.forEach(x => delete x.realtimecache)
    return JSON.stringify(forJson)
  }

  static fromJson(json: string): EditMap {
    const { timepoints, slides, notes } = JSON.parse(json) as EditMapForJson
    const map: EditMap = {
      timepoints: new Map(timepoints.map(x => [x.id, x])),
      slides: new Map(slides.map(x => [x.id, x])),
      notes: new Map(notes.map(x => [x.id, x])),
    }
    if (slides.some(x => x.notes.some(n => !map.notes.has(n)))) neverHappen()
    if (notes.some(x => x.type === "slide" && !map.slides.has(x.slide))) neverHappen()
    if (notes.some(x => !map.timepoints.has(x.timepoint))) neverHappen()
    timepoints.forEach(x => FreshTimepointCache(x))
    notes.forEach(x => FreshNoteCache(map, x))
    return new EditMap(map)
  }
}

export function FreshTimepointCache(tp: Timepoint) {
  tp.ticktimecache = 60 / tp.bpm / 48
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
  slide.notes = sorted
  return hasEqual
}
