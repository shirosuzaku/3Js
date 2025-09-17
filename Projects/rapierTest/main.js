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
  let decay = 0.01

    // colliders
    const ground = createGround(world)
    mainScene.add(ground.Mesh)

    // const killZone = world.createCollider(
    //   RAPIER.ColliderDesc.cuboid(50, 0.25, 50) // very wide
    //     .setTranslation(0, -5, 0)
    //     .setSensor(true) // important: only detects, doesn’t block
    //     .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS) // 🔑 required
    // );

    // walls
    const wall1 = createBox(world,new THREE.Vector3(1,20,40),new THREE.Vector3(20,10,0))
    const wall2 = createBox(world,new THREE.Vector3(1,20,40),new THREE.Vector3(-20,10,0))
    const wall3 = createBox(world,new THREE.Vector3(40,20,1),new THREE.Vector3(0,10,-20))
    const wall4 = createBox(world,new THREE.Vector3(40,20,1),new THREE.Vector3(0,10,20))
    mainScene.add(wall1.Mesh)
    mainScene.add(wall2.Mesh)
    mainScene.add(wall3.Mesh)
    mainScene.add(wall4.Mesh)

    const pad = jumpPad(world,new THREE.Vector3(4,4,4),new THREE.Vector3(4,2,4))
    mainScene.add(pad.Mesh)
    console.log(pad.rigidBody)
    let killZone = pad.collid

    const spher = createSphere(world)
    mainScene.add(spher.Mesh)

    // const spher2 = createSphere(world,1,new THREE.Vector3(0.5,10,0.5))
    // mainScene.add(spher2.Mesh)



  const eventQueue = new RAPIER.EventQueue(true);


  // Animation loop
  let victimBody,victimColider,vel
  function Animate() {
    window.requestAnimationFrame(Animate)

    world.step(eventQueue)
    // world.step()

    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (started) {
        if (handle1 === killZone.handle || handle2 === killZone.handle) {
          const victimHandle = handle1 === killZone.handle ? handle2 : handle1;
          console.log(victimHandle)
          victimBody = world.getCollider(victimHandle).parent()
          vel = victimBody.linvel()
          victimBody.applyImpulse({x: vel.x, y:  50, z: vel.z},true)
        }
      }
    });

    // spher.Mesh.position.copy(spher.rigidBody.translation())
    spher.rigidBody.applyImpulse(force, true);
    // if (force.x > 0) {
    //   force.x -= decay
    // } else if (force.x < 0){
    //   force.x += decay      
    // }
    
    // if (force.z > 0) {
    //   force.z -= decay
    // } else if (force.z < 0){
    //   force.z += decay      
    // }
    
    // console.log(force)
    spher.Mesh.position.copy(spher.rigidBody.translation())

    mainControls.update()

    composer.render()
  }
  Animate()


  document.addEventListener("keydown", (e) => {
    if (e.key === "w") force.z = -0.2; // forward
    if (e.key === "s") force.z = 0.2; // backward
    if (e.key === "a") force.x = -0.2; // left
    if (e.key === "d") force.x = 0.2; // right
  })
  document.addEventListener("keyup", (e) => {
    if (e.key === "w") force.z = 0; // forward
    if (e.key === "s") force.z = 0; // backward
    if (e.key === "a") force.x = 0; // left
    if (e.key === "d") force.x = 0; // right
  })
}

initPhysics()


// animation


// On Resize 
window.addEventListener('resize', Resize(mainCamera, renderer))
Resize(mainCamera, renderer)