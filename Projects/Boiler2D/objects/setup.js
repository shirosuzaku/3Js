import * as THREE from "three";

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
}

export function Setup(targetCanvas, sceneColor) {
    const renderer = new THREE.WebGL1Renderer({
        canvas: targetCanvas,
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.width, size.height);
    renderer.setClearColor(sceneColor);

    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    const mainCamera = new THREE.OrthographicCamera(
        -halfWidth,
        halfWidth,
        halfHeight,
        -halfHeight,
        0.1,
        1000
    );
    mainCamera.position.set(0, 0, 10);
    mainCamera.lookAt(0, 0, 0);

    return { renderer, mainCamera };
}
