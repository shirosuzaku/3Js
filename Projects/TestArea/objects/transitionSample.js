
// === Test Objects ===

// Create Object A (Sphere)
const geometryA = new THREE.SphereGeometry(1, 32, 32)
const geometry3 = new THREE.BoxGeometry(1.5, 1.5, 1.5)
const geometryB = new THREE.ConeGeometry(1,1,32,32)

const material = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  metalness: 0.4,
  roughness: 0.3
})
const materialA = new THREE.MeshStandardMaterial({ color: 0x0077ff, metalness: 0.4, roughness: 0.3 })
const materialB = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.2, roughness: 0.5 })


const objectA = new THREE.Mesh(geometryA, material)
const objectB = new THREE.Mesh(geometryB, material)
const object3 = new THREE.Mesh(geometry3, material)
objectA.name = 'objectA'
objectB.name = 'objectB'
objectB.visible = false

object3.position.set(2,0,2)

mainScene.add(objectA,objectB,object3)



// Optional: Add a light for better visuals
const light = new THREE.PointLight(0xffffff, 2)
light.position.set(3, 3, 3)
mainScene.add(light)

const ambient = new THREE.AmbientLight(0x404040)
mainScene.add(ambient)

// Store camera reference for transitions that need it
mainScene.userData.camera = mainCamera


// ✅ Example test usage
setTimeout(() => {
  transition(mainScene, 1) // Try type 1–8
}, 2000)


