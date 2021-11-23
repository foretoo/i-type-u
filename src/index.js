import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'



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
    time: { value: 0 }
  },
  fragmentShader: fragment,
  vertexShader: vertex
})
const obj = new THREE.Mesh( geometry, material )
scene.add( obj );



function render() {
  material.uniforms.time.value = performance.now() / 1000
  renderer.render( scene, camera )
  requestAnimationFrame( render )
}



render()
