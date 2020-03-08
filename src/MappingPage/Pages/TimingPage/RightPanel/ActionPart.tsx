import React from "react"
import { useObserver } from "mobx-react-lite"
import Grid from "@material-ui/core/Grid"
import { useTranslation } from "react-i18next"
import Button from "@material-ui/core/Button"
import { TimingState } from "../sharedState"
import { scope } from "../../../../MappingScope/scope"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"

const addtp = () => {
  scope.map.addTimepoint(
    TimingState.time,
    TimingState.bpm,
    TimingState.bpb,
    scope.settings.editor.justify_grid_divisor)
}

const settp = () => {
  const selected = TimingState.selected
  if (selected === null) return
  scope.map.moveTimepoint(selected,
    scope.settings.editor.justify_find_nearest,
    scope.settings.editor.justify_grid_divisor,
    TimingState.time,
    TimingState.bpm,
    TimingState.bpb)
}

export const changed = () => {
  const selected = TimingState.selected
  if (selected === null) return false
  const tp = scope.map.timepoints.get(selected)
  if (!tp) {
    TimingState.selected = null
    return false
  }
  return tp.bpb !== TimingState.bpb || tp.bpm !== TimingState.bpm || tp.time !== TimingState.time
}

const ActionPart = () => {

  const { t } = useTranslation()

  return useObserver(() =>
    <Grid item container wrap="wrap" spacing={2}>
      <Grid item xs>
        <Button fullWidth onClick={addtp} disabled={TimingState.selected !== null} color="primary">
          {t("Add timepoint")}
        </Button></Grid>
      <Grid item xs>
        <Button fullWidth onClick={settp} disabled={!changed()} color="primary">
          {t("Apply changes")}
        </Button></Grid>
      <Grid item container style={{ marginTop: 16 }}>
        <FormControlLabel style={{ marginLeft: "auto" }}
          control={<Switch checked={TimingState.muteticker}
            onChange={(e, v) => TimingState.muteticker = v} />}
          label={t("Mute metronome")} labelPlacement="start" />
      </Grid>
      <Grid item container>
        <FormControlLabel style={{ marginLeft: "auto" }}
          control={<Switch checked={TimingState.autoswitchtp}
            onChange={(e, v) => TimingState.autoswitchtp = v} />}
          label={t("Auto switch selected timepoint")} labelPlacement="start" />
      </Grid>
    </Grid>)
}

export default ActionPart