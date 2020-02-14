import React from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import RedoIcon from '@material-ui/icons/Redo'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import UndoIcon from '@material-ui/icons/Undo'
import { useTranslation } from 'react-i18next'
import { useHashRoutes, NavigateTo } from "../routes"
import { scope } from "../../MappingScope/scope"
import { useMapChange } from "../states"

const useStyles = makeStyles(theme => ({
  tabs: { flexGrow: 1, height: "100%" }
}))

const HeaderTabs = () => {

  const cn = useStyles()
  const { t } = useTranslation()
  const path = useHashRoutes()

  return (
    <Tabs className={cn.tabs} value={path} onChange={(e, v) => NavigateTo(v)}>
      <Tab label={t("Meta")} value="#meta" />
      <Tab label={t("Timing")} value="#timing" />
      <Tab label={t("Mapping")} value="#mapping" />
      <Tab label={t("Settings")} value="#settings" />
    </Tabs>)
}

const HeaderActions = () => {

  useMapChange()

  const actionlist1 = [
    { children: <UndoIcon />, onClick: () => scope.actions.Undo(), disabled: !scope.actions.canUndo },
    { children: <RedoIcon />, onClick: () => scope.actions.Redo(), disabled: !scope.actions.canRedo },
    { children: <SaveAltIcon />, onClick: () => scope.save() },
  ]
  const actionlist2 = [
    { children: <PlayCircleFilledIcon />, onClick: () => void 0 },
  ]

  return <>
    {actionlist1.map((item, i) =>
      <Box key={i}><IconButton {...item} /></Box>)}
    <Box width={2} />
    {actionlist2.map((item, i) =>
      <Box key={i}><IconButton {...item} /></Box>)}
  </>
}

export default () => {

  return (<>
    <HeaderTabs />
    <HeaderActions />
  </>)
}