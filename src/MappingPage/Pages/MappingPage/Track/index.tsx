import React, { useEffect } from "react"
import { autorun, action } from "mobx"
import { startAnimation, stopAnimation } from "../../../../Common/animation"
import { Music } from "../../../states"
import { MappingState } from "../sharedState"
import ActionPreview from "./ActionPreview"
import GridLayer from "./GridLayer"
import NotesLayer from "./NotesLayer"
import ProgressLine from "./ProgressLine"
import { state } from "./state"
import { useStyles } from "./styles"
import InfoWindow from "./InfoWindow"
import { scope } from "../../../../MappingScope/scope"
import BarLayer from "./BarLayer"
import WarningLayer from "./WarningLayer"
import { binarySearch } from "../../../../Common/binarySearch"

const transY = (viewTime: number) => `translateY(${MappingState.timeHeightFactor * viewTime}px)`

const handleScroll = action((e: React.WheelEvent<HTMLDivElement>) => {
  e.stopPropagation()
  const dt = e.deltaY / MappingState.timeHeightFactor
  const target = MappingState.getViewposition() - dt
  MappingState.setViewposition(target)
})

const flushPointerPos = action((e: MouseEvent | TouchEvent) => {
  if ("buttons" in e) {
    state.pointerClientX = e.clientX
    state.pointerClientY = e.clientY
  } else {
    const touches = Array.from(e.changedTouches)
    if (touches.length <= 0) return
    state.pointerClientX = touches.reduce((a, b) => a + b.clientX, 0) / touches.length
    state.pointerClientY = touches.reduce((a, b) => a + b.clientY, 0) / touches.length
  }
})

let selectPointer = -1
const handleDown = action((e: MouseEvent | TouchEvent) => {
  e.stopPropagation()
  e.preventDefault()
  if (document.activeElement && "blur" in document.activeElement) {
    (document.activeElement as HTMLElement).blur()
  }
  if (selectPointer < 0) {
    if ("buttons" in e) {
      if (!(e.buttons & 3)) return
      selectPointer = e.button
    } else {
      selectPointer = e.changedTouches[0].identifier
    }
  }
  flushPointerPos(e)
  state.selectingStartLeft = state.pointerLeftPercent
  state.selectingStartTime = state.pointerTime
  if (!e.ctrlKey) {
    state.selectedNotes.clear()
  }
})
const stopSelect = action(() => {
  if (!state.selecting) return
  selectPointer = -1
  state.selecting = false
  for (const n of state.selectingNotes)
    state.selectedNotes.add(n)
  state.selectingNotes = []
  state.preventClick++
  setTimeout(() => state.preventClick--, 50)
})
window.addEventListener("mouseup", e => {
  if (e.button === selectPointer) stopSelect()
})
window.addEventListener("touchend", e => {
  if (e.changedTouches[0].identifier === selectPointer) stopSelect()
})

const handleMove = action((e: MouseEvent | TouchEvent) => {
  flushPointerPos(e)
  if (!("buttons" in e) || e.buttons & 3) {
    if (state.draggingNote < 0 && !state.selecting)
      if (Math.abs(state.pointerTime - state.selectingStartTime) > 50 / MappingState.timeHeightFactor
        || Math.abs(state.pointerLeftPercent - state.selectingStartLeft) > 10) {
        state.selecting = true
        state.slideNote1Beat = undefined
      }
  } else {
    if (state.selecting) stopSelect()
  }
  if (state.selecting) {
    const list = MappingState.noteListOrdered
    const start = binarySearch(i => list[i].realtimecache, list.length, state.pointerTime)[0]
    const end = binarySearch(i => list[i].realtimecache, list.length, state.selectingStartTime)[0]
    state.selectingNotes = (list.slice(Math.min(start, end), Math.max(start, end)))
      .filter(x => {
        const left = x.lane * 10 + 20
        const min = Math.min(state.pointerLeftPercent, state.selectingStartLeft)
        const max = Math.max(state.pointerLeftPercent, state.selectingStartLeft)
        if (left >= min && left <= max) return true
        return false
      }).map(x => x.id)
  }
})

const handleClick = action((e: React.MouseEvent<HTMLDivElement>) => {
  flushPointerPos(e.nativeEvent)
  e.stopPropagation()
  e.preventDefault()
  if (state.preventClick) return
  const beat = state.pointerBeat
  const lane = state.pointerLane
  if (!beat || lane < 0) return
  switch (MappingState.tool) {
    case "single":
      scope.map.addSingle(beat.timepoint.id, beat.offset, lane)
      break
    case "slide":
      if (state.slideNote1Beat) {
        scope.map.addSlide(state.slideNote1Beat.timepoint.id, state.slideNote1Beat.offset, state.slideNote1Lane,
          beat.timepoint.id, beat.offset, lane)
        state.slideNote1Beat = undefined
      } else {
        state.slideNote1Beat = beat
        state.slideNote1Lane = lane
      }
      break
    default:
      return
  }
})

const Track = () => {
  const cn = useStyles()

  useEffect(() => autorun(() => {
    if (state.panelRef.current) {
      state.panelRef.current.style.height = (MappingState.paddedDuration * MappingState.timeHeightFactor) + "px"
      if (Music.playing && MappingState.tracking) {
        startAnimation(state.panelRef.current, "transform", MappingState.getViewposition(),
          MappingState.viewduration, transY, Music.remaintime())
      } else {
        stopAnimation(state.panelRef.current, "transform", MappingState.getViewposition(), transY)
      }
    }
  }), [])

  useEffect(() => {
    window.addEventListener("mousedown", handleDown)
    window.addEventListener("mousemove", handleMove)
    return () => {
      window.removeEventListener("mousedown", handleDown)
      window.removeEventListener("mousemove", handleMove)
    }
  }, [])

  return (
    <div className={cn.track}>
      <div className={cn.panel} ref={state.panelRef} onWheel={handleScroll} onClick={handleClick}>
        <GridLayer />
        <BarLayer />
        <NotesLayer />
        {scope.settings.editor.warn_for_same_pos_notes && <WarningLayer />}
        <ActionPreview />
      </div>
      {scope.settings.editor.show_info_window && <InfoWindow />}
      <ProgressLine />
    </div>)
}

export default Track