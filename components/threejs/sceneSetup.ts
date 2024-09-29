import * as THREE from 'three';

// Set up the scene
export function setupScene(renderElement: HTMLElement, cam: { x: number, y: number, z: number, lookAtZ: number }): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer } {
  // Set up the camera
  function setupCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(0, cam.lookAtZ, 0);
    return camera;
  }

  // Resize the scene when the window is resized
  new ResizeObserver(onWindowResize).observe(renderElement);
  function onWindowResize() {
    if (!renderElement)
      return;

    const { offsetWidth: width, offsetHeight: height } = renderElement;
    const size = Math.min(width, height);

    // Make sure the aspect ratio is still set to square
    renderer.setSize(size, size);
    renderer.render(scene, camera); // Update the scene immediately to avoid flickering
  }

  const scene = new THREE.Scene();
  // scene.rotateY(1.2 * Math.PI);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Get the width and height of the element to render the scene
  if (!renderElement) {
    console.error(`Element not found`);
    return { scene: scene, camera: new THREE.PerspectiveCamera(), renderer: renderer };
  }
  const { offsetWidth: width, offsetHeight: height } = renderElement;
  const size = Math.min(width, height);

  // Set up the camera and renderer
  const camera = setupCamera();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size, size);
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  console.log("Appending renderer to element", renderElement);
  renderElement.appendChild(renderer.domElement);

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  return { scene, camera, renderer };
}