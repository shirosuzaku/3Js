import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ball } from "./Ball";
import { Castle } from "./Castle";

gsap.registerPlugin(ScrollTrigger);

export function Base(mainScene = new THREE.Scene,mainCamera = new THREE.PerspectiveCamera,mainControls = new OrbitControls){


    const gridh = new THREE.GridHelper(100,100)
    mainScene.add(gridh)
    mainCamera.position.set(5,5,5)

    Ball(mainScene,new THREE.Vector3(0,0,0))
    Castle(mainScene,new THREE.Vector3(-10,0,-10))
    
    const update = () => {

    }
    return {
        update: update
    }
}