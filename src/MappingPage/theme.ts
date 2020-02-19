import { createMuiTheme } from "@material-ui/core/styles"
import { red, blue } from "@material-ui/core/colors"

export const theme = createMuiTheme({
  palette: {
    primary: { main: blue[500], contrastText: "white" },
    secondary: { main: red["A200"] },
    error: red,
    type: "dark",
    background: { default: "#000", }//paper: "rgba(127,127,127,0.5)" }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "inherit",
        transition: "color 0.2s"
      }
    },
    MuiTab: {
      root: {
        textTransform: "inherit",
        minWidth: "96px !important"
      },
    },
    MuiSnackbarContent: {
      root: { color: "#fff" }
    },
    MuiTableRow: {
      root: {
        "&$selected": {
          background: "rgb(128,216,255,0.16)",
          "&:hover": {
            background: "rgb(128,216,255,0.16)",
          }
        },
      }
    },
    MuiDivider: {
      root: {
        height: 2,
        backgroundColor: "rgba(127, 127, 127, 0.5)"
      }
    }
  }
})
