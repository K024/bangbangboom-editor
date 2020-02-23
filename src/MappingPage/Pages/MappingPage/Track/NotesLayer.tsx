import React, { useMemo } from "react"
import { NoteType } from "../../../../MappingScope/EditMap"
import { MappingState } from "../sharedState"
import { useStyles, useNoteStyles } from "./styles"
import assets from "../../../assets"
import { assert, neverHappen } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"
import { useMapChange } from "../../../states"
import { useMirror, state } from "./state"
import { useObserver } from "mobx-react-lite"

let dragPointer = -1
const downEventHandler = (nid: number) => {
  return (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    // const note = assert(scope.map.notes.get(nid))
    if ("buttons" in e) {
      dragPointer = 1
    } else {
      dragPointer = e.changedTouches[0].identifier
    }
    state.preventPanelClick = true
    state.draggingNote = nid
    e.stopPropagation()
  }
}

window.addEventListener("mouseup", e => { dragPointer = -1; state.draggingNote = -1 })
window.addEventListener("touchend", e => {
  if (e.changedTouches[0].identifier === dragPointer) { dragPointer = -1; state.draggingNote = -1 }
})

const clickEventHandler = (nid: number) => {
  return (e: React.MouseEvent) => {
    const note = assert(scope.map.notes.get(nid))
    switch (MappingState.tool) {
      case "delete":
        scope.map.removeNotes([note])
        break
      default: break
    }
    e.stopPropagation()
    e.preventDefault()
  }
}

const doubleClickHandler = (nid: number) => {
  return (e: React.MouseEvent) => {
    const note = assert(scope.map.notes.get(nid))
    if (note.type === "slide") {
      const s = assert(scope.map.slides.get(note.slide))
      if (note.id === s.notes[s.notes.length - 1])
        scope.map.toggleFlickend(s.id)
    } else {
      scope.map.toggleFlick(note)
    }
    e.stopPropagation()
    e.preventDefault()
  }
}

const contextMenuHandler = (nid: number) => {
  return (e: React.MouseEvent<HTMLImageElement>) => {
    const note = assert(scope.map.notes.get(nid))
    scope.map.removeNotes([note])
    e.stopPropagation()
    e.preventDefault()
  }
}

const Note = ({ note }: { note: NoteType }) => {

  const cn = useNoteStyles()

  const style = useObserver(() => {
    const left = (note.lane * 10 + 15) + "%"
    const bottom = (MappingState.timeHeightFactor * note.realtimecache) + "px"
    return { left, bottom }
  })

  const downHandler = useMemo(() => downEventHandler(note.id), [note.id])
  const ctxmenuHandler = useMemo(() => contextMenuHandler(note.id), [note.id])
  const doubleHandler = useMemo(() => doubleClickHandler(note.id), [note.id])
  const clickHandler = useMemo(() => clickEventHandler(note.id), [note.id])

  const props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> = {
    onMouseDown: downHandler,
    onTouchStart: downHandler,
    onContextMenu: ctxmenuHandler,
    onDoubleClick: doubleHandler,
    onClick: clickHandler,
    style, draggable: false,
    className: cn.note
  }

  switch (note.type) {
    case "single": return <img alt="Single" src={assets.note_normal} {...props} />
    case "flick": return <img alt="Flick" src={assets.note_flick} {...props} />
    case "slide":
      const slide = assert(scope.map.slides.get(note.slide))
      if (note.id === slide.notes[0]) {
        return <img alt="Slide start" src={assets.note_long} {...props} />
      } else if (note.id === slide.notes[slide.notes.length - 1]) {
        if (slide.flickend)
          return <img alt="Flick end" src={assets.note_flick} {...props} />
        else
          return <img alt="Slide end" src={assets.note_long} {...props} />
      } else {
        return <img alt="Slide mid" src={assets.note_slide_among} {...props} />
      }
    default: neverHappen()
  }
}

export default () => {

  const cn = useStyles()
  const layer = useMirror()

  useMapChange()
  return (
    <div className={cn.layer} ref={layer}>
      {scope.map.notelist.map(n => <Note key={n.id} note={n} />)}
    </div>)
}