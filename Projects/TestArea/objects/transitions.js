// transitions.js
// Apply a transition between two objects in a Three.js scene.
// Usage: transition(mainScene, 1)  // Choose a transition type from 1 to 8

import * as THREE from 'three'
import { gsap } from 'gsap'

export function transition(scene, type = 1) {
  const objA = scene.getObjectByName('objectA')
  const objB = scene.getObjectByName('objectB')
  if (!objA || !objB) {
    console.warn('transition() requires scene to contain objectA and objectB')
    return
  }

  // Hide objectB initially
  objB.visible = false

  switch (type) {
    case 1:
      // Morphing Transition
      morphTransition(objA, objB)
      break
    case 2:
      // Dissolve / Particle Transition
      particleTransition(scene, objA, objB)
      break
    case 3:
      // Shader Blend Transition
      shaderTransition(objA, objB)
      break
    case 4:
      // Explosion → Reform
      explodeTransition(objA, objB)
      break
    case 5:
      // Camera / Scene Move Transition
      cameraTransition(scene, objA, objB)
      break
    case 6:
      // Material / Color Crossfade
      materialTransition(objA, objB)
      break
    case 7:
      // Clipping Plane / Reveal Wipe
      clipTransition(objA, objB)
      break
    case 8:
      // Scale / Fold Morph
      scaleTransition(objA, objB)
      break
    default:
      console.warn('Invalid transition type')
  }
}

// 1️⃣ Morph Transition
function morphTransition(a, b, count = 1000, duration = 2) {
    if (!a.geometry || !b.geometry) return;
  
    // Sample equal number of random points from both geometries
    const posA = new Float32Array(count * 3);
    const posB = new Float32Array(count * 3);
  
    const tempVec = new THREE.Vector3();
    const posAttrA = a.geometry.attributes.position;
    const posAttrB = b.geometry.attributes.position;
  
    // Fill posA with random points from geometry A
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * posAttrA.count);
      tempVec.fromBufferAttribute(posAttrA, idx);
      posA.set([tempVec.x, tempVec.y, tempVec.z], i * 3);
    }
  
    // Fill posB with random points from geometry B
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * posAttrB.count);
      tempVec.fromBufferAttribute(posAttrB, idx);
      posB.set([tempVec.x, tempVec.y, tempVec.z], i * 3);
    }
  
    // Create particle system to handle morph animation
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posA, 3));
  
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
    });
  
    const points = new THREE.Points(geometry, material);
    a.visible = false;
    b.visible = false;
    a.parent.add(points);
  
    // Animate transition using GSAP
    gsap.to({ t: 0 }, {
      t: 1,
      duration,
      ease: "power2.inOut",
      onUpdate() {
        const t = this.targets()[0].t;
        const pos = geometry.attributes.position;
        for (let i = 0; i < count; i++) {
          pos.setXYZ(
            i,
            THREE.MathUtils.lerp(posA[i * 3], posB[i * 3], t),
            THREE.MathUtils.lerp(posA[i * 3 + 1], posB[i * 3 + 1], t),
            THREE.MathUtils.lerp(posA[i * 3 + 2], posB[i * 3 + 2], t)
          );
        }
        pos.needsUpdate = true;
      },
      onComplete() {
        points.visible = false;
        b.visible = true;
        a.parent.remove(points);
      }
    });
  }
  

// 2️⃣ Particle Transition
function particleTransition(scene, a, b) {
  const matA = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
  const matB = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
  matA.transparent = true
  matB.transparent = true
  const pointsA = new THREE.Points(a.geometry, matA)
  const pointsB = new THREE.Points(b.geometry, matB)
  a.visible = false
  b.visible = false
  scene.add(pointsA)
  scene.add(pointsB)
  pointsA.material.opacity = 1
  pointsB.material.opacity = 0

  gsap.to(pointsA.material, { opacity: 0, duration: 2 })
  gsap.to(pointsB.material, { opacity: 1, duration: 2, delay: 1, onComplete: () => {
    pointsA.visible = false
    scene.remove(pointsA)
    pointsA.geometry.dispose()
    pointsA.material.dispose()
    b.visible = true
  } })
}

// 3️⃣ Shader Blend Transition
function shaderTransition(a, b) {
  const hasTex1 = a.material && a.material.map
  const hasTex2 = b.material && b.material.map
  if (!hasTex1 || !hasTex2) {
    // Fallback: crossfade opacity if textures are missing
    materialTransition(a, b)
    return
  }
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tMix: { value: 0 },
      tex1: { value: a.material.map },
      tex2: { value: b.material.map }
    },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform float tMix;uniform sampler2D tex1;uniform sampler2D tex2;varying vec2 vUv;void main(){vec4 c1=texture2D(tex1,vUv);vec4 c2=texture2D(tex2,vUv);gl_FragColor=mix(c1,c2,tMix);}`,
  })

  a.material = material
  gsap.to(material.uniforms.tMix, { value: 1, duration: 2, ease: 'power2.inOut', onComplete: () => {
    a.visible = false
    b.visible = true
  } })
}

// 4️⃣ Explosion → Reform
function explodeTransition(a, b) {
  const count = a.geometry.attributes.position.count
  const offsets = Array.from({ length: count }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5
  ))
  const pos = a.geometry.attributes.position

  gsap.to({ t: 0 }, {
    t: 1,
    duration: 3,
    ease: 'power2.inOut',
    onUpdate() {
      const t = this.progress()
      for (let i = 0; i < count; i++) {
        pos.setXYZ(
          i,
          pos.getX(i) + offsets[i].x * Math.sin(Math.PI * t),
          pos.getY(i) + offsets[i].y * Math.sin(Math.PI * t),
          pos.getZ(i) + offsets[i].z * Math.sin(Math.PI * t)
        )
      }
      pos.needsUpdate = true
      if (t >= 1) {
        a.visible = false
        b.visible = true
      }
    }
  })
}

// 5️⃣ Camera / Scene Transition
function cameraTransition(scene, a, b) {
  const cam = scene.userData.camera
  if (!cam) return
  gsap.to(cam.position, { z: cam.position.z + 5, duration: 1, onComplete: () => {
    a.visible = false
    b.visible = true
    gsap.to(cam.position, { z: cam.position.z - 5, duration: 1 })
  } })
}

// 6️⃣ Material / Color Crossfade
function materialTransition(a, b) {
  b.visible = true
  b.material.transparent = true
  a.material.transparent = true
  b.material.opacity = 0
  gsap.to(a.material, { opacity: 0, duration: 1 })
  gsap.to(b.material, { opacity: 1, duration: 1, delay: 0.5, onComplete: () => { a.visible = false } })
}

// 7️⃣ Clipping Plane / Reveal Wipe
function clipTransition(a, b) {
  const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)
  a.material.clippingPlanes = [plane]
  b.visible = true
  b.material.clippingPlanes = [plane]
  gsap.to(plane, { constant: -2, duration: 2, ease: 'power2.inOut', onComplete: () => { a.visible = false } })
}

// 8️⃣ Scale / Fold Morph
function scaleTransition(a, b) {
  b.visible = true
  b.scale.set(0.001, 0.001, 0.001)
  gsap.to(a.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1 })
  gsap.to(b.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 0.5, onComplete: () => { a.visible = false } })
}
