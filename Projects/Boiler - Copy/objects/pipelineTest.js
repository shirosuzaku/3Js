import * as THREE from "three";

export function addPipelineTestObjects(scene) {
  const textureLoader = new THREE.TextureLoader();

  // Close object: PBR material with full texture set
  const doorColor = textureLoader.load("/static/door/color.jpg");
  const doorAo = textureLoader.load("/static/door/ambientOcclusion.jpg");
  const doorNormal = textureLoader.load("/static/door/normal.jpg");
  const doorRoughness = textureLoader.load("/static/door/roughness.jpg");
  const doorMetalness = textureLoader.load("/static/door/metalness.jpg");
  const doorHeight = textureLoader.load("/static/door/height.jpg");

  const closeGeometry = new THREE.SphereGeometry(1.25, 64, 64);
  const closeMaterial = new THREE.MeshStandardMaterial({
    map: doorColor,
    aoMap: doorAo,
    normalMap: doorNormal,
    roughnessMap: doorRoughness,
    metalnessMap: doorMetalness,
    displacementMap: doorHeight,
    displacementScale: 0.05,
    metalness: 0.5,
    roughness: 0.6,
  });

  const closeMesh = new THREE.Mesh(closeGeometry, closeMaterial);
  closeMesh.position.set(0, 1.25, 0);

  // Far object: custom ShaderMaterial (simple gradient + lambert-like shading)
  const farGeometry = new THREE.TorusKnotGeometry(4, 1.2, 200, 32);

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      // simple directional light
      vec3 lightDir = normalize(vec3(0.6, 0.8, 0.4));
      float ndl = max(dot(normalize(vNormal), lightDir), 0.0);
      // world-space gradient by height
      float h = clamp((vWorldPos.y + 50.0) / 100.0, 0.0, 1.0);
      vec3 base = mix(vec3(0.05, 0.2, 0.6), vec3(0.9, 0.4, 0.2), h);
      vec3 color = base * (0.2 + 0.8 * ndl);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const farMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
  });

  const farMesh = new THREE.Mesh(farGeometry, farMaterial);
  farMesh.position.set(0, 0, -200);

  scene.add(closeMesh, farMesh);

  return { closeMesh, farMesh };
}


