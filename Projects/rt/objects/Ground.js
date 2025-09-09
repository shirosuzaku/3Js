import * as THREE from "three";

export function Ground() {
    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.2, 0.2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    groundMesh.position.set(0, 0, 0);

    return groundMesh;
}