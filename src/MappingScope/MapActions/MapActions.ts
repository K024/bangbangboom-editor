import { CommonActions } from "./CommonActions"
import { EditMap, NoteType, SingleNote, FlickNote, Slide } from "../EditMap"
import { SingleFlickActions } from "./AtomActions/SingleFlick"
import { randomId, assert, neverHappen } from "../../Common/utils"
import { SlideActions } from "./AtomActions/Slide"
import { SlideNoteActions } from "./AtomActions/SlideNote"


export class MapActions extends CommonActions<EditMap> {

  get map() { return this.state as DeepReadonly<EditMap> }

  addSingle(timepoint: number, offset: number, lane: number) {
    const h = this.history
    const step = h.doTransaction(() =>
      h.callAtom(SingleFlickActions.Add, randomId(), "single", timepoint, offset, lane)
    )
    return this.done(step)
  }

  toggleFlick(note: DeepReadonly<SingleNote | FlickNote>) {
    const h = this.history
    const step = h.doTransaction(() =>
      h.callAtom(SingleFlickActions.Set, note.id, { type: note.type === "single" ? "flick" : "single" })
    )
    return this.done(step)
  }

  addSlide(tp1: number, off1: number, lan1: number, tp2: number, off2: number, lan2: number) {
    const h = this.history
    const sid = randomId()
    const step = h.doTransaction(() =>
      h.callAtom(SlideActions.Add, sid, false) &&
      h.callAtom(SlideNoteActions.Add, randomId(), sid, tp1, off1, lan1) &&
      h.callAtom(SlideNoteActions.Add, randomId(), sid, tp2, off2, lan2))
    return this.done(step)
  }

  addSlideMid(sid: number, timepoint: number, offset: number, lane: number) {
    const h = this.history
    const step = h.doTransaction(() =>
      h.callAtom(SlideNoteActions.Add, randomId(), sid, timepoint, offset, lane))
    return this.done(step)
  }

  toggleFlickEnd(slide: DeepReadonly<Slide>) {
    const h = this.history
    const step = h.doTransaction(() =>
      h.callAtom(SlideActions.Set, slide.id, { flickend: !slide.flickend })
    )
    return this.done(step)
  }

  removeOne(note: DeepReadonly<NoteType>) {
    const h = this.history
    const step = h.doTransaction(() => {
      if (note.type === "slide") {
        const slide = assert(this.state.slides.get(note.slide))
        if (slide.notes.length < 2) neverHappen()
        if (slide.notes.length === 2) {
          return (
            h.callAtom(SlideNoteActions.Remove, slide.notes[0]) &&
            h.callAtom(SlideNoteActions.Remove, slide.notes[0]) &&
            h.callAtom(SlideActions.Remove, slide.id))
        } else {
          return h.callAtom(SlideNoteActions.Remove, note.id)
        }
      } else {
        return h.callAtom(SingleFlickActions.Remove, note.id)
      }
    })
    return this.done(step)
  }

  moveOne(note: DeepReadonly<NoteType>, timepoint: number, offset: number, lane: number) {
    const h = this.history
    const step = h.doTransaction(() => {
      if (note.type === "slide") {
        return h.callAtom(SlideNoteActions.Set, note.id, { timepoint, offset, lane })
      } else {
        return h.callAtom(SingleFlickActions.Set, note.id, { timepoint, offset, lane })
      }
    })
    return this.done(step)
  }
}
