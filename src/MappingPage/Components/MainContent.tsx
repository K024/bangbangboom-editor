import React from "react"
import Fade from "@material-ui/core/Fade"
import Box from "@material-ui/core/Box"
import { useHashRoutes } from "../routes"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  content: { flexGrow: 1, position: "relative", overflow: "hidden auto", }
}))

export default () => {

  const cn = useStyles()
  const [path, Component] = useHashRoutes()

  return (
    <Fade in key={path}>
      <Box className={cn.content}>
        <Component />
      </Box>
    </Fade>)
}


