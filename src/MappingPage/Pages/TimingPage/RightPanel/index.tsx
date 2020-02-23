import React from "react"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import TimingPad from "./TimingPad"
import MeasureBtn from "./MeasureBtn"
import EditPart from "./EditPart"
import ActionPart from "./ActionPart"
import { useObserver } from "mobx-react-lite"
import { scope } from "../../../../MappingScope/scope"
import { useTranslation } from "react-i18next"

const DelayNotice = () => {
  const { t } = useTranslation()
  return useObserver(() => {
    if (scope.settings.editor.keep_pitch)
      return (
        <Grid item>
          <Box p={1} fontWeight="fontWeightLight" fontFamily="sans-serif" fontStyle="italic" textAlign="center">
            {t("Some unstable delay may be caused by setting \"Keep pitch\"")}</Box>
        </Grid>)
    return null
  })
}

export default () => {

  return (
    <Grid item xs={12} sm container spacing={2} direction="column">
      <Grid item>
        <TimingPad />
      </Grid>
      <DelayNotice />
      <Grid item>
        <MeasureBtn />
      </Grid>
      <EditPart />
      <ActionPart />
    </Grid>)
}