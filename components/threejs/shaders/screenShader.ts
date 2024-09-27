export function screenVertexShader() {
  return `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}

export function screenFragmentShader() {
  return `
    uniform sampler2D textureMap;
    uniform float scrollY;

    varying vec2 vUv;

    void main() {
      float scrollSpeed = 0.3;
      float startOffset = 0.0;
      
      // Scale the texture to the aspect ratio of the screen. This is done by calculating the aspect ratio of the texture and scaling the UV coordinates accordingly.
      // The scrollY uniform is used to scroll the texture vertically.

      float textureAspect = float(textureSize(textureMap, 0).x) / float(textureSize(textureMap, 0).y);
      vec2 uv = vec2(vUv.x, (vUv.y * textureAspect + 1.0 - textureAspect - startOffset) - scrollY * scrollSpeed);
      vec4 texel = texture2D(textureMap, uv);
      vec3 color = texel.rgb;

      // Output the color
      gl_FragColor = vec4(color, 1.0);
    }
  `;
}