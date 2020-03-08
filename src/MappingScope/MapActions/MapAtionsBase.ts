import { CommonActions } from "./CommonActions"
import { EditMap, NoteType, Slide, Timepoint, FreshNoteCache, SlideNote } from "../EditMap"
import { SingleFlickActions } from "./AtomActions/SingleFlick"
import { assert, entryList } from "../../Common/utils"
import { SlideNoteActions } from "./AtomActions/SlideNote"
import { SlideActions } from "./AtomActions/Slide"
import { computed } from "mobx"


export class MapActionsBase extends CommonActions<EditMap> {

  @computed get timepointlist() {
    return entryList(this.state.timepoints).map(x => x[1])
      .sort((a, b) => (a.time - b.time) || (a.id - b.id))
  }
  @computed get slidelist() {
    return entryList(this.state.slides).map(x => x[1])
  }
  @computed get notelist() {
    return entryList(this.state.notes).map(x => x[1])
  }

  get timepoints() { return this.state.timepoints as ReadonlyMap<number, Timepoint> }
  get slides() { return this.state.slides as ReadonlyMap<number, Slide> }
  get notes() { return this.state.notes as ReadonlyMap<number, NoteType> }

  findTimepoint(time: number, ignore?: number): [Timepoint | undefined, number] {
    const tps = this.timepointlist.filter(x => x.id !== ignore)
    if (tps.length <= 0) return [undefined, -1]
    let tpindex = 0
    while (tpindex < tps.length && time >= tps[tpindex].time) tpindex++
    if (tpindex > 0) tpindex--
    return [tps[tpindex], tpindex]
  }

  /**
   * calculate the nearest timepoint position  
   * divisions of one quarter beat  
   * @param time     - the time to calculate
   * @param division - the division 
   */
  calcNearestPosition(time: number, division: number, ignore?: number) {
    const tickcount = 48 / division
    const [tp, tpindex] = this.findTimepoint(time, ignore)
    if (!tp) return
    const offset = Math.round((time - tp.time) / (tp.ticktimecache * tickcount)) * tickcount
    const realtime = tp.time + tp.ticktimecache * offset
    const [rtp, rtpindex] = this.findTimepoint(realtime + tp.ticktimecache, ignore) // when its very near to next tp, switch to next
    if (rtp && rtp.id !== tp.id) return {
      timepoint: rtp,
      /** count of 1/48 quarter beat */
      offset: 0, timepointIndex: rtpindex, realtime: rtp.time
    }
    return {
      timepoint: tp,
      /** count of 1/48 quarter beat */
      offset, timepointIndex: tpindex, realtime
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
  protected justifyFollowChanged(notes: NoteType[], division: number, ignore?: number) {
    for (const n of notes) {
      FreshNoteCache(this.state, n)
      const res = this.calcNearestPosition(n.realtimecache, division, ignore)
      if (!res) {
        this.deleteOne(n)
      } else if (res.timepoint.id !== n.timepoint || res.offset !== n.offset) {
        this.patchNote(n, { timepoint: res.timepoint.id, offset: res.offset })
      }
    }
  }

  /**
   * keep realtime cache  
   * if note still in unchanged timepoint, no change  
   * else find the proper position for it by division  
   */
  protected justifyFindNearest(notes: NoteType[], division: number, ignore?: number) {
    for (const n of notes) {
      const res = this.calcNearestPosition(n.realtimecache, division, ignore)
      if (!res) {
        this.deleteOne(n)
      } else if (res.timepoint.id !== n.timepoint || res.offset !== n.offset) {
        this.patchNote(n, { timepoint: res.timepoint.id, offset: res.offset })
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
