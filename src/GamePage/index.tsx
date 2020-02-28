import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Game } from "bangbangboom-game"
import { Music, Background } from "../MappingPage/states"
import { userMessage } from "../Common/Components/GlobalSnackbar"
import i18n from "../i18n"
import { scope } from "../MappingScope/scope"
import { toGameContent } from "../MapFormats/bbbgame"

const useStyles = makeStyles(theme => ({
  root: { position: "fixed", left: 0, right: 0, top: 0, bottom: 0 },
  canvas: { width: "100%", height: "100%" }
}))

const GamePage = () => {

  const cn = useStyles()
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current) return
    if (!Music.musicfile) {
      window.history.back()
      setTimeout(() => {
        userMessage(i18n.t("No music selected"))
      }, 100)
      return
    }
    const musicSrc = URL.createObjectURL(Music.musicfile)
    const game = new Game(canvas.current, {
      judgeOffset: scope.settings.game.judge_offset,
      visualOffset: scope.settings.game.visual_offset,
      speed: scope.settings.game.speed,
      resolution: scope.settings.game.resolution,
      noteScale: scope.settings.game.note_scale,
      barOpacity: scope.settings.game.bar_opaciry,
      backgroundDim: scope.settings.general.background_dim,
      effectVolume: scope.settings.general.effect_volume,
      showSimLine: scope.settings.game.show_sim_line,
      laneEffect: scope.settings.game.lane_effect,
      mirror: scope.settings.game.mirror,
      beatNote: scope.settings.game.beat_note
    }, {
      musicSrc, backgroundSrc: Background.src, songName: scope.meta.name, skin: "/assets/skins/default",
      mapContent: () => toGameContent(scope.map as any)
    })
    game.ondestroyed = () => {
      window.history.back()
    }
    game.start()
    return () => {
      URL.revokeObjectURL(musicSrc)
    }
  }, [])

  return <div ref={container} className={cn.root}>
    <canvas ref={canvas} className={cn.canvas} /></div>
}

export default GamePage
