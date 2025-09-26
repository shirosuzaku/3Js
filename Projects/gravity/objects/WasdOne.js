import * as THREE from "three";
let resetBtn = document.getElementById('reset')

export function WasdOne(camera, ground, coor, rb,controller) {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();


    const onMouseMove = e => {
        console.log("normal")
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

        raycaster.setFromCamera(pointer, camera);

        const intersect = raycaster.intersectObjects(ground.children, true)

        if (intersect.length != 0) {
            // coor.copy(intersect[0].point)
            let objpos = new THREE.Vector2(rb.translation().x, rb.translation().z)
            let mousepos = new THREE.Vector2(intersect[0].point.x, intersect[0].point.z)
            controller.position.set(mousepos.x,0.25,mousepos.y)
            // let vec = new THREE.Vector3(0, 0, 0)
            // let points = { object: objpos, click: mousepos, vector: vec }
            // console.table(points)
            
            // vec.x = objpos.x + (mousepos.x - objpos.x) * 0.05
            // vec.y = 0.5
            // vec.z = objpos.y + (mousepos.y - objpos.y) * 0.05
            // rb.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: vec.z })

            // rb.setNextKinematicTranslation({x: mousepos.x,y: 0.5,z: mousepos.y})
            // rb.setTranslation({x: p2.x,y: 0.5,z: p2.y})
            // rb.applyImpulse(force, true);

        }
    }

    // window.addEventListener('mouseover', onMouseMove);
    window.addEventListener('mousemove', onMouseMove)

}

// i want to have the function run in the animaton loop of three js bc the code on mo