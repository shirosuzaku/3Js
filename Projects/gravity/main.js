import './style.css';
import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'

import { Box } from './objects/box';
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { createGround } from '../rapierTest/objects/Ground';
import { Cube } from './objects/Cube';
import { CastGround } from './objects/CastGround';
import { WasdOne } from './objects/WasdOne';
import { Field } from './objects/Field';

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
// mainScene.add(Box());

// Helpers
Testing(mainScene)
const initPhysics = async () => {
  await RAPIER.init()

  let gravity = { x: 0.0, y: -9.81, z: 0.0 };
  let world = new RAPIER.World(gravity);
  let force = { x: 0.15, y: 0, z: 0.1}


  const ground = createGround(world)
  let groundGroup = new THREE.Group().add(ground.Mesh)
  mainScene.add(groundGroup)



  // const cube = Cube(world)
  // mainScene.add(cube.Mesh)

  let positions = [
    new THREE.Vector3(0,3,0),
    new THREE.Vector3(3,3,3),
    new THREE.Vector3(0,3,3),
    new THREE.Vector3(3,3,0),
    new THREE.Vector3(-3,3,-3),
    new THREE.Vector3(-3,3,3),
    new THREE.Vector3(3,3,-3),
    new THREE.Vector3(0,3,-3),
    new THREE.Vector3(-3,3,0),
  ]
  let objs = []

  positions.map(pos => {
    let instance = Cube(world,null,pos)
    mainScene.add(instance.Mesh)
    objs.push(instance)
  })

  let field = Field(world,mainCamera,groundGroup)
  mainScene.add(field)
  // const conegeo = new THREE.ConeGeometry(0.5, 0.5, 16)
  // const mat = new THREE.MeshNormalMaterial({})
  // const cone = new THREE.Mesh(conegeo, mat)
  // cone.visible = true
  // mainScene.add(cone)

  mainControls.enabled = true

  // // box follows the mouse(it follows the controller to allow smoothing)
  // WasdOne(mainCamera, groundGroup, null, cube.rigidBody, cone)
  // // this way the lerp is being done in the animation loop so it doesnt 
  // // lag bc it doesnt deppend on the mouse moving
  // const goToControlller = (objpos, mousepos) => {
  //   let vec = new THREE.Vector3(0,0,0)
  //   vec.x = objpos.x + (mousepos.x - objpos.x) * 0.05
  //   vec.y = 0.5
  //   vec.z = objpos.z + (mousepos.z - objpos.z) * 0.05
  //   let points = { object: objpos, click: mousepos, vector: vec }
  //   console.table(points)
  //   cube.rigidBody.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: vec.z })
  // }


  // mainCamera.position.set(cube.Mesh.position.x+5,cube.Mesh.position.y+5,cube.Mesh.position.z+5)

  // Animation loop
  function Animate() {
    window.requestAnimationFrame(Animate)

    // console.table(coor)

    world.step()
    
    // goToControlller(cube.rigidBody.translation(),cone.position)
    objs.forEach(o=> o.Mesh.position.copy(o.rigidBody.translation()))
    // objs[0].rigidBody.applyImpulse(force,true)
    // mainCamera.position.lerp(new THREE.Vector3(cube.Mesh.position.x-5,cube.Mesh.position.y+5,cube.Mesh.position.z+5),0.05)
    // mainCamera.lookAt(cube.Mesh.position.x,cube.Mesh.position.y,cube.Mesh.position.z)

    // mainControls.update()

    composer.render()
  }
  Animate()

}
initPhysics()

// On Resize 
window.addEventListener('resize', Resize(mainCamera, renderer))
Resize(mainCamera, renderer)