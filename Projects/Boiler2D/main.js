import './style.css';
import * as THREE from 'three';
import RAPIER from "@dimforge/rapier2d-compat";
import { Box2D } from './objects/box';
import { Setup } from './objects/setup';
import { Resize } from './objects/Resize';
import { Dot } from './objects/Dot';
import { RapierDebugRenderer } from './objects/RapierDebugRenderer';

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
let { renderer, mainCamera } = Setup(mainCanvas, 0x555555)

// Grid helper (XY plane)
const gridSize = 1000
const gridDivisions = 10
const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x444444)
grid.rotation.x = Math.PI / 2
grid.material.opacity = 0.5
grid.material.transparent = true
grid.renderOrder = -1
mainScene.add(grid)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(gridSize, gridSize),
  new THREE.MeshBasicMaterial({ color: 0x555555 })
)
const planeG = new THREE.Group().add(plane)
plane.position.set(0, 0, -1)
mainScene.add(planeG)

async function initPhysics() {
  await RAPIER.init()
  let world = new RAPIER.World({ x: 0, y: -100 })

  // world.createCollider(
  //   RAPIER.ColliderDesc.cuboid(400, 1).setTranslation(0, -400)
  // )
  // world.createCollider(
  //   RAPIER.ColliderDesc.cuboid(400, 1).setTranslation(0, 400)
  // )
  // world.createCollider(
  //   RAPIER.ColliderDesc.cuboid(1, 400).setTranslation(400, 0)
  // )
  // world.createCollider(
  //   RAPIER.ColliderDesc.cuboid(1, 400).setTranslation(-400, 0)
  // )

  // let dot = Dot(world, 25, 0xff3366,undefined,true)
  // mainScene.add(dot.Mesh)

  // let dot2 = Dot(world, 25, 0xff3366, new THREE.Vector2(300, 200),true)
  // mainScene.add(dot2.Mesh)

  let dots = [
    // dot, dot2
  ]

  let pox = -300, poy = -300
  for (let i = 0; i < 250; i++) {
    let x = Dot(world,5,0xff33ff, new THREE.Vector2(pox, poy))
    pox += 45
    if(pox >= 400){
      pox = -300
      poy += 45
    }
    mainScene.add(x.Mesh)
    dots.push(x)
  }

  const debugRenderer = new RapierDebugRenderer(mainScene, world)

  // Animation loop
  function animate() {
    renderer.render(mainScene, mainCamera)
    world.step()

    dots.forEach(d => {
      d.update()
      d.Mesh.position.set(d.RigidBody.translation().x, d.RigidBody.translation().y, 0)

    })

    // dot.update()
    // dot2.update()
    // dot.Mesh.position.set(dot.RigidBody.translation().x, dot.RigidBody.translation().y, 0)
    // dot2.Mesh.position.set(dot2.RigidBody.translation().x, dot2.RigidBody.translation().y, 0)

    // debugRenderer.update()
    requestAnimationFrame(animate)
  }
  animate()


  const moveDots = (mouse) => {

    dots.forEach(d => {
      const pos = d.RigidBody.translation();
      // const dx = mouse.x -  pos.x;
      // const dy = mouse.y - pos.y;
      const dx = pos.x - mouse.x;
      const dy = pos.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const range = 100; // interaction radius
      const strength = 1.5; // tweak this

      if (dist < range) {
        // Normalize direction
        const nx = dx / dist;
        const ny = dy / dist;

        // Compute force strength based on distance (stronger when closer)
        const forceMag = (1 - dist / range) * strength * 100;

        // Apply impulse outward
        d.RigidBody.setLinvel({ x: nx * forceMag, y: ny * forceMag }, true);
      } else {
        // console.log('d.RigidBody value:', d.RigidBody);
        // console.log('typeof:', typeof d.RigidBody);
        // if (d.RigidBody) {
        //   console.log('proto methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(d.RigidBody)));
        // }
        // d.RigidBody.setLinvel({ x: 0, y: -20 }, true);
      }
    })
  }

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // --- Camera Controls (2D pan + zoom)
  let isPanning = false
  const lastMouse = { x: 0, y: 0 }
  const minZoom = 0.1
  const maxZoom = 10

  const getWorldPointFromScreen = (clientX, clientY) => {
    const nx = (clientX / window.innerWidth) * 2 - 1
    const ny = ((clientY / window.innerHeight) * 2 - 1) * -1
    pointer.set(nx, ny)
    raycaster.setFromCamera(pointer, mainCamera)
    const intersect = raycaster.intersectObjects(planeG.children, true)
    return intersect.length !== 0 ? intersect[0].point.clone() : null
  }

  const onMouseDown = (e) => {
    if (e.button === 1 || e.button === 2) { // middle or right
      isPanning = true
      lastMouse.x = e.clientX
      lastMouse.y = e.clientY
    }
  }

  const onMouseUp = () => { isPanning = false }
  const onMouseLeave = () => { isPanning = false }

  const onMouseMove = e => {
    if (isPanning) {
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      lastMouse.x = e.clientX
      lastMouse.y = e.clientY
      const panScale = 1 / mainCamera.zoom
      // Drag right -> content moves right (camera moves left)
      mainCamera.position.x -= dx * panScale
      // Drag down -> content moves down (camera moves up)
      mainCamera.position.y += dy * panScale
    }

    // Maintain existing raycast-driven behavior
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;
    raycaster.setFromCamera(pointer, mainCamera);
    const intersect = raycaster.intersectObjects(planeG.children, true)
    if (intersect.length != 0) {
      moveDots(intersect[0].point)
    }
  }

  const onWheel = (e) => {
    // Zoom towards cursor position
    const before = getWorldPointFromScreen(e.clientX, e.clientY)
    if (!before) return

    const zoomFactor = Math.pow(1.1, e.deltaY > 0 ? -1 : 1)
    mainCamera.zoom = THREE.MathUtils.clamp(mainCamera.zoom * zoomFactor, minZoom, maxZoom)
    mainCamera.updateProjectionMatrix()

    const after = getWorldPointFromScreen(e.clientX, e.clientY)
    if (after) {
      const dx = before.x - after.x
      const dy = before.y - after.y
      mainCamera.position.x += dx
      mainCamera.position.y += dy
    }
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('contextmenu', (e) => { e.preventDefault() })
}
initPhysics()
// animation


// On Resize 
window.addEventListener('resize', () => Resize(mainCamera, renderer))
Resize(mainCamera, renderer)