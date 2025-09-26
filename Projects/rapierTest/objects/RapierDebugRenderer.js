// RapierDebugRenderer.js
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export class RapierDebugRenderer {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.material = new THREE.LineBasicMaterial({ color: 0x3d251e });
    this.debugMesh = null;
  }

  update() {
    // Remove old debug mesh
    if (this.debugMesh) {
      this.scene.remove(this.debugMesh);
      this.debugMesh.geometry.dispose();
    }

    // Create new geometry from Rapier's debug render pipeline
    const debugRender = this.world.debugRender();
    const vertices = new Float32Array(debugRender.vertices);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    this.debugMesh = new THREE.LineSegments(geometry, this.material);
    this.scene.add(this.debugMesh);
  }
}
