import * as THREE from "three";


gsap.registerPlugin(ScrollTrigger);
export function Box() {
  // const bm = new THREE.MeshStandardMaterial({
  //     color: 0xff0000,
  //     metalness: 0.3,
  //     roughness: 0.4
  // });
  // const bm = new THREE.MeshBasicMaterial({color: 0xff0000})
  const bg = new THREE.BoxGeometry(5, 5, 5);
  const bm = new THREE.MeshNormalMaterial();
  const bme = new THREE.Mesh(bg, bm);
  bme.position.set(-5, 0, 0);
  return bme;
}
