import * as THREE from "three";
let resetBtn = document.getElementById('reset')

export function CastGround(camera, ground, coor, rb) {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const reset = { x: 0, y: 1, z: 0 }
    let force = { x: 1, y: 0, z: 0 };
    let strength = 10

    const onMouseMove = e => {
        if (e.target.id != 'reset') {
            console.log("normal")
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

            raycaster.setFromCamera(pointer, camera);

            const intersect = raycaster.intersectObjects(ground.children, true)

            if (intersect.length != 0) {
                // coor.copy(intersect[0].point)
                let p1 = new THREE.Vector2(rb.translation().x, rb.translation().z)
                let p2 = new THREE.Vector2(intersect[0].point.x,intersect[0].point.z)
                let vec =  new THREE.Vector2(p2.x - p1.x, p2.y - p1.y)
                vec.normalize()
                let points = { object: p1, click: p2.normalize(), vector: vec }
                console.table(points)
                force.x = vec.x * strength
                force.z = vec.y * strength

                rb.applyImpulse(force, true);
            }
        }
    }

    window.addEventListener('click', onMouseMove);
    resetBtn.addEventListener('click', () => {
        console.log("reset")
        rb.setTranslation(reset)
    })
}