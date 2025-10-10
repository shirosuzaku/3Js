import * as THREE from 'three';
import gsap from 'gsap'

const doubleLarp = (OldMin, OldMax, NewMin, NewMax, OldValue) => {
    let OldRange = (OldMax - OldMin)
    let NewRange = (NewMax - NewMin)
    let NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
    return NewValue
  }

export function ImageGrid(mainScene = new THREE.Scene()){
    const loader = new THREE.TextureLoader()
    let componets = []
    const planes = new THREE.Group()
    
    loader.load('img5.jpg', (texture) => {
        let size = 5
        const aspect = texture.image.width / texture.image.height;

        let grid = [
            ['a','a','b','c'],
            ['a','a','d','e'],
            ['f','g','h','h'],
            ['i','j','h','h'],
        ]
        // grid = [
        //         ['a','e','b','c'],
        //         ['d','r','r','r'],
        //         ['f','r','r','r'],
        //         ['i','r','r','r'],
        // ]
        grid.reverse()


        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const label = grid[y][x];
                let comp = componets.find(c=> c.label === label)
                if(!comp){
                    comp = {
                        label,
                        corner: {x: x,y: y},
                        center: {x: x,y: y},
                        count: 1,
                        size: Math.sqrt(1)
                    }
                    componets.push(comp)
                }else{
                    if(comp.corner.x > x)
                        comp.corner.x = x
                    if(comp.corner.y < y)
                        comp.corner.y = y
                    comp.count += 1
                    comp.size = Math.sqrt(comp.count)
                    comp.center.x = (comp.corner.x + (comp.corner.x + comp.size - 1)) / 2
                    comp.center.y = (comp.corner.y + (comp.corner.y - comp.size + 1)) / 2
                }
            }
        }

        componets.forEach((c,i)=>{
            let t = texture.clone()
            t.repeat.set(c.size/grid.length   ,c.size/ grid.length)
            console.log(c.label,c.corner)
            t.offset.set(c.corner.x/grid.length,((c.corner.y - c.size)/grid.length) + (1/grid.length))
            // (c.corner.y - c.size)/grid.length
            t.needsUpdate = true

            // console.log(grid.length / c.size)

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(c.size,c.size),
                new THREE.MeshBasicMaterial({
                    map: t,
                    side: THREE.DoubleSide
                })
            )
            plane.translateX(c.center.x)
            plane.translateY(c.center.y)
            planes.add(plane)
        })

        console.table(componets)


        const g = new THREE.GridHelper(10,10,0xffffff,0x000000)
        g.rotateX(Math.PI*0.5)

        // texture.repeat.set(1,1)
        // texture.offset.set(0,0)
        // texture.colorSpace = THREE.SRGBColorSpace;
        // texture.needsUpdate = true;



        mainScene.add(planes,g)

        // planes.children.forEach((c,i)=>{
        //     let tl = gsap.timeline({repeat: -1,yoyo: true})
        //     tl.to(c.rotation,{
        //         y: Math.PI,
        //         duration: 1,
        //     })
        // })
    })
    const update = () => {
    }
    return {update: update}
}