export const PROJECTS = [
  {
    id: 1,
    title: 'ARFL Platform',
    shortDesc: 'Privacy-preserving federated learning with Byzantine fault tolerance.',
    fullDesc: 'A distributed ML training system where clients train locally and share only model updates — never raw data. Built Byzantine resilience to handle adversarial participants trying to corrupt the global model.',
    tech: ['Python', 'PyTorch', 'Flower', 'FastAPI', 'Docker'],
    github: 'https://github.com/jayguri',
    liveUrl: null,
    category: 'ml',
    accent: '#7C6FF7',
  },
  {
    id: 2,
    title: 'Multi-Hazard EWS',
    shortDesc: 'Real-time disaster prediction system — IIT Bombay.',
    fullDesc: 'IoT sensor networks feeding real-time data through Kafka into Flink processing pipelines, driving deep learning models for early prediction of floods and natural hazards. Built for community alerting.',
    tech: ['Kafka', 'Apache Flink', 'TensorFlow', 'IoT', 'React'],
    github: null,
    liveUrl: null,
    category: 'research',
    accent: '#7C6FF7',
  },
  {
    id: 3,
    title: 'EEG/EMG Hunger Detection',
    shortDesc: 'Biosignal-driven ML pipeline for hunger state inference.',
    fullDesc: 'Processing raw EEG and EMG biosignals through preprocessing pipelines into ML models that infer hunger states. Explores the intersection of neuromorphic computing and human physiology.',
    tech: ['Python', 'NumPy', 'scikit-learn', 'MNE', 'Signal Processing'],
    github: 'https://github.com/jayguri',
    liveUrl: null,
    category: 'research',
    accent: '#E8935A',
  },
];

export const SKILLS = [];
