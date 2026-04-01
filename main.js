import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Tỷ lệ minh họa: 1 đơn vị scene ≈ 10 m thực địa.
 * Mặt bằng 250×200 ≈ 2,5 km × 2 km ≈ 500 ha (gần đúng tổ hợp marketing).
 */
const SCALE_M_PER_UNIT = 10;
const GROUND_W = 250;
const GROUND_D = 200;

// POI popup: ảnh KCN hoàng hôn — CC0 Poly Haven "industrial_sunset_02"
const EQUIRECT_URL = new URL(
  "./panoramas/industrial_sunset_02_cc0.jpg",
  import.meta.url
).href;

// Chế độ ảnh 360° tổng thể: nhìn từ cao — CC0 Poly Haven "hilltop_construction"
const AERIAL_PANO_URL = new URL(
  "./panoramas/hilltop_construction_cc0.jpg",
  import.meta.url
).href;

/**
 * Hotspot trong chế độ ảnh 360° tổng thể (lon/lat độ, cùng hệ với kéo xoay).
 * Vị trí minh họa — khi có ảnh flycam thật, căn lại lon/lat theo ảnh.
 */
const IMMERSIVE_HOTSPOTS = [
  {
    id: "zone-a",
    title: "Phân khu sản xuất (minh họa)",
    description:
      "Gợi ý: neo hotspot theo lô nhà xưởng trên ảnh 360 thật; mở bảng thông số, video, hoặc liên hệ đầu tư.",
    lon: 18,
    lat: -14,
  },
  {
    id: "green",
    title: "Hành lang xanh / đệm cảnh quan",
    description:
      "Minh họa vùng cây xanh, thoát nước. Sản phẩm thật: đoạn clip flycam, diện tích phủ xanh theo quy hoạch.",
    lon: -42,
    lat: 6,
  },
  {
    id: "logistics",
    title: "Vùng logistics & cổng kho",
    description:
      "Điểm nhấn vận tải. Có thể liên kết sơ đồ luồng hàng, khoảng cách tới cao tốc / cảng.",
    lon: 108,
    lat: -10,
  },
  {
    id: "infra",
    title: "Trục hạ tầng kỹ thuật",
    description:
      "Gợi ý hiển thị đường điện, XLNT, trạm bơm — dữ liệu từ một nguồn CMS / JSON.",
    lon: -95,
    lat: -22,
  },
];

const POIS = [
  {
    id: "cang",
    title: "Cảng tổng hợp — POI demo",
    position: [92, 4, -58],
    description:
      "Vị trí minh họa ven hành lang thủy. Sản phẩm thật: panorama 360° / flycam neo tọa độ, liên kết hồ sơ logistics.",
  },
  {
    id: "xlnt",
    title: "Trạm xử lý nước thải — POI demo",
    position: [-102, 4, 72],
    description:
      "Gợi ý hiển thị công suất 12.000 m³/ngày (theo tài liệu giới thiệu), sơ đồ quy trình, liên hệ kỹ thuật.",
  },
  {
    id: "cong",
    title: "Cổng chính / trụ sở điều hành — POI demo",
    position: [8, 4, 94],
    description:
      "Điểm đón nhà đầu tư: 360° mặt đất, lịch tham quan, form đăng ký.",
  },
  {
    id: "cum",
    title: "Vành cụm công nghiệp / dịch vụ — POI demo",
    position: [-108, 4, -52],
    description:
      "Minh họa vùng ~72 ha cụm & khu dịch vụ lân cận trong tổ hợp >500 ha (vị trí tương đối, không phải bản đồ pháp lý).",
  },
];

let mainScene, mainCamera, mainRenderer, controls;
let raycaster, pointer;
const markerMeshes = [];
let panoScene, panoCamera, panoRenderer;
let modalOpen = false;

/** @type {"3d" | "pano360"} */
let viewMode = "3d";

let sharedPanoTex = null;
const panoTexWaiters = [];

let aerialPanoTex = null;
const aerialTexWaiters = [];

let immersiveScene, immersiveCamera, immersiveRenderer;
let immersiveReady = false;

let modalPanoLon = 0;
let modalPanoLat = 0;
let modalPanoDrag = false;
let modalPanoPx = 0;
let modalPanoPy = 0;

let immersiveLon = 0;
let immersiveLat = 0;
let immersivePx = 0;
let immersivePy = 0;
/** Đang giữ chuột trên canvas panorama toàn màn hình */
let immersivePointerDown = false;
let immersivePanStartX = 0;
let immersivePanStartY = 0;
let immersivePanMaxDist = 0;
/** Đã vượt ngưỡng → coi là kéo xoay, không mở hotspot */
let immersivePanSliding = false;

const immersiveHotspotMeshes = [];
let immersiveHotspotSheetOpen = false;

const DEFAULT_CAM_POS = new THREE.Vector3(175, 195, 205);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function loadSharedPanorama(onLoaded) {
  if (sharedPanoTex !== undefined && sharedPanoTex !== null) {
    onLoaded(sharedPanoTex);
    return;
  }
  if (sharedPanoTex === null && panoTexWaiters.length === 0) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      EQUIRECT_URL,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        sharedPanoTex = tex;
        const w = panoTexWaiters.splice(0, panoTexWaiters.length);
        w.forEach((fn) => fn(tex));
      },
      undefined,
      () => {
        sharedPanoTex = undefined;
        const w = panoTexWaiters.splice(0, panoTexWaiters.length);
        w.forEach((fn) => fn(null));
      }
    );
  }
  panoTexWaiters.push(onLoaded);
}

function loadAerialPanorama(onLoaded) {
  if (aerialPanoTex !== undefined && aerialPanoTex !== null) {
    onLoaded(aerialPanoTex);
    return;
  }
  if (aerialPanoTex === null && aerialTexWaiters.length === 0) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      AERIAL_PANO_URL,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        aerialPanoTex = tex;
        const w = aerialTexWaiters.splice(0, aerialTexWaiters.length);
        w.forEach((fn) => fn(tex));
      },
      undefined,
      () => {
        aerialPanoTex = undefined;
        const w = aerialTexWaiters.splice(0, aerialTexWaiters.length);
        w.forEach((fn) => fn(null));
      }
    );
  }
  aerialTexWaiters.push(onLoaded);
}

function addEquirectMesh(scene, tex) {
  const geo = new THREE.SphereGeometry(500, 56, 36);
  geo.scale(-1, 1, 1);
  const mat = tex
    ? new THREE.MeshBasicMaterial({ map: tex })
    : new THREE.MeshBasicMaterial({ color: 0x305c5a });
  scene.add(new THREE.Mesh(geo, mat));
}

function lonLatToPosition(lon, lat, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function addImmersiveHotspots(scene) {
  const old = scene.getObjectByName("immersive-hotspots");
  if (old) scene.remove(old);
  immersiveHotspotMeshes.length = 0;

  const group = new THREE.Group();
  group.name = "immersive-hotspots";
  const matCore = new THREE.MeshBasicMaterial({
    color: 0xdcb248,
    transparent: true,
    opacity: 0.95,
    depthTest: true,
    depthWrite: false,
  });
  const matRing = new THREE.MeshBasicMaterial({
    color: 0xb58234,
    transparent: true,
    opacity: 0.55,
    depthTest: true,
    depthWrite: false,
  });

  const R = 448;
  for (const h of IMMERSIVE_HOTSPOTS) {
    const pos = lonLatToPosition(h.lon, h.lat, R);
    const core = new THREE.Mesh(new THREE.SphereGeometry(5.5, 20, 16), matCore);
    core.position.copy(pos);
    core.userData.hotspot = h;
    group.add(core);
    immersiveHotspotMeshes.push(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.45, 8, 28),
      matRing
    );
    ring.position.copy(pos);
    ring.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      pos.clone().normalize()
    );
    ring.userData.hotspot = h;
    group.add(ring);
    immersiveHotspotMeshes.push(ring);
  }
  scene.add(group);
}

function updatePanoCamera(cam, lon, lat) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  const t = new THREE.Vector3(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta)
  );
  cam.position.set(0, 0, 0);
  cam.lookAt(t);
}

function resetView() {
  if (viewMode === "3d") {
    if (!mainCamera || !controls) return;
    mainCamera.position.copy(DEFAULT_CAM_POS);
    controls.target.copy(DEFAULT_TARGET);
    controls.update();
  } else {
    immersiveLon = 0;
    immersiveLat = 0;
  }
}

function closeImmersiveHotspotSheet() {
  const sheet = document.getElementById("immersive-hotspot-sheet");
  if (!sheet) return;
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
  immersiveHotspotSheetOpen = false;
}

function openImmersiveHotspotSheet(h) {
  const sheet = document.getElementById("immersive-hotspot-sheet");
  const titleEl = document.getElementById("immersive-hotspot-title");
  const descEl = document.getElementById("immersive-hotspot-desc");
  if (!sheet || !titleEl || !descEl) return;
  titleEl.textContent = h.title;
  descEl.textContent = h.description;
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
  immersiveHotspotSheetOpen = true;
}

function immersiveTryHotspotClick(clientX, clientY) {
  if (!immersiveCamera || !immersiveRenderer || !raycaster) return;
  if (immersiveHotspotSheetOpen) return;
  const rect = immersiveRenderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, immersiveCamera);
  const hits = raycaster.intersectObjects(immersiveHotspotMeshes, true);
  if (hits.length === 0) return;
  let o = hits[0].object;
  while (o && !o.userData.hotspot) o = o.parent;
  if (o?.userData?.hotspot) openImmersiveHotspotSheet(o.userData.hotspot);
}

function ensureImmersivePano() {
  if (immersiveRenderer) return;
  const root = document.getElementById("immersive-pano-root");
  if (!root) return;
  immersiveScene = new THREE.Scene();
  immersiveCamera = new THREE.PerspectiveCamera(
    72,
    window.innerWidth / Math.max(window.innerHeight, 1),
    0.1,
    1000
  );
  immersiveRenderer = new THREE.WebGLRenderer({ antialias: true });
  immersiveRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  immersiveRenderer.setSize(window.innerWidth, window.innerHeight);
  immersiveRenderer.outputColorSpace = THREE.SRGBColorSpace;
  root.appendChild(immersiveRenderer.domElement);

  loadAerialPanorama((tex) => {
    addEquirectMesh(immersiveScene, tex);
  });
  addImmersiveHotspots(immersiveScene);

  immersiveRenderer.domElement.addEventListener("pointerdown", (e) => {
    if (viewMode !== "pano360") return;
    immersivePointerDown = true;
    immersivePanSliding = false;
    immersivePanMaxDist = 0;
    immersivePanStartX = immersivePx = e.clientX;
    immersivePanStartY = immersivePy = e.clientY;
  });
  immersiveReady = true;
}

function resizeImmersive() {
  if (!immersiveRenderer || !immersiveCamera) return;
  immersiveCamera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
  immersiveCamera.updateProjectionMatrix();
  immersiveRenderer.setSize(window.innerWidth, window.innerHeight);
}

function setViewMode(mode) {
  if (mode !== "3d" && mode !== "pano360") return;
  viewMode = mode;
  document.body.classList.toggle("view-pano360", mode === "pano360");

  const wrap = document.getElementById("canvas-wrap");
  const root = document.getElementById("immersive-pano-root");
  const t3 = document.getElementById("tab-view-3d");
  const tp = document.getElementById("tab-view-pano360");

  if (mode === "3d") {
    closeImmersiveHotspotSheet();
    if (root) {
      root.classList.remove("is-active");
      root.setAttribute("aria-hidden", "true");
    }
    if (wrap) {
      wrap.classList.remove("view-hidden");
      wrap.setAttribute("aria-hidden", "false");
    }
    if (controls) controls.enabled = !modalOpen;
    t3?.setAttribute("aria-selected", "true");
    tp?.setAttribute("aria-selected", "false");
    t3?.classList.add("view-toggle__btn--active");
    tp?.classList.remove("view-toggle__btn--active");
  } else {
    closeModal();
    ensureImmersivePano();
    resizeImmersive();
    if (wrap) {
      wrap.classList.add("view-hidden");
      wrap.setAttribute("aria-hidden", "true");
    }
    if (root) {
      root.classList.add("is-active");
      root.setAttribute("aria-hidden", "false");
    }
    if (controls) controls.enabled = false;
    t3?.setAttribute("aria-selected", "false");
    tp?.setAttribute("aria-selected", "true");
    tp?.classList.add("view-toggle__btn--active");
    t3?.classList.remove("view-toggle__btn--active");
  }
}

function initMain() {
  const wrap = document.getElementById("canvas-wrap");
  mainScene = new THREE.Scene();
  mainScene.background = new THREE.Color(0xe8f2f0);

  const fogNear = 300;
  const fogFar = 1380;
  mainScene.fog = new THREE.Fog(0xdce8e6, fogNear, fogFar);

  mainCamera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    1,
    2500
  );
  mainCamera.position.set(175, 195, 205);

  mainRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mainRenderer.setSize(window.innerWidth, window.innerHeight);
  mainRenderer.shadowMap.enabled = true;
  mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mainRenderer.outputColorSpace = THREE.SRGBColorSpace;
  mainRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  mainRenderer.toneMappingExposure = 1.28;
  wrap.appendChild(mainRenderer.domElement);

  controls = new OrbitControls(mainCamera, mainRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.minDistance = 88;
  controls.maxDistance = 560;
  controls.target.set(0, 0, 0);
  controls.autoRotate = false;
  controls.screenSpacePanning = true;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

  const hemi = new THREE.HemisphereLight(0xf2f8f6, 0x5d8f7a, 0.66);
  mainScene.add(hemi);

  mainScene.add(new THREE.AmbientLight(0xf4f1ea, 0.46));

  const sun = new THREE.DirectionalLight(0xfff9f4, 1.22);
  sun.position.set(130, 300, 165);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(4096);
  sun.shadow.bias = -0.00015;
  sun.shadow.normalBias = 0.02;
  const ext = 160;
  sun.shadow.camera.near = 20;
  sun.shadow.camera.far = 520;
  sun.shadow.camera.left = -ext;
  sun.shadow.camera.right = ext;
  sun.shadow.camera.top = ext;
  sun.shadow.camera.bottom = -ext;
  mainScene.add(sun);

  addGroundAndGrids();
  addRoadNetwork();
  addWaterBodies();
  addIndustrialMassing();
  addGreenBuffers();
  addMarkers();

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  window.addEventListener("resize", onResize);
  mainRenderer.domElement.addEventListener("click", onClick);

  window.addEventListener("pointermove", (e) => {
    if (modalPanoDrag && modalOpen) {
      const dx = e.clientX - modalPanoPx;
      const dy = e.clientY - modalPanoPy;
      modalPanoPx = e.clientX;
      modalPanoPy = e.clientY;
      modalPanoLon -= dx * 0.12;
      modalPanoLat = Math.max(-85, Math.min(85, modalPanoLat + dy * 0.1));
    }
    if (immersivePointerDown && viewMode === "pano360") {
      immersivePanMaxDist = Math.max(
        immersivePanMaxDist,
        Math.hypot(
          e.clientX - immersivePanStartX,
          e.clientY - immersivePanStartY
        )
      );
      if (immersivePanMaxDist > 14) immersivePanSliding = true;
    }
    if (immersivePanSliding && viewMode === "pano360") {
      const dx = e.clientX - immersivePx;
      const dy = e.clientY - immersivePy;
      immersivePx = e.clientX;
      immersivePy = e.clientY;
      immersiveLon -= dx * 0.1;
      immersiveLat = Math.max(-85, Math.min(85, immersiveLat + dy * 0.08));
    }
  });
  window.addEventListener("pointerup", (e) => {
    modalPanoDrag = false;
    if (
      immersivePointerDown &&
      viewMode === "pano360" &&
      !immersivePanSliding &&
      immersivePanMaxDist <= 14
    ) {
      immersiveTryHotspotClick(e.clientX, e.clientY);
    }
    immersivePointerDown = false;
    immersivePanSliding = false;
  });
}

function addGroundAndGrids() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND_W, GROUND_D),
    new THREE.MeshStandardMaterial({
      color: 0x3d7268,
      roughness: 0.9,
      metalness: 0.04,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  mainScene.add(ground);

  // Lưới thưa — trục chính
  const major = new THREE.GridHelper(
    Math.max(GROUND_W, GROUND_D),
    20,
    0x5a9e96,
    0x305c5a
  );
  major.position.y = 0.08;
  const majorMat = major.material;
  if (Array.isArray(majorMat)) {
    majorMat.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.45;
    });
  } else {
    majorMat.transparent = true;
    majorMat.opacity = 0.45;
  }
  mainScene.add(major);

  // Lưới mịn — cảm giác quy hoạch
  const minor = new THREE.GridHelper(GROUND_W, 50, 0x7daba3, 0x3d6b66);
  minor.position.y = 0.06;
  const minMat = minor.material;
  if (Array.isArray(minMat)) {
    minMat.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.18;
    });
  } else {
    minMat.transparent = true;
    minMat.opacity = 0.18;
  }
  mainScene.add(minor);
}

function addRoadNetwork() {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x7a756d,
    roughness: 0.88,
    metalness: 0.05,
  });
  const h = 0.14;

  const strips = [
    { w: 8, d: GROUND_D + 4, x: 0, z: 0 },
    { w: GROUND_W + 4, d: 7, x: 0, z: 0 },
    { w: 6, d: GROUND_D * 0.65, x: -55, z: 5 },
    { w: GROUND_W * 0.55, d: 5, x: 25, z: -48 },
  ];

  for (const s of strips) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(s.w, h, s.d), mat);
    mesh.position.set(s.x, h / 2, s.z);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mainScene.add(mesh);
  }
}

function addWaterBodies() {
  const river = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND_D * 0.92, 22),
    new THREE.MeshStandardMaterial({
      color: 0x2d6f6c,
      roughness: 0.2,
      metalness: 0.22,
      transparent: true,
      opacity: 0.9,
    })
  );
  river.rotation.x = -Math.PI / 2;
  river.rotation.z = 0.11;
  river.position.set(GROUND_W * 0.38, 0.11, -12);
  mainScene.add(river);

  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(16, 48),
    new THREE.MeshStandardMaterial({
      color: 0x357a76,
      roughness: 0.28,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
    })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(-72, 0.1, 38);
  mainScene.add(lake);
}

function addIndustrialMassing() {
  const matInd = new THREE.MeshStandardMaterial({
    color: 0x3d5658,
    roughness: 0.72,
    metalness: 0.18,
  });
  const matSvc = new THREE.MeshStandardMaterial({
    color: 0x5a4f52,
    roughness: 0.76,
    metalness: 0.12,
  });
  const matLog = new THREE.MeshStandardMaterial({
    color: 0x4a5352,
    roughness: 0.65,
    metalness: 0.22,
  });

  const boxes = [];

  // Khối anchor lớn (hạ tầng trọng điểm)
  boxes.push(
    { w: 22, h: 5.5, d: 16, x: -35, z: -25, mat: matInd },
    { w: 28, h: 6, d: 18, x: 18, z: -32, mat: matInd },
    { w: 18, h: 4.5, d: 22, x: 52, z: 8, mat: matLog },
    { w: 14, h: 3.8, d: 14, x: -78, z: -40, mat: matSvc },
    { w: 20, h: 4, d: 12, x: -20, z: 48, mat: matSvc }
  );

  // Lưới lô nhỏ — mô phỏng mật độ xây dựng
  const seed = 90127;
  function rnd(i) {
    const x = Math.sin(seed + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  let k = 0;
  for (let gx = -9; gx <= 8; gx++) {
    for (let gz = -7; gz <= 6; gz++) {
      const cx = gx * 11 + (rnd(k++) - 0.5) * 3;
      const cz = gz * 10 + (rnd(k++) - 0.5) * 3;
      if (Math.abs(cx) < 14 && Math.abs(cz) < 10) continue;
      if (cx > 55 && cz < -35) continue;
      if (cx < -95 || cx > 105 || cz < -85 || cz > 88) continue;
      if (rnd(k++) < 0.18) continue;

      const w = 5 + rnd(k++) * 5;
      const d = 4 + rnd(k++) * 5;
      const h = 2.2 + rnd(k++) * 3.5;
      const mat = rnd(k++) > 0.82 ? matSvc : matInd;
      boxes.push({ w, h, d, x: cx, z: cz, mat });
    }
  }

  for (const b of boxes) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), b.mat);
    mesh.position.set(b.x, b.h / 2 + 0.15, b.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mainScene.add(mesh);
  }
}

function addGreenBuffers() {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x4a6e38,
    roughness: 0.94,
    metalness: 0,
  });
  const pads = [
    { w: 38, d: 14, x: -95, z: 55, h: 0.35 },
    { w: 28, d: 55, x: 108, z: 20, h: 0.4 },
    { w: 50, d: 18, x: -30, z: -78, h: 0.32 },
    { w: 22, d: 30, x: 75, z: 62, h: 0.3 },
  ];
  for (const p of pads) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(p.w, p.h, p.d),
      mat
    );
    mesh.position.set(p.x, p.h / 2 + 0.05, p.z);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mainScene.add(mesh);
  }
}

function addMarkers() {
  const col = new THREE.CylinderGeometry(0.85, 1.15, 5.5, 20);
  const cap = new THREE.SphereGeometry(1.45, 28, 20);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xdcb248,
    emissive: 0x8b5a1a,
    emissiveIntensity: 0.4,
    roughness: 0.35,
    metalness: 0.55,
  });

  for (const poi of POIS) {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(col, mat);
    stem.position.y = 2.75;
    stem.castShadow = true;
    const ball = new THREE.Mesh(cap, mat);
    ball.position.y = 6.1;
    ball.castShadow = true;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.12, 10, 32),
      new THREE.MeshBasicMaterial({
        color: 0xb58234,
        transparent: true,
        opacity: 0.55,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.25;
    g.add(stem, ball, ring);
    g.position.set(...poi.position);
    g.userData.poi = poi;
    mainScene.add(g);
    markerMeshes.push(g);
  }
}


function initPano() {
  if (panoRenderer) return;
  const container = document.getElementById("pano-container");
  panoScene = new THREE.Scene();
  panoCamera = new THREE.PerspectiveCamera(
    72,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    1000
  );
  panoRenderer = new THREE.WebGLRenderer({ antialias: true });
  panoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  panoRenderer.setSize(container.clientWidth, container.clientHeight);
  panoRenderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(panoRenderer.domElement);

  loadSharedPanorama((tex) => {
    addEquirectMesh(panoScene, tex);
  });

  panoRenderer.domElement.addEventListener("pointerdown", (e) => {
    if (!modalOpen) return;
    modalPanoDrag = true;
    modalPanoPx = e.clientX;
    modalPanoPy = e.clientY;
  });
}

function openModal(poi) {
  if (viewMode !== "3d") return;
  modalOpen = true;
  const backdrop = document.getElementById("modal-backdrop");
  document.getElementById("modal-title").textContent = poi.title;
  document.getElementById("modal-desc").textContent = poi.description;
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  controls.enabled = false;

  if (!panoRenderer) initPano();
  else {
    const c = document.getElementById("pano-container");
    panoRenderer.setSize(c.clientWidth, c.clientHeight);
    panoCamera.aspect = c.clientWidth / Math.max(c.clientHeight, 1);
    panoCamera.updateProjectionMatrix();
  }
}

function closeModal() {
  modalOpen = false;
  modalPanoDrag = false;
  document.getElementById("modal-backdrop").classList.remove("open");
  document.getElementById("modal-backdrop").setAttribute("aria-hidden", "true");
  if (viewMode === "3d" && controls) controls.enabled = true;
}

function onClick(event) {
  if (modalOpen || viewMode !== "3d") return;
  const rect = mainRenderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, mainCamera);
  const hits = raycaster.intersectObjects(markerMeshes, true);
  if (hits.length === 0) return;
  let o = hits[0].object;
  while (o.parent && !o.userData.poi) o = o.parent;
  if (o.userData.poi) openModal(o.userData.poi);
}

function onResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  mainRenderer.setSize(window.innerWidth, window.innerHeight);
  if (panoRenderer && modalOpen) {
    const c = document.getElementById("pano-container");
    panoRenderer.setSize(c.clientWidth, c.clientHeight);
    panoCamera.aspect = c.clientWidth / Math.max(c.clientHeight, 1);
    panoCamera.updateProjectionMatrix();
  }
  if (viewMode === "pano360") resizeImmersive();
}

function animate() {
  requestAnimationFrame(animate);
  if (viewMode === "3d") {
    controls.update();
    mainRenderer.render(mainScene, mainCamera);
  }
  if (viewMode === "pano360" && immersiveRenderer) {
    updatePanoCamera(immersiveCamera, immersiveLon, immersiveLat);
    const pulse = 1 + 0.07 * Math.sin(performance.now() * 0.0028);
    for (const m of immersiveHotspotMeshes) {
      if (m.geometry?.type === "TorusGeometry") m.scale.setScalar(pulse);
    }
    immersiveRenderer.render(immersiveScene, immersiveCamera);
  }
  if (modalOpen && panoRenderer) {
    updatePanoCamera(panoCamera, modalPanoLon, modalPanoLat);
    panoRenderer.render(panoScene, panoCamera);
  }
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "modal-backdrop") closeModal();
});

initMain();
animate();

document.getElementById("btn-reset-view")?.addEventListener("click", () => resetView());

document.getElementById("tab-view-3d")?.addEventListener("click", () => setViewMode("3d"));
document.getElementById("tab-view-pano360")?.addEventListener("click", () => setViewMode("pano360"));

document.getElementById("immersive-hotspot-close")?.addEventListener("click", () => closeImmersiveHotspotSheet());
document.getElementById("immersive-hotspot-sheet")?.addEventListener("click", (e) => {
  if (e.target.id === "immersive-hotspot-sheet") closeImmersiveHotspotSheet();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && immersiveHotspotSheetOpen) {
    closeImmersiveHotspotSheet();
    return;
  }
  if (e.code === "Escape" && modalOpen) {
    closeModal();
    return;
  }
  if (modalOpen) return;
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT"))
    return;
  if (e.code === "KeyR") {
    e.preventDefault();
    resetView();
  }
});

console.info(
  "[Thịnh Minh demo] 1 unit ≈ %sm — mặt bằng ~%s×%s m (~500 ha concept)",
  SCALE_M_PER_UNIT,
  GROUND_W * SCALE_M_PER_UNIT,
  GROUND_D * SCALE_M_PER_UNIT
);
