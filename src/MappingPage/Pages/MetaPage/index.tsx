import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import CopyDialog from "./CopyDialog"
import Actions from "./Actions"
import ConfirmDialog from "./ConfirmDialog"
import Inputs from "./Inputs"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles(() => ({
  panel: { width: "100%", maxWidth: 600, margin: "64px auto", },
}))

const MetaPage = () => {

  const cn = useStyles()

  return (
    <Grid className={cn.panel} container direction="column" spacing={4}>
      <Inputs />
      <Actions />
      <Grid item>
        <Typography align="right" color="textSecondary">
          <Link target="_blank" rel="noopener noreferrer" href="https://bestdori.com">
            Bestdori
          </Link>&nbsp;|&nbsp;
          <Link target="_blank" rel="noopener noreferrer" href="https://player.banground.fun">
            Banground Player
          </Link>&nbsp;|&nbsp;
          <Link target="_blank" rel="noopener noreferrer" href="https://github.com/K024/bangbangboom-editor">
            About bangbangboom editor
          </Link>
        </Typography>
      </Grid>
      <CopyDialog />
      <ConfirmDialog />
    </Grid>)

}

export default MetaPage