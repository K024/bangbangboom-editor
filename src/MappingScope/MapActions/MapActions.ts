import { NoteType, SingleNote, FlickNote, FreshNoteCache } from "../EditMap"
import { SingleFlickActions } from "./AtomActions/SingleFlick"
import { randomId, assert, neverHappen } from "../../Common/utils"
import { SlideActions } from "./AtomActions/Slide"
import { SlideNoteActions } from "./AtomActions/SlideNote"
import { TimepointActions } from "./AtomActions/Timepoint"
import { MapActionsBase } from "./MapAtionsBase"
import { action } from "mobx"


export class MapActions extends MapActionsBase {

  @action.bound
  addTimepoint(time: number, bpm: number, bpb: number, justifydivision: number) {
    return this.done(this.history.doParallel(() => {
      if (this.history.callAtom(TimepointActions.Add, randomId(), time, bpm, bpb)) {
        this.justifyFindNearest(this.notelist, justifydivision)
      }
    }))
  }

  @action.bound
  moveTimepoint(timepoint: number, justifyFindNearest: boolean, justifydivision: number, time?: number, bpm?: number, bpb?: number) {
    const tp = assert(this.state.timepoints.get(timepoint))
    const timechanged =
      (time !== undefined && tp.time !== time) ||
      (bpm !== undefined && tp.bpm !== bpm)
    return this.done(this.history.doParallel(() => {
      if (this.history.callAtom(TimepointActions.Set, timepoint, { time, bpm, bpb })) {
        if (timechanged)
          if (justifyFindNearest) {
            this.justifyFindNearest(this.notelist, justifydivision)
          } else {
            this.justifyFollowChanged(this.notelist, justifydivision)
          }
      }
    }))
  }

  @action.bound
  removeTimepoint(timepoint: number, justifydivision: number) {
    if (this.state.timepoints.size > 1) {
      return this.done(this.history.doParallel(() => {
        this.justifyFindNearest(this.notelist, justifydivision, timepoint)
        this.history.callAtom(TimepointActions.Remove, timepoint)
      }))
    } else {
      return this.done(this.history.doParallel(() => {
        this.deleteMany(this.notelist)
        this.history.callAtom(TimepointActions.Remove, timepoint)
        if (this.state.slides.size ||
          this.state.notes.size ||
          this.state.timepoints.size) neverHappen()
      }))
    }
  }

  @action.bound
  addSingle(timepoint: number, offset: number, lane: number) {
    return this.done(this.history.doTransaction(() =>
      this.history.callAtom(SingleFlickActions.Add, randomId(), "single", timepoint, offset, lane)))
  }

  @action.bound
  toggleFlick(note: SingleNote | FlickNote) {
    return this.done(this.history.doTransaction(() =>
      this.history.callAtom(SingleFlickActions.Set, note.id, {
        type: note.type === "single" ? "flick" : "single"
      })))
  }

  @action.bound
  addSlide(tp1: number, off1: number, lane1: number, tp2: number, off2: number, lane2: number) {
    const sid = randomId()
    return this.done(this.history.doTransaction(() =>
      this.history.callAtom(SlideActions.Add, sid, false) &&
      this.history.callAtom(SlideNoteActions.Add, randomId(), sid, tp1, off1, lane1) &&
      this.history.callAtom(SlideNoteActions.Add, randomId(), sid, tp2, off2, lane2)))
  }

  @action.bound
  toggleFlickend(slide: number) {
    const s = assert(this.state.slides.get(slide))
    return this.done(this.history.doTransaction(() =>
      this.history.callAtom(SlideActions.Set, slide, { flickend: !s.flickend })))
  }

  @action.bound
  addSlideMid(slide: number, timepoint: number, offset: number, lane: number) {
    return this.done(this.history.doTransaction(() =>
      this.history.callAtom(SlideNoteActions.Add, randomId(), slide, timepoint, offset, lane)))
  }

  @action.bound
  moveMany(notes: NoteType[], timeoffset: number, min: number, max: number, laneoffset: number, division: number) {
    return this.done(this.history.doTransaction(() => {
      for (const n of notes) {
        const targetTime = n.realtimecache + timeoffset
        const targetLane = n.lane + laneoffset
        if (targetTime > max || targetTime < min || targetLane < 0 || targetLane > 6) {
          for (const n of notes) FreshNoteCache(this.state, n)
          return false
        }
        this.patchNote(n, { lane: targetLane })
        n.realtimecache = targetTime
      }
      this.justifyFindNearest(notes, division)
      return true
    }))
  }

  @action.bound
  copyMany(notes: NoteType[], timeoffset: number, min: number, max: number, laneoffset: number, division: number) {
    return this.done(this.history.doTransaction(() => {
      const slideidmap: { [key: number]: number } = {}
      const slideNoteCount: { [key: number]: number } = {}
      for (const n of notes) {
        if (n.type === "slide")
          slideNoteCount[n.slide] = (slideNoteCount[n.slide] && slideNoteCount[n.slide] + 1) || 1
      }
      for (const slide in slideNoteCount) {
        const slideid = parseInt(slide)
        if (slideNoteCount[slideid] >= 2) {
          const id = randomId()
          this.history.callAtom(SlideActions.Add, id,
            assert(this.state.slides.get(slideid)).flickend)
          slideidmap[slideid] = id
        }
      }

      for (const n of notes) {
        const targetTime = n.realtimecache + timeoffset
        const targetLane = n.lane + laneoffset
        if (targetTime > max || targetTime < min || targetLane < 0 || targetLane > 6) {
          return false
        }
        const res = assert(this.calcNearestPosition(targetTime, division))
        if (n.type === "slide") {
          const slide = slideidmap[n.slide]
          if (!slide) continue
          const done = this.history.callAtom(SlideNoteActions.Add, randomId(), slide, res.timepoint.id, res.offset, targetLane)
          if (!done) return false
        } else {
          const done = this.history.callAtom(SingleFlickActions.Add, randomId(), n.type, res.timepoint.id, res.offset, targetLane)
          if (!done) return false
        }
      }
      return true
    }))
  }

  @action.bound
  removeNotes(notes: NoteType[]) {
    return this.done(this.history.doParallel(() => {
      this.deleteMany(notes)
    }))
  }

}
