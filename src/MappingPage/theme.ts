import { createMuiTheme } from "@material-ui/core/styles"
import { lightBlue, pink, red } from "@material-ui/core/colors"

export const theme = createMuiTheme({
  palette: {
    primary: { main: lightBlue[500], contrastText: "white" },
    secondary: { main: pink["A200"] },
    error: red,
    type: "dark",
    background: { default: "black", }//paper: "rgba(127,127,127,0.5)" }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "inherit",
        transition: "color 0.2s"
      }
    }
  }
})
