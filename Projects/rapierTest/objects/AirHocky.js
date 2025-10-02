import * as THREE from 'three';
import RAPIER from "@dimforge/rapier3d-compat";


import { Disk } from "./Disk"
import { Table } from "./Table"
// const trackpad = document.getElementById('trackpad')

export function AirHocky(mainScene,world,trackpad) {

    trackpad.style.display = "block"
    // 18 x 10 | 0.8
    let mouseD = false
    let t = Table(world)
    mainScene.add(t.Mesh)
    // disk
    let horizontal = { min: 5 - 1.3, max: -5 + 1.3 }
    let vertical = { min: 2, max: 9 - 1.3 }

    let dsc = Disk(world, new THREE.Vector3(5, 1.3, 0), 0.2, 0.5)
    mainScene.add(dsc.Mesh)

    // puck
    let puck = Disk(world, new THREE.Vector3(3, 1.3, 0), 0.2, 0.5, true)
    mainScene.add(puck.Mesh)

    const update = () => {
        t.Mesh.position.copy(t.rigidBody.translation())
        dsc.Mesh.position.copy(dsc.rigidBody.translation())
        puck.Mesh.position.copy(puck.rigidBody.translation())
    }

    let lastx = null, lasty = null, moved
    const handleTrackpad = e => {
        e.preventDefault()
        moved = true

        if (!mouseD && e.type == 'mousemove') return;
        let xp, yp, dx, dy
        if (e.type == 'mousemove') {
            if (lastx !== null && lasty !== null) {
                dx = e.clientX - lastx
                dy = e.clientY - lasty
            }
            lastx = e.clientX
            lasty = e.clientY
        } else {
            let touch = e.touches[0]
            if (lastx !== null && lasty !== null) {
                dx = touch.clientX - lastx
                dy = touch.clientY - lasty
            }
            lastx = touch.clientX
            lasty = touch.clientY
        }
        setTimeout(() => {
            moved = false
        }, 100);


        let current = dsc.rigidBody.translation()

        console.log(current.z, dx)
        if (dx && dy) {
            let movex = current.x + dy / 20
            let movey = current.z + dx * -1 / 20
            if (movex > vertical.max)
                movex = vertical.max
            if (movex < vertical.min)
                movex = vertical.min

            if (movey < horizontal.max)
                movey = horizontal.max
            if (movey > horizontal.min)
                movey = horizontal.min
            dsc.rigidBody.setNextKinematicTranslation({
                x: movex,
                y: 1.2,
                z: movey
            })

        }

        // if(current.x + dx > horizontal.max){
        //   console.log(current.x,'true',current.x + (dx / 100))
        // }else{
        //   console.log(current.x,'false',current.x + (dx / 100))
        // }
        // mlog.innerHTML = `X - ${dx } <br/> Y- ${dy}`
        // let xx = current.z + (dx / 10)
        // console.log(xx)
        // if (xx) {
        // }

    }

    setInterval(() => {
        if (!moved) {
            lastx = null
            lasty = null
        }
    }, 50);

    trackpad.addEventListener('mousemove', handleTrackpad)
    trackpad.addEventListener('touchmove', handleTrackpad, { passive: false })
    window.addEventListener('mousedown', () => { mouseD = true })
    window.addEventListener('mouseup', () => { mouseD = false })
    // window.addEventListener('touchmove', ()=>{
//   let str = `X - ${mainCamera.position.x} <br/> Y-  ${mainCamera.position.y} <br/> Z - ${mainCamera.position.z}`
//   mlog.innerHTML = str
// })

    return { update: update}
}