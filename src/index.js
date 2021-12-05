import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './index.css'



//////// CANVAS ////////

const canvas = document.createElement('canvas')
canvas.style.visibility = 'hidden'
const ctx = canvas.getContext('2d')
const clearColor = '#0000ff'
canvas.width = 256 * 2
canvas.height = 320 * 2
canvas.style.cssText = `width: ${canvas.width / 2}px; height: ${canvas.height / 2}px;`
clearCanvas(ctx, clearColor, canvas.width, canvas.height)
const fontHeight = 40
const baseline = 0.8 * fontHeight
ctx.font = `${fontHeight}px serif`
const texture = new THREE.CanvasTexture(canvas)



//////// INPUT ////////

const input = document.createElement('input')
const span = document.createElement('span')
span.style.fontSize = `${fontHeight}px`
span.style.visibility = 'hidden'
span.style.whiteSpace = 'pre'

input.oninput = e => {

  clearCanvas(ctx, clearColor, canvas.width, canvas.height)

  const value = span.textContent = e.target.value
  const data = [{ text: '', top: 0, left: 0, width: 0, height: span.offsetHeight }]
  span.textContent = ''
  let w = 0

  for (let i = 0; i < value.length; i++) {

    span.textContent += value[i]

    if (span.offsetWidth > canvas.width) {

      span.textContent = data[w].text
      data[w].width = span.offsetWidth
      span.textContent = value[i]

      data.push({
        text: value[i] === ' ' ? '' : value[i],
        top: data[w].top + span.offsetHeight,
        left: value[i] === ' ' ? span.offsetWidth : 0,
        width: value[i] === ' ' ? 0 : span.offsetWidth,
        height: span.offsetHeight
      })
      w++
    }
    else {

      if (value[i] === ' ') {
        data.push({
          text: '',
          top: data[w].top,
          left: span.offsetWidth,
          width: 0,
          height: span.offsetHeight
        })
        w++
      }
      else {
        data[w].text += value[i]
        data[w].width = span.offsetWidth - data[w].left
      }
    }

  }

  drawText(ctx, data)
  texture.needsUpdate = true
}
function clearCanvas(ctx, color, width, height) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}
function drawText(ctx, data = []) {
  data.forEach(word => {
    const { text, top, left, width, height } = word
    ctx.fillStyle = 'white'
    ctx.fillRect(left, top, width, height)
    ctx.fillStyle = 'blue'
    ctx.fillText(text, left, baseline + top)
  })
}



//////// THREE ////////

let time = 0
const [ width, height ] = [ document.body.clientWidth, document.body.clientHeight ]

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
const camera = new THREE.PerspectiveCamera( 50, width / height, 0.01, 100 )
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( width, height )

const geometry = new THREE.PlaneBufferGeometry( 1,1.25, 120,150 )
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    image: { value: texture }
  },
  fragmentShader: fragment,
  vertexShader: vertex
})
const obj = new THREE.Mesh( geometry, material )
scene.add( obj )

function render() {
  time = performance.now() / 1000
  obj.rotation.x = (Math.sin(time) - 11) / 13
  material.uniforms.time.value = time
  renderer.render( scene, camera )
  requestAnimationFrame( render )
}



document.body.appendChild( span )
document.body.appendChild( canvas )
document.body.appendChild( renderer.domElement )
document.body.appendChild( input )
render()
