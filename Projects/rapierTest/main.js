import './style.css';
import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { createBox } from './objects/createBox';
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { ball } from './objects/ball';
import { createGround } from './objects/Ground';
import { createSphere } from './objects/Sphere';
import { jumpPad } from './objects/jumpPad';

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
let campos = new Vector3(5, 2, 5)
let tarpos = new Vector3(0, 0, 0)
let { renderer, mainCamera, mainControls } = Setup(mainCanvas, 0x555555, campos, tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)

// create blobs

// Helpers
Testing(mainScene)

// Physics
async function initPhysics() {

  await RAPIER.init()

  let gravity = { x: 0.0, y: -9.81 , z: 0.0};
  let world = new RAPIER.World(gravity);
  let input = { x: 0, z: 0 };
  let force = { x: 0, y: 0, z: 0}
  let decay = 0.05

  // Animation loop
  let victimBody,victimColider,vel
  function Animate() {
    window.requestAnimationFrame(Animate)

    world.step()

    // mainControls.update()

    composer.render()
  }
  Animate()
}

initPhysics()

// animation

// On Resize 
window.addEventListener('resize', Resize(mainCamera, renderer))
Resize(mainCamera, renderer)