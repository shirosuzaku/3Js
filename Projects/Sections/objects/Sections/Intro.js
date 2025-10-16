import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GUI } from 'dat.gui';
import { ProgressManager } from "../progressManager";
import { Path } from "../Path";
gsap.registerPlugin(ScrollTrigger);

export class Intro{
    constructor(scene,camera,controls){

        this.scene = scene
        this.camera = camera
        this.controls = controls
        this.animating = false
        let timeout = null
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".ball",
                start: "top top",
                end: "bottom top",
                scrub: true,
                // markers: true,
            },
            ease: "none",
            onUpdate:  ()=> {
                this.animating = true
                if(timeout){
                    clearTimeout(timeout)
                }
                timeout = setTimeout(() => {
                    this.animating = false
                    timeout = null
                }, 500);
            }
        });
        this.playback = new ProgressManager('.ball')
        this.path = [
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(35,0,0),
            new THREE.Vector3(35,0,-35),
            new THREE.Vector3(75,0,-35),
            new THREE.Vector3(80,0,-35),
        ];
        this.cameraDistance = 9;
        this.section = new THREE.Group();
        this.scene.add(this.section)
        this.setup()
        this.Timeline()
    }
    
    setup(){
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1,32,32),
            new THREE.MeshBasicMaterial({color: 0x4e1c42})
        )
        this.section.add(this.sphere);
        const params = {color: 0xffffff};
      
        this.gui = new GUI();
        this.gui.addColor( params, 'color' ).onChange( (val) => {
            this.sphere.material.color.setHex(val)
        });

        this.pathLine = new Path(this.section,this.path)

    }

    updateTrail = (prog) =>{

    }

    getLastPoint (){
        return this.path[this.path.length]
    }

    Timeline(){
        let yoff = 1, self = this
        this.timeline
        .fromTo(this.sphere.position,{
            x: this.path[0].x,
            y: this.path[0].y + yoff,
            z: this.path[0].z,
            duration: 1,
        },{
            x: this.path[1].x,
            y: this.path[1].y + yoff,
            z: this.path[1].z,
            duration: 1,
            ease: "none",
            onUpdate: function(){
                self.pathLine.updatePath(0,this.progress())
            }
        })
        .to(this.sphere.position,{
            x: this.path[2].x,
            y: this.path[2].y + yoff,
            z: this.path[2].z,
            ease: "none",
            duration: 1,
            onUpdate: function(){
                self.pathLine.updatePath(1,this.progress())
            }
        })
        .to(this.sphere.position,{
            x: this.path[3].x,
            y: this.path[3].y + yoff,
            z: this.path[3].z,
            ease: "none",
            duration: 1,
            onUpdate: function(){
                self.pathLine.updatePath(2,this.progress())
            }
        })
        .to(this.sphere.position,{
            x: this.path[4].x,
            y: this.path[4].y + yoff,
            z: this.path[4].z,
            ease: "none",
            duration: 0.25,
            onUpdate: function(){
                self.animating = false
                // self.pathLine.updatePath(3,this.progress())
                self.sphere.position.y = (1.5 * Math.sin(this.progress() * Math.PI)) + yoff
            }
        })
    }

    update(){
        if(this.animating){
            this.camera.position.lerp(
                new THREE.Vector3(
                    this.sphere.position.x + this.cameraDistance,
                    this.sphere.position.y + this.cameraDistance,
                    this.sphere.position.z + this.cameraDistance
                ),
                0.05
            )
            this.controls.target.lerp(
                new THREE.Vector3(
                    this.sphere.position.x,
                    this.sphere.position.y,
                    this.sphere.position.z
                ),
                0.05
            )
            // console.log(this.playback.getProgress())
        }

    }
}