import './style.css';
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { Box } from './objects/box';
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { TextureTest } from './objects/TextureTest';
import { Paralax } from './objects/Paralax';
import { ImageGrid } from './objects/ImageGrid';
import { Bounce } from './objects/Bounce';
import { Band } from './objects/Band';
import { transition } from './objects/transitions';

const doubleLarp = (OldMin, OldMax, NewMin, NewMax, OldValue) => {
  let OldRange = (OldMax - OldMin)
  let NewRange = (NewMax - NewMin)
  let NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
  return NewValue
}

// --- Imports
const mainCanvas = document.getElementById('bg')

// --- Values

// --- main setup
const mainScene = new THREE.Scene()
// 0xe15151c
let campos = new Vector3(-2, 3, 4)
let tarpos = new Vector3(0,0,0)
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x555555,campos,tarpos)//reder canvas ,bg color, camera position,control target

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)
// const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// composer.addPass(gammaCorrectionPass)

// create blobs
// mainScene.add(Box());

let ig = ImageGrid(mainScene)
// TextureTest(mainScene)
// let p = Paralax(mainScene,mainCamera)
// let bounce = Bounce(mainScene)
// let band = Band(mainScene)

// === Test Objects ===

// // Create Object A (Sphere)
// const geometryA = new THREE.SphereGeometry(1, 32, 32)
// const geometry3 = new THREE.BoxGeometry(1.5, 1.5, 1.5)
// const geometryB = new THREE.ConeGeometry(1,1,32,32)

// const material = new THREE.MeshStandardMaterial({
//   color: 0x0077ff,
//   metalness: 0.4,
//   roughness: 0.3
// })
// const materialA = new THREE.MeshStandardMaterial({ color: 0x0077ff, metalness: 0.4, roughness: 0.3 })
// const materialB = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.2, roughness: 0.5 })


// const objectA = new THREE.Mesh(geometryA, material)
// const objectB = new THREE.Mesh(geometryB, material)
// const object3 = new THREE.Mesh(geometry3, material)
// objectA.name = 'objectA'
// objectB.name = 'objectB'
// objectB.visible = false

// object3.position.set(2,0,2)

// mainScene.add(objectA,objectB,object3)



// // Optional: Add a light for better visuals
// const light = new THREE.PointLight(0xffffff, 2)
// light.position.set(3, 3, 3)
// mainScene.add(light)

// const ambient = new THREE.AmbientLight(0x404040)
// mainScene.add(ambient)

// // Store camera reference for transitions that need it
// mainScene.userData.camera = mainCamera


// // ✅ Example test usage
// setTimeout(() => {
//   transition(mainScene, 1) // Try type 1–8
// }, 2000)



// Helpers
Testing(mainScene)

// Animation loop
function Animate() {
  window.requestAnimationFrame(Animate)

  mainControls.update()
  // p.update()
  // if(ig){
  //   ig.update()
  // }
  

  composer.render()
}
Animate()

// animation


// On Resize 
let size = {
  width : window.innerWidth,
  height: window.innerHeight
}

const onResize = () => {

  size.width = window.innerWidth
  size.height = window.innerHeight

  mainCamera.aspect = size.width / size.height
  mainCamera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(size.width, size.height)
}

window.addEventListener('resize', onResize)