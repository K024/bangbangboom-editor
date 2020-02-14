import React from "react"
import ProgressBar from "./ProgressBar"
import IconButton from "@material-ui/core/IconButton"
import StopIcon from '@material-ui/icons/Stop'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Box from "@material-ui/core/Box"
import Switch from "@material-ui/core/Switch"
import { useTranslation } from "react-i18next"
import { Music } from "../../states"

const Tools = () => {

  const playing = Music.playing.useShared()
  const rate = Music.playbackrate.useShared()
  const { t } = useTranslation()

  return (<>
    <IconButton onClick={Music.toggle}>
      {playing ?
        <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
    <IconButton onClick={() => Music.seek(0)}>
      <StopIcon />
    </IconButton>
    <Box width={1} />
    <FormControlLabel
      control={<Switch checked={rate === 0.5}
        onChange={(e, c) => Music.playbackrate.setValue(c ? 0.5 : 1)} />}
      label={t("Half speed")}
    />
  </>)
}

export default () => {


  return (<>
    <ProgressBar />
    <Tools />
  </>)
}

