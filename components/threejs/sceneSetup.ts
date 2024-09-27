import * as THREE from 'three';

// Set up the scene
export function setupScene(renderElement: HTMLElement, elementId: string, cam: { height: number, lookAtZ: number, zoom: number }): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer } {
  // Set up the camera
  function setupCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(10 / cam.zoom, cam.height, 6 / cam.zoom);
    camera.lookAt(0, cam.lookAtZ, 0);
    return camera;
  }

  // Resize the scene when the window is resized
  new ResizeObserver(onWindowResize).observe(renderElement);
  function onWindowResize() {
    if (!renderElement)
      return;

    // Make sure the aspect ratio is still set to square
    renderer.setSize(renderElement.offsetWidth, renderElement.offsetWidth);
    renderer.render(scene, camera); // Update the scene immediately to avoid flickering
  }

  const scene = new THREE.Scene();
  scene.rotateY(1.2 * Math.PI);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Get the width and height of the element to render the scene
  if (!renderElement) {
    console.error(`Element with id ${elementId} not found`);
    return { scene: scene, camera: new THREE.PerspectiveCamera(), renderer: renderer };
  }
  const { offsetWidth: width } = renderElement;

  // Set up the camera and renderer
  const camera = setupCamera();
  renderer.setSize(width, width);
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderElement.appendChild(renderer.domElement);

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  return { scene, camera, renderer };
}