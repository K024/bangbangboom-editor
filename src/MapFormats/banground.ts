
/** [ a, b, c ] => a + b / c */
type bgBeat = [number, number, number]

type bgBPM = {
  type: "BPM"
  beat: [0, 0, 1]
  value: number
}

type bgNote = {
  type: "Single" | "Flick" | "SlideTick" | "SlideTickEnd"
  beat: bgBeat
  /** from 0 => 6 */
  lane: number
  tickStack?: number
}

type bgMap = {
  difficulty: string
  level: number
  /** in ms */
  offset: number
  notes: (bgNote | bgBPM)[]
}

export function toBangroundFormat() {

}
