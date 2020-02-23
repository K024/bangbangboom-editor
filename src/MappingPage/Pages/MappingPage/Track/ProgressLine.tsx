import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { autorun } from "mobx"
import { Music } from "../../../states"
import { startAnimation, stopAnimation } from "../../../../Common/animation"
import { MappingState } from "../sharedState"

const useStyles = makeStyles(theme => ({
  progress: {
    position: "absolute", width: "80%", left: "10%", borderBottom: "2px solid red",
    bottom: 0, willChange: "transform", opacity: 0.7,
  }
}))

const transY = (time: number, viewTime: number) => MappingState.timeHeightFactor * (viewTime - time)

const transpx = (t: number) => `translateY(${t}px)`

export default () => {
  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    if (div.current) {
      const time = Music.position()
      const viewTime = MappingState.getViewposition()
      const current = transY(time, viewTime)
      const target = transY(Music.duration, viewTime)
      if (Music.playing && !MappingState.tracking) {
        startAnimation(div.current, "transform", current, target, transpx, Music.remaintime())
      } else {
        stopAnimation(div.current, "transform", current, transpx)
      }
    }
  }), [])

  return <div className={cn.progress} ref={div} />
}