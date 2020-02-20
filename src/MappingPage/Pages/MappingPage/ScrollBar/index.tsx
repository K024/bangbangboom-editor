import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { state } from "./state"
import CanvasBar from "./CanvasBar"
import ViewPort from "./ViewPort"
import { MappingState } from "../sharedState"

const useStyles = makeStyles(theme => ({
  scrollbar: { position: "relative", width: 100 },
}))

const handleScroll = (e: React.WheelEvent) => {
  e.stopPropagation()
  const dt = e.deltaY / 100
  const target = MappingState.getViewposition() - dt
  MappingState.setViewposition(target)
}

export default () => {
  const cn = useStyles()
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const listener = () => container.current && (state.containerHeight = container.current.clientHeight)
    listener()
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [])


  return (
    <div className={cn.scrollbar} ref={container} onWheel={handleScroll}>
      <CanvasBar />
      <ViewPort />
    </div>)
}