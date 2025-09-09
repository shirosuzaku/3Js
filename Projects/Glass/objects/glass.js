import * as THREE from "three";

export function Glass(pos) {
    const group = new THREE.Group()

    const nm = new THREE.MeshNormalMaterial();
    const wm = new THREE.MeshStandardMaterial({wireframe: true , color: 0xff99ff});
    const shm = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uRadius: {value: 0.45},
        },
        vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uRadius;
            void main(){
                float dist = distance(vUv,vec2(0.5));
                float alpha = smoothstep(uRadius,0.8,dist);
                gl_FragColor = vec4(1.0,1.0,1.0,alpha);
            }
        `,
    })
    const effect = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,         // like "opacity for physical materials"
        transparent: true,         // needed for opacity to work
        // opacity: 0.5,
        // opacity: 1.0,
        // ior: 5.0,                  // index of refraction (1.5 = typical glass)
        // thickness: 0.1,            // how deep the light bends through it
        // reflectivity: 0.9,
        // envMapIntensity: 1.0,
        // side: THREE.DoubleSide
        
    })
    const sm = new THREE.MeshStandardMaterial({
        color: 0x340034,
        side: THREE.DoubleSide,
        transparent: true,
        // opacity: 0
    })

    const cGeo = new THREE.CylinderGeometry(3.1,3.1,1,32,1,true)
    const cGeo2 = new THREE.CylinderGeometry(3.009,3.009,1,32,1,true)
    const cGeo3 = new THREE.CylinderGeometry(2.9,2.9,1,32,1)
    const ring = new THREE.Mesh(cGeo3,sm)

    const effectGeo = new THREE.PlaneGeometry(10,10,1)
    // const effectMesh = new THREE.Mesh(effectGeo,shm)
    const effectMesh = new THREE.Mesh(cGeo2,shm)
    effectMesh.castShadow = true

    
    // const guide = new THREE.Mesh(effectGeo,effect)
    const guide = new THREE.Mesh(cGeo,effect)
    // guide.receiveShadow = true
    // guide.position.z += 0.001

    // group.add(guide)
    // group.add(guide,ring)
    group.position.copy(pos)
    group.add(effectMesh,guide,ring)

    return {group};
}