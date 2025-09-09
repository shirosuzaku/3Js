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
import { Cylinder } from './objects/cylinder';
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { Glass } from './objects/glass';

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
let campos = new Vector3(0, 5, 5)
let tarpos = new Vector3(0,4.4,0)
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x555555,campos,tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)

// create blobs
// mainScene.add(Box());
// mainScene.add(Cylinder(new THREE.Vector3(0,4,0)))
const glass = Glass(new THREE.Vector3(0,5,0))
mainScene.add(glass.group)

// Helpers
const lights = Testing(mainScene);

const gui = new GUI();

const cover = gui.addFolder('Cover');
cover.add(glass.group.position, 'x', -20, 20);
cover.add(glass.group.position, 'y', -20, 20);
cover.add(glass.group.position, 'z', -20, 20);
cover.add(glass.group.rotation, 'x', -Math.PI, Math.PI);
cover.add(glass.group.rotation, 'y', -Math.PI, Math.PI);
cover.add(glass.group.rotation, 'z', -Math.PI, Math.PI);


const pointFolder = gui.addFolder('Point Light');
pointFolder.add(lights.plight.position, 'x', -20, 20);
pointFolder.add(lights.plight.position, 'y', -20, 20);
pointFolder.add(lights.plight.position, 'z', -20, 20);
pointFolder.add(lights.plight, 'intensity', 0, 2);
pointFolder.add(lights.plight, 'visible').name('On/Off');

const dirFolder = gui.addFolder('Directional Light');
dirFolder.add(lights.dlight.position, 'x', -20, 20);
dirFolder.add(lights.dlight.position, 'y', -20, 20);
dirFolder.add(lights.dlight.position, 'z', -20, 20);
dirFolder.add(lights.dlight, 'intensity', 0, 2);
dirFolder.add(lights.dlight, 'visible').name('On/Off');

const ambFolder = gui.addFolder('Ambient Light');
ambFolder.add(lights.alight, 'intensity', 0, 1);
ambFolder.add(lights.alight, 'visible').name('On/Off');

gui.close(); // Start closed, remove if you want open by default

// Animation loop
let lastInteractionTime = Date.now();
const idleTime = 1000; // 5 seconds
const originalCamPosition = new THREE.Vector3(0, 5, 5);
const originalCamTarget = new THREE.Vector3(0, 5, 0); 
function Animate() {
  window.requestAnimationFrame(Animate)

  mainControls.update()

  if(Date.now() - lastInteractionTime > idleTime && !mainCamera.position.equals(originalCamPosition)){
    resetCam();
    lastInteractionTime = Infinity
  }

  composer.render()
}
Animate()


const resetCam = () =>{
  gsap.to(mainCamera.position, {
    x: originalCamPosition.x,
    y: originalCamPosition.y,
    z: originalCamPosition.z,
    duration: 1,
    ease: "power3.out"
  });
  gsap.to(mainControls.target, {
    x: originalCamTarget.x,
    y: originalCamTarget.y,
    z: originalCamTarget.z,
    duration: 1,
    ease: "power3.out"
  });
}


// On Resize 
window.addEventListener('resize',Resize(mainCamera,renderer))
Resize(mainCamera,renderer)

mainControls.addEventListener('change',()=>{

  // console.log("change")
})
mainControls.addEventListener('start',()=>{
  // console.log("start")
})
mainControls.addEventListener('end',()=>{
  lastInteractionTime = Date.now()
  // console.log("end")
})