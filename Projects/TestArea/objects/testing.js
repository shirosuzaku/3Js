import * as THREE from 'three';

export function Testing(scene){
    const plight = new THREE.PointLight(0xffffff, 1)
    plight.position.set(5, 5, 5)
    plight.castShadow = true
    const alight = new THREE.AmbientLight(0xffffff, 0.5)
    const grid = new THREE.GridHelper(20,10)


    scene.add(plight, alight, grid)
}

