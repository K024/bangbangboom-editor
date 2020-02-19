import React from "react"
import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import Fade from "@material-ui/core/Fade"
import { makeStyles, ThemeProvider } from "@material-ui/core/styles"
import BackgroundImage from "./Components/BackgroundImage"
import { theme } from "./theme"
import MainContent from "./Components/MainContent"
import HeaderBar from "./Components/HeaderBar"
import FooterBar from "./Components/FooterBar"
import GlobalSnackbar from "../Common/Components/GlobalSnackbar"

const useStyles = makeStyles(theme => ({
  content: { position: "fixed", display: "flex", flexDirection: "column", top: 0, bottom: 0, left: 0, right: 0 },
  bar: { display: "flex", alignItems: "center", height: 50, width: "100%", backgroundColor: "rgba(128, 128, 128, 0.4)" },
}))

const MappingPage = () => {

  const cn = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Fade in>
        <Box className={cn.content}>
          <BackgroundImage />
          <Box className={cn.bar}>
            <HeaderBar />
          </Box>
          <MainContent />
          <Box className={cn.bar}>
            <FooterBar />
          </Box>
        </Box>
      </Fade>
      <GlobalSnackbar />
    </ThemeProvider>)
}

export default MappingPage