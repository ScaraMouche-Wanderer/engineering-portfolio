import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import DetailParticleWrapper from "@/components/DetailParticleWrapper";
import SGPAGraph from "@/components/SGPAGraph";
import { ArrowLeft, GraduationCap, BookOpen, Trophy, Building2, Calendar, Award } from "lucide-react";

export default async function EducationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const eduData = await prisma.education.findUnique({
    where: { id },
    include: { subjects: true, cocurricular: true }
  });

  if (!eduData) {
    return redirect('/#education');
  }

  const education = {
    ...eduData,
    subjects: eduData.subjects.map(s => s.name),
    cocurricular: eduData.cocurricular.map(c => c.text)
  };

  const isBTech = education.degree.toLowerCase().includes("b.tech") || education.id === "edu-1";

  return (
    <main className="portfolio-shell" style={{ minHeight: '100vh', padding: '8vh 5vw 12vh 5vw' }}>
      <DetailParticleWrapper />
      <div className="ambient ambient-one" />
      <div className="grid-overlay" />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '3rem' }}>
          <Link href="/#education" style={{ 
            color: 'var(--cyan)', 
            textDecoration: 'none', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            background: 'var(--panel)',
            padding: '0.6rem 1.2rem',
            borderRadius: '2rem',
            border: '1px solid var(--line)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}>
            <ArrowLeft size={16} /> Back to Education
          </Link>
        </div>
        
        {/* Header Block */}
        <div style={{ maxWidth: '850px', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <GraduationCap size={18} color="var(--cyan)" />
            <span style={{ 
              color: 'var(--cyan)', 
              fontSize: '0.85rem', 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600
            }}>
              Academic Milestone
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
            marginBottom: '1rem', 
            color: 'var(--foreground)', 
            letterSpacing: '-0.02em',
            fontWeight: 700,
            lineHeight: 1.15
          }}>
            {education.degree}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 500 }}>
              <Building2 size={18} color="var(--cyan)" /> {education.college}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--muted)', fontSize: '0.95rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} /> {education.duration}
              </span>
              <span>&bull;</span>
              <span style={{ color: 'var(--lime)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={15} /> {education.cgpa.includes('%') ? 'Percentage' : 'CGPA'}: {education.cgpa}
              </span>
            </div>
          </div>

          {education.description && (
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              {education.description}
            </p>
          )}
        </div>

        {/* B.Tech SGPA Performance Graph */}
        {isBTech && (
          <div style={{ marginBottom: '3rem' }}>
            <SGPAGraph />
          </div>
        )}

        {/* Coursework & Co-Curricular Bento Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>

          {education.subjects && education.subjects.length > 0 && (
            <div className="bento-card" style={{ 
              padding: '2.25rem', 
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '1.25rem',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} /> Core Coursework & Subjects
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {education.subjects.map((subject: string, idx: number) => (
                  <span key={idx} style={{
                    color: 'var(--foreground)',
                    fontSize: '0.88rem',
                    background: 'rgba(111, 255, 233, 0.05)',
                    border: '1px solid var(--line)',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontWeight: 500
                  }}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.cocurricular && education.cocurricular.length > 0 && (
            <div className="bento-card" style={{ 
              padding: '2.25rem', 
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '1.25rem',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--lime)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={18} /> Co-Curricular & Leadership
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {education.cocurricular.map((activity: string, idx: number) => (
                  <li key={idx} style={{ color: 'var(--muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', lineHeight: '1.5' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', marginTop: '0.5rem', flexShrink: 0 }}></span>
                    <span style={{ color: 'var(--foreground)' }}>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
