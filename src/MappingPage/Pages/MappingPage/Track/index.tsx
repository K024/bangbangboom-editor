import React, { useEffect } from "react"
import { autorun } from "mobx"
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
import { assert } from "../../../../Common/utils"

const transY = (viewTime: number) => `translateY(${MappingState.timeHeightFactor * viewTime}px)`

const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
  e.stopPropagation()
  const dt = e.deltaY / MappingState.timeHeightFactor
  const target = MappingState.getViewposition() - dt
  MappingState.setViewposition(target)
}

const flushPointerPos = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  if ("buttons" in e) {
    state.pointerClientX = e.clientX
    state.pointerClientY = e.clientY
  } else {
    const touches = Array.from(e.changedTouches)
    if (touches.length <= 0) return
    state.pointerClientX = touches.reduce((a, b) => a + b.clientX, 0) / touches.length
    state.pointerClientY = touches.reduce((a, b) => a + b.clientY, 0) / touches.length
  }
}

let selectPointer = -1
const handleDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  if ("buttons" in e) {
    selectPointer = 1
  } else {
    selectPointer = e.changedTouches[0].identifier
  }
  flushPointerPos(e)
  state.preventPanelClick = false
  state.selectingStartLeft = state.pointerLeftPercent
  state.selectingStartTime = state.pointerTime
  setTimeout(() => {
    if (selectPointer < 0) return
    state.preventPanelClick = true
    state.selecting = true
  }, 300)
}
window.addEventListener("mouseup", () => { selectPointer = -1; state.selecting = false })
window.addEventListener("touchend", e => {
  if (e.changedTouches[0].identifier === selectPointer) { selectPointer = -1; state.selecting = false }
})

const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  flushPointerPos(e)
  if (state.draggingNote < 0)
    if (!("buttons" in e) || e.buttons & 1)
      if (Math.abs(state.pointerTime - state.selectingStartTime) > 0.1
        || Math.abs(state.pointerLeftPercent - state.selectingStartLeft) > 5) {
        state.preventPanelClick = true
        state.selecting = true
      }
}

const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const beat = state.pointerBeat
  const lane = state.pointerLane
  if (!beat || lane < 0) return
  if (state.preventPanelClick) return
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
    default: return
  }
  e.stopPropagation()
}

const handleUp = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
  if (state.draggingNote >= 0) {
    e.stopPropagation()
    e.preventDefault()
    const note = assert(scope.map.notes.get(state.draggingNote))
    state.draggingNote = -1
    if (!state.pointerBeat) return
    const dt = state.pointerBeat.realtime - note.realtimecache
    const dl = state.pointerLane - note.lane
    if (!dt && !dl) return
    scope.map.moveMany([note], dt, 0, Music.duration, dl)
  }
}

export default () => {
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

  return (
    <div className={cn.track}>
      <div className={cn.panel} ref={state.panelRef} onWheel={handleScroll} onClick={handleClick}
        onMouseMove={handleMove} onTouchMove={handleMove} onMouseDown={handleDown} onTouchStart={handleDown}
        onMouseUp={handleUp} onTouchEnd={handleUp}>
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