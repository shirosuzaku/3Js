import * as THREE from 'three';

export function Board() {
  const geo = new THREE.PlaneGeometry(15, 15);

  const mat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv * 15.0; // scale UVs to match plane size
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        // floor the UVs to get integer grid coordinates
        float x = floor(vUv.x);
        float y = floor(vUv.y);
        // checker pattern: alternate black/white
        float c = mod(x + y, 2.0);
        vec3 color = mix(vec3(1.0), vec3(0.0), c); // white/black
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geo, mat);
//   mesh.rotation.x = -Math.PI / 2; // rotate to lie flat
  return mesh;
}
