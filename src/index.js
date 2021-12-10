import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './index.css'

const scaleY = 1.25



//////// CANVAS ////////

const canvas = document.createElement('canvas')
canvas.style.visibility = 'hidden'
const ctx = canvas.getContext('2d', { alpha: false })
const clearColor = '#0000ff'
canvas.width = 256
canvas.height = 256
clearCanvas(ctx, clearColor, canvas.width, canvas.height)
const fontHeight = 31
const baseline = 0.8 * fontHeight
ctx.font = `${fontHeight}px serif`
const texture = new THREE.CanvasTexture(canvas)



//////// INPUT ////////

const input = document.createElement('input')
input.type = 'text'
input.style.fontSize = `${fontHeight}px`
input.style.width = `${ 50 / Math.sqrt(document.body.clientWidth / document.body.clientHeight) }%`
const span = document.createElement('span')
span.style.fontSize = `${fontHeight}px`
span.style.visibility = 'hidden'
span.style.whiteSpace = 'pre'

input.oninput = e => {
  clearCanvas(ctx, clearColor, canvas.width, canvas.height)
  handleInput(e.target.value)
}

function handleInput(text) {
  span.textContent = text
  const data = [{ text: '', top: 0, left: 0, width: 0, height: span.offsetHeight }]
  span.textContent = ''
  let w = 0
  for (let i = 0; i < text.length; i++) {
    span.textContent += text[i]
    if (span.offsetWidth > canvas.width / scaleY) {
      span.textContent = data[w].text
      data[w].width = span.offsetWidth
      span.textContent = text[i]
      data.push({
        text: text[i] === ' ' ? '' : text[i],
        top: data[w].top + span.offsetHeight,
        left: text[i] === ' ' ? span.offsetWidth : 0,
        width: text[i] === ' ' ? 0 : span.offsetWidth,
        height: span.offsetHeight
      })
      w++
    }
    else {
      if (text[i] === ' ') {
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
        data[w].text += text[i]
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
    ctx.scale(scaleY, 1)
    ctx.fillStyle = 'white'
    ctx.fillRect(left, top, width, height)
    ctx.fillStyle = 'blue'
    ctx.fillText(text, left, baseline + top)
    ctx.scale(1 / scaleY, 1)
  })
}



//////// THREE ////////

let time = 0
const timeStartPoint = Math.random() * 100
const [ width, height ] = [ document.body.clientWidth, document.body.clientHeight ]

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
const camera = new THREE.PerspectiveCamera( 50, width / height, 0.01, 100 )
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( width, height )

const controls = new OrbitControls( camera, renderer.domElement )
controls.update()

texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

const geometry = new THREE.PlaneBufferGeometry( 1, scaleY, 120, 120 * scaleY )
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    image: { value: texture }
  },
  fragmentShader: fragment,
  vertexShader: vertex,
  side: THREE.DoubleSide
})
const obj = new THREE.Mesh( geometry, material )
scene.add( obj )

function render() {
  time = performance.now() / 1000 + timeStartPoint
  obj.rotation.x = (Math.sin(time) - 11) / 13
  material.uniforms.time.value = time
  controls.update()
  renderer.render( scene, camera )
  input.style.filter = document.activeElement === input ? `blur(${Math.random()*1.618+2}px)` : `blur(2px)`
  requestAnimationFrame( render )
}



document.body.appendChild( span )
document.body.appendChild( canvas )
document.body.appendChild( renderer.domElement )
document.body.appendChild( input )
render()
handleInput('asdfa sdfa         sdflkjh      sdflkjh lkjh lkajshdf     asdf ')
