import * as THREE from "three";
import RAPIER from "@dimforge/rapier2d-compat";

export function Dot(world, size = 50, clr = 0xff3366, pos = new THREE.Vector2(0, 0), fixed = false) {

    let force = { x: 0, y: 4 }
    let objectRB
        = fixed ? world.createRigidBody(
            RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y)
        ) : world.createRigidBody(
            // RAPIER.RigidBodyDesc.kinematicVelocityBased()
            RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(pos.x, pos.y)
            
        );

    world.createCollider(
        RAPIER.ColliderDesc.ball(size * 1.5),
        objectRB
    );

    const geometry = new THREE.CircleGeometry(size, 32);
    const material = new THREE.MeshBasicMaterial({ color: clr });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y);

    let dotpossition
    let strength = 30
    let target = new THREE.Vector2(pos.x, pos.y)
    let targetedForce = new THREE.Vector2(0, 0)
    const update = () => {
        if (objectRB.isDynamic()) {

            dotpossition = objectRB.translation()
            targetedForce.x = target.x - dotpossition.x
            targetedForce.y = target.y - dotpossition.y
            targetedForce.normalize()
            targetedForce.multiplyScalar(strength)
            // objectRB.setNextKinematicTranslation(targetedForce, true);
            objectRB.setLinvel(targetedForce, true);

            //   objectRB.setLinvel(force, true);
            //   objectRB.addForce(force, true);
            //   objectRB.applyImpulse(force, true);
        }
    };



    return { Mesh: mesh, RigidBody: objectRB, update: update };
}
