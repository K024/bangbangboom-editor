import { EditMap, Timepoint } from "../MappingScope/EditMap"
import { entryList } from "../Common/utils"

type bdBpm = {
  type: "System"
  cmd: "BPM"
  beat: number
  bpm: number
}

type bdNoteBase = {
  type: "Note"
  /**
   * bpm:      60          120 at 3
   * timeline: *---*---*---*-*-*-
   * beat:     0   1   2   3 4 5
   */
  beat: number
  /**
   * from 1 to 7
   */
  lane: number
}

type bdSingleNote = bdNoteBase & {
  note: "Single"
  flick?: true
  skill?: true
}

type bdSlideNote = bdNoteBase & {
  note: "Slide"
  pos: "A" | "B"
  start?: true
  end?: true
  flick?: true
  skill?: true
}

type bdMapItem = bdBpm | bdSingleNote | bdSlideNote

type bdMap = bdMapItem[]

function format(map: bdMap) {
  const strb: string[] = []
  strb.push("[")
  for (let i = 0; i < map.length; i++) {
    const item = map[i]
    strb.push(JSON.stringify(item))
    if (i !== map.length - 1) strb.push(",\n")
  }
  strb.push("]")
  return strb.join("")
}

function slideScope() {

  let a: number | null = null
  let b: number | null = null

  return {
    start(id: number) {
      if (a === null) {
        a = id
        return "A"
      }
      if (b === null) {
        b = id
        return "B"
      }
      throw new Error("Can not use 3 slides at same time")
    },
    mid(id: number) {
      if (a === id) return "A"
      if (b === id) return "B"
      throw new Error("Map may corrupted")
    },
    end(id: number) {
      if (a === id) {
        a = null
        return "A"
      }
      if (b === id) {
        b = null
        return "B"
      }
      throw new Error("Map may corrupted")
    }
  }
}

function magic(basebeat: number, lasttptime: number, lasttpbpm: number, lastnotebeat: number, nexttptime: number) {
  const dt = nexttptime - lasttptime
  const beattime = 60 / lasttpbpm
  const beatsofffloat = dt / beattime
  const beatsoff = Math.round(beatsofffloat)
  if (Math.abs((beatsofffloat - beatsoff) * beattime) <= 1e-3) {
    return {
      insert: false as false,
      nexttpbeat: basebeat + beatsoff
    }
  }
  let properbeat = 0
  while (properbeat < lastnotebeat) properbeat++
  if (properbeat > beatsofffloat) throw new Error("Map may corrutp")

  const ndt = nexttptime - lasttptime - beattime * properbeat
  const nbeattime = ndt / (beatsoff - properbeat)
  const nbpm = 60 / nbeattime

  return {
    insert: true as true,
    insertat: basebeat + properbeat,
    insertbpm: nbpm,
    nexttpbeat: basebeat + beatsoff
  }
}

export function toBestdoriFormat(map: EditMap) {
  const tps = entryList(map.timepoints).map(x => x[1]).sort((a, b) => a.time - b.time)
  if (tps.length <= 0) return "[]"

  const tpsPut = new Set<Timepoint>()

  const notes = entryList(map.notes).map(x => x[1]).sort((a, b) => {
    const dt = a.realtimecache - b.realtimecache
    if (dt) return dt
    return a.lane - b.lane
  })

  const bdmap: bdMap = []

  let lasttp = tps[0]
  let tpbasebeat = 0

  if (tps[0].time !== 0) {
    const res = magic(0, 0, tps[0].bpm, 0, tps[0].time)
    if (res.insert) {
      bdmap.push({
        type: "System", cmd: "BPM", beat: 0, bpm: res.insertbpm
      })
      bdmap.push({
        type: "System", cmd: "BPM", beat: res.nexttpbeat, bpm: tps[0].bpm
      })
    } else {
      bdmap.push({
        type: "System", cmd: "BPM", beat: 0, bpm: tps[0].bpm
      })
    }
    tpbasebeat = res.nexttpbeat
    tpsPut.add(tps[0])
  }

  let inote = 0
  let lastnotebeat = 0

  const scope = slideScope()

  while (inote < notes.length) {
    const n = notes[inote]
    const tp = map.timepoints.get(n.timepoint)
    if (!tp) throw new Error("Map may corrupted")
    if (!tpsPut.has(tp)) {

      const res = magic(tpbasebeat, lasttp.time, lasttp.bpm, lastnotebeat, tp.time)

      if (res.insert) {
        bdmap.push({
          type: "System", cmd: "BPM", beat: res.insertat, bpm: res.insertbpm
        })
      }
      bdmap.push({
        type: "System", cmd: "BPM", beat: res.nexttpbeat, bpm: tp.bpm
      })

      lasttp = tp
      tpbasebeat = res.nexttpbeat

    } else {
      if (lasttp !== tp) throw new Error("Map may corrupted")

      const base: bdNoteBase = {
        type: "Note",
        beat: tpbasebeat + n.offset / 48,
        lane: n.lane + 1
      }

      lastnotebeat = base.beat

      switch (n.type) {
        case "single":
          bdmap.push({
            ...base,
            note: "Single",
          })
          break
        case "flick":
          bdmap.push({
            ...base,
            note: "Single",
            flick: true
          })
          break
        case "slide":
          const sl = map.slides.get(n.slide)
          if (!sl) throw new Error("Map may corrupted")
          const bdn: bdSlideNote = {
            ...base, note: "Slide", pos: "A"
          }
          if (sl.notes[0] === n.id) {
            bdn.start = true
            bdn.pos = scope.start(sl.id)
          }
          else if (sl.notes[sl.notes.length - 1] === n.id) {
            bdn.end = true
            bdn.pos = scope.end(sl.id)
            if (sl.flickend) bdn.flick = true
          } else {
            bdn.pos = scope.mid(sl.id)
          }
          bdmap.push(bdn)
          break
      }


    }
  }


  return format(bdmap)
}

