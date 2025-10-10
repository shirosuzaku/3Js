import * as THREE from 'three';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


export function Bounce(mainScene){
    const gh = new THREE.GridHelper(10,10)

    const box1 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhysicalMaterial({color:0xabc123})
    )
    box1.castShadow = true
    box1.receiveShadow = true

    const box2 = new THREE.Mesh(
        new THREE.BoxGeometry(3,0.6,4),
        new THREE.MeshPhysicalMaterial({color:0x123abc})
    )
    box2.castShadow = true
    box2.receiveShadow = true
    box2.translateY(0.3)
    
    const box3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.5,2,0.5),
        new THREE.MeshPhysicalMaterial({color:0x123abc})
    )
    box3.castShadow = true
    box3.receiveShadow = true
    box3.position.y = 0.6
    box3.position.x = 1
    box3.position.z = 1.6
    box3.translateY(1)
    
    box1.position.y = 0.6
    box1.translateY(0.5)

    const tl = gsap.timeline({scrollTrigger: {
        trigger: ".htmltimeline",
        start: "center top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },})
    tl.from(box1.position,{
        y:-5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1.2,0.65)"
    }).from(box1.rotation,{
        y: Math.PI * 0.5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1.2,0.65)"
    },"<").from(box2.rotation,{
        y: Math.PI * 0.5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1.2,0.65)"
    },"<").from(box3.rotation,{
        y: Math.PI * 0.5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1.2,0.65)"
    },"<").from(box2.position,{
        y:-5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1,0.65)"
    },"<").from(box3.position,{
        y:-5,
        duration: 2,
        // ease: "bounce.out"
        ease: "elastic.out(1.2,0.65)"
    },"<")

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        new THREE.MeshStandardMaterial({color: 0x556677})
    )
    plane.rotateX(Math.PI*-0.5)

    mainScene.add(
        // gh,
        box1,
        box2,
        box3,
        plane
    )
}