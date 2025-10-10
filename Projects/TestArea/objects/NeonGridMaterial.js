// NeonGridMaterial.js
import * as THREE from 'three';

export const NeonGridMaterial = (opts = {}) => {
  const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
    u_gridCount: { value: opts.gridCount ?? 10.0 },
    u_speed: { value: opts.speed ?? 0.5 },          // vertical speed
    u_lineWidth: { value: opts.lineWidth ?? 0.02 }, // relative to cell (0.02 = 2% of cell)
    u_glow: { value: opts.glow ?? 0.03 },           // glow radius beyond the core line
    u_colorA: { value: new THREE.Color(opts.colorA ?? 0x00ffea) }, // neon color 1
    u_colorB: { value: new THREE.Color(opts.colorB ?? 0xff00ff) }, // neon color 2
    u_bg: { value: new THREE.Color(opts.bg ?? 0x0b0b10) },
    u_upward: {value: true}
  };

  const vertexShader = `
    varying vec2 vUv;
    #ifdef USE_FOG
        varying float vFogDepth;
    #endif
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
      #ifdef USE_FOG
        vFogDepth = -mvPosition.z;
      #endif
    }
  `;

  // fragment shader: creates grid by fract(uv * gridCount) and animates vertical offset
  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_gridCount;
    uniform float u_speed;
    uniform float u_lineWidth;
    uniform float u_glow;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_bg;
    uniform bool u_upward;
    #ifdef USE_FOG
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      uniform float vFogDepth;
    #endif

    // smootherstep-like helper
    float ease(float x) {
      return x*x*(3.0 - 2.0*x);
    }

    void main(){
      // keep aspect ratio consistent so cells are square on screen
      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 uv = (vUv - 0.5) * aspect + 0.5;

      // animate vertical wrap by offsetting before fract so it repeats
      float Offset = u_time * u_speed;
      vec2 g;
      if(u_upward){
        g = fract(vec2(uv.x, uv.y + Offset) * u_gridCount);
      }else{
        g = fract(vec2(uv.x + Offset, uv.y) * u_gridCount);
      }

      // distance to nearest horizontal/vertical line center (0 at center)
      float dV = min(g.x, 1.0 - g.x);
      float dH = min(g.y, 1.0 - g.y);

      // base distance (smaller near a line)
      float d = min(dV, dH);

      // central "solid" line mask (1.0 at center, 0 outside core)
      float core = 1.0 - smoothstep(0.0, u_lineWidth, d);

      // glow mask (soft falloff beyond core)
      float glowMask = 1.0 - smoothstep(u_lineWidth, u_lineWidth + u_glow, d);

      // intersection boost: where both dV and dH are small (crossings)
      float intersect = (1.0 - smoothstep(0.0, u_lineWidth * 1.4, dV)) *
                        (1.0 - smoothstep(0.0, u_lineWidth * 1.4, dH));
      intersect = pow(intersect, 0.65); // stronger, but soft

      // animated color shift along time for neon vibe
      float t = sin(u_time * 1.6) * 0.5 + 0.5;
      vec3 neon = mix(u_colorA, u_colorB, t);

      // combine core (sharp), glow (soft), and intersection highlight
      float intensity = max(core, glowMask * 0.6) + intersect * 0.9;

      // give slightly stronger glow near center of lines
      intensity = clamp(intensity, 0.0, 1.6);

      // final color: background blended with neon by intensity
      vec3 col = mix(u_bg, neon, clamp(intensity, 0.0, 1.0));

      // add a faint overall bloom ring per line for visual richness
      float bloom = glowMask * 0.6;
      col += neon * bloom * 0.35;

      // subtle vignette to keep edges darker
      //vec2 fromCenter = (uv - 0.5) * 2.0;
      //float vign = smoothstep(1.4, 0.6, length(fromCenter));
      //col *= vign;

      #ifdef USE_FOG
        float fogFactor = smoothstep(fogNear,fogFar,vFogDepth);
        gl_FragColor.rgb = mix(gl_FragColor.rgb,fogColor,fogFactor);
      #endif

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: false,
    side: THREE.DoubleSide,
    fog: true,
  });

  // helper: update resolution on resize
  mat.setSize = (w, h) => {
    mat.uniforms.u_resolution.value.set(w, h);
  };

  return mat;
};