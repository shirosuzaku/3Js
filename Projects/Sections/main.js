import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { Setup } from './objects/setup';
// import { Base } from './objects/Sections/Base';
import { Lighting } from './objects/Lighting';
import { Base } from './objects/Sections/BaseClass';

// --- Imports
const mainCanvas = document.getElementById('bg')

// --- Values

// --- main setup
const mainScene = new THREE.Scene()
// 0xe15151c
// 0xe7eae5
let campos = new THREE.Vector3(1, 10, 1)
let tarpos = new THREE.Vector3(0,0,0)
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x9b9b9b,campos,tarpos)//reder canvas ,bg color, camera position,control target

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;



const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)


const init = async () => {
  // const sectionBase = await Base(mainScene,mainCamera,mainControls)
  const sectionBase = new Base(mainScene,mainCamera,mainControls)
  // console.log("base update",sectionBase.update)
  Lighting(mainScene,renderer)

  
    // Animation loop
  function Animate() {
    window.requestAnimationFrame(Animate)
      
    mainControls.update()
    sectionBase.update()

    composer.render()
  }
  Animate()
}
init()

// On Resize 
let size = {
  width : window.innerWidth,
  height: window.innerHeight
}

const onResize = () => {
  let larger = window.innerHeight > size.height ? window.innerHeight : size.height
  size.width = window.innerWidth
  size.height = larger

  mainCamera.aspect = size.width / size.height
  mainCamera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(size.width, size.height)
}
window.addEventListener('resize', onResize)