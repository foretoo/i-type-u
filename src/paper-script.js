import { setup, view, Size, Path, PointText, Group } from "paper"
import { Y_SCALE, IPSUM, INVERT, radius, border, padding, space } from "./constants"

const textureCanvas = document.createElement("canvas")
// textureCanvas.style.zIndex = 1
document.body.appendChild(textureCanvas)
setup(textureCanvas)
view.viewSize = new Size(256, 256)
const background = new Path.Rectangle({
  point: [ 0, 0 ],
  size:  [ view.size.width, view.size.height ],
  fillColor: "blue",
})
// const bgGroup = new Group()
// bgGroup.addChild(new Path.Rectangle({
//   point: [ 0, 0 ],
//   size:  [ view.size.width, view.size.height / 2 ],
//   fillColor: "yellow",
// }))
// bgGroup.addChild(new Path.Rectangle({
//   point: [ 0, view.size.height / 2 ],
//   size:  [ view.size.width, view.size.height ],
//   fillColor: "blue",
// }))
view.update()



const rectGroup = new Group()
rectGroup.style = {
  fillColor: "yellow",
}
rectGroup.applyMatrix = false
rectGroup.scale(1, 1 / Y_SCALE)

const textGroup = new Group()
textGroup.style = {
  fontFamily: "serif",
  fontSize:   20,
  leading:    24,
  fillColor:  INVERT ? "yellow" : "blue",
}
textGroup.applyMatrix = false
textGroup.scale(1, 1 / Y_SCALE)



const updateTexture = (text) => {
  handleContent(text, textGroup, border, padding, space, INVERT)
  setLabels(rectGroup, textGroup, padding, radius, INVERT)
  view.update()
}



const setLabels = (rectGroup, textGroup, padding, radius, invert) => {
  rectGroup.removeChildren()
  const words = textGroup.children.filter((t) => invert ? !t.isWord : t.isWord)
  const temp  = new Group({ insert: false })
  const _padding = invert ? { h: -padding.h, v: -padding.v } : padding

  rectGroup.addChild(words.reduce((union, word, i) => {
    const { x, y, width, height } = word.bounds
    temp.addChild(new Path.Rectangle({
      point: [ x - _padding.h, y - _padding.v ],
      size:  [ width + _padding.h * 2, height + _padding.v * 2 ],
      style: rectGroup.style,
    }))
    if (!i) return temp.lastChild
    return temp.lastChild.unite(union)
  }, null))

  temp.removeChildren()
  rectGroup.lastChild && roundRectPath(rectGroup.lastChild, radius)
}

const roundRectPath = (path, radius) => {
  if (path.className === "CompoundPath") {
    path.children.forEach((child) => roundRectPath(child, radius))
    return
  }

  const segments = path.segments.slice(0)
  path.segments = []

  for (let i = 0, l = segments.length; i < l; i++) {
    const curPoint = segments[i].point
    const nextPoint = segments[i + 1 == l ? 0     : i + 1].point
    const prevPoint = segments[i - 1 < 0  ? l - 1 : i - 1].point
    const nextDelta = curPoint.subtract(nextPoint)
    const prevDelta = curPoint.subtract(prevPoint)

    if (nextDelta.length < radius * 2) nextDelta.length /= 2
    else nextDelta.length = radius
    if (prevDelta.length < radius * 2) prevDelta.length /= 2
    else prevDelta.length = radius

    path.add({
      point:     curPoint.subtract(prevDelta),
      handleOut: prevDelta.multiply(0.5522),
    })
    path.add({
      point:    curPoint.subtract(nextDelta),
      handleIn: nextDelta.multiply(0.5522),
    })
  }
  path.closed = true
}

const handleContent = (text, textGroup, border, padding, space, invert) => {
  textGroup.removeChildren()
  let [ onWord, onSpace ] = [ false, false ]
  const _padding = invert ? { h: 0, v: 0 } : padding
  text.split("").forEach((char) => {

    if (char !== " ")
      if (!onWord) {
        [ onWord, onSpace ] = [ true, false ]
        initTextPoint(char, textGroup, border, _padding, space)
      }
      else textGroup.lastChild.content += char
    else
    if (!onSpace) {
      [ onWord, onSpace ] = [ false, true ]
      initTextPoint(space, textGroup, border, _padding, space)
    }
    else textGroup.lastChild.content += space

    if (textGroup.lastChild) {
      const { x, y, width, height } = textGroup.lastChild.bounds
      if (x + width + _padding.h > view.bounds.width - border) {
        textGroup.lastChild.replaceWith(new PointText({
          isWord:  textGroup.lastChild.isWord,
          point:   [ border + _padding.h, y + height * 2 - 6 ],
          content: textGroup.lastChild.content,
          style:   textGroup.style,
        }))
      }
    }
  })
}

const initTextPoint = (char, textGroup, border, padding, space) => {
  let x, y, width, height, tx, ty
  if (textGroup.lastChild) {
    ({ x, y, width, height } = textGroup.lastChild.bounds)
    tx = x + width
    ty = y + height - 6.1 // textGroup.style.leading === 20 -> 5, 24 -> 6
  }
  else {
    tx = border + padding.h
    ty = border + padding.v + 18 // textGroup.style.leading === 20 -> 15, 24 -> 18
  }
  textGroup.addChild(new PointText({
    isWord:  char !== space,
    point:   [ tx, ty ],
    content: char,
    style:   textGroup.style,
  }))
}

export { textureCanvas, updateTexture }

updateTexture(IPSUM)