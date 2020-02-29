import React from "react"
import { useStyles, useNoteStyles } from "./styles"
import { useObserver } from "mobx-react-lite"
import { state, useMirror } from "./state"
import { MappingState } from "../sharedState"
import { Cross, Rect } from "./SVGs"
import { entryList } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"
import { useMapChange } from "../../../states"

const createStyle = (time: number, lane: number) => {
  return {
    bottom: time * MappingState.timeHeightFactor + "px",
    left: lane * 10 + 15 + "%"
  }
}

const PointerPos = () => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    if (state.selecting) return
    if (state.pointerLane < 0) return
    const beat = state.pointerBeat
    if (!beat) return
    let color = "#afafaf"
    switch (MappingState.tool) {
      case "single": color = "#0088ff"; break
      case "slide": color = "#00ff88"; break
      case "delete": color = "#ff4444"; break
    }
    return {
      ...createStyle(beat.realtime, state.pointerLane), color
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
      ...createStyle(time, state.slideNote1Lane), color: "#00ff88"
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
    const n = scope.map.notes.get(state.draggingNote)
    if (!n) return
    const beat = state.pointerBeat
    if (!beat) return
    const time = beat.realtime
    if (time === n.realtimecache && state.pointerLane === n.lane) return
    return {
      from: { ...createStyle(n.realtimecache, n.lane), color: "#a0a0a0" },
      to: { ...createStyle(time, state.pointerLane), color: "#e0e0e0" }
    }
  })
  if (!style) return null
  return <>
    <Rect className={cn.note + " " + cn.noevent} style={style.from} />
    <Rect className={cn.note + " " + cn.noevent} style={style.to} />
  </>
}

const SelectedNotes = () => {
  const cn = useNoteStyles()
  useMapChange()
  const props = useObserver(() => {
    const className = cn.note + " " + cn.noevent
    const map = new Map<number, React.SVGProps<SVGSVGElement>>()
    for (const n of state.getSelectedNotes()) {
      map.set(n.id, {
        key: n.id, style: { ...createStyle(n.realtimecache, n.lane), color: "rgba(102, 183, 255, 0.8)" }, className
      })
    }
    return entryList(map).map(x => x[1])
  })
  if (props.length <= 0) return null
  return <>
    {props.map(p => <Rect {...p} />)}
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

const ActionPreview = () => {

  const cn = useStyles()
  const layer = useMirror()

  return (
    <div className={cn.layer} ref={layer}>
      <SlideNote1 />
      <SelectedNotes />
      <DragOneNote />
      <Selection />
      <PointerPos />
    </div>)
}

export default ActionPreview