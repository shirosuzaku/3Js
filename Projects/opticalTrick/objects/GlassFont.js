import * as THREE from 'three';
import { GUI } from "dat.gui";

export function GlassFont(mainScene) {
    const gui = new GUI();
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { format: THREE.RGBAFormat });
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    let textmesh
    const loader = new THREE.FontLoader();
    loader.load("Techno Hideo_Bold.json", (font) => {

        const textGeo = new THREE.TextGeometry("COOL", {
            font: font,
            size: 1.5,
            height: 0.2,
        });
        textGeo.computeBoundingBox();

        const box = textGeo.boundingBox;
        const xOffset = -0.5 * (box.max.x - box.min.x);
        const yOffset = -0.5 * (box.max.y - box.min.y);
        const zOffset = -0.5 * (box.max.z - box.min.z);

        // Center the geometry itself
        textGeo.translate(xOffset, yOffset, zOffset);
        const textMat = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const bm = new THREE.MeshPhysicalMaterial({
            envMap: cubeRenderTarget.texture,
            color: 0xffffff,
            envMapIntensity: 1,
            transmission: 1,
            roughness: 0,
            metalness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            ior: 1.33             // Index of refraction (like real water)
        });
        bm.envMap.mapping = THREE.CubeRefractionMapping;


        const textMesh = new THREE.Mesh(textGeo, bm);
        textMesh.position.set(0, 0, 4);
        textmesh = textMesh
        cubeCamera.position.set(0, 0, 4);
        mainScene.add(textMesh);

        // GUI controls
    const matFolder = gui.addFolder("Bubble Material");
    matFolder.add(bm, "transmission", 0, 1, 0.01);
    // matFolder.add(bm, "thickness", 0, 5, 0.01);
    matFolder.add(bm, "roughness", 0, 1, 0.01);
    matFolder.add(bm, "metalness", 0, 1, 0.01);
    matFolder.add(bm, "clearcoat", 0, 1, 0.01);
    matFolder.add(bm, "clearcoatRoughness", 0, 1, 0.01);
    matFolder.add(bm, "ior", 1, 2.5, 0.01).name("Index of Refraction");
    matFolder.add(bm, "envMapIntensity", 0, 3, 0.01);
    matFolder.open();
    });

    return { mesh: textmesh, camera: cubeCamera }
}