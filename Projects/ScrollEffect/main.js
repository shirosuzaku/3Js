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
import { LightTest } from './objects/lightTest';
import { ScrollWall } from './objects/ScrollWall';
import { TextureTest } from './objects/TextureTest';

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
let campos = new Vector3(0, 0, 10)
let tarpos = new Vector3(0,0,0)
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x555555,campos,tarpos)//reder canvas ,bg color, camera position,control target

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)
// const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// composer.addPass(gammaCorrectionPass)


// create blobs
// mainScene.add(Box());

// Helpers
// Testing(mainScene)

// LightTest(mainScene)
// ScrollWall(mainScene)
// TextureTest(mainScene)


// Animation loop
function Animate() {
  window.requestAnimationFrame(Animate)

  mainControls.update()

  composer.render()
}
Animate()

// animation

// On Resize 
window.addEventListener('resize', () => Resize(mainCamera, renderer))
Resize(mainCamera,renderer)