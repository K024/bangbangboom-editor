import React from "react"
import { useStyles } from "./styles"


export default () => {
  const cn = useStyles()
  return <div className={cn.track}></div>
}