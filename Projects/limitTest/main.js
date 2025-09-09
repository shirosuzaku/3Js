import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';

// --- Imports
// const mainCanvas = document.getElementById('bg')

export function sceneInstance(canvasItem, screenSize, model) {

  // --- main setup
  const mainScene = new THREE.Scene()
  // 0xe15151c
  let campos = new Vector3(0, 0, 2)
  let tarpos = new Vector3(0,0,0)
  let {renderer,mainCamera,mainControls} = Setup(canvasItem,0x181818,campos,tarpos,screenSize)//reder canvas ,bg color, camera position,control target

  const composer = new EffectComposer(renderer)
  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
  composer.addPass(gammaCorrectionPass)
  const renderPass = new RenderPass(mainScene, mainCamera)
  composer.addPass(renderPass)

  // mainControls.enabled = false

  if(model){
    Testing(mainScene)
    mainScene.add(model.scene)
    
  }else{
    const boxg = new THREE.BoxGeometry(2,2,2)
    const boxm = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(boxg,boxm)
    mainScene.add(mesh)
  }


  // Animation loop
  function Animate() {
    composer.render()
    // mainControls.update()
    window.requestAnimationFrame(Animate)
  }
  Animate()

  // On Resize 
  window.addEventListener('resize',Resize(mainCamera,renderer,screenSize))
  Resize(mainCamera,renderer,screenSize)

}
