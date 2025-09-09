import * as THREE from 'three';

export function Testing(scene) {
    // Point Light
    const plight = new THREE.PointLight(0xffffff, 1);
    plight.position.set(-3.1, 6, 6);
    plight.castShadow = true;

    const phelp = new THREE.PointLightHelper(plight);

    // Ambient Light
    const alight = new THREE.AmbientLight(0xffffff, 1);

    // Directional Light
    const dlight = new THREE.DirectionalLight(0xffffff, 0.8);
    dlight.position.set(3.6, 2, 10);
    dlight.target.position.set(0, 0, 0);
    dlight.castShadow = true;
    dlight.shadow.camera.left = -20;
    dlight.shadow.camera.right = 20;
    dlight.shadow.camera.top = 20;
    dlight.shadow.camera.bottom = -20;
    dlight.shadow.camera.near = 1;
    dlight.shadow.camera.far = 50;

    dlight.shadow.mapSize.width = 2048;
    dlight.shadow.mapSize.height = 2048;

    const dhelper = new THREE.DirectionalLightHelper(dlight);
    const shelper = new THREE.CameraHelper(dlight.shadow.camera);

    // spot light
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(10, 10, 10);
    spotlight.target.position.set(0, 0, 0);

    const slh = new THREE.SpotLightHelper(spotlight)
    const slch = new THREE.CameraHelper(spotlight.shadow.camera)
    
    spotlight.castShadow = true;
    spotlight.angle = 0.1; // narrow beam
    spotlight.penumbra = 0; // sharp edges
    spotlight.decay = 2;
    spotlight.distance = 30; // limit reach

    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;
    spotlight.shadow.camera.near = 1;
    spotlight.shadow.camera.far = 30;
    spotlight.shadow.focus = 1;

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    floor.rotation.x = -Math.PI / 2;
    // floor.receiveShadow = true;

    const gridHelp = new THREE.GridHelper(5,5)

    // Add to scene
    scene.add(
        // plight, 
        alight, 
        // dlight,
        gridHelp
    );
    // spotlight,slh,slch

    // Return lights for GUI
    return {
        plight,
        dlight,
        alight,
        phelp,
        dhelper,
        shelper
    };
}
