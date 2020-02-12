import React from "react"
import { useHashRoutes } from "./routes"
import { ThemeProvider } from "@material-ui/core/styles"
import { theme } from "./style"
import { CssBaseline } from "@material-ui/core"


const MappingPage = () => {

  const [path, ContentComponent, navigateTo] = useHashRoutes()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    </ThemeProvider>)
}

export default MappingPage