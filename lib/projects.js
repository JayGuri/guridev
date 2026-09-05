// Single source of truth for project data.
// Kept dependency-free so the 2D fallback grid in DevStudio can import it
// without pulling in three.js (RoomScene stays lazy-loaded).

export const SCREENS_DATA = {
  dev: {
    label: 'The Builder', tab: '--dev', color: '#7C6FF7', hex: 0x7C6FF7,
    projects: [
      { name: 'CLIfolio', tech: 'Next.js · Three.js · Framer Motion', desc: 'This site — a terminal-styled portfolio with an interactive 3D room you can walk your cursor around.', github: 'https://github.com/jayguri', live: null },
      { name: 'ARFL Platform', tech: 'Python · PyTorch · Flower · FastAPI · Docker', desc: 'Privacy-preserving federated learning with Byzantine fault tolerance — clients train locally and share only model updates, never raw data.', github: 'https://github.com/jayguri', live: null },
    ],
  },
  research: {
    label: 'The Researcher', tab: '--research', color: '#E8935A', hex: 0xE8935A,
    projects: [
      { name: 'Multi-Hazard EWS', tech: 'Kafka · Apache Flink · TensorFlow · IoT', desc: 'Real-time disaster nowcasting at IIT Bombay — IoT sensor networks feeding stream-processing pipelines that drive deep-learning models for community alerting.', github: null, live: null },
      { name: 'EEG / EMG Hunger Detection', tech: 'Signal Processing · MNE · CNN', desc: 'Where neuromorphic computing meets human physiology — a pipeline classifying raw neural and muscular signals into hunger states.', github: 'https://github.com/jayguri', live: null },
    ],
  },
  aiml: {
    label: 'AI / ML', tab: '--aiml', color: '#28C840', hex: 0x28C840,
    projects: [
      { name: 'ARFL Platform', tech: 'PyTorch · FastAPI · Federated Learning', desc: 'Adaptive aggregation that keeps the global model stable even when a share of participants are adversarial.', github: 'https://github.com/jayguri', live: null },
      { name: 'EEG / EMG Hunger Detection', tech: 'Python · NumPy · scikit-learn', desc: 'Biosignal-driven ML — preprocessing raw EEG and EMG through to inference on hunger state.', github: 'https://github.com/jayguri', live: null },
    ],
  },
};

// Flat, de-duped list (first occurrence wins) for the non-WebGL project grid.
export const PROJECT_LIST = Object.entries(SCREENS_DATA)
  .flatMap(([category, s]) => s.projects.map((p) => ({ ...p, category, color: s.color })))
  .filter((p, i, arr) => arr.findIndex((q) => q.name === p.name) === i);
