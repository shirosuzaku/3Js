import * as THREE from 'three';
import gsap from 'gsap'
import { NeonGridMaterial } from './NeonGridMaterial';

export function Paralax(mainScene,mainCamera = THREE.PerspectiveCamera){
    const fog = new THREE.Fog(0x000000,5,10)
    mainScene.fog = fog

    const vfov = THREE.MathUtils.degToRad(mainCamera.fov)
    const planez = -10
    const height = 2 * Math.tan(vfov/2) * Math.abs(planez)
    const width = height * mainCamera.aspect
    console.log(height,width)

    let mat = NeonGridMaterial({
        gridCount: 10,
        speed: 0.2,
        lineWidth: 0.04,
        glow: 0.03,
        colorA: 0x00ffd1,
        colorB: 0xff00d4,
        bg: 0x03030a
    })
    let mat2 = NeonGridMaterial({
        gridCount: 10,
        speed: 0.2,
        lineWidth: 0.04,
        glow: 0.03,
        colorA: 0x00ffd1,
        colorB: 0xff00d4,
        bg: 0x03030a
    })
    console.log("one",mat.uniforms,"two",mat2.uniforms)

    // mat2.uniforms.u_upward.value = false

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width,height*1),
        mat
    )
    plane.position.z = planez/2
    plane.translateY(height/2)
    plane.position.y = -height / 2
    plane.rotateX(Math.PI*-0.5)

    const plane2 = new THREE.Mesh(
        new THREE.PlaneGeometry(width,height),
        mat
    )
    plane2.position.z = planez/2
    plane2.translateY(height/2)
    plane2.position.y = height / 2
    plane2.rotateX(Math.PI*0.5)
    plane2.rotateZ(Math.PI)
    const plane3 = new THREE.Mesh(
        new THREE.PlaneGeometry(height,height),
        mat2
    )
    plane3.position.z = planez/2
    plane3.translateX(width/2)
    plane3.position.x = width / 2
    plane3.rotateY(Math.PI*-0.5)
    plane3.rotateZ(Math.PI)
    

    const plane4 = new THREE.Mesh(
        new THREE.PlaneGeometry(height,height),
        mat2
    )
    plane4.position.z = planez/2
    plane4.translateX(width/2)
    plane4.position.x = -width / 2
    plane4.rotateY(Math.PI*0.5)

    let scale = 1.5

    const grid = new THREE.GridHelper(width,10,0xffffff,0xffffff)
    grid.position.copy(plane.position)
    grid.position.y += 0.01
    grid.position.z = -height * 0.5
    grid.scale.set(1,1,scale)

    const grid2 = new THREE.GridHelper(width,10,0xffffff,0xffffff)
    grid2.position.copy(plane2.position)
    grid2.position.y -= 0.01
    grid2.position.z = -height * 0.5
    grid2.scale.set(1,1,scale)

    const grid3 = new THREE.GridHelper(width,10,0xffffff,0xffffff)
    grid3.position.copy(plane3.position)
    grid3.position.x -= 0.01
    grid3.position.z = -height * 0.5
    grid3.rotateZ(Math.PI*0.5)
    grid3.scale.set(1,1,scale)

    const grid4 = new THREE.GridHelper(width,10,0xffffff,0xffffff)
    grid4.position.copy(plane4.position)
    grid4.position.x += 0.01
    grid4.position.z = -height * 0.5
    grid4.rotateZ(Math.PI*0.5)
    grid4.scale.set(1,1,scale)

    gsap.to(grid.position,{
        z:height * 0.5,
        duration:2 ,
        repeat: -1,
        ease: "none"
    })
    gsap.to(grid2.position,{
        z:height * 0.5,
        duration:2 ,
        repeat: -1,
        ease: "none"
    })
    gsap.to(grid3.position,{
        z:height * 0.5,
        duration:2 ,
        repeat: -1,
        ease: "none"
    })
    gsap.to(grid4.position,{
        z:height * 0.5,
        duration:2 ,
        repeat: -1,
        ease: "none"
    })

    // grid.rotation.copy(plane.rotation)

    const vector = new THREE.Vector3()
    let dir , pos , dist = 10
    
    let dir2 = new THREE.Vector3()

    // grid.position.set(0,-5,0)
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    box.position.z = -10
    mainScene.add(
        box,
        // grid,grid2,grid3,grid4,
        plane,plane2,plane3,plane4
    )
    const clock = new THREE.Clock()
    const update = () => {
        // mat.uniforms.u_time.value = clock.getElapsedTime()
        // mat2.uniforms.u_time.value = clock.getElapsedTime()
        // plane.rotateX(0.1)
        // vector.unproject(mainCamera)
        // dir = vector.sub(mainCamera.position).normalize()
        // dir2 = mainCamera.getWorldDirection(vector)
        // pos = mainCamera.position.clone().add(dir2.multiplyScalar(dist))
        // // console.log(pos)

        // plane.position.copy(pos)
        // grid.position.copy(pos)
    }
    return {update: update}
}