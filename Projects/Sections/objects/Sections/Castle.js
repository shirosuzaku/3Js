import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function Castle(mainScene,poi){

    const section = new THREE.Group()
    const castle = new THREE.Mesh(
        new THREE.BoxGeometry(2,2,2),
        new THREE.MeshNormalMaterial()
    )
    section.add(castle)
    section.position.copy(poi)
    mainScene.add(section)

    const update = () => {

    }
    return {
        update: update
    }
}