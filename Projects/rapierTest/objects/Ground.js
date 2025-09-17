import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat"; // or 2d, depending on your project

export function createGround(world) {

    let dimensions = new THREE.Vector3(40,1,40)

    const groundRB = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0)
    );


    world.createCollider(
        RAPIER.ColliderDesc
            .cuboid(dimensions.x * 0.5,dimensions.y * 0.5,dimensions.z * 0.5)
            .setFriction(1.0), // half extents → 10x0.2x10 box
        groundRB
    );


    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.x,dimensions.y,dimensions.z),    // full size = 2 × half extents
        new THREE.MeshStandardMaterial({ color: 0x228822 })
    );
    mesh.position.set(0, -0.5, 0);


    return { rigidBody: groundRB, Mesh: mesh };
}
