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
const MUG_X = -3.62, MUG_Z = 0.55;

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

// ─── Neon helper for sign strokes ────────────────────────────────────────────
function neonStroke(ctx, color, outerBlur, innerBlur, lineW, alpha = 1) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = outerBlur;
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineW;
  ctx.stroke();
  ctx.shadowBlur = innerBlur;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = lineW * 0.28;
  ctx.stroke();
  ctx.restore();
}

// ─── Red devil neon logo canvas ──────────────────────────────────────────────
function buildMUNeonCanvas() {
  const W = 520, H = 760;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const cx = W / 2;
  const neonFill = (fillColor, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = '#ff2020';
    ctx.shadowBlur = 34;
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();
  };

  const neonOutline = (lineW = 8) => {
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 22;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = lineW;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.shadowBlur = 8;
    ctx.lineWidth = lineW * 0.45;
    ctx.stroke();
    ctx.restore();
  };

  // Transparent canvas so only the logo itself shows up on the back wall.
  ctx.clearRect(0, 0, W, H);
  ctx.translate(20, 70);

  // Tail / back curve
  ctx.beginPath();
  ctx.moveTo(126, 358);
  ctx.bezierCurveTo(98, 348, 74, 330, 70, 306);
  ctx.bezierCurveTo(66, 282, 80, 264, 94, 258);
  ctx.bezierCurveTo(106, 252, 110, 260, 102, 268);
  ctx.lineTo(86, 260); ctx.lineTo(96, 246); ctx.lineTo(110, 256);
  ctx.bezierCurveTo(124, 262, 122, 282, 116, 298);
  ctx.bezierCurveTo(110, 316, 106, 336, 120, 348);
  ctx.closePath();
  neonFill('#a40000', 0.92); neonOutline(8);

  // Left arm
  ctx.beginPath();
  ctx.moveTo(148, 270); ctx.lineTo(128, 282);
  ctx.lineTo(94, 264); ctx.lineTo(64, 242);
  ctx.lineTo(40, 212); ctx.lineTo(28, 190);
  ctx.lineTo(20, 164); ctx.lineTo(33, 172);
  ctx.lineTo(26, 153); ctx.lineTo(42, 166);
  ctx.lineTo(40, 151); ctx.lineTo(54, 170);
  ctx.lineTo(60, 190); ctx.lineTo(82, 215);
  ctx.lineTo(108, 238); ctx.lineTo(136, 258);
  ctx.lineTo(150, 272);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(8);

  // Main torso and head block
  ctx.beginPath();
  ctx.moveTo(118, 178);
  ctx.lineTo(102, 115); ctx.lineTo(132, 158);
  ctx.lineTo(155, 86);  ctx.lineTo(178, 160);
  ctx.lineTo(196, 115); ctx.lineTo(210, 175);
  ctx.quadraticCurveTo(226, 186, 224, 216);
  ctx.lineTo(218, 242); ctx.lineTo(204, 252);
  ctx.lineTo(210, 258); ctx.lineTo(224, 272);
  ctx.lineTo(230, 312); ctx.lineTo(234, 358);
  ctx.lineTo(218, 372); ctx.lineTo(192, 382);
  ctx.lineTo(174, 382); ctx.lineTo(144, 372);
  ctx.lineTo(126, 358); ctx.lineTo(128, 312);
  ctx.lineTo(136, 258); ctx.lineTo(148, 240);
  ctx.quadraticCurveTo(140, 212, 118, 178);
  ctx.closePath();
  neonFill('#b00000', 0.98); neonOutline(9);

  // Legs
  ctx.beginPath();
  ctx.moveTo(174, 382); ctx.lineTo(154, 388);
  ctx.lineTo(136, 424); ctx.lineTo(126, 460);
  ctx.lineTo(130, 494); ctx.lineTo(122, 514);
  ctx.lineTo(84, 518);  ctx.lineTo(78, 508);
  ctx.lineTo(116, 504); ctx.lineTo(124, 490);
  ctx.lineTo(150, 462); ctx.lineTo(160, 426);
  ctx.lineTo(178, 392);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(8);

  ctx.beginPath();
  ctx.moveTo(192, 382); ctx.lineTo(218, 372);
  ctx.lineTo(230, 388); ctx.lineTo(248, 420);
  ctx.lineTo(260, 450); ctx.lineTo(250, 478);
  ctx.lineTo(236, 494); ctx.lineTo(270, 492);
  ctx.lineTo(284, 482); ctx.lineTo(274, 466);
  ctx.lineTo(266, 450); ctx.lineTo(280, 420);
  ctx.lineTo(266, 390); ctx.lineTo(248, 378);
  ctx.lineTo(224, 368);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(8);

  // Right arm holding trident
  ctx.beginPath();
  ctx.moveTo(212, 260); ctx.lineTo(230, 270);
  ctx.lineTo(252, 294); ctx.lineTo(262, 322);
  ctx.lineTo(256, 344); ctx.lineTo(246, 358);
  ctx.lineTo(242, 365); ctx.lineTo(254, 368);
  ctx.lineTo(260, 355); ctx.lineTo(270, 344);
  ctx.lineTo(278, 326); ctx.lineTo(272, 300);
  ctx.lineTo(252, 274); ctx.lineTo(234, 260);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(8);

  // Trident shaft and head
  ctx.beginPath(); ctx.rect(255, 354, 12, 166);
  neonFill('#a40000', 0.95); neonOutline(8);

  ctx.beginPath();
  ctx.moveTo(226, 232); ctx.lineTo(238, 296); ctx.lineTo(250, 296); ctx.lineTo(244, 232);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(7);

  ctx.beginPath();
  ctx.moveTo(261, 186); ctx.lineTo(271, 288); ctx.lineTo(251, 288);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(7);

  ctx.beginPath();
  ctx.moveTo(296, 232); ctx.lineTo(278, 232); ctx.lineTo(272, 296); ctx.lineTo(284, 296);
  ctx.closePath();
  neonFill('#a40000', 0.95); neonOutline(7);

  // Eye cutouts
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(151, 196); ctx.lineTo(164, 187); ctx.lineTo(167, 208); ctx.lineTo(154, 210); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(193, 188); ctx.lineTo(206, 196); ctx.lineTo(203, 210); ctx.lineTo(190, 208); ctx.closePath(); ctx.fill();
  ctx.restore();

  // Mouth / beard cutout highlight
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(176, 226); ctx.lineTo(189, 226); ctx.lineTo(182, 245);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  return cv;
}

// ─── Sprite texture for denser mug mist ──────────────────────────────────────
function buildSteamTexture() {
  const S = 64;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const ctx = cv.getContext('2d');
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, 'rgba(230,230,240,1)');
  grad.addColorStop(0.35, 'rgba(200,210,225,0.55)');
  grad.addColorStop(0.7, 'rgba(180,195,215,0.18)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(cv);
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
    renderer.toneMappingExposure   = 2.6;
    renderer.outputColorSpace      = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x0b0a14, 0.026);
    scene.background = new THREE.Color(0x0b0a14);

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
      monLights: {},
      steamPuffs: [],
      muSign: null,
      dustGeo: null, dustSpeeds: null,
      mouseRgbLight: null,
      kbLight: null,
      disposed: false, raf: null,
    };
    refs.current = S;

    // ══════════════════════════════════════════════════
    // LIGHTING — rebuilt for visibility
    // ══════════════════════════════════════════════════

    // Base ambient — room is dark but not black
    scene.add(new THREE.AmbientLight(0x1a1828, 4.5));
    scene.add(new THREE.HemisphereLight(0x182040, 0x080610, 2.8));

    // Overhead warm fill (simulates ceiling track light)
    const overheadLight = new THREE.PointLight(0xffd090, 8.0, 12, 1.6);
    overheadLight.position.set(0, 5.6, 0.5);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.set(512, 512);
    scene.add(overheadLight);

    // Soft fill from camera direction (makes foreground visible)
    const ceilL2 = new THREE.PointLight(0xffe0b0, 3.5, 8, 1.8);
    ceilL2.position.set(-1.5, 4.8, -1.2);
    scene.add(ceilL2);

    const camFill = new THREE.PointLight(0x1e2c50, 4.5, 18, 1.2);
    camFill.position.set(0, 3.2, 6.0);
    scene.add(camFill);

    // Rim light from back (cool blue)
    const rimLight = new THREE.PointLight(0x0a1ad0, 2.8, 12, 1.4);
    rimLight.position.set(0, 3.5, -3.6);
    scene.add(rimLight);

    const muGlow = new THREE.PointLight(0xff1010, 2.1, 6.5, 1.9);
    muGlow.position.set(0, 3.35, -4.1);
    scene.add(muGlow);

    // Per-monitor glow lights — these illuminate the desk/keyboard
    Object.entries(MONITOR_CONFIG).forEach(([id, cfg]) => {
      const col = new THREE.Color(SCREENS_DATA[id].hex);
      const ml  = new THREE.PointLight(col, 2.2, 5.5, 2.0);
      ml.position.set(cfg.pos[0], 1.42, 1.0);
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
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x080a12, roughness: 1.0 });

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
    ledStrip.position.set(0, 0.62, -4.52);
    scene.add(ledStrip);

    // Under-desk LED strip (purple glow on floor)
    const deskLedMat = new THREE.MeshStandardMaterial({
      color: 0x100820, emissive: new THREE.Color(0x5020c0), emissiveIntensity: 1.6,
    });
    const deskLed = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.04, 0.04), deskLedMat);
    deskLed.position.set(0, DESK_Y - 0.06, -0.35);
    scene.add(deskLed);

    // Under-desk LED light source (actual illumination on floor)
    const deskLedLight = new THREE.PointLight(0x5020c0, 1.6, 3.5, 2.0);
    deskLedLight.position.set(0, DESK_Y - 0.08, 0.0);
    scene.add(deskLedLight);

    // Use the real reference image so the back-wall sign matches the desired look.
    const muTex = new THREE.TextureLoader().load('/785d1f69766098745a997a84fd58212f.jpg');
    muTex.colorSpace = THREE.SRGBColorSpace;
    const muMat = new THREE.MeshBasicMaterial({
      map: muTex,
      transparent: false,
      opacity: 1.0,
      depthWrite: false,
    });
    const muMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.9), muMat);
    muMesh.position.set(0, 3.15, -4.52);
    muMesh.renderOrder = 5;
    scene.add(muMesh);
    S.muSign = { mesh: muMesh, mat: muMat };

    const signFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.34, 4.04, 0.03),
      new THREE.MeshStandardMaterial({
        color: 0x0a0a0c,
        roughness: 0.92,
        metalness: 0.12,
        transparent: true,
        opacity: 0.12,
      }),
    );
    signFrame.position.set(0, 3.15, -4.57);
    scene.add(signFrame);

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
    const kbLight = new THREE.PointLight(0x7C6FF7, 0.7, 1.2, 2.0);
    kbLight.position.set(kbX, DESK_Y + 0.12, kbZ);
    scene.add(kbLight);
    S.kbLight = kbLight;

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
    const msLed = new THREE.PointLight(0xff1020, 0.18, 0.55, 2.0);
    msLed.position.set(1.30, DESK_Y + 0.005, 0.93);
    scene.add(msLed);
    S.mouseRgbLight = msLed;

    // ══════════════════════════════════════════════════
    // DESK ACCESSORIES — personality elements
    // ══════════════════════════════════════════════════

    // Coffee mug and denser mist volume.
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x200c1c, roughness: 0.72, metalness: 0.14 });
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.074, 0.19, 12), mugMat);
    mug.position.set(MUG_X, DESK_Y + 0.095, MUG_Z);
    mug.castShadow = true; scene.add(mug);

    // Mug handle (torus arc)
    const hndl = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.013, 6, 9, Math.PI),
      mugMat,
    );
    hndl.rotation.y = Math.PI / 2;
    hndl.position.set(MUG_X + 0.066, DESK_Y + 0.095, MUG_Z);
    scene.add(hndl);

    // Coffee surface
    const coffeeFluid = new THREE.Mesh(
      new THREE.CircleGeometry(0.078, 10),
      new THREE.MeshStandardMaterial({ color: 0x190c04, roughness: 1.0 }),
    );
    coffeeFluid.rotation.x = -Math.PI / 2;
    coffeeFluid.position.set(MUG_X, DESK_Y + 0.189, MUG_Z);
    scene.add(coffeeFluid);

    const coffeeGlow = new THREE.PointLight(0xff9050, 0.32, 0.95, 2.0);
    coffeeGlow.position.set(MUG_X, DESK_Y + 0.22, MUG_Z);
    scene.add(coffeeGlow);

    const steamTex = buildSteamTexture();
    const STEAM_PUFF_COUNT = 18;
    const spawnSteamPuff = () => {
      const mat = new THREE.SpriteMaterial({
        map: steamTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color(0.88, 0.90, 0.95),
      });
      const sprite = new THREE.Sprite(mat);
      const scale = 0.04 + Math.random() * 0.05;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        MUG_X + (Math.random() - 0.5) * 0.07,
        DESK_Y + 0.20,
        MUG_Z + (Math.random() - 0.5) * 0.04,
      );
      scene.add(sprite);
      const puff = {
        sprite,
        mat,
        life: 0,
        maxLife: 1.8 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.012,
        vz: (Math.random() - 0.5) * 0.008,
        baseScale: scale,
        wobblePhase: Math.random() * Math.PI * 2,
      };
      S.steamPuffs.push(puff);
      return puff;
    };
    for (let i = 0; i < STEAM_PUFF_COUNT; i++) {
      const p = spawnSteamPuff();
      p.life = Math.random() * p.maxLife;
    }

    // Diary (open pages) for a lived-in but controlled desk feel.
    const diaryCanvas = (() => {
      const dc = document.createElement('canvas');
      dc.width = 256; dc.height = 384;
      const dctx = dc.getContext('2d');
      dctx.fillStyle = '#f5ead8'; dctx.fillRect(0, 0, 128, 384);
      dctx.fillStyle = '#f0e4ce'; dctx.fillRect(128, 0, 128, 384);
      dctx.fillStyle = 'rgba(0,0,0,0.25)'; dctx.fillRect(120, 0, 16, 384);
      dctx.strokeStyle = '#c8bfa8'; dctx.lineWidth = 0.8;
      for (let ly = 32; ly < 370; ly += 22) {
        dctx.beginPath(); dctx.moveTo(136, ly); dctx.lineTo(248, ly); dctx.stroke();
      }
      dctx.strokeStyle = '#1a2040'; dctx.lineWidth = 1.1;
      [[54, 210], [76, 228], [98, 195], [120, 220], [142, 200], [164, 185]].forEach(([y, x2]) => {
        dctx.beginPath(); dctx.moveTo(136, y); dctx.lineTo(x2, y); dctx.stroke();
      });
      dctx.strokeStyle = '#6050a0'; dctx.lineWidth = 1.3;
      [60, 96, 132, 168].forEach((cy, ci) => {
        dctx.strokeRect(18, cy - 12, 14, 14);
        if (ci < 2) {
          dctx.beginPath();
          dctx.moveTo(20, cy - 3); dctx.lineTo(24, cy + 2); dctx.lineTo(30, cy - 8);
          dctx.stroke();
        }
        dctx.strokeStyle = '#8070a8'; dctx.lineWidth = 0.9;
        dctx.beginPath(); dctx.moveTo(40, cy - 2); dctx.lineTo(100, cy - 2); dctx.stroke();
        dctx.strokeStyle = '#6050a0'; dctx.lineWidth = 1.3;
      });
      dctx.fillStyle = '#ffdd44'; dctx.fillRect(200, 6, 48, 44);
      dctx.strokeStyle = '#e0c020'; dctx.lineWidth = 0.5; dctx.strokeRect(200, 6, 48, 44);
      dctx.fillStyle = '#333'; dctx.font = '8px Arial'; dctx.fillText('TODO:', 204, 20); dctx.fillText('ship!', 204, 34);
      return new THREE.CanvasTexture(dc);
    })();
    const diaryTop = new THREE.Mesh(
      new THREE.PlaneGeometry(0.60, 0.90),
      new THREE.MeshBasicMaterial({ map: diaryCanvas }),
    );
    diaryTop.rotation.x = -Math.PI / 2;
    diaryTop.position.set(-3.55, DESK_Y + 0.017, -0.12);
    diaryTop.rotation.z = 0.22;
    scene.add(diaryTop);
    const diaryBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 0.022, 0.90),
      new THREE.MeshStandardMaterial({ color: 0x1a1030, roughness: 0.88 }),
    );
    diaryBody.position.set(-3.55, DESK_Y + 0.009, -0.12);
    diaryBody.rotation.y = 0.22;
    scene.add(diaryBody);

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
    // HEADPHONES (on a desk stand near left monitor)
    // ══════════════════════════════════════════════════
    const hpMat = new THREE.MeshStandardMaterial({ color: 0x0e1018, roughness: 0.62, metalness: 0.52 });
    const hpCushMat = new THREE.MeshStandardMaterial({ color: 0x1a1420, roughness: 0.92, metalness: 0.04 });
    const hpPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.48, 8), hpMat);
    hpPole.position.set(-3.0, DESK_Y + 0.24, -0.28);
    scene.add(hpPole);
    const hpBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.016, 10), hpMat);
    hpBase.position.set(-3.0, DESK_Y + 0.008, -0.28);
    scene.add(hpBase);
    const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.019, 7, 14, Math.PI), hpMat);
    hpBand.position.set(-3.0, DESK_Y + 0.48, -0.28);
    hpBand.rotation.x = -0.18;
    scene.add(hpBand);
    [-1, 1].forEach((side) => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.052, 10), hpMat);
      cup.rotation.x = Math.PI / 2;
      cup.position.set(-3.0 + side * 0.215, DESK_Y + 0.44, -0.28);
      scene.add(cup);
      const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.024, 7, 12), hpCushMat);
      cushion.rotation.x = Math.PI / 2;
      cushion.position.set(-3.0 + side * 0.218, DESK_Y + 0.44, -0.28);
      scene.add(cushion);
    });
    const hpCable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.4, 5),
      new THREE.MeshStandardMaterial({ color: 0x1a1020, roughness: 0.95 }),
    );
    hpCable.position.set(-3.0, DESK_Y + 0.20, -0.24);
    hpCable.rotation.z = 0.08;
    scene.add(hpCable);

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
    const DC   = 240;
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
    const dustMat = new THREE.PointsMaterial({ color: 0x2a3050, size: 0.028, transparent: true, opacity: 0.55 });
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
    let steamSpawnTimer = 0;
    let muFlickerTimer = 0;
    let nextFlickerAt = 4 + Math.random() * 6;

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

      // Volumetric steam with constant respawn.
      steamSpawnTimer += 0.016;
      if (steamSpawnTimer > 0.22) {
        steamSpawnTimer = 0;
        if (S.steamPuffs.length < 22) {
          spawnSteamPuff();
        }
      }

      for (let i = S.steamPuffs.length - 1; i >= 0; i--) {
        const p = S.steamPuffs[i];
        p.life += 0.016;
        const progress = p.life / p.maxLife;
        const rawOpacity = progress < 0.3 ? (progress / 0.3) * 0.38 : (1 - (progress - 0.3) / 0.7) * 0.38;
        p.mat.opacity = Math.max(0, rawOpacity);
        const s = p.baseScale * (1 + progress * 2.4);
        p.sprite.scale.set(s, s, 1);
        p.sprite.position.y += 0.0045;
        p.sprite.position.x += p.vx + Math.sin(t * 1.4 + p.wobblePhase) * 0.0006;
        p.sprite.position.z += p.vz;
        if (p.life >= p.maxLife) {
          scene.remove(p.sprite);
          p.mat.dispose();
          S.steamPuffs.splice(i, 1);
          spawnSteamPuff();
        }
      }

      // Neon sign sporadic flicker + continuous breathing.
      muFlickerTimer += 0.016;
      if (muFlickerTimer >= nextFlickerAt) {
        muFlickerTimer = 0;
        nextFlickerAt = 4 + Math.random() * 8;
        const doFlicker = async () => {
          if (!S.muSign || S.disposed) return;
          S.muSign.mat.opacity = 0.1;
          muGlow.intensity = 0.08;
          await new Promise((r) => setTimeout(r, 60));
          if (!S.muSign || S.disposed) return;
          S.muSign.mat.opacity = 1.0;
          muGlow.intensity = 1.2;
          await new Promise((r) => setTimeout(r, 40));
          if (!S.muSign || S.disposed) return;
          S.muSign.mat.opacity = 0.06;
          muGlow.intensity = 0.04;
          await new Promise((r) => setTimeout(r, 80));
          if (!S.muSign || S.disposed) return;
          S.muSign.mat.opacity = 1.0;
          muGlow.intensity = 1.2 + Math.sin(t) * 0.1;
        };
        doFlicker();
      }
      if (S.muSign && S.muSign.mat.opacity > 0.5) {
        muGlow.intensity = 1.2 * (1.0 + Math.sin(t * 0.7) * 0.04);
      }

      if (S.mouseRgbLight) {
        const hue = (t * 0.4) % 1;
        S.mouseRgbLight.color.setHSL(hue, 1, 0.5);
        S.mouseRgbLight.intensity = 0.15 + Math.sin(t * 2.2) * 0.05;
      }
      if (S.kbLight) {
        S.kbLight.intensity = 0.7 + Math.sin(t * 1.8) * 0.2;
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
      overheadLight.intensity = 8.0 + Math.sin(t * 0.42) * 0.2;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      S.disposed = true;
      cancelAnimationFrame(S.raf);
      S.steamPuffs.forEach((p) => {
        scene.remove(p.sprite);
        p.mat.dispose();
      });
      S.steamPuffs.length = 0;
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
