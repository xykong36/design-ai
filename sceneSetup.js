// Scale factor (converting mm to Three.js units)
const SCALE = 0.01;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 30, 30);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Lighting setup
function createLighting() {
  const lights = new THREE.Group();
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  lights.add(ambient);
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(10, 10, 10);
  mainLight.castShadow = true;
  lights.add(mainLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 5, -5);
  lights.add(fillLight);
  return lights;
}

scene.add(createLighting());

// Helper grid
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

function createWalls() {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  const kitchenGroup = new THREE.Group();

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(
    kitchenData.elevations.elevation_B.width * SCALE,
    kitchenData.elevations.elevation_A.width * SCALE
  );
  const floor = new THREE.Mesh(floorGeometry, wallMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(
    (kitchenData.elevations.elevation_B.width * SCALE) / 2,
    0,
    -(kitchenData.elevations.elevation_A.width * SCALE) / 2
  );
  kitchenGroup.add(floor);

  // Elevation A (Left Wall)
  const wallAGeometry = new THREE.PlaneGeometry(
    kitchenData.elevations.elevation_A.width * SCALE,
    kitchenData.layout.total_height * SCALE
  );
  const wallA = new THREE.Mesh(wallAGeometry, wallMaterial);
  wallA.rotation.y = Math.PI / 2;
  wallA.position.set(
    0,
    (kitchenData.layout.total_height * SCALE) / 2,
    -(kitchenData.elevations.elevation_A.width * SCALE) / 2
  );
  kitchenGroup.add(wallA);

  // Window
  const windowMaterial = new THREE.MeshBasicMaterial({
    color: 0x87CEEB,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });

  const windowGeometry = new THREE.PlaneGeometry(
    kitchenData.elevations.elevation_A.features.window.width * SCALE,
    kitchenData.elevations.elevation_A.features.window.height * SCALE
  );
  const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh.rotation.y = Math.PI / 2;
  windowMesh.position.set(
    0.1,
    (kitchenData.elevations.elevation_A.features.window.position.bottom * SCALE) +
    (kitchenData.elevations.elevation_A.features.window.height * SCALE) / 2,
    -(kitchenData.elevations.elevation_A.features.window.position.center_x * SCALE)
  );
  kitchenGroup.add(windowMesh);

  // Elevation B (Back Wall)
  const wallBGeometry = new THREE.PlaneGeometry(
    kitchenData.elevations.elevation_B.width * SCALE,
    kitchenData.layout.total_height * SCALE
  );
  const wallB = new THREE.Mesh(wallBGeometry, wallMaterial);
  wallB.position.set(
    (kitchenData.elevations.elevation_B.width * SCALE) / 2,
    (kitchenData.layout.total_height * SCALE) / 2,
    -kitchenData.elevations.elevation_A.width * SCALE
  );
  kitchenGroup.add(wallB);

  scene.add(kitchenGroup);
}


function setCameraPosition(position) {
  switch (position) {
    case 'front':
      camera.position.set(0, 0, 50);
      camera.up.set(0, 1, 0);
      break;
    case 'top':
      camera.position.set(0, 50, 0);
      camera.up.set(0, 0, -1);
      break;
    case 'perspective':
      camera.position.set(30, 30, 30);
      camera.up.set(0, 1, 0);
      break;
  }
  camera.lookAt(scene.position);
}

function rotateScene(direction) {
  const rotationAmount = Math.PI / 12;
  if (direction === 'left') {
    currentRotation -= rotationAmount;
  } else if (direction === 'right') {
    currentRotation += rotationAmount;
  }
  scene.rotation.y = currentRotation;
}

function resetRotation() {
  currentRotation = 0;
  scene.rotation.y = 0;
  camera.position.set(30, 30, 30);
  camera.up.set(0, 1, 0);
  camera.lookAt(scene.position);
}

function updateCameraPosition() {
  camera.position.set(currentCameraPosition.x, currentCameraPosition.y, currentCameraPosition.z);
  camera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z);
}

function setElevationView(elevation) {
  switch (elevation) {
    case 'A':
      currentCameraPosition = { x: 40, y: 12, z: -13 };
      currentLookAt = { x: -5, y: 12, z: -13 };
      break;
    case 'B':
      currentCameraPosition = { x: 21, y: 12, z: 5 };
      currentLookAt = { x: 21, y: 12, z: -26.6 };
      break;
  }
  updateCameraPosition();
}

function setCornerView(corner) {
  switch (corner) {
    case 'leftBack':
      currentCameraPosition = { x: 50, y: 25, z: 10 };
      currentLookAt = { x: 0, y: 10, z: -26.6 };
      break;
    case 'rightBack':
      currentCameraPosition = { x: -10, y: 25, z: 10 };
      currentLookAt = { x: 42.1, y: 10, z: -26.6 };
      break;
  }
  updateCameraPosition();
}

function setDefaultView() {
  currentCameraPosition = { x: 50, y: 30, z: 10 };
  currentLookAt = { x: 20, y: 10, z: -13 };
  updateCameraPosition();
}

function resetView() {
  currentRotation = 0;
  scene.rotation.y = 0;
  setDefaultView();
}

// Set camera properties
camera.fov = 45;
camera.updateProjectionMatrix();
