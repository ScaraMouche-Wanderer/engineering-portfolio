"use client";

import { ArrowDown, ArrowUpRight, Cpu, Shield, Sparkles } from "lucide-react";
import MicrochipVis from "./MicrochipVis";

interface StudioHeroProps {
  onSelectProject: (id: string) => void;
}

export default function StudioHero({ onSelectProject }: StudioHeroProps) {
  return (
    <section id="home" className="studio-home" aria-labelledby="studio-heading">
      <div className="studio-hero-grid">
        <div className="studio-intro">
          <p className="studio-eyebrow"><span /> Independent engineering / ScaraMouche-Wanderer</p>
          <h1 id="studio-heading">Between silicon<br />&amp; <em>software.</em></h1>
          <p className="studio-description">
            I build embedded systems, Linux tools, and local AI that connect
            low-level engineering to thoughtful interfaces.
          </p>
          <div className="studio-actions">
            <a href="#studio-work" className="studio-primary">Explore selected work <ArrowDown size={17} /></a>
            <a href="#contact" className="studio-secondary">Let&apos;s build something <ArrowUpRight size={17} /></a>
          </div>
          <div className="studio-disciplines" aria-label="Engineering disciplines">
            <span>Firmware &amp; RTOS</span><span>Linux systems</span><span>Local AI</span>
          </div>
        </div>
        <div className="studio-hardware">
          <div className="studio-diagram-caption"><span>FIG. 01 / THE SYSTEMS VIEW</span><span>INTERACTIVE</span></div>
          <MicrochipVis onSelectProject={onSelectProject} />
          <p className="studio-diagram-note">Hardware meets interface. Select a pin to explore the work.</p>
        </div>
      </div>

      <div id="studio-work" className="studio-work">
        <div className="studio-work-heading"><h2>Selected systems</h2><span>Ideas made tangible / 01—03</span></div>
        <div className="studio-work-grid">
          <a className="studio-project" href="https://github.com/ScaraMouche-Wanderer/Iot-Firewall-main" target="_blank" rel="noopener noreferrer">
            <div className="studio-project-top"><Shield size={20} /><span>01 / NETWORK SECURITY</span><ArrowUpRight size={17} /></div>
            <h3>IoT Firewall</h3>
            <p>ESP32 wireless threat detection, with a hardware-free dashboard demo.</p>
            <span className="studio-project-foot">C++ / ESP32 / WIDS <span>View source ↗</span></span>
          </a>
          <button className="studio-project" onClick={() => onSelectProject("proj-prag")}>
            <div className="studio-project-top"><Sparkles size={20} /><span>02 / LOCAL INTELLIGENCE</span><ArrowUpRight size={17} /></div>
            <h3>PRAG</h3>
            <p>Local research grounded in your documents, with a traceable evidence trail.</p>
            <span className="studio-project-foot">Python / Ollama / SQLite <span>Explore project ↗</span></span>
          </button>
          <button className="studio-project" onClick={() => onSelectProject("proj-rtos-swarm")}>
            <div className="studio-project-top"><Cpu size={20} /><span>03 / EMBEDDED SYSTEMS</span><ArrowUpRight size={17} /></div>
            <h3>AeroMesh</h3>
            <p>Real-time firmware architecture and an interactive flight-control simulation.</p>
            <span className="studio-project-foot">FreeRTOS / STM32 / C++ <span>Explore project ↗</span></span>
          </button>
        </div>
      </div>
    </section>
  );
}
