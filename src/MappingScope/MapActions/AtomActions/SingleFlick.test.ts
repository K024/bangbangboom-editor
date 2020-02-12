import { EditMap, SingleNote, Timepoint } from "../../EditMap"
import { TimepointActions } from "./Timepoint"
import { randomId, neverHappen } from "../../../Common/utils"
import { AddSingleFlick } from "./SingleFlick"

const getTestMap = (): [EditMap, number, Timepoint] => {
  const map = EditMap.create()
  const tpid = randomId()
  TimepointActions.Add(map, tpid, 0, 60, 4)
  return [map, tpid, map.timepoints[0]]
}

describe("AddSingleFlick", () => {

  it("inserted", () => {
    const [map, tpid, tp] = getTestMap()
    const id = randomId()
    const note: SingleNote =
      { type: "single", id, timepoint: tpid, offset: 1, lane: 0, realtimecache: 0 }
    note.realtimecache = tp.time + tp.ticktimecache * note.offset

    const res = AddSingleFlick(map, id, note.type, note.timepoint, note.offset, note.lane)

    expect(res).toBeInstanceOf(Function)
    expect(map.notes.length).toBe(1)
    const inserted = map.notes[0]
    expect(inserted).toEqual(note)
    expect(map.notesmap.size).toBe(1)
    expect(map.notesmap.get(id)).toBe(inserted)
  })

  it("insertion reverted", () => {
    const [map, tpid] = getTestMap()
    const id = randomId()
    const undo = AddSingleFlick(map, id, "single", tpid, 0, 0)
    if (!undo) neverHappen()

    undo(map)

    expect(map.notes.length).toBe(0)
    expect(map.notesmap.size).toBe(0)
  })
})