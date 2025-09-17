import * as THREE from "three";

export function createMouseTrail(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // screen plane at z=0 in world
  const planeTarget = new THREE.Vector3();

  const params = {
    enabled: true,
    type: 'line', // 'line' | 'points'
    maxPoints: 200,
    color: 0xffaa33,
    pointSize: 8,
  };

  let positions = new Array(params.maxPoints).fill(0).map(() => new THREE.Vector3());
  let count = 0;
  let needsRebuild = true;

  let currentObject = null;

  function rebuildObject() {
    if (currentObject) {
      scene.remove(currentObject);
      currentObject.geometry.dispose();
      currentObject.material.dispose();
      currentObject = null;
    }

    const positionArray = new Float32Array(params.maxPoints * 3);
    for (let i = 0; i < params.maxPoints; i++) {
      const p = positions[i];
      positionArray[i * 3 + 0] = p.x;
      positionArray[i * 3 + 1] = p.y;
      positionArray[i * 3 + 2] = p.z;
    }

    if (params.type === 'line') {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      const material = new THREE.LineBasicMaterial({ color: params.color, transparent: true, opacity: 1.0 });
      currentObject = new THREE.Line(geometry, material);
    } else {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      const material = new THREE.PointsMaterial({ color: params.color, size: params.pointSize, sizeAttenuation: true, transparent: true });
      currentObject = new THREE.Points(geometry, material);
    }

    scene.add(currentObject);
    needsRebuild = false;
  }

  function updateGeometry() {
    if (!currentObject) return;
    const posAttr = currentObject.geometry.getAttribute('position');
    for (let i = 0; i < params.maxPoints; i++) {
      const p = positions[i];
      posAttr.array[i * 3 + 0] = p.x;
      posAttr.array[i * 3 + 1] = p.y;
      posAttr.array[i * 3 + 2] = p.z;
    }
    posAttr.needsUpdate = true;
  }

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Intersect with plane z=0 in world space
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, planeTarget);

    // Push to buffer (circular)
    positions.push(planeTarget.clone());
    if (positions.length > params.maxPoints) positions.shift();
    count = Math.min(count + 1, params.maxPoints);
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove);

  function setType(newType) {
    if (params.type === newType) return;
    params.type = newType;
    needsRebuild = true;
  }

  function setEnabled(v) {
    params.enabled = v;
    if (currentObject) currentObject.visible = v;
  }

  function setColor(c) {
    params.color = new THREE.Color(c).getHex();
    if (currentObject && currentObject.material) {
      currentObject.material.color.setHex(params.color);
    }
  }

  function setPointSize(s) {
    params.pointSize = s;
    if (currentObject && currentObject.material && currentObject.material.size !== undefined) {
      currentObject.material.size = params.pointSize;
    }
  }

  function setMaxPoints(n) {
    params.maxPoints = Math.max(10, Math.floor(n));
    // resize buffer
    if (positions.length > params.maxPoints) positions = positions.slice(-params.maxPoints);
    if (positions.length < params.maxPoints) {
      const deficit = params.maxPoints - positions.length;
      for (let i = 0; i < deficit; i++) positions.unshift(positions[0]?.clone() || new THREE.Vector3());
    }
    needsRebuild = true;
  }

  function update() {
    if (!params.enabled) return;
    if (!currentObject || needsRebuild) rebuildObject();
    updateGeometry();
  }

  function dispose() {
    renderer.domElement.removeEventListener('mousemove', onMouseMove);
    if (currentObject) {
      scene.remove(currentObject);
      currentObject.geometry.dispose();
      currentObject.material.dispose();
      currentObject = null;
    }
  }

  // initial build
  rebuildObject();

  return {
    params,
    object: () => currentObject,
    update,
    setType,
    setEnabled,
    setColor,
    setPointSize,
    setMaxPoints,
    dispose,
  };
}


