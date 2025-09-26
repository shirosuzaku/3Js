import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat"; // or 2d, depending on your project

export function createBox(world,dim,initialPos) {

  
    let dimensions = dim || new THREE.Vector3(1,1,1)
    let pos = initialPos ||new THREE.Vector3(0,6,0)
    
  const objectRB = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x,pos.y,pos.z)
  );

  // 2. Add collider (big flat box)
  world.createCollider(
    RAPIER.ColliderDesc
      .cuboid(dimensions.x * 0.5,dimensions.y * 0.5,dimensions.z * 0.5 ),
    objectRB
  );

  // 3. Create visible mesh
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(dimensions.x,dimensions.y,dimensions.z),    // full size = 2 × half extents
    new THREE.MeshStandardMaterial({ color: 0x228822 })
  );
  mesh.position.copy(pos);

  // Return both so main.js can use them
  return { rigidBody: objectRB, Mesh : mesh };
}
