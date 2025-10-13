import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import { GUI } from 'dat.gui'

export function modelTest(mainScene) {

    const loader = new GLTFLoader()
    const loader2 = new THREE.CubeTextureLoader();
    const envMap = loader2.load([
        '3/px.jpg', '3/nx.jpg',
        '3/py.jpg', '3/ny.jpg',
        '3/pz.jpg', '3/nz.jpg'
    ]);
    mainScene.environment = envMap;
    // mainScene.background = envMap;

    loader.load('/models/untitled2.glb', gltf => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        mainScene.add(gltf.scene)
        const a = new THREE.AmbientLight(0xffffff, 1)
        const p = new THREE.PointLight(0xffffff, 1)
        const pv = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshNormalMaterial())
        const point = new THREE.Group().add(pv, p)
        p.position.set(5, 5, 5)
        pv.position.set(5, 5, 5)
        // gsap.to(point.rotation, {
        //     y: 2 * Math.PI,
        //     duration: 4,
        //     repeat: -1,
        //     ease: "none"
        // })
        const d = new THREE.DirectionalLight(0xffffff, 1)
        d.position.set(5, 8, 5)

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        )
        plane.rotateX(Math.PI * -0.5)
        p.castShadow = true
        d.castShadow = true
        p.shadow.mapSize.set(2048, 2048); // higher = sharper
        p.shadow.bias = -0.001; // fix shadow acne
        d.shadow.mapSize.set(2048, 2048); // higher = sharper
        d.shadow.bias = -0.001; // fix shadow acne
        plane.receiveShadow = true

        mainScene.add(a, point, d, plane)

        const gui = new GUI();
        const ambientFolder = gui.addFolder('Ambient Light');
        ambientFolder.addColor({ color: a.color.getHex() }, 'color')
            .onChange(v => a.color.set(v));
        ambientFolder.add(a, 'intensity', 0, 5, 0.1);

        const pointFolder = gui.addFolder('Point Light');
        pointFolder.addColor({ color: p.color.getHex() }, 'color')
            .onChange(v => p.color.set(v));
        pointFolder.add(p, 'intensity', 0, 5, 0.1);
        pointFolder.add(p.position, 'x', -10, 10, 0.1);
        pointFolder.add(p.position, 'y', -10, 10, 0.1);
        pointFolder.add(p.position, 'z', -10, 10, 0.1);

        const directFolder = gui.addFolder('Directional Light');
        directFolder.addColor({ color: d.color.getHex() }, 'color')
            .onChange(v => d.color.set(v));
        directFolder.add(d, 'intensity', 0, 5, 0.1);
        directFolder.add(d.position, 'x', -10, 10, 0.1);
        directFolder.add(d.position, 'y', -10, 10, 0.1);
        directFolder.add(d.position, 'z', -10, 10, 0.1);
    })
}