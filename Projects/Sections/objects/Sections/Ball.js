import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function Ball(mainScene,poi){

    const section = new THREE.Group()
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1,32,32),
        new THREE.MeshNormalMaterial()
    )
    section.add(sphere)
    section.position.copy(poi)
    mainScene.add(section)


    const update = () => {

    }
    return {
        update: update
    }
}