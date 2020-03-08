import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { GridD1, MappingState, GridD2, GridD3, GridD4 } from "../sharedState"
import { Music } from "../../../states"
import { useObserver } from "mobx-react-lite"
import { range, TimeToString } from "../../../../Common/utils"
import { useStyles as useLayerStyle } from "./styles"
import { scope } from "../../../../MappingScope/scope"

const useStyles = makeStyles(theme => ({
  vertline: { borderLeft: "1.2px solid lightgray", height: "100%", position: "absolute", pointerEvents: "none" },
  beatline1: {
    position: "absolute", textAlign: "right", width: "80%", right: "5%", borderBottom: "1.2px lightgray solid",
  },
  subline: { position: "absolute", width: "70%", left: "15%", },
  beatline2: { borderBottom: "1.2px solid gray" },
  beatline3: { borderBottom: "1.2px solid firebrick" },
  beatline4: { borderBottom: "1.2px solid darkslateblue" },
  time: { position: "absolute", left: 0 },
  bpm: { position: "absolute", right: 0 },
  timepoint: {
    position: "absolute", color: "aquamarine", width: "95%",
    borderBottom: "1.2px aquamarine solid", height: "1.5em"
  },
}))

const bottomstyle = (time: number) => ({ bottom: (MappingState.timeHeightFactor * time) + "px" })

const vertlines = range(15, 90, 10)

const LaneAndTime = () => {
  const cn = useStyles()

  return useObserver(() => <>
    <>
      {vertlines.map(left =>
        <div key={left} className={cn.vertline} style={{ left: left + "%" }} />)}
    </><>
      {range(0, Music.duration, 2).map(time =>
        <div key={time} className={cn.time} style={bottomstyle(time)}>{TimeToString(time)}</div>)}
    </>
  </>)
}

const DivisorLines = () => {

  const cn = useStyles()

  return useObserver(() => <>
    <>
      {GridD1().map(({ time, name }, index) =>
        <div key={index} className={cn.beatline1} style={bottomstyle(time)}>{name}</div>)}
    </><>
      {MappingState.division % 2 === 0 && GridD2().map((time, index) =>
        <div key={index} className={cn.subline + " " + cn.beatline2} style={bottomstyle(time)} />)}
    </><>
      {MappingState.division % 3 === 0 && GridD3().map((time, index) =>
        <div key={index} className={cn.subline + " " + cn.beatline3} style={bottomstyle(time)} />)}
    </><>
      {MappingState.division % 4 === 0 && GridD4().map((time, index) =>
        <div key={index} className={cn.subline + " " + cn.beatline4} style={bottomstyle(time)} />)}
    </>
  </>)
}

const TimepointStart = () => {

  const cn = useStyles()

  return useObserver(() => <>
    {scope.map.timepointlist.map(tp =>
      <div className={cn.timepoint} key={tp.id} style={bottomstyle(tp.time)}>
        <div className={cn.time}>{TimeToString(tp.time)}</div>
        <div className={cn.bpm}>{tp.bpm}</div>
      </div>)}
  </>)
}


const GridLayer = () => {
  const cn = useLayerStyle()
  return (
    <div className={cn.layer}>
      <LaneAndTime />
      <DivisorLines />
      <TimepointStart />
    </div>)
}

export default GridLayer