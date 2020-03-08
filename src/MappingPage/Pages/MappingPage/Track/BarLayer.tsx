import React, { useEffect, useMemo, useState } from "react"
import { NoteType, SlideNote } from "../../../../MappingScope/EditMap"
import { MappingState } from "../sharedState"
import { useStyles, useNoteStyles } from "./styles"
import { autorun } from "mobx"
import { scope } from "../../../../MappingScope/scope"
import { assert } from "../../../../Common/utils"
import { state, useMirror } from "./state"
import { useObserver } from "mobx-react-lite"

const clickHandler = (slide: number) => {
  return (e: React.MouseEvent<HTMLDivElement>) => {
    const beat = state.pointerBeat
    const lane = state.pointerLane
    if (!beat || lane < 0) return
    e.stopPropagation()

    scope.map.addSlideMid(slide, beat.timepoint.id, beat.offset, lane)
  }
}

const Bar = ({ from, to, layerWidth }: { from: NoteType, to: NoteType, layerWidth: number }) => {

  const cn = useNoteStyles()

  const style = useObserver(() => {
    const bottom = from.realtimecache * MappingState.timeHeightFactor
    const top = to.realtimecache * MappingState.timeHeightFactor
    const dh = top - bottom
    const dw = layerWidth * (from.lane - to.lane) * 0.1
    return {
      bottom: bottom + "px",
      height: dh + "px",
      transform: `skew(${Math.atan2(dw, dh)}rad)`,
      left: (from.lane + to.lane) * 5 + 15 + "%",
    }
  })

  const slide = (from as SlideNote).slide

  const handler = useMemo(() => clickHandler(slide), [slide])

  return <div className={cn.slidebar} onClick={handler} style={style}></div>
}

const forEachBar = (cb: (from: SlideNote, to: SlideNote) => any) => {
  for (const slide of scope.map.slidelist) {
    let from = assert(scope.map.notes.get(slide.notes[0]))
    for (let i = 1; i < slide.notes.length; i++) {
      const to = assert(scope.map.notes.get(slide.notes[i]))
      cb(from as SlideNote, to as SlideNote)
      from = to
    }
  }
}

const BarLayer = () => {

  const cn = useStyles()
  const layer = useMirror()
  const [layerWidth, setLayerWidth] = useState(100)

  useEffect(() => {
    const listener = () => state.panelRef.current && setLayerWidth(state.panelRef.current.clientWidth)
    const dispose = autorun(listener)
    window.addEventListener("resize", listener)
    return () => { window.removeEventListener("resize", listener); dispose() }
  }, [])

  const list = useObserver(() => {
    const list: React.ReactNode[] = []
    forEachBar((from, to) =>
      list.push(<Bar key={from.id + ":" + to.id} from={from} to={to} layerWidth={layerWidth} />))
    return list
  })

  return (
    <div className={cn.layer} ref={layer}>
      {list}
    </div>)
}

export default BarLayer