import * as THREE from 'three';

export function Lighting(scene,renderer) {
    const ambient = new THREE.AmbientLight(0xffffff, 0.2)
    const directional = new THREE.DirectionalLight(0xffffff, 1)
    directional.position.set(3, 5, 2)
    directional.castShadow = true
    scene.add(ambient, directional)

    const loader = new THREE.CubeTextureLoader()
    const envMap = loader.load([
        '3/px.jpg', '3/nx.jpg',
        '3/py.jpg', '3/ny.jpg',
        '3/pz.jpg', '3/nz.jpg'
    ])
    scene.environment = envMap

    // const pmrem = new THREE.PMREMGenerator(renderer)
    // new THREE.RGBELoader().load('studio_env.hdr', (hdrMap) => {
    // const envMap = pmrem.fromEquirectangular(hdrMap).texture
    // scene.environment = envMap
    // hdrMap.dispose()
    // })
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
}