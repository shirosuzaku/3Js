import * as THREE from "three";

export function WorldGrid(mainScene, mainCamera) {
    const detecterPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshBasicMaterial({ color: 0xbbbbbb })
    )
    const detectorGroup = new THREE.Group()
    detectorGroup.add(detecterPlane)
    detecterPlane.rotateX(Math.PI * -0.5)

    const grid = new THREE.GridHelper(10, 10)

    grid.position.y = 0.001

    const mat = new THREE.MeshBasicMaterial({color: 0x333333})
    let mat2 = new THREE.ShaderMaterial({
        uniforms: {
            u_color: { value : new THREE.Color(0x00ffff)},
            u_background: {value: new THREE.Color(0x000000)},
            u_scale: {value: 10.0}
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 u_color;
            uniform vec3 u_background;
            uniform float u_scale;
            varying vec2 vUv;

            void main() {
            vec2 grid = abs(fract(vUv * u_scale - 0.5) - 0.5) / fwidth(vUv * u_scale);
            float line = min(grid.x, grid.y);
            float gridMask = 1.0 - min(line, 1.0);
            vec3 color = mix(u_background, u_color, gridMask);
            gl_FragColor = vec4(color, 1.0);
            }
        `
    })

    const gridShader = new THREE.ShaderMaterial({
        uniforms: {
          u_color: { value: new THREE.Color(0x00ffff) },
          u_background: { value: new THREE.Color(0x000000) },
          u_scale: { value: 10.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          #extension GL_OES_standard_derivatives : enable
          precision mediump float;
      
          uniform vec3 u_color;
          uniform vec3 u_background;
          uniform float u_scale;
          varying vec2 vUv;
      
          void main() {
            vec2 scaledUV = vUv * u_scale;
            vec2 grid = abs(fract(scaledUV) - 0.5);
            float line = min(grid.x, grid.y);
      
            float thickness = fwidth(line);
            float mask = 1.0 - smoothstep(0.0, thickness, line);
      
            vec3 color = mix(u_background, u_color, mask);
            gl_FragColor = vec4(color, 1.0);
          }
        `
      });
    const wgrid = new THREE.Mesh(
        new THREE.PlaneGeometry(400,400),
        gridShader
    )
    wgrid.rotateX(Math.PI * -0.5)



    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = e => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

        raycaster.setFromCamera(pointer, mainCamera);

        const intersect = raycaster.intersectObjects(detectorGroup.children, true)

        if (intersect.length != 0) {
            console.log(intersect[0])
        }
    }

    window.addEventListener('mousemove', onMouseMove);


    const update = () => {

    }

    mainScene.add(
        detectorGroup,
        // grid,
        wgrid
    )
    return update
}