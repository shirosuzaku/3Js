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
// const mainCanvas = document.getElementById('bg')
const mainCanvas = document.getElementById('canvas1')

// --- Values

// --- main setup
const mainScene = new THREE.Scene()
// 0xe15151c
let campos = new Vector3(0, 0, 2)
let tarpos = new Vector3(0,0,0)
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x181818,campos,tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)

mainControls.enabled = false

// Testing(mainScene)

const bg = new THREE.BoxGeometry(5, 5, 5);
const bg2 = new THREE.TorusGeometry(0.75,0.3,16,60)
const bm = new THREE.MeshNormalMaterial();
const bme = new THREE.Mesh(bg2, bm);
bme.position.set(0, 0, 0);

mainScene.add(bme)

const planegeo = new THREE.PlaneGeometry(9.5,9.5)
const planem = new THREE.MeshBasicMaterial({color:0x222222})
const plane = new THREE.Mesh(planegeo,planem)
plane.position.set(0,-2,-2)
mainScene.add(plane)

const planegeo2 = new THREE.PlaneGeometry(9.9,9.8)
const planem2 = new THREE.MeshBasicMaterial({color:0xffffff})
const plane2 = new THREE.Mesh(planegeo2,planem2)
plane2.position.set(0,-2, -2.1)
mainScene.add(plane2)

const timeline = gsap.timeline({paused: true, reversed: true})


timeline.to(bme.rotation,{
  y: 0.3,
  x: -0.6,
  duration: 1,
  ease: "power2.inOut"
},0)

timeline.to(bme.position, {
  x:-0.4,
  z: 0.47,
  y: 0.47,
  duration: 1,
  ease: "power2.inOut"
}, 0);

timeline.eventCallback("onReverseComplete", () => {
  console.log("Reverse complete!");
  mouseover = false
});

// Animation loop
let mouseover = false
function Animate() {
  console.log("frame")
  composer.render()
  if(mouseover){
    window.requestAnimationFrame(Animate)
    // mainControls.update()
  }
}
Animate()

// const gui = new GUI()

// gui.add(bme.position,'x',-1,1,0.01)
// gui.add(bme.position,'y',-1,1,0.01)
// gui.add(bme.position,'z',-1,1,0.01)

// gui.add(bme.rotation,'x',-Math.PI,Math.PI,0.1)
// gui.add(bme.rotation,'y',-Math.PI,Math.PI,0.1)
// gui.add(bme.rotation,'z',-Math.PI,Math.PI,0.1)


// On Resize 
window.addEventListener('resize',Resize(mainCamera,renderer))
Resize(mainCamera,renderer)

window.addEventListener('scroll',(e)=>{
  // console.log(window.scrollY)
  // mainCamera.position.y = 30 - window.scrollY
})

mainCanvas.addEventListener('mouseover',(e)=>{
  mouseover = true
  Animate()
  timeline.play();
})
mainCanvas.addEventListener('mouseout',(e)=>{
  timeline.reverse();
  setTimeout(() => {
    // mouseover = false
  }, 1000);
})