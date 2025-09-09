import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function Cylinder(pos) {

    const mat = new THREE.MeshStandardMaterial({
        color: 0x555555
    })

    const geo = new THREE.CylinderGeometry(3,3,1,32,2)
    const CylinderMesh = new THREE.Mesh(geo,mat)

    CylinderMesh.position.copy(pos)
    CylinderMesh.castShadow = true
    
    const effect = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,         // like "opacity for physical materials"
        transparent: true,         // needed for opacity to work
        opacity: 0.5,
        ior: 1.5,                  // index of refraction (1.5 = typical glass)
        thickness: 0.1,            // how deep the light bends through it
        reflectivity: 0.9,
        envMapIntensity: 1.0
    })
    const effectGeo = new THREE.CylinderGeometry(3.1,3.1,1,32,1,true)
    const effectMesh = new THREE.Mesh(effectGeo,effect)
    effectMesh.position.copy(pos)

    const cylinderGroup = new THREE.Group()

    cylinderGroup.add(CylinderMesh,effectMesh)

    return cylinderGroup;
}