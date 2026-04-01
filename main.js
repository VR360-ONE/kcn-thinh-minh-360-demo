import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { IMMERSIVE_HOTSPOTS_KCN_REAL } from "./kcn-real-hotspots.js";

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

// Chế độ 3D 360: bộ ảnh equirectangular thực địa V1 (4 góc — TT01…TT04)
const PANO_3D360_URLS = [
  new URL("./panoramas/v1_pc01.jpg", import.meta.url).href,
  new URL("./panoramas/v1_pc02.jpg", import.meta.url).href,
  new URL("./panoramas/v1_pc03.jpg", import.meta.url).href,
  new URL("./panoramas/v1_pc04.jpg", import.meta.url).href,
];
/** @type {number} */
let activePano3d360Index = 0;

function getPano3d360Url() {
  return PANO_3D360_URLS[activePano3d360Index] ?? PANO_3D360_URLS[0];
}

// Ảnh phối toàn cảnh thực tế dự án KCN Thịnh Minh (Dạ Hợp) — PCTT + topview
const PANO_KCN_REAL_URLS = [
  new URL("./panoramas/kcn_real_fr00.jpg", import.meta.url).href,
  new URL("./panoramas/kcn_real_fr01.jpg", import.meta.url).href,
  new URL("./panoramas/kcn_real_fr04.jpg", import.meta.url).href,
  new URL("./panoramas/kcn_real_fr05.jpg", import.meta.url).href,
  new URL("./panoramas/kcn_real_topview.jpg", import.meta.url).href,
];
let activePanoKcnRealIndex = 0;

function getPanoKcnRealUrl() {
  return PANO_KCN_REAL_URLS[activePanoKcnRealIndex] ?? PANO_KCN_REAL_URLS[0];
}

/**
 * Hotspot chế độ flycam / tổng thể (hilltop).
 * Vị trí minh họa — khi có ảnh flycam thật, căn lại lon/lat theo ảnh.
 */
const IMMERSIVE_HOTSPOTS_AERIAL = [
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

/** Hotspot chế độ 3D 360 — mỗi điểm gắn một ảnh V1 (TT01…TT04); lon/lat có thể hiệu chỉnh theo từng pano */
const IMMERSIVE_HOTSPOTS_3D360 = [
  {
    id: "v1-tt01",
    panoIndex: 0,
    title: "Thực địa V1 · TT 01",
    description:
      "Ảnh 360° từ bộ V1. Hotspot và vị trí trên cầu có thể tinh chỉnh theo từng file equirectangular.",
    lon: -25,
    lat: 2,
  },
  {
    id: "v1-tt02",
    panoIndex: 1,
    title: "Thực địa V1 · TT 02",
    description:
      "Góc quay 360 thứ hai trong bộ V1. Dùng thanh TT 01–04 bên dưới để đổi ảnh bất cứ lúc nào.",
    lon: 55,
    lat: -8,
  },
  {
    id: "v1-tt03",
    panoIndex: 2,
    title: "Thực địa V1 · TT 03",
    description:
      "Góc quay 360 thứ ba. Mỗi hotspot có thể mở nội dung riêng (video, PDF, form) khi triển khai production.",
    lon: 140,
    lat: -18,
  },
  {
    id: "v1-tt04",
    panoIndex: 3,
    title: "Thực địa V1 · TT 04",
    description:
      "Góc quay 360 thứ tư trong bộ V1 — KCN Thịnh Minh (Dạ Hợp).",
    lon: -160,
    lat: 35,
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

/** @type {"pano3d360" | "panoKcnReal"} */
let viewMode = "panoKcnReal";

let sharedPanoTex = null;
const panoTexWaiters = [];

/** @type {Map<string, THREE.Texture | null | undefined>} */
const immersiveTexCache = new Map();
/** @type {Map<string, Array<(t: THREE.Texture | null) => void>>} */
const immersiveTexWaiters = new Map();

let immersiveSphereMesh = null;
/** Hai mặt phẳng KCN (2D) để crossfade khi đổi ảnh */
let immersiveFlatMeshes = /** @type {[THREE.Mesh | null, THREE.Mesh | null]} */ ([
  null,
  null,
]);
let kcnFlatFrontIndex = 0;
let kcnFlatTransitionGen = 0;
let kcnFlatCrossfading = false;
const KCN_FLAT_FADE_MS = 420;

function getKcnFlatFrontMesh() {
  return immersiveFlatMeshes[kcnFlatFrontIndex];
}

let immersiveScene,
  immersivePerspectiveCamera,
  immersiveOrthoCamera,
  immersiveRenderer;
let immersiveReady = false;

function isImmersiveKcnFlatMode() {
  return viewMode === "panoKcnReal";
}

function getImmersiveActiveCamera() {
  return isImmersiveKcnFlatMode() ? immersiveOrthoCamera : immersivePerspectiveCamera;
}

let modalPanoLon = 0;
let modalPanoLat = 0;
/** Góc đã nội suy — dùng cho camera (target: modalPanoLon / modalPanoLat) */
let modalPanoLonView = 0;
let modalPanoLatView = 0;
let modalPanoDrag = false;
let modalPanoPx = 0;
let modalPanoPy = 0;

let immersiveLon = 0;
let immersiveLat = 0;
/** Góc đã nội suy — dùng cho camera (target: immersiveLon / immersiveLat) */
let immersiveLonView = 0;
let immersiveLatView = 0;
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

let immersiveLoadingGen = 0;

function showImmersiveLoading() {
  immersiveLoadingGen += 1;
  const id = immersiveLoadingGen;
  const el = document.getElementById("immersive-loading");
  if (el) {
    el.classList.add("immersive-loading--visible");
    el.setAttribute("aria-busy", "true");
    el.setAttribute("aria-hidden", "false");
  }
  return id;
}

function hideImmersiveLoading(id) {
  if (id !== immersiveLoadingGen) return;
  const el = document.getElementById("immersive-loading");
  if (el) {
    el.classList.remove("immersive-loading--visible");
    el.setAttribute("aria-busy", "false");
    el.setAttribute("aria-hidden", "true");
  }
}

const DEFAULT_CAM_POS = new THREE.Vector3(175, 195, 205);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

/** Hệ số làm mượt xoay 360 (lambda exponential theo dt; càng lớn càng bám nhanh target) */
const PANO_ANGLE_SMOOTH_LAMBDA = 26;

let panoAngleSmoothLastT = 0;

function stepPanoramaAngleSmoothing() {
  const immersiveOn = isImmersivePanoramaMode() && immersiveRenderer;
  const modalOn = modalOpen && panoRenderer;
  if (!immersiveOn && !modalOn) {
    panoAngleSmoothLastT = 0;
    return;
  }
  const now = performance.now();
  const dt = panoAngleSmoothLastT
    ? Math.min((now - panoAngleSmoothLastT) / 1000, 0.09)
    : 0.016;
  panoAngleSmoothLastT = now;
  const k = 1 - Math.exp(-PANO_ANGLE_SMOOTH_LAMBDA * dt);
  if (immersiveOn && !isImmersiveKcnFlatMode()) {
    immersiveLonView += (immersiveLon - immersiveLonView) * k;
    immersiveLatView += (immersiveLat - immersiveLatView) * k;
  }
  if (modalOn) {
    modalPanoLonView += (modalPanoLon - modalPanoLonView) * k;
    modalPanoLatView += (modalPanoLat - modalPanoLatView) * k;
  }
}

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

function loadImmersivePanoramaUrl(url, onLoaded) {
  const cached = immersiveTexCache.get(url);
  if (cached !== undefined && cached !== null) {
    onLoaded(cached);
    return;
  }
  let waiters = immersiveTexWaiters.get(url);
  if (!waiters) {
    immersiveTexWaiters.set(url, []);
    waiters = immersiveTexWaiters.get(url);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        immersiveTexCache.set(url, tex);
        const w = immersiveTexWaiters.get(url) || [];
        immersiveTexWaiters.set(url, []);
        w.forEach((fn) => fn(tex));
      },
      undefined,
      () => {
        immersiveTexCache.delete(url);
        const w = immersiveTexWaiters.get(url) || [];
        immersiveTexWaiters.set(url, []);
        w.forEach((fn) => fn(null));
      }
    );
  }
  waiters.push(onLoaded);
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

function addImmersiveHotspots(scene, hotspotList) {
  const old = scene.getObjectByName("immersive-hotspots");
  if (old) scene.remove(old);
  immersiveHotspotMeshes.length = 0;

  const group = new THREE.Group();
  group.name = "immersive-hotspots";
  const matCore = new THREE.MeshBasicMaterial({
    color: 0xe4c065,
    transparent: true,
    opacity: 0.95,
    depthTest: true,
    depthWrite: false,
  });
  const matRing = new THREE.MeshBasicMaterial({
    color: 0xc9a227,
    transparent: true,
    opacity: 0.55,
    depthTest: true,
    depthWrite: false,
  });

  const R = 448;
  for (const h of hotspotList) {
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

/** Hotspot trên ảnh 2D: u,v ∈ [0,1] (góc trên-trái = 0,0), mặt phẳng tại z = planeZ */
function addFlatImmersiveHotspots(scene, hotspotList, planeW, planeH, planeZ = -1) {
  const old = scene.getObjectByName("immersive-hotspots");
  if (old) scene.remove(old);
  immersiveHotspotMeshes.length = 0;

  const group = new THREE.Group();
  group.name = "immersive-hotspots";
  const matCore = new THREE.MeshBasicMaterial({
    color: 0xe4c065,
    transparent: true,
    opacity: 0.95,
    depthTest: true,
    depthWrite: false,
  });
  const matRing = new THREE.MeshBasicMaterial({
    color: 0xc9a227,
    transparent: true,
    opacity: 0.55,
    depthTest: true,
    depthWrite: false,
  });

  const zOff = planeZ + 0.04;
  const scale = Math.min(planeW, planeH) * 0.018;
  const coreR = scale * 0.45;
  const ringR = scale * 0.95;

  for (const h of hotspotList) {
    const u = typeof h.u === "number" ? h.u : 0.5;
    const v = typeof h.v === "number" ? h.v : 0.5;
    const x = (u - 0.5) * planeW;
    const y = (0.5 - v) * planeH;
    const pos = new THREE.Vector3(x, y, zOff);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(coreR, 16, 12),
      matCore
    );
    core.position.copy(pos);
    core.userData.hotspot = h;
    group.add(core);
    immersiveHotspotMeshes.push(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringR, ringR * 0.08, 8, 28),
      matRing
    );
    ring.position.copy(pos);
    ring.userData.hotspot = h;
    group.add(ring);
    immersiveHotspotMeshes.push(ring);
  }
  scene.add(group);
}

function computeKcnFlatPlaneSize(tex) {
  if (!tex?.image) {
    return { pw: 2, ph: 2 };
  }
  const iw = tex.image.width || 1;
  const ih = tex.image.height || 1;
  const ai = iw / ih;
  const w = window.innerWidth;
  const h = Math.max(window.innerHeight, 1);
  const av = w / h;
  const Wv = 2 * av;
  const Hv = 2;
  const pw = Math.max(Wv, Hv * ai);
  const ph = pw / ai;
  return { pw, ph };
}

function applyKcnFlatPlaneGeometry(mesh, pw, ph) {
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(pw, ph);
  mesh.position.set(0, 0, -1);
}

function snapKcnFlatToFrontOnly() {
  kcnFlatCrossfading = false;
  const fm = getKcnFlatFrontMesh();
  const bm = immersiveFlatMeshes[1 - kcnFlatFrontIndex];
  if (!fm || !bm) return;
  bm.visible = false;
  bm.material.opacity = 0;
  bm.material.map = null;
  bm.material.transparent = true;
  bm.material.depthWrite = true;
  bm.material.needsUpdate = true;
  bm.renderOrder = 0;
  fm.visible = !!fm.material.map;
  fm.material.opacity = 1;
  fm.material.transparent = false;
  fm.material.depthWrite = true;
  fm.material.needsUpdate = true;
  fm.renderOrder = 0;
}

function applyImmersiveKcnRealFlat(url, loadId) {
  const m0 = immersiveFlatMeshes[0];
  const m1 = immersiveFlatMeshes[1];
  if (!m0 || !m1) {
    hideImmersiveLoading(loadId);
    return;
  }

  loadImmersivePanoramaUrl(url, (tex) => {
    if (!immersiveFlatMeshes[0] || !immersiveFlatMeshes[1]) {
      hideImmersiveLoading(loadId);
      return;
    }
    if (getPanoKcnRealUrl() !== url) {
      hideImmersiveLoading(loadId);
      return;
    }

    kcnFlatTransitionGen += 1;
    const myGen = kcnFlatTransitionGen;
    snapKcnFlatToFrontOnly();

    const front = immersiveFlatMeshes[kcnFlatFrontIndex];
    const back = immersiveFlatMeshes[1 - kcnFlatFrontIndex];
    const matF = front.material;
    const matB = back.material;

    const hlNow = () => pickImmersiveHotspotsForMode("panoKcnReal");

    if (!tex?.image) {
      matF.map = null;
      matF.color.setHex(0x305c5a);
      matF.needsUpdate = true;
      front.visible = true;
      addFlatImmersiveHotspots(immersiveScene, hlNow(), 2, 2, -1);
      hideImmersiveLoading(loadId);
      return;
    }

    const { pw, ph } = computeKcnFlatPlaneSize(tex);
    applyKcnFlatPlaneGeometry(front, pw, ph);
    applyKcnFlatPlaneGeometry(back, pw, ph);

    const hadImage = !!(matF.map && matF.map.image);
    if (hadImage && matF.map === tex) {
      matF.map = tex;
      matF.color.setHex(0xffffff);
      matF.needsUpdate = true;
      front.visible = true;
      addFlatImmersiveHotspots(immersiveScene, hlNow(), pw, ph, front.position.z);
      hideImmersiveLoading(loadId);
      return;
    }

    if (!hadImage) {
      matF.map = tex;
      matF.color.setHex(0xffffff);
      matF.transparent = false;
      matF.opacity = 1;
      matF.depthWrite = true;
      matF.needsUpdate = true;
      front.visible = true;
      back.visible = false;
      addFlatImmersiveHotspots(immersiveScene, hlNow(), pw, ph, front.position.z);
      hideImmersiveLoading(loadId);
      return;
    }

    hideImmersiveLoading(loadId);

    matB.map = tex;
    matB.color.setHex(0xffffff);
    matB.transparent = true;
    matB.opacity = 1;
    matB.depthWrite = false;
    matB.needsUpdate = true;
    back.visible = true;
    back.renderOrder = 0;

    matF.transparent = true;
    matF.opacity = 1;
    matF.depthWrite = false;
    matF.needsUpdate = true;
    front.visible = true;
    front.renderOrder = 1;

    kcnFlatCrossfading = true;
    const t0 = performance.now();

    function step(now) {
      if (myGen !== kcnFlatTransitionGen) return;
      if (getPanoKcnRealUrl() !== url) return;
      const t = Math.min(1, (now - t0) / KCN_FLAT_FADE_MS);
      const eased = 1 - (1 - t) * (1 - t);
      matF.opacity = 1 - eased;
      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }

      if (myGen !== kcnFlatTransitionGen) return;
      if (getPanoKcnRealUrl() !== url) return;

      kcnFlatCrossfading = false;
      matF.map = null;
      matF.opacity = 1;
      matF.transparent = false;
      matF.depthWrite = true;
      matF.needsUpdate = true;
      front.visible = false;
      front.renderOrder = 0;

      matB.depthWrite = true;
      matB.transparent = false;
      matB.needsUpdate = true;
      back.renderOrder = 0;

      kcnFlatFrontIndex = 1 - kcnFlatFrontIndex;
      const newFront = getKcnFlatFrontMesh();
      addFlatImmersiveHotspots(
        immersiveScene,
        hlNow(),
        pw,
        ph,
        newFront.position.z
      );
    }
    requestAnimationFrame(step);
  });
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
  immersiveLon = immersiveLat = 0;
  immersiveLonView = immersiveLatView = 0;
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
  if (viewMode === "pano3d360" && typeof h.panoIndex === "number") {
    setPano3d360Index(h.panoIndex);
  }
  if (viewMode === "panoKcnReal" && typeof h.panoIndex === "number") {
    setPanoKcnRealIndex(h.panoIndex);
  }
  titleEl.textContent = h.title;
  descEl.textContent = h.description;
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
  immersiveHotspotSheetOpen = true;
}

function immersiveTryHotspotClick(clientX, clientY) {
  if (!getImmersiveActiveCamera() || !immersiveRenderer || !raycaster) return;
  if (immersiveHotspotSheetOpen) return;
  if (isImmersiveKcnFlatMode() && kcnFlatCrossfading) return;
  const rect = immersiveRenderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, getImmersiveActiveCamera());
  const hits = raycaster.intersectObjects(immersiveHotspotMeshes, true);
  if (hits.length === 0) return;
  let o = hits[0].object;
  while (o && !o.userData.hotspot) o = o.parent;
  if (o?.userData?.hotspot) openImmersiveHotspotSheet(o.userData.hotspot);
}

function isImmersivePanoramaMode() {
  return viewMode === "pano3d360" || viewMode === "panoKcnReal";
}

function syncPano3d360PickerUI() {
  const bar = document.getElementById("pano3d360-picker");
  if (!bar) return;
  for (const btn of bar.querySelectorAll("[data-pano-idx]")) {
    const i = Number(btn.getAttribute("data-pano-idx"));
    btn.classList.toggle("pano3d360-picker__btn--active", i === activePano3d360Index);
    btn.setAttribute("aria-pressed", i === activePano3d360Index ? "true" : "false");
  }
}

function setPano3d360Index(idx) {
  if (idx < 0 || idx >= PANO_3D360_URLS.length) return;
  if (idx === activePano3d360Index) {
    syncPano3d360PickerUI();
    return;
  }
  activePano3d360Index = idx;
  if (viewMode === "pano3d360") applyImmersivePanoContent("pano3d360");
  syncPano3d360PickerUI();
}

function syncPanoKcnRealPickerUI() {
  const bar = document.getElementById("pano-kcn-real-picker");
  if (!bar) return;
  for (const btn of bar.querySelectorAll("[data-pano-idx]")) {
    const i = Number(btn.getAttribute("data-pano-idx"));
    btn.classList.toggle("pano3d360-picker__btn--active", i === activePanoKcnRealIndex);
    btn.setAttribute("aria-pressed", i === activePanoKcnRealIndex ? "true" : "false");
  }
}

function setPanoKcnRealIndex(idx) {
  if (idx < 0 || idx >= PANO_KCN_REAL_URLS.length) return;
  if (idx === activePanoKcnRealIndex) {
    syncPanoKcnRealPickerUI();
    return;
  }
  activePanoKcnRealIndex = idx;
  if (viewMode === "panoKcnReal") applyImmersivePanoContent("panoKcnReal");
  syncPanoKcnRealPickerUI();
}

function getImmersivePanoramaUrlForMode(mode) {
  if (mode === "pano360") return AERIAL_PANO_URL;
  if (mode === "pano3d360") return getPano3d360Url();
  if (mode === "panoKcnReal") return getPanoKcnRealUrl();
  return AERIAL_PANO_URL;
}

function pickImmersiveHotspotsForMode(mode) {
  if (mode === "pano360") return IMMERSIVE_HOTSPOTS_AERIAL;
  if (mode === "pano3d360") {
    return IMMERSIVE_HOTSPOTS_3D360.filter((h) => h.panoIndex === activePano3d360Index);
  }
  if (mode === "panoKcnReal") {
    return IMMERSIVE_HOTSPOTS_KCN_REAL.filter((h) => h.panoIndex === activePanoKcnRealIndex);
  }
  return [];
}

function applyImmersivePanoContent(mode) {
  if (!immersiveScene || !immersiveSphereMesh || !immersiveFlatMeshes[0]) return;
  const url = getImmersivePanoramaUrlForMode(mode);
  const hotspotList = pickImmersiveHotspotsForMode(mode);
  const loadId = showImmersiveLoading();

  if (mode === "panoKcnReal") {
    immersiveSphereMesh.visible = false;
    immersiveFlatMeshes.forEach((m, i) => {
      if (!m) return;
      m.visible = i === kcnFlatFrontIndex;
    });
    applyImmersiveKcnRealFlat(url, loadId);
    return;
  }

  kcnFlatTransitionGen += 1;
  snapKcnFlatToFrontOnly();
  immersiveFlatMeshes.forEach((m) => {
    if (m) m.visible = false;
  });
  immersiveSphereMesh.visible = true;
  loadImmersivePanoramaUrl(url, (tex) => {
    if (!immersiveSphereMesh) {
      hideImmersiveLoading(loadId);
      return;
    }
    const mat = immersiveSphereMesh.material;
    if (mat.map) mat.map.dispose();
    mat.map = tex || null;
    mat.color.setHex(tex ? 0xffffff : 0x305c5a);
    mat.needsUpdate = true;
    hideImmersiveLoading(loadId);
  });
  addImmersiveHotspots(immersiveScene, hotspotList);
}

function ensureImmersivePano() {
  if (immersiveRenderer) return;
  const root = document.getElementById("immersive-pano-root");
  if (!root) return;
  const aspect0 = window.innerWidth / Math.max(window.innerHeight, 1);
  immersiveScene = new THREE.Scene();
  immersivePerspectiveCamera = new THREE.PerspectiveCamera(
    72,
    aspect0,
    0.1,
    1000
  );
  immersiveOrthoCamera = new THREE.OrthographicCamera(
    -aspect0,
    aspect0,
    1,
    -1,
    0.05,
    50
  );
  immersiveOrthoCamera.position.set(0, 0, 0);
  immersiveOrthoCamera.lookAt(0, 0, -1);

  immersiveRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  immersiveRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  immersiveRenderer.setSize(window.innerWidth, window.innerHeight);
  immersiveRenderer.outputColorSpace = THREE.SRGBColorSpace;
  immersiveRenderer.sortObjects = true;
  root.appendChild(immersiveRenderer.domElement);

  const geo = new THREE.SphereGeometry(500, 56, 36);
  geo.scale(-1, 1, 1);
  immersiveSphereMesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: 0x305c5a })
  );
  immersiveScene.add(immersiveSphereMesh);

  const flatMat = () =>
    new THREE.MeshBasicMaterial({
      color: 0x305c5a,
      transparent: true,
      opacity: 1,
      depthWrite: true,
    });
  for (let i = 0; i < 2; i += 1) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), flatMat());
    m.visible = false;
    m.position.set(0, 0, -1);
    immersiveScene.add(m);
    immersiveFlatMeshes[i] = m;
  }

  immersiveRenderer.domElement.addEventListener("pointerdown", (e) => {
    if (!isImmersivePanoramaMode()) return;
    immersivePointerDown = true;
    immersivePanSliding = false;
    immersivePanMaxDist = 0;
    immersivePanStartX = immersivePx = e.clientX;
    immersivePanStartY = immersivePy = e.clientY;
  });
  immersiveReady = true;
}

function resizeImmersive() {
  if (!immersiveRenderer || !immersivePerspectiveCamera) return;
  const w = window.innerWidth;
  const h = Math.max(window.innerHeight, 1);
  const av = w / h;
  immersivePerspectiveCamera.aspect = av;
  immersivePerspectiveCamera.updateProjectionMatrix();
  immersiveOrthoCamera.left = -av;
  immersiveOrthoCamera.right = av;
  immersiveOrthoCamera.top = 1;
  immersiveOrthoCamera.bottom = -1;
  immersiveOrthoCamera.updateProjectionMatrix();
  immersiveRenderer.setSize(w, h);
  if (isImmersiveKcnFlatMode()) {
    const fm = getKcnFlatFrontMesh();
    const om = immersiveFlatMeshes[1 - kcnFlatFrontIndex];
    const refMesh =
      kcnFlatCrossfading && om?.visible && om.material.map ? om : fm;
    if (refMesh?.material.map?.image) {
      const { pw, ph } = computeKcnFlatPlaneSize(refMesh.material.map);
      applyKcnFlatPlaneGeometry(fm, pw, ph);
      if (om?.visible) {
        applyKcnFlatPlaneGeometry(om, pw, ph);
      }
      const hl = pickImmersiveHotspotsForMode("panoKcnReal");
      addFlatImmersiveHotspots(immersiveScene, hl, pw, ph, fm.position.z);
    }
  }
}

function setViewMode(mode) {
  if (mode !== "pano3d360" && mode !== "panoKcnReal") return;
  viewMode = mode;
  document.body.classList.add("view-pano360");
  document.body.classList.toggle("view-pano3d360", mode === "pano3d360");
  document.body.classList.toggle("view-pano-kcn-real", mode === "panoKcnReal");

  const wrap = document.getElementById("canvas-wrap");
  const root = document.getElementById("immersive-pano-root");
  const tkcn = document.getElementById("tab-view-pano-kcn-real");
  const t3d = document.getElementById("tab-view-pano3d360");
  const hint = document.querySelector(".pano360-hint");

  closeImmersiveHotspotSheet();
  closeModal();
  ensureImmersivePano();
  applyImmersivePanoContent(mode);
  immersiveLon = immersiveLat = 0;
  immersiveLonView = immersiveLatView = 0;
  resizeImmersive();
  syncPano3d360PickerUI();
  syncPanoKcnRealPickerUI();
  if (wrap) {
    wrap.classList.add("view-hidden");
    wrap.setAttribute("aria-hidden", "true");
  }
  if (root) {
    root.classList.add("is-active");
    root.setAttribute("aria-hidden", "false");
  }
  if (controls) controls.enabled = false;

  for (const el of [tkcn, t3d]) {
    el?.classList.remove("view-toggle__btn--active");
    el?.setAttribute("aria-selected", "false");
  }
  if (mode === "panoKcnReal") {
    tkcn?.classList.add("view-toggle__btn--active");
    tkcn?.setAttribute("aria-selected", "true");
    if (hint) {
      hint.innerHTML =
        "Ảnh phối <strong>thực tế dự án</strong> (không phải 360°) — <strong>chấm vàng</strong> là hotspot (chạm) · <kbd>R</kbd> / <kbd>Esc</kbd>";
    }
  } else {
    t3d?.classList.add("view-toggle__btn--active");
    t3d?.setAttribute("aria-selected", "true");
    if (hint) {
      hint.innerHTML =
        "<strong>Minh họa</strong> tour 360° thực địa (TT 01–04) — hướng triển khai tương lai — <strong>chấm vàng</strong> là hotspot · kéo xoay · <kbd>R</kbd> / <kbd>Esc</kbd>";
    }
  }
  document.querySelectorAll(".mobile-nav__tab[data-set-view]").forEach((btn) => {
    const m = btn.getAttribute("data-set-view");
    const on = viewMode === m;
    btn.classList.toggle("mobile-nav__tab--active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function closeMobileNav() {
  if (!document.body.classList.contains("mobile-nav-open")) return;
  document.body.classList.remove("mobile-nav-open");
  const toggle = document.getElementById("mobile-nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  const overlay = document.getElementById("mobile-nav-overlay");
  toggle?.setAttribute("aria-expanded", "false");
  drawer?.setAttribute("aria-hidden", "true");
  overlay?.setAttribute("aria-hidden", "true");
}

const MOBILE_NAV_BREAKPOINT_PX = 720;

function openMobileNav() {
  document.body.classList.add("mobile-nav-open");
  const toggle = document.getElementById("mobile-nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  const overlay = document.getElementById("mobile-nav-overlay");
  toggle?.setAttribute("aria-expanded", "true");
  drawer?.setAttribute("aria-hidden", "false");
  overlay?.setAttribute("aria-hidden", "false");
}

function toggleMobileNav() {
  if (document.body.classList.contains("mobile-nav-open")) closeMobileNav();
  else openMobileNav();
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
    if (immersivePointerDown && isImmersivePanoramaMode()) {
      immersivePanMaxDist = Math.max(
        immersivePanMaxDist,
        Math.hypot(
          e.clientX - immersivePanStartX,
          e.clientY - immersivePanStartY
        )
      );
      if (immersivePanMaxDist > 14) immersivePanSliding = true;
    }
    if (immersivePanSliding && isImmersivePanoramaMode() && !isImmersiveKcnFlatMode()) {
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
      isImmersivePanoramaMode() &&
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
    color: 0xe4c065,
    emissive: 0x6b5420,
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
        color: 0xc9a227,
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
  modalPanoLonView = modalPanoLon;
  modalPanoLatView = modalPanoLat;
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
  if (isImmersivePanoramaMode()) resizeImmersive();
}

function animate() {
  requestAnimationFrame(animate);
  stepPanoramaAngleSmoothing();
  if (viewMode === "3d") {
    controls.update();
    mainRenderer.render(mainScene, mainCamera);
  }
  if (isImmersivePanoramaMode() && immersiveRenderer) {
    if (!isImmersiveKcnFlatMode()) {
      updatePanoCamera(
        immersivePerspectiveCamera,
        immersiveLonView,
        immersiveLatView
      );
    }
    const pulse = 1 + 0.07 * Math.sin(performance.now() * 0.0028);
    for (const m of immersiveHotspotMeshes) {
      if (m.geometry?.type === "TorusGeometry") m.scale.setScalar(pulse);
    }
    immersiveRenderer.render(immersiveScene, getImmersiveActiveCamera());
  }
  if (modalOpen && panoRenderer) {
    updatePanoCamera(panoCamera, modalPanoLonView, modalPanoLatView);
    panoRenderer.render(panoScene, panoCamera);
  }
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "modal-backdrop") closeModal();
});

initMain();
setViewMode("panoKcnReal");
animate();

document.querySelectorAll(".js-btn-reset-view").forEach((btn) => {
  btn.addEventListener("click", () => {
    resetView();
    closeMobileNav();
  });
});

document.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-set-view]");
  if (!tab) return;
  const mode = tab.getAttribute("data-set-view");
  if (mode !== "panoKcnReal" && mode !== "pano3d360") return;
  e.preventDefault();
  setViewMode(mode);
  closeMobileNav();
});

document.getElementById("mobile-nav-toggle")?.addEventListener("click", () => toggleMobileNav());
document.getElementById("mobile-nav-close")?.addEventListener("click", () => closeMobileNav());
document.getElementById("mobile-nav-overlay")?.addEventListener("click", () => closeMobileNav());

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_NAV_BREAKPOINT_PX) closeMobileNav();
});

document.getElementById("pano3d360-picker")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pano-idx]");
  if (!btn || viewMode !== "pano3d360") return;
  e.preventDefault();
  setPano3d360Index(Number(btn.getAttribute("data-pano-idx")));
});

document.getElementById("pano-kcn-real-picker")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pano-idx]");
  if (!btn || viewMode !== "panoKcnReal") return;
  e.preventDefault();
  setPanoKcnRealIndex(Number(btn.getAttribute("data-pano-idx")));
});

document.getElementById("immersive-hotspot-close")?.addEventListener("click", () => closeImmersiveHotspotSheet());
document.getElementById("immersive-hotspot-sheet")?.addEventListener("click", (e) => {
  if (e.target.id === "immersive-hotspot-sheet") closeImmersiveHotspotSheet();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && document.body.classList.contains("mobile-nav-open")) {
    closeMobileNav();
    return;
  }
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
