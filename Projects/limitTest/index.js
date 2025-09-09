import { sceneInstance } from './main'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const canvasList = document.querySelectorAll('canvas')


const gloader = new GLTFLoader()

function loadGLB(url) {
    return new Promise((resolve, reject) => {
        gloader.load(
            url,
            gltf => resolve(gltf),
            undefined,
            error => reject(error)
        );
    });
}

// Usage
// loadGLB('./models/chips/untitled.glb')
loadGLB('./models/prime/prime.glb')
.then(gltf => {
    console.log('Model loaded!', gltf);
    // scene.add(gltf.scene);
    canvasList.forEach((c,i)=>{
        if(i == 0 ){
            sceneInstance(c,{x: c.getBoundingClientRect().width,y:c.getBoundingClientRect().height},gltf)
        }else{
            sceneInstance(c,{x: c.getBoundingClientRect().width,y:c.getBoundingClientRect().height})
        }
    })
})
.catch(error => {
    console.error('Error loading model:', error);
});
  
