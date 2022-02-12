import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fragment from "./shaders/fragment.glsl"
import vertex from "./shaders/vertex.glsl"
import { textureCanvas } from "./paper-script"

const Y_SCALE = 1.25

let time = 0
const timeStartPoint = Math.random() * 100
const [ width, height ] = [ document.body.clientWidth, document.body.clientHeight ]

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xcccccc )
const camera = new THREE.PerspectiveCamera( 50, width / height, 0.01, 100 )
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize( width, height )
document.body.appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement )
controls.update()

const texture = new THREE.CanvasTexture(textureCanvas)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

const geometry = new THREE.PlaneBufferGeometry( 1, Y_SCALE, 120, 120 * Y_SCALE )
const material = new THREE.ShaderMaterial({
  uniforms: {
    time:  { value: 0 },
    image: { value: texture },
  },
  fragmentShader: fragment,
  vertexShader:   vertex,
  side:           THREE.DoubleSide,
})
const obj = new THREE.Mesh( geometry, material )
obj.position.y = 0.2
obj.position.z = -2
scene.add( obj )

function render() {
  time = performance.now() / 1000 + timeStartPoint
  obj.rotation.x = (Math.sin(time) - 7) / 13
  material.uniforms.time.value = time
  controls.update()
  renderer.render( scene, camera )
  // input.style.filter = document.activeElement === input ? `blur(${Math.random()*1.618+2}px)` : `blur(2px)`
  requestAnimationFrame( render )
}
render()

export { texture }