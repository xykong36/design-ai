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

  if (position.rotation) {
    // 如果有旋转，需要调整位置计算
    cabinet.position.set(
      position.x * SCALE,
      position.y * SCALE + (dimensions.height * SCALE) / 2,
      position.z * SCALE
    );
    cabinet.rotation.set(
      position.rotation.x,
      position.rotation.y,
      position.rotation.z
    );
  } else {
    // 原来的位置计算
    cabinet.position.set(
      position.x * SCALE + (dimensions.width * SCALE) / 2,
      position.y * SCALE + (dimensions.height * SCALE) / 2,
      position.z * SCALE + (dimensions.depth * SCALE) / 2
    );
  }

  // 添加边框效果
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  cabinet.add(line);

  return cabinet;
}
