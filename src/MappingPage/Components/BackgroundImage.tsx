import React from "react"
import Box from "@material-ui/core/Box"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useBackgroundStyle } from "../states"

const useStyles = makeStyles(theme => ({
  background: {
    position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0,
    backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "opacity 0.3s"
  }
}))

export default () => {

  const cn = useStyles()
  const [bgStyle] = useBackgroundStyle()

  return (
    <Box className={cn.background}
      style={{
        backgroundImage: bgStyle.imageSrc ? `url(${bgStyle.imageSrc})` : "",
        opacity: 1 - bgStyle.dim,
        backgroundSize: bgStyle.cover ? "cover" : "contain"
      }}
    />
  )
}

