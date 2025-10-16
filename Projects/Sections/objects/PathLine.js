import * as THREE from "three";
import gsap from "gsap";


export function PathLine(path,scene,offset){
    let hp = Math.PI * 0.5, np = 0
    const div = 0.25, width = 1
    const plane  = new THREE.Mesh(
        new THREE.PlaneGeometry(width,div),
        new THREE.MeshBasicMaterial({color: 0x000000,transparent: true,opacity: 0})
    )
    plane.rotateX(Math.PI* -0.5)
    const pg = new THREE.Group().add(plane)
    let orderdList = []
    
    for (let i = 0; i < path.length - 1; i++) {
        const element = path[i];
        let length = 0 
        const circle = new THREE.Mesh(
            new THREE.CircleGeometry(width * 0.5,16),
            new THREE.MeshBasicMaterial({color: 0x4e1c42,transparent: true,opacity: 0})
        )
        console.log("path point",element)
        circle.position.copy(element)
        circle.rotateX(Math.PI* -0.5)
        const cg = new THREE.Group().add(circle)
        
        orderdList.push(cg)
        if(offset){
            cg.translateX(offset * -1)
        }
        scene.add(cg)
        if(element.x == path[i+1].x){
            length = Math.abs((element.z - path[i+1].z) / div)
            for (let j = 0; j < length + 1; j++) {
                const plane  = new THREE.Mesh(
                    new THREE.PlaneGeometry(width,div),
                    new THREE.MeshBasicMaterial({color: 0x4e1c42,transparent: true,opacity: 0})
                )
                plane.rotateX(Math.PI* -0.5)
                const pc = new THREE.Group().add(plane)
                pc.children[0].material = pc.children[0].material.clone()
                pc.position.copy(element)
                pc.translateZ(div * j)
                orderdList.push(pc)
                if(offset){
                    pc.translateX(offset * -1)
                }
                scene.add(pc)
            }
            console.log(length)
        }else{
            length = Math.abs((element.x - path[i+1].x) / div)
            for (let j = 0; j < length + 1; j++) {
                const plane  = new THREE.Mesh(
                    new THREE.PlaneGeometry(width,div),
                    new THREE.MeshBasicMaterial({color: 0x4e1c42,transparent: true,opacity: 0})
                )
                plane.rotateX(Math.PI* -0.5)
                const pc = new THREE.Group().add(plane)
                pc.children[0].material = pc.children[0].material.clone()
                pc.position.copy(element)
                pc.translateX(div * j)
                pc.rotateY(hp)
                orderdList.push(pc)
                if(offset){
                    pc.translateX(offset * -1)
                }
                scene.add(pc)
            }
        }
    }
    let length, i ,prev , del
    const update = (ball,p) => {
        del = p - prev
        prev = p 
        // console.log(del)
        // p = p * 100
        length = orderdList.length
        i = Math.floor(p * length)        
        if(del > 0){
            for (let j = 0; j < i + 7; j++) {
                const ol = orderdList[j];
                if(ol){
                    // ol.children[0].material.opacity = 1
                    gsap.to(ol.children[0].material,{opacity: 1,duration: 0.2})
                }
            }
        }else{
            orderdList[i].children[0].material.opacity = THREE.MathUtils.lerp(orderdList[i].children[0].material.opacity,0,1)
        }

        // orderdList.forEach(ol => {
        //     let dist = ol.position.distanceTo(ball)
        //     if(dist < 1){
        //         ol.children[0].material.opacity = 0
        //     }else{
        //         ol.children[0].material.opacity = 1
        //     }
        // })
        // console.log(ball)
    }
    return {
        update: update
    }
}