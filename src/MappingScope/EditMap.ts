import { neverHappen, gard, assert } from "../Common/utils"
import { Fields } from "../Common/binarySearch"

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
  notes: SlideNote[]
  flickend: boolean
} & WithId

export type SlideNote = {
  type: "slide"
  slideid: number
  isfirst: boolean
  islast: boolean
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

export class EditMap {
  timepoints: Timepoint[]
  timepointsmap: Map<number, Timepoint>

  slides: Slide[]
  slidesmap: Map<number, Slide>

  notes: NoteType[]
  notesmap: Map<number, NoteType>

  private constructor() { neverHappen() }

  static create(): EditMap {
    return {
      timepoints: [],
      timepointsmap: new Map(),
      slides: [],
      slidesmap: new Map(),
      notes: [],
      notesmap: new Map(),
    }
  }

  static toJsonString(map: DeepReadonly<EditMap>) {
    const { timepoints, slides, notes } = map
    return JSON.stringify({
      timepoints, slides, notes
    })
  }

  static fromJson(json: string): EditMap {
    const raw = JSON.parse(json) as EditMap
    raw.timepointsmap = new Map(raw.timepoints.map(x => [x.id, x]))
    raw.notesmap = new Map(raw.notes.map(x => [x.id, x]))
    raw.slidesmap = new Map(raw.slides.map(x => [x.id, x]))
    return raw
  }
}

export const TimepointOrderFields: Fields<Timepoint> = [tp => tp.time]
export const NotesOrderFields: Fields<NoteType> = [n => n.realtimecache, n => n.lane]
export const SlideOrderFields: Fields<Slide> = [s => gard(s.notes[0]?.realtimecache, -1), s => s.notes.length, s => s.id]
export const SlideNoteOrderFields: Fields<SlideNote> = [s => s.realtimecache]

export const FreshTimepointCache = (...timepoints: Timepoint[]) => {
  for (const tp of timepoints) {
    tp.ticktimecache = 60 / tp.bpm / 96
  }
}

export const FresNoteCache = (map: EditMap, ...notes: TimedPosition[]) => {
  let tp: Timepoint = null as any
  for (const n of notes) {
    if (!tp || tp.id !== n.timepoint) tp = assert(map.timepointsmap.get(n.timepoint))
    n.realtimecache = tp.time + tp.ticktimecache * n.offset
  }
}
