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
let campos = new Vector3(15, 15, 0)
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

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  let world = new RAPIER.World(gravity);
  let input = { x: 0, z: 0 };
  let force = { x: 0, y: 0, z: 0 }
  let decay = 0.05

  const debugRenderer = new RapierDebugRenderer(mainScene, world);

  // // testbox
  // const testb = createBox(world, new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 5, 2.85))
  // mainScene.add(testb.Mesh)

  // table with edges
  // 18 x 10 | 0.8
  let t = Table(world)
  mainScene.add(t.Mesh)
  // disk
  let horizontal = { min: 5 - 1.3, max: -5 + 1.3 }
  let vertical = { min: 2, max: 9 - 1.3 }

  let dsc = Disk(world, new THREE.Vector3(5, 1.3, 0), 0.2, 0.5)
  mainScene.add(dsc.Mesh)

  // puck
  let puck = Disk(world, new THREE.Vector3(3, 1.3, 0), 0.2, 0.5, true)
  mainScene.add(puck.Mesh)

  // Animation loop
  let victimBody, victimColider, vel
  function Animate() {
    window.requestAnimationFrame(Animate)

    t.Mesh.position.copy(t.rigidBody.translation())
    dsc.Mesh.position.copy(dsc.rigidBody.translation())
    puck.Mesh.position.copy(puck.rigidBody.translation())

    world.step()

    debugRenderer.update();

    // mainControls.update()

    composer.render()
  }
  Animate()

  let lastx = null, lasty = null, moved
  const handleTrackpad = e => {
    e.preventDefault()
    moved = true

    if (!mouseD && e.type == 'mousemove') return;
    let xp, yp, dx, dy
    if (e.type == 'mousemove') {
      if (lastx !== null && lasty !== null) {
        dx = e.clientX - lastx
        dy = e.clientY - lasty
      }
      lastx = e.clientX
      lasty = e.clientY
    } else {
      let touch = e.touches[0]
      if (lastx !== null && lasty !== null) {
        dx = touch.clientX - lastx
        dy = touch.clientY - lasty
      }
      lastx = touch.clientX
      lasty = touch.clientY
    }
    setTimeout(() => {
      moved = false
    }, 100);


    let current = dsc.rigidBody.translation()

    console.log(current.z, dx)
    if (dx && dy) {
      let movex = current.x + dy / 20
      let movey = current.z + dx * -1 / 20
      if(movex > vertical.max)
        movex = vertical.max
      if(movex < vertical.min)
        movex = vertical.min

      if(movey < horizontal.max)
        movey = horizontal.max
      if(movey > horizontal.min)
        movey = horizontal.min
      dsc.rigidBody.setNextKinematicTranslation({
        x: movex,
        y: 1.2,
        z: movey
      })

    }

    // if(current.x + dx > horizontal.max){
    //   console.log(current.x,'true',current.x + (dx / 100))
    // }else{
    //   console.log(current.x,'false',current.x + (dx / 100))
    // }
    // mlog.innerHTML = `X - ${dx } <br/> Y- ${dy}`
    // let xx = current.z + (dx / 10)
    // console.log(xx)
    // if (xx) {
    // }

  }

  setInterval(() => {
    if (!moved) {
      lastx = null
      lasty = null
    }
  }, 50);

  trackpad.addEventListener('mousemove', handleTrackpad)
  trackpad.addEventListener('touchmove', handleTrackpad, { passive: false })
}

initPhysics()

// animation

// On Resize 
window.addEventListener('resize', Resize(mainCamera, renderer))
window.addEventListener('mousedown', () => { mouseD = true })
window.addEventListener('mouseup', () => { mouseD = false })
// window.addEventListener('touchmove', ()=>{
//   let str = `X - ${mainCamera.position.x} <br/> Y-  ${mainCamera.position.y} <br/> Z - ${mainCamera.position.z}`
//   mlog.innerHTML = str
// })
Resize(mainCamera, renderer)