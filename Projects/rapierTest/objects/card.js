import * as THREE from 'three';

export function Card(dim = new THREE.Vector2(1,1),color1 = 0xffffff,color2 = 0x000000){

    const group = new THREE.Group()

    const front = new THREE.Mesh(
        new THREE.PlaneGeometry(dim.x, dim.y),
        new THREE.MeshBasicMaterial({ color: color1, side: THREE.FrontSide })
    );
      
    const back = new THREE.Mesh(
        new THREE.PlaneGeometry(dim.x, dim.y),
        new THREE.MeshBasicMaterial({ color: color2, side: THREE.BackSide })
    );
      
    front.rotation.x = Math.PI * -0.5
    back.rotation.x = Math.PI * -0.5
    group.add(front,back)
      

    return group
}