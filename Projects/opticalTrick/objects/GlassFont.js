import * as THREE from 'three';

export function GlassFont() {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { format: THREE.RGBAFormat });
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    let textmesh
    const loader = new THREE.FontLoader();
    loader.load("../static/techno_hideo_bold.ttf", (font) => {
        console.log(font)
        const textGeo = new THREE.TextGeometry("The big quick brown fox jumped over the lazy dog", {
            font: font,
            size: 0.5,
            height: 0.1,
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
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.set(-0.75, 0, 2);
        textmesh = textMesh
        // mainScene.add(textMesh);
    });

    return { mesh: textmesh, camera: cubeCamera }
}