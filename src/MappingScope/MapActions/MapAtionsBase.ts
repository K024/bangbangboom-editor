import { CommonActions } from "./CommonActions"
import { EditMap, NoteType, Slide, Timepoint, FreshNoteCache, SlideNote } from "../EditMap"
import { SingleFlickActions } from "./AtomActions/SingleFlick"
import { assert, entryList } from "../../Common/utils"
import { SlideNoteActions } from "./AtomActions/SlideNote"
import { SlideActions } from "./AtomActions/Slide"


export class MapActionsBase extends CommonActions<EditMap> {

  constructor(map: EditMap) {
    super(map)

    this.changeListeners.add(() => {
      this._timepoints = null
      this._slides = null
      this._notes = null
    })
  }

  // refresh when add, remove, set
  protected _timepoints: Timepoint[] | null = null
  // refresh when add, remove
  protected _slides: Slide[] | null = null
  // refresh when add, remove
  protected _notes: NoteType[] | null = null

  get timepoints() { return this.state.timepoints as ReadonlyMap<number, Timepoint> }
  get slides() { return this.state.slides as ReadonlyMap<number, Slide> }
  get notes() { return this.state.notes as ReadonlyMap<number, NoteType> }

  get timepointlist() {
    if (!this._timepoints) {
      this._timepoints = entryList(this.state.timepoints).map(x => x[1]).sort((a, b) => (a.time - b.time) || (a.id - b.id))
    }
    return this._timepoints
  }
  get slidelist() {
    if (!this._slides) {
      this._slides = entryList(this.state.slides).map(x => x[1])
    }
    return this._slides
  }
  get notelist() {
    if (!this._notes) {
      this._notes = entryList(this.state.notes).map(x => x[1])
    }
    return this._notes
  }

  findTimepoint(time: number) {
    const tps = this.timepointlist
    if (tps.length <= 0) return
    let tpindex = 0
    while (tpindex < tps.length && time >= tps[tpindex].time) tpindex++
    if (tpindex > 0) tpindex--
    return tps[tpindex]
  }

  /**
   * calculate the nearest timepoint position  
   * divisions of one quarter beat  
   * @param time     - the time to calculate
   * @param division - the division 
   */
  calcNearestPosition(time: number, division: number) {
    const tickcount = 48 / division
    const tp = this.findTimepoint(time)
    if (!tp) return
    const offset = Math.round((time - tp.time) / (tp.ticktimecache * tickcount)) * tickcount
    const realtime = tp.time + tp.ticktimecache * offset
    const rtp = this.findTimepoint(realtime + tp.ticktimecache) // when its very near to next tp, switch to next
    if (rtp && rtp.id !== tp.id) return {
      timepoint: rtp.id, offset: 0
    }
    return {
      timepoint: tp.id, offset
    }
  }

  protected patchNote(note: NoteType, patch: { timepoint?: number, offset?: number, lane?: number }) {
    if (note.type === "slide") {
      return this.history.callAtom(SlideNoteActions.Set, note.id, patch)
    }
    return this.history.callAtom(SingleFlickActions.Set, note.id, patch)
  }

  /**
   * try to keep the note's timepoint and offset  
   * refresh note cache first  
   * if the note still in its timepoint, no change  
   * else find the proper position for it by division  
   */
  protected justifyFollowChanged(notes: NoteType[], division: number) {
    for (const n of notes) {
      FreshNoteCache(this.state, n)
      const res = assert(this.calcNearestPosition(n.realtimecache, division))
      if (res.timepoint !== n.timepoint || res.offset !== n.offset) {
        this.patchNote(n, res)
      }
    }
  }

  /**
   * keep realtime cache  
   * if note still in unchanged timepoint, no change  
   * else find the proper position for it by division  
   */
  protected justifyFindNearest(notes: NoteType[], division: number) {
    for (const n of notes) {
      const res = assert(this.calcNearestPosition(n.realtimecache, division))
      if (res.timepoint !== n.timepoint || res.offset !== n.offset) {
        this.patchNote(n, res)
      }
    }
  }

  protected deleteSlideNote(note: SlideNote) {
    if (!this.state.notes.has(note.id)) return false
    const s = assert(this.state.slides.get(note.slide))
    if (s.notes.length > 2) {
      return this.history.callAtom(SlideNoteActions.Remove, note.id)
    } else {
      const n1 = s.notes[0], n2 = s.notes[1]
      return this.history.doTransaction(() =>
        this.history.callAtom(SlideNoteActions.Remove, n1) &&
        this.history.callAtom(SlideNoteActions.Remove, n2) &&
        this.history.callAtom(SlideActions.Remove, s.id)
      ) > 0
    }
  }

  protected deleteOne(note: NoteType) {
    if (!this.notes.has(note.id)) return false
    if (note.type === "slide") {
      return this.deleteSlideNote(note)
    }
    return this.history.callAtom(SingleFlickActions.Remove, note.id)
  }

  protected deleteMany(notes: NoteType[]) {
    for (const n of notes) {
      this.deleteOne(n)
    }
  }
}
