import React, { useRef, useEffect } from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core"
import { Music, useMapChange } from "../../states"
import { createAnimLoop } from "../../../Common/hooks"
import { TimeToString, entryList } from "../../../Common/utils"
import { scope } from "../../../MappingScope/scope"
import { startAnimation, stopAnimation } from "../../../Common/animation"

const useStyles = makeStyles(theme => ({
  flex: { display: "flex", alignItems: "center" },
  center: { justifyContent: "center" },
  bar: { flexGrow: 1, height: "100%", position: "relative", },
  time: { margin: theme.spacing(0, 2), width: 80, textAlign: "center" },
  layer: { position: "absolute", width: "100%", height: "100%" },
  midline: { width: "100%", borderBottom: "1px solid white" },
  progress: { position: "absolute", height: "100%", borderLeft: "4px solid red" },
  timepoint: {
    position: "absolute", width: 1, height: "50%",
    backgroundColor: "aquamarine", transition: "left 0.2s"
  }
}))

const TimepointLines = () => {

  const cn = useStyles()

  useMapChange()
  const timepoints = entryList(scope.map.timepoints)

  const duration = Music.duration.useShared()
  const leftStyle = (time: number) => `${(time / duration) * 100}%`

  return <>
    {timepoints.map(([key, tp]) =>
      <div key={key} className={cn.timepoint} style={{ left: leftStyle(tp.time) }} />)}
  </>
}

const ProgressLine = () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)
  const duration = Music.duration.useShared()
  const playing = Music.playing.useShared()
  const playbackrate = Music.playbackrate.useShared()

  useEffect(() => {
    if (div.current) {
      const position = Music.position()
      const current = position / duration
      const remain = (duration - position) / playbackrate
      if (playing) {
        startAnimation(div.current, "left", current * 100, 100, "%", remain)
      } else {
        stopAnimation(div.current, "left", current * 100, "%")
      }
    }
  })

  return <div className={cn.progress} ref={div}></div>
}

const PlayTime = () => {

  const cn = useStyles()
  const div = useRef<HTMLDivElement>(null)

  useEffect(createAnimLoop(() => {
    const time = Music.position()
    if (div.current)
      div.current.innerText = TimeToString(time)
  }), [])

  return <div className={clsx(cn.flex, cn.center, cn.time)} ref={div} />
}

export default () => {

  const cn = useStyles()

  const duration = Music.duration.useShared()

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const x = e.pageX - bar.offsetLeft
    Music.seek(x / bar.clientWidth * duration)
  }

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const x = e.changedTouches[0].pageX - bar.offsetLeft
    Music.seek(x / bar.clientWidth * duration)
  }

  return (
    <div className={clsx(cn.flex, cn.bar)} onWheel={Music.scrollSeek}>
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
        {TimeToString(duration)}
      </div>
    </div>)
}
