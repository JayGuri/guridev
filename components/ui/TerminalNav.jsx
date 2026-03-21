'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Terminal color palette (GitHub dark) ─────────────────────────────────────
const T = {
  bg:     '#0d1117',
  bg2:    '#161b22',
  bg3:    '#21262d',
  border: '#30363d',
  text:   '#e6edf3',
  muted:  '#7d8590',
  dim:    '#3d444d',
  green:  '#3fb950',
  blue:   '#79c0ff',
  orange: '#ffa657',
  purple: '#bc8cff',
  red:    '#f85149',
  yellow: '#e3b341',
};

// ── Jay Guri's config ─────────────────────────────────────────────────────────
const CONFIG = {
  name:     'Jay Guri',
  title:    'Developer · ML Researcher · Photographer',
  location: 'Mumbai, IN',
  email:    'jaymanishguri@gmail.com',
  github:   'https://github.com/jayguri',
  linkedin: 'https://linkedin.com/in/jay-guri-223b16289',
  status:   'open to opportunities',
  bio: [
    "Hey, I'm {name} — developer and photographer from {location}.",
    '',
    "I build ML systems that solve real problems. Federated learning,",
    "disaster early-warning, biosignal analysis. Research intern at IIT Bombay.",
    '',
    "Picked up a Sony α7 III a few years back and never put it down.",
    "I shoot streets and portraits when I'm not staring at a terminal.",
    '',
    "Currently studying CS at DJ Sanghvi, Mumbai.",
  ],
  stack: {
    primary:           ['Next.js', 'PyTorch', 'FastAPI'],
    backend:           ['Node.js', 'Kafka', 'Apache Flink'],
    ml:                ['PyTorch', 'TensorFlow', 'scikit-learn'],
    currently_building:['Async federated learning system'],
  },
  skills: {
    Languages: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
    Frontend:  ['Next.js', 'React', 'Framer Motion', 'Three.js'],
    Backend:   ['FastAPI', 'Node.js', 'Kafka', 'Apache Flink'],
    ML:        ['PyTorch', 'TensorFlow', 'scikit-learn', 'MNE'],
    DevOps:    ['Docker', 'Vercel', 'GitHub Actions'],
    Photo:     ['Sony α7 III', 'Lightroom', 'Capture One'],
  },
  experience: [
    { period: '2024 – present', role: 'Research Intern',     org: '@ IIT Bombay — Multi-Hazard EWS' },
    { period: '2023 – present', role: 'Engineering Student', org: '@ DJ Sanghvi, Mumbai (BE CSE)' },
  ],
  projects: [
    { id: '01', name: 'ARFL Platform',          tag: 'ML',       color: 'blue',   stack: 'PyTorch · FastAPI · Docker',         desc: 'Async federated learning with Byzantine fault tolerance' },
    { id: '02', name: 'Multi-Hazard EWS',        tag: 'research', color: 'green',  stack: 'Kafka · Flink · TensorFlow · IoT',   desc: 'Real-time disaster prediction — IIT Bombay' },
    { id: '03', name: 'EEG/EMG Hunger Detection',tag: 'research', color: 'orange', stack: 'Python · MNE · scikit-learn',          desc: 'Biosignal-driven ML pipeline' },
  ],
  photography: {
    genres: ['Street', 'Portrait', 'Architecture', 'Nature'],
    gear:   'Sony α7 III · various primes',
    edit:   'Lightroom Classic · Capture One',
  },
};

// ── Autocomplete map ──────────────────────────────────────────────────────────
const AC = {
  help: [], clear: [], whoami: [], pwd: [], date: [], uname: [], exit: [],
  cd:   ['./home', '--dev', '--photography', './about', './contact'],
  ls:   ['-la ./projects', './skills', './experience'],
  cat:  ['about.md', 'contact.json', 'stack.json'],
  open: ['github', 'linkedin', 'email'],
  sudo: ['hire-me'],
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',        targetId: 'hero',        mobileVisible: true,
    label: <><span style={{ color: T.green }}>cd</span>{' '}<span style={{ color: T.orange }}>./home</span></> },
  { id: 'dev',         targetId: 'work',        mobileVisible: true,
    label: <><span style={{ color: T.blue }}>--</span><span style={{ color: T.green }}>dev</span></> },
  { id: 'research',    targetId: 'research',    mobileVisible: false,
    label: <><span style={{ color: T.blue }}>--</span><span style={{ color: T.green }}>research</span></> },
  { id: 'photography', targetId: 'photography', mobileVisible: true,
    label: <><span style={{ color: T.blue }}>--</span><span style={{ color: T.green }}>photography</span></> },
  { id: 'projects',    targetId: 'work',        mobileVisible: false,
    label: <><span style={{ color: T.green }}>ls</span><span style={{ color: T.blue }}> -la</span><span style={{ color: T.orange }}> ./projects</span></> },
  { id: 'about',       targetId: 'about',       mobileVisible: false,
    label: <><span style={{ color: T.green }}>cat</span><span style={{ color: T.orange }}> about.md</span></> },
  { id: 'contact',     targetId: 'contact',     mobileVisible: true,
    label: <><span style={{ color: T.green }}>curl</span><span style={{ color: T.orange }}> contact.json</span></> },
];

const SECTION_IDS = ['hero', 'about', 'work', 'research', 'photography', 'me', 'contact'];

const SECTION_TO_NAV = {
  hero: 'home', about: 'about', work: 'dev',
  research: 'research', photography: 'photography', me: 'about', contact: 'contact',
};

// ── Section navigation helper (called from runCommand, no React context needed) ─
function scrollToSection(id) {
  // Small delay lets the terminal output render first, then the page scrolls
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, 450);
}

// ── Theme via useSyncExternalStore ────────────────────────────────────────────
const THEME_EVENT = 'app-theme-change';

function subscribeTheme(cb) {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
}
function getThemeSnapshot() {
  const s = localStorage.getItem('theme');
  if (s) return s;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ── Clock via useSyncExternalStore ────────────────────────────────────────────
const fmtTime = () =>
  typeof window === 'undefined'
    ? ''
    : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

let clockCbs = [], clockTick = null;

function subscribeClockStore(cb) {
  clockCbs.push(cb);
  if (!clockTick) clockTick = setInterval(() => clockCbs.forEach(fn => fn()), 30000);
  return () => {
    clockCbs = clockCbs.filter(fn => fn !== cb);
    if (!clockCbs.length && clockTick) { clearInterval(clockTick); clockTick = null; }
  };
}

function Clock() {
  const t = useSyncExternalStore(subscribeClockStore, fmtTime, () => '');
  return <span>{t}</span>;
}

// ── HTML helpers ──────────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function mkTag(text, color) {
  const map = {
    green:  `color:${T.green};background:rgba(63,185,80,.08);border-color:rgba(63,185,80,.3)`,
    blue:   `color:${T.blue};background:rgba(121,192,255,.08);border-color:rgba(121,192,255,.3)`,
    orange: `color:${T.orange};background:rgba(255,166,87,.08);border-color:rgba(255,166,87,.3)`,
    purple: `color:${T.purple};background:rgba(188,140,255,.08);border-color:rgba(188,140,255,.3)`,
    gray:   `color:${T.muted};background:${T.bg3};border-color:${T.border}`,
  };
  return `<span style="display:inline-block;border-radius:4px;padding:1px 7px;font-size:11px;margin:1px 2px;border:1px solid;${map[color] || map.gray}">${esc(text)}</span>`;
}

// HTML string for a single output line
function ln(html = '') {
  if (!html) return `<div style="height:0.85em"></div>`;
  return `<div style="font-size:13px;line-height:1.75;white-space:pre-wrap;word-break:break-word">${html}</div>`;
}

const PS1_HTML = `<span style="color:${T.blue}">visitor</span><span style="color:${T.muted}">@</span><span style="color:${T.orange}">portfolio</span><span style="color:${T.muted}">:</span><span style="color:${T.green}">~</span><span style="color:${T.text}"> ❯ </span>`;

function cmdEcho(cmd) {
  return `<div style="display:flex;gap:8px;align-items:baseline;font-size:13px;line-height:1.75;margin-top:4px">${PS1_HTML}<span style="color:${T.text}">${esc(cmd)}</span></div>`;
}

// ── NavButton ─────────────────────────────────────────────────────────────────
function NavButton({ item, isActive, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '4px 11px',
        borderRadius: '6px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        border: isActive ? '1px solid rgba(56,139,253,0.35)' : hov ? `1px solid ${T.border}` : '1px solid transparent',
        background: isActive ? '#1f2937' : hov ? T.bg3 : 'transparent',
        color: isActive || hov ? T.text : T.muted,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}
    >
      {item.label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TerminalNav() {
  // terminalVisible: toggled by Ctrl+` — replaces the old scroll-based visibility
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [activeSection,   setActiveSection]   = useState('hero');
  const [terminalOpen,    setTerminalOpen]     = useState(false);
  const [lines,           setLines]            = useState([]);
  const [terminalLoc,     setTerminalLoc]      = useState('home');

  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark');

  const outputRef          = useRef(null);
  const inputRef           = useRef(null);
  const historyRef         = useRef([]);
  const histIdxRef         = useRef(-1);
  const bootShownRef       = useRef(false);
  // Tracks whether the pointer is currently inside the terminal panel
  const isHoveringTerminal = useRef(false);
  // Stores the scrollHeight right before new output is added so we can
  // scroll back to the START of the new output instead of the bottom
  const cmdScrollAnchor    = useRef(0);

  // Sync data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Ctrl + ` toggles the entire terminal panel (like VS Code)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.code === 'Backquote') {
        e.preventDefault();
        setTerminalVisible(v => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Add/remove body class so .main-content gets the right paddingTop
  useEffect(() => {
    if (terminalVisible) {
      document.body.classList.add('terminal-open');
      // Small delay so the AnimatePresence animation starts before we focus
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      document.body.classList.remove('terminal-open');
    }
    return () => document.body.classList.remove('terminal-open');
  }, [terminalVisible]);

  // Track active section
  useEffect(() => {
    const obs = [];
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, []);

  // After lines update, jump to the START of the newly added output
  // (cmdScrollAnchor was captured just before setLines was called).
  // This means you always read from the command echo downward — like a pager,
  // not a chat. Previous output is still reachable by scrolling up.
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = cmdScrollAnchor.current;
    }
  }, [lines]);

  // Hover-aware scroll routing:
  //   - Cursor inside terminal → intercept wheel, scroll the output panel
  //   - Cursor outside (main content) → let Lenis / native scroll handle it normally
  // capture: true fires before Lenis so we can preventDefault before it sees the event.
  useEffect(() => {
    if (!terminalOpen) return;

    const handleWheel = (e) => {
      if (!isHoveringTerminal.current) return; // cursor is outside — do nothing
      e.preventDefault();
      e.stopImmediatePropagation(); // prevent Lenis from also acting on this event
      if (outputRef.current) {
        outputRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, { capture: true });
  }, [terminalOpen]);

  // ── Command processor ───────────────────────────────────────────────────────
  const runCommand = useCallback((raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    historyRef.current.unshift(cmd);
    histIdxRef.current = -1;
    setTerminalOpen(true);

    const batch = [];
    const push = (html) => batch.push(ln(html));

    // Boot banner on first ever command
    if (!bootShownRef.current) {
      bootShownRef.current = true;
      push(`<span style="color:${T.green};font-weight:700">Portfolio Terminal v2.0.0</span>  <span style="color:${T.dim}">─── type <span style="color:${T.blue}">help</span> to get started</span>`);
      push(`<span style="color:${T.dim}">Last login: ${new Date().toDateString()} from 127.0.0.1</span>`);
      push('');
    }

    push(cmdEcho(cmd));

    const parts = cmd.split(/\s+/);
    const base  = parts[0].toLowerCase();
    const args  = parts.slice(1).join(' ');

    let shouldClear  = false;
    let delayedLines = null;
    let openUrl      = null;
    let navTarget    = null; // section ID to scroll to after output renders

    switch (base) {

      case 'help':
        setTerminalLoc('help');
        push('');
        push(`<span style="color:${T.green};font-weight:700">AVAILABLE COMMANDS</span>  <span style="color:${T.dim}">────────────────────────────────────</span>`);
        push('');
        [
          ['whoami',            'display a quick bio'],
          ['cd ./home',         'go to the hero section'],
          ['cd --dev',          'explore the developer side'],
          ['cd --photography',  'browse photography portfolio'],
          ['ls -la ./projects', 'list projects with details'],
          ['ls ./skills',       'show full tech stack'],
          ['ls ./experience',   'work & research history'],
          ['cat about.md',      'read the full about me'],
          ['cat contact.json',  'get contact info as JSON'],
          ['cat stack.json',    'view tech stack as JSON'],
          ['open github',       'open GitHub profile'],
          ['open linkedin',     'open LinkedIn profile'],
          ['open email',        'compose an email'],
          ['pwd',               'print current location'],
          ['date',              'show current date & time'],
          ['uname -a',          'portfolio system info'],
          ['sudo hire-me',      '👀'],
          ['clear',             'clear the terminal'],
        ].forEach(([c, d]) => {
          push(`  <span style="color:${T.blue}">${c.padEnd(22)}</span> <span style="color:${T.muted}">→ ${esc(d)}</span>`);
        });
        push('');
        push(`  <span style="color:${T.dim}">↑ ↓ history · Tab autocomplete · Ctrl+L clear</span>`);
        push('');
        break;

      case 'whoami':
        setTerminalLoc('whoami');
        push('');
        push(`  <span style="color:${T.orange};font-weight:700">${esc(CONFIG.name)}</span>`);
        push(`  <span style="color:${T.muted}">${esc(CONFIG.title)}</span>`);
        push(`  <span style="color:${T.muted}">${esc(CONFIG.location)}</span>`);
        push('');
        push(`  ${mkTag('open to opportunities', 'green')} ${mkTag('Mumbai, IN', 'purple')} ${mkTag('IIT Bombay', 'blue')}`);
        push('');
        navTarget = 'hero';
        break;

      case 'cd':
        if (args === '--dev' || args === './dev') {
          setTerminalLoc('dev');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating to <span style="color:${T.orange};font-weight:700">Dev Studio</span> <span style="color:${T.dim}">↓ scrolling…</span>`);
          push('');
          [['Languages','green'],['Frontend','blue'],['Backend','orange'],['ML','purple']].forEach(([k, c]) => {
            const tgs = (CONFIG.skills[k] || []).slice(0, 4).map(s => mkTag(s, c)).join(' ');
            push(`  <span style="color:${T.dim}">${k.padEnd(12)}</span>  ${tgs}`);
          });
          push('');
          push(`  run <span style="color:${T.blue}">ls -la ./projects</span> to see what I've built.`);
          push('');
          navTarget = 'work';
        } else if (args === '--photography' || args === './photography') {
          setTerminalLoc('photography');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating to <span style="color:${T.orange};font-weight:700">Photography</span> <span style="color:${T.dim}">↓ scrolling…</span>`);
          push('');
          push(`  <span style="color:${T.dim}">Genres  </span>  ${CONFIG.photography.genres.map(g => mkTag(g, 'orange')).join(' ')}`);
          push(`  <span style="color:${T.dim}">Gear    </span>  <span style="color:${T.muted}">${esc(CONFIG.photography.gear)}</span>`);
          push(`  <span style="color:${T.dim}">Edit in </span>  <span style="color:${T.muted}">${esc(CONFIG.photography.edit)}</span>`);
          push('');
          navTarget = 'photography';
        } else if (args === '--research' || args === './research') {
          setTerminalLoc('research');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating to <span style="color:${T.orange};font-weight:700">Research</span> <span style="color:${T.dim}">↓ scrolling…</span>`);
          push('');
          push(`  IIT Bombay · Multi-Hazard Early Warning Systems`);
          push(`  <span style="color:${T.dim}">Kafka · Apache Flink · TensorFlow · IoT sensors</span>`);
          push('');
          navTarget = 'research';
        } else if (args === './about' || args === './me') {
          setTerminalLoc('about');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating to <span style="color:${T.orange};font-weight:700">About</span> <span style="color:${T.dim}">↓ scrolling…</span>`);
          push('');
          navTarget = 'about';
        } else if (args === './contact') {
          setTerminalLoc('contact');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating to <span style="color:${T.orange};font-weight:700">Contact</span> <span style="color:${T.dim}">↓ scrolling…</span>`);
          push('');
          navTarget = 'contact';
        } else if (args === './home' || args === '~' || args === './') {
          setTerminalLoc('home');
          push('');
          push(`<span style="color:${T.green}">→</span> Navigating home <span style="color:${T.dim}">↑ scrolling…</span>`);
          push('');
          navTarget = 'hero';
        } else {
          push(`<span style="color:${T.red}">cd: no such directory: ${esc(args)}</span>`);
          push(`<span style="color:${T.muted}">try: cd ./home · cd --dev · cd --photography · cd --research · cd ./about · cd ./contact</span>`);
          push('');
        }
        break;

      case 'ls':
        if (args.includes('projects')) {
          setTerminalLoc('projects');
          push('');
          push(`<span style="color:${T.green}">drwxr-xr-x  projects/</span>  <span style="color:${T.dim}">↓ scrolling to Dev Studio…</span>`);
          push('');
          CONFIG.projects.forEach(p => {
            push(`  <span style="color:${T.blue};font-weight:700">${esc(p.id)} · ${esc(p.name)}</span>  ${mkTag(p.tag, p.color)}`);
            push(`     <span style="color:${T.muted}">${esc(p.desc)} · ${esc(p.stack)}</span>`);
            push('');
          });
          push(`  <span style="color:${T.dim}">${CONFIG.projects.length} projects · run <span style="color:${T.blue}">open github</span> for all repos</span>`);
          push('');
          navTarget = 'work';
        } else if (args.includes('skills')) {
          setTerminalLoc('skills');
          push('');
          push(`<span style="color:${T.green}">./skills/</span>  <span style="color:${T.dim}">↓ scrolling to About…</span>`);
          push('');
          const cols = ['orange','blue','purple','yellow','green','gray'];
          Object.entries(CONFIG.skills).forEach(([k, v], i) => {
            const c = T[cols[i % cols.length]] || T.muted;
            push(`  <span style="color:${c}">${k.padEnd(12)}</span> ${esc(v.join('  '))}`);
          });
          push('');
          navTarget = 'about';
        } else if (args.includes('experience')) {
          setTerminalLoc('experience');
          push('');
          push(`<span style="color:${T.green}">./experience/</span>  <span style="color:${T.dim}">↓ scrolling to Research…</span>`);
          push('');
          CONFIG.experience.forEach(e => {
            push(`  <span style="color:${T.orange};font-weight:700">${esc(e.period)}</span>  <span style="color:${T.text}">${esc(e.role)}</span>`);
            push(`     <span style="color:${T.muted}">${esc(e.org)}</span>`);
            push('');
          });
          navTarget = 'research';
        } else {
          push('');
          push(`<span style="color:${T.muted}">total 4</span>`);
          [
            ['drwxr-xr-x', 'projects/',   'ls -la ./projects'],
            ['drwxr-xr-x', 'skills/',     'ls ./skills'],
            ['drwxr-xr-x', 'experience/', 'ls ./experience'],
            ['-rw-r--r--', 'about.md',    'cat about.md'],
          ].forEach(([perm, name, c]) => {
            push(`  <span style="color:${T.green}">${perm}</span>  <span style="color:${T.blue}">${name.padEnd(14)}</span> <span style="color:${T.muted}">→ ${c}</span>`);
          });
          push('');
        }
        break;

      case 'cat':
        if (args === 'about.md') {
          setTerminalLoc('about');
          push('');
          push(`<span style="color:${T.dim}"># about.md</span>  <span style="color:${T.dim}">↓ scrolling to About…</span>`);
          push('');
          CONFIG.bio.forEach(line => {
            const rendered = line
              .replace('{name}',     `<span style="color:${T.orange};font-weight:700">${esc(CONFIG.name)}</span>`)
              .replace('{location}', `<span style="color:${T.purple}">${esc(CONFIG.location)}</span>`);
            push(`  ${rendered}`);
          });
          push('');
          push(`  <span style="color:${T.dim}">───</span>`);
          push(`  <span style="color:${T.muted}">status:</span> <span style="color:${T.green}">${esc(CONFIG.status)}</span>`);
          push('');
          navTarget = 'about';
        } else if (args === 'contact.json') {
          setTerminalLoc('contact');
          push('');
          push(`<span style="color:${T.dim}">{  // ↓ scrolling to Contact…</span>`);
          push(`  <span style="color:${T.blue}">"email"</span>:    <span style="color:${T.green}">"${esc(CONFIG.email)}"</span>,`);
          push(`  <span style="color:${T.blue}">"github"</span>:   <span style="color:${T.green}">"${esc(CONFIG.github)}"</span>,`);
          push(`  <span style="color:${T.blue}">"linkedin"</span>: <span style="color:${T.green}">"${esc(CONFIG.linkedin)}"</span>,`);
          push(`  <span style="color:${T.blue}">"location"</span>: <span style="color:${T.green}">"${esc(CONFIG.location)}"</span>,`);
          push(`  <span style="color:${T.blue}">"status"</span>:   <span style="color:${T.orange}">"${esc(CONFIG.status)}"</span>`);
          push(`<span style="color:${T.dim}">}</span>`);
          push('');
          navTarget = 'contact';
        } else if (args === 'stack.json') {
          setTerminalLoc('stack');
          push('');
          push(`<span style="color:${T.dim}">{  // ↓ scrolling to About…</span>`);
          Object.entries(CONFIG.stack).forEach(([k, v], i, arr) => {
            const comma = i < arr.length - 1 ? ',' : '';
            const vals  = v.map(s => `<span style="color:${T.green}">"${esc(s)}"</span>`).join(', ');
            push(`  <span style="color:${T.blue}">"${esc(k)}"</span>: [${vals}]${comma}`);
          });
          push(`<span style="color:${T.dim}">}</span>`);
          push('');
          navTarget = 'about';
        } else {
          push(`<span style="color:${T.red}">cat: ${esc(args || 'missing operand')}</span>`);
          push(`<span style="color:${T.muted}">available: about.md · contact.json · stack.json</span>`);
          push('');
        }
        break;

      case 'open': {
        const urls = {
          github:   CONFIG.github,
          linkedin: CONFIG.linkedin,
          email:    `mailto:${CONFIG.email}`,
        };
        if (urls[args]) {
          push('');
          push(`<span style="color:${T.green}">→</span> Opening <span style="color:${T.orange}">${esc(args)}</span>…`);
          push('');
          openUrl = urls[args];
        } else {
          push(`<span style="color:${T.red}">open: unknown target: ${esc(args)}</span>`);
          push(`<span style="color:${T.muted}">try: open github · open linkedin · open email</span>`);
          push('');
        }
        break;
      }

      case 'pwd':
        push('');
        push(`  <span style="color:${T.green}">/home/visitor/portfolio</span>`);
        push('');
        break;

      case 'date':
        push('');
        push(`  <span style="color:${T.blue}">${new Date().toUTCString()}</span>`);
        push('');
        break;

      case 'uname':
        push('');
        push(`  <span style="color:${T.purple}">PortfolioOS</span> 2.0.0 <span style="color:${T.muted}">jay-guri-mbp</span> Mumbai/POSIX`);
        push(`  <span style="color:${T.muted}">built with: Next.js · Three.js · too much chai</span>`);
        push('');
        break;

      case 'sudo':
        push('');
        if (args.includes('hire')) {
          push(`  <span style="color:${T.yellow}">[sudo] password for visitor: ••••••••</span>`);
          delayedLines = [
            ln(`  <span style="color:${T.green};font-weight:700">✓ Access granted. Great taste detected.</span>`),
            ln(`  <span style="color:${T.muted}">Initiating hire sequence → run <span style="color:${T.blue}">cat contact.json</span></span>`),
            ln(''),
          ];
          navTarget = 'contact';
        } else {
          push(`  <span style="color:${T.red}">sudo: ${esc(args)}: permission denied</span>`);
          push(`  <span style="color:${T.muted}">hint: try <span style="color:${T.blue}">sudo hire-me</span></span>`);
          push('');
        }
        break;

      case 'exit':
        push('');
        push(`  <span style="color:${T.muted}">Nice try. You can't leave — the portfolio is everywhere.</span>`);
        push('');
        break;

      case 'clear':
        shouldClear = true;
        break;

      default:
        push(`<span style="color:${T.red}">command not found: ${esc(base)}</span>  <span style="color:${T.muted}">run <span style="color:${T.blue}">help</span> for commands</span>`);
        push('');
    }

    if (shouldClear) {
      cmdScrollAnchor.current = 0;
      setLines([]);
      setTerminalOpen(false);
      bootShownRef.current = false;
      return;
    }

    // Capture scroll position BEFORE adding lines so the effect scrolls
    // back to the start of this command's output, not to the very bottom.
    cmdScrollAnchor.current = outputRef.current?.scrollTop ?? 0;

    setLines(prev => [...prev, ...batch]);
    if (openUrl) window.open(openUrl, '_blank', 'noopener,noreferrer');
    if (delayedLines) {
      setTimeout(() => {
        // Re-anchor for the delayed batch so it also starts at the top
        cmdScrollAnchor.current = outputRef.current?.scrollTop ?? 0;
        setLines(prev => [...prev, ...delayedLines]);
      }, 700);
    }
    // Navigate to the relevant section — small delay lets terminal output render first
    if (navTarget) scrollToSection(navTarget);
  }, []); // all deps are module-level constants or stable setters

  // ── Input keyboard handler ──────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const val = inputRef.current?.value || '';
      if (inputRef.current) inputRef.current.value = '';
      runCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdxRef.current + 1, historyRef.current.length - 1);
      if (next >= 0 && historyRef.current[next] !== undefined) {
        histIdxRef.current = next;
        if (inputRef.current) inputRef.current.value = historyRef.current[next];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdxRef.current - 1, -1);
      histIdxRef.current = next;
      if (inputRef.current) inputRef.current.value = next === -1 ? '' : (historyRef.current[next] || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val   = inputRef.current?.value || '';
      const parts = val.trim().split(/\s+/);
      const base  = parts[0].toLowerCase();
      if (parts.length === 1 && base) {
        const m = Object.keys(AC).filter(c => c.startsWith(base) && c !== base);
        if (m.length === 1 && inputRef.current) inputRef.current.value = m[0] + ' ';
      } else if (parts.length > 1) {
        const subs = AC[base];
        if (subs) {
          const rest = parts.slice(1).join(' ');
          const m = subs.filter(s => s.startsWith(rest) && s !== rest);
          if (m.length === 1 && inputRef.current) inputRef.current.value = base + ' ' + m[0];
        }
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setLines([]);
      setTerminalOpen(false);
      bootShownRef.current = false;
    }
  }, [runCommand]);

  const killTerminal = useCallback(() => {
    cmdScrollAnchor.current = 0;
    setLines([]);
    setTerminalOpen(false);
    bootShownRef.current = false;
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  const activeNavId  = SECTION_TO_NAV[activeSection] ?? 'home';
  const statusLabel  = terminalOpen ? `portfolio/${terminalLoc}` : `portfolio/${activeSection}`;

  // Build nav row
  const navRow = [];
  NAV_ITEMS.forEach((item, i) => {
    if (i > 0) navRow.push(
      <span key={`sep-${i}`} className="t-nav-sep" style={{ color: T.dim, fontSize: '12px', userSelect: 'none' }}>|</span>
    );
    navRow.push(
      <span key={item.id} className={item.mobileVisible ? '' : 't-desktop-only'}>
        <NavButton item={item} isActive={activeNavId === item.id} onClick={() => scrollTo(item.targetId)} />
      </span>
    );
  });

  return (
    <AnimatePresence>
      {terminalVisible && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 1000,
            fontFamily: "'JetBrains Mono', monospace",
          }}
          onClick={() => inputRef.current?.focus()}
          onMouseEnter={() => { isHoveringTerminal.current = true; }}
          onMouseLeave={() => { isHoveringTerminal.current = false; }}
        >
          {/* ── Layer 1: Title bar ─────────────────────────────────────── */}
          <div
            className="t-titlebar"
            style={{
              height: '44px',
              background: T.bg2,
              borderBottom: `1px solid ${T.bg3}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              {[
                { color: T.red,     action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { color: '#febc2e', action: null },
                { color: '#28c840', action: null },
              ].map(({ color, action }, i) => (
                <div key={i} onClick={action ?? undefined} style={{
                  width: '13px', height: '13px', borderRadius: '50%',
                  background: color, cursor: action ? 'pointer' : 'default', flexShrink: 0,
                }} />
              ))}
            </div>
            <div style={{ fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: T.orange }}>~/portfolio</span>
              <span style={{ color: T.muted }}>·</span>
              <span style={{ color: T.purple }}>⎇ main</span>
            </div>
            <div style={{ width: '60px' }} />
          </div>

          {/* ── Layer 2: Nav command bar ───────────────────────────────── */}
          <div
            style={{
              height: '44px',
              background: T.bg2,
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0 18px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <span style={{ color: T.green, fontWeight: 700, fontSize: '14px', flexShrink: 0, marginRight: '6px' }}>❯</span>
            {navRow}
            <div style={{ flex: 1 }} />
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; }}
              style={{
                background: 'transparent',
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                padding: '3px 7px',
                color: T.muted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                transition: 'color 0.15s ease',
              }}
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>
            <div style={{ width: '8px', height: '14px', background: T.green, flexShrink: 0, marginLeft: '6px', animation: 'tblink 1s step-end infinite' }} />
          </div>

          {/* ── Layer 3: Output panel (expands on first command) ───────── */}
          <motion.div
            initial={false}
            animate={{ height: terminalOpen ? 260 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', background: T.bg }}
          >
            <div
              ref={outputRef}
              style={{
                height: '260px',
                overflowY: 'auto',
                padding: '10px 20px',
                scrollbarWidth: 'thin',
                scrollbarColor: `${T.border} transparent`,
              }}
            >
              {lines.map((html, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>
          </motion.div>

          {/* ── Layer 4: Input row ─────────────────────────────────────── */}
          <div
            style={{
              height: '44px',
              background: T.bg,
              borderTop: terminalOpen ? `1px solid ${T.border}` : `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 18px',
              gap: '8px',
            }}
          >
            {/* PS1 prompt */}
            <span style={{ flexShrink: 0, fontSize: '13px', userSelect: 'none', whiteSpace: 'nowrap' }}>
              <span style={{ color: T.blue }}>visitor</span>
              <span style={{ color: T.muted }}>@</span>
              <span style={{ color: T.orange }}>portfolio</span>
              <span style={{ color: T.muted }}>:</span>
              <span style={{ color: T.green }}>~</span>
              <span style={{ color: T.text }}> ❯ </span>
            </span>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="type a command… (try 'help')"
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                color: T.text,
                caretColor: T.green,
                cursor: 'text',
              }}
            />

            {/* Blinking cursor */}
            <div style={{
              width: '8px', height: '14px',
              background: T.green,
              flexShrink: 0,
              animation: 'tblink 1s step-end infinite',
            }} />

            {/* Kill terminal button — only when output is open */}
            <AnimatePresence>
              {terminalOpen && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => { e.stopPropagation(); killTerminal(); }}
                  title="Kill terminal (Ctrl+L)"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(248,81,73,0.15)';
                    e.currentTarget.style.borderColor = T.red;
                    e.currentTarget.style.color = T.red;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.muted;
                  }}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    padding: '2px 8px',
                    color: T.muted,
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  ×  kill
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Layer 5: Status bar ────────────────────────────────────── */}
          <div
            style={{
              height: '24px',
              background: '#388bfd',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: '11px',
              color: '#fff',
              gap: '8px',
              userSelect: 'none',
            }}
          >
            <span>NORMAL</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span className="t-status-full">{statusLabel}</span>
            <span className="t-status-full" style={{ opacity: 0.5 }}>|</span>
            <span className="t-status-full">utf-8</span>
            <div style={{ marginLeft: 'auto' }}><Clock /></div>
          </div>

          <style>{`
            @keyframes tblink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            @media (max-width: 767px) {
              .t-titlebar    { display: none !important; }
              .t-desktop-only { display: none !important; }
              .t-status-full  { display: none !important; }
              .t-nav-sep      { display: none !important; }
            }
            div::-webkit-scrollbar       { width: 4px; }
            div::-webkit-scrollbar-track { background: transparent; }
            div::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
