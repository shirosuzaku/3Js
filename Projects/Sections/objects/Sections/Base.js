import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ball } from "./Ball";
import { Castle } from "./Castle";

gsap.registerPlugin(ScrollTrigger);

export async function Base(mainScene = new THREE.Scene,mainCamera = new THREE.PerspectiveCamera,mainControls = new OrbitControls){


    const gridh = new THREE.GridHelper(100,100,0x4e1c42,0x4e1c42)
    // mainScene.add(gridh)
    mainCamera.position.set(5,5,5)
    gridh.position.y = -0.01


    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200,200),
        new THREE.MeshBasicMaterial({color: 0x9b9b9b})
    )
    ground.receiveShadow = true
    ground.rotateX(Math.PI * -0.5)
    ground.position.y = -0.02
    mainScene.add(ground)

    // 0x9b9b9b
    // 0x4e1c42

    let ball , castle 
    ball = await Ball(mainScene,new THREE.Vector3(0,0,0),mainCamera,mainControls)
    castle = await Castle(mainScene,new THREE.Vector3(17,0,0),ball.mesh,ball.lp,mainCamera,mainControls)

    const updates = () => {
        castle.update()
    }
    return {
        update  : updates
    }
}