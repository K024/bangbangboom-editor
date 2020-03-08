import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useObserver } from "mobx-react-lite"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"
import Slider from "@material-ui/core/Slider"
import { scope } from "../../../MappingScope/scope"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Divider from "@material-ui/core/Divider"
import Switch from "@material-ui/core/Switch"
import { userMessage } from "../../../Common/Components/GlobalSnackbar"
import FormLabel from "@material-ui/core/FormLabel"
import NumberField from "../../../Common/Components/NumberField"
import i18n from "../../../i18n"


const useStyles = makeStyles(theme => ({
  panel: { width: "100%", maxWidth: 600, margin: "32px auto", },
}))

function timeFormat(date: Date) {
  const hh = (date.getHours() + 100).toString().substr(1)
  const mm = (date.getMinutes() + 100).toString().substr(1)
  const ss = (date.getSeconds() + 100).toString().substr(1)
  return `${hh}:${mm}:${ss}`
}

const SliderWrapper = (props: { children: React.ReactNode, label: React.ReactNode }) =>
  <Grid item container spacing={2} alignItems="center">
    <Grid component={FormLabel} item style={{ width: 150 }}>
      <Typography>{props.label}</Typography></Grid>
    <Grid item xs>
      {props.children}
    </Grid>
  </Grid>

const SwitchWrapper = (props: { children: React.ReactNode, label: React.ReactNode }) =>
  <Grid component={FormLabel} item container spacing={2} alignItems="center">
    <Grid item xs>
      <Typography>{props.label}</Typography></Grid>
    <Grid item>
      {props.children}
    </Grid>
  </Grid>

const General = () => {
  const { t } = useTranslation()
  return useObserver(() => <>
    <Grid item>
      <Typography variant="h6">{t("General")}</Typography>
    </Grid>
    <SliderWrapper label={t("Song volume")}>
      <Slider value={scope.settings.general.song_volume} min={0} max={1} step={0.01} valueLabelDisplay="auto"
        onChange={(e, v) => scope.settings.general.song_volume = v as number} />
    </SliderWrapper>
    <SliderWrapper label={t("Effect volume")}>
      <Slider value={scope.settings.general.effect_volume} min={0} max={1} step={0.01} valueLabelDisplay="auto"
        onChange={(e, v) => scope.settings.general.effect_volume = v as number} />
    </SliderWrapper>
    <SliderWrapper label={t("Background dim")}>
      <Slider value={scope.settings.general.background_dim} min={0} max={1} step={0.01} valueLabelDisplay="auto"
        onChange={(e, v) => scope.settings.general.background_dim = v as number} />
    </SliderWrapper>
    <Grid item>
      <FormControl fullWidth>
        <InputLabel>{t("Preferred language (some items maybe missing)")}</InputLabel>
        <Select value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value as string)}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="zh">简体中文</MenuItem>
          <MenuItem value="ja">日本語</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </>)
}

const changeKeepPitch = (e: any, v: boolean) => {
  scope.settings.editor.keep_pitch = v
  if (v) {
    userMessage(i18n.t("This may cause unstable delay of song.") + " " + i18n.t("Please reload the music to activate"), "warning")
  } else {
    userMessage(i18n.t("Please reload the music to activate"), "warning")
  }
}

const Editor = () => {
  const { t } = useTranslation()

  return useObserver(() => <>
    <Grid item>
      <Typography variant="h6">{t("Editor")}</Typography>
    </Grid>
    <Grid item container spacing={2}>
      <Grid component={FormLabel} item xs={12}>
        <Typography>
          {t("Auto save interval (minutes, 0 to disable)")} &nbsp;&nbsp;
          {t("Last save: {{ time }}", {
            time: scope.lastSave ? timeFormat(scope.lastSave) : t("Never")
          })}
        </Typography></Grid>
      <Grid item xs>
        <Slider value={scope.settings.editor.autosave_interval} min={0} max={10} step={0.5} valueLabelDisplay="auto"
          onChange={(e, v) => scope.settings.editor.autosave_interval = v as number} />
      </Grid>
    </Grid>
    <SwitchWrapper label={t("Keep pitch when changing playback rate")}>
      <Switch checked={scope.settings.editor.keep_pitch}
        onChange={changeKeepPitch} />
    </SwitchWrapper>
    <Grid item>
      <FormControl fullWidth>
        <InputLabel>{t("When changes applied, try to keep notes at")}</InputLabel>
        <Select value={scope.settings.editor.justify_find_nearest ? 1 : 0}
          onChange={e => scope.settings.editor.justify_find_nearest = !!e.target.value}>
          <MenuItem value={1}>{t("Previous time")}</MenuItem>
          <MenuItem value={0}>{t("Previous beat")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item>
      <FormControl fullWidth>
        <InputLabel>{t("Grid divisor (of a quarter) to justify notes when justifying timepoint")}</InputLabel>
        <Select value={scope.settings.editor.justify_grid_divisor}
          onChange={e => scope.settings.editor.justify_grid_divisor = e.target.value as number}>
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
    </Grid>
    <SwitchWrapper label={t("Show cursor information in mapping")}>
      <Switch checked={scope.settings.editor.show_info_window}
        onChange={(e, v) => scope.settings.editor.show_info_window = v} />
    </SwitchWrapper>
    <SwitchWrapper label={t("Show warning for same position notes")}>
      <Switch checked={scope.settings.editor.warn_for_same_pos_notes}
        onChange={(e, v) => scope.settings.editor.warn_for_same_pos_notes = v} />
    </SwitchWrapper>
  </>)
}
let v: number
const Game = () => {
  const { t } = useTranslation()
  return useObserver(() => <>
    <Grid item>
      <Typography variant="h6">{t("Game")}</Typography>
    </Grid>
    <Grid item container spacing={2}>
      <Grid component={FormLabel} item xs={12}>
        <Typography>{t("Judge offset (ms, smaller means you have to tap earlier)")}</Typography></Grid>
      <Grid item xs>
        <Slider value={scope.settings.game.judge_offset} min={-1000} max={1000} step={1} valueLabelDisplay="auto"
          onChange={(e, v) => scope.settings.game.judge_offset = v as number} />
      </Grid>
      <Grid item style={{ width: 72 }}>
        <NumberField inputProps={{ type: "number", step: "1", max: "1000", min: "-1000" }}
          number={scope.settings.game.judge_offset}
          validator={s => /^-?[0-9]+$/.test(s) && (v = parseInt(s), v <= 1000 && v >= -1000 && v)}
          onNumberChange={(e, v) => scope.settings.game.judge_offset = v} />
      </Grid>
    </Grid>
    <Grid item container spacing={2}>
      <Grid component={FormLabel} item xs={12}>
        <Typography>{t("Visual offset (ms, smaller means notes fall earlier)")}</Typography></Grid>
      <Grid item xs>
        <Slider value={scope.settings.game.visual_offset} min={-1000} max={1000} step={1} valueLabelDisplay="auto"
          onChange={(e, v) => scope.settings.game.visual_offset = v as number} />
      </Grid>
      <Grid item style={{ width: 72 }}>
        <NumberField inputProps={{ type: "number", step: "1", max: "1000", min: "-1000" }}
          number={scope.settings.game.visual_offset}
          validator={s => /^-?[0-9]+$/.test(s) && (v = parseInt(s), v <= 1000 && v >= -1000 && v)}
          onNumberChange={(e, v) => scope.settings.game.visual_offset = v} />
      </Grid>
    </Grid>
    <Grid item container spacing={2}>
      <Grid component={FormLabel} item style={{ width: 150 }}>
        <Typography>{t("Fall speed")}</Typography></Grid>
      <Grid item xs>
        <Slider value={scope.settings.game.speed} min={1} max={11} step={0.1} valueLabelDisplay="auto"
          onChange={(e, v) => scope.settings.game.speed = v as number} />
      </Grid>
      <Grid item style={{ width: 72 }}>
        <NumberField inputProps={{ type: "number", step: "0.1", max: "11", min: "1" }}
          number={scope.settings.game.speed}
          validator={s => /^[0-9]+(.[0-9]?)?$/.test(s) && (v = parseFloat(s), v <= 11 && v >= 1 && v)}
          onNumberChange={(e, v) => scope.settings.game.speed = v} />
      </Grid>
    </Grid>
    <SliderWrapper label={t("Resolution")}>
      <Slider value={scope.settings.game.resolution} min={0.2} max={4} step={0.05} valueLabelDisplay="auto"
        onChange={(e, v) => scope.settings.game.resolution = v as number} />
    </SliderWrapper>
    <SliderWrapper label={t("Slide bar opacity")}>
      <Slider value={scope.settings.game.bar_opaciry} min={0} max={1} step={0.01} valueLabelDisplay="auto"
        onChange={(e, v) => scope.settings.game.bar_opaciry = v as number} />
    </SliderWrapper>
    <SwitchWrapper label={t("Show simultaneous line")}>
      <Switch checked={scope.settings.game.show_sim_line}
        onChange={(e, v) => scope.settings.game.show_sim_line = v} />
    </SwitchWrapper>
    <SwitchWrapper label={t("Lane tap effect")}>
      <Switch checked={scope.settings.game.lane_effect}
        onChange={(e, v) => scope.settings.game.lane_effect = v} />
    </SwitchWrapper>
    <SwitchWrapper label={t("Mirror")}>
      <Switch checked={scope.settings.game.mirror}
        onChange={(e, v) => scope.settings.game.mirror = v} />
    </SwitchWrapper>
    <SwitchWrapper label={t("Rhythm visual assist")}>
      <Switch checked={scope.settings.game.beat_note}
        onChange={(e, v) => scope.settings.game.beat_note = v} />
    </SwitchWrapper>
  </>)
}


const SettingsPage = () => {

  const cn = useStyles()

  return (
    <Grid className={cn.panel} container direction="column" spacing={4}>
      <General />
      <Divider style={{ margin: "32px -24px", width: "30%" }} />
      <Editor />
      <Divider style={{ margin: "32px -24px", width: "30%" }} />
      <Game />
    </Grid>)
}

export default SettingsPage