// Create cabinet function
function createCabinet(dimensions, position, color) {
  const geometry = new THREE.BoxGeometry(
    dimensions.width * SCALE,
    dimensions.height * SCALE,
    dimensions.depth * SCALE
  );

  const material = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
    shadowSide: THREE.FrontSide
  });

  const cabinet = new THREE.Mesh(geometry, material);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;

  cabinet.position.set(
    position.x * SCALE + (dimensions.width * SCALE) / 2,
    position.y * SCALE + (dimensions.height * SCALE) / 2,
    position.z * SCALE + (dimensions.depth * SCALE) / 2
  );

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  cabinet.add(line);

  return cabinet;
}
