import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Grid from "@material-ui/core/Grid"
import LeftPanel from "./LeftPanel"
import RightPanel from "./RightPanel"


const useStyles = makeStyles(theme => ({
  timing: { width: "100%", maxWidth: 1000, margin: "32px auto" },
}))

const TimingPage = () => {

  const cn = useStyles()

  return (
    <Grid className={cn.timing} container spacing={3}>
      <LeftPanel />
      <RightPanel />
    </Grid>)
}

export default TimingPage