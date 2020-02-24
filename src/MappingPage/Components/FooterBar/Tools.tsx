import React, { useEffect } from "react"
import IconButton from "@material-ui/core/IconButton"
import StopIcon from '@material-ui/icons/Stop'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import Box from "@material-ui/core/Box"
import Slider from "@material-ui/core/Slider"
import { useTranslation } from "react-i18next"
import { Music } from "../../states"
import { useObserver } from "mobx-react-lite"
import { addHotkey } from "../../../Common/hooks"

const Tools = () => {

  const { t } = useTranslation()

  useEffect(() => addHotkey("space", Music.toggle), [])

  return useObserver(() => <>
    <IconButton onClick={Music.toggle} disabled={!Music.loaded}
      title={t("Hotkey: {{ hotkey }}", { hotkey: "space" })}>
      {Music.playing ?
        <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
    <IconButton onClick={Music.stop} disabled={!Music.loaded}>
      <StopIcon />
    </IconButton>
    <Box width="120px" ml={3} mr={4}>
      <Slider value={Music.playbackrate} step={null} min={0.15} max={1}
        title={t("Playback rate")} color="secondary"
        onChange={(e, v) => Music.playbackrate = v as number}
        marks={[
          { value: 0.25, label: "25%" },
          { value: 0.5, label: "50%" },
          { value: 0.75, label: "75%" },
          { value: 1, label: "100%" },]}
      />
    </Box>
  </>)
}

export default Tools