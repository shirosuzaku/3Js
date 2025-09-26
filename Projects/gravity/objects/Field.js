import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

export function Field(world, camera, ground) {
    const geo = new THREE.SphereGeometry(4, 16, 16,0,Math.PI)
    const mat = new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0xffffff
    })
    const mesh = new THREE.Mesh(geo, mat)

    const objectRB = world.createRigidBody(
        RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 1, 5)
    );

    // 2. Add collider (big flat box)
    world.createCollider(
        RAPIER.ColliderDesc
            .ball(4)
            .setSensor(true),
        objectRB
    );

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let force = { x: 1, y: 0, z: 0 };
    let strength = 10
    console.log(ground)
    const onMouseMove = e => {
        console.log("normal")
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

        raycaster.setFromCamera(pointer, camera);

        const intersect = raycaster.intersectObjects(ground.children, true)

        if (intersect.length != 0) {
            console.log('x')
            let p = new THREE.Vector3(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z)
            objectRB.setNextKinematicTranslation({ x: p.x, y: p.y, z: p.z })
        }
    }

    document.addEventListener("mousemove", onMouseMove)

    return mesh
}