import * as THREE from "three";

export function Obj() {
    const group = new THREE.Group()

    const ball = new THREE.SphereGeometry(1,32,32)
    const box = new THREE.BoxGeometry(2,2,5)
    const torus = new THREE.TorusGeometry(2,1,32,32)

    const mat = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa
    })

    const ballmesh = new THREE.Mesh(ball,mat)
    const boxmesh = new THREE.Mesh(box,mat)
    const torusmesh = new THREE.Mesh(torus,mat)

    boxmesh.position.set(5,0,0)
    torusmesh.position.set(-3,0,-3)

    group.add(ballmesh,boxmesh,torusmesh)

    return group
}