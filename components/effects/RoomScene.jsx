'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo, Suspense, useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { PROJECTS } from '@/lib/data';

// ── Camera destinations ───────────────────────────────────────────────────────
// Positions face each screen normal head-on so Html content appears flat.
// Left/right normals: [sin(±0.22), 0, cos(0.22)] ≈ [±0.218, 0, 0.976]
// Zoom distance ≈ 2.5 → used as distanceFactor for Html sizing.
const CAM = {
  overview: { pos: [0, 2.0, 8.5],       look: [0, 0.8, 0] },
  dev:      { pos: [-1.35, 0.74, 2.32], look: [-1.9, 0.74, -0.12] },
  research: { pos: [0, 0.84, 2.0],       look: [0, 0.84, -0.28] },
  aiml:     { pos: [1.35, 0.74, 2.32],  look: [1.9, 0.74, -0.12] },
};

// ── Canvas texture drawing ────────────────────────────────────────────────────
// Each screen shows a distinct iconic preview as a WebGL texture (no CSS3D).
// This avoids ALL Html z-fighting issues in the overview mode.

function drawDevPreview(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, w, h);

  // Title bar
  ctx.fillStyle = '#161b22'; ctx.fillRect(0, 0, w, h * 0.1);
  [['#FF5F57', 0.05], ['#FEBC2E', 0.13], ['#FEBC2E', 0.13], ['#28C840', 0.21]].slice(0,3).forEach(([c, xr]) => {
    ctx.fillStyle = c; ctx.beginPath();
    ctx.arc(w * xr, h * 0.05, w * 0.024, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.045)}px monospace`;
  ctx.textAlign = 'center'; ctx.fillText('arfl_platform — VSCode', w * 0.55, h * 0.068); ctx.textAlign = 'left';

  // Tab bar
  ctx.fillStyle = '#161b22'; ctx.fillRect(0, h * 0.1, w, h * 0.07);
  ctx.fillStyle = '#0d1117'; ctx.fillRect(0, h * 0.1, w * 0.28, h * 0.07);
  ctx.fillStyle = '#7C6FF7'; ctx.fillRect(0, h * 0.17, w * 0.28, 2);
  ctx.fillStyle = '#e6edf3'; ctx.font = `${Math.round(h * 0.043)}px monospace`;
  ctx.fillText('arfl_client.py', w * 0.01, h * 0.148);
  ctx.fillStyle = '#7d8590'; ctx.fillText('byzantine.py', w * 0.3, h * 0.148);

  // Sidebar strip
  ctx.fillStyle = '#161b22'; ctx.fillRect(0, h * 0.17, w * 0.2, h * 0.73);
  ctx.fillStyle = '#21262d'; ctx.fillRect(w * 0.2, h * 0.17, 1, h * 0.73);
  const sideItems = ['▶ src', '  ▼ models', '    arfl_client', '    byzantine', '  ▶ training', '▶ tests'];
  sideItems.forEach((label, i) => {
    ctx.fillStyle = i === 2 ? '#7C6FF7' : '#7d8590';
    if (i === 2) { ctx.fillStyle = '#7C6FF7' + '22'; ctx.fillRect(0, h*(0.19 + i*0.08)-2, w*0.2, h*0.075); }
    ctx.fillStyle = i === 2 ? '#7C6FF7' : '#7d8590';
    ctx.font = `${Math.round(h * 0.038)}px monospace`;
    ctx.fillText(label, w * 0.01, h * (0.22 + i * 0.08));
  });

  // Code area — syntax-highlighted bars
  const codeLines = [
    ['#ff7b72', 0.22, 0.18], ['#e6edf3', 0.22, 0.55],
    ['#e6edf3', 0.22, 0.02], // blank
    ['#ff7b72', 0.22, 0.10], ['#7C6FF7', 0.25, 0.35], ['#e6edf3', 0.25, 0.55],
    ['#79c0ff', 0.27, 0.22], ['#8b949e', 0.27, 0.40],
    ['#e6edf3', 0.27, 0.45], ['#ff7b72', 0.27, 0.14], ['#e6edf3', 0.27, 0.38],
  ];
  const lStart = h * 0.19, lStep = (h * 0.71) / codeLines.length;
  codeLines.forEach(([color, xr, wr], i) => {
    if (wr < 0.04) return;
    ctx.fillStyle = color;
    ctx.fillRect(w * xr, lStart + i * lStep + lStep * 0.12, w * wr, lStep * 0.52);
  });

  // Status bar
  ctx.fillStyle = '#7C6FF7'; ctx.fillRect(0, h * 0.9, w, h * 0.1);
  ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.round(h * 0.044)}px monospace`;
  ctx.fillText('● ARFL Platform', w * 0.03, h * 0.963);
  ctx.textAlign = 'right'; ctx.fillStyle = '#ffffffCC';
  ctx.font = `${Math.round(h * 0.038)}px monospace`;
  ctx.fillText('Python · PyTorch', w * 0.97, h * 0.963); ctx.textAlign = 'left';
}

function drawResearchPreview(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const C = '#E8935A';

  ctx.fillStyle = '#0A0804'; ctx.fillRect(0, 0, w, h);

  // Title bar
  ctx.fillStyle = C + '12'; ctx.fillRect(0, 0, w, h * 0.1);
  ctx.strokeStyle = C + '25'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, w, h * 0.1);
  [['#FF5F57', 0.05], ['#FEBC2E', 0.13], ['#28C840', 0.21]].forEach(([c, xr]) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(w * xr, h * 0.05, w * 0.024, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = C; ctx.font = `${Math.round(h * 0.042)}px monospace`;
  ctx.textAlign = 'center'; ctx.fillText('MULTI-HAZARD EWS · IIT BOMBAY', w * 0.6, h * 0.066); ctx.textAlign = 'left';
  ctx.fillStyle = '#56d364'; ctx.font = `bold ${Math.round(h * 0.038)}px monospace`;
  ctx.fillText('● LIVE', w * 0.86, h * 0.066);

  // Stats row
  ctx.fillStyle = '#0d0a07'; ctx.fillRect(0, h * 0.1, w, h * 0.12);
  [
    ['SENSORS', '12', '#56d364', 0.14],
    ['ALERTS', '2', C, 0.45],
    ['UPTIME', '99.8%', '#79c0ff', 0.76],
  ].forEach(([label, value, color, xr]) => {
    ctx.fillStyle = color; ctx.font = `bold ${Math.round(h * 0.065)}px monospace`;
    ctx.textAlign = 'center'; ctx.fillText(value, w * xr, h * 0.18);
    ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.036)}px monospace`;
    ctx.fillText(label, w * xr, h * 0.215); ctx.textAlign = 'left';
  });

  // Risk bars
  const bars = [
    { label: 'Flood Risk', val: 0.23, color: '#79c0ff' },
    { label: 'Wind Event', val: 0.12, color: '#56d364' },
    { label: 'Overall Hazard', val: 0.68, color: C },
  ];
  const bStart = h * 0.27, bStep = h * 0.14;
  bars.forEach(({ label, val, color }, i) => {
    const y = bStart + i * bStep;
    ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.038)}px monospace`;
    ctx.fillText(label, w * 0.03, y);
    ctx.fillStyle = color; ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(val * 100)}%`, w * 0.97, y); ctx.textAlign = 'left';
    ctx.fillStyle = '#21262d'; ctx.fillRect(w * 0.03, y + h * 0.015, w * 0.94, h * 0.028);
    ctx.fillStyle = color; ctx.fillRect(w * 0.03, y + h * 0.015, w * 0.94 * val, h * 0.028);
  });

  // Pipeline mini
  ctx.fillStyle = '#0d0a07'; ctx.fillRect(w * 0.03, h * 0.70, w * 0.94, h * 0.14);
  ctx.strokeStyle = C + '20'; ctx.lineWidth = 1; ctx.strokeRect(w * 0.03, h * 0.70, w * 0.94, h * 0.14);
  ctx.fillStyle = C + '80'; ctx.font = `${Math.round(h * 0.032)}px monospace`;
  ctx.fillText('DATA PIPELINE', w * 0.05, h * 0.728);
  const nodes = [['IoT', '#56d364', 0.08], ['Kafka', C, 0.27], ['Flink', '#79c0ff', 0.46], ['TF Model', '#b48eff', 0.65], ['Alert', '#ff7b72', 0.84]];
  nodes.forEach(([name, color, xr], i) => {
    ctx.fillStyle = color + '22'; ctx.fillRect(w*xr - w*0.03, h*0.745, w*0.1, h*0.07);
    ctx.strokeStyle = color + '55'; ctx.lineWidth = 1; ctx.strokeRect(w*xr - w*0.03, h*0.745, w*0.1, h*0.07);
    ctx.fillStyle = color; ctx.font = `${Math.round(h * 0.036)}px monospace`;
    ctx.textAlign = 'center'; ctx.fillText(name, w*xr + w*0.02, h*0.79); ctx.textAlign = 'left';
    if (i < nodes.length - 1) { ctx.fillStyle = '#7d8590'; ctx.fillText('→', w*(xr + 0.1), h*0.79); }
  });

  // Status bar
  ctx.fillStyle = C; ctx.fillRect(0, h * 0.9, w, h * 0.1);
  ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.round(h * 0.044)}px monospace`;
  ctx.fillText('● Multi-Hazard EWS', w * 0.03, h * 0.963);
  ctx.textAlign = 'right'; ctx.fillStyle = '#ffffffCC'; ctx.font = `${Math.round(h * 0.038)}px monospace`;
  ctx.fillText('in development', w * 0.97, h * 0.963); ctx.textAlign = 'left';
}

function drawAIMLPreview(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const C = '#28C840';

  ctx.fillStyle = '#040A05'; ctx.fillRect(0, 0, w, h);

  // Title bar
  ctx.fillStyle = C + '0E'; ctx.fillRect(0, 0, w, h * 0.1);
  ctx.strokeStyle = C + '22'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, w, h * 0.1);
  [['#FF5F57', 0.05], ['#FEBC2E', 0.13], ['#28C840', 0.21]].forEach(([c, xr]) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(w * xr, h * 0.05, w * 0.024, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = C; ctx.font = `${Math.round(h * 0.042)}px monospace`;
  ctx.textAlign = 'center'; ctx.fillText('EEG/EMG SIGNAL MONITOR v2.1', w * 0.6, h * 0.066); ctx.textAlign = 'left';
  ctx.fillStyle = C; ctx.font = `bold ${Math.round(h * 0.038)}px monospace`;
  ctx.fillText('▶ LIVE', w * 0.88, h * 0.066);

  // Session row
  ctx.fillStyle = '#060C07'; ctx.fillRect(0, h * 0.1, w, h * 0.075);
  ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.036)}px monospace`;
  ctx.fillText('session_042', w * 0.03, h * 0.148);
  ctx.fillStyle = C; ctx.fillText('512 Hz', w * 0.3, h * 0.148);
  ctx.fillStyle = '#7d8590'; ctx.fillText('subject: P-07', w * 0.5, h * 0.148);
  ctx.fillStyle = '#56d364'; ctx.fillText('● recording', w * 0.75, h * 0.148);

  // EEG waveform
  const eegY = h * 0.24; const eegH = h * 0.12;
  ctx.fillStyle = '#060C07'; ctx.fillRect(w * 0.03, eegY - eegH * 0.5, w * 0.94, eegH * 1.4);
  ctx.strokeStyle = C + '22'; ctx.lineWidth = 1; ctx.strokeRect(w * 0.03, eegY - eegH * 0.5, w * 0.94, eegH * 1.4);
  ctx.fillStyle = '#79c0ff'; ctx.font = `${Math.round(h * 0.032)}px monospace`;
  ctx.fillText('EEG CHANNEL  14.2 Hz', w * 0.04, eegY - eegH * 0.5 + h * 0.035);
  // Draw EEG sine wave
  ctx.beginPath(); ctx.strokeStyle = '#79c0ff'; ctx.lineWidth = 1.5;
  for (let x = w * 0.04; x < w * 0.96; x += 1) {
    const t = (x - w * 0.04) / (w * 0.92);
    const y = eegY + Math.sin(t * Math.PI * 6) * eegH * 0.35;
    if (x === w * 0.04) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // EMG waveform
  const emgY = h * 0.46; const emgH = h * 0.12;
  ctx.fillStyle = '#060C07'; ctx.fillRect(w * 0.03, emgY - emgH * 0.5, w * 0.94, emgH * 1.4);
  ctx.strokeStyle = C + '22'; ctx.lineWidth = 1; ctx.strokeRect(w * 0.03, emgY - emgH * 0.5, w * 0.94, emgH * 1.4);
  ctx.fillStyle = C; ctx.font = `${Math.round(h * 0.032)}px monospace`;
  ctx.fillText('EMG CHANNEL  8.7 mV', w * 0.04, emgY - emgH * 0.5 + h * 0.035);
  // Draw EMG spiky signal
  ctx.beginPath(); ctx.strokeStyle = C; ctx.lineWidth = 1.5;
  const emgPts = [0,0,0,0.9,-0.9,0,0,0,0.7,-0.7,0,0,0,0,0.8,-0.8,0,0,0,0.6,-0.6,0,0,0,0,0.9,-0.9,0,0,0];
  emgPts.forEach((v, i) => {
    const x = w * (0.04 + i * 0.032);
    const y = emgY + v * emgH * 0.45;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Prediction result
  ctx.fillStyle = '#060C07'; ctx.fillRect(w * 0.03, h * 0.63, w * 0.94, h * 0.21);
  ctx.strokeStyle = C + '25'; ctx.lineWidth = 1; ctx.strokeRect(w * 0.03, h * 0.63, w * 0.94, h * 0.21);
  ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.036)}px monospace`;
  ctx.fillText('MODEL PREDICTION', w * 0.05, h * 0.66);
  ctx.fillStyle = C; ctx.textAlign = 'right'; ctx.font = `bold ${Math.round(h * 0.036)}px monospace`;
  ctx.fillText('94.2% confidence', w * 0.97, h * 0.66); ctx.textAlign = 'left';
  // Confidence bar
  ctx.fillStyle = '#21262d'; ctx.fillRect(w * 0.05, h * 0.67, w * 0.9, h * 0.03);
  ctx.fillStyle = C; ctx.fillRect(w * 0.05, h * 0.67, w * 0.9 * 0.942, h * 0.03);
  // State
  ctx.fillStyle = '#7d8590'; ctx.font = `${Math.round(h * 0.036)}px monospace`;
  ctx.fillText('STATE:', w * 0.05, h * 0.80);
  ctx.fillStyle = C; ctx.font = `bold ${Math.round(h * 0.055)}px monospace`;
  ctx.fillText('HUNGER DETECTED', w * 0.22, h * 0.80);

  // Status bar
  ctx.fillStyle = C; ctx.fillRect(0, h * 0.9, w, h * 0.1);
  ctx.fillStyle = '#000'; ctx.font = `bold ${Math.round(h * 0.044)}px monospace`;
  ctx.fillText('● EEG/EMG Hunger Detection', w * 0.03, h * 0.963);
  ctx.textAlign = 'right'; ctx.fillStyle = '#000000AA'; ctx.font = `${Math.round(h * 0.038)}px monospace`;
  ctx.fillText('Python · NumPy · scikit-learn', w * 0.97, h * 0.963); ctx.textAlign = 'left';
}

// ── Monitor physical model (NO Html inside — only canvas texture) ─────────────
function Monitor({
  position, rotationY = 0, screenArgs, standHeight,
  screenColor, screenId, onSelect, isActive,
}) {
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef();

  // Canvas texture — drawn once per screen type, displayed in WebGL
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 320;
    if (screenId === 'dev')      drawDevPreview(canvas);
    if (screenId === 'research') drawResearchPreview(canvas);
    if (screenId === 'aiml')     drawAIMLPreview(canvas);
    const t = new THREE.CanvasTexture(canvas);
    t.flipY = true;
    return t;
  }, [screenId]);

  // Subtle hover glow on top of the canvas texture
  useFrame(() => {
    if (!glowRef.current) return;
    const target = isActive ? 0.0 : hovered ? 0.3 : 0.0;
    glowRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      glowRef.current.emissiveIntensity, target, 0.07
    );
  });

  const fW = screenArgs[0] * 0.9;
  const fH = screenArgs[1] * 0.86;

  return (
    <group position={position} rotation-y={rotationY}>

      {/* Monitor body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={screenArgs} />
        <meshStandardMaterial color="#111115" roughness={0.55} metalness={0.45} />
      </mesh>

      {/* Bezel rim */}
      <mesh>
        <boxGeometry args={[screenArgs[0] + 0.028, screenArgs[1] + 0.028, screenArgs[2] * 0.35]} />
        <meshStandardMaterial color="#1A1A24" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -(screenArgs[1] / 2 + standHeight / 2), 0]} castShadow>
        <boxGeometry args={[0.065, standHeight, 0.065]} />
        <meshStandardMaterial color="#111115" roughness={0.6} metalness={0.45} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -(screenArgs[1] / 2 + standHeight + 0.022), 0]} receiveShadow>
        <boxGeometry args={[0.44, 0.04, 0.3]} />
        <meshStandardMaterial color="#111115" roughness={0.6} metalness={0.45} />
      </mesh>

      {/* Screen face — canvas texture + hover emissive glow + click */}
      <mesh
        position={[0, 0, screenArgs[2] / 2 + 0.001]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          gl.domElement.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isActive) onSelect();
        }}
      >
        <planeGeometry args={[fW, fH]} />
        <meshStandardMaterial
          ref={glowRef}
          map={texture}
          emissive={screenColor}
          emissiveIntensity={0.0}
          roughness={0.04}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Html overlay — ONE instance, only for the active zoomed screen ────────────
// Rendered at Scene level so only ONE Html exists in the DOM at a time.
// This is the key fix for CSS3D z-ordering issues.
const MONITORS_CONFIG = [
  { id: 'dev',      position: [-1.9, 0.74, -0.12], rotationY:  0.22,  screenArgs: [1.05, 0.66, 0.045], standHeight: 0.28, color: '#7C6FF7' },
  { id: 'research', position: [0,    0.84, -0.28],  rotationY:  0,     screenArgs: [1.28, 0.80, 0.045], standHeight: 0.34, color: '#E8935A' },
  { id: 'aiml',     position: [1.9,  0.74, -0.12],  rotationY: -0.22,  screenArgs: [1.05, 0.66, 0.045], standHeight: 0.28, color: '#28C840' },
];

// ── Screen detail HTML content (used inside the single Html overlay) ──────────
function DevScreenDetail({ onOpenProject }) {
  const p = PROJECTS[0]; const C = '#7C6FF7';
  return (
    <div style={{ width:'100%',height:'100%',background:'#0d1117',fontFamily:'"JetBrains Mono","Courier New",monospace',display:'flex',flexDirection:'column',overflow:'hidden',boxSizing:'border-box' }}>
      {/* Title bar */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 12px',background:'#161b22',borderBottom:'1px solid #30363d',flexShrink:0 }}>
        <div style={{ display:'flex',gap:'6px' }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c=><div key={c} style={{ width:'9px',height:'9px',borderRadius:'50%',background:c }} />)}
        </div>
        <span style={{ fontSize:'8px',color:'#7d8590' }}>arfl_platform — Visual Studio Code</span>
        <div style={{ width:'42px' }} />
      </div>
      {/* Tabs */}
      <div style={{ display:'flex',background:'#161b22',borderBottom:'1px solid #30363d',flexShrink:0 }}>
        {['arfl_client.py','byzantine.py','server.py'].map((name,i)=>(
          <div key={name} style={{ padding:'4px 14px',fontSize:'8px',color:i===0?'#e6edf3':'#7d8590',background:i===0?'#0d1117':'transparent',borderRight:'1px solid #30363d',borderBottom:i===0?`2px solid ${C}`:'none',flexShrink:0 }}>{name}</div>
        ))}
      </div>
      {/* Editor */}
      <div style={{ display:'flex',flex:1,overflow:'hidden',minHeight:0 }}>
        <div style={{ width:'110px',flexShrink:0,padding:'8px 0',background:'#161b22',borderRight:'1px solid #30363d',fontSize:'8px' }}>
          <div style={{ padding:'2px 10px 6px',fontSize:'7px',color:'#7d8590',letterSpacing:'0.12em' }}>EXPLORER</div>
          {[['▶ src',0],['▼ models',1],['arfl_client',2,true],['byzantine',2],['▶ training',1],['▶ tests',0]].map(([n,d,active])=>(
            <div key={n} style={{ padding:`2px 0 2px ${10+d*10}px`,color:active?C:'#7d8590',background:active?C+'12':'transparent',fontSize:'8px' }}>{n}</div>
          ))}
        </div>
        <div style={{ display:'flex',flex:1,overflow:'hidden' }}>
          <div style={{ width:'30px',flexShrink:0,padding:'8px 0',background:'#0d1117',textAlign:'right',paddingRight:'6px' }}>
            {Array.from({length:12},(_,i)=><div key={i} style={{ fontSize:'7px',lineHeight:'1.65',color:'#484f58' }}>{i+1}</div>)}
          </div>
          <div style={{ flex:1,padding:'8px 12px',fontSize:'8px',lineHeight:1.65,overflow:'hidden',color:'#e6edf3' }}>
            <div><span style={{color:'#ff7b72'}}>import</span> torch</div>
            <div><span style={{color:'#ff7b72'}}>from</span> federated <span style={{color:'#ff7b72'}}>import</span> FLClient</div>
            <div> </div>
            <div><span style={{color:'#ff7b72'}}>class</span> <span style={{color:C}}>ARFLClient</span>(FLClient):</div>
            <div>{'  '}<span style={{color:'#ff7b72'}}>def</span> <span style={{color:'#79c0ff'}}>train</span>(<span style={{color:'#ffa657'}}>self</span>, model, data):</div>
            <div>{'    '}<span style={{color:'#8b949e'}}># Byzantine-resilient local SGD</span></div>
            <div>{'    '}opt = SGD(lr=<span style={{color:'#79c0ff'}}>0.01</span>)</div>
            <div>{'    '}<span style={{color:'#ff7b72'}}>for</span> e <span style={{color:'#ff7b72'}}>in</span> <span style={{color:'#79c0ff'}}>range</span>(<span style={{color:'#79c0ff'}}>5</span>):</div>
            <div>{'      '}loss = self._step(model, data)</div>
            <div>{'    '}<span style={{color:'#ff7b72'}}>return</span> self.clip_grads()</div>
          </div>
        </div>
      </div>
      <div style={{ background:C,padding:'3px 12px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontSize:'7px',color:'#fff',fontWeight:700 }}>● ARFL Platform</span>
        <span style={{ fontSize:'7px',color:'#ffffffCC' }}>Python · PyTorch · model trained</span>
      </div>
      {/* Detail */}
      <div style={{ background:'#161b22',padding:'10px 14px',flexShrink:0 }}>
        <p style={{ fontSize:'8px',lineHeight:1.7,color:'#8b949e',marginBottom:'10px' }}>{p.fullDesc}</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'10px' }}>
          {p.tech.map(t=><span key={t} style={{ background:C+'18',border:`1px solid ${C}35`,color:C,fontSize:'7px',padding:'2px 8px',borderRadius:'999px' }}>{t}</span>)}
        </div>
        <div style={{ display:'flex',gap:'8px' }}>
          <button onClick={(e)=>{e.stopPropagation();onOpenProject(p);}} style={{ background:C,border:'none',borderRadius:'4px',padding:'5px 14px',fontSize:'8px',color:'#fff',cursor:'pointer',fontFamily:'inherit',fontWeight:600 }}>Open project →</button>
          {p.github&&<a href={p.github} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ background:'#21262d',border:'1px solid #30363d',borderRadius:'4px',padding:'5px 14px',fontSize:'8px',color:'#8b949e',textDecoration:'none',fontFamily:'inherit' }}>GitHub ↗</a>}
        </div>
      </div>
    </div>
  );
}

function ResearchScreenDetail({ onOpenProject }) {
  const p = PROJECTS[1]; const C = '#E8935A';
  const bars=[{label:'Flood Risk',val:23,color:'#79c0ff'},{label:'Wind Event',val:12,color:'#56d364'},{label:'Overall Hazard',val:68,color:C}];
  const pipe=['IoT Sensors','→','Kafka','→','Apache Flink','→','TF Model','→','Alert API'];
  const pCols=['#56d364',null,C,null,'#79c0ff',null,'#b48eff',null,'#ff7b72'];
  return (
    <div style={{ width:'100%',height:'100%',background:'#0A0804',fontFamily:'"JetBrains Mono","Courier New",monospace',display:'flex',flexDirection:'column',overflow:'hidden',boxSizing:'border-box' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 12px',background:C+'10',borderBottom:`1px solid ${C}28`,flexShrink:0 }}>
        <div style={{ display:'flex',gap:'6px' }}>{['#FF5F57','#FEBC2E','#28C840'].map(c=><div key={c} style={{ width:'9px',height:'9px',borderRadius:'50%',background:c }} />)}</div>
        <span style={{ fontSize:'8px',color:C,letterSpacing:'0.1em' }}>MULTI-HAZARD EWS · IIT BOMBAY</span>
        <div style={{ fontSize:'7px',color:'#56d364' }}>● LIVE</div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'6px 12px',gap:'6px',background:'#0d0a07',borderBottom:`1px solid ${C}20`,flexShrink:0 }}>
        {[['SENSORS','12','#56d364'],['ALERTS','2',C],['UPTIME','99.8%','#79c0ff']].map(([l,v,c])=>(
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:'11px',fontWeight:700,color:c }}>{v}</div>
            <div style={{ fontSize:'6px',color:'#7d8590',letterSpacing:'0.1em' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1,padding:'8px 12px',overflow:'hidden',minHeight:0 }}>
        {bars.map(m=>(
          <div key={m.label} style={{ marginBottom:'8px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'3px' }}>
              <span style={{ fontSize:'7px',color:'#8b949e' }}>{m.label}</span>
              <span style={{ fontSize:'7px',color:m.color,fontWeight:700 }}>{m.val}%</span>
            </div>
            <div style={{ height:'4px',background:'#21262d',borderRadius:'2px' }}>
              <div style={{ height:'100%',width:`${m.val}%`,background:m.color,borderRadius:'2px',boxShadow:`0 0 4px ${m.color}` }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop:'8px',padding:'6px 8px',background:'#0d0a07',borderRadius:'4px',border:`1px solid ${C}18` }}>
          <div style={{ fontSize:'6px',color:C+'70',letterSpacing:'0.12em',marginBottom:'5px' }}>REALTIME DATA PIPELINE</div>
          <div style={{ display:'flex',alignItems:'center',gap:'3px',flexWrap:'nowrap',overflow:'hidden' }}>
            {pipe.map((node,i)=>(
              <span key={i} style={{ fontSize:'7px',color:pCols[i]??'#7d8590',padding:pCols[i]&&!node.startsWith('→')?'2px 5px':'0',background:pCols[i]&&!node.startsWith('→')?pCols[i]+'15':'none',border:pCols[i]&&!node.startsWith('→')?`1px solid ${pCols[i]}30`:'none',borderRadius:'2px',flexShrink:0,whiteSpace:'nowrap' }}>{node}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:C,padding:'3px 12px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontSize:'7px',color:'#fff',fontWeight:700 }}>● Multi-Hazard EWS</span>
        <span style={{ fontSize:'7px',color:'#ffffffCC' }}>Kafka · Flink · TensorFlow</span>
      </div>
      <div style={{ background:'#0d0a07',padding:'10px 14px',flexShrink:0 }}>
        <p style={{ fontSize:'8px',lineHeight:1.7,color:'#8b949e',marginBottom:'10px' }}>{p.fullDesc}</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'10px' }}>
          {p.tech.map(t=><span key={t} style={{ background:C+'18',border:`1px solid ${C}35`,color:C,fontSize:'7px',padding:'2px 8px',borderRadius:'999px' }}>{t}</span>)}
        </div>
        <button onClick={(e)=>{e.stopPropagation();onOpenProject(p);}} style={{ background:C,border:'none',borderRadius:'4px',padding:'5px 14px',fontSize:'8px',color:'#fff',cursor:'pointer',fontFamily:'inherit',fontWeight:600 }}>Open project →</button>
      </div>
    </div>
  );
}

function AIMLScreenDetail({ onOpenProject }) {
  const p = PROJECTS[2]; const C = '#28C840';
  return (
    <div style={{ width:'100%',height:'100%',background:'#040A05',fontFamily:'"JetBrains Mono","Courier New",monospace',display:'flex',flexDirection:'column',overflow:'hidden',boxSizing:'border-box' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 12px',background:C+'0E',borderBottom:`1px solid ${C}22`,flexShrink:0 }}>
        <div style={{ display:'flex',gap:'6px' }}>{['#FF5F57','#FEBC2E','#28C840'].map(c=><div key={c} style={{ width:'9px',height:'9px',borderRadius:'50%',background:c }} />)}</div>
        <span style={{ fontSize:'8px',color:C,letterSpacing:'0.1em' }}>EEG/EMG SIGNAL MONITOR v2.1</span>
        <div style={{ fontSize:'7px',color:C }}>▶ LIVE</div>
      </div>
      <div style={{ display:'flex',gap:'16px',padding:'4px 12px',background:'#060C07',borderBottom:`1px solid ${C}15`,flexShrink:0 }}>
        <span style={{ fontSize:'7px',color:'#7d8590' }}>session_042</span>
        <span style={{ fontSize:'7px',color:C }}>512 Hz</span>
        <span style={{ fontSize:'7px',color:'#56d364' }}>● recording</span>
      </div>
      <div style={{ flex:1,padding:'8px 12px',overflow:'hidden',minHeight:0 }}>
        {[{label:'EEG CHANNEL · α/β BAND',freq:'14.2 Hz',color:'#79c0ff',pts:'0,11 10,9 18,6 25,11 32,16 40,11 48,7 55,11 62,15 70,11 78,5 85,11 93,17 100,11 108,8 115,11 122,14 130,11 138,6 145,11 153,16 160,11 168,7 175,11 183,15 190,11 198,5 205,11 213,17 220,11 228,8 235,11 242,14 250,11 258,6 265,11 273,16 280,11 288,7 295,11 300,11'},
          {label:'EMG CHANNEL · MUSCLE ACTIVITY',freq:'8.7 mV',color:C,pts:'0,11 5,11 8,4 11,18 14,11 30,11 33,5 36,17 39,11 55,11 58,3 61,19 64,11 80,11 83,6 86,16 89,11 105,11 108,4 111,18 114,11 130,11 133,7 136,15 139,11 155,11 158,5 161,17 164,11 180,11 183,3 186,19 189,11 205,11 208,6 211,16 214,11 230,11 233,4 236,18 239,11 255,11 258,7 261,15 264,11 280,11 283,5 286,17 289,11 295,11 300,11'}
        ].map(sig=>(
          <div key={sig.label} style={{ marginBottom:'8px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'3px' }}>
              <span style={{ fontSize:'7px',color:sig.color,letterSpacing:'0.08em' }}>{sig.label}</span>
              <span style={{ fontSize:'7px',color:sig.color }}>{sig.freq}</span>
            </div>
            <div style={{ height:'28px',background:'#060C07',border:`1px solid ${C}18`,borderRadius:'3px',overflow:'hidden' }}>
              <svg width="100%" height="28" viewBox="0 0 300 22" preserveAspectRatio="none">
                <polyline fill="none" stroke={sig.color} strokeWidth="1.5" opacity="0.9" points={sig.pts} />
              </svg>
            </div>
          </div>
        ))}
        <div style={{ padding:'7px 10px',background:'#060C07',border:`1px solid ${C}22`,borderRadius:'4px',marginBottom:'7px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'4px' }}>
            <span style={{ fontSize:'7px',color:'#7d8590',letterSpacing:'0.08em' }}>MODEL PREDICTION</span>
            <span style={{ fontSize:'7px',color:C,fontWeight:700 }}>94.2% confidence</span>
          </div>
          <div style={{ height:'4px',background:'#21262d',borderRadius:'2px',marginBottom:'5px' }}>
            <div style={{ height:'100%',width:'94%',background:C,borderRadius:'2px',boxShadow:`0 0 6px ${C}` }} />
          </div>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div><span style={{ fontSize:'7px',color:'#7d8590' }}>STATE: </span><span style={{ fontSize:'9px',color:C,fontWeight:700 }}>HUNGER DETECTED</span></div>
            <div style={{ display:'flex',gap:'3px' }}>
              {['SVM','MNE','scikit-learn'].map(t=><span key={t} style={{ background:C+'12',border:`1px solid ${C}25`,color:C,fontSize:'6px',padding:'1px 5px',borderRadius:'2px' }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background:C,padding:'3px 12px',flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontSize:'7px',color:'#000',fontWeight:700 }}>● EEG/EMG Hunger Detection</span>
        <span style={{ fontSize:'7px',color:'#000000AA' }}>Python · NumPy · scikit-learn</span>
      </div>
      <div style={{ background:'#060C07',padding:'10px 14px',flexShrink:0 }}>
        <p style={{ fontSize:'8px',lineHeight:1.7,color:'#8b949e',marginBottom:'10px' }}>{p.fullDesc}</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'10px' }}>
          {p.tech.map(t=><span key={t} style={{ background:C+'18',border:`1px solid ${C}35`,color:C,fontSize:'7px',padding:'2px 8px',borderRadius:'999px' }}>{t}</span>)}
        </div>
        <div style={{ display:'flex',gap:'8px' }}>
          <button onClick={(e)=>{e.stopPropagation();onOpenProject(p);}} style={{ background:C,border:'none',borderRadius:'4px',padding:'5px 14px',fontSize:'8px',color:'#000',cursor:'pointer',fontFamily:'inherit',fontWeight:700 }}>Open project →</button>
          {p.github&&<a href={p.github} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ background:'#060C07',border:`1px solid ${C}30`,borderRadius:'4px',padding:'5px 14px',fontSize:'8px',color:'#8b949e',textDecoration:'none',fontFamily:'inherit' }}>GitHub ↗</a>}
        </div>
      </div>
    </div>
  );
}

// Renders the Html overlay for exactly the active screen — zero z-fighting.
function ActiveScreenHtml({ activeScreen, isZoomedIn, onOpenProject }) {
  if (!activeScreen || !isZoomedIn) return null;

  const m = MONITORS_CONFIG.find((mc) => mc.id === activeScreen);
  if (!m) return null;

  const isCenter   = m.id === 'research';
  const htmlW      = isCenter ? 700 : 575;
  const htmlH      = isCenter ? 490 : 380;

  const DetailComp = m.id === 'dev' ? DevScreenDetail
    : m.id === 'research' ? ResearchScreenDetail
    : AIMLScreenDetail;

  return (
    <group position={m.position} rotation-y={m.rotationY}>
      <Html
        position={[0, 0, m.screenArgs[2] / 2 + 0.006]}
        transform
        distanceFactor={2.5}
        style={{
          width: `${htmlW}px`,
          height: `${htmlH}px`,
          overflow: 'hidden',
          borderRadius: '1px',
          pointerEvents: 'auto',
        }}
      >
        <DetailComp onOpenProject={onOpenProject} />
      </Html>
    </group>
  );
}

// ── Camera controller ─────────────────────────────────────────────────────────
function CameraController({ activeScreen }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(...CAM.overview.look));
  const tPos   = useRef(new THREE.Vector3(...CAM.overview.pos));
  const tLook  = useRef(new THREE.Vector3(...CAM.overview.look));
  const mouse  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!activeScreen) return;
    const cfg = CAM[activeScreen];
    tPos.current.set(...cfg.pos);
    tLook.current.set(...cfg.look);
  }, [activeScreen]);

  useFrame(() => {
    if (!activeScreen) {
      tPos.current.set(mouse.current.x * 0.3, 2.0 + (-mouse.current.y * 0.14), 8.5);
      tLook.current.set(mouse.current.x * 0.18, 0.8, 0);
    }
    const speed = activeScreen ? 0.055 : 0.038;
    camera.position.lerp(tPos.current, speed);
    lookAt.current.lerp(tLook.current, speed);
    camera.lookAt(lookAt.current);
  });

  return null;
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ activeScreen, isZoomedIn, onScreenClick, onOpenProject }) {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[3, 8, 5]} intensity={0.8} castShadow />

      {/* Colored atmospheric fill lights — one per monitor */}
      <pointLight position={[-2.1, 1.6, 1.1]} color="#7C6FF7" intensity={2.0} distance={5} />
      <pointLight position={[0,   1.7, 1.1]}  color="#E8935A" intensity={1.5} distance={5} />
      <pointLight position={[2.1, 1.6, 1.1]}  color="#28C840" intensity={1.8} distance={5} />

      {/* Desk — wide enough for 3 spaced monitors */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.8, 0.07, 1.5]} />
        <meshStandardMaterial color="#18181E" roughness={0.84} metalness={0.16} />
      </mesh>
      {/* Desk front edge highlight */}
      <mesh position={[0, 0.038, 0.75]}>
        <boxGeometry args={[5.8, 0.003, 0.007]} />
        <meshStandardMaterial color="#2A2A3A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.045, 0.42]} receiveShadow>
        <boxGeometry args={[0.95, 0.018, 0.33]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.75} metalness={0.25} />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.66, 0.046, 0.42]} receiveShadow>
        <boxGeometry args={[0.12, 0.018, 0.2]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.75} metalness={0.25} />
      </mesh>

      {/* Three monitors — well spaced at x=±1.9 */}
      {MONITORS_CONFIG.map((m) => (
        <Monitor
          key={m.id}
          position={m.position}
          rotationY={m.rotationY}
          screenArgs={m.screenArgs}
          standHeight={m.standHeight}
          screenColor={m.color}
          screenId={m.id}
          onSelect={() => onScreenClick(m.id)}
          isActive={activeScreen === m.id}
        />
      ))}

      {/* Single Html overlay — only when zoomed in, for the active screen */}
      <ActiveScreenHtml
        activeScreen={activeScreen}
        isZoomedIn={isZoomedIn}
        onOpenProject={onOpenProject}
      />

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#040405" />
      </mesh>

      <CameraController activeScreen={activeScreen} />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
const noopSubscribe = () => () => {};

export default function RoomScene({ activeScreen, isZoomedIn, onScreenClick, onOpenProject }) {
  const isMobile = useSyncExternalStore(
    noopSubscribe,
    () => window.innerWidth < 768,
    () => false
  );

  return (
    <Canvas
      camera={{ fov: isMobile ? 55 : 43, position: [0, 2.0, 8.5] }}
      shadows
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene
          activeScreen={activeScreen}
          isZoomedIn={isZoomedIn}
          onScreenClick={onScreenClick}
          onOpenProject={onOpenProject}
        />
      </Suspense>
    </Canvas>
  );
}
