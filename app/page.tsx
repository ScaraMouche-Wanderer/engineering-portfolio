import { prisma } from "@/lib/db";
import ClientPage from "./ClientPage";

export default async function Page() {
  const [
    taglineConfig,
    navItems,
    coreAreas,
    skillGroups,
    experience,
    education,
    certifications,
    projects,
    journey
  ] = await Promise.all([
    prisma.globalConfig.findUnique({ where: { key: 'tagline' } }),
    prisma.navItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.coreArea.findMany({ include: { points: true }, orderBy: { order: 'asc' } }),
    prisma.skillGroup.findMany({ include: { items: true }, orderBy: { order: 'asc' } }),
    prisma.experience.findMany({ include: { stack: true }, orderBy: { order: 'asc' } }),
    prisma.education.findMany({ include: { subjects: true, cocurricular: true }, orderBy: { order: 'asc' } }),
    prisma.certification.findMany({ include: { subCertificates: true }, orderBy: { order: 'asc' } }),
    prisma.project.findMany({ include: { stack: true }, orderBy: { order: 'asc' } }),
    prisma.journeyStep.findMany({ orderBy: { order: 'asc' } })
  ]);

  // Transform data to match what ClientPage expects
  const data = {
    tagline: taglineConfig?.value,
    navItems,
    coreAreas: coreAreas.map(a => ({ ...a, points: a.points.map(p => p.text) })),
    skillGroups: skillGroups.map(g => ({ ...g, items: g.items.map(i => i.name) })),
    experience: experience.map(e => ({ ...e, stack: e.stack.map(s => s.name) })),
    education: education.map(e => ({ 
      ...e, 
      subjects: e.subjects.map(s => s.name),
      cocurricular: e.cocurricular.map(c => c.text)
    })),
    certifications,
    projects: projects.map(p => ({ ...p, stack: p.stack.map(s => s.name) })),
    journey
  };

  return (
    <ClientPage 
      tagline={data.tagline}
      navItems={data.navItems}
      coreAreas={data.coreAreas}
      skillGroups={data.skillGroups}
      experience={data.experience}
      education={data.education}
      certifications={data.certifications}
      projects={data.projects}
      journey={data.journey}
    />
  );
}
