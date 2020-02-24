import React from "react"
import { useObserver } from "mobx-react-lite"
import Grid from "@material-ui/core/Grid"
import NumberField from "../../../../Common/Components/NumberField"
import { useTranslation } from "react-i18next"
import { TimingState } from "../sharedState"
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import { Music } from "../../../states"
import InputAdornment from "@material-ui/core/InputAdornment"

const movebeat = (beats: number) => {
  TimingState.time += beats * 60 / TimingState.bpm
}

const EditPart = () => {

  const { t } = useTranslation()

  return useObserver(() =>
    <Grid item container spacing={2}>
      <Grid item xs={12} sm={6}>
        <NumberField fullWidth label={t("Time")} inputProps={{ type: "number", step: "0.001" }}
          numberDisplay={i => i === (i | 0) ? i.toString() : i.toFixed(3)}
          number={TimingState.time} onNumberChange={(e, v) => TimingState.time = v} />
      </Grid>
      <Grid item xs={12} container alignItems="center">
        <Grid item>
          <IconButton onClick={() => movebeat(-1)} title={t("Backward one beat")} >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={() => movebeat(1)} title={t("Forward one beat")}>
            <NavigateNextIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Button fullWidth onClick={() => TimingState.time = Music.position()}>
            {t("Set to current player time")}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <NumberField fullWidth label="BPM" inputProps={{ type: "number", step: "0.001" }}
          number={TimingState.bpm}
          onNumberChange={(e, v) => TimingState.bpm = v} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <NumberField
          InputProps={{ endAdornment: <InputAdornment position="end">/ 4</InputAdornment> }}
          fullWidth label={t("Meter")} inputProps={{ type: "number", step: "1" }}
          number={TimingState.bpb}
          validator={s => /^[0-9]+$/.test(s) && parseInt(s)}
          onNumberChange={(e, v) => TimingState.bpb = v} />
      </Grid>
    </Grid>)
}

export default EditPart