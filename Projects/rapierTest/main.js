import './style.css';
import * as THREE from 'three';
// import RAPIER from "@dimforge/rapier2d";
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
import { ball } from './objects/ball';
import { Ground } from './objects/Ground';

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
let campos = new Vector3(-10, 13.5, 8.5)
let tarpos = new Vector3(0, 0, 0)
let { renderer, mainCamera, mainControls } = Setup(mainCanvas, 0x555555, campos, tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)

// create blobs
// mainScene.add(Box())
let ballMesh = ball()
mainScene.add(ballMesh)
mainScene.add(Ground())

// Helpers
Testing(mainScene)

// Physics

import RAPIER from '@dimforge/rapier2d';

let gravity = { x: 0.0, y: -9.81 };
// let w = new RAPIER.

// import('@dimforge/rapier2d').then(RAPIER => {

//   let world = new RAPIER.World(gravity);
//   console.log("world", world)


//   // // colliders
//   // const groundCD = RAPIER.ColliderDesc.cuboid(5.0, 0.1)
//   // world.createCollider(groundCD)


//   // // phy obj
//   // const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 5.0)
//   // const rigidBody = world.createRigidBody(rigidBodyDesc)
//   // const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5)
//   // world.createCollider(colliderDesc, rigidBody)
// })



// Animation loop
let pos
function Animate() {
  window.requestAnimationFrame(Animate)

  // world.step()

  // pos = rigidBody.translation()
  // ballMesh.position.set(pos.x, pos.y, 0)

  mainControls.update()

  composer.render()
}
Animate()
// async function initPhysics() {
// }
// initPhysics()

// animation


// On Resize 
window.addEventListener('resize', Resize(mainCamera, renderer))
Resize(mainCamera, renderer)