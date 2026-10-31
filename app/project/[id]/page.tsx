import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import BufferOverflowVisualizer from "@/components/BufferOverflowVisualizer";
import OTAManager from "@/components/OTAManager";
import AeroMeshSimulator from "@/components/AeroMeshSimulator";
import IndustrialSensorsVisualizer from "@/components/IndustrialSensorsVisualizer";
import FlightControllerVisualizer from "@/components/FlightControllerVisualizer";
import LoRaMeshVisualizer from "@/components/LoRaMeshVisualizer";
import DetailParticleWrapper from "@/components/DetailParticleWrapper";
import DocmentisViewerWrapper from "@/components/DocmentisViewerWrapper";
import FaceGateVisualizer from "@/components/FaceGateVisualizer";
import CodeWriterVisualizer from "@/components/CodeWriterVisualizer";
import PragVisualizer from "@/components/PragVisualizer";
import GithubIcon from "@/components/GithubIcon";
import { ArrowLeft, Cpu, Activity, ExternalLink, Shield, CheckCircle2, Zap } from "lucide-react";

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const projectData = await prisma.project.findUnique({
    where: { id },
    include: { stack: true }
  });

  if (!projectData) {
    return redirect('/#projects');
  }

  const project = {
    ...projectData,
    stack: projectData.stack.map(s => s.name)
  };

  return (
    <main className="portfolio-shell" style={{ minHeight: '100vh', padding: '8vh 5vw 12vh 5vw' }}>
      <DetailParticleWrapper />
      <div className="ambient ambient-one" />
      <div className="grid-overlay" />
      
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/#projects" style={{ 
            color: 'var(--cyan)', 
            textDecoration: 'none', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            background: 'var(--panel)',
            padding: '0.65rem 1.3rem',
            borderRadius: '2rem',
            border: '1px solid var(--line)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}>
            <ArrowLeft size={18} /> Back to Projects Studio
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--foreground)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--line)',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <GithubIcon size={16} />
                <span>GitHub Repository</span>
                <ExternalLink size={14} style={{ opacity: 0.6 }} />
              </a>
            )}

            <span style={{
              fontSize: '0.82rem',
              color: 'var(--cyan)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              background: 'rgba(56, 189, 248, 0.08)',
              padding: '0.55rem 0.95rem',
              borderRadius: '2rem',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              SYSTEM: {project.id.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Project Header */}
        <div style={{ maxWidth: '950px', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-block', 
            color: 'var(--cyan)', 
            fontSize: '0.92rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            marginBottom: '0.9rem' 
          }}>
            {project.tag}
          </span>
          <h1 className="glow-text" style={{ 
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
            marginBottom: '1.5rem', 
            color: '#ffffff', 
            letterSpacing: '-0.02em',
            fontWeight: 800,
            lineHeight: 1.15
          }}>
            {project.title}
          </h1>
          
          <div className="project-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>
            {project.stack.map((item: string) => (
              <span key={item} style={{ 
                background: 'rgba(255, 255, 255, 0.06)', 
                color: '#f8fafc', 
                border: '1px solid var(--line)',
                fontSize: '0.9rem',
                padding: '0.45rem 1.05rem',
                borderRadius: '2rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono, monospace)'
              }}>
                {item}
              </span>
            ))}
          </div>

          <p style={{ color: '#f8fafc', fontSize: '1.18rem', lineHeight: '1.75', fontWeight: 400 }}>
            {project.summary}
          </p>
        </div>

        {/* Dedicated Interactive Simulator Widget Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Zap size={20} color="var(--cyan)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
              Live Interactive Architecture & Hardware Simulator
            </h2>
          </div>

          {project.id === 'proj-facegate' ? (
            <FaceGateVisualizer />
          ) : project.id === 'proj-codewriter' ? (
            <CodeWriterVisualizer />
          ) : project.id === 'proj-prag' ? (
            <PragVisualizer />
          ) : project.id === 'proj-hzl' ? (
            <IndustrialSensorsVisualizer />
          ) : project.id === 'proj-rtos-swarm' ? (
            <AeroMeshSimulator />
          ) : project.id === 'proj-1' ? (
            <FlightControllerVisualizer />
          ) : project.id === 'proj-3' ? (
            <LoRaMeshVisualizer />
          ) : project.id === 'proj-4' ? (
            <BufferOverflowVisualizer />
          ) : project.id === 'proj-5' ? (
            <OTAManager />
          ) : project.id === 'proj-udoc' ? (
            <DocmentisViewerWrapper />
          ) : (
            <div style={{ 
              background: 'var(--panel)', 
              padding: '2.5rem', 
              borderRadius: '1.5rem', 
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--cyan)', fontWeight: 600 }}>System Overview</h2>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
                {project.summary}
              </p>
            </div>
          )}
        </div>

        {/* Engineering Impact & Architectural Specs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            background: 'var(--panel)',
            padding: '2.25rem',
            borderRadius: '1.25rem',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Activity size={20} /> Verified Engineering Impact
            </h3>
            <p style={{ color: '#f8fafc', lineHeight: '1.75', fontSize: '1.02rem', margin: 0 }}>
              {project.impact}
            </p>
          </div>

          <div style={{
            background: 'var(--panel)',
            padding: '2.25rem',
            borderRadius: '1.25rem',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Cpu size={20} /> Architecture & Low-Level Design
            </h3>
            <p style={{ color: '#f8fafc', lineHeight: '1.75', fontSize: '1.02rem', margin: 0 }}>
              Engineered with strict hardware constraints, deterministic loop timing, low memory footprint, and high-reliability fail-safes designed for mission-critical deployment.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
