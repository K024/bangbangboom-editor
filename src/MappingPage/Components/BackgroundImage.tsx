import React from "react"
import Box from "@material-ui/core/Box"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { Background } from "../states"

const useStyles = makeStyles(theme => ({
  background: {
    position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0,
    backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "opacity 0.3s"
  }
}))

export default () => {

  const cn = useStyles()
  const src = Background.src.useShared()
  const dim = Background.dim.useShared()
  const cover = Background.cover.useShared()

  return (
    <Box className={cn.background}
      style={{
        backgroundImage: src ? `url(${src})` : "",
        opacity: 1 - dim,
        backgroundSize: cover ? "cover" : "contain"
      }}
    />
  )
}

