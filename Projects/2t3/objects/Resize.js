export function Resize(camera, renderer) {
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();

  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = 400 / 300;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(400, 300);
}
