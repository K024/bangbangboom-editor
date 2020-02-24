import { observable, computed, autorun, reaction } from "mobx"
import { MappingState } from "../sharedState"
import { scope } from "../../../../MappingScope/scope"
import { useRef, useEffect } from "react"
import { Music } from "../../../states"
import { itemList } from "../../../../Common/utils"
import { NoteType } from "../../../../MappingScope/EditMap"

class State {

  @observable pointerClientX = 0
  @observable pointerClientY = 0

  @observable panelRef: React.MutableRefObject<HTMLDivElement | null> = {
    current: null
  }

  @computed get pointerTime() {
    const panel = this.panelRef.current
    if (!panel) return 0
    const rect = panel.getBoundingClientRect()
    let res = (rect.bottom - this.pointerClientY) / MappingState.timeHeightFactor
    if (res < 0) res = 0
    else if (res >= Music.duration) res = Music.duration - 0.05
    return res
  }

  @computed get pointerLeftPercent() {
    const panel = this.panelRef.current
    if (!panel) return -1
    const rect = panel.getBoundingClientRect()
    if (MappingState.mirror)
      return (rect.right - this.pointerClientX) / rect.width * 100
    else
      return (this.pointerClientX - rect.left) / rect.width * 100
  }

  laneFromLeftPercent = (percent: number) => {
    const left = percent - 15
    if (left < 0) return -1
    if (left >= 70) return -1
    return (left / 10) | 0
  }

  @computed get pointerLane() {
    return this.laneFromLeftPercent(this.pointerLeftPercent)
  }

  @computed get pointerBeat() {
    return scope.map.calcNearestPosition(this.pointerTime, MappingState.division)
  }

  @observable slideNote1Beat: State["pointerBeat"]
  @observable slideNote1Lane = -1

  @observable preventClick = 0

  @observable draggingNote = -1

  @observable selecting = false
  @observable selectingStartTime = 0
  @observable selectingStartLeft = 0
  @observable selectingNotes: number[] = []

  @observable selectedNotes = new Set<number>()

  getSelectedNotes = () => {
    const selected = new Set<NoteType>()
    for (const nid of this.selectedNotes) {
      const n = scope.map.notes.get(nid)
      if (n) selected.add(n)
    }
    for (const nid of this.selectingNotes) {
      const n = scope.map.notes.get(nid)
      if (n) selected.add(n)
    }
    return itemList(selected)
  }

  @computed get draggingSelected() {
    const n = scope.map.notes.get(this.draggingNote)
    if (!n) return false
    return this.selectedNotes.has(n.id)
  }

  constructor() {
    reaction(() => MappingState.tool, tool => {
      this.slideNote1Beat = undefined
    })
  }
}

export const state = new State()

export function useMirror() {

  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    if (layer.current) {
      if (MappingState.mirror)
        layer.current.style.transform = `scaleX(-1)`
      else
        layer.current.style.transform = `none`
    }
  }), [])

  return layer
}
