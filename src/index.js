import * as THREE from 'three'
// import { Scene } from 'three/src/scenes/Scene'
// import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
// import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
// import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
// import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
// import { Mesh } from 'three/src/objects/Mesh'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import image from '../assets/cloud1.jpg'

export default class Sketch {
  constructor(options) {
    this.time = 0
    this.container = options.dom
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 0.01, 100 );
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize( this.width, this.height )
    this.container.appendChild( this.renderer.domElement )
    // this.controls = new OrbitControls( this.camera, this.renderer.domElement )
    // this.controls.enablePan = false

    this.setupResize()
    this.addObjects()
    this.render()
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize( this.width, this.height )
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry( 1,1.25, 120,150 )
    // this.geometry = new THREE.SphereBufferGeometry( 1, 144,144 )

    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cloudTexture: { value: new THREE.TextureLoader().load(image)}
      },
      side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      wireframe: false
    })

    this.obj = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.obj );
  }

  render() {
    // this.obj.rotation.x = -Math.PI/4
  	// this.obj.rotation.y += 0.01;

    this.time = performance.now()/1000
    this.material.uniforms.time.value = this.time

    this.renderer.render( this.scene, this.camera );
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch({
  dom: document.getElementById('root')
})
