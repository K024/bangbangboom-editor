import { EditMap, Timepoint } from "../MappingScope/EditMap"
import { entryList } from "../Common/utils"

type bdBpm = {
  type: "BPM"
  beat: number
  bpm: number
}

type bdNoteBase = {
  type: "Single" | "Slide" | "Long" | "Directional"
}

type bdSingleNote = bdNoteBase & {
  type: "Single"
  /**
   * bpm:      60          120 at 3
   * timeline: *---*---*---*-*-*-
   * beat:     0   1   2   3 4 5
   */
  beat: number
  /**
   * from 0 to 6
   */
  lane: number
  flick?: true
  skill?: true
}

type bdSlideNote = bdNoteBase & {
  type: "Slide"
  connections: Array<bdSingleNote>
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

function properBpmForSpan(time: number, preferred: number) {
  for (let bpm = 30; bpm <= 60000; bpm++) {
    const beattime = 60 / bpm
    const beats = time / beattime
    let beatcount = (beats + 0.5) | 0
    const diff = beats > beatcount ? beats - beatcount : beatcount - beats
    if (diff * beattime <= 1e-3) {
      if (preferred % bpm === 0) {
        const d = preferred / bpm
        bpm *= d
        beatcount *= d
      }
      return { bpm, beatcount }
    }
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

  {
    if (lasttp.bpm !== (lasttp.bpm | 0)) throw new Error("Can not have float point bpm")
    const res = properBpmForSpan(lasttp.time, lasttp.bpm)
    if (!res) throw new Error("Can not calculate bpm insertion")
    if (res.bpm === lasttp.bpm || res.beatcount <= 0) {
      bdmap.push({ type: "BPM", beat: 0, bpm: lasttp.bpm })
    } else {
      bdmap.push({ type: "BPM", beat: 0, bpm: res.bpm })
      bdmap.push({ type: "BPM", beat: res.beatcount, bpm: lasttp.bpm })
    }
    tpbasebeat = res.beatcount
    tpsPut.add(lasttp)
  }

  let inote = 0
  let lastnotebeat = tpbasebeat
  let bdslides: Record<number, bdSlideNote> = {}

  while (inote < notes.length) {
    const n = notes[inote++]
    const tp = map.timepoints.get(n.timepoint)
    if (!tp) throw new Error("Map may be corrupted")
    if (!tpsPut.has(tp)) {

      if (tp.bpm !== (tp.bpm | 0)) throw new Error("Can not have float point bpm")
      lastnotebeat = 0xfffff - ((0xfffff - lastnotebeat) | 0)
      const lasttime = (lastnotebeat - tpbasebeat) * lasttp.ticktimecache * 48 + lasttp.time

      const res = properBpmForSpan(tp.time - lasttime, tp.bpm)
      if (!res) throw new Error("Can not calculate bpm insertion")

      if (res.bpm === tp.bpm || res.beatcount <= 0) {
        tpbasebeat = lastnotebeat + res.beatcount
        bdmap.push({ type: "BPM", beat: tpbasebeat, bpm: tp.bpm })
      } else {
        tpbasebeat = lastnotebeat + res.beatcount
        bdmap.push({ type: "BPM", beat: lastnotebeat, bpm: res.bpm })
        bdmap.push({ type: "BPM", beat: tpbasebeat, bpm: tp.bpm })
      }

      lasttp = tp
      lastnotebeat = tpbasebeat
      tpsPut.add(tp)

    }
    if (lasttp !== tp) throw new Error("Map may be corrupted")

    const beat = tpbasebeat + n.offset / 48
    const lane = n.lane

    lastnotebeat = beat

    switch (n.type) {
      case "single":
        bdmap.push({ type: "Single", beat, lane  })
        break
      case "flick":
        bdmap.push({ type: "Single", beat, lane, flick: true })
        break
      case "slide":
        const sl = map.slides.get(n.slide)
        if (!sl) throw new Error("Map may be corrupted")
        if (!bdslides[sl.id]) bdslides[sl.id] = {
          type: "Slide", connections: []
        }
        const bdn: bdSingleNote = {
          type: "Single", beat, lane
        }
        if (sl.notes[sl.notes.length - 1] === n.id && sl.flickend) bdn.flick = true
        bdslides[sl.id].connections.push(bdn)
        if (sl.notes[sl.notes.length - 1] === n.id) {
          bdmap.push(bdslides[sl.id])
          delete bdslides[sl.id]
        }
        break
    }
  }
  return format(bdmap)
}

