import React, { useEffect } from "react"
import { useObserver } from "mobx-react-lite"
import { MappingState, ToolTypes } from "./sharedState"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { useTranslation } from "react-i18next"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import assets from "../../assets"
import HelpIcon from '@material-ui/icons/Help'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import FormLabel from "@material-ui/core/FormLabel"
import Tooltip from "@material-ui/core/Tooltip"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import Switch from "@material-ui/core/Switch"
import Typography from "@material-ui/core/Typography"
import { addHotkey } from "../../../Common/hooks"

const useStyles = makeStyles(theme => ({
  tools: {
    position: "relative", flexGrow: 0.5, flexShrink: 1.5, maxWidth: "calc(40% - 100px)", overflowX: "hidden", overflowY: "auto",
    "-webkit-overflow-scrolling": "touch",
    "&>*": { maxWidth: 300, position: "absolute", right: 0, top: 30 }
  },
  toolimg: { width: 80 }
}))

export const zoomin = () => {
  let f = MappingState.timeHeightFactor * 1.414
  if (f > 1580) f = 1600
  MappingState.timeHeightFactor = f
}
export const zoomout = () => {
  let f = MappingState.timeHeightFactor / 1.414
  if (f < 120) f = 100
  MappingState.timeHeightFactor = f
}

const SelectTool = () => {
  const cn = useStyles()
  const { t } = useTranslation()

  useEffect(() => addHotkey("1", () => MappingState.tool = "none"), [])
  useEffect(() => addHotkey("2", () => MappingState.tool = "single"), [])
  useEffect(() => addHotkey("3", () => MappingState.tool = "slide"), [])
  useEffect(() => addHotkey("4", () => MappingState.tool = "delete"), [])

  return useObserver(() =>
    <Grid item>
      <Box display="block" my={2} component={FormLabel}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>{t("Tool")}</Grid>
          <Grid item>
            <Tooltip placement="right"
              title={<Typography variant="body2">
                {t("Double click to switch flick")} <br />
                {t("Click the slide bar to add mid note")}
              </Typography>}>
              <HelpIcon fontSize="small" />
            </Tooltip></Grid>
        </Grid>
      </Box>
      <RadioGroup value={MappingState.tool}
        onChange={(e, v) => MappingState.tool = v as ToolTypes}>
        <FormControlLabel value="none" control={<Radio />}
          label={t("None")} title={t("Hotkey: {{ hotkey }}", { hotkey: "1" })} />
        <FormControlLabel value="single" control={<Radio />}
          label={<img className={cn.toolimg} src={assets.note_normal} alt="Single / Flick" />}
          title={t("Hotkey: {{ hotkey }}", { hotkey: "2" })} />
        <FormControlLabel value="slide" control={<Radio />}
          label={<img className={cn.toolimg} src={assets.note_long} alt="Slide" />}
          title={t("Hotkey: {{ hotkey }}", { hotkey: "3" })} />
        <FormControlLabel value="delete" control={<Radio />}
          label={t("Delete")} title={t("Hotkey: {{ hotkey }}", { hotkey: "4 / Right click" })} />
      </RadioGroup>
    </Grid>)
}

const SelectDivisor = () => {
  const { t } = useTranslation()
  return useObserver(() =>
    <Grid item>
      <FormControl fullWidth>
        <InputLabel>{t("Grid divisor (of a quarter note)")}</InputLabel>
        <Select fullWidth value={MappingState.division}
          onChange={e => MappingState.division = e.target.value as number} >
          <MenuItem value={1}>1 / 1</MenuItem>
          <MenuItem value={2}>1 / 2</MenuItem>
          <MenuItem value={3}>1 / 3</MenuItem>
          <MenuItem value={4}>1 / 4</MenuItem>
          <MenuItem value={6}>1 / 6</MenuItem>
          <MenuItem value={8}>1 / 8</MenuItem>
          <MenuItem value={16}>1 / 16</MenuItem>
          <MenuItem value={48}>1 / 48</MenuItem>
        </Select>
      </FormControl>
    </Grid>)
}

const ZoomInOut = () => {
  const { t } = useTranslation()

  useEffect(() => addHotkey("+,=", zoomin), [])
  useEffect(() => addHotkey("-,_", zoomout), [])

  useEffect(() => {
    const el = document.getElementById("root")
    const listener = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.stopPropagation()
        e.preventDefault()
        if (e.deltaY < 0) zoomin()
        else zoomout()
      }
    }
    el?.addEventListener("wheel", listener)
    return () => el?.removeEventListener("wheel", listener)
  }, [])

  return useObserver(() =>
    <Grid item container spacing={2}>
      <Grid item>
        <IconButton onClick={zoomin} disabled={MappingState.timeHeightFactor > 1580}
          title={t("Hotkey: {{ hotkey }}", { hotkey: "+ / ctrl + wheel" })}>
          <ZoomInIcon /></IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={zoomout} disabled={MappingState.timeHeightFactor < 120}
          title={t("Hotkey: {{ hotkey }}", { hotkey: "- / ctrl + wheel" })}>
          <ZoomOutIcon /></IconButton>
      </Grid>
    </Grid>)
}

const OtherTools = () => {
  const { t } = useTranslation()

  useEffect(() => addHotkey("f", () => MappingState.tracking = !MappingState.tracking), [])
  useEffect(() => addHotkey("tab", (e) => {
    MappingState.mirror = !MappingState.mirror; e.stopPropagation(); e.preventDefault()
  }), [])

  return useObserver(() =>
    <Grid item container spacing={2}>
      <Grid item>
        <FormControlLabel label={t("Follow")} title={t("Hotkey: {{ hotkey }}", { hotkey: "f" })}
          control={<Switch checked={MappingState.tracking}
            onChange={(e, v) => MappingState.tracking = v} />} />
      </Grid>
      <Grid item>
        <FormControlLabel label={t("Mirror")} title={t("Hotkey: {{ hotkey }}", { hotkey: "tab" })}
          control={<Switch checked={MappingState.mirror}
            onChange={(e, v) => MappingState.mirror = v} />} />
      </Grid>
    </Grid>)
}

const Tools = () => {
  const cn = useStyles()
  return (
    <Box className={cn.tools}>
      <Grid container spacing={4} direction="column">
        <SelectTool />
        <SelectDivisor />
        <ZoomInOut />
        <OtherTools />
      </Grid>
    </Box>)
}

export default Tools