import React, { useEffect, useState } from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import RedoIcon from '@material-ui/icons/Redo'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import UndoIcon from '@material-ui/icons/Undo'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import { useHashRoutes, NavigateTo } from "../routes"
import { scope } from "../../MappingScope/scope"
import { addHotkey } from "../../Common/hooks"
import { useTranslation } from "react-i18next"
import { userMessage } from "../../Common/Components/GlobalSnackbar"
import { startGame } from "../../GamePage/gamestate"
import i18n from "../../i18n"
import { useObserver } from "mobx-react-lite"

const useStyles = makeStyles(theme => ({
  tabs: { flexGrow: 1, height: "100%" }
}))

const HeaderTabs = () => {

  const cn = useStyles()
  const { t } = useTranslation()
  const [path] = useHashRoutes()

  const tabs = {
    "#meta": t("Meta"),
    "#timing": t("Timing"),
    "#mapping": t("Mapping"),
    "#settings": t("Settings")
  }

  return (
    <Tabs indicatorColor="primary" className={cn.tabs} value={path in tabs ? path : "#meta"} onChange={(e, v) => NavigateTo(v)}>
      {Object.keys(tabs).map(key =>
        <Tab key={key} value={key} label={tabs[key as keyof typeof tabs]} />)}
    </Tabs>)
}

const save = (e: { preventDefault: () => void }) => {
  scope.save()
  e.preventDefault()
  userMessage(i18n.t("Saved into browser storage"), "success")
}

const SaveIcon = () => {
  const [noticed, setNoticed] = useState(0)
  const lastsave = useObserver(() => scope.lastSave)

  useEffect(() => {
    if (!lastsave || lastsave.getTime() === noticed) return
    const to = setTimeout(() => {
      setNoticed(lastsave.getTime())
    }, 3000)
    return () => clearTimeout(to)
  })


  if (!lastsave || lastsave.getTime() === noticed)
    return <SaveAltIcon />
  return <DoneOutlineIcon />
}

const HeaderActions = () => {

  useEffect(() => addHotkey("ctrl+z", scope.map.Undo), [])
  useEffect(() => addHotkey("ctrl+shift+z", scope.map.Redo), [])
  useEffect(() => addHotkey("ctrl+s", save), [])

  const { t } = useTranslation()

  const actionlist1 = useObserver(() => [
    {
      children: <UndoIcon />, onClick: scope.map.Undo, disabled: !scope.map.canUndo,
      title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + z" })
    },
    {
      children: <RedoIcon />, onClick: scope.map.Redo, disabled: !scope.map.canRedo,
      title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + shift + z" })
    },
    { children: <SaveIcon />, onClick: save, title: t("Hotkey: {{ hotkey }}", { hotkey: "ctrl + s" }) },
  ])
  const actionlist2 = [
    { children: <PlayCircleFilledIcon />, onClick: startGame },
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