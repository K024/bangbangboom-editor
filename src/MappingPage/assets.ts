
const assets = {
  note_flick: "/assets/mapping/note_flick.png",
  note_long: "/assets/mapping/note_long.png",
  note_normal: "/assets/mapping/note_normal.png",
  note_slide_among: "/assets/mapping/note_slide_among.png",
  timing_tack: "/assets/mapping/timing_tack.wav",
  timing_tick: "/assets/mapping/timing_tick.wav",
  perfect: "/assets/mapping/perfect.mp3",
  flick: "/assets/mapping/flick.mp3",
  long: "/assets/mapping/long.mp3",
}

for (const k in assets) {
  assets[(k as keyof typeof assets)] = process.env.PUBLIC_URL + assets[(k as keyof typeof assets)]
}

export default assets

