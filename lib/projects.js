// Single source of truth for project data.
// Dependency-free so the 2D grid can import it without pulling in three.js
// (RoomScene stays lazily loaded).
//
// NOTE: `repo` is null everywhere because the previous data had every "GitHub"
// button pointing at the profile root rather than at the project. Fill these in
// with real repository URLs and the per-card buttons appear automatically.

export const PROJECTS = [
  {
    id: 'arfl',
    name: 'ARFL Platform',
    hook: 'Federated learning that survives adversarial clients',
    desc:
      'Privacy-preserving distributed training — clients learn locally and share only model updates, never raw data. Adaptive aggregation keeps the global model stable even when a share of participants are actively trying to poison it.',
    tech: ['Python', 'PyTorch', 'Flower', 'FastAPI', 'Docker'],
    category: 'aiml',
    status: 'active',
    year: '2026',
    repo: null,
    live: null,
  },
  {
    id: 'ews',
    name: 'Multi-Hazard EWS',
    hook: 'Sensor noise in a river to a warning on a phone',
    desc:
      'Real-time disaster nowcasting at IIT Bombay. IoT sensor networks feed a Kafka/Flink streaming backbone into deep-learning inference, which drives community alerting — the whole path budgeted under a minute.',
    tech: ['Kafka', 'Apache Flink', 'TensorFlow', 'IoT', 'Python'],
    category: 'research',
    status: 'active',
    year: '2026',
    repo: null,
    live: null,
  },
  {
    id: 'eeg',
    name: 'EEG / EMG Hunger Detection',
    hook: 'Classifying hunger state from raw biosignals',
    desc:
      'A signal-processing and CNN pipeline that takes raw neural and muscular recordings through filtering, windowing and feature extraction, then classifies hunger state. Where neuromorphic computing meets human physiology.',
    tech: ['Python', 'MNE', 'scikit-learn', 'NumPy', 'CNN'],
    category: 'research',
    status: 'archived',
    year: '2025',
    repo: null,
    live: null,
  },
  {
    id: 'clifolio',
    name: 'CLIfolio',
    hook: 'This site — a terminal you can actually type into',
    desc:
      'A portfolio built as a developer environment: a real command parser behind Ctrl+`, an interactive three.js studio, and a photography archive driven by an EXIF pipeline that reads straight off the originals.',
    tech: ['Next.js', 'Three.js', 'Framer Motion', 'React'],
    category: 'dev',
    status: 'live',
    year: '2026',
    repo: null,
    live: null,
  },
];

export const CATEGORY_META = {
  dev: { label: 'Engineering', color: '#7C6FF7' },
  aiml: { label: 'AI / ML', color: '#3FB950' },
  research: { label: 'Research', color: '#E8935A' },
};

export const STATUS_META = {
  active: { label: 'active', color: '#3FB950' },
  live: { label: 'live', color: '#7C6FF7' },
  archived: { label: 'archived', color: '#9AA4B2' },
};

export const GITHUB_PROFILE = 'https://github.com/jayguri';

function toScreen(p) {
  return {
    name: p.name,
    tech: p.tech.join(' · '),
    desc: p.desc,
    github: p.repo,
    live: p.live,
  };
}

// ─── Shape the three.js studio still expects ────────────────────────────────
// Derived from PROJECTS so the room and the grid can never drift apart.
export const SCREENS_DATA = {
  dev: {
    label: 'The Builder', tab: '--dev', color: '#7C6FF7', hex: 0x7C6FF7,
    projects: PROJECTS.filter((p) => p.category === 'dev' || p.category === 'aiml').map(toScreen),
  },
  research: {
    label: 'The Researcher', tab: '--research', color: '#E8935A', hex: 0xE8935A,
    projects: PROJECTS.filter((p) => p.category === 'research').map(toScreen),
  },
  aiml: {
    label: 'AI / ML', tab: '--aiml', color: '#28C840', hex: 0x28C840,
    projects: PROJECTS.filter((p) => p.category === 'aiml' || p.id === 'eeg').map(toScreen),
  },
};

// Flat list kept for backwards compatibility with older imports.
export const PROJECT_LIST = PROJECTS.map((p) => ({
  ...p,
  tech: p.tech.join(' · '),
  github: p.repo,
  color: CATEGORY_META[p.category].color,
}));
