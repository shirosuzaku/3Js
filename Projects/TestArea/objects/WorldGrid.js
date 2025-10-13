import * as THREE from "three";
import gsap from 'gsap';
import { GUI } from 'dat.gui';

export function WorldGrid(mainScene,mainControls) {
    
  let mat = new THREE.ShaderMaterial({
        uniforms: {
            u_color: { value : new THREE.Color(0x4e1c42)},
            u_background: {value: new THREE.Color(0x9b9b9b)},
            u_target: {value: new THREE.Vector3(0,0,0)},
            u_scale: {value: 0.05},
            U_size: {value: 0.2},
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldPos;
            void main() {
              vUv = uv;
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vWorldPos = worldPos.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 u_color;
            uniform vec3 u_background;
            uniform float u_scale;
            uniform float u_size;
            varying vec2 vUv;
            varying vec3 vWorldPos;
            uniform vec3 u_target;

            void main() {
              float dist = length(vWorldPos - u_target);
              float g = 1.0 - smoothstep(5.0,10.0,dist);

              // working grid
              float size = u_scale * 0.5;
              float edge = 0.05;

              float fx = fract(vWorldPos.x);
              float fz = fract(vWorldPos.z);

              // Smooth fade near edges (instead of hard cuts)
              float solidx = 1.0 - smoothstep(size - edge, size + edge, fx);
              solidx += smoothstep(1.0 - size - edge, 1.0 - size + edge, fx);

              float solidz = 1.0 - smoothstep(size - edge, size + edge, fz);
              solidz += smoothstep(1.0 - size - edge, 1.0 - size + edge, fz);

              float solid = (solidx + solidz > 0.0) ? ((0.2 * g) + 0.2) : 0.2;

              vec3 clrMix = (solidx + solidz > 0.0) ? mix(u_color,u_background,1.0-g)  : u_background;

              float final = solid * g;

              gl_FragColor = vec4(vec3(clrMix),1.0);
              // gl_FragColor = vec4(vec3(solid),1.0);
            }
        `
    })

    const params = {
      color1: [255, 255, 255], // 78 28 66
      color2: [0, 0, 0], // 155 155 155
    };

    const gui = new GUI();

    gui.addColor(params, 'color1').onChange((val) => {mat.uniforms.u_color.value.setRGB(val[0] / 255, val[1] / 255, val[2] / 255);});
    gui.addColor(params, 'color2').onChange((val) => {mat.uniforms.u_background.value.setRGB(val[0] / 255, val[1] / 255, val[2] / 255);});

    const wGrid = new THREE.Mesh(
        new THREE.PlaneGeometry(200,200),
        mat
    )
    wGrid.rotateX(Math.PI * -0.5)
    wGrid.position.y = 1

    const update = () => {
      mat.uniforms.u_target.value.lerp(new THREE.Vector3(mainControls.target.x,0,mainControls.target.z),1.0);
    }

    mainScene.add(wGrid)
    return {update: update}
}