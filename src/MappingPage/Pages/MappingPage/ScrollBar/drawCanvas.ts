import { MappingState, GridD1 } from "../sharedState"
import { range, TimeToString, assert } from "../../../../Common/utils"
import { scope } from "../../../../MappingScope/scope"
import { NoteType } from "../../../../MappingScope/EditMap"

export const barTimeHeightFactor = 30

const getX = (lane: number) => lane * 10 + 15
const getY = (time: number) => (MappingState.paddedDuration - time) * barTimeHeightFactor


function drawLine(ctx: CanvasRenderingContext2D, xfrom: number, xto: number, y: number) {
  ctx.beginPath()
  ctx.moveTo(xfrom, y)
  ctx.lineTo(xto, y)
  ctx.stroke()
}
function drawBar(ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
  ctx.beginPath()
  ctx.lineTo(fromx, fromy)
  ctx.lineTo(fromx + 10, fromy)
  ctx.lineTo(tox + 10, toy)
  ctx.lineTo(tox, toy)
  ctx.fill()
}
function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.lineTo(x, y)
  ctx.lineTo(x + 5, y + 3)
  ctx.lineTo(x + 10, y)
  ctx.lineTo(x + 5, y - 3)
  ctx.fill()
}
function drawOval(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.lineTo(x, y)
  ctx.arcTo(x + 5, y + 5, x + 10, y, 7)
  ctx.arcTo(x + 5, y - 5, x, y, 7)
  ctx.fill()
}

export const drawScrollBar = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const timelist = range(0, MappingState.paddedDuration, 2)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = "12px"
  ctx.lineWidth = 1

  ctx.strokeStyle = "gray"
  for (const t of GridD1()) {
    drawLine(ctx, 15, 85, getY(t.time))
  }

  ctx.fillStyle = "aquamarine"
  ctx.strokeStyle = "aquamarine"
  for (const t of scope.map.timepointlist) {
    const y = getY(t.time)
    drawLine(ctx, 0, 100, y)
    ctx.fillText(t.bpm + "", 80, y - 3)
  }

  ctx.fillStyle = "white"
  for (const t of timelist) {
    ctx.fillText(TimeToString(t).split(".")[0], 0, getY(t) - 3)
  }

  ctx.fillStyle = "rgb(173,255,47,0.2)"
  for (const s of scope.map.slidelist) {
    let from = assert(scope.map.notes.get(s.notes[0]))
    let to: NoteType
    for (let i = 1; i < s.notes.length; i++) {
      to = assert(scope.map.notes.get(s.notes[i]))
      drawBar(ctx, getX(from.lane), getY(from.realtimecache), getX(to.lane), getY(to.realtimecache))
      from = to
    }
  }

  for (const n of scope.map.notelist) {
    switch (n.type) {
      case "single":
        ctx.fillStyle = "rgba(21,224,225)"
        drawOval(ctx, getX(n.lane), getY(n.realtimecache))
        break
      case "flick":
        ctx.fillStyle = "rgba(255,59,114)"
        drawDiamond(ctx, getX(n.lane), getY(n.realtimecache))
        break
      case "slide":
        const slide = assert(scope.map.slides.get(n.slide))
        ctx.fillStyle = "rgba(1,219,1)"
        if (n.id === slide.notes[0]) {
          drawOval(ctx, getX(n.lane), getY(n.realtimecache))
        } else if (n.id === slide.notes[slide.notes.length - 1]) {
          if (slide.flickend) {
            ctx.fillStyle = "rgba(255,59,114)"
            drawDiamond(ctx, getX(n.lane), getY(n.realtimecache))
          } else {
            drawOval(ctx, getX(n.lane), getY(n.realtimecache))
          }
        } else {
          ctx.strokeStyle = "rgba(1,219,1)"
          ctx.lineWidth = 2
          const x = getX(n.lane)
          drawLine(ctx, x, x + 10, getY(n.realtimecache))
        }
        break
    }
  }
}