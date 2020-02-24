import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { autorun } from "mobx"
import { Music, useMapChange } from "../../../states"
import { startAnimation, stopAnimation } from "../../../../Common/animation"
import { state } from "./state"
import { MappingState } from "../sharedState"
import { drawScrollBar, drawWarning } from "./drawCanvas"
import ProgressLine from "./ProgressLine"
import { scope } from "../../../../MappingScope/scope"


const useStyles = makeStyles(theme => ({
  bar: { position: "absolute", width: "100%", bottom: 0, willChange: "transform" },
  canvas: { width: "100%", height: "100%" },
}))

const Canvas = () => {
  const cn = useStyles()
  const canvas = useRef<HTMLCanvasElement>(null)

  const change = useMapChange()

  useEffect(() => autorun(() => {
    if (canvas.current && change) {
      canvas.current.height = state.barHeight
      drawScrollBar(canvas.current)
      if (scope.settings.editor.warn_for_same_pos_notes)
        drawWarning(canvas.current)
    }
  }), [change])

  return <canvas ref={canvas} className={cn.canvas} width={100}></canvas>
}

const handelMouseTouch = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  let clientY: number
  if ("buttons" in e) {
    if (!(e.buttons & 3)) return
    clientY = e.clientY
  } else {
    clientY = e.changedTouches[0].clientY
  }
  e.stopPropagation()

  const target = (e.currentTarget.getBoundingClientRect().bottom - clientY - state.viewportheight / 2)
    / state.barHeight * MappingState.paddedDuration

  MappingState.setViewposition(target)
}

const CanvasBar = () => {

  const cn = useStyles()
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    if (bar.current) {
      bar.current.style.height = state.barHeight + "px"
      if (Music.playing && MappingState.tracking) {
        startAnimation(bar.current, "transform", MappingState.getViewposition(),
          MappingState.viewduration, state.barTransY, Music.remaintime())
      } else {
        stopAnimation(bar.current, "transform", MappingState.getViewposition(), state.barTransY)
      }
    }
  }), [])

  return (
    <div className={cn.bar} ref={bar} onTouchStart={handelMouseTouch}
      onMouseDown={handelMouseTouch}>
      <Canvas />
      <ProgressLine />
    </div>)
}

export default CanvasBar