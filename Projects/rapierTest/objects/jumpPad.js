import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat"; // or 2d, depending on your project

export function jumpPad(world, dim, initialPos) {


    let dimensions = dim || new THREE.Vector3(1, 1, 1)
    let pos = initialPos || new THREE.Vector3(0, 6, 0)

    const objectRB = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z)
    );


    let col = world.createCollider(
        RAPIER.ColliderDesc
            .cuboid(dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5)
            .setSensor(true) // important: only detects, doesn’t block
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), // 🔑 required
        objectRB
    );

    const effect = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        metalness: 0,
        roughness: 0,
        transmission: 0.0,         // like "opacity for physical materials"
        transparent: true,         // needed for opacity to work
        opacity: 0.4,
        ior: 1.5,                  // index of refraction (1.5 = typical glass)
        reflectivity: 0.9,
        envMapIntensity: 1.0
    })

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
        effect
    );
    mesh.position.copy(pos);

    return { rigidBody: objectRB, Mesh: mesh, collid : col };
}
