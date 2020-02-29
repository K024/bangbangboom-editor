import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import CopyDialog from "./CopyDialog"
import Actions from "./Actions"
import ConfirmDialog from "./ConfirmDialog"
import Inputs from "./Inputs"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import Box from "@material-ui/core/Box"
import { useObserver } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { scope } from "../../../MappingScope/scope"

const useStyles = makeStyles(() => ({
  panel: { width: "100%", maxWidth: 600, margin: "64px auto", },
}))

const Links = () =>
  <Grid item>
    <Typography align="right" color="textSecondary">
      <Link target="_blank" rel="noopener noreferrer" href="https://bestdori.com">
        Bestdori
    </Link>&nbsp;|&nbsp;
    <Link target="_blank" rel="noopener noreferrer" href="https://player.banground.fun">
        Banground Player
    </Link>&nbsp;|&nbsp;
    <Link target="_blank" rel="noopener noreferrer" href="https://github.com/K024/bangbangboom-editor">
        About bangbangboom editor & translations
    </Link>
    </Typography>
  </Grid>

const Update = () => {
  const { t } = useTranslation()
  const update = useObserver(() => scope.update)
  if (update) return (
    <Grid item>
      <Box p={1} fontWeight="fontWeightLight" fontFamily="sans-serif" fontStyle="italic" textAlign="center">
        {t("An update is available. Please close ALL tabs of this site or press Ctrl + F5 reload.")}</Box>
    </Grid>)
  return null
}

const MetaPage = () => {

  const cn = useStyles()

  return (
    <Grid className={cn.panel} container direction="column" spacing={4}>
      <Update />
      <Inputs />
      <Actions />
      <Links />
      <CopyDialog />
      <ConfirmDialog />
    </Grid>)

}

export default MetaPage