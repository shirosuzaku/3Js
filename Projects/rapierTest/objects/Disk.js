import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";

export function Disk(world,possition,height,radius) {

    let h = height || 2
    let r = radius || 2
    let pos = possition || new THREE.Vector3(0,8,0)
    
    const objectRB = world.createRigidBody(
        RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(pos.x,pos.y,pos.z)
    )

    world.createCollider(
        RAPIER.ColliderDesc.cylinder(h * 0.5,r),
        objectRB
    )
    
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(r,r,h,16),    // full size = 2 × half extents
        new THREE.MeshStandardMaterial({ color: 0x3d251e })
    )

    return { rigidBody: objectRB, Mesh : mesh }
}