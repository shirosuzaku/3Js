import * as THREE from "three";
import gsap from "gsap";

export function TextureTest(mainScene) {


    let mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    let mat2 = new THREE.MeshBasicMaterial({ color: 0xffffff })
    let mat3 = new THREE.MeshBasicMaterial({ color: 0xffffff })

    const loader = new THREE.TextureLoader()
    loader.load('img3.jpg', (texture) => {
        
        const aspect = texture.image.width / texture.image.height;
        let w = 1 , h = w * aspect
        texture.repeat.set((1/h)/2,w/2)
        texture.offset.set((w/2)*0,0.5)
        // texture.offset.set(0,0)
        texture.needsUpdate = true;

        
        mat.map = texture
        
        
        
        let size = 8
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(size,size),
            mat
        )
        const white = new THREE.Mesh(
            new THREE.PlaneGeometry(size,size),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
        const p1 = new THREE.Group()
        const p2 = new THREE.Group()
        const p3 = new THREE.Group()
        white.rotateX(Math.PI)
        let w2 = white.clone()
        // w2.position.setX(4)
        let w3 = white.clone()
        // w3.position.setX(12)
        p1.add(plane,white)


        const text2 = texture.clone()
        text2.offset.set(1/h/2,0.5)
        // console.log(w* 0.28,w,h,1/h/2)
        text2.needsUpdate = true;
        mat2.map = text2

        const plane2 = new THREE.Mesh(
            new THREE.PlaneGeometry(size,size),
            mat2
        )

        p2.add(plane2,w2)
        
        const text3 = texture.clone()
        text3.offset.set(1/h,0.5)
        // console.log(w* 0.28,w,h,1/h/2)
        text3.needsUpdate = true;
        mat3.map = text3
        
        const plane3 = new THREE.Mesh(
            new THREE.PlaneGeometry(size,size),
            mat3
        )
        // console.log(texture,text2)
        p1.position.x = -4
        p2.position.x = 4
        p3.position.x = 12
        // plane.rotateX(Math.PI * -0.5)
        p3.add(plane3,w3)

        const gridHelp = new THREE.GridHelper(20, 20, 0x000000)
        gridHelp.rotateX(Math.PI * 0.5)

        
        gsap.to(p1.rotation,{
            x: Math.PI* 2,
            yoyo: true,
            duration: 2,
            delay: 0,
            repeat: -1,
        })
        gsap.to(p2.rotation,{
            x: Math.PI* 2,
            yoyo: true,
            duration: 2,
            delay: 0.1,
            repeat: -1,
        })
        gsap.to(p3.rotation,{
            x: Math.PI* 2,
            yoyo: true,
            duration: 2,
            delay: 0.2,
            repeat: -1,
        })

        mainScene.add(
            gridHelp, 
            p1,
            p2,
            p3,
        )
    })
}