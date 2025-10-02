// RapierDebugRenderer2D.js
import * as THREE from 'three';

export class RapierDebugRenderer {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.material = new THREE.LineBasicMaterial({ color: 0x3d251e });
    this.debugMesh = null;
    this.geometry = null;
    this.positionAttr = null;
  }

  update() {
    const debugRender = this.world.debugRender && this.world.debugRender();
    // debugRender.vertices is an array of 2D points flattened [x0,y0,x1,y1,...]
    const verts2d = debugRender && debugRender.vertices;
    if (!verts2d || verts2d.length === 0) {
      if (this.debugMesh) this.debugMesh.visible = false;
      return;
    }

    const requiredFloats = (verts2d.length / 2) * 3;

    // Initialize or resize buffers if needed
    if (!this.geometry || !this.positionAttr || this.positionAttr.array.length !== requiredFloats) {
      this.geometry = new THREE.BufferGeometry();
      this.positionAttr = new THREE.BufferAttribute(new Float32Array(requiredFloats), 3);
      this.geometry.setAttribute('position', this.positionAttr);
      this.geometry.setDrawRange(0, requiredFloats / 3);

      if (!this.debugMesh) {
        this.debugMesh = new THREE.LineSegments(this.geometry, this.material);
        this.scene.add(this.debugMesh);
      } else {
        this.debugMesh.geometry.dispose();
        this.debugMesh.geometry = this.geometry;
      }
    }

    // Write positions into existing buffer
    const positions = this.positionAttr.array;
    for (let i = 0, j = 0; i < verts2d.length; i += 2, j += 3) {
      positions[j] = verts2d[i + 0];      // x
      positions[j + 1] = verts2d[i + 1];  // y
      positions[j + 2] = 0;               // z (2D -> 0)
    }
    this.positionAttr.needsUpdate = true;
    this.geometry.setDrawRange(0, requiredFloats / 3);
    if (this.debugMesh) this.debugMesh.visible = true;
  }
}
