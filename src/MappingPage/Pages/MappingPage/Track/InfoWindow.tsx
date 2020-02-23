import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useObserver } from "mobx-react-lite"
import { state } from "./state"
import { TimeToString } from "../../../../Common/utils"

const useStyles = makeStyles(theme => ({
  root: { position: "absolute", width: 0, left: 0, height: 0, bottom: 0, color: "lightgray", userSelect: "text" },
  window: {
    position: "absolute", width: 100, height: 84, right: "calc(12px + 3vw)", bottom: 48, padding: 12,
    background: "rgba(127, 127, 127, 0.15)", borderRadius: 4, textAlign: "right"
  }
}))

function calcGCD(a: number, b: number) {
  a = a | 0
  b = b | 0
  if (a < 0 || b <= 0) throw new Error("Can not get gcd")
  while (true) {
    const c = (a % b) | 0
    if (c === 0) return b
    a = b
    b = c
  }
}

export default () => {

  const cn = useStyles()

  const info = useObserver(() => {
    const beat = state.pointerBeat
    if (!beat || beat.offset < 0) return
    const bpb = beat.timepoint.bpb
    const beatcount = (beat.offset / 48) | 0
    let offset = beat.offset % 48
    while (offset < 0) offset += 48
    const gcd = calcGCD(offset, 48)
    return {
      time: beat.realtime,
      name: `${beat.timepointIndex + 1} : ${((beatcount / bpb) | 0) + 1} : ${(beatcount % bpb) + 1}`,
      divide: `${offset / gcd} / ${48 / gcd}`
    }
  })

  return (
    <div className={cn.root}>
      <div className={cn.window}>
        {info && <>
          <div>{TimeToString(info.time)}</div>
          <div>{info.name}</div>
          <div>{info.divide}</div>
        </>}
      </div>
    </div>)
}