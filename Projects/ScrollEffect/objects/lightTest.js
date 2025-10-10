import * as THREE from 'three';

export function LightTest(mainScene){

    const mat1 = new THREE.MeshPhysicalMaterial({color: 0x493822})
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1,5,5),
        mat1
    )
    box.castShadow = true
    box.receiveShadow = true
    box.position.y = 2.5

    const box2 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        mat1
    )

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        new THREE.MeshPhysicalMaterial({color: 0x492238})
    )
    ground.rotation.x = Math.PI * -0.5
    ground.receiveShadow = true

    box2.castShadow = true
    box2.receiveShadow = true
    box2.position.set(2,2,1)

    const l1 = new THREE.AmbientLight(0xffffff,0.3)
    const l2 = new THREE.DirectionalLight(0xffffff,1)
    const lh2 = new THREE.DirectionalLightHelper(l2)
    l2.position.set(5,5,5)
    const l3 = new THREE.PointLight(0xffffff,1)
    l3.position.set(-5,5,-5)
    l2.castShadow = true
    l3.castShadow = true

    // l2.lookAt(0,0,0)

    mainScene.add(box,box2,ground,l1,l2,lh2,l3)
}