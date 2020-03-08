import { observable, reaction, action } from "mobx"
import { scope } from "../../../MappingScope/scope"


export const TimingState = observable({
  bpm: 90,
  bpb: 4,
  time: 0,

  selected: null as null | number,

  muteticker: false,
  measuring: false,

  autoswitchtp: true, // in Timing pad, anim loop
})

reaction(() => TimingState.selected, action(selected => {
  if (selected !== null) {
    const tp = scope.map.timepoints.get(selected)
    if (!tp) {
      TimingState.selected = null
      return
    }
    TimingState.bpm = tp.bpm
    TimingState.bpb = tp.bpb
    TimingState.time = tp.time
  }
}))
