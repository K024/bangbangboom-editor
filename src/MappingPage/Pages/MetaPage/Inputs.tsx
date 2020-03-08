import React from "react"
import Grid from "@material-ui/core/Grid"
import AttachFileIcon from '@material-ui/icons/AttachFile'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import FileField from "../../../Common/Components/FileField"
import { Music, Background } from "../../states"
import { userMessage } from "../../../Common/Components/GlobalSnackbar"
import { useTranslation } from "react-i18next"
import { useObserver } from "mobx-react-lite"
import { scope } from "../../../MappingScope/scope"
import TextField from "@material-ui/core/TextField"
import i18n from "../../../i18n"

const FileFieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid item container spacing={2} alignItems="flex-end">
      <Grid item><AttachFileIcon /></Grid>
      <Grid item xs>
        {children}
      </Grid>
    </Grid>)
}

const MapName = () => {

  const { t } = useTranslation()

  return useObserver(() =>
    <Grid item container spacing={2} alignItems="flex-end">
      <Grid item><QueueMusicIcon /></Grid>
      <Grid item xs>
        <TextField fullWidth label={t("Map name")} value={scope.meta.name}
          onChange={e => scope.meta.name = e.target.value} />
      </Grid>
    </Grid>)
}


let musicfilename = ""
const selectM = (files: File[]) => {
  musicfilename = files[0].name
  Music.load(files[0],
    () => userMessage(i18n.t("Load failed"), "error"),
    () => userMessage(i18n.t("Load success"), "success"))
}
const SelectMusic = () => {
  const { t } = useTranslation()

  return (
    <FileFieldWrapper>
      <FileField fullWidth value={musicfilename} label={t("Load music")}
        accept="audio/*" onFileSelected={selectM} />
    </FileFieldWrapper>)
}

let backgroundfilename = ""
const selectBg = (files: File[]) => {
  backgroundfilename = files[0].name
  const src = URL.createObjectURL(files[0])
  Background.src = src
}
const SelectBackground = () => {
  const { t } = useTranslation()

  return (
    <FileFieldWrapper>
      <FileField fullWidth value={backgroundfilename} label={t("Load background")}
        accept="image/*" onFileSelected={selectBg} />
    </FileFieldWrapper>)
}

const Inputs = () => <>
  <MapName />
  <SelectMusic />
  <SelectBackground />
</>

export default Inputs