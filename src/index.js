import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './index.css'
import image from '../assets/bernoulli.png'


const pd = window.devicePixelRatio
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 128 * pd
canvas.height = 160 * pd
canvas.style.cssText = `width: ${canvas.width / pd}px; height: ${canvas.height / pd}px;`
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.font = '20px serif'
const texture = new THREE.CanvasTexture(canvas)


let textInput = ''
const input = document.createElement('input')
input.oninput = e => {
  textInput = e.target.value
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'blue'
  ctx.fillText(textInput, 0, 24)
  texture.needsUpdate = true
}


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


document.body.appendChild( renderer.domElement )
document.body.appendChild( canvas )
document.body.appendChild( input )


function render() {
  time = performance.now() / 1000
  obj.rotation.x = (Math.sin(time) - 11) / 13
  material.uniforms.time.value = time
  renderer.render( scene, camera )
  requestAnimationFrame( render )
}



render()
