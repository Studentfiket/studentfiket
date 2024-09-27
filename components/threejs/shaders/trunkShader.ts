export function trunkVertexShader() {
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
      float swayStrength = 0.05;
      float swaySpeed = 5.0;
      gl_Position.x += sin(time * swaySpeed) * swayStrength * position.y;
    }
  `;
}

export function trunkFragmentShader() {
  return `
  
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 lightPosition;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDirection = normalize(lightPosition);
      float light = dot(normal, lightDirection);
      vec3 color = mix(colorA, colorB, light);
      gl_FragColor = vec4(color,1.0);
    }
  `;
}