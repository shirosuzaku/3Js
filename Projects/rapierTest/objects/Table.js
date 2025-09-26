import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";

export function Table(world,possition,dimensions,margin) {

    let dim = dimensions || new THREE.Vector3(18,3,10)
    let pos = possition || new THREE.Vector3(0,0,0)
    let mar = margin || 0.8
    let group = new THREE.Group()
    
    let left = (mar * 0.5 ) + (dim.x - mar * 2) * 0.5
    let top = (mar * 0.5 ) + (dim.z - mar * 2) * 0.5


    const objectRB = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x,pos.y,pos.z)
    )

    world.createCollider(
        RAPIER.ColliderDesc.cuboid(dim.x * 0.5, 1 ,dim.z * 0.5)
        .setTranslation(0,2.5,0),
        objectRB
    )
    world.createCollider(
        RAPIER.ColliderDesc.cuboid((dim.x - mar * 2) * 0.5,(dim.y - mar) * 0.5,(dim.z - mar * 2) * 0.5),
        objectRB
    )
    world.createCollider(
        RAPIER.ColliderDesc
            .cuboid((mar) * 0.5,(dim.y) * 0.5,(dim.z) * 0.5)
            .setTranslation(left,0,0),
        objectRB
    )
    world.createCollider(
        RAPIER.ColliderDesc
            .cuboid((mar) * 0.5,(dim.y) * 0.5,(dim.z) * 0.5)
            .setTranslation(-left,0,0),
        objectRB
    )
    world.createCollider(
        RAPIER.ColliderDesc
            .cuboid((dim.x - mar * 2) * 0.5,(dim.y) * 0.5,(mar) * 0.5)
            .setTranslation(0,0,top),
        objectRB
    )
    world.createCollider(
        RAPIER.ColliderDesc
            .cuboid((dim.x - mar * 2) * 0.5,(dim.y) * 0.5,(mar) * 0.5)
            .setTranslation(0,0,-top),
        objectRB
    )

    const mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(dim.x - mar * 2,dim.y - mar,dim.z - mar * 2),    // full size = 2 × half extents
        new THREE.MeshStandardMaterial({ color: 0x228822 })
    )
    const mesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(mar,dim.y, dim.z),    // full size = 2 × half extents
        new THREE.MeshStandardMaterial({ color: 0x228822 })
    )
    const mesh2c = mesh2.clone()
    mesh2.position.setX(left)
    mesh2c.position.setX(-left)
    
    const mesh3 = new THREE.Mesh(
        new THREE.BoxGeometry(dim.x - mar * 2,dim.y, mar),    // full size = 2 × half extents
        new THREE.MeshStandardMaterial({ color: 0x228822 })
    )
    const mesh3c = mesh3.clone()
    mesh3.position.setZ(top)
    mesh3c.position.setZ(-top)
    
    
    group.add(mesh1,
        mesh2,
        mesh2c,
        mesh3,
        mesh3c
    )
    group.position.copy(pos);

    return { rigidBody: objectRB, Mesh : group }
}