import React, { useEffect } from "react"
import { useStyles, useNoteStyles } from "./styles"
import { useObserver } from "mobx-react-lite"
import { useMirror } from "./state"
import { MappingState } from "../sharedState"
import { Rect } from "./SVGs"
import { itemList } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"
import i18n from "../../../../i18n"
import { userMessage } from "../../../../Common/Components/GlobalSnackbar"

const WaringRect = ({ noteid }: { noteid: number }) => {
  const cn = useNoteStyles()
  const style = useObserver(() => {
    const note = scope.map.notes.get(noteid)
    if (!note) return
    const time = note.realtimecache
    return {
      bottom: time * MappingState.timeHeightFactor + "px",
      left: note.lane * 10 + 15 + "%",
      color: "#ff8800",
      transform: "translateY(50%) scale(1.4)"
    }
  })
  if (!style) return null
  return <Rect className={cn.note + " " + cn.noevent} style={style} />
}

const WarningLayer = () => {

  const cn = useStyles()
  const layer = useMirror()

  const notes = useObserver(() => MappingState.samePosNotes)

  useEffect(() => {
    if (notes.size > 0)
      userMessage(i18n.t("Some notes are in the same position"), "warning")
  }, [notes.size])

  return (
    <div className={cn.layer} ref={layer}>
      {itemList(notes).map(id => <WaringRect key={id} noteid={id} />)}
    </div>)
}

export default WarningLayer