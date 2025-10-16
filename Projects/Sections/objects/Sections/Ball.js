import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PathLine } from "../PathLine";

gsap.registerPlugin(ScrollTrigger);

export async function Ball(mainScene,poi,mainCamera,mainControls){

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".ball",
            start: "top top",
            end: "bottom top",
            scrub: true,
            // markers: true,
        },
        ease: "none",
        onUpdate: function () {
        //     // console.log(this.progress())
        //     pathline.update(sphere.position,this.progress())
        material2.uniforms.u_progress.value = this.progress()
    }
    });
    const path = [
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(5,0,0),
        new THREE.Vector3(5,0,5),
        new THREE.Vector3(15,0,5),
    ]
    const cameraDistance = 5

    
    const section = new THREE.Group()
    const loader = new THREE.TextureLoader()
    const matcap = loader.load('/materials/2.png')
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcap,
    })
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1,32,32),
        // material
        new THREE.MeshStandardMaterial({color: 0x4e1c42})
    )
    sphere.castShadow = true
    sphere.receiveShadow = true
    section.add(sphere)
    section.position.copy(poi)
    mainScene.add(section)
    
    // const pathline = PathLine(path,section)
    const curve = new THREE.CatmullRomCurve3(path, false)
const divisions = 200
const curvePoints = curve.getPoints(divisions)

// Convert to geometry
const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
const progressArray = new Float32Array(divisions + 1)
for (let i = 0; i <= divisions; i++) progressArray[i] = i / divisions
geometry.setAttribute('aProgress', new THREE.BufferAttribute(progressArray, 1))

// Shader material
const material2 = new THREE.ShaderMaterial({
  uniforms: {
    u_progress: { value: 0 },
    u_color: { value: new THREE.Color(0x00ffff) },
    u_width: { value: 0.02 },
  },
  vertexShader: `
    attribute float aProgress;
    varying float vProgress;
    void main() {
      vProgress = aProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_progress;
    uniform vec3 u_color;
    uniform float u_width;
    varying float vProgress;
    void main() {
      float alpha = smoothstep(u_progress - 0.02, u_progress, vProgress);
      if(vProgress > u_progress) discard;
      gl_FragColor = vec4(u_color, alpha);
    }
  `,
  transparent: true
})

// Mesh as line
const line = new THREE.Line(geometry, material2)
section.add(line)

    const establishTimeline = () => {
        tl.fromTo(sphere.position,{
            x: path[0].x,
            y: path[0].y + 1,
            z: path[0].z,
        },{
            x: path[1].x,
            y: path[1].y + 1,
            z: path[1].z,
        }).to(sphere.position,{
            x: path[2].x,
            y: path[2].y + 1,
            z: path[2].z,
        }).to(sphere.position,{
            x: path[3].x,
            y: path[3].y + 1,
            z: path[3].z,
        })

        .fromTo(mainCamera.position,{
            x: path[0].x + cameraDistance,
            y: path[0].y + 1 + cameraDistance,
            z: path[0].z + cameraDistance,
        },{
            x: path[1].x + cameraDistance,
            y: path[1].y + 1 + cameraDistance,
            z: path[1].z + cameraDistance,
        },"0").to(mainCamera.position,{
            x: path[2].x + cameraDistance,
            y: path[2].y + 1 + cameraDistance,
            z: path[2].z + cameraDistance,
        },">").to(mainCamera.position,{
            x: path[3].x + cameraDistance,
            y: path[3].y + 1 + cameraDistance,
            z: path[3].z + cameraDistance,
        },">")

        .fromTo(mainControls.target,{
            x: path[0].x,
            y: path[0].y + 1,
            z: path[0].z,
        },{
            x: path[1].x,
            y: path[1].y + 1,
            z: path[1].z,
        },"0").to(mainControls.target,{
            x: path[2].x,
            y: path[2].y + 1,
            z: path[2].z,
        },">").to(mainControls.target,{
            x: path[3].x,
            y: path[3].y + 1,
            z: path[3].z,
        },">")
    }

    document.body.style.overflow = 'hidden';
    gsap.from(sphere.position,{
        x: 0,
        y: 20,
        z: 0,
        // ease: "bounce.out",
        duration: 1.2,
        onComplete: ()=> {
            document.body.style.overflow = 'auto';
            establishTimeline()
        },
        onStart: ()=>{
            window.scrollTo(0,0)
        }
    })


    const update = () => {

    }
    return {
        update: update,
        mesh: sphere,
        lp: path[path.length - 1]
    }
}