import './style.css';
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { GUI } from 'dat.gui'
import gsap from 'gsap'
import { Box } from './objects/box';
import { Setup } from './objects/setup';
import { Vector3 } from 'three';
import { Testing } from './objects/testing';
import { Resize } from './objects/Resize';
import { addPipelineTestObjects } from './objects/pipelineTest';
import { Obj } from './objects/obj';
import { createMouseTrail } from './objects/mouseTrail';

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
const renderPass = new RenderPass(mainScene, mainCamera)
composer.addPass(renderPass)
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)

// Post-processing passes and GUI controls
const passes = {}
const gui = new GUI()
const guiFolder = gui.addFolder('Post-Processing Passes')

// Unreal Bloom
passes.bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85)
passes.bloom.enabled = false
composer.addPass(passes.bloom)
const bloomFolder = guiFolder.addFolder('Bloom')
bloomFolder.add(passes.bloom, 'enabled').name('enabled')
bloomFolder.add(passes.bloom, 'strength', 0, 3, 0.01)
bloomFolder.add(passes.bloom, 'radius', 0, 1, 0.01)
bloomFolder.add(passes.bloom, 'threshold', 0, 1, 0.001)

// SSAO
passes.ssao = new SSAOPass(mainScene, mainCamera, window.innerWidth, window.innerHeight)
passes.ssao.enabled = false
passes.ssao.kernelRadius = 16
composer.addPass(passes.ssao)
const ssaoFolder = guiFolder.addFolder('SSAO')
ssaoFolder.add(passes.ssao, 'enabled').name('enabled')
ssaoFolder.add(passes.ssao, 'kernelRadius', 1, 64, 1)
ssaoFolder.add(passes.ssao, 'minDistance', 0.001, 0.1, 0.001)
ssaoFolder.add(passes.ssao, 'maxDistance', 0.01, 1.0, 0.01)

// Bokeh (Depth of Field)
passes.bokeh = new BokehPass(mainScene, mainCamera, {
  focus: 10.0,
  aperture: 0.00015,
  maxblur: 0.01
})
passes.bokeh.enabled = false
composer.addPass(passes.bokeh)
const bokehFolder = guiFolder.addFolder('Bokeh')
bokehFolder.add(passes.bokeh, 'enabled').name('enabled')
bokehFolder.add(passes.bokeh.uniforms.focus, 'value', 0.0, 100.0, 0.1).name('focus')
bokehFolder.add(passes.bokeh.uniforms.aperture, 'value', 0.0, 0.01, 0.00001).name('aperture')
bokehFolder.add(passes.bokeh.uniforms.maxblur, 'value', 0.0, 0.02, 0.0001).name('maxblur')

// Film
passes.film = new FilmPass(0.35, 0.025, 648, false)
passes.film.enabled = false
composer.addPass(passes.film)
const filmFolder = guiFolder.addFolder('Film')
filmFolder.add(passes.film, 'enabled').name('enabled')
filmFolder.add(passes.film.uniforms.nIntensity, 'value', 0, 1, 0.01).name('noise')
filmFolder.add(passes.film.uniforms.sIntensity, 'value', 0, 1, 0.01).name('scanlines')
filmFolder.add(passes.film.uniforms.sCount, 'value', 0, 2048, 1).name('lines count')
// filmFolder.add(passes.film.uniforms.grayscale, 'value', 0, 1, 1).name('grayscale')

// Glitch
passes.glitch = new GlitchPass()
passes.glitch.enabled = false
composer.addPass(passes.glitch)
const glitchFolder = guiFolder.addFolder('Glitch')
glitchFolder.add(passes.glitch, 'enabled').name('enabled')

// Dot Screen
passes.dot = new DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8)
passes.dot.enabled = false
composer.addPass(passes.dot)
const dotFolder = guiFolder.addFolder('DotScreen')
dotFolder.add(passes.dot, 'enabled').name('enabled')
// dotFolder.add(passes.dot, 'scale', 0.1, 2.0, 0.01)
// dotFolder.add(passes.dot, 'angle', 0, Math.PI, 0.01)

// RGB Shift (via ShaderPass)
const rgbShift = new ShaderPass(RGBShiftShader)
passes.rgbShift = rgbShift
passes.rgbShift.enabled = false
passes.rgbShift.uniforms.amount.value = 0.0015
passes.rgbShift.fragmentShader = `
uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);

    float mask = smoothstep(0.4, 0.5, dist); // only near edges

    vec2 offset = amount * vec2(0.005, 0.0);
    vec4 c;
    c.r = texture2D(tDiffuse, uv + offset).r;
    c.g = texture2D(tDiffuse, uv).g;
    c.b = texture2D(tDiffuse, uv - offset).b;
    c.a = 1.0;

    gl_FragColor = mix(texture2D(tDiffuse, uv), c, mask);
}
`;
composer.addPass(passes.rgbShift)
const rgbFolder = guiFolder.addFolder('RGB Shift')
rgbFolder.add(passes.rgbShift, 'enabled').name('enabled')
rgbFolder.add(passes.rgbShift.uniforms.amount, 'value', 0.0, 0.02, 0.0001).name('amount')

// FXAA
passes.fxaa = new ShaderPass(FXAAShader)
passes.fxaa.enabled = false
passes.fxaa.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio)
passes.fxaa.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio)
composer.addPass(passes.fxaa)
const fxaaFolder = guiFolder.addFolder('FXAA')
fxaaFolder.add(passes.fxaa, 'enabled').name('enabled')

// Outline
passes.outline = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), mainScene, mainCamera)
passes.outline.enabled = false
composer.addPass(passes.outline)
const outlineFolder = guiFolder.addFolder('Outline')
outlineFolder.add(passes.outline, 'enabled').name('enabled')
outlineFolder.add(passes.outline, 'edgeStrength', 0.0, 10.0, 0.01)
outlineFolder.add(passes.outline, 'edgeGlow', 0.0, 1.0, 0.01)
outlineFolder.add(passes.outline, 'edgeThickness', 1.0, 4.0, 0.01)

guiFolder.open()

// Mouse Trail GUI
// Mouse trail setup
const mouseTrail = createMouseTrail(mainScene, mainCamera, renderer)

const trailFolder = gui.addFolder('Mouse Trail')
trailFolder.add(mouseTrail.params, 'enabled').name('enabled').onChange(mouseTrail.setEnabled)
trailFolder.add(mouseTrail, 'setType', ['line', 'points']).name('type')
trailFolder.addColor(mouseTrail.params, 'color').name('color').onChange(mouseTrail.setColor)
trailFolder.add(mouseTrail.params, 'pointSize', 1, 32, 1).name('point size').onChange(mouseTrail.setPointSize)
trailFolder.add(mouseTrail.params, 'maxPoints', 50, 1000, 10).name('max points').onChange(mouseTrail.setMaxPoints)
trailFolder.open()

// create blobs
// mainScene.add(Box());
mainScene.add(Obj())

// Add pipeline test objects: one close PBR, one far ShaderMaterial
// addPipelineTestObjects(mainScene)

// Helpers
Testing(mainScene)

// Animation loop
function Animate() {
  window.requestAnimationFrame(Animate)

  mainControls.update()

  // Update mouse trail
  mouseTrail.update()

  composer.render()
}
Animate()

// animation


// On Resize
function handleResize() {
  Resize(mainCamera, renderer)
  composer.setSize(window.innerWidth, window.innerHeight)
  // Resolution-dependent passes
  if (passes.fxaa) {
    passes.fxaa.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio)
    passes.fxaa.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio)
  }
  if (passes.bloom) {
    passes.bloom.setSize(window.innerWidth, window.innerHeight)
  }
  if (passes.ssao) {
    passes.ssao.setSize(window.innerWidth, window.innerHeight)
  }
  if (passes.outline) {
    passes.outline.setSize(window.innerWidth, window.innerHeight)
  }
}
window.addEventListener('resize', handleResize)
handleResize()