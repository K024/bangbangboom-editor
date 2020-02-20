import { makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles(theme => ({
  track: { position: "relative", flexGrow: 1, maxWidth: 600, },
  panel: { width: "100%", position: "absolute", bottom: 0, willChange: "transform" },
  layer: { width: "100%", height: "100%", position: "absolute", pointerEvents: "none", },
  line: { borderLeft: "1px solid lightgray", height: "100%", position: "absolute", pointerEvents: "none" },
  time: { position: "absolute" },
  timepoint: {
    position: "absolute", color: "aquamarine", width: "95%",
    borderBottom: "1px aquamarine solid", height: "1.5em"
  },
}))

export const useNoteStyles = makeStyles(theme => ({
  note: {
    transform: "translateY(50%) scale(1.2)", width: "10%", position: "absolute",
    pointerEvents: "auto", zIndex: 1, minHeight: "10px",
  },
  slideamong: {
    background: "greenyellow", opacity: 0.2, width: "10%", position: "absolute", pointerEvents: "auto",
  },
  preview: { opacity: 0.5, zIndex: 0, }
}))