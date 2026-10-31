"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, User, Cpu, Briefcase, Rocket, Map, Mail, GraduationCap, Code, 
  Users, MapPin, ExternalLink, Copy, Check, Moon, Sun, ArrowRight, 
  ChevronDown, Sparkles, Shield, Radio, Layers, TerminalSquare, Activity, 
  ArrowUpRight, Award, Flame, Server, CheckCircle2, Zap
} from "lucide-react";

import { useRouter } from "next/navigation";
import { submitContactForm } from "./actions";
import StudioHero from "../components/StudioHero";
import FaceGateShowcase from "../components/FaceGateShowcase";
import CodeWriterShowcase from "../components/CodeWriterShowcase";
import HzlShowcase from "../components/HzlShowcase";
import AeroMeshShowcase from "../components/AeroMeshShowcase";
import PragShowcase from "../components/PragShowcase";
import SGPAGraph from "../components/SGPAGraph";
import GithubIcon from "../components/GithubIcon";

export interface NavItemType {
  id: string;
  sectionId: string;
  label: string;
  order: number;
}

export interface CoreAreaType {
  id: string;
  title: string;
  blurb: string;
  order: number;
  points: string[];
}

export interface SkillGroupType {
  id: string;
  name: string;
  accent: string;
  order: number;
  items: string[];
}

export interface ExperienceType {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  achievement?: string | null;
  order: number;
  stack: string[];
}

export interface EducationType {
  id: string;
  degree: string;
  college: string;
  duration: string;
  cgpa: string;
  description: string;
  hasDeepDive: boolean;
  order: number;
  subjects: string[];
  cocurricular: string[];
}

export interface SubCertType {
  id: string;
  name: string;
  category: string;
  instructor?: string | null;
  description?: string | null;
  duration?: string | null;
  certificateUrl?: string | null;
}

export interface CertificationType {
  id: string;
  name: string;
  issuer: string;
  date: string;
  hasDeepDive: boolean;
  order: number;
  subCertificates?: SubCertType[];
}

export interface ProjectType {
  id: string;
  title: string;
  tag: string;
  summary: string;
  impact: string;
  repoUrl?: string | null;
  order: number;
  stack: string[];
}

export interface JourneyStepType {
  id: string;
  year: string;
  title: string;
  text: string;
  order: number;
}

export interface ClientPageProps {
  tagline?: string;
  navItems: NavItemType[];
  coreAreas: CoreAreaType[];
  skillGroups: SkillGroupType[];
  experience: ExperienceType[];
  education: EducationType[];
  certifications: CertificationType[];
  projects: ProjectType[];
  journey: JourneyStepType[];
}

function SectionTitle({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      style={{ width: '100%' }}
    >
      <motion.div 
        className="section-heading"
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>{eyebrow}</span>
        <h2 style={compact ? { fontSize: 'clamp(2rem, 4vw, 3rem)' } : {}}>{title}</h2>
        <p>{description}</p>
      </motion.div>
    </motion.div>
  );
}

const getIconForSection = (sectionId: string) => {
  switch (sectionId) {
    case "home": return <Home className="icon" />;
    case "about": return <User className="icon" />;
    case "skills": return <Cpu className="icon" />;
    case "education": return <GraduationCap className="icon" />;
    case "experience": return <Briefcase className="icon" />;
    case "projects": return <Rocket className="icon" />;
    case "journey": return <Map className="icon" />;
    case "contact": return <Mail className="icon" />;
    default: return <Home className="icon" />;
  }
};

const getProjectMeta = (id: string) => {
  switch (id) {
    case 'proj-facegate':
      return { color: '#c084fc', icon: <Shield size={18} />, status: '● ACTIVE', shortTag: 'Linux Security' };
    case 'proj-codewriter':
      return { color: 'var(--cyan)', icon: <Code size={18} />, status: '● ARMED', shortTag: 'Kernel HID' };
    case 'proj-prag':
      return { color: '#818cf8', icon: <Sparkles size={18} />, status: '● 0.0 MB RAM', shortTag: 'Local RAG' };
    case 'proj-hzl':
      return { color: 'var(--amber)', icon: <Activity size={18} />, status: '● SAMPLING', shortTag: 'Industrial SCADA' };
    case 'proj-rtos-swarm':
      return { color: 'var(--lime)', icon: <Radio size={18} />, status: '● 1kHz LOOP', shortTag: 'RTOS Swarm' };
    default:
      return { color: 'var(--cyan)', icon: <Rocket size={18} />, status: '● RUNNING', shortTag: 'Engineered' };
  }
};

const getCleanProjectData = (id: string) => {
  switch (id) {
    case 'proj-facegate':
      return {
        badge: "Linux Biometrics & Application Security",
        tagline: "Locks sensitive Linux desktop apps (browsers, password managers) and automatically unlocks them in under 15ms using local AI facial recognition with anti-spoof protection.",
        stats: [
          { label: "Privacy Mode", value: "100% Offline", desc: "Zero Cloud Telemetry" },
          { label: "Inference Speed", value: "<15 ms", desc: "Local ONNX Runtime" },
          { label: "Security Vault", value: "AES-256 RAM", desc: "Zero Disk Trace" }
        ],
        highlights: [
          { icon: "🛡️", title: "Kernel App Interceptor", desc: "Freezes target desktop windows via POSIX SIGSTOP until your face is authenticated." },
          { icon: "👁️", title: "Centroid Anti-Spoof", desc: "Tracks 68 facial micro-movements to defeat photo and phone screen replay attacks." },
          { icon: "🔒", title: "Volatile RAM Vault", desc: "Stores biometric face templates in encrypted temporary RAM, leaving zero plaintext on disk." }
        ],
        steps: [
          { num: "01", title: "Target App Opened", desc: "Firefox or password manager launch is detected." },
          { num: "02", title: "Local AI Face Check", desc: "Webcam verifies face against 512D embedding." },
          { num: "03", title: "Instant App Resume", desc: "SIGCONT signal unlocks app in under 15ms." }
        ]
      };
    case 'proj-codewriter':
      return {
        badge: "Kernel Hardware Keystroke Automation",
        tagline: "Automatically types code into locked browser tests and remote desktops by injecting physical keyboard keystrokes directly through the Linux kernel.",
        stats: [
          { label: "Test Coverage", value: "101 Tests", desc: "100% Pytest Pass Rate" },
          { label: "Typing Cadence", value: "8 ms Jitter", desc: "Human Gaussian Timing" },
          { label: "Bypass Capability", value: "Zero Clipboard", desc: "Kernel /dev/uinput HID" }
        ],
        highlights: [
          { icon: "⌨️", title: "Direct Kernel HID", desc: "Simulates real USB keyboard scancodes, completely bypassing web browser paste blocks." },
          { icon: "⚡", title: "Human Typing Jitter", desc: "Applies Gaussian speed fluctuations and hesitation bursts to appear naturally typed." },
          { icon: "🧹", title: "AI Markdown Stripper", desc: "One-click parser strips markdown triple-backticks into clean executable code." }
        ],
        steps: [
          { num: "01", title: "Paste Raw Code", desc: "AI markdown fences and comments are cleaned." },
          { num: "02", title: "Gaussian Jitter Added", desc: "Human typing cadence intervals are calculated." },
          { num: "03", title: "Kernel HID Stream", desc: "Physical keystrokes inject directly into test window." }
        ]
      };
    case 'proj-prag':
      return {
        badge: "100% Offline AI & Systems Research Engine",
        tagline: "A lightweight local AI research engine that answers cybersecurity and math questions with exact precision, authoritative docs, and zero idle memory.",
        stats: [
          { label: "Standby Cost", value: "0.0 MB RAM", desc: "Instant Process Exit" },
          { label: "Math Latency", value: "<3 ms", desc: "AST Symbolic Engine" },
          { label: "Source Grounding", value: "60+ Tools", desc: "Official Kali Man Pages" }
        ],
        highlights: [
          { icon: "🧮", title: "Zero-Hallucination Math", desc: "Evaluates calculus and modulo with an exact AST symbolic parser instead of guessing." },
          { icon: "📚", title: "Official Tool Docs", desc: "Grounded with official documentation for 60+ security tools for accurate CLI flags." },
          { icon: "⚡", title: "Zero-Idle Architecture", desc: "Releases all memory immediately after answering, consuming 0.0 MB RAM on standby." }
        ],
        steps: [
          { num: "01", title: "Query Routed", desc: "AST router selects exact math vs vector tool docs." },
          { num: "02", title: "BGE Reranking", desc: "Cross-encoder scores top-3 authoritative sources." },
          { num: "03", title: "Fact-Grounded Stream", desc: "Qwen3 streams answer with source citations." }
        ]
      };
    case 'proj-hzl':
      return {
        badge: "Industrial IoT & High-Temperature SCADA",
        tagline: "Real-time industrial sensor monitoring system engineered for zinc smelting kilns, cutting hazardous factory walk-through inspections by 40%.",
        stats: [
          { label: "Factory Impact", value: "40% Drop", desc: "In Manual Inspections" },
          { label: "Signal Interface", value: "4-20 mA", desc: "Noise-Immune Loops" },
          { label: "Safety Trip", value: "<1.0 sec", desc: "Thermal Runaway Lock" }
        ],
        highlights: [
          { icon: "🏭", title: "Industrial Noise Immunity", desc: "Uses 4-20mA current loops with broken-wire detection across kilometer-long cables." },
          { icon: "🌡️", title: "Thermal Runaway Trip", desc: "Automatically triggers emergency cooling when kiln temperature exceeds safety limits." },
          { icon: "⚡", title: "Continuous DMA Sampling", desc: "Samples 4 sensor channels non-stop without blocking the microcontroller CPU." }
        ],
        steps: [
          { num: "01", title: "Current Loop Read", desc: "Converts 4-20mA sensor signal to 12-bit digital." },
          { num: "02", title: "Safety Threshold", desc: "Verifies temperature and gas levels in real-time." },
          { num: "03", title: "SCADA Broadcast", desc: "Transmits RS-485 Modbus telemetry to control room." }
        ]
      };
    case 'proj-rtos-swarm':
      return {
        badge: "Real-Time Embedded Drone Flight Controller",
        tagline: "Deterministic flight controller firmware running on FreeRTOS that coordinates autonomous drone swarms over long-range radio mesh without GPS.",
        stats: [
          { label: "Loop Frequency", value: "1000 Hz", desc: "<1.2 μs Timer Jitter" },
          { label: "Radio Range", value: "2.4 km", desc: "Decentralized LoRa Mesh" },
          { label: "Packet Loss", value: "0.02%", desc: "Leader-Follower Swarm" }
        ],
        highlights: [
          { icon: "⏱️", title: "1kHz Real-Time Loop", desc: "Hard real-time FreeRTOS task scheduling ensuring rock-solid flight stability." },
          { icon: "🛰️", title: "Decentralized LoRa Mesh", desc: "Communicates drone positions peer-to-peer without relying on Wi-Fi or cellular." },
          { icon: "🔄", title: "Kalman Sensor Fusion", desc: "Merges gyro, accelerometer, and barometer data for accurate 3D attitude holding." }
        ],
        steps: [
          { num: "01", title: "Sensor Fusion", desc: "Kalman filter estimates 6-DOF orientation at 1kHz." },
          { num: "02", title: "PID Motor Control", desc: "Adjusts 4 brushless motor thrust levels." },
          { num: "03", title: "Swarm Mesh Sync", desc: "Shares position telemetry with peer drones." }
        ]
      };
    default:
      return null;
  }
};

export default function ClientPage({ navItems, coreAreas, skillGroups, experience, education, certifications, projects, journey }: ClientPageProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-facegate");
  const [projectDisplayMode, setProjectDisplayMode] = useState<"overview" | "lab">("overview");
  const [projectCategory, setProjectCategory] = useState<string>("All");
  const [expandedEducation, setExpandedEducation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  // Keep server HTML and the first browser render identical. The layout's
  // pre-paint script applies the saved/system theme before hydration.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);
  const [spotlightMessage, setSpotlightMessage] = useState<string | null>(null);
  const router = useRouter();
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
    localStorage.setItem("theme", newTheme);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("prathmeshnarwaria@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Throttled scroll listener with robust offset tracking
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = navItems
            .map(({ sectionId }) => document.getElementById(sectionId))
            .filter((element): element is HTMLElement => element !== null);

          let currentActive = activeSectionRef.current;
          const scrollPosition = window.scrollY + window.innerHeight * 0.35;

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
              currentActive = section.id;
              break;
            }
          }

          if (currentActive !== activeSectionRef.current) {
            setActiveSection(currentActive);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems]);

  const handleSelectProjectFromChip = (projectId: string) => {
    setActiveSection("projects");
    setActiveProjectId(projectId);
    setProjectCategory("All");
    setTimeout(() => {
      const projSection = document.getElementById('projects');
      if (projSection) {
        projSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleSkillClick = (skillName: string) => {
    setSelectedSkillFilter(skillName);
    const matchingProject = projects.find(p => p.stack.some((s: string) => s.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.toLowerCase())));
    
    setSpotlightMessage(`Spotlight: Filtering work matching '${skillName}'`);
    setTimeout(() => setSpotlightMessage(null), 3000);

    if (matchingProject) {
      handleSelectProjectFromChip(matchingProject.id);
    } else {
      const projSection = document.getElementById('projects');
      if (projSection) {
        projSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((project) => {
    if (selectedSkillFilter) {
      const hasSkill = project.stack.some((s: string) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()) || selectedSkillFilter.toLowerCase().includes(s.toLowerCase()));
      if (hasSkill) return true;
    }
    if (projectCategory === "All") return true;
    if (projectCategory === "Linux & Security") {
      return ["proj-facegate", "proj-codewriter", "proj-prag"].includes(project.id);
    }
    if (projectCategory === "Local AI & RAG") {
      return ["proj-prag"].includes(project.id);
    }
    if (projectCategory === "Embedded & RTOS") {
      return ["proj-hzl", "proj-rtos-swarm"].includes(project.id);
    }
    return true;
  });

  return (
    <main className="portfolio-shell">

      {/* Floating Skill Spotlight Toast */}
      <AnimatePresence>
        {spotlightMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-black/90 backdrop-blur-md border border-[var(--line)] text-[var(--cyan)] text-xs font-mono px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <span>{spotlightMessage}</span>
            <button 
              onClick={() => {
                setSelectedSkillFilter(null);
                setSpotlightMessage(null);
              }}
              className="ml-2 text-white/50 hover:text-white text-xs underline"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Top Navigation Bar */}
      <header className="main-header">
        <div className="header-container">
          <a className="header-brand" href="#home">
            <span className="header-logo">PN</span>
            <div className="header-title-group">
              <span className="header-name">Prathmesh Narwaria</span>
              <span className="header-subtitle">Embedded + Software Systems</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="header-nav hidden md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.sectionId}`}
                className={activeSection === item.sectionId ? "header-nav-link active" : "header-nav-link"}
                onClick={() => setActiveSection(item.sectionId)}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <a
              href="https://github.com/ScaraMouche-Wanderer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} color="var(--amber)" /> : <Moon size={18} color="var(--cyan)" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating HUD Bottom Bar */}
      <nav 
        className="mobile-bottom-nav fixed bottom-3 z-40 bg-[var(--panel)]/95 backdrop-blur-md border border-[var(--line)] rounded-full px-3 py-1.5 flex items-center gap-1 shadow-2xl md:hidden"
        aria-label="Mobile Navigation"
      >
        {[
          { id: "home", icon: <Home size={16} />, label: "Home" },
          { id: "about", icon: <User size={16} />, label: "Focus" },
          { id: "skills", icon: <Cpu size={16} />, label: "Skills" },
          { id: "projects", icon: <Rocket size={16} />, label: "Systems" },
          { id: "experience", icon: <Briefcase size={16} />, label: "Exp" },
          { id: "contact", icon: <Mail size={16} />, label: "Contact" }
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              activeSection === item.id 
                ? "bg-cyan-500/20 text-[var(--cyan)] border border-cyan-500/30" 
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-xs font-semibold">{item.label}</span>
          </a>
        ))}
      </nav>

      <StudioHero onSelectProject={handleSelectProjectFromChip} />

      {/* ABOUT ME */}
      <div className="section-flow-bridge" />
      <section id="about" className="content-section">
        <SectionTitle
          eyebrow="About Me"
          title="Engineering Focus"
          description="Bridging the gap between silicon-level hardware, real-time embedded firmware, and modern web software."
        />

        <div className="bento-grid">
          {coreAreas.map((area, index) => {
            const getAreaIcon = (title: string) => {
              if (title.toLowerCase().includes("embedded")) return <Cpu size={22} className="text-cyan-400" />;
              if (title.toLowerCase().includes("web")) return <Server size={22} className="text-lime-400" />;
              if (title.toLowerCase().includes("hardware")) return <Radio size={22} className="text-amber-400" />;
              return <Shield size={22} className="text-purple-400" />;
            };

            return (
              <motion.article
                key={area.title}
                className="bento-card circuit-runner-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {getAreaIcon(area.title)}
                  </div>
                  <h3 style={{ margin: 0 }}>{area.title}</h3>
                </div>
                <p className="bento-blurb">{area.blurb}</p>
                <ul className="bento-list">
                  {area.points.map((point: string) => (
                    <li key={point}>
                      <span className="bullet-dot" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* SKILLS */}
      <div className="section-flow-bridge" />
      <section id="skills" className="content-section">
        <SectionTitle
          compact
          eyebrow="Skills"
          title="Technical Proficiency"
          description="Click any core skill below to instantly spotlight matching projects and real-world implementations."
        />

        {/* Primary Stack Quick Filters */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span className="featured-pill font-mono text-xs">Primary Core Stack &bull; Click to Probe Work</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {["C / C++", "FreeRTOS", "STM32 / ESP32", "Rust", "WebAssembly", "React / Next.js", "Python", "Linux Security"].map((item) => {
              const isSelected = selectedSkillFilter === item;
              return (
                <button
                  key={item}
                  onClick={() => handleSkillClick(item)}
                  style={{ 
                    fontSize: '0.92rem', 
                    fontWeight: 600, 
                    color: isSelected ? 'var(--cyan)' : 'var(--foreground)',
                    background: isSelected ? 'rgba(88, 196, 182, 0.15)' : 'var(--panel)',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '2rem',
                    border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--line)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(88, 196, 182, 0.25)' : 'none'
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Card Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillGroups.map((group, index) => {
            const getGroupIcon = (name: string) => {
              if (name.toLowerCase().includes("lang")) return <Code size={20} className="text-cyan-400" />;
              if (name.toLowerCase().includes("embed")) return <Cpu size={20} className="text-amber-400" />;
              if (name.toLowerCase().includes("web")) return <Server size={20} className="text-lime-400" />;
              if (name.toLowerCase().includes("proto")) return <Radio size={20} className="text-cyan-400" />;
              return <Shield size={20} className="text-purple-400" />;
            };

            return (
              <motion.div
                key={group.name}
                className="p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] backdrop-blur-md flex flex-col justify-between circuit-runner-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        {getGroupIcon(group.name)}
                      </div>
                      <h3 className="text-lg font-bold text-white m-0">{group.name}</h3>
                    </div>
                    
                    {/* Quantum Reticle Index Badge */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 quantum-reticle-outer" />
                      <div className="absolute inset-1 rounded-full border border-dotted border-cyan-400/30 quantum-reticle-inner" />
                      <span className="font-mono text-xs text-cyan-400 font-bold relative z-10">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item: string) => {
                      const isMatched = selectedSkillFilter === item;
                      return (
                        <button
                          key={item}
                          onClick={() => handleSkillClick(item)}
                          className={`text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 border cursor-pointer ${
                            isMatched
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(88,196,182,0.4)]"
                              : "bg-white/[0.03] text-slate-300 border-white/10 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/5"
                          }`}
                          title={`Click to filter work with ${item}`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <div className="section-flow-bridge" />
      <section id="education" className="content-section">
        <SectionTitle
          eyebrow="Education"
          title="Academic Background & Certifications"
          description="Where I studied, foundational milestones, and specialized engineering certifications."
        />

        <div className="timeline-container relative">
          <div className="timeline-spine-laser" />
          {education.map((edu, index) => {
            const isExpanded = expandedEducation === edu.id;
            return (
              <motion.div
                key={edu.id}
                className={`timeline-item ${isExpanded ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                onClick={() => setExpandedEducation(isExpanded ? null : edu.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="timeline-marker" style={isExpanded ? { background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan)' } : {}} />
                <div className="timeline-content circuit-runner-card holographic-badge" style={{ 
                  paddingBottom: isExpanded ? '2rem' : '1.75rem', 
                  transition: 'all 0.3s ease',
                  background: isExpanded ? 'rgba(56, 189, 248, 0.06)' : 'var(--panel)',
                  border: isExpanded ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid var(--line)',
                  borderRadius: '1.25rem',
                  padding: '2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '0.75rem', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.45rem', color: 'var(--foreground)', margin: 0, fontWeight: 700 }}>{edu.degree}</h3>
                    <span style={{ color: 'var(--cyan)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono, monospace)' }}>{edu.duration}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--foreground)', fontWeight: 600, marginBottom: '0.6rem', margin: 0 }}>{edu.college}</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ color: 'var(--lime)', fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                      {edu.cgpa.includes('%') ? 'Percentage' : 'Cumulative CGPA'}: {edu.cgpa}
                    </p>
                    
                    <div style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                      <span>{isExpanded ? 'Collapse Coursework' : 'Expand Coursework'}</span>
                      <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--line)', marginTop: '0.75rem' }}>
                      <p style={{ color: 'var(--foreground)', lineHeight: '1.75', marginBottom: '1.4rem', fontWeight: 400, fontSize: '1.02rem' }}>{edu.description}</p>
                      
                      {/* Interactive SGPA Graph for B.Tech */}
                      {(edu.id === 'edu-1' || edu.degree.toLowerCase().includes('b.tech')) && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <SGPAGraph isCompact />
                        </div>
                      )}

                      {edu.subjects && edu.subjects.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: '0.75rem', fontWeight: 700 }}>
                            Core Coursework & Specialized Subjects
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {edu.subjects.map((subject: string) => (
                              <span key={subject} style={{
                                fontSize: '0.88rem',
                                color: 'var(--foreground)',
                                border: '1px solid var(--line)',
                                padding: '0.4rem 0.95rem',
                                borderRadius: '2rem',
                                background: 'rgba(255,255,255,0.06)',
                                fontWeight: 600
                              }}>{subject}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        {edu.hasDeepDive && (
                          <button 
                            className="reactive-button primary"
                            style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/education/${edu.id}`);
                            }}
                          >
                            <span>Academic Deep Dive & Performance →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <>
            <h3 style={{ marginTop: '3.5rem', marginBottom: '1.5rem', color: 'var(--foreground)', fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap size={22} color="var(--cyan)" /> Specialized NPTEL & SWAYAM Certifications
            </h3>
            <div className="timeline-container relative">
              <div className="timeline-spine-laser" />
              {certifications.map((cert: CertificationType, index: number) => (
                <motion.div
                  key={cert.id}
                  className="timeline-item"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                >
                  <div className="timeline-marker" style={{ background: 'var(--cyan)' }} />
                  <div className="timeline-content circuit-runner-card holographic-badge" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '1.25rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '0.5rem', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.45rem', color: 'var(--foreground)', margin: 0, fontWeight: 700 }}>{cert.name}</h3>
                      <span style={{ color: 'var(--cyan)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono, monospace)' }}>{cert.date}</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--foreground)', fontWeight: 600, marginBottom: '1.25rem' }}>{cert.issuer}</h4>
                    
                    {cert.hasDeepDive && (
                      <div>
                        <button 
                          className="reactive-button primary"
                          onClick={() => router.push(`/certification/${cert.id}`)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
                        >
                          <span>View 4 Specializations & Certificates</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* EXPERIENCE */}
      <div className="section-flow-bridge" />
      <section id="experience" className="content-section">
        <SectionTitle
          eyebrow="Experience"
          title="Professional Engineering Timeline"
          description="Where I've applied my skills in industrial smelting and software engineering environments."
        />

        <div className="timeline-container relative">
          <div className="timeline-spine-laser" />
          {experience.map((exp, index) => {
            const isFeatured = exp.company.toLowerCase().includes('hindustan zinc');
            return (
              <motion.div
                key={exp.id}
                className="timeline-item"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
              >
                <div className="timeline-marker" style={isFeatured ? { background: 'var(--cyan)', boxShadow: '0 0 15px var(--cyan)' } : {}} />
                <div className={`timeline-content circuit-runner-card ${isFeatured ? 'ecg-grid-overlay' : ''}`} style={isFeatured ? {
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.09) 0%, rgba(111, 255, 233, 0.04) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 12px 45px -10px rgba(56, 189, 248, 0.18)',
                  borderRadius: '1.25rem',
                  padding: '2.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                } : { background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '1.25rem', padding: '2.25rem' }}>
                  
                  {/* Subtle Oscilloscope Waveform Background for Industrial Card */}
                  {isFeatured && (
                    <svg className="absolute top-0 right-0 w-80 h-32 opacity-20 pointer-events-none" viewBox="0 0 300 100" fill="none">
                      <path d="M0,50 L60,50 L75,20 L90,80 L105,10 L120,70 L135,50 L300,50" stroke="#38bdf8" strokeWidth="2" />
                    </svg>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '0.75rem', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--foreground)', margin: 0, fontWeight: 700 }}>{exp.role}</h3>
                    <span style={{ color: 'var(--cyan)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono, monospace)' }}>{exp.duration}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--foreground)', fontWeight: 600, margin: 0 }}>{exp.company}</h4>
                    {isFeatured && (
                      <span className="radar-emitter" style={{ 
                        fontSize: '0.85rem', 
                        background: 'rgba(56, 189, 248, 0.15)', 
                        color: 'var(--cyan)', 
                        padding: '0.35rem 0.9rem', 
                        borderRadius: '2rem', 
                        border: '1px solid rgba(56, 189, 248, 0.35)', 
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}>
                        World&apos;s Largest Single Smelting Complex
                      </span>
                    )}
                  </div>
                  
                  {exp.achievement && (
                    <div className="achievement-box" style={{ marginBottom: '1.25rem' }}>
                      <p style={{ color: 'var(--foreground)', margin: 0, fontSize: '0.98rem', lineHeight: 1.6, fontWeight: 500 }}>
                        {exp.achievement}
                      </p>
                    </div>
                  )}
                  
                  <p style={{ color: 'var(--foreground)', lineHeight: '1.75', marginBottom: '1.4rem', fontWeight: 400, fontSize: '1.02rem' }}>{exp.description}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: isFeatured ? '1.75rem' : '0' }}>
                    {exp.stack.map((item: string) => (
                      <span 
                        key={item} 
                        onClick={() => handleSkillClick(item)}
                        style={{
                          fontSize: '0.88rem',
                          color: 'var(--foreground)',
                          border: '1px solid var(--line)',
                          padding: '0.4rem 0.95rem',
                          borderRadius: '2rem',
                          background: 'rgba(255,255,255,0.06)',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={`Filter work using ${item}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  
                  {isFeatured && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button 
                        className="reactive-button primary"
                        style={{ fontSize: '0.92rem', padding: '0.75rem 1.4rem', gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}
                        onClick={() => handleSelectProjectFromChip('proj-hzl')}
                      >
                        <Rocket size={16} />
                        <span>Inspect HZL Sensor Project ↗</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SEAMLESS PROJECT STUDIO SECTION */}
      <div className="section-flow-bridge" />

      <section id="projects" className="content-section" style={{ position: 'relative' }}>
        <SectionTitle
          eyebrow="Engineered Systems"
          title="Featured Engineering Projects"
          description="Explore high-reliability systems built for Linux desktop security, hardware automation, offline local AI, and industrial IoT."
        />

        {(() => {
          const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];
          const currentIndex = projects.findIndex(p => p.id === activeProjectId);
          const currentMeta = getProjectMeta(currentProject.id);
          const currentAccent = currentMeta.color;
          const cleanData = getCleanProjectData(currentProject.id);

          return (
            <div className="seamless-studio-deck circuit-runner-card" style={{
              border: `1px solid ${currentAccent}`,
              boxShadow: `0 20px 60px -15px rgba(0,0,0,0.8), 0 0 35px -10px ${currentAccent}25`,
              borderRadius: '1.5rem',
              overflow: 'hidden'
            }}>
              {/* Top Bar: Live System Beacon & View Mode Switcher */}
              <div style={{
                padding: '1.1rem 1.75rem',
                background: 'rgba(0,0,0,0.5)',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                {/* System Name with pulsing dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: currentAccent, boxShadow: `0 0 10px ${currentAccent}` }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    {currentProject.title}
                  </span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: currentAccent,
                    background: `${currentAccent}15`,
                    border: `1px solid ${currentAccent}40`,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '1rem',
                    fontWeight: 700
                  }}>
                    {cleanData?.badge || currentProject.tag}
                  </span>
                </div>

                {/* View Mode Switcher: Overview vs Interactive Lab */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--line)',
                  borderRadius: '2rem',
                  padding: '3px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setProjectDisplayMode("overview")}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      position: 'relative',
                      zIndex: 2,
                      transition: 'color 0.2s ease',
                      background: 'transparent',
                      color: projectDisplayMode === "overview" ? '#05080c' : 'var(--foreground)'
                    }}
                  >
                    {projectDisplayMode === "overview" && (
                      <motion.div
                        layoutId="view-mode-pill-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '2rem',
                          background: currentAccent,
                          zIndex: -1,
                          boxShadow: `0 0 15px ${currentAccent}50`
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    ✨ Simple Overview
                  </button>
                  <button
                    onClick={() => setProjectDisplayMode("lab")}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      position: 'relative',
                      zIndex: 2,
                      transition: 'color 0.2s ease',
                      background: 'transparent',
                      color: projectDisplayMode === "lab" ? '#05080c' : 'var(--foreground)'
                    }}
                  >
                    {projectDisplayMode === "lab" && (
                      <motion.div
                        layoutId="view-mode-pill-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '2rem',
                          background: currentAccent,
                          zIndex: -1,
                          boxShadow: `0 0 15px ${currentAccent}50`
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    💻 Interactive Lab
                  </button>
                </div>
              </div>

              {/* System Switcher Rail with Morphing Spring Pill */}
              <div className="seamless-rail-container" style={{ background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                {projects.map((p) => {
                  const isSelected = p.id === activeProjectId;
                  const meta = getProjectMeta(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setProjectDisplayMode("overview");
                      }}
                      className={`seamless-rail-btn ${isSelected ? 'active' : ''}`}
                      style={{
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="project-tab-active-bg"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '1rem',
                            background: `rgba(255, 255, 255, 0.08)`,
                            border: `1px solid ${meta.color}60`,
                            boxShadow: `0 0 20px ${meta.color}25`,
                            zIndex: -1
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        />
                      )}
                      <div style={{
                        padding: '0.45rem',
                        borderRadius: '0.6rem',
                        background: isSelected ? `${meta.color}25` : 'rgba(255,255,255,0.05)',
                        color: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                      }}>
                        {meta.icon}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--foreground)' }}>
                          {p.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)' }}>
                          <span style={{ color: meta.color, fontWeight: 700 }}>{meta.status}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main Content Stage */}
              <div className="seamless-stage-body" style={{ padding: '2rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeProjectId}-${projectDisplayMode}`}
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.99 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {projectDisplayMode === "overview" && cleanData ? (
                      <div>
                        {/* 2-Column Responsive Layout */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                          gap: '2rem',
                          alignItems: 'stretch',
                          marginBottom: '2rem'
                        }}>
                          {/* Left Column: Plain-English Problem/Solution & 3 Key Highlights */}
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              {/* Tagline */}
                              <p style={{
                                fontSize: '1.18rem',
                                lineHeight: '1.6',
                                color: '#f8fafc',
                                fontWeight: 500,
                                margin: '0 0 1.5rem 0'
                              }}>
                                {cleanData.tagline}
                              </p>

                              {/* 3 Key Highlights */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                                {cleanData.highlights.map((h, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    whileHover={{ x: 4 }}
                                    style={{
                                      display: 'flex',
                                      gap: '0.85rem',
                                      alignItems: 'flex-start',
                                      padding: '0.85rem 1rem',
                                      borderRadius: '0.75rem',
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      transition: 'border-color 0.2s ease'
                                    }}
                                  >
                                    <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>{h.icon}</span>
                                    <div>
                                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>
                                        {h.title}
                                      </span>
                                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.45', display: 'block' }}>
                                        {h.desc}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Tech Stack Chips */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {currentProject.stack.map((tech: string) => (
                                  <span key={tech} style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-mono, monospace)',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: '2rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--line)',
                                    color: 'var(--foreground)'
                                  }}>
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <button
                                onClick={() => setProjectDisplayMode("lab")}
                                style={{
                                  padding: '0.65rem 1.3rem',
                                  borderRadius: '2rem',
                                  background: currentAccent,
                                  border: `1px solid ${currentAccent}`,
                                  color: '#05080c',
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  boxShadow: `0 0 20px ${currentAccent}40`,
                                  transition: 'transform 0.15s ease'
                                }}
                              >
                                <Zap size={15} />
                                <span>Try Interactive Live Demo</span>
                              </button>

                              <button
                                onClick={() => router.push(`/project/${currentProject.id}`)}
                                className="reactive-button secondary"
                                style={{
                                  padding: '0.65rem 1.25rem',
                                  fontSize: '0.88rem',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                <span>Deep Dive</span>
                                <ArrowRight size={14} />
                              </button>

                              {currentProject.repoUrl && (
                                <a
                                  href={currentProject.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '2rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--line)',
                                    color: 'var(--foreground)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <GithubIcon size={15} />
                                  <span>GitHub</span>
                                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Visual Stat Cards & 3-Step Execution Flow */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            background: 'rgba(0,0,0,0.35)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}>
                            {/* 3 Large Metric Badges */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                              {cleanData.stats.map((s, idx) => (
                                <div key={idx} style={{
                                  padding: '0.85rem 0.75rem',
                                  borderRadius: '0.75rem',
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  textAlign: 'center'
                                }}>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: '0.25rem' }}>
                                    {s.label}
                                  </span>
                                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: currentAccent, display: 'block', marginBottom: '0.15rem' }}>
                                    {s.value}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>
                                    {s.desc}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* 3-Step Visual Execution Flow */}
                            <div>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: currentAccent,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-mono, monospace)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                marginBottom: '0.85rem'
                              }}>
                                <Activity size={14} /> How It Works &bull; 3-Step Execution
                              </span>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cleanData.steps.map((st, idx) => (
                                  <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.85rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.65rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                  }}>
                                    <span style={{
                                      fontFamily: 'var(--font-mono, monospace)',
                                      fontSize: '0.85rem',
                                      fontWeight: 800,
                                      color: currentAccent,
                                      background: `${currentAccent}18`,
                                      padding: '0.25rem 0.55rem',
                                      borderRadius: '0.4rem',
                                      border: `1px solid ${currentAccent}40`
                                    }}>
                                      {st.num}
                                    </span>
                                    <div>
                                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                                        {st.title}
                                      </span>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>
                                        {st.desc}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Interactive Lab View */
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.88rem', color: currentAccent, fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>
                            LIVE INTERACTIVE SIMULATOR &bull; {currentProject.title}
                          </span>
                          <button
                            onClick={() => setProjectDisplayMode("overview")}
                            style={{
                              padding: '0.4rem 0.95rem',
                              borderRadius: '2rem',
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid var(--line)',
                              color: 'var(--foreground)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            ← Back to Clean Overview
                          </button>
                        </div>

                        {/* Interactive Simulator */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          {activeProjectId === 'proj-facegate' && <FaceGateShowcase />}
                          {activeProjectId === 'proj-codewriter' && <CodeWriterShowcase />}
                          {activeProjectId === 'proj-prag' && <PragShowcase />}
                          {activeProjectId === 'proj-hzl' && <HzlShowcase />}
                          {activeProjectId === 'proj-rtos-swarm' && <AeroMeshShowcase />}
                        </div>
                      </div>
                    )}

                    {/* Navigation Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--line)',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <button
                        onClick={() => {
                          const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
                          setActiveProjectId(projects[prevIdx].id);
                          setProjectDisplayMode("overview");
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1.1rem',
                          borderRadius: '2rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--line)',
                          color: 'var(--foreground)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <span>← Previous System</span>
                      </button>

                      {/* Dot Step Indicators */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {projects.map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setActiveProjectId(p.id);
                              setProjectDisplayMode("overview");
                            }}
                            style={{
                              width: idx === currentIndex ? '24px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              background: idx === currentIndex ? currentAccent : 'rgba(255,255,255,0.2)',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            title={p.title}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          const nextIdx = (currentIndex + 1) % projects.length;
                          setActiveProjectId(projects[nextIdx].id);
                          setProjectDisplayMode("overview");
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1.1rem',
                          borderRadius: '2rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--line)',
                          color: 'var(--foreground)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <span>Next System →</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          );
        })()}
      </section>

      {/* JOURNEY */}
      <div className="section-flow-bridge" />
      <section id="journey" className="content-section">
        <SectionTitle
          eyebrow="Journey"
          title="Direction of Growth"
          description="Developing as an engineer who moves seamlessly between low-level hardware understanding and high-performance software implementation."
        />

        <div className="narrative-container">
          {journey.map((step) => (
            <motion.p
              key={step.title}
              className="narrative-paragraph"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 font-bold text-cyan-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 radar-emitter inline-block" />
                {step.year} &mdash;
              </span>{" "}
              {step.text}
            </motion.p>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <div className="section-flow-bridge" />
      <section id="contact" className="content-section contact-section">
        <SectionTitle
          eyebrow="Contact"
          title="Let’s Build Something Reliable"
          description="Always open for opportunities in embedded systems, IoT engineering, firmware, and software engineering."
        />

        <div className="contact-panel">
          <div className="contact-left-col">
            <motion.div 
              className="contact-card circuit-runner-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              <div className="contact-card-icon radar-emitter">
                <Mail size={24} />
              </div>
              <div style={{ wordBreak: 'break-all' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem', fontWeight: 700 }}>Direct Email</h4>
                <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)' }}>prathmeshnarwaria@gmail.com</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <a href="mailto:prathmeshnarwaria@gmail.com" className="minimal-link" style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  Send Email <ExternalLink size={15} />
                </a>
                <button 
                  onClick={handleCopyEmail}
                  className="minimal-link" 
                  style={{ fontSize: '0.92rem', border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: copiedEmail ? 'var(--lime)' : 'var(--cyan)', fontWeight: 600 }}
                >
                  {copiedEmail ? "Copied to Clipboard!" : "Copy Email"} {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="contact-card circuit-runner-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="contact-card-icon radar-emitter">
                <MapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem', fontWeight: 700 }}>Location</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--foreground)' }}>Jaipur & Udaipur, India</p>
                <div style={{ marginTop: '0.6rem', fontSize: '0.88rem', color: 'var(--lime)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  Available for Full-Time & Relocation <span className="w-2 h-2 rounded-full bg-lime-400 radar-emitter inline-block" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-card horizontal full-width circuit-runner-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="contact-card-icon" style={{ flexShrink: 0 }}>
                <Code size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem', fontWeight: 700 }}>Open Source Repositories</h4>
                <p style={{ fontSize: '1rem', color: 'var(--foreground)', opacity: 0.85, margin: 0 }}>Explore my firmware modules, RTOS tasks, and Linux software builds.</p>
              </div>
              <a href="https://github.com/ScaraMouche-Wanderer" target="_blank" rel="noreferrer" className="reactive-button secondary" style={{ minWidth: 'auto', padding: '0.65rem 1.4rem', fontSize: '0.92rem', fontWeight: 600 }}>
                <span>GitHub ↗</span>
              </a>
            </motion.div>

            <motion.div 
              className="contact-card horizontal full-width circuit-runner-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="contact-card-icon" style={{ flexShrink: 0 }}>
                <Users size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem', fontWeight: 700 }}>Professional Network</h4>
                <p style={{ fontSize: '1rem', color: 'var(--foreground)', opacity: 0.85, margin: 0 }}>Connect with me for engineering collaborations and opportunities.</p>
              </div>
              <a href="https://linkedin.com/in/prathmesh-narwaria" target="_blank" rel="noreferrer" className="reactive-button secondary" style={{ minWidth: 'auto', padding: '0.65rem 1.4rem', fontSize: '0.92rem', fontWeight: 600 }}>
                <span>LinkedIn ↗</span>
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-col">
            <div className="circuit-runner-card" style={{ 
              background: 'var(--panel)', 
              padding: '2.5rem', 
              borderRadius: '1.25rem', 
              border: '1px solid var(--line)', 
              backdropFilter: 'blur(10px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {submitStatus === "success" ? (
                <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--cyan)", height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(111,255,233,0.1)', border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={26} color="var(--cyan)" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--foreground)', fontWeight: 700 }}>Transmission Received</h3>
                  <p style={{ color: 'var(--foreground)', opacity: 0.85, fontSize: '1rem', margin: 0 }}>Thanks for reaching out! I&apos;ll get back to you shortly.</p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="reactive-button secondary"
                    style={{ marginTop: '1.25rem', padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form 
                  action={async (formData) => {
                    setIsSubmitting(true);
                    setErrorMessage(null);
                    try {
                      const result = await submitContactForm(formData);
                      setIsSubmitting(false);
                      if (result.success) {
                        setSubmitStatus("success");
                      } else {
                        setSubmitStatus("error");
                        setErrorMessage(result.error || "Transmission failed. Please try again.");
                      }
                    } catch {
                      setIsSubmitting(false);
                      setSubmitStatus("error");
                      setErrorMessage("A network error occurred. Please check your connection.");
                    }
                  }} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', height: '100%' }}
                >
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 700, letterSpacing: '1px', fontFamily: 'var(--font-mono, monospace)' }}>NAME</label>
                    <input name="name" type="text" required placeholder="Your Name" className="form-input" style={{ 
                      background: 'rgba(255,255,255,0.04)', 
                      border: '1px solid var(--line)',
                      borderRadius: '0.75rem',
                      padding: '0.95rem 1.1rem',
                      color: 'var(--foreground)',
                      fontSize: '1rem',
                      outline: 'none',
                      width: '100%'
                    }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 700, letterSpacing: '1px', fontFamily: 'var(--font-mono, monospace)' }}>EMAIL</label>
                    <input name="email" type="email" required placeholder="your.email@company.com" className="form-input" style={{ 
                      background: 'rgba(255,255,255,0.04)', 
                      border: '1px solid var(--line)',
                      borderRadius: '0.75rem',
                      padding: '0.95rem 1.1rem',
                      color: 'var(--foreground)',
                      fontSize: '1rem',
                      outline: 'none',
                      width: '100%'
                    }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--foreground)', fontWeight: 700, letterSpacing: '1px', fontFamily: 'var(--font-mono, monospace)' }}>MESSAGE</label>
                    <textarea name="message" required placeholder="Tell me about your project, idea, or role..." className="form-textarea" style={{ 
                      background: 'rgba(255,255,255,0.04)', 
                      border: '1px solid var(--line)',
                      borderRadius: '0.75rem',
                      padding: '0.95rem 1.1rem',
                      color: 'var(--foreground)',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'none',
                      width: '100%',
                      flex: 1,
                      minHeight: '120px'
                    }} />
                  </div>

                  {errorMessage && (
                    <div style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`reactive-button primary ${isSubmitting ? 'loading' : ''}`}
                    style={{ width: '100%', marginTop: '0.5rem', border: 'none', cursor: 'pointer', padding: '1.05rem', fontSize: '0.98rem' }}
                  >
                    <span style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}>
                      {isSubmitting ? 'Encrypting & Sending...' : 'Initiate Transmission →'}
                    </span>
                  </button>

                  {submitStatus === "error" && (
                    <p style={{ color: 'var(--orange)', fontSize: '0.92rem', textAlign: 'center', margin: '0.5rem 0 0 0', fontWeight: 600 }}>
                      {errorMessage || "Transmission failed. Please try again."}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
