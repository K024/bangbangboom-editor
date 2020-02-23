import { observable, computed } from "mobx"
import { MappingState } from "../sharedState"
import { barTimeHeightFactor } from "./drawCanvas"

class State {
  @observable containerHeight = 0
  @computed get barHeight() { return MappingState.paddedDuration * barTimeHeightFactor }
  @computed get viewportheight() { return this.containerHeight / MappingState.timeHeightFactor * barTimeHeightFactor }
  
  progressTransY = (playtime: number) => `translateY(${- barTimeHeightFactor * playtime}px)`
  barTransY = (viewtime: number) => {
    const height = this.barHeight
    if (height <= this.containerHeight) return ""
    const p = viewtime / MappingState.paddedDuration
    const transx = this.containerHeight * p - height * p
    return `translateY(${-transx}px)`
  }
  viewTransY = (viewtime: number) => {
    let h = this.containerHeight
    if (this.barHeight < this.containerHeight) h = this.barHeight
    const transx = (h * viewtime) / MappingState.paddedDuration
    return `translateY(${-transx}px)`
  }
}

export const state = new State()
