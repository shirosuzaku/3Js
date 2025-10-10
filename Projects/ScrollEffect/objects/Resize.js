export function Resize(camera, renderer) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (camera.isOrthographicCamera) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
  } else if (camera.isPerspectiveCamera) {
    camera.aspect = width / height;
  }

  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
}