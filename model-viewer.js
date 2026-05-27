/* ═══════════════════════════════════════════
   3D MODEL VIEWER — Three.js
   Muestra un modelo mecánico 3D de demo
   (ensamblaje de engranajes procedural).
   Para cargar un .GLB real, ver comentarios.
   ═══════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('modelCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene ── */
  const scene = new THREE.Scene();

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  /* ── Lights ── */
  const ambient = new THREE.AmbientLight(0x334466, 1.5);
  scene.add(ambient);

  const dirLight1 = new THREE.DirectionalLight(0x00d4ff, 2);
  dirLight1.position.set(5, 8, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x7c3aed, 1);
  dirLight2.position.set(-5, -3, -5);
  scene.add(dirLight2);

  /* ── Demo model: procedural gear assembly ── */
  function makeGear(teeth, innerR, outerR, thickness, color) {
    const shape = new THREE.Shape();
    const toothH = (outerR - innerR) * 0.8;
    const toothW = (2 * Math.PI * innerR / teeth) * 0.4;

    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
      const nextNextAngle = ((i + 1) / teeth) * Math.PI * 2;

      if (i === 0) {
        shape.moveTo(
          Math.cos(angle - toothW / (2 * innerR)) * innerR,
          Math.sin(angle - toothW / (2 * innerR)) * innerR
        );
      }

      shape.lineTo(
        Math.cos(angle - toothW / (2 * innerR)) * innerR,
        Math.sin(angle - toothW / (2 * innerR)) * innerR
      );
      shape.lineTo(
        Math.cos(angle - toothW / (2 * (innerR + toothH))) * (innerR + toothH),
        Math.sin(angle - toothW / (2 * (innerR + toothH))) * (innerR + toothH)
      );
      shape.lineTo(
        Math.cos(angle + toothW / (2 * (innerR + toothH))) * (innerR + toothH),
        Math.sin(angle + toothW / (2 * (innerR + toothH))) * (innerR + toothH)
      );
      shape.lineTo(
        Math.cos(angle + toothW / (2 * innerR)) * innerR,
        Math.sin(angle + toothW / (2 * innerR)) * innerR
      );
      shape.lineTo(
        Math.cos(nextNextAngle - toothW / (2 * innerR)) * innerR,
        Math.sin(nextNextAngle - toothW / (2 * innerR)) * innerR
      );
    }
    shape.closePath();

    /* Hole */
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR * 0.35, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 2 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1,
    });
    return new THREE.Mesh(geometry, material);
  }

  /* Create 3 gears */
  const gear1 = makeGear(20, 0.9, 1.2, 0.3, 0x1a6a8a);
  gear1.position.set(0, 0, 0);
  scene.add(gear1);

  const gear2 = makeGear(12, 0.55, 0.75, 0.3, 0x4a1a8a);
  gear2.position.set(1.55, 0, 0);
  scene.add(gear2);

  const gear3 = makeGear(8, 0.38, 0.52, 0.28, 0x1a8a5a);
  gear3.position.set(-1.38, 0, 0.15);
  scene.add(gear3);

  /* Shaft cylinders */
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.9, roughness: 0.2 });
  [gear1, gear2, gear3].forEach(g => {
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16),
      shaftMat
    );
    shaft.rotation.x = Math.PI / 2;
    shaft.position.copy(g.position);
    shaft.position.z -= 0.6;
    scene.add(shaft);
  });

  /* ── Mouse / Touch orbit ── */
  let isDown = false, lastX, lastY;
  let rotX = 0.3, rotY = 0.4;
  const group = new THREE.Group();
  group.add(gear1, gear2, gear3);
  scene.add(group);

  canvas.addEventListener('mousedown', e => { isDown = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup',   () => { isDown = false; });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    rotY += (e.clientX - lastX) * 0.008;
    rotX += (e.clientY - lastY) * 0.008;
    lastX = e.clientX; lastY = e.clientY;
  });

  canvas.addEventListener('touchstart', e => { isDown = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; });
  window.addEventListener('touchend',   () => { isDown = false; });
  window.addEventListener('touchmove',  e => {
    if (!isDown) return;
    rotY += (e.touches[0].clientX - lastX) * 0.008;
    rotX += (e.touches[0].clientY - lastY) * 0.008;
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  });

  canvas.addEventListener('wheel', e => {
    camera.position.z = Math.max(2, Math.min(10, camera.position.z + e.deltaY * 0.01));
    e.preventDefault();
  }, { passive: false });

  /* ── Wireframe toggle ── */
  let wireframe = false;
  document.getElementById('toggleWire')?.addEventListener('click', () => {
    wireframe = !wireframe;
    scene.traverse(obj => {
      if (obj.isMesh) obj.material.wireframe = wireframe;
    });
  });

  /* ── Reset camera ── */
  document.getElementById('resetCamera')?.addEventListener('click', () => {
    rotX = 0.3; rotY = 0.4;
    camera.position.set(0, 2, 5);
  });

  /* ── Resize ── */
  const ro = new ResizeObserver(() => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(canvas.parentElement);

  /* ── Animate ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    /* Gear rotation ratios based on teeth count */
    gear1.rotation.z = t;
    gear2.rotation.z = -t * (20 / 12);
    gear3.rotation.z = -t * (20 / 8);

    /* Camera orbit from mouse */
    group.rotation.x = rotX;
    group.rotation.y = rotY;

    /* Gentle auto-rotate when idle */
    if (!isDown) rotY += 0.002;

    renderer.render(scene, camera);
  }

  animate();

  /*
   * ── To load a real GLB model ──
   *
   * 1. Add to <head>:
   *    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
   *
   * 2. Replace the gear creation block with:
   *    const loader = new THREE.GLTFLoader();
   *    loader.load('assets/models/tu_modelo.glb', (gltf) => {
   *      group.add(gltf.scene);
   *    });
   *
   * 3. Place your .glb in assets/models/
   */
})();
