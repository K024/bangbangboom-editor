import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import CopyDialog from "./CopyDialog"
import Actions from "./Actions"
import ConfirmDialog from "./ConfirmDialog"
import Inputs from "./Inputs"

const useStyles = makeStyles(() => ({
  panel: { width: "100%", maxWidth: 600, margin: "64px auto", },
}))

const MetaPage = () => {

  const cn = useStyles()

  return (
    <Grid className={cn.panel} container direction="column" spacing={4}>
      <Inputs />
      <Actions />
      <CopyDialog />
      <ConfirmDialog />
    </Grid>)

}

export default MetaPage