import React from "react"
import { useObserver } from "mobx-react-lite"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"
import { useMapChange } from "../../states"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import { scope } from "../../../MappingScope/scope"
import { TimeToString } from "../../../Common/utils"
import { TimingState } from "./sharedState"
import Button from "@material-ui/core/Button"


const useStyles = makeStyles(theme => ({
  table: { maxHeight: "60vh", overflow: "auto" },
  tablerow: { cursor: "pointer" }
}))

const TimepointTable = () => {

  const cn = useStyles()
  const { t } = useTranslation()
  useMapChange()

  return useObserver(() =>
    <Table className={cn.table}>
      <TableHead>
        <TableRow>
          <TableCell>{t("Start time")}</TableCell>
          <TableCell>BPM</TableCell>
          <TableCell>{(t("Meter"))}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scope.map.timepointlist.map(tp => (
          <TableRow key={tp.id} selected={tp.id === TimingState.selected} hover
            onClick={() => TimingState.selected = tp.id === TimingState.selected ? null : tp.id}
            classes={{ root: cn.tablerow }}>
            <TableCell>{TimeToString(tp.time)}</TableCell>
            <TableCell>{tp.bpm}</TableCell>
            <TableCell>{tp.bpb}/4</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const RemoveBtn = () => {

  const { t } = useTranslation()

  const removeTp = () => {
    if (TimingState.selected === null) return
    scope.map.removeTimepoint(TimingState.selected, scope.settings.editor.justify_grid_divisor)
    TimingState.selected = null
  }

  return useObserver(() =>
    <Button color="secondary" disabled={TimingState.selected === null} onClick={removeTp}>
      {t("Remove")}
    </Button>)
}

export default () => {

  const { t } = useTranslation()

  return useObserver(() =>
    <Grid item xs={12} sm container spacing={2} direction="column">
      <Grid item><Typography>{t("Timepoints")}</Typography></Grid>
      <Grid item>
        <TimepointTable />
      </Grid>
      <Grid item>
        <RemoveBtn />
      </Grid>
    </Grid>)
}
