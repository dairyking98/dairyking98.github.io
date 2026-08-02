// Lightweight pan/rotate/zoom viewer for .stl CAD exports, used on
// /projects/type-elements/. One THREE.Scene/Camera/Renderer per
// `.model-viewer-3d` container found on the page; each is lazy-initialized
// (via IntersectionObserver) so multi-MB STL files only load once a viewer
// actually scrolls near the viewport, not on initial page load.
//
// Loaded as an ES module; expects an import map defining "three" and
// "three/addons/" (see the <script type="importmap"> in type-elements.md).
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function initViewer(container) {
  const src = container.dataset.modelSrc;
  if (!src) {
    return;
  }

  const statusEl = container.querySelector('.model-viewer-status');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(1, 1.4, 1);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-1, -0.5, -1);
  scene.add(fill);

  function sizeToContainer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  let frameRequested = false;
  function render() {
    frameRequested = false;
    controls.update();
    renderer.render(scene, camera);
  }
  function requestRender() {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(render);
    }
  }
  controls.addEventListener('change', requestRender);

  sizeToContainer();
  new ResizeObserver(() => {
    sizeToContainer();
    requestRender();
  }).observe(container);

  const loader = new STLLoader();
  loader.load(
    src,
    (geometry) => {
      // These STLs come from OpenSCAD/CAD/slicer tooling, which use a
      // Z-up convention (Z is "up," matching the printer's build
      // direction). three.js's world is Y-up. Without this rotation the
      // geometry loads exactly as exported (correct data) but reads as
      // tipped over, since the renderer and the file disagree on which
      // axis is "up."
      geometry.rotateX(-Math.PI / 2);
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0xd8d3c6,
        roughness: 0.65,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Center the geometry and frame the camera to its bounding sphere,
      // since raw CAD/print exports aren't normalized to any particular
      // origin or scale.
      const box = geometry.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);
      scene.add(mesh);

      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      const radius = sphere.radius || 1;
      camera.position.set(radius * 1.6, radius * 1.2, radius * 1.6);
      camera.near = radius / 100;
      camera.far = radius * 100;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.minDistance = radius * 0.3;
      controls.maxDistance = radius * 6;
      controls.update();

      if (statusEl) {
        statusEl.remove();
      }
      requestRender();
    },
    undefined,
    (error) => {
      if (statusEl) {
        statusEl.textContent = 'Couldn’t load this model.';
      }
      console.error('STL load failed for', src, error);
    }
  );
}

const containers = document.querySelectorAll('.model-viewer-3d');
if (containers.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          initViewer(entry.target);
        }
      });
    },
    { rootMargin: '200px' }
  );
  containers.forEach((el) => observer.observe(el));
}
