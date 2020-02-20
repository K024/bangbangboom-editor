import { observable, reaction } from "mobx"
import { assert } from "../../../Common/utils"
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

reaction(() => TimingState.selected, selected => {
  if (selected !== null) {
    const tp = assert(scope.map.timepoints.get(selected))
    TimingState.bpm = tp.bpm
    TimingState.bpb = tp.bpb
    TimingState.time = tp.time
  }
})
