import React, { useRef, useEffect } from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import { Music, useMapChange } from "../../states"
import { createAnimLoop } from "../../../Common/hooks"
import { TimeToString } from "../../../Common/utils"
import { scope } from "../../../MappingScope/scope"
import { startAnimation, stopAnimation } from "../../../Common/animation"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { autorun } from "mobx"

const useStyles = makeStyles(theme => ({
  flex: { display: "flex", alignItems: "center" },
  center: { justifyContent: "center" },
  bar: { flexGrow: 1, height: "100%", position: "relative", },
  time: { margin: theme.spacing(0, 2), width: 80, textAlign: "center" },
  layer: { position: "absolute", width: "100%", height: "100%" },
  midline: { width: "100%", borderBottom: "1px solid white" },
  progress: { position: "absolute", height: "100%", borderLeft: "4px solid red" },
  timepoint: {
    position: "absolute", height: "50%", borderLeft: "1px solid aquamarine", transition: "left 0.2s"
  }
}))

const leftStyle = (time: number) => `${(time / Music.duration) * 100}%`

const TimepointLines = () => {

  const cn = useStyles()

  useMapChange()
  const timepoints = scope.map.timepointlist

  return useObserver(() => <>
    {timepoints.map(tp =>
      <div key={tp.id} className={cn.timepoint} style={{ left: leftStyle(tp.time) }} />)}
  </>)
}

const ProgressLine = () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)
  const s = useLocalStore(() => ({ calibration: 1 }))

  useEffect(() => autorun(() => {
    if (div.current && Music.seekcounter >= 0 && s.calibration) {
      const current = Music.position() / Music.duration
      if (Music.playing) {
        startAnimation(div.current, "left", current * 100, 100, "%", Music.remaintime())
      } else {
        stopAnimation(div.current, "left", current * 100, "%")
      }
    }
  }), [s])

  useEffect(() => {
    const interval = setInterval(() => {
      s.calibration++
    }, 1000)
    return () => clearInterval(interval)
  }, [s])

  return <div className={cn.progress} ref={div}></div>
}

const PlayTime = () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)
  const lasttime = useRef(-1)

  useEffect(() => createAnimLoop(() => {
    const time = Music.position()
    if (div.current && lasttime.current !== time) {
      div.current.innerText = TimeToString(time)
      lasttime.current = time
    }
  }), [])

  return <div className={clsx(cn.flex, cn.center, cn.time)} ref={div} />
}

export default () => {

  const cn = useStyles()

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.buttons & 1)) return // if not left down
    const bar = e.currentTarget
    const x = e.pageX - bar.offsetLeft
    Music.seek(x / bar.clientWidth * Music.duration)
  }

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const x = e.changedTouches[0].pageX - bar.offsetLeft
    Music.seek(x / bar.clientWidth * Music.duration)
  }

  return useObserver(() =>
    <div className={clsx(cn.flex, cn.bar)} style={{ overflow: "hidden" }} onWheel={Music.scrollSeek}>
      <PlayTime />
      <div className={cn.bar}
        onMouseDown={handleMouse} onMouseMove={handleMouse}
        onTouchStart={handleTouch} onTouchMove={handleTouch}>
        <div className={clsx(cn.flex, cn.layer, cn.center)}>
          <div className={cn.midline}></div>
        </div>
        <div className={cn.layer}>
          <TimepointLines />
        </div>
        <div className={cn.layer}>
          <ProgressLine />
        </div>
      </div>
      <div className={clsx(cn.flex, cn.center, cn.time)}>
        {TimeToString(Music.duration)}
      </div>
    </div>)
}
