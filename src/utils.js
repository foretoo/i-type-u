import { Y_SCALE, GAP, BASELINE } from "./constants"




export function handleInput(text, canvas, ctx, span) {
  const {
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
  } = ctx.measureText(text)
  span.textContent = text
  const data = [{ text: "", top: GAP, left: GAP, width: 0, height: span.offsetHeight }]
  span.textContent = ""
  let w = 0
  for (let i = 0; i < text.length; i++) {
    span.textContent += text[i]
    if (span.offsetWidth > canvas.width / Y_SCALE) {
      span.textContent = data[w].text
      data[w].width = span.offsetWidth
      span.textContent = text[i]
      data.push({
        text:   text[i] === " " ? "" : text[i],
        top:    data[w].top + span.offsetHeight * 2 > canvas.height ? GAP : data[w].top + span.offsetHeight + GAP,
        left:   text[i] === " " ? span.offsetWidth : GAP,
        width:  text[i] === " " ? 0 : span.offsetWidth,
        height: span.offsetHeight,
      })
      w++
    }
    else {
      if (text[i] === " ") {
        data.push({
          text:   "",
          top:    data[w].top,
          left:   span.offsetWidth,
          width:  0,
          height: span.offsetHeight,
        })
        w++
      }
      else {
        data[w].text += text[i]
        data[w].width = span.offsetWidth - data[w].left
      }
    }
  }
  drawText(ctx, data)
  // texture.needsUpdate = true 
}

export function clearCanvas(ctx, color, width, height) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

export function drawText(ctx, data = []) {
  data.forEach((word) => {
    const { text, top, left, width, height } = word
    ctx.scale(Y_SCALE, 1)
    ctx.fillStyle = "white"
    roundRect(ctx, left, top, width, height, 5)
    ctx.fill()
    ctx.fillStyle = "blue"
    ctx.fillText(text, left, BASELINE + top)
    ctx.scale(1 / Y_SCALE, 1)
  })
}

export function roundRect(ctx, x, y, w, h, r) {
  const minLength = Math.min(w, h)
  if (minLength < 2 * r) r = minLength / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}