import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

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

  function animate() {
    bme.rotation.x += 0.01;
    bme.rotation.y += 0.01;
    requestAnimationFrame(animate);
  }
  // animate();
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".htmltimeline",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: true,
    },
  });

  tl.to(bme.position, {
    x: 5,
    duration: 2,
  });

  return bme;
}
