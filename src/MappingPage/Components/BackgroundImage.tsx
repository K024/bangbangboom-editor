import React from "react"
import Box from "@material-ui/core/Box"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { Background } from "../states"
import { useObserver } from "mobx-react-lite"
import { scope } from "../../MappingScope/scope"

const useStyles = makeStyles(theme => ({
  background: {
    position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0,
    backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "opacity 0.3s",
    backgroundSize: "cover"
  }
}))

export default () => {

  const cn = useStyles()

  return useObserver(() =>
    <Box className={cn.background}
      style={{
        backgroundImage: Background.src ? `url(${Background.src})` : "",
        opacity: 1 - scope.settings.general.background_dim
      }}
    />)
}

