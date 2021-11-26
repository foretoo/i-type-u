import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import './index.css'
import image from '../assets/bernoulli.png'



let time = 0
const [ width, height ] = [ document.documentElement.clientWidth, document.documentElement.clientHeight ]

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, width / height, 0.01, 100 )
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setSize( width, height )
window.root.appendChild( renderer.domElement )



const geometry = new THREE.PlaneBufferGeometry( 1,1.25, 120,150 )
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    bernoulli: { value: new THREE.TextureLoader().load(image)}
  },
  fragmentShader: fragment,
  vertexShader: vertex
})
const obj = new THREE.Mesh( geometry, material )
scene.add( obj )



function render() {
  time = performance.now() / 1000
  obj.rotation.x = (Math.sin(time) - 15) / 14
  material.uniforms.time.value = time
  renderer.render( scene, camera )
  requestAnimationFrame( render )
}



render()
