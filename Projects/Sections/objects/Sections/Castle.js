import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PathLine } from "../PathLine";

gsap.registerPlugin(ScrollTrigger);
export async function Castle(mainScene,poi,obj,lp,mainCamera,mainControls){

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".castle",
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: true,
        },
        onUpdate: function () {
            pathline.update(obj.position,this.progress())
        },
    });

    const section = new THREE.Group()
    const castle = new THREE.Mesh(
        new THREE.BoxGeometry(2,2,2),
        new THREE.MeshNormalMaterial()
    )

    const pl = new THREE.PointLight(0xffffff,1)
    pl.position.set(4,4,4)
    const a = new THREE.AmbientLight(0xffffff,0.6)

    const loader = new GLTFLoader()
    let mixer , clip, mesh,action
    const loadMesh = async () => {
        loader.load("/models/anim.glb",gltf=>{
            // console.log(gltf)
            mesh = gltf.scene
            section.add(mesh)
            // mesh.scale.set(0.3,0.3,0.3)
            // mesh.position.y += 0.1
            
            if(gltf.animations.length > 0){
                mixer = new THREE.AnimationMixer(gltf.scene)
                clip = gltf.animations[0];
                action = mixer.clipAction(clip);
                action.play();
                action.paused = true
                establishTimeline(action,clip.duration)
            }
        })
    }
    
    await loadMesh()

    section.add(castle)
    section.add(pl,a)
    section.position.copy(poi)
    mainScene.add(section)

    const path = [
        new THREE.Vector3(19,0,5),
        new THREE.Vector3(30,0,5),
        new THREE.Vector3(30,0,25),
        new THREE.Vector3(60,0,25),
    ]
    const cameraDistance = 5
    const pathline = PathLine(path,section,17)
    

    const establishTimeline = (action,dur) => {
        // move ball
        tl.fromTo(obj.position,
        {
            x: lp.x,
            y: 1,
            z: lp.z,
            
        },
        {
            x: path[0].x,
            y: 1,
            z: path[0].z,
            // scrollTrigger: {
            //     trigger: ".castle",
            //     start: "top top",
            //     end: "bottom top",
            //     scrub: true,
            //     markers: true,
            // },
        },"0").to(obj.position,{
            x: path[1].x,
            y: 1,
            z: path[1].z,
        },">").to(obj.position,{
            x: path[2].x,
            y: 1,
            z: path[2].z,
        },">").to(obj.position,{
            x: path[3].x,
            y: 1,
            z: path[3].z,
        },">")

        // Mesh animation
        tl
        .to(action,{
            time: dur,
            ease: "none",
        },"0")
        // other animation ball probably
        .to(castle.position,{
            x: 2,
            y: 0,
            z: 2
        },">")
    }


    const clock = new THREE.Clock();
    const update = () => {
        console.log("x")
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
    }
    return {
        update: update
    }
}