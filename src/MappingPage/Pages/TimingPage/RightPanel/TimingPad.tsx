import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import assets from "../../../assets"
import { once, range } from "../../../../Common/utils"
import { createAnimLoop } from "../../../../Common/hooks"
import { useObserver } from "mobx-react-lite"
import { TimingState } from "../sharedState"
import { Music } from "../../../states"
import { stopAnimation, startAnimation } from "../../../../Common/animation"
import { AudioSource, loadFromUrl, AudioInstance } from "../../../../Common/AudioCtx"
import { autorun } from "mobx"
import { scope } from "../../../../MappingScope/scope"
import { changed } from "./ActionPart"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex", alignItems: "center", height: 80, padding: 10, transform: "translate(0, 0)",
    "&>*": {
      flexGrow: 1, height: "100%", margin: 10, border: "solid 3px cornflowerblue", borderRadius: 6, overflow: "hidden",
    },
    "& :first-child": { borderColor: "darkorange", },
    "&>*>*": {
      width: "100%", height: "100%", backgroundColor: "cornflowerblue", willChange: "opacity", opacity: 0,
    },
    "& :first-child>*": { backgroundColor: "darkorange", },
  }
}))

const sounds = once(() => ({
  tick: AudioSource.from(loadFromUrl(assets.timing_tick)).load(),
  tack: AudioSource.from(loadFromUrl(assets.timing_tack)).load(),
}))

let nosounduntil = 0
function setsound(tick: boolean, timeoutms: number) {
  if (TimingState.measuring || TimingState.muteticker) return
  const soundtime = performance.now() + timeoutms
  if (soundtime <= nosounduntil) return
  const s = sounds()
  nosounduntil = soundtime + 100 // no sound until 100 ms after sound played

  new AudioInstance(tick ? s.tick : s.tack).play(timeoutms / 1000)
}

let lastbeat = -1
function animloop(pads: HTMLDivElement[]) {

  const pos = Music.position()
  /**
   * only if not measuring and selected a timepoint and playing and no changes on editor
   */
  if (!TimingState.measuring && TimingState.autoswitchtp && TimingState.selected !== null && Music.playing) {
    if (!changed()) {
      const [tp] = scope.map.findTimepoint(pos)
      if (!tp) return
      if (tp.id !== TimingState.selected) {
        TimingState.selected = tp.id
      }
    }
  }

  const { time, bpm, bpb } = TimingState
  const beattime = 60 / bpm
  const currentBeat = (pos - time) / beattime
  const beatcount = Math.floor(currentBeat)
  const beatoff = currentBeat - beatcount
  const beatnum = beatcount % bpb

  const realbeattime = beattime / Music.playbackrate

  if (Music.playing) {

    let deltabeat = currentBeat - lastbeat
    if (deltabeat > 0.3) {
      // clearsound()
      deltabeat = 0
    }

    if (beatoff - deltabeat < 0) { // play animation
      for (let i = 0; i < pads.length; i++) {
        if (i === beatnum) {
          startAnimation(pads[i], "opacity", 1, 0, "", realbeattime / 2)
        } else {
          stopAnimation(pads[i], "opacity", 0, "")
        }
      }
    }

    const nexttimems = (1 - beatoff) * realbeattime * 1000
    if (nexttimems < 50)
      setsound(beatnum === bpb - 1, nexttimems)


  } else {
    // clearsound()

    for (let i = 0; i < pads.length; i++) {
      if (i === beatnum) {
        stopAnimation(pads[i], "opacity", Math.max(0, (0.5 - beatoff) * 2), "")
      } else {
        stopAnimation(pads[i], "opacity", 0, "")
      }
    }
  }

  lastbeat = currentBeat
}

const TimingPad = () => {

  const cn = useStyles()

  const ref = useRef<HTMLDivElement>(null)
  const padcount = useObserver(() => TimingState.bpb)

  useEffect(() => createAnimLoop(() => {
    if (ref.current) {
      const pads = Array.from(ref.current.children).map(x => x.firstChild as HTMLDivElement)
      animloop(pads)
    }
  }), [])

  useEffect(() => autorun(() => {
    const s = sounds()
    s.tick.volume = scope.settings.general.effect_volume
    s.tack.volume = scope.settings.general.effect_volume
  }), [])

  return (
    <div className={cn.root} ref={ref}>
      {range(padcount).map(v =>
        <div key={v}>
          <div></div>
        </div>)}
    </div>)
}

export default TimingPad