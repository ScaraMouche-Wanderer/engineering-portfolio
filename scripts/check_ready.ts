import "dotenv/config";
import fs from "node:fs";
import { resolveDatabaseUrl } from "../lib/db-url";

async function main() {
  const databaseUrl = resolveDatabaseUrl();
  const filename = databaseUrl.slice(5).split("?")[0];
  if (!fs.existsSync(filename)) {
    throw new Error("SQLite file is missing. Follow DEPLOYMENT.md to initialize a new database.");
  }
  const { prisma } = await import("../lib/db");
  try {
    const projects = await prisma.project.count();
    const navigation = await prisma.navItem.count();
    if (!projects || !navigation) throw new Error("Portfolio content is empty. Review data.json before running db:sync.");
    console.log(`PASS: SQLite schema and content (${projects} projects, ${navigation} navigation items).`);
    console.log(fs.existsSync(".next/BUILD_ID") ? "PASS: Production build exists." : "NEXT: Run npm run build.");
    console.log("Contact submissions are stored in SQLite. Back up this database before deployment.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  // Do not print connection strings, environment values, or private database records.
  console.error("Readiness check failed. Verify the SQLite path, schema and seeded content using DEPLOYMENT.md.");
  process.exitCode = 1;
});
