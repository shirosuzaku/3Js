import * as THREE from 'three';

export function Band(mainScene){

    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5,0,0),
        new THREE.Vector3(0,0,-2),
        new THREE.Vector3(5,0,5)
    ])

    // const geo = new THREE.TubeGeometry(path,100,0.5,2)
    // const mat = new THREE.MeshBasicMaterial({color: 0x00ffff})
    // const band = new THREE.Mesh(geo,mat)

    const points = path.getPoints(100)
    const pos = []
    const width = 0.25

    for(let i = 0;i < points.length; i++){
        const p = points[i]
        const tangent  = path.getTangent(i/(points.length-1)).normalize()
        const normal = new THREE.Vector3(-tangent.y,tangent.x,0).normalize()
        const left = p.clone().addScaledVector(normal,width)
        const right = p.clone().addScaledVector(normal,-width)
        pos.push(
            left.x,left,y,left.z,
            right.x,right,y,right.z,
        )
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3))

    const indices = []
    for(let i =0 ; i < points.length - 1; i++){
        const a = i * 2,b = a + 1, c = a + 2, d = a + 3
        indices.push(a,b,c,d)
    }
    geo.setIndex(indices)
    const mat = new THREE.MeshBasicMaterial({color: 0x00ffff,side: THREE.DoubleSide})

    const band  = new THREE.Mesh(geo,mat)

    mainScene.add(band)

}

// 2292