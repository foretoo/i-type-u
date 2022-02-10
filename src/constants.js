// import { clearCanvas, handleInput } from "./utils"

export const Y_SCALE = 1.25
export const GAP = 2
export const FONT_HEIGHT = 31
export const BASELINE = 0.8 * FONT_HEIGHT
export const CLEAR_COLOR = "#0000ff"



export const canvas = document.createElement("canvas")
canvas.id = "textureCanvas"

export const ctx = canvas.getContext("2d", { alpha: false })



export const input = document.createElement("input")
input.type = "text"
input.setAttribute("spellcheck", "false")
input.style.fontSize = `${FONT_HEIGHT}px`
input.style.width = `${ 50 / Math.sqrt(document.body.clientWidth / document.body.clientHeight) }%`
// input.oninput = (e) => {
//   clearCanvas(ctx, CLEAR_COLOR, canvas.width, canvas.height)
//   handleInput(e.target.value, span)
// }



// export const span = document.createElement("span")
// span.style.fontSize = `${FONT_HEIGHT}px`
// span.style.visibility = "hidden"
// span.style.whiteSpace = "pre"