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


const useStyles = makeStyles(theme => ({
  panel: { width: "100%", maxWidth: 600, margin: "32px auto", },
}))

const SliderWrapper = (props: { children: React.ReactNode, label: React.ReactNode }) =>
  <Grid component={FormLabel} item container spacing={2} alignItems="center">
    <Grid item style={{ width: 150 }}>
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
      <Slider value={scope.settings.general.song_volume} min={0} max={1} step={0.01}
        onChange={(e, v) => scope.settings.general.song_volume = v as number} />
    </SliderWrapper>
    <SliderWrapper label={t("Effect volume")}>
      <Slider value={scope.settings.general.effect_volume} min={0} max={1} step={0.01}
        onChange={(e, v) => scope.settings.general.effect_volume = v as number} />
    </SliderWrapper>
    <SliderWrapper label={t("Background dim")}>
      <Slider value={scope.settings.general.background_dim} min={0} max={1} step={0.01}
        onChange={(e, v) => scope.settings.general.background_dim = v as number} />
    </SliderWrapper>
  </>)
}

const Editor = () => {
  const { t } = useTranslation()

  const changeKeepPitch = (e: any, v: boolean) => {
    scope.settings.editor.keep_pitch = v
    if (v) {
      userMessage(t("This may cause unstable delay of song. ") + t("Please reload the music to activate"), "warning")
    } else {
      userMessage(t("Please reload the music to activate"), "warning")
    }
  }

  return useObserver(() => <>
    <Grid item>
      <Typography variant="h6">{t("Editor")}</Typography>
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
    <SwitchWrapper label={t("Show cursor infomation in mapping")}>
      <Switch checked={scope.settings.editor.show_info_window}
        onChange={(e, v) => scope.settings.editor.show_info_window = v} />
    </SwitchWrapper>
    <SwitchWrapper label={t("Show warning for same position notes")}>
      <Switch checked={scope.settings.editor.warn_for_same_pos_notes}
        onChange={(e, v) => scope.settings.editor.warn_for_same_pos_notes = v} />
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
    </Grid>)
}

export default SettingsPage