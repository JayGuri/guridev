'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Project Data (edit this to personalise) ─────────────────────────────────
export const SCREENS_DATA = {
  dev: {
    label: 'The Builder', tab: '--dev', color: '#7C6FF7', hex: 0x7C6FF7,
    projects: [
      { name: 'CLIfolio',  tech: 'Next.js · Three.js · Framer', desc: 'Terminal portfolio with immersive 3D room', github: '#', live: '#' },
      { name: 'DataPulse', tech: 'React · D3 · Node.js',        desc: 'Real-time analytics dashboard - 1.2k *',   github: '#', live: '#' },
      { name: 'APIForge',  tech: 'Node.js · PostgreSQL · Redis', desc: 'Developer API management platform',        github: '#', live: null },
    ],
  },
  research: {
    label: 'The Researcher', tab: '--research', color: '#E8935A', hex: 0xE8935A,
    projects: [
      { name: 'Multi-Hazard EWS',  tech: 'Python · ML · GIS',      desc: 'Early warning system for disasters', github: '#', live: null },
      { name: 'EEG/EMG Detection', tech: 'Signal Processing · CNN', desc: 'Neural signal classification',       github: '#', live: null },
    ],
  },
  aiml: {
    label: 'AI / ML', tab: '--aiml', color: '#28C840', hex: 0x28C840,
    projects: [
      { name: 'ARFL Platform',   tech: 'PyTorch · FastAPI · FL',  desc: 'Adaptive federated learning platform',  github: '#', live: '#' },
      { name: 'Vision Pipeline', tech: 'YOLOv8 · OpenCV · CUDA',  desc: 'Real-time multi-class detection',       github: '#', live: null },
    ],
  },
};

// ─── Scene Layout ─────────────────────────────────────────────────────────────
const DESK_Y = 0.80;
const MON_Y  = 1.94;
const MON_Z  = -0.44;

const MONITOR_CONFIG = {
  dev:      { pos: [-2.4, MON_Y, MON_Z], rotY:  0.28, camPos: [-1.62, MON_Y, 2.9],  camLook: [-2.4, MON_Y, MON_Z] },
  aiml:     { pos: [ 0.0, MON_Y, MON_Z], rotY:  0.00, camPos: [ 0.00, MON_Y, 3.1],  camLook: [ 0.0, MON_Y, MON_Z] },
  research: { pos: [ 2.4, MON_Y, MON_Z], rotY: -0.28, camPos: [ 1.62, MON_Y, 2.9],  camLook: [ 2.4, MON_Y, MON_Z] },
};

const OVERVIEW = { pos: [0, 2.35, 7.2], look: [0, 1.84, 0] };

// ─── Canvas Texture Builder ───────────────────────────────────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildScreenCanvas(id) {
  const CW = 1024, CH = 620;
  const cv  = document.createElement('canvas');
  cv.width  = CW; cv.height = CH;
  const ctx = cv.getContext('2d');
  const d   = SCREENS_DATA[id];

  // Background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, CW, CH);

  // Subtle CRT scanlines
  for (let sy = 0; sy < CH; sy += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.055)';
    ctx.fillRect(0, sy, CW, 1);
  }

  // ── Title bar ──
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 0, CW, 52);
  ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 52); ctx.lineTo(CW, 52); ctx.stroke();

  // Traffic lights
  [['#FF5F57', 22], ['#FEBC2E', 46], ['#28C840', 70]].forEach(([c, x]) => {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x, 26, 7, 0, Math.PI * 2); ctx.fill();
  });

  // Tab label
  ctx.font = '600 14px "JetBrains Mono","Courier New",monospace';
  ctx.fillStyle = d.color;
  ctx.fillText(d.tab, 96, 32);

  // Right status
  ctx.font = '12px "JetBrains Mono","Courier New",monospace';
  ctx.fillStyle = '#3d444d';
  const stxt = `${d.projects.length} entries`;
  ctx.fillText(stxt, CW - ctx.measureText(stxt).width - 20, 32);

  // ── Prompt line ──
  const pw = (s) => ctx.measureText(s).width;
  ctx.font = '13px "JetBrains Mono","Courier New",monospace';
  let cx = 24;
  ctx.fillStyle = '#28C840'; ctx.fillText('visitor@portfolio', cx, 82); cx += pw('visitor@portfolio');
  ctx.fillStyle = '#7d8590'; ctx.fillText(':', cx, 82); cx += pw(':');
  ctx.fillStyle = d.color;   ctx.fillText('~/work', cx, 82);            cx += pw('~/work');
  ctx.fillStyle = '#e6edf3'; ctx.fillText(' ❯ cat projects.json', cx, 82);

  // Divider
  ctx.fillStyle = '#21262d';
  ctx.fillRect(24, 98, CW - 48, 1);

  // ── Category heading ──
  ctx.font = 'bold 22px "JetBrains Mono","Courier New",monospace';
  ctx.fillStyle = d.color;
  ctx.fillText(d.label, 24, 134);
  ctx.font = '12px "JetBrains Mono","Courier New",monospace';
  ctx.fillStyle = '#3d444d';
  ctx.fillText(`[ ${d.projects.length} projects ]`, 28 + pw(d.label), 134);

  // ── Project rows ──
  const total     = d.projects.length;
  const available = CH - 154 - 40;
  const rowGap    = Math.floor(available / total);
  const rowH      = Math.min(rowGap - 10, 128);
  const zones     = [];

  d.projects.forEach((p, i) => {
    const ry = 154 + i * rowGap;
    zones.push({ yMin: ry, yMax: ry + rowH });

    // Card BG
    ctx.fillStyle = 'rgba(20,28,46,0.70)';
    rr(ctx, 14, ry, CW - 28, rowH, 6); ctx.fill();
    ctx.strokeStyle = '#253055'; ctx.lineWidth = 0.8;
    rr(ctx, 14, ry, CW - 28, rowH, 6); ctx.stroke();

    // Left accent
    ctx.fillStyle = d.color;
    ctx.fillRect(14, ry, 3, rowH);

    // Index
    ctx.font = '11px "JetBrains Mono","Courier New",monospace';
    ctx.fillStyle = '#3d444d';
    ctx.fillText(`0${i + 1}`, 28, ry + 20);

    // Project name
    ctx.font = 'bold 17px "JetBrains Mono","Courier New",monospace';
    ctx.fillStyle = '#79c0ff';
    ctx.fillText(p.name, 60, ry + 22);

    // "→ open" pill
    const btnLabel = '→ open';
    const btnW     = ctx.measureText(btnLabel).width + 22;
    ctx.font = '12px "JetBrains Mono","Courier New",monospace';
    ctx.fillStyle = d.color + '22';
    rr(ctx, CW - btnW - 16, ry + 7, btnW, 22, 4); ctx.fill();
    ctx.strokeStyle = d.color + '55'; ctx.lineWidth = 0.7;
    rr(ctx, CW - btnW - 16, ry + 7, btnW, 22, 4); ctx.stroke();
    ctx.fillStyle = d.color;
    ctx.fillText(btnLabel, CW - btnW - 5, ry + 22);

    // Tech stack
    ctx.font = '13px "JetBrains Mono","Courier New",monospace';
    ctx.fillStyle = '#ffa657';
    ctx.fillText(p.tech, 60, ry + 44);

    // Description (truncate)
    ctx.font = '12px "JetBrains Mono","Courier New",monospace';
    ctx.fillStyle = '#8b949e';
    const maxW = CW - 60 - btnW - 30;
    let desc = p.desc;
    while (desc.length > 4 && ctx.measureText(desc).width > maxW) desc = desc.slice(0, -1);
    if (desc !== p.desc) desc = desc.trimEnd() + '…';
    ctx.fillText(desc, 60, ry + 64);

    // Links
    if (rowH >= 90) {
      ctx.font = '11px "JetBrains Mono","Courier New",monospace';
      let lx = 60;
      if (p.github) {
        ctx.fillStyle = '#388bfd';
        ctx.fillText('⌥ GitHub', lx, ry + rowH - 14);
        lx += ctx.measureText('⌥ GitHub').width + 18;
      }
      if (p.live) {
        ctx.fillStyle = d.color;
        ctx.fillText('↗ Live', lx, ry + rowH - 14);
      }
    }
  });

  // ── Footer bar ──
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, CH - 36, CW, 36);
  ctx.strokeStyle = '#21262d'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, CH - 36); ctx.lineTo(CW, CH - 36); ctx.stroke();
  ctx.font = '11px "JetBrains Mono","Courier New",monospace';
  ctx.fillStyle = '#3d444d';
  ctx.fillText('click a project to open details · esc to close', 24, CH - 13);
  ctx.fillStyle = d.color;
  ctx.fillText(' ▮', 24 + ctx.measureText('click a project to open details · esc to close').width, CH - 13);

  return { canvas: cv, zones, canvasH: CH };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoomScene({ activeScreen, onScreenClick, onOpenProject }) {
  const mountRef = useRef(null);
  const refs     = useRef({});

  // ── Build scene ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled     = true;
    renderer.shadowMap.type        = THREE.PCFSoftShadowMap;
    renderer.toneMapping           = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure   = 2.2;
    renderer.outputColorSpace      = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x03040a, 0.034);
    scene.background = new THREE.Color(0x03040a);

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 80);
    camera.position.set(...OVERVIEW.pos);
    camera.lookAt(...OVERVIEW.look);

    const S = {
      renderer, scene, camera,
      clock:       new THREE.Clock(),
      raycaster:   new THREE.Raycaster(),
      mouseNDC:    new THREE.Vector2(),
      targetPos:   new THREE.Vector3(...OVERVIEW.pos),
      targetLook:  new THREE.Vector3(...OVERVIEW.look),
      currentLook: new THREE.Vector3(...OVERVIEW.look),
      activeId:    null, hovered: null,
      clickTargets: [],
      screens:      {},
      monLights:    {},
      steamGeo:     null, steamMesh: null,
      dustGeo:      null, dustSpeeds: null,
      disposed: false, raf: null,
    };
    refs.current = S;

    // ══════════════════════════════════════════════════
    // LIGHTING — rebuilt for visibility
    // ══════════════════════════════════════════════════

    // Base ambient — room is dark but not black
    scene.add(new THREE.AmbientLight(0x08101e, 3.5));
    scene.add(new THREE.HemisphereLight(0x0c1428, 0x040608, 2.0));

    // Overhead warm fill (simulates ceiling track light)
    const overheadLight = new THREE.PointLight(0xffd090, 5.5, 10, 1.8);
    overheadLight.position.set(0, 5.4, 0.6);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.set(512, 512);
    scene.add(overheadLight);

    // Soft fill from camera direction (makes foreground visible)
    const camFill = new THREE.PointLight(0x1a2848, 3.0, 16, 1.4);
    camFill.position.set(0, 2.8, 5.8);
    scene.add(camFill);

    // Rim light from back (cool blue)
    const rimLight = new THREE.PointLight(0x0e1ea0, 2.0, 10, 1.5);
    rimLight.position.set(0, 3.8, -3.8);
    scene.add(rimLight);

    // Per-monitor glow lights — these illuminate the desk/keyboard
    Object.entries(MONITOR_CONFIG).forEach(([id, cfg]) => {
      const col = new THREE.Color(SCREENS_DATA[id].hex);
      const ml  = new THREE.PointLight(col, 2.0, 5.0, 2.0);
      ml.position.set(cfg.pos[0], 1.38, 0.95);
      scene.add(ml);
      S.monLights[id] = ml;
    });

    // ══════════════════════════════════════════════════
    // FLOOR — reflective dark surface
    // ══════════════════════════════════════════════════
    const floorGeo = new THREE.PlaneGeometry(22, 22);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07080e, roughness: 0.18, metalness: 0.62,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(22, 36, 0x0f1526, 0x0f1526);
    grid.position.y = 0.003;
    scene.add(grid);

    // ══════════════════════════════════════════════════
    // WALLS
    // ══════════════════════════════════════════════════
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x060810, roughness: 1.0 });

    const addWall = (w, h, x, y, z, ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
      m.position.set(x, y, z); m.rotation.y = ry;
      m.receiveShadow = true; scene.add(m);
    };
    addWall(22, 10, 0,   5, -4.6, 0);
    addWall(16, 10, -5.6, 5, 2.4, Math.PI / 2);
    addWall(16, 10,  5.6, 5, 2.4, -Math.PI / 2);

    // Back wall LED strip (blue accent)
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x0c1030, emissive: new THREE.Color(0x1428c0), emissiveIntensity: 1.6,
    });
    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.06, 0.06), ledMat);
    ledStrip.position.set(0, 0.65, -4.5);
    scene.add(ledStrip);

    // Under-desk LED strip (purple glow on floor)
    const deskLedMat = new THREE.MeshStandardMaterial({
      color: 0x100820, emissive: new THREE.Color(0x5020c0), emissiveIntensity: 1.4,
    });
    const deskLed = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.04, 0.04), deskLedMat);
    deskLed.position.set(0, DESK_Y - 0.06, -0.35);
    scene.add(deskLed);

    // Under-desk LED light source (actual illumination on floor)
    const deskLedLight = new THREE.PointLight(0x5020c0, 1.2, 3.0, 2.0);
    deskLedLight.position.set(0, DESK_Y - 0.1, 0.0);
    scene.add(deskLedLight);

    // ══════════════════════════════════════════════════
    // DESK
    // ══════════════════════════════════════════════════
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x1c1408, roughness: 0.74, metalness: 0.05,
    });
    const deskLegMat = new THREE.MeshStandardMaterial({
      color: 0x181c24, roughness: 0.6, metalness: 0.55,
    });

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.072, 2.9), deskTopMat);
    deskTop.position.set(0, DESK_Y, 0.05);
    deskTop.castShadow = true; deskTop.receiveShadow = true;
    scene.add(deskTop);

    // L-frame legs
    [[-4.22, 0.55], [4.22, 0.55], [-4.22, -0.9], [4.22, -0.9]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, DESK_Y, 0.09), deskLegMat);
      leg.position.set(lx, DESK_Y / 2, lz);
      leg.castShadow = true; scene.add(leg);
    });
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(8.44, 0.05, 0.07), deskLegMat);
    crossbar.position.set(0, 0.26, -0.88);
    scene.add(crossbar);

    // ══════════════════════════════════════════════════
    // FOREGROUND KEYBOARD (key depth element)
    // ══════════════════════════════════════════════════
    const kbBodyMat = new THREE.MeshStandardMaterial({ color: 0x13172a, roughness: 0.82, metalness: 0.18 });
    const kbKeyMat  = new THREE.MeshStandardMaterial({ color: 0x1c2038, roughness: 0.88, metalness: 0.06 });
    const kbGlowMat = new THREE.MeshStandardMaterial({
      color: 0x1c2038, roughness: 0.88,
      emissive: new THREE.Color(0x4030b0), emissiveIntensity: 0.5,
    });
    const kbFnMat = new THREE.MeshStandardMaterial({
      color: 0x1c2038, roughness: 0.88,
      emissive: new THREE.Color(0x7C6FF7), emissiveIntensity: 0.3,
    });

    // Keyboard body
    const kbX = 0.08, kbZ = 0.95;
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.042, 0.60), kbBodyMat);
    kb.position.set(kbX, DESK_Y + 0.021 + 0.001, kbZ);
    kb.castShadow = true; scene.add(kb);

    // Key grid — 5 rows × 15 cols
    const ROWS = 5, COLS = 15;
    const KW = 0.094, KD = 0.092, KH = 0.022;
    const kStartX = kbX - (COLS * (KW + 0.011)) / 2 + KW / 2;
    const kStartZ = kbZ - (ROWS * (KD + 0.011)) / 2 + KD / 2;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === ROWS - 1 && c >= 5 && c <= 9) continue; // space bar area
        const isFn   = r === 0;
        const isWASD = (r === 2 && (c === 1 || c === 2 || c === 3)) || (r === 3 && c === 2);
        const mat    = isFn ? kbFnMat : isWASD ? kbGlowMat : kbKeyMat;
        const key    = new THREE.Mesh(new THREE.BoxGeometry(KW, KH, KD), mat);
        key.position.set(
          kStartX + c * (KW + 0.011),
          DESK_Y + 0.042 + KH / 2,
          kStartZ + r * (KD + 0.011),
        );
        scene.add(key);
      }
    }

    // Space bar
    const spaceBar = new THREE.Mesh(new THREE.BoxGeometry(0.56, KH, KD), kbKeyMat);
    spaceBar.position.set(kbX + 0.02, DESK_Y + 0.042 + KH / 2, kStartZ + (ROWS - 0.5) * (KD + 0.011));
    scene.add(spaceBar);

    // Wide keys (shift, backspace, enter)
    [
      [kStartX + 14 * (KW + 0.011) + 0.04, DESK_Y + 0.042 + KH / 2, kStartZ + 2 * (KD + 0.011), 0.17, KH, KD, kbGlowMat],
      [kStartX - 0.04,                       DESK_Y + 0.042 + KH / 2, kStartZ + 3 * (KD + 0.011), 0.17, KH, KD, kbKeyMat],
    ].forEach(([x, y, z, w, h, d, m]) => {
      const wideKey = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      wideKey.position.set(x, y, z);
      scene.add(wideKey);
    });

    // Keyboard backlight spill on desk surface
    const kbLight = new THREE.PointLight(0x5040c0, 0.6, 1.4, 2.0);
    kbLight.position.set(kbX, DESK_Y + 0.12, kbZ);
    scene.add(kbLight);

    // ══════════════════════════════════════════════════
    // FOREGROUND MOUSE + MOUSEPAD
    // ══════════════════════════════════════════════════
    const msMat  = new THREE.MeshStandardMaterial({ color: 0x13172a, roughness: 0.68, metalness: 0.32 });
    const msBtnMat = new THREE.MeshStandardMaterial({ color: 0x181c2e, roughness: 0.78, metalness: 0.15 });

    // Mousepad
    const padMat = new THREE.MeshStandardMaterial({ color: 0x080a10, roughness: 0.97 });
    const pad    = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.007, 0.46), padMat);
    pad.position.set(1.30, DESK_Y + 0.0035, 0.90);
    scene.add(pad);

    // Mouse body
    const msBody = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.064, 0.17, 9), msMat);
    msBody.rotation.x = Math.PI / 2;
    msBody.position.set(1.30, DESK_Y + 0.047, 0.89);
    msBody.scale.y = 0.68;
    msBody.castShadow = true; scene.add(msBody);

    // Mouse top button split
    const msBtnL = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.016, 0.08), msBtnMat);
    msBtnL.position.set(1.268, DESK_Y + 0.088, 0.855);
    scene.add(msBtnL);
    const msBtnR = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.016, 0.08), msBtnMat);
    msBtnR.position.set(1.332, DESK_Y + 0.088, 0.855);
    scene.add(msBtnR);

    // Scroll wheel
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.055, 7),
      new THREE.MeshStandardMaterial({ color: 0x2a3050, roughness: 0.55, metalness: 0.5 }),
    );
    wheel.position.set(1.30, DESK_Y + 0.093, 0.858);
    scene.add(wheel);

    // Mouse LED glow (RGB mouse aesthetic)
    const msLed = new THREE.PointLight(0x28C840, 0.15, 0.4);
    msLed.position.set(1.30, DESK_Y + 0.02, 0.93);
    scene.add(msLed);

    // ══════════════════════════════════════════════════
    // DESK ACCESSORIES — personality elements
    // ══════════════════════════════════════════════════

    // Coffee mug (left of desk)
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x181424, roughness: 0.75, metalness: 0.12 });
    const mug    = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.074, 0.19, 10), mugMat);
    mug.position.set(-3.65, DESK_Y + 0.095, 0.55);
    mug.castShadow = true; scene.add(mug);

    // Mug handle (torus arc)
    const hndl = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.013, 6, 9, Math.PI),
      mugMat,
    );
    hndl.rotation.y = Math.PI / 2;
    hndl.position.set(-3.536, DESK_Y + 0.095, 0.55);
    scene.add(hndl);

    // Coffee surface
    const coffeeFluid = new THREE.Mesh(
      new THREE.CircleGeometry(0.078, 10),
      new THREE.MeshStandardMaterial({ color: 0x190c04, roughness: 1.0 }),
    );
    coffeeFluid.rotation.x = -Math.PI / 2;
    coffeeFluid.position.set(-3.65, DESK_Y + 0.188, 0.55);
    scene.add(coffeeFluid);

    // Steam particles above mug
    const STEAM = 7;
    const sPos  = new Float32Array(STEAM * 3);
    for (let si = 0; si < STEAM; si++) {
      sPos[si * 3]     = -3.65 + (Math.random() - 0.5) * 0.08;
      sPos[si * 3 + 1] = DESK_Y + 0.22 + si * 0.07;
      sPos[si * 3 + 2] = 0.55 + (Math.random() - 0.5) * 0.04;
    }
    const steamGeo  = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const steamMat  = new THREE.PointsMaterial({ color: 0x708090, size: 0.028, transparent: true, opacity: 0.30, sizeAttenuation: true });
    const steamMesh = new THREE.Points(steamGeo, steamMat);
    scene.add(steamMesh);
    S.steamGeo = steamGeo; S.steamMesh = steamMesh;

    // Notebook (left, angled)
    const nbMat  = new THREE.MeshStandardMaterial({ color: 0x0c1018, roughness: 0.98 });
    const nb     = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.016, 0.60), nbMat);
    nb.position.set(-3.5, DESK_Y + 0.008, -0.15); nb.rotation.y = 0.22;
    scene.add(nb);
    const nbSpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.018, 0.60),
      new THREE.MeshStandardMaterial({ color: 0x7C6FF7, roughness: 0.9, emissive: new THREE.Color(0x7C6FF7), emissiveIntensity: 0.08 }),
    );
    nbSpine.position.set(-3.73, DESK_Y + 0.009, -0.15); nbSpine.rotation.y = 0.22;
    scene.add(nbSpine);

    // Pen on notebook
    const penMat = new THREE.MeshStandardMaterial({ color: 0x28C840, roughness: 0.6, metalness: 0.3, emissive: new THREE.Color(0x28C840), emissiveIntensity: 0.05 });
    const pen    = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.36, 6), penMat);
    pen.rotation.z = 0.1; pen.position.set(-3.46, DESK_Y + 0.025, 0.06);
    scene.add(pen);

    // Mini cactus (right side)
    const potMat  = new THREE.MeshStandardMaterial({ color: 0x2a1e14, roughness: 0.9 });
    const cactMat = new THREE.MeshStandardMaterial({ color: 0x1a3418, roughness: 0.88 });
    const pot     = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.105, 0.22, 8), potMat);
    pot.position.set(3.9, DESK_Y + 0.11, 0.38); scene.add(pot);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.122, 0.022, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 1.0 }));
    soil.position.set(3.9, DESK_Y + 0.221, 0.38); scene.add(soil);
    const cactus = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.30, 7), cactMat);
    cactus.position.set(3.9, DESK_Y + 0.37, 0.38); scene.add(cactus);
    [-1, 1].forEach((side) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.030, 0.15, 5), cactMat);
      arm.rotation.z = side * 0.75;
      arm.position.set(3.9 + side * 0.095, DESK_Y + 0.44, 0.38);
      scene.add(arm);
    });

    // USB hub / dock
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x101418, roughness: 0.6, metalness: 0.45 });
    const hub    = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.062, 0.13), hubMat);
    hub.position.set(2.8, DESK_Y + 0.031, 0.28); scene.add(hub);
    [0, 1, 2].forEach((hi) => {
      const lit  = hi === 0;
      const ind  = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.009, 0.014),
        new THREE.MeshStandardMaterial({
          color: lit ? 0x28C840 : 0x202830,
          emissive: lit ? new THREE.Color(0x28C840) : new THREE.Color(0),
          emissiveIntensity: lit ? 1.0 : 0,
        }));
      ind.position.set(2.68 + hi * 0.064, DESK_Y + 0.065, 0.28);
      scene.add(ind);
    });

    // Wireless earbuds case (small)
    const earCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.06, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.65, metalness: 0.4 }),
    );
    earCase.position.set(3.2, DESK_Y + 0.03, -0.28); earCase.rotation.y = 0.4;
    scene.add(earCase);

    // ══════════════════════════════════════════════════
    // SHELVES (RIGHT WALL)
    // ══════════════════════════════════════════════════
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x111008, roughness: 0.9, metalness: 0.12 });
    const bookPalette = [0x8B2252, 0x1f4fa0, 0x2a6b3a, 0x8c6b20, 0x5c2a8c, 0x7a2828];

    [{ y: 1.85, bookCount: 5 }, { y: 2.95, bookCount: 4 }].forEach(({ y, bookCount }, si) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.048, 0.30), shelfMat);
      shelf.position.set(5.1, y, -1.8); shelf.castShadow = true; scene.add(shelf);

      let bx = 4.44;
      for (let b = 0; b < bookCount; b++) {
        const bh = 0.22 + Math.random() * 0.12;
        const bw = 0.055 + Math.random() * 0.038;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(bw, bh, 0.24),
          new THREE.MeshStandardMaterial({ color: bookPalette[(si * 3 + b) % bookPalette.length], roughness: 0.92 }),
        );
        book.position.set(bx + bw / 2, y + bh / 2 + 0.024, -1.8);
        book.rotation.z = (Math.random() - 0.5) * 0.06;
        scene.add(book); bx += bw + 0.016;
      }
    });

    // Small vinyl figure on top shelf
    const figMat = new THREE.MeshStandardMaterial({ color: 0x28303e, roughness: 0.68, metalness: 0.35 });
    const figBody = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.13, 0.065), figMat);
    figBody.position.set(5.42, 2.95 + 0.024 + 0.065, -1.8); scene.add(figBody);
    const figHead = new THREE.Mesh(new THREE.SphereGeometry(0.044, 7, 7), figMat);
    figHead.position.set(5.42, 2.95 + 0.024 + 0.178, -1.8); scene.add(figHead);

    // ══════════════════════════════════════════════════
    // WALL POSTERS (back wall)
    // ══════════════════════════════════════════════════
    const buildPoster = (lines, bg, accent) => {
      const pc = document.createElement('canvas');
      pc.width = 256; pc.height = 320;
      const pctx = pc.getContext('2d');
      pctx.fillStyle = bg; pctx.fillRect(0, 0, 256, 320);
      // Border
      pctx.strokeStyle = accent + '44'; pctx.lineWidth = 2.5;
      pctx.strokeRect(4, 4, 248, 312);
      pctx.font = '15px "Courier New",monospace';
      lines.forEach((line, li) => {
        pctx.fillStyle = line.startsWith('//') || line.startsWith('#')
          ? '#3d5060'
          : line.includes('(') ? accent : '#e6edf3';
        pctx.fillText(line, 16, 36 + li * 24);
      });
      return new THREE.CanvasTexture(pc);
    };

    [
      {
        x: -2.6, y: 3.6,
        lines: ['// life.js', 'const you = {', "  role: 'builder',", "  mode: 'ship',", '};', '', 'you.build();', 'you.learn();', 'you.repeat();'],
        accent: '#7C6FF7',
      },
      {
        x: 2.6, y: 3.6,
        lines: ['# .bashrc', 'alias ship=', '  "git push"', '', '$ ship', '✓ deployed', '✓ live', '', '# never stop'],
        accent: '#28C840',
      },
    ].forEach(({ x, y, lines, accent }) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.76, 0.95),
        new THREE.MeshBasicMaterial({ map: buildPoster(lines, '#0d1117', accent) }),
      );
      mesh.position.set(x, y, -4.55);
      scene.add(mesh);
    });

    // ══════════════════════════════════════════════════
    // HEADPHONES (hanging on left monitor stand)
    // ══════════════════════════════════════════════════
    const hpMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.65, metalness: 0.45 });
    const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.022, 7, 14, Math.PI), hpMat);
    hpBand.position.set(-2.4, MON_Y - 0.82 - 0.44, MON_Z + 0.55);
    hpBand.rotation.x = -0.25; scene.add(hpBand);
    [-1, 1].forEach((side) => {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.055, 10),
        new THREE.MeshStandardMaterial({ color: 0x1a1f28, roughness: 0.7, metalness: 0.4 }),
      );
      cup.rotation.x = Math.PI / 2;
      cup.position.set(-2.4 + side * 0.235, MON_Y - 0.82 - 0.44 - 0.02, MON_Z + 0.55);
      scene.add(cup);
    });

    // ══════════════════════════════════════════════════
    // MONITORS
    // ══════════════════════════════════════════════════
    const bezelMat      = new THREE.MeshStandardMaterial({ color: 0x0e1218, roughness: 0.58, metalness: 0.42 });
    const innerBezelMat = new THREE.MeshStandardMaterial({ color: 0x080a0c, roughness: 1.0 });

    Object.entries(MONITOR_CONFIG).forEach(([id, cfg]) => {
      const sdata = SCREENS_DATA[id];
      const group = new THREE.Group();
      group.position.set(...cfg.pos);
      group.rotation.y = cfg.rotY;

      // Outer bezel
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.58, 1.62, 0.115), bezelMat);
      bezel.castShadow = true; group.add(bezel);

      // Inner bezel ring
      const ib = new THREE.Mesh(new THREE.BoxGeometry(2.34, 1.44, 0.058), innerBezelMat);
      ib.position.z = 0.031; group.add(ib);

      // ── SCREEN — MeshBasicMaterial means texture shows at full brightness
      //    regardless of scene lighting (this is correct for monitors)
      const { canvas, zones, canvasH } = buildScreenCanvas(id);
      const screenTex = new THREE.CanvasTexture(canvas);
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.22, 1.36),
        new THREE.MeshBasicMaterial({ map: screenTex }),
      );
      screenMesh.position.z = 0.064;
      screenMesh.userData   = { isScreen: true, screenId: id, zones, canvasH };
      group.add(screenMesh);
      S.clickTargets.push(screenMesh);

      // Very subtle edge glow (additive overlay)
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sdata.hex),
        transparent: true, opacity: 0.04,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.74, 1.84), glowMat);
      glow.position.z = 0.062; group.add(glow);

      // Monitor stand
      const standMat = new THREE.MeshStandardMaterial({ color: 0x0e1218, roughness: 0.52, metalness: 0.58 });
      const neck     = new THREE.Mesh(new THREE.BoxGeometry(0.112, 0.42, 0.112), standMat);
      neck.position.set(0, -0.81 - 0.21, 0); group.add(neck);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.052, 0.40), standMat);
      base.position.set(0, -0.81 - 0.42 - 0.026, 0); group.add(base);

      // Post-it notes (top of monitor — personality)
      const postItColors = [0xffdd44, 0xff8878, 0x66ccff, 0xaaffaa];
      const postItCount  = id === 'dev' ? 2 : id === 'research' ? 3 : 1;
      for (let pi = 0; pi < postItCount; pi++) {
        const piMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.19, 0.19),
          new THREE.MeshBasicMaterial({ color: postItColors[pi % postItColors.length], side: THREE.DoubleSide }),
        );
        piMesh.position.set(-0.4 + pi * 0.44, 1.62 / 2 + 0.095, 0.06);
        piMesh.rotation.z = (Math.random() - 0.5) * 0.35;
        group.add(piMesh);
      }

      // Cable running from monitor down to desk
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 0.95 });
      const cable    = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.75, 5), cableMat);
      cable.position.set(0.3, -0.81 - 0.58, 0.04);
      cable.rotation.z = 0.12; group.add(cable);

      scene.add(group);
      S.screens[id] = { group, screenMesh, glowMat, zones };
    });

    // ══════════════════════════════════════════════════
    // FLOATING DUST PARTICLES
    // ══════════════════════════════════════════════════
    const DC   = 220;
    const dPos = new Float32Array(DC * 3);
    const dSpd = new Float32Array(DC);
    for (let i = 0; i < DC; i++) {
      dPos[i * 3]     = (Math.random() - 0.5) * 18;
      dPos[i * 3 + 1] = Math.random() * 7;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
      dSpd[i]         = 0.003 + Math.random() * 0.009;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x1e2840, size: 0.030, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(dustGeo, dustMat));
    S.dustGeo = dustGeo; S.dustSpeeds = dSpd;

    // ══════════════════════════════════════════════════
    // EVENT LISTENERS
    // ══════════════════════════════════════════════════
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      S.mouseNDC.set(
        ((e.clientX - rect.left) / rect.width)  *  2 - 1,
        ((e.clientY - rect.top)  / rect.height) * -2 + 1,
      );
      S.raycaster.setFromCamera(S.mouseNDC, camera);
      const hits = S.raycaster.intersectObjects(S.clickTargets);
      const prev = S.hovered;
      S.hovered  = hits.length ? hits[0].object.userData.screenId : null;
      if (S.hovered !== prev) mount.style.cursor = S.hovered ? 'pointer' : 'default';
    };

    const onClick = () => {
      S.raycaster.setFromCamera(S.mouseNDC, camera);
      const hits = S.raycaster.intersectObjects(S.clickTargets);
      if (!hits.length) return;

      const hit = hits[0];
      const sid = hit.object.userData.screenId;

      if (S.activeId === sid) {
        // Already zoomed — detect project row via UV
        const uv = hit.uv;
        if (uv) {
          const cH      = hit.object.userData.canvasH ?? 620;
          const canvasY = (1 - uv.y) * cH;
          hit.object.userData.zones.forEach((zone, zi) => {
            if (canvasY >= zone.yMin && canvasY <= zone.yMax) {
              const proj = SCREENS_DATA[sid].projects[zi];
              if (proj) onOpenProject({ ...proj, category: sid, color: SCREENS_DATA[sid].color });
            }
          });
        }
      } else {
        // Navigate directly to this screen (no overview pass-through)
        S.activeId = sid;
        const cfg  = MONITOR_CONFIG[sid];
        S.targetPos .set(...cfg.camPos);
        S.targetLook.set(...cfg.camLook);
        onScreenClick(sid);
      }
    };

    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('click',     onClick);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ══════════════════════════════════════════════════
    // RENDER LOOP
    // ══════════════════════════════════════════════════
    const tick = () => {
      if (S.disposed) return;
      S.raf = requestAnimationFrame(tick);
      const t = S.clock.getElapsedTime();

      // Dust drift
      const dp = S.dustGeo.attributes.position.array;
      for (let i = 0; i < DC; i++) {
        dp[i * 3 + 1] += S.dustSpeeds[i];
        dp[i * 3]     += Math.sin(t * 0.28 + i * 1.1) * 0.0003;
        if (dp[i * 3 + 1] > 7) dp[i * 3 + 1] = 0;
      }
      S.dustGeo.attributes.position.needsUpdate = true;

      // Steam animation
      if (S.steamGeo) {
        const sp = S.steamGeo.attributes.position.array;
        for (let si = 0; si < STEAM; si++) {
          sp[si * 3 + 1] += 0.0055;
          sp[si * 3]      = -3.65 + Math.sin(t * 1.1 + si * 0.9) * 0.045;
          if (sp[si * 3 + 1] > DESK_Y + 0.82) {
            sp[si * 3 + 1] = DESK_Y + 0.22;
            sp[si * 3]     = -3.65 + (Math.random() - 0.5) * 0.06;
          }
        }
        S.steamGeo.attributes.position.needsUpdate = true;
        // Fade based on height
        const progress = (sp[1] - (DESK_Y + 0.22)) / 0.60;
        S.steamMesh.material.opacity = 0.30 * Math.max(0, 1 - progress);
      }

      // Parallax on overview only
      if (!S.activeId) {
        const mx = S.mouseNDC.x * 0.26;
        const my = S.mouseNDC.y * 0.13;
        S.targetPos .set(OVERVIEW.pos[0] + mx, OVERVIEW.pos[1] + my, OVERVIEW.pos[2]);
        S.targetLook.set(mx * 0.28, OVERVIEW.look[1], 0);
      }

      // Smooth camera
      camera.position.lerp(S.targetPos,  0.052);
      S.currentLook.lerp(S.targetLook,   0.052);
      camera.lookAt(S.currentLook);

      // Per-screen glow animation
      const screenKeys = Object.keys(S.screens);
      screenKeys.forEach((id, idx) => {
        const m        = S.screens[id];
        const isActive = S.activeId === id;
        const isHover  = S.hovered === id;
        const baseO    = isActive ? 0.14 : isHover ? 0.09 : 0.04;
        const pulse    = Math.sin(t * 1.9 + idx * 1.4) * 0.016;
        m.glowMat.opacity          = Math.max(0, baseO + pulse);
        S.monLights[id].intensity  = isActive ? 3.2 : isHover ? 2.2 : 1.8;
      });

      // Lamp flicker
      overheadLight.intensity = 5.5 + Math.sin(t * 0.38) * 0.14;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      S.disposed = true;
      cancelAnimationFrame(S.raf);
      window.removeEventListener('resize',     onResize);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('click',     onClick);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line

  // ── Sync camera target when activeScreen prop changes ───────────────────────
  useEffect(() => {
    const S = refs.current;
    if (!S.targetPos) return;

    if (!activeScreen) {
      S.activeId = null;
      S.targetPos .set(...OVERVIEW.pos);
      S.targetLook.set(...OVERVIEW.look);
    } else {
      S.activeId = activeScreen;
      const cfg  = MONITOR_CONFIG[activeScreen];
      if (cfg) {
        S.targetPos .set(...cfg.camPos);
        S.targetLook.set(...cfg.camLook);
      }
    }
  }, [activeScreen]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
