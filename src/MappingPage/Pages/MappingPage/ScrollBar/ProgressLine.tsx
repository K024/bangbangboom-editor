import React, { useRef, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { autorun } from "mobx"
import { Music } from "../../../states"
import { startAnimation, stopAnimation } from "../../../../Common/animation"
import { state } from "./state"

const useStyles = makeStyles(theme => ({
  progress: {
    position: "absolute", width: "100%", borderBottom: "2px solid red",
    bottom: 0, willChange: "transform", opacity: 0.7
  },
}))

export default () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => autorun(() => {
    if (div.current) {
      const current = Music.position()
      if (Music.playing) {
        startAnimation(div.current, "transform", current, Music.duration, state.progressTransY, Music.remaintime())
      } else {
        stopAnimation(div.current, "transform", current, state.progressTransY)
      }
    }
  }), [])

  return <div className={cn.progress} ref={div}></div>
}
