import React from "react"
import Fade from "@material-ui/core/Fade"
import Box from "@material-ui/core/Box"
import { useHashRoutes } from "../routes"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  content: { flexGrow: 1, position: "relative", overflow: "hidden", },
  wrapping: {
    width: "100%", height: "100%", overflowX: "hidden", overflowY: "auto",
    "-webkit-overflow-scrolling": "touch", position: "absolute"
  }
}))

export default () => {

  const cn = useStyles()
  const [path, Component] = useHashRoutes()

  return (
    <Fade in key={path}>
      <Box className={cn.content}>
        <Box className={cn.wrapping}>
          <Component />
        </Box>
      </Box>
    </Fade>)
}


