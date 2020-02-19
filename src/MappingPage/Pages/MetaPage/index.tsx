import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import CopyDialog from "./CopyDialog"
import Actions from "./Actions"
import ConfirmDialog from "./ConfirmDialog"
import Inputs from "./Inputs"

const useStyles = makeStyles(() => ({
  panel: { width: "100%", maxWidth: 600, margin: "64px auto", },
  root: { width: "100%", height: "100%", overflow: "hidden auto" },
}))



export default () => {

  const cn = useStyles()

  return (
    <Box className={cn.root}>
      <Grid className={cn.panel} container direction="column" spacing={4}>
        <Inputs />
        <Actions />
      </Grid>
      <CopyDialog />
      <ConfirmDialog />
    </Box>
  )

}