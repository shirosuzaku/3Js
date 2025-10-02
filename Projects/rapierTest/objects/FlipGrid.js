import * as THREE from 'three';
import { Card } from './card';
import gsap from 'gsap'

export function FlipGrid(mainScene, mainCamera) {

    const group = new THREE.Group()
    const targetGroup = new THREE.Group()
    let cards = []

    const target = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 13),
        new THREE.MeshBasicMaterial({ 
            color: 0x553333,
            visible: false
         })
      );
    //   target.material.visible = false;
    //   target.material.transparent = true;
    //   target.material.opacity = 0;
      target.material.side = THREE.DoubleSide;
      target.raycast = THREE.Mesh.prototype.raycast;
    target.rotateX(Math.PI * -0.5)
    targetGroup.add(target)

//     const mat = new THREE.ShaderMaterial({
//         uniforms: {},
//         vertexShader: `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv; // no need to scale for gradient
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `,

//         fragmentShader: `
//   varying vec2 vUv;
//   void main() {
//     // vUv.y goes from 0 (bottom) to 1 (top)
//     float brightness = 1.0 - vUv.y; // white at top → black at bottom
//     vec3 color = vec3(brightness);
//     gl_FragColor = vec4(color, 1.0);
//   }
// `,

//         side: THREE.DoubleSide
//     });

//     const plane = new THREE.Mesh(
//         new THREE.PlaneGeometry(1, 1),
//         mat
//         // new THREE.MeshBasicMaterial({color: 0x333333})
//     )
//     plane.position.setZ(1)
//     plane.position.setX(1)
//     group.add(plane)
//     const plane2 = new THREE.Mesh(
//         new THREE.PlaneGeometry(1, 1),
//         mat
//         // new THREE.MeshBasicMaterial({ color: 0x333333 })
//     )
//     plane2.position.setZ(1)
//     plane2.position.setX(-1)
//     group.add(plane2)

      
    mainScene.add(
        group,
        targetGroup
    )

    // plane.rotation.x = Math.PI * -0.5

    const q = new THREE.Quaternion(); // identity (no rotation)
    const axis = new THREE.Vector3(1, 0, 1).normalize(); // Y-axis
    let angle = -Math.PI / 2; // 90 degrees
    // let x = Math.PI

    let width = 0.5
    let offset = width / 2
    let x = -5, z = -5
    let c = Card(new THREE.Vector2(width,width))

    for (let i = 0; i < 506; i++) {
        let cc = c.clone()
        cc.position.set(x - offset,0,z - offset)
        
        if(x < 6){
            x+= width
        }else{
            x = -5
            z+= width
        }
        group.add(cc)
        cards.push(cc)
        
    }


    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = e => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

        raycaster.setFromCamera(pointer, mainCamera);

        const intersect = raycaster.intersectObjects(targetGroup.children, true)

        let x , z, vec = new THREE.Vector2(0,0)
        if (intersect.length != 0) {
            // console.log(intersect[0].point)
            cards.forEach((c,i)=> {
                vec.x = c.position.x - intersect[0].point.x
                vec.y = c.position.z - intersect[0].point.z
                x = vec.length()
                if(x < 2){
                    q.setFromAxisAngle(axis, Math.PI * (x / 2));
                    // c.quaternion.copy(q)
                    gsap.to(c.quaternion, {
                        x: q.x,
                        y: q.y,
                        z: q.z,
                        w: q.w,
                        duration: 0.4,
                        // delay: x/12,
                        onUpdate: () => c.quaternion.normalize()
                    });
                }else{
                    q.setFromAxisAngle(axis, Math.PI);
                    // c.quaternion.copy(q)
                    gsap.to(c.quaternion, {
                        x: q.x,
                        y: q.y,
                        z: q.z,
                        w: q.w,
                        duration: 0.4,
                        // delay: 0.2,
                        onUpdate: () => c.quaternion.normalize()
                    });
                }
            })
            // plane.position.setX(intersect[0].point.x)
            // plane.position.setZ(intersect[0].point.z)
        }
    }

    window.addEventListener('mousemove', onMouseMove);

    const update = () => {
        // q.setFromAxisAngle(axis, Math.PI / 2);
        // cards[25].quaternion.copy(q)
        // cards[25].rotation.x = Math.PI * -0.5

        // cards[25].applyQuaternion(q)

    }
    return { update: update }
}