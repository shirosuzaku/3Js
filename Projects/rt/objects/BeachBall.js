import * as THREE from "three";


export function BeachBall() {

    const material = new THREE.ShaderMaterial({
        vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vNormal = normal;
            // vPosition = position;
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x ,position.y,position.z, 1.0);
          }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // just output red to test
                // float normalizedY = (vPosition.y + 1.0) * 0.5;
                // vec3 color = vec3(h, 0.0, 1.0 - h);
                // float h = (vPosition.y + 1.0) * 0.5;
                
                float h = vUv.x;
                float h2 = vUv.y ;
                float h3 = (vPosition.z + 3.0 ) * 0.25 ;
                vec3 color = vec3(h, 0.0, 0.0);
                gl_FragColor = vec4(color, 1.0);
          }
        `
    });

    const boxMesh = new THREE.Mesh(
        // new THREE.SphereGeometry(3, 64, 64),
        new THREE.BoxGeometry(2,2,2),
        material
    );
    boxMesh.position.set(0,0,0)
    // new THREE.MeshBasicMaterial({ color: 0xffffff })
    // new THREE.MeshBasicMaterial({ color: 0xff0000 })
    return boxMesh
}