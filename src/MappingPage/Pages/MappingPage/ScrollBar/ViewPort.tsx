import React, { useRef, useEffect } from "react"
import { autorun } from "mobx"
import { Music } from "../../../states"
import { startAnimation, stopAnimation } from "../../../../Common/animation"
import { state } from "./state"
import { MappingState } from "../sharedState"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  viewport: {
    position: "absolute", width: "100%", backgroundColor: "#fff", opacity: 0.2, transition: "opacity 0.2s",
    bottom: 0, willChange: "opacity, transform", "&:hover": { opacity: 0.4 }
  },
}))

const touchState = {
  identifier: -1,
  /**
   * the offset from touch/mouse point to the bottom of viewport rectangle
   * positive
   */
  offsetY: 0,

  container: null as HTMLElement | null
}

const handelMouseTouchStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  e.stopPropagation()
  const viewport = e.currentTarget
  const bottom = viewport.getBoundingClientRect().bottom
  if ("buttons" in e) {
    if (!(e.buttons & 1)) return // if not left down
    touchState.identifier = 1
    touchState.offsetY = bottom - e.clientY
  } else {
    touchState.identifier = e.changedTouches[0].identifier
    touchState.offsetY = bottom - e.changedTouches[0].clientY
  }
  touchState.container = e.currentTarget.parentElement
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  let clientY: number
  if ("buttons" in e) {
    if (touchState.identifier < 0 || !(e.buttons & 1)) return
    clientY = e.clientY
  } else {
    if (touchState.identifier !== e.changedTouches[0].identifier) return
    clientY = e.changedTouches[0].clientY
  }
  if (!touchState.container) return
  e.stopPropagation()

  const TimeYtoBottom = touchState.container.getBoundingClientRect().bottom - clientY - touchState.offsetY

  let h = state.containerHeight
  if (state.barHeight < state.containerHeight) h = state.barHeight

  let target = TimeYtoBottom / h * MappingState.paddedDuration

  MappingState.setViewposition(target)
}


window.addEventListener("mouseup", () => touchState.identifier = -1)
window.addEventListener("mouseleave", () => touchState.identifier = -1)
window.addEventListener("mousemove", handleMove)
window.addEventListener("touchmove", handleMove)

export default () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    if (div.current) {
      div.current.style.height = state.viewportheight + "px"
      if (Music.playing && MappingState.tracking) {
        startAnimation(div.current, "transform", MappingState.getViewposition(),
          MappingState.viewduration, state.viewTransY, Music.remaintime())
      } else {
        stopAnimation(div.current, "transform", MappingState.getViewposition(), state.viewTransY)
      }
    }
  }), [])

  return <div className={cn.viewport} ref={div}
    onMouseDown={handelMouseTouchStart}
    onTouchStart={handelMouseTouchStart} />
}
