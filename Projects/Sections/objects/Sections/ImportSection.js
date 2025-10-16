import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

export class Castle{
    constructor(scene,camera,controls,lp){
        this.scene = scene
        this.camera = camera
        this.controls = controls
        this.section = new THREE.Group()
        this.section.position.set(80,0,-40)

        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".castle",
                start: "top top",
                end: "bottom top",
                scrub: true,
                // markers: true,
            },
            ease: "none",
            onUpdate:  ()=> {
                // this.animating = true
                // if(timeout){
                //     clearTimeout(timeout)
                // }
                // timeout = setTimeout(() => {
                //     this.animating = false
                //     timeout = null
                // }, 500);
            }
        });

        this.loader = new GLTFLoader()
        this.loader.load("./models/new/castle.glb",gltf=>{
            this.section.add(gltf.scene)
            if(gltf.animations.length > 0){
                this.mixer = new THREE.AnimationMixer(gltf.scene)
                this.actions = gltf.animations.map((clip)=> this.mixer.clipAction(clip))
                this.maxDuration = Math.max(...gltf.animations.map(a=>a.duration))
                this.actions.forEach(a=> a.play().paused = true)
                
            }
            this.scene.add(this.section)
            this.Timeline()
        })
        this.clock = new THREE.Clock();
        window.addEventListener('click',()=>{
            console.log(
                this.camera.position,
                this.controls.target
            )
        })
    }
    Timeline(){
        let self = this
        this.timeline
        .to({progress: 0},{
            progress: 1,
            ease: "none",
            scrollTrigger: {
                trigger: ".castle",
                start: "top top",
                end: "800px top",
                scrub: true,
                markers: true,
            },
            onUpdate: function(){
                const p = this.progress()
                self.actions.forEach((a,i)=>{
                    a.time = p * a.getClip().duration
                })
            }
        }).fromTo(this.camera.position,{
            x: 80 + 9,
            y: 0 + 9,
            z: -35 + 9
        },{
            x: 79,
            y: 8,
            z: -32,
            scrollTrigger: {
                trigger: ".castle",
                start: "top top",
                end: "800px top",
                scrub: true,
                markers: true,
            },
        },"<").fromTo(this.controls.target,{
            x: 80,
            y: 0,
            z: -35
        },{
            x: 79,
            y: 1,
            z: -46,
            scrollTrigger: {
                trigger: ".castle",
                start: "top top",
                end: "800px top",
                scrub: true,
                markers: true,
            },
        },"<")
    }
    update(){
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
    }
}