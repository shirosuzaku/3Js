import * as THREE from "three";


export function ball(){
    // const ballgeo = new THREE.SphereGeometry(0.5,16,16)
    // const ballmat = new THREE.MeshBasicMaterial({color: 0x44abab})
    // const ballmesh = new THREE.Mesh(ballgeo,ballmat)

    const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    return boxMesh
}