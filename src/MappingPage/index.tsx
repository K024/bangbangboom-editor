import React from "react"
import { ThemeProvider, makeStyles } from "@material-ui/core/styles"
import { theme } from "./theme"
import BackgroundImage from "./Components/BackgroundImage"
import CssBaseline from "@material-ui/core/CssBaseline"
import Fade from "@material-ui/core/Fade"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
  mainContent: { position: "fixed", display: "flex", flexDirection: "column", top: 0, bottom: 0, left: 0, right: 0 }
}))

const MappingPage = () => {

  const cn = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Fade in>
        <Box className={cn.mainContent}>
          <BackgroundImage />
        </Box>
      </Fade>
    </ThemeProvider>)
}

export default MappingPage