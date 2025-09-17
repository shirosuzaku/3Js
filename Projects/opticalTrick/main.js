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
import { Glass } from './objects/glass';
import { GlassFont } from './objects/GlassFont';

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
let campos = new Vector3(0, 0, 8)
let tarpos = new Vector3(0,0,2)
// 0x1f6937
let {renderer,mainCamera,mainControls} = Setup(mainCanvas,0x257e41,campos,tarpos)//reder canvas ,bg color, camera position,control target

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)

// create blobs
// mainScene.add(Box());

// const pg = new THREE.PlaneGeometry(10,10)
// const pm = new THREE.MeshBasicMaterial({color: 0x1f6937})
// const material = new THREE.ShaderMaterial({
//   vertexShader: `
//   varying vec2 vUv;
//   varying vec3 vNormal;
//   varying vec3 vPosition;
  
//   void main() {
//       vUv = uv;
//       vNormal = normal;
//       // vPosition = position;
//       vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x ,position.y,position.z, 1.0);
//     }
//   `,
//   fragmentShader: `
//       varying vec2 vUv;
//       varying vec3 vNormal;
//       varying vec3 vPosition;
      
//       void main() {
//           // just output red to test
//           // float normalizedY = (vPosition.y + 1.0) * 0.5;
//           // vec3 color = vec3(h, 0.0, 1.0 - h);
//           // float h = (vPosition.y + 1.0) * 0.5;
          
//           float lx = vUv.x - 0.5;
//           float ly = vUv.y - 0.5;
//           float h = (lx + ly);
//           // float ch = h;
//           // float ch = clamp(sqrt(lx*lx + ly*ly),0.0,1.0);
//           float ch = sqrt(lx*lx + ly*ly) + 0.6;
//           // float cr = ch * (31.0 / 255.0);
//           // float cg = ch * (105.0 / 255.0);
//           // float cb = ch * (55.0 / 255.0);
//           float cr = ch * 0.0;
//           float cg = ch * 0.0;
//           float cb = ch * 0.0;
//           float h2 = vUv.y ;
//           float h3 = (vPosition.z + 3.0 ) * 0.25 ;
//           vec3 color = vec3(cr, cg, cb);
//           gl_FragColor = vec4(color, 1.0 - ch);
//     }
//   `,
//   transparent: true
// });

// // const pmesh = new THREE.Mesh(pg,pm)
// const pmesh = new THREE.Mesh(pg,material)
// const pmesh2 = new THREE.Mesh(pg,material)
// const pmesh3 = new THREE.Mesh(pg,material)

// // pmesh2.rotateX(Math.PI * -0.5)
// pmesh2.rotation.set(Math.PI * -0.5,Math.PI * 0.0,Math.PI * 1.0)
// pmesh.rotation.set(Math.PI * 0.0,Math.PI * -0.5,Math.PI * 0.0)
// pmesh3.rotation.set(Math.PI * 0.0,Math.PI * 0.0,Math.PI * 0.5)

// pmesh.position.set(10,10,0)
// pmesh3.position.set(0,10,-10)
// mainScene.add(
//   pmesh,
//   pmesh2,
//   pmesh3
// )

// const bg = new THREE.SphereGeometry(2,32,32)
// const bma = new THREE.MeshBasicMaterial({color: 0xaa0000})

// const bm = new THREE.Mesh(bg,bma)
// bm.position.set(0,10,0)
// mainScene.add(bm)

// Helpers


// Testing(mainScene)

// Animation loop

// Text behind bubble
const loader = new THREE.FontLoader();
loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeo = new THREE.TextGeometry("The big quick brown fox jumped over the lazy dog", {
    font: font,
    size: 0.5,
    height: 0.1,
  });
  textGeo.computeBoundingBox();

const box = textGeo.boundingBox;
const xOffset = -0.5 * (box.max.x - box.min.x);
const yOffset = -0.5 * (box.max.y - box.min.y);
const zOffset = -0.5 * (box.max.z - box.min.z);

// Center the geometry itself
textGeo.translate(xOffset, yOffset, zOffset);
  const textMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-0.75, 0, 2);
  mainScene.add(textMesh);
});

// let g = Glass()
let glassFont = GlassFont()

mainScene.add(glassFont.mesh)

// g.cc.position.copy(g.mesh.position)

// mainScene.add(g.mesh)

function Animate() {
  window.requestAnimationFrame(Animate)

  mainControls.update()
  
  // g.cc.update(renderer,mainScene)

  composer.render()
}
Animate()

// GUI
// const gui = new GUI();

// Object holding renderer color
const settings = {
  background: "#000000" // initial black
};

// Add a color picker to GUI
// gui.addColor(settings, "background").onChange((value) => {
//   renderer.setClearColor(value);
// });

// animation


// On Resize 
window.addEventListener('resize',Resize(mainCamera,renderer))
Resize(mainCamera,renderer)