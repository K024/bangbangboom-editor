import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Tools from "./Tools"
import Track from "./Track"
import ScrollBar from "./ScrollBar"
import { useSoundEffect } from "./soundEffect"

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute", width: "100%", height: "100%", display: "flex",
    justifyContent: "space-between", alignItems: "stretch", overflow: "hidden"
  },
}))


export default () => {

  const cn = useStyles()

  useSoundEffect()

  return (
    <Box className={cn.root} onContextMenu={e => { e.stopPropagation(); e.preventDefault() }}>
      <Tools />
      <Track />
      <ScrollBar />
    </Box>)
}