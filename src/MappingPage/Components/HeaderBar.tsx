import React, { useEffect, useCallback } from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import RedoIcon from '@material-ui/icons/Redo'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import UndoIcon from '@material-ui/icons/Undo'
import { useHashRoutes, NavigateTo } from "../routes"
import { scope } from "../../MappingScope/scope"
import { useMapChange } from "../states"
import { addHotkey } from "../../Common/hooks"
import { useTranslation } from "react-i18next"
import { userMessage } from "../../Common/Components/GlobalSnackbar"

const useStyles = makeStyles(theme => ({
  tabs: { flexGrow: 1, height: "100%" }
}))

const HeaderTabs = () => {

  const cn = useStyles()
  const { t } = useTranslation()
  const [path] = useHashRoutes()

  const tabs: { key: typeof path, label: string }[] = [
    { key: "#meta", label: t("Meta") },
    { key: "#timing", label: t("Timing") },
    { key: "#mapping", label: t("Mapping") },
    { key: "#settings", label: t("Settings") },
  ]

  return (
    <Tabs indicatorColor="primary" className={cn.tabs} value={path} onChange={(e, v) => NavigateTo(v)}>
      {tabs.map(x =>
        <Tab key={x.key} value={x.key} label={x.label} />)}
    </Tabs>)
}

const HeaderActions = () => {

  useMapChange()

  useEffect(() => addHotkey("ctrl+z", scope.map.Undo), [])
  useEffect(() => addHotkey("ctrl+shift+z", scope.map.Redo), [])

  const { t } = useTranslation()
  const save = useCallback((e: { preventDefault: () => void }) => {
    scope.save()
    e.preventDefault()
    userMessage(t("Saved into browser storage"), "success")
  }, [t])
  useEffect(() => addHotkey("ctrl+s", save), [save])

  const actionlist1 = [
    {
      children: <UndoIcon />, onClick: scope.map.Undo, disabled: !scope.map.canUndo,
      title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + z" })
    },
    {
      children: <RedoIcon />, onClick: scope.map.Redo, disabled: !scope.map.canRedo,
      title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + shift + z" })
    },
    { children: <SaveAltIcon />, onClick: save, title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + s" }) },
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

const HeaderBar = () => {

  return (<>
    <HeaderTabs />
    <HeaderActions />
  </>)
}

export default HeaderBar