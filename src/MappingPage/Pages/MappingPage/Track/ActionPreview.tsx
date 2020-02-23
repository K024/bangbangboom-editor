import React from "react"
import { useStyles, useNoteStyles } from "./styles"
import { useObserver } from "mobx-react-lite"
import { state, useMirror } from "./state"
import { MappingState } from "../sharedState"
import { Cross, Rect } from "./SVGs"
import { assert } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"

const PointerPos = () => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    if (state.selecting) return
    const beat = state.pointerBeat
    if (!beat) return
    if (state.pointerLane < 0) return
    let color = "#afafaf"
    switch (MappingState.tool) {
      case "single": color = "#0088ff"; break
      case "slide": color = "#00ff88"; break
      case "delete": color = "#ff4444"; break
    }
    const time = beat.timepoint.time + beat.timepoint.ticktimecache * beat.offset
    return {
      bottom: time * MappingState.timeHeightFactor + "px",
      left: state.pointerLane * 10 + 15 + "%", color
    }
  })
  if (!style) return null
  return <Cross className={cn.note + " " + cn.noevent} style={style} />
}

const SlideNote1 = () => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    if (!state.slideNote1Beat) return
    const time = state.slideNote1Beat.timepoint.time + state.slideNote1Beat.timepoint.ticktimecache * state.slideNote1Beat.offset
    return {
      bottom: time * MappingState.timeHeightFactor + "px",
      left: state.slideNote1Lane * 10 + 15 + "%", color: "#00ff88"
    }
  })
  if (!style) return null
  return <Rect className={cn.note + " " + cn.noevent} style={style} />
}

const DragOneNote = () => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    if (state.draggingNote < 0) return
    if (state.pointerLane < 0) return
    const n = assert(scope.map.notes.get(state.draggingNote))
    const beat = state.pointerBeat
    if (!beat) return
    const time = beat.realtime
    if (time === n.realtimecache && state.pointerLane === n.lane) return
    return {
      from: {
        bottom: n.realtimecache * MappingState.timeHeightFactor + "px",
        left: n.lane * 10 + 15 + "%", color: "#a0a0a0"
      },
      to: {
        bottom: time * MappingState.timeHeightFactor + "px",
        left: state.pointerLane * 10 + 15 + "%", color: "#e0e0e0"
      }
    }
  })
  if (!style) return null
  return <>
    <Rect className={cn.note + " " + cn.noevent} style={style.from} />
    <Rect className={cn.note + " " + cn.noevent} style={style.to} />
  </>
}

const Selection = () => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    if (!state.selecting) return
    const l1 = state.selectingStartLeft
    const l2 = state.pointerLeftPercent
    const t1 = state.selectingStartTime
    const t2 = state.pointerTime
    return {
      left: Math.min(l1, l2) + "%",
      width: Math.abs(l1 - l2) + "%",
      bottom: Math.min(t1, t2) * MappingState.timeHeightFactor + "px",
      height: Math.abs(t1 - t2) * MappingState.timeHeightFactor + "px",
    }
  })
  if (!style) return null
  return <div className={cn.selection} style={style}></div>
}

export default () => {

  const cn = useStyles()
  const layer = useMirror()

  return (
    <div className={cn.layer} ref={layer}>
      <SlideNote1 />
      <DragOneNote />
      <Selection />
      <PointerPos />
    </div>)
}