export function Resize(camera, renderer,screenSize) {
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();

  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = screenSize.x / screenSize.y;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(screenSize.x, screenSize.y);
}
