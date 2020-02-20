import React from "react"
import Grid from "@material-ui/core/Grid"
import TimingPad from "./TimingPad"
import MeasureBtn from "./MeasureBtn"
import EditPart from "./EditPart"
import ActionPart from "./ActionPart"


export default () => {

  return (
    <Grid item xs={12} sm container spacing={2} direction="column">
      <Grid item>
        <TimingPad />
      </Grid>
      <Grid item>
        <MeasureBtn />
      </Grid>
      <EditPart />
      <ActionPart />
    </Grid>)
}