import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './index.css'



//////// CANVAS ////////

const pd = window.devicePixelRatio
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 256 * pd
canvas.height = 320 * pd
canvas.style.cssText = `width: ${canvas.width / 2}px; height: ${canvas.height / 2}px;`
ctx.fillStyle = '#dddddd'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.font = '40px serif'
const texture = new THREE.CanvasTexture(canvas)



//////// INPUT ////////

let textInput = ''
const rect = { w: 0, h: 0 }
const input = document.createElement('input')
input.oninput = e => {
  textInput = e.target.value
  ctx.fillStyle = '#dddddd'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  rect.w = Math.abs(ctx.measureText(textInput).actualBoundingBoxLeft) + Math.abs(ctx.measureText(textInput).actualBoundingBoxRight)
  rect.h = ctx.measureText(textInput).fontBoundingBoxAscent + ctx.measureText(textInput).fontBoundingBoxDescent
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, rect.w, rect.h)
  ctx.fillStyle = 'blue'
  ctx.fillText(textInput, 0, ctx.measureText(textInput).fontBoundingBoxAscent)
  texture.needsUpdate = true
}



//////// THREE ////////

let time = 0
const [ width, height ] = [ document.documentElement.clientWidth, document.documentElement.clientHeight ]

const scene = new THREE.Scene();
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



document.body.appendChild( renderer.domElement )
document.body.appendChild( canvas )
document.body.appendChild( input )
render()
