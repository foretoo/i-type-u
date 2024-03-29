import { updateTexture } from "./paper-script"
import { texture } from "./three-script"
import { IPSUM } from "./constants"
import "./index.css"



const input = document.createElement("input")
input.type = "text"
input.setAttribute("spellcheck", "false")
input.style.width = `${ 50 / Math.sqrt(document.body.clientWidth / document.body.clientHeight) }%`
input.value = IPSUM
document.body.appendChild(input)

input.oninput = (e) => {
  updateTexture(e.target.value)
  texture.needsUpdate = true
}