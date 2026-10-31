import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import DetailParticleWrapper from "@/components/DetailParticleWrapper";
import { ArrowLeft, Award, ExternalLink, BookOpen, User, Calendar, CheckCircle2 } from "lucide-react";

interface SubCert {
  id: string;
  name: string;
  category: string;
  instructor?: string | null;
  description?: string | null;
  duration?: string | null;
  score?: string | null;
  certificateUrl?: string | null;
  date?: string | null;
}

export default async function CertificationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const certification = await prisma.certification.findUnique({
    where: { id },
    include: { subCertificates: true }
  });

  if (!certification || !certification.subCertificates) {
    return redirect('/#education');
  }

  const subCerts = certification.subCertificates as SubCert[];
  const categories = Array.from(new Set(subCerts.map((c) => c.category).filter(Boolean))) as string[];

  return (
    <main className="portfolio-shell" style={{ minHeight: '100vh', padding: '8vh 5vw 12vh 5vw' }}>
      <DetailParticleWrapper />
      <div className="ambient ambient-one" />
      <div className="grid-overlay" />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Top Back Navigation */}
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
            <ArrowLeft size={16} /> Back to Education & Certifications
          </Link>
        </div>
        
        {/* Header Block */}
        <div style={{ maxWidth: '850px', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <Award size={18} color="var(--cyan)" />
            <span style={{ 
              color: 'var(--cyan)', 
              fontSize: '0.85rem', 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600
            }}>
              {certification.issuer}
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
            {certification.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--muted)', fontSize: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} /> {certification.date}
            </span>
            <span>&bull;</span>
            <span style={{ color: 'var(--lime)', fontWeight: 500 }}>
              {subCerts.length} Verified Specializations
            </span>
          </div>
        </div>
        
        {/* Category-Grouped Bento Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {categories.map((category) => (
            <div key={category}>
              <h2 style={{ 
                color: 'var(--cyan)', 
                fontSize: '1.35rem', 
                marginBottom: '1.25rem', 
                borderBottom: '1px solid var(--line)', 
                paddingBottom: '0.75rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BookOpen size={18} /> {category}
              </h2>

              <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '1rem' }}>
                {subCerts.filter((c) => c.category === category).map((subCert) => (
                  <div key={subCert.id} className="bento-card" style={{ 
                    padding: '2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gridColumn: 'auto',
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: '1.25rem',
                    boxShadow: 'var(--shadow)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', margin: 0, fontWeight: 600, lineHeight: 1.3 }}>
                        {subCert.name}
                      </h3>
                      {subCert.duration && (
                        <span style={{ 
                          color: 'var(--cyan)', 
                          fontSize: '0.75rem', 
                          backgroundColor: 'rgba(111, 255, 233, 0.08)', 
                          padding: '0.3rem 0.8rem', 
                          borderRadius: '2rem', 
                          border: '1px solid var(--line)',
                          fontWeight: 500
                        }}>
                          {subCert.duration}
                        </span>
                      )}
                    </div>
                    
                    {subCert.description && (
                      <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {subCert.description}
                      </p>
                    )}
                    
                    {subCert.instructor && (
                      <p style={{ color: 'var(--foreground)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <User size={14} color="var(--muted)" />
                        <span style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructor:</span>
                        <span style={{ fontWeight: 500 }}>{subCert.instructor}</span>
                      </p>
                    )}
                    
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {subCert.score && subCert.score !== "Score/Grade" ? (
                        <div>
                          <span style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Score</span>
                          <span style={{ color: 'var(--lime)', fontSize: '1.05rem', fontWeight: 700 }}>{subCert.score}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--lime)', fontSize: '0.8rem' }}>
                          <CheckCircle2 size={14} /> Completed
                        </div>
                      )}

                      {subCert.certificateUrl && (
                        <a 
                          href={subCert.certificateUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="reactive-button primary" 
                          style={{ 
                            padding: '0.45rem 1rem', 
                            fontSize: '0.8rem', 
                            minWidth: 'auto', 
                            borderRadius: '0.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <span>Official Certificate</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
