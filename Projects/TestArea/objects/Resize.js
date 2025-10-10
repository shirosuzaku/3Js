let size = {
  width : window.innerWidth,
  height: window.innerHeight
}

export function Resize(camera, renderer) {
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(size.width, size.height)
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();

  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.setSize(window.innerWidth, window.innerHeight);
}
