import './style.css';
import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { Vector3 } from 'three';

import { createBox } from './objects/createBox';
import { Setup } from './objects/setup';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { RapierDebugRenderer } from './objects/RapierDebugRenderer.js';

import { ball } from './objects/ball';
import { createGround } from './objects/Ground';
import { createSphere } from './objects/Sphere';
import { jumpPad } from './objects/jumpPad';
import { Table } from './objects/Table';
import { Disk } from './objects/Disk.js';
import { AirHocky } from './objects/AirHocky.js';
import { FlipGrid } from './objects/FlipGrid.js';
import { FlipGridClick } from './objects/FlipGridClick.js';

const doubleLerp = (OldMin, OldMax, NewMin, NewMax, OldValue) => {
  let OldRange = (OldMax - OldMin)
  let NewRange = (NewMax - NewMin)
  let NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
  return NewValue
}

// --- Imports
const mainCanvas = document.getElementById('bg')
const trackpad = document.getElementById('trackpad')
const mlog = document.querySelector('.moblelog')

// --- Values
let mouseD = false

// --- main setup
const mainScene = new THREE.Scene()
// 0xe15151c
let campos = new Vector3(-7, 8, 8)
let tarpos = new Vector3(-7, 0, 0)
let { renderer, mainCamera, mainControls } = Setup(mainCanvas, 0x555555, campos, tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)

// create blobs

// Helpers
// Testing(mainScene)

// Physics
async function initPhysics() {

  await RAPIER.init()

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  let world = new RAPIER.World(gravity);

  const debugRenderer = new RapierDebugRenderer(mainScene, world);
  
  // const ah = AirHocky(mainScene,world,trackpad)

  const grid = FlipGrid(mainScene,mainCamera)
  const gridClick = FlipGridClick(mainScene,mainCamera)
  

  // Animation loop
  function Animate() {
    window.requestAnimationFrame(Animate)

    // ah.update()

    world.step()

    debugRenderer.update();

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