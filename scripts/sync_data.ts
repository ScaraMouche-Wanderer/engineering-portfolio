import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/db';

async function main() {
  const dataFilePath = path.join(process.cwd(), 'data.json');
  if (!fs.existsSync(dataFilePath)) {
    console.error('❌ Error: data.json not found at', dataFilePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  const data = JSON.parse(raw);

  console.log('🔄 Syncing data.json into SQLite database using Prisma Client...');

  // 1. Global Config (Tagline)
  if (data.tagline) {
    await prisma.globalConfig.upsert({
      where: { key: 'tagline' },
      update: { value: data.tagline },
      create: { id: 'config-tagline', key: 'tagline', value: data.tagline }
    });
    console.log('  ✓ Tagline updated');
  }

  // 2. Nav Items
  if (data.navItems && Array.isArray(data.navItems)) {
    await prisma.navItem.deleteMany();
    for (let i = 0; i < data.navItems.length; i++) {
      const item = data.navItems[i];
      await prisma.navItem.create({
        data: {
          id: item.id || `nav-${i}`,
          sectionId: item.sectionId,
          label: item.label,
          order: item.order ?? i
        }
      });
    }
    console.log(`  ✓ ${data.navItems.length} NavItems synced`);
  }

  // 3. Core Areas & Points
  if (data.coreAreas && Array.isArray(data.coreAreas)) {
    await prisma.point.deleteMany();
    await prisma.coreArea.deleteMany();
    for (let i = 0; i < data.coreAreas.length; i++) {
      const area = data.coreAreas[i];
      const areaId = area.id || `ca-${i}`;
      await prisma.coreArea.create({
        data: {
          id: areaId,
          title: area.title,
          blurb: area.blurb,
          order: area.order ?? i,
          points: {
            create: (area.points || []).map((pt: string | { text: string }, pIdx: number) => ({
              id: `pt-${areaId}-${pIdx}`,
              text: typeof pt === 'string' ? pt : pt.text
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.coreAreas.length} CoreAreas synced`);
  }

  // 4. Skill Groups & Items
  if (data.skillGroups && Array.isArray(data.skillGroups)) {
    await prisma.skillItem.deleteMany();
    await prisma.skillGroup.deleteMany();
    for (let i = 0; i < data.skillGroups.length; i++) {
      const group = data.skillGroups[i];
      const groupId = group.id || `sg-${i}`;
      await prisma.skillGroup.create({
        data: {
          id: groupId,
          name: group.name,
          accent: group.accent || 'cyan',
          order: group.order ?? i,
          items: {
            create: (group.items || []).map((item: string | { name: string }, iIdx: number) => ({
              id: `item-${groupId}-${iIdx}`,
              name: typeof item === 'string' ? item : item.name
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.skillGroups.length} SkillGroups synced`);
  }

  // 5. Experience & Stack
  if (data.experience && Array.isArray(data.experience)) {
    await prisma.experienceStack.deleteMany();
    await prisma.experience.deleteMany();
    for (let i = 0; i < data.experience.length; i++) {
      const exp = data.experience[i];
      const expId = exp.id || `exp-${i}`;
      await prisma.experience.create({
        data: {
          id: expId,
          role: exp.role,
          company: exp.company,
          duration: exp.duration,
          description: exp.description,
          achievement: exp.achievement || null,
          order: exp.order ?? i,
          stack: {
            create: (exp.stack || []).map((stk: string | { name: string }, sIdx: number) => ({
              id: `stk-${expId}-${sIdx}`,
              name: typeof stk === 'string' ? stk : stk.name
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.experience.length} Experiences synced`);
  }

  // 6. Education, Subjects & Co-curricular
  if (data.education && Array.isArray(data.education)) {
    await prisma.subject.deleteMany();
    await prisma.cocurricular.deleteMany();
    await prisma.education.deleteMany();
    for (let i = 0; i < data.education.length; i++) {
      const edu = data.education[i];
      const eduId = edu.id || `edu-${i}`;
      await prisma.education.create({
        data: {
          id: eduId,
          degree: edu.degree,
          college: edu.college,
          duration: edu.duration,
          cgpa: edu.cgpa,
          description: edu.description,
          hasDeepDive: Boolean(edu.hasDeepDive),
          order: edu.order ?? i,
          subjects: {
            create: (edu.subjects || []).map((s: string | { name: string }, sIdx: number) => ({
              id: `subj-${eduId}-${sIdx}`,
              name: typeof s === 'string' ? s : s.name
            }))
          },
          cocurricular: {
            create: (edu.cocurricular || []).map((c: string | { text: string }, cIdx: number) => ({
              id: `cocurr-${eduId}-${cIdx}`,
              text: typeof c === 'string' ? c : c.text
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.education.length} Education items synced`);
  }

  // 7. Certifications & Sub-Certificates
  if (data.certifications && Array.isArray(data.certifications)) {
    await prisma.subCertificate.deleteMany();
    await prisma.certification.deleteMany();
    for (let i = 0; i < data.certifications.length; i++) {
      const cert = data.certifications[i];
      const certId = cert.id || `cert-${i}`;
      await prisma.certification.create({
        data: {
          id: certId,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          hasDeepDive: Boolean(cert.hasDeepDive),
          order: cert.order ?? i,
          subCertificates: {
            create: (cert.subCertificates || []).map((sub: { id?: string; name: string; category?: string; instructor?: string; description?: string; duration?: string; certificateUrl?: string }, sIdx: number) => ({
              id: sub.id || `subcert-${certId}-${sIdx}`,
              name: sub.name,
              category: sub.category || 'General',
              instructor: sub.instructor || 'N/A',
              description: sub.description || '',
              duration: sub.duration || '',
              certificateUrl: sub.certificateUrl || '#'
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.certifications.length} Certifications synced`);
  }

  // 8. Projects & Stacks
  if (data.projects && Array.isArray(data.projects)) {
    await prisma.projectStack.deleteMany();
    await prisma.project.deleteMany();
    for (let i = 0; i < data.projects.length; i++) {
      const proj = data.projects[i];
      const projId = proj.id || `proj-${i}`;
      await prisma.project.create({
        data: {
          id: projId,
          title: proj.title,
          tag: proj.tag,
          summary: proj.summary,
          impact: proj.impact,
          repoUrl: proj.repoUrl || null,
          order: proj.order ?? i,
          stack: {
            create: (proj.stack || []).map((stk: string | { name: string }, sIdx: number) => ({
              id: `pstk-${projId}-${sIdx}`,
              name: typeof stk === 'string' ? stk : stk.name
            }))
          }
        }
      });
    }
    console.log(`  ✓ ${data.projects.length} Projects synced`);
  }

  // 9. Journey Steps
  if (data.journey && Array.isArray(data.journey)) {
    await prisma.journeyStep.deleteMany();
    for (let i = 0; i < data.journey.length; i++) {
      const j = data.journey[i];
      await prisma.journeyStep.create({
        data: {
          id: j.id || `j-${i}`,
          year: j.year,
          title: j.title,
          text: j.text,
          order: j.order ?? i
        }
      });
    }
    console.log(`  ✓ ${data.journey.length} Journey steps synced`);
  }

  console.log('\n🎉 All portfolio data successfully synced from data.json into the database!');
}

main()
  .catch((e) => {
    console.error('❌ Error syncing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
