import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function ScrollWall(mainScene) {
    let hp = Math.PI * 0.5

    const sections = ["#hero","#body","#about","#footer"]

    

    // const tl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: ".htmltimeline",
    //         start: "top top",
    //         end: "bottom bottom",
    //         scrub: true,
    //         markers: true,
    //     },
    // });
    

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshPhysicalMaterial({ color: 0x492238 })
    ) 
    ground.receiveShadow = true

    let length = 15
    const box1 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,length).translate(0,0,length /2),
        new THREE.MeshPhysicalMaterial({ color: 0x49ff38 })
    )
    box1.rotation.y = Math.PI* 0.5
    box1.castShadow = true
    box1.receiveShadow = true
    let y = 4.5
    box1.position.y = y

    const boxes = new THREE.Group()
    // gsap.to(box1.rotation, {
    //     y: hp,
    //     duration: 1,
    //     repeat: -1, // infinite
    //     yoyo: true, // goes back and forth
    //     ease: "none"
    // });
    // tl
    // .to(box1.rotation,{
    //     onComplete: ()=> {
    //         gsap.to(box1.rotation,{
    //             y: -hp,
    //             duration: 0.3
    //         })
    //     }
    // })
    // .to(box1.rotation,{y: -hp})
    // .to(box1.rotation,{y: hp})
    // .to(box1.rotation,{y: -hp})


    for(let i = 0 ; i < 7; i++){
        let b = box1.clone()
        y --
        b.position.y = y
        boxes.add(b)
        // tl
        // .to(b.rotation,{y: hp},"0")
        // .to(b.rotation,{y: -hp},`>+=${i*0.05}`)
        // .to(b.rotation,{y: hp},`>+=${i*0.05}`)
        // .to(b.rotation,{y: -hp},`>+=${i*0.05}`)
        // gsap.to(b.rotation, {
        //     y: -Math.PI,
        //     duration: 1,
        //     delay: i * 0.1,
        //     repeat: -1, // infinite
        //     yoyo: true, // goes back and forth
        //     ease: "none"
        // });
    }

    sections.forEach((id,i)=>{
        const section = document.querySelector(id)
        const roatation = i % 2 === 0 ? hp : -hp
        
        gsap.to(box1.rotation,{
            y: roatation,
            duration: 0.4,
            scrollTrigger: {
                trigger: section,
                start: "top center",
                end: "bottom center",
                // scrub: true,
                markers: true
            }
        })
    })

    const l1 = new THREE.AmbientLight(0xffffff, 0.3)
    const l2 = new THREE.DirectionalLight(0xffffff, 1)
    const lh2 = new THREE.DirectionalLightHelper(l2)
    l2.position.set(5, 5, 5)
    const l3 = new THREE.PointLight(0xffffff, 1)
    l3.position.set(8, 8, 8)
    l2.castShadow = true
    l3.castShadow = true

    const gridHelp = new THREE.GridHelper(20,20,0x000000)
    gridHelp.rotateX(Math.PI * 0.5)

    mainScene.add(
        ground,
        gridHelp,
        box1,
        boxes,
        // box2, 
        l1, l3)
}

let x = 
`i want to have gsap setup so that i have 4 sections #hero,#body,#about,#footer 
and each one alternates the y values of box1.rotation from -hp to hp`