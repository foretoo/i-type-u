import {
  setup, view, Point, Size, Color, Segment, Path, PointText, Group,
} from "paper"
import { canvas, input } from "./constants"
import "./index.css"

// document.body.appendChild(span)
document.body.appendChild(input)
document.body.appendChild(canvas)
setup(canvas)


const radius = 8
const border = 6
const space  = "      "


view.viewSize = new Size(256, 256)
const background = new Path.Rectangle(0, 0, view.size.width, view.size.height)
background.fillColor = "#00f"


const rectGroup = new Group()
rectGroup.style = {
  fillColor: "white",
}
const textGroup = new Group()
textGroup.style = {
  fontFamily: "serif",
  fontSize:   20,
  leading:    24,
  fillColor:  "blue",
}


input.oninput = (e) => {
  handleContent(e.target.value, textGroup, border, space)
  setLabels(rectGroup, textGroup)
  view.requestUpdate()
}

const setLabels = (rectGroup, textGroup) => {
  rectGroup.removeChildren()
  textGroup.children.filter(t => t.isWord).forEach((word) => {
    const { x, y, width, height } = word.bounds
    rectGroup.addChild(new Path.Rectangle({
      point: [ x, y ],
      size:  [ width, height ],
      style: rectGroup.style
    }))
  })
}

const handleContent = (text, textGroup, border, space) => {
  textGroup.removeChildren()
  let [ onWord, onSpace ] = [ false, false ]
  text.split("").forEach(char => {
    if (char !== " ") {
      if (!onWord) {
        [ onWord, onSpace ] = [ true, false ]
        initTextPoint(char, textGroup, border, space)
      }
      else textGroup.lastChild.content += char
    }
    else {
      if (!onSpace) {
        [ onWord, onSpace ] = [ false, true ]
        initTextPoint(space, textGroup, border, space)
      }
      else textGroup.lastChild.content += space
    }
    if (textGroup.lastChild) {
      const { x, y, width, height } = textGroup.lastChild.bounds
      if (x + width + border * 2 > view.bounds.width) {
        textGroup.lastChild.replaceWith(new PointText({
          isWord: textGroup.lastChild.isWord,
          point: [ border, y + height * 2 - 6 ],
          content: textGroup.lastChild.content,
          style: textGroup.style
        }))
      }
    }
  })
}
const initTextPoint = (char, textGroup, border, space) => {
  let x, y, width, height, tx, ty
  if (textGroup.lastChild) {
    ({ x, y, width, height } = textGroup.lastChild.bounds)
    tx = x + width  
    ty = y + height - 6 // textGroup.style.leading === 20 -> 5, 24 -> 6
  }
  else {
    tx = border
    ty = border + 18 // textGroup.style.leading === 20 -> 15, 24 -> 18
  }
  textGroup.addChild(new PointText({
    isWord: char !== space,
    point: [ tx, ty ],
    content: char,
    style: textGroup.style,
  }))
}



const setRect = (rect, text, radius) => {
  // rect.remove()
  // rect.set(Path.Rectangle({
  //   parent: rectGroup,
  //   point: [ text.x, text.y ],
  //   size:  [ text.width, text.height ],
  //   radius,
  //   style: rectGroup.style,
  // }))
  const { x, y, width: w, height: h } = text
  let r = radius
  if (w < r * 2) r = w / 2
  const k = 0.55228475 * r

  rect.segments = rect.segments.map((_, i) => {
    if      (i === 0) return setSeg(x + r,     y + h,     "out", "x", -k)
    else if (i === 1) return setSeg(x,         y + h - r, "in",  "y",  k)
    else if (i === 2) return setSeg(x,         y + r,     "out", "y", -k)
    else if (i === 3) return setSeg(x + r,     y,         "in",  "x", -k)
    else if (i === 4) return setSeg(x + w - r, y,         "out", "x",  k)
    else if (i === 5) return setSeg(x + w,     y + r,     "in",  "y", -k)
    else if (i === 6) return setSeg(x + w,     y + h - r, "out", "y",  k)
    else if (i === 7) return setSeg(x + w - r, y + h,     "in",  "x",  k)
  })
}

const setSeg = (x, y, dir, axis, k) => (
  new Segment({
    point:    [ x, y ],
    handleIn: dir === "in" ?
        axis === "x" ? [ k, 0 ] : [ 0, k ]
      : null,
    handleOut: dir === "out" ?
        axis === "x" ? [ k, 0 ] : [ 0, k ]
      : null,
  })
)