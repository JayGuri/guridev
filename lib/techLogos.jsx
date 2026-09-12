'use client';

// Tech-stack marquee data. Lifted out of the deleted Identity section so the
// Skills section can own the single canonical 'things I build with' strip.
// ── Tech icons from simple-icons via react-icons ──────────────────────────────
import {
  SiReact, SiNextdotjs, SiPython, SiPytorch, SiTailwindcss, SiDocker,
  SiPostgresql, SiMongodb, SiGit, SiFastapi, SiApachekafka, SiTensorflow,
  SiPandas, SiScikitlearn, SiOpencv, SiHuggingface, SiNumpy,
  SiThreedotjs, SiTypescript, SiJavascript, SiHtml5,
  SiNodedotjs, SiExpress, SiFlask,
  SiMysql, SiRedis, SiSupabase, SiCloudinary,
  SiVercel, SiPostman, SiLinux, SiGithub,
  SiC, SiCplusplus, SiOpenjdk, SiGooglegemini, SiGooglecolab,
  SiStrapi, SiWordpress, SiApacheflink, SiRazorpay, SiFigma, SiGooglechrome,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';


// ── Full tech-stack logos for the marquee ─────────────────────────────────────
export const techLogos = [
  // Core web
  { node: <SiReact />,       title: 'React' },
  { node: <SiNextdotjs />,   title: 'Next.js' },
  { node: <SiTypescript />,  title: 'TypeScript' },
  { node: <SiJavascript />,  title: 'JavaScript' },
  { node: <SiHtml5 />,       title: 'HTML5' },
  { node: <SiTailwindcss />, title: 'Tailwind' },
  { node: <SiThreedotjs />,  title: 'Three.js' },
  { node: <SiGooglechrome />, title: 'Chrome Extensions' },
  // Backend / languages
  { node: <SiNodedotjs />,   title: 'Node.js' },
  { node: <SiExpress />,     title: 'Express' },
  { node: <SiFastapi />,     title: 'FastAPI' },
  { node: <SiFlask />,       title: 'Flask' },
  { node: <SiC />,           title: 'C' },
  { node: <SiCplusplus />,   title: 'C++' },
  { node: <SiOpenjdk />,     title: 'Java' },
  // Data / ML
  { node: <SiPython />,      title: 'Python' },
  { node: <SiPytorch />,     title: 'PyTorch' },
  { node: <SiTensorflow />,  title: 'TensorFlow' },
  { node: <SiScikitlearn />, title: 'scikit-learn' },
  { node: <SiPandas />,      title: 'Pandas' },
  { node: <SiNumpy />,       title: 'NumPy' },
  { node: <SiOpencv />,      title: 'OpenCV' },
  { node: <SiHuggingface />, title: 'HuggingFace' },
  { node: <SiGooglegemini />, title: 'Gemini AI' },
  { node: <SiGooglecolab />, title: 'Google Colab' },
  // Databases / CMS
  { node: <SiPostgresql />,  title: 'PostgreSQL' },
  { node: <SiMongodb />,     title: 'MongoDB' },
  { node: <SiMysql />,       title: 'MySQL' },
  { node: <SiRedis />,       title: 'Redis' },
  { node: <SiSupabase />,    title: 'Supabase' },
  { node: <SiCloudinary />,  title: 'Cloudinary' },
  { node: <SiStrapi />,      title: 'Strapi' },
  { node: <SiWordpress />,   title: 'WordPress' },
  // Infra / streaming
  { node: <SiDocker />,      title: 'Docker' },
  { node: <SiApachekafka />, title: 'Kafka' },
  { node: <SiApacheflink />, title: 'Apache Flink' },
  { node: <SiVercel />,      title: 'Vercel' },
  { node: <SiRazorpay />,    title: 'Razorpay' },
  // Tools
  { node: <SiGit />,         title: 'Git' },
  { node: <SiGithub />,      title: 'GitHub' },
  { node: <SiPostman />,     title: 'Postman' },
  { node: <SiLinux />,       title: 'Linux' },
  { node: <VscVscode />,     title: 'VS Code' },
  { node: <SiFigma />,       title: 'Figma' },
];
