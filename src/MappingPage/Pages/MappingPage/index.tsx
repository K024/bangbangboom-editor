import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { once } from "../../../Common/utils"
import { AudioSource, loadFromUrl } from "../../../Common/AudioCtx"
import assets from "../../assets"
import Box from "@material-ui/core/Box"
import Tools from "./Tools"
import Track from "./Track"
import ScrollBar from "./ScrollBar"

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative", width: "100%", height: "100%", display: "flex",
    justifyContent: "space-between", alignItems: "stretch", overflow: "hidden"
  },
}))


const sounds = once(() => ({
  perfect: AudioSource.from(loadFromUrl(assets.perfect)).load(),
  flick: AudioSource.from(loadFromUrl(assets.flick)).load(),
}))

sounds()

export default () => {

  const cn = useStyles()

  // useEffect(() => {
  //   MappingState.mapchangecounter = 0
  //   const listener = () => MappingState.mapchangecounter++
  //   scope.map.changeListeners.add(listener)
  //   return () => { scope.map.changeListeners.delete(listener) }
  // }, [])

  return (
    <Box className={cn.root}>
      <Tools />
      <Track />
      <ScrollBar />
    </Box>)
}