import * as THREE from "three";
import { GUI } from "dat.gui";

export function Glass() {
    const gui = new GUI();

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { format: THREE.RGBAFormat });
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    const bg = new THREE.SphereGeometry(1, 32, 32);
    // const bg = new THREE.BoxGeometry(2, 2, 2);
    const bm = new THREE.MeshPhysicalMaterial({
        envMap: cubeRenderTarget.texture,
        // color: 0xffffff,
        envMapIntensity: 1,
        transmission: 1,
        thickness: 0.5,       // Refraction depth
        roughness: 0,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        ior: -1.33             // Index of refraction (like real water)
    });
    bm.envMap.mapping = THREE.CubeRefractionMapping;
    const bme = new THREE.Mesh(bg, bm);
    bme.position.set(0, 0, 4);
    cubeCamera.position.set(0,0,4)

    // GUI controls
    const matFolder = gui.addFolder("Bubble Material");
    matFolder.add(bm, "transmission", 0, 1, 0.01);
    // matFolder.add(bm, "thickness", 0, 5, 0.01);
    matFolder.add(bm, "roughness", 0, 1, 0.01);
    matFolder.add(bm, "metalness", 0, 1, 0.01);
    matFolder.add(bm, "clearcoat", 0, 1, 0.01);
    matFolder.add(bm, "clearcoatRoughness", 0, 1, 0.01);
    matFolder.add(bm, "ior", -1, 2.5, 0.01).name("Index of Refraction");
    matFolder.add(bm, "envMapIntensity", 0, 3, 0.01);
    matFolder.open();

    return { mesh: bme, cc: cubeCamera };
}
