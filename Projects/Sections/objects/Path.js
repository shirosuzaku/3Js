import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Path{
    constructor(scene,path){
        this.group = new THREE.Group()
        let mat = new THREE.ShaderMaterial({
            uniforms: {
                u_color: { value : new THREE.Color(0x4e1c42)},
                u_progress: {value : 0.0}
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  vec4 worldPos = modelMatrix * vec4(position, 1.0);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                uniform float u_progress;
                varying vec2 vUv;
                
                void main() {
                  float alp = 0.0;
                  if(vUv.y < u_progress){
                    alp = 1.0;
                //   }else if(vUv.y < u_progress + 0.1){
                //     alp = smoothstep(u_progress+ 0.1,u_progress ,vUv.y);
                  }else{
                    alp = 0.0;  
                  }
                    //   vec3 clr = mix(u_color,vec3(0.0),vUv.y);
                  gl_FragColor = vec4(vec3(u_color),alp);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        })
        this.instance = new THREE.Mesh(
            new THREE.PlaneGeometry(1,20),
            mat
        )
        this.instance.rotateX(Math.PI * 0.5)
        // this.instance.position.z = 10
        this.instance.position.y = 0.05
        
        this.circle = new THREE.Mesh(
            new THREE.CircleGeometry(0.5,32),
            mat
        )
        this.circle.material = this.circle.material.clone()
        this.circle.material.uniforms.u_progress.value = 1.0
        this.circle.rotateX(Math.PI * 0.5)
        this.circle.position.y = 0.05

        this.instanceGroup = new THREE.Group().add(this.instance,this.circle)

        // this.instanceGroup.rotateY(Math.PI * -1.0)

        this.collection = []

        // scene.add(this.instanceGroup)
        for (let i = 0; i < path.length; i++) {
            const element = path[i];
            if(i == 0){
                let dir,rotation
                if(element.x == path[i+1].x){
                    dir = element.z - path[i+1].z
                    rotation = Math.PI * Math.sign(dir) * -1
                }else{
                    dir = element.x - path[i+1].x
                    rotation = Math.PI * Math.sign(dir) * -0.5
                }

                console.log(dir,element.x , path[i+1].x)
                const line = new THREE.Mesh(
                    new THREE.PlaneGeometry(1,dir * Math.sign(dir)),
                    mat
                )
                line.position.z = (dir * Math.sign(dir)) * 0.5
                line.position.y = 0.1
                line.rotateX(Math.PI * 0.5)
                const cr = this.circle.clone()
                cr.position.y = 0.1
            
                const lineGroup = new THREE.Group().add(line,cr)


                this.collection.push(lineGroup)
                lineGroup.children[0].material = lineGroup.children[0].material.clone()
                lineGroup.children[1].material = lineGroup.children[1].material.clone()
                lineGroup.position.copy(element)
                lineGroup.rotateY( rotation)
                scene.add(lineGroup)
            }else{
                let dir,rotation
                if(!path[i+1]){return}

                if(element.x == path[i+1].x && path[i+1]){
                    dir = element.z - path[i+1].z
                    rotation = (Math.PI * 0.5) +  (Math.PI * 0.5) * Math.sign(dir) 
                }else if(path[i+1]){
                    dir = element.x - path[i+1].x
                    rotation = Math.PI * Math.sign(dir) * -0.5
                }

                const line = new THREE.Mesh(
                    new THREE.PlaneGeometry(1,dir * Math.sign(dir)),
                    mat
                )
                line.position.z = (dir * Math.sign(dir)) * 0.5
                line.position.y = 0.1
                line.rotateX(Math.PI * 0.5)
                const cr = this.circle.clone()
                cr.position.y = 0.1
                // cr.position.x = dir
            
                const lineGroup = new THREE.Group().add(line,cr)


                this.collection.push(lineGroup)
                lineGroup.children[0].material = lineGroup.children[0].material.clone()
                lineGroup.children[1].material = lineGroup.children[1].material.clone()
                lineGroup.position.copy(element)
                lineGroup.rotateY( rotation)
                scene.add(lineGroup)

            }
        }
    }
    updatePath(index,progress){
        if(this.collection.length > 0){
            this.collection[index].children[0].material.uniforms.u_progress.value = progress 
        }
    }
}