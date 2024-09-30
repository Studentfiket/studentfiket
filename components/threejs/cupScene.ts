import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupScene } from './sceneSetup';


export default function cupScene(renderElement: HTMLDivElement) {
  // Create materials
  function createMaterials() {
    // Load and cup label texure (rotated 180 degrees to match the Blender model)
    const labelTexture = new THREE.TextureLoader().load('textures/cup-label2.jpg');
    labelTexture.center = new THREE.Vector2(0.5, 0.5);
    labelTexture.rotation = Math.PI;

    const lidMat = new THREE.MeshToonMaterial({ color: 0x000000 });
    const cupMat = new THREE.MeshToonMaterial({ color: 0xA62F03, map: labelTexture, fog: false, toneMapped: false });

    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    baseMat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace("void main() {", `
        varying vec2 vUv;
        void main() {
          vUv = uv;
      `);
      shader.fragmentShader = shader.fragmentShader.replace("void main() {", `
        varying vec2 vUv;
        void main() {
      `);
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <dithering_fragment>`,
        `#include <dithering_fragment>

          float d = distance(vUv, vec2(0.5));
          gl_FragColor.a = (1.0 - d);
        `,
      )
    }

    baseMat.transparent = true;

    return { lidMat, cupMat, baseMat };
  }

  // Load the tree model
  function loadModel() {
    const loader = new GLTFLoader();
    loader.load('/coffee-cup.glb', function (gltf) {
      gltf.scene.rotation.y = 0;
      const content = gltf.scene.children;

      content.forEach((child: THREE.Object3D) => {
        if (child.isObject3D) {
          // Set the materials and shadows for the tree parts
          const mesh = child as THREE.Mesh;
          switch (mesh.name) {
            case 'lid':
              mesh.material = lidMat;
              mesh.castShadow = true;
              break;
            case 'cup':
              mesh.material = cupMat;
              mesh.castShadow = true;
              break;
            case 'base':
              mesh.material = baseMat;
              mesh.receiveShadow = true;
              break;
            default:
              break;
          }
        }
      });

      scene.add(gltf.scene);
    }, undefined, function (error: unknown) {
      console.error(error);
    });
  }

  // Set up the lights
  function setupLights() {
    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x7c7c7c, 3.0);

    const light = new THREE.DirectionalLight(0xFFFFFF, 3.0);
    light.position.set(-0.2, 0.39, -0.7);
    //Create a DirectionalLight and turn on shadows for the light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(mainLightPosition.x, mainLightPosition.y, mainLightPosition.z); //default; light shining from top
    directionalLight.castShadow = true; // default false
    scene.add(ambientLight);
    scene.add(light);
  }

  function animate() {
    renderer.render(scene, camera);
    // leavesMat.uniforms['time'].value = .00025 * (Date.now() - start);
    // trunkMat.uniforms['time'].value = .00025 * (Date.now() - start);
  }

  // Get the element to render the scene
  if (!renderElement) {
    console.error(`Element not found`);
    return;
  }
  // const renderElementPosition = renderElement.getBoundingClientRect();
  // const renderElementCenterX = renderElementPosition.left + renderElementPosition.width / 2;
  // const renderElementCenterY = renderElementPosition.top + renderElementPosition.height / 2;

  // Get mouse position
  // const scaleX = 10;
  // const scaleY = 0.5;
  // window.addEventListener('mousemove', (event) => {
  //   // const x = event.clientX / renderElementCenterX - 1;
  //   // const y = event.clientY / renderElementCenterY - 1;
  //   // leavesMat.uniforms['lightPosition'].value = new THREE.Vector3(mainLightPosition.x - x * scaleX * 2, mainLightPosition.y - y * scaleY * 2, mainLightPosition.z);
  //   // scene.children[0].position.set(mainLightPosition.x - x * scaleX, mainLightPosition.y - y * scaleY, mainLightPosition.z);
  // });

  const mainLightPosition = new THREE.Vector3(4, 4, 4);
  // const start = Date.now();
  const { scene, camera, renderer } = setupScene(renderElement, { x: 1, y: 0.7, z: 1, lookAtZ: 0.5 });
  renderer.setAnimationLoop(animate);
  const { lidMat, cupMat, baseMat } = createMaterials();

  loadModel();
  setupLights()
  scene.rotateY(-Math.PI / 4 + Math.PI)
}