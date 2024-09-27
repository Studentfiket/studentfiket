export function leavesVertexShader() {
  return `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float noise;

    uniform float time;

    void main() {
      vNormal = normal;
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      // Make the entire tree sway
      float swayStrength = 0.2;
      float swaySpeed = 5.0;
      gl_Position.x += sin(time * swaySpeed) * swayStrength;

      // Add wind to the leaves
      float windSpeed = 10.0;
      float windStrength = 8.0;
      float windOffset = time * windSpeed;
      gl_Position.x += sin(position.x * windStrength + windOffset) * 0.1;      
    }
  `;
}

export function leavesFragmentShader() {
  return `
  
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 lightPosition;
    uniform sampler2D alphaMap;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      // Make sure the UV repeats
      vec2 uv = vUv;
      uv = fract(uv);
      vec4 duv = vec4(dFdx(vUv), dFdy(vUv));
      float alpha = textureGrad(alphaMap, uv, duv.xy, duv.zw).r;

      vec3 normal = normalize(vNormal);
      vec3 lightDirection = normalize(lightPosition);
      float light = dot(normal, lightDirection);
      vec3 color = mix(colorA, colorB, light);
      gl_FragColor = vec4(color,1.0);

      // Discard the pixel if the alpha is less than 0.5
      if (alpha < 0.5) {
        discard;
      }
    }
  `;
}