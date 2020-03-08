import React, { useMemo } from "react"
import { NoteType } from "../../../../MappingScope/EditMap"
import { MappingState } from "../sharedState"
import { useStyles, useNoteStyles } from "./styles"
import assets from "../../../assets"
import { assert, neverHappen } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"
import { Music } from "../../../states"
import { useMirror, state } from "./state"
import { useObserver } from "mobx-react-lite"
import { action } from "mobx"

let dragPointer = -1
const downEventHandler = action((nid: number) => {
  return action((e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const note = assert(scope.map.notes.get(nid))
    if (dragPointer < 0) {
      if ("buttons" in e) {
        if (!(e.buttons & 3)) return
        dragPointer = e.button
      } else {
        dragPointer = e.changedTouches[0].identifier
      }
    }
    state.draggingNote = nid
    if (!e.ctrlKey && !state.selectedNotes.has(note.id))
      state.selectedNotes.clear()
    state.slideNote1Beat = undefined
  })
})

const handleUp = action((e: MouseEvent | TouchEvent) => {
  if ("buttons" in e) {
    if (e.button !== dragPointer) return
  } else {
    if (e.changedTouches[0].identifier !== dragPointer) return
  }
  dragPointer = -1
  if (state.draggingNote >= 0) {
    const note = assert(scope.map.notes.get(state.draggingNote))
    const draggingSelected = state.draggingSelected
    state.draggingNote = -1 // important: after get draggingselected !!!
    if (!state.pointerBeat) return
    if (state.pointerLane < 0) return
    const dt = state.pointerBeat.realtime - note.realtimecache
    const dl = state.pointerLane - note.lane
    if (!dt && !dl) return

    const before = new Set<number>()
    const copy = e.ctrlKey
    if (copy)
      for (const n of scope.map.notelist) before.add(n.id)

    if (draggingSelected) {
      if (copy)
        scope.map.copyMany(state.getSelectedNotes(), dt, 0, Music.duration, dl, MappingState.division)
      else
        scope.map.moveMany(state.getSelectedNotes(), dt, 0, Music.duration, dl, MappingState.division)
    } else {
      if (copy)
        scope.map.copyMany([note], dt, 0, Music.duration, dl, MappingState.division)
      else
        scope.map.moveMany([note], dt, 0, Music.duration, dl, MappingState.division)
    }

    setTimeout(action(() => {
      if (copy && scope.map.notes.size !== before.size) {
        state.selectedNotes.clear()
        for (const n of scope.map.notelist) {
          if (!before.has(n.id)) {
            state.selectedNotes.add(n.id)
          }
        }
      }
    }))

    state.preventClick++
    setTimeout(() => state.preventClick--, 50)
  }
})
window.addEventListener("mouseup", handleUp)
window.addEventListener("touchend", handleUp)

const removeNote = (note: NoteType) => {
  if (state.selectedNotes.has(note.id)) {
    scope.map.removeNotes(state.getSelectedNotes())
  } else {
    scope.map.removeNotes([note])
  }
}

const clickEventHandler = (nid: number) => {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // if (state.preventClick) return
    const note = assert(scope.map.notes.get(nid))
    if (e.ctrlKey) {
      if (state.selectedNotes.has(note.id)) state.selectedNotes.delete(note.id)
      else state.selectedNotes.add(note.id)
    } else {
      switch (MappingState.tool) {
        case "delete":
          removeNote(note)
          break
      }
    }
  }
}

const doubleClickHandler = (nid: number) => {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (state.preventClick) return
    const note = assert(scope.map.notes.get(nid))
    if (note.type === "slide") {
      const s = assert(scope.map.slides.get(note.slide))
      if (note.id === s.notes[s.notes.length - 1])
        scope.map.toggleFlickend(s.id)
    } else {
      scope.map.toggleFlick(note)
    }
  }
}

const contextMenuHandler = (nid: number) => {
  return (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (state.preventClick) return
    const note = assert(scope.map.notes.get(nid))
    removeNote(note)
  }
}

const Note = ({ note }: { note: NoteType }) => {

  const cn = useNoteStyles()

  const onMouseDown = useMemo(() => downEventHandler(note.id), [note.id])
  const onContextMenu = useMemo(() => contextMenuHandler(note.id), [note.id])
  const onDoubleClick = useMemo(() => doubleClickHandler(note.id), [note.id])
  const onClick = useMemo(() => clickEventHandler(note.id), [note.id])

  const props = useObserver(() => {
    const left = (note.lane * 10 + 15) + "%"
    const bottom = (MappingState.timeHeightFactor * note.realtimecache) + "px"
    let src: string
    const n = scope.map.notes.get(note.id)
    if (!n) {
      // something strange with mobx action
      return {}
    }
    switch (note.type) {
      case "single": src = assets.note_normal; break
      case "flick": src = assets.note_flick; break
      case "slide":
        const slide = assert(scope.map.slides.get(note.slide))
        if (note.id === slide.notes[0]) {
          src = assets.note_long
        } else if (note.id === slide.notes[slide.notes.length - 1]) {
          if (slide.flickend)
            src = assets.note_flick
          else
            src = assets.note_long
        } else {
          src = assets.note_slide_among
        }
        break
      default: neverHappen()
    }
    return {
      style: { left, bottom }, src,
      draggable: false, className: cn.note,
      onMouseDown, onContextMenu, onDoubleClick, onClick
    }
  })

  return <img alt="" {...props} />
}

const NotesLayer = () => {

  const cn = useStyles()
  const layer = useMirror()

  return useObserver(() =>
    <div className={cn.layer} ref={layer}>
      {scope.map.notelist.map(n => <Note key={n.id} note={n} />)}
    </div>)
}

export default NotesLayer