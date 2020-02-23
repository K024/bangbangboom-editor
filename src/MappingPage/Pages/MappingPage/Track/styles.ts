import { makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles(theme => ({
  track: { position: "relative", flexGrow: 1, maxWidth: 600, },
  panel: { width: "100%", position: "absolute", bottom: 0, willChange: "transform" },
  layer: { width: "100%", height: "100%", position: "absolute", pointerEvents: "none", },
}))

export const useNoteStyles = makeStyles(theme => ({
  note: {
    transform: "translateY(50%) scale(1.2)", width: "10%", position: "absolute",
    pointerEvents: "auto", minHeight: "10px",
  },
  noevent: { pointerEvents: "none" },
  slidebar: {
    background: "greenyellow", opacity: 0.2, width: "10%", position: "absolute", pointerEvents: "auto",
  },
  selection: {
    position: "absolute", pointerEvents: "none", background: "gray",
    opacity: 0.3, border: "2px solid rgba(80, 182, 255, 0.8)"
  }
}))