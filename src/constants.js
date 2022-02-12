export const Y_SCALE = 1.25

export const canvas = document.createElement("canvas")
canvas.id = "textureCanvas"

export const ctx = canvas.getContext("2d", { alpha: false })

export const input = document.createElement("input")
input.type = "text"
input.setAttribute("spellcheck", "false")
input.style.width = `${ 50 / Math.sqrt(document.body.clientWidth / document.body.clientHeight) }%`
