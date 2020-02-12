import { TimepointActions } from "./Timepoint"
import { EditMap, Timepoint } from "../../EditMap"
import { randomId, neverHappen } from "../../../Common/utils"

describe("TimepointActions.Add", () => {

  it("inserted", () => {
    const map = EditMap.create()
    const tp: Timepoint = {
      id: randomId(), time: 0, bpm: 60, bpb: 4, ticktimecache: 0
    }
    tp.ticktimecache = 60 / tp.bpm / 96

    const res = TimepointActions.Add(map, tp.id, tp.time, tp.bpm, tp.bpb)

    expect(res).toBeInstanceOf(Function)
    expect(map.timepoints.length).toBe(1)
    const newtp = map.timepoints.find(x => x.id === tp.id)
    expect(newtp).toEqual(tp)
    expect(newtp).not.toBe(tp)
    expect(map.timepointsmap.size).toBe(1)
    expect(map.timepointsmap.get(tp.id)).toBe(newtp)
  })

  it("insertion reverted", () => {
    const map = EditMap.create()
    const id = randomId()
    const undo = TimepointActions.Add(map, id, 0, 60, 4)
    if (!undo) neverHappen()

    undo(map)

    expect(map.timepoints.length).toBe(0)
    expect(map.timepointsmap.size).toBe(0)
  })

  it("same time not inserted", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, randomId(), 0, 60, 4)

    const res = TimepointActions.Add(map, id, 0, 60, 4)

    expect(res).toBeUndefined()
    expect(map.timepoints.length).toBe(1)
    expect(map.timepoints.find(x => x.id === id)).toBeUndefined()
  })

  it.each([[[3, 2, 1]], [[1, 2, 3]]])
    ("ordered", (list) => {
      const map = EditMap.create()

      list.forEach(time => TimepointActions.Add(map, randomId(), time, 60, 4))

      list.sort().forEach((time, index) =>
        expect(map.timepoints[index].time).toBe(time))
    })

})

describe("RemoveTimepoint", () => {

  it("removed", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 1, 60, 4)
    TimepointActions.Add(map, randomId(), 0, 60, 4)
    TimepointActions.Add(map, randomId(), 2, 60, 4)

    const res = TimepointActions.Remove(map, id)

    expect(res).toBeInstanceOf(Function)
    expect(map.timepoints.length).toBe(2)
    expect(map.timepointsmap.size).toBe(2)
    expect(map.timepoints.find(x => x.id === id)).toBeUndefined()
    expect(map.timepointsmap.has(id)).toBe(false)
  })

  it("removement reverted", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 0, 60, 4)
    const undo = TimepointActions.Remove(map, id)
    if (!undo) neverHappen()

    undo(map)

    expect(map.timepoints.length).toBe(1)
    expect(map.timepointsmap.size).toBe(1)
    expect(map.timepoints[0].id).toBe(id)
  })
})

describe("SetTimepoint", () => {

  it("field set", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 0, 60, 4)

    const res = TimepointActions.SetSafe(map, id, 90, undefined)

    expect(res).toBeInstanceOf(Function)
    expect(map.timepoints[0].bpm).toBe(90)
  })

  it("field change reverted", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 0, 60, 4)
    const undo = TimepointActions.SetSafe(map, id, 90, undefined)
    if (!undo) neverHappen()

    undo(map)

    expect(map.timepoints[0].bpm).toBe(60)
  })

  it("field not set if not changed", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 0, 60, 4)

    const res = TimepointActions.SetSafe(map, id, 60, undefined)

    expect(res).toBeUndefined()
    expect(map.timepoints[0].bpm).toBe(60)
  })

  it("re-sorted if time changed", () => {
    const map = EditMap.create()
    TimepointActions.Add(map, randomId(), 1, 60, 4)
    TimepointActions.Add(map, randomId(), 2, 60, 4)
    const id = randomId()
    TimepointActions.Add(map, id, 3, 60, 4)

    const res = TimepointActions.SetBreaking(map, id, 0)

    expect(res).toBeInstanceOf(Function)
      ;[0, 1, 2].forEach((time, index) =>
        expect(map.timepoints[index].time).toBe(time))
  })

  it("not changed to a same time", () => {
    const map = EditMap.create()
    TimepointActions.Add(map, randomId(), 1, 60, 4)
    TimepointActions.Add(map, randomId(), 2, 60, 4)
    const id = randomId()
    TimepointActions.Add(map, id, 3, 60, 4)

    const res = TimepointActions.SetBreaking(map, id, 1)

    expect(res).toBeUndefined()
      ;[1, 2, 3].forEach((time, index) =>
        expect(map.timepoints[index].time).toBe(time))
  })

  it("ticktimecache updated after bpm changed", () => {
    const map = EditMap.create()
    const id = randomId()
    TimepointActions.Add(map, id, 1, 60, 4)

    const res = TimepointActions.SetSafe(map, id, 120, undefined)

    expect(res).toBeInstanceOf(Function)
    expect(map.timepoints[0].ticktimecache).toBe(60 / 120 / 96)
  })
})
