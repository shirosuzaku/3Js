import * as THREE from "three";
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function TestScene(mainScene = THREE.Scene,mainCamera = THREE.PerspectiveCamera,mainControls){

    // mainScene.fog = new THREE.Fog(0xffffff,-0,0)

    setTimeout(() => {
        gsap.to(mainCamera.position,{
            x: 5,
            y: 5,
            z: 5,
            duration: 1,
            ease: "power1.out",
            onComplete: () => loaded()
        })
    }, 3000);

    
    const box = new THREE.Mesh(
        new THREE.SphereGeometry(1,32,32),
        new THREE.MeshBasicMaterial({color: 0x000000})
    )
    const grid = new THREE.Mesh(
        new THREE.PlaneGeometry(200,200),
        new THREE.MeshBasicMaterial({color: 0xe7eae5})
    )
    grid.rotateX(Math.PI*-0.5)
    const gridh = new THREE.GridHelper(100,50,0x555555,0x222222)
    gridh.position.y = -0.01
    box.position.y = 1
    mainScene.add(
        box,
        // grid,
        gridh
    )
    
    const loaded = () => {
        const tl = gsap.timeline({
                scrollTrigger: {
                        trigger: ".htmltimeline",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                markers: true,
            },
        });
        let cameraPositions = [
            new THREE.Vector3(5,5,5),
            new THREE.Vector3(20,5,20),
            new THREE.Vector3(20,5,-20),
            new THREE.Vector3(-20,5,-20),
        ]

        tl
        .fromTo(mainCamera.position,{
            x: cameraPositions[0].x,
            y: cameraPositions[0].y,
            z: cameraPositions[0].z,
        },{
            x: cameraPositions[1].x,
            y: cameraPositions[1].y,
            z: cameraPositions[1].z,
        })
        .to(mainCamera.position,{
            x: cameraPositions[2].x,
            y: cameraPositions[2].y,
            z: cameraPositions[2].z,
        })
        .to(mainCamera.position,{
            x: cameraPositions[3].x,
            y: cameraPositions[3].y,
            z: cameraPositions[3].z,
        })
        .fromTo(box.position,{
            x: cameraPositions[0].x -5,
            y: 1,
            z: cameraPositions[0].z -5,
        },{
            x: cameraPositions[1].x -5,
            y: 1,
            z: cameraPositions[1].z -5,
        },"0")
        .to(box.position,{
            x: cameraPositions[2].x -5,
            y: 1,
            z: cameraPositions[2].z -5,
        },">")
        .to(box.position,{
            x: cameraPositions[3].x -5,
            y: 1,
            z: cameraPositions[3].z -5,
        },">")
        .fromTo(mainControls.target,{
            x: cameraPositions[0].x -5,
            y: 1,
            z: cameraPositions[0].z -5,
        },{
            x: cameraPositions[1].x -5,
            y: 1,
            z: cameraPositions[1].z -5,
        },"0")
        .to(mainControls.target,{
            x: cameraPositions[2].x -5,
            y: 1,
            z: cameraPositions[2].z -5,
        },">")
        .to(mainControls.target,{
            x: cameraPositions[3].x -5,
            y: 1,
            z: cameraPositions[3].z -5,
        },">")
    }

    window.addEventListener('resize', () => {
        setTimeout(() => ScrollTrigger.refresh(), 500)
      })
      

    return box
    // .to(mainCamera.position,{
    //     x: cameraPositions[3].x,
    //     y: cameraPositions[3].y,
    //     z: cameraPositions[3].z,
    // })
    

    // document.addEventListener('keydown',()=>{
        // gsap.to(mainCamera.position,{
        //     x: 10,
        //     y: 10,
        //     z: 10,
        //     duration: 1
        // })
    // })

}