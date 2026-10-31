import path from "node:path";

/** Resolve app and maintenance commands against the same SQLite file. */
export function resolveDatabaseUrl(value = process.env.DATABASE_URL, cwd = process.cwd()): string {
  // Older .env files used Prisma's schema-relative default. The app historically
  // mapped this exact value to the root dev.db; preserve that existing database.
  const url = !value || value === "file:../dev.db" ? "file:./dev.db" : value;
  if (!url.startsWith("file:")) {
    throw new Error("This project uses SQLite. Set DATABASE_URL to a file: URL on persistent storage.");
  }
  const [filename, ...options] = url.slice(5).split("?");
  if (!filename || filename === ":memory:") {
    throw new Error("DATABASE_URL must point to a persistent SQLite file.");
  }
  const absolute = path.resolve(cwd, filename);
  return `file:${absolute}${options.length ? `?${options.join("?")}` : ""}`;
}
