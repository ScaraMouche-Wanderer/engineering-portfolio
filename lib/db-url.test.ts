import assert from "node:assert/strict";
import test from "node:test";
import { resolveDatabaseUrl } from "./db-url";

test("relative paths resolve from the project, including parent directories", () => {
  assert.equal(resolveDatabaseUrl("file:./dev.db", "/srv/portfolio"), "file:/srv/portfolio/dev.db");
  assert.equal(resolveDatabaseUrl("file:../data/site.db", "/srv/portfolio"), "file:/srv/data/site.db");
});

test("the legacy Prisma default continues using the existing project database", () => {
  assert.equal(resolveDatabaseUrl("file:../dev.db", "/srv/portfolio"), "file:/srv/portfolio/dev.db");
});

test("absolute persistent paths and SQLite options are preserved", () => {
  assert.equal(resolveDatabaseUrl("file:/data/site.db?connection_limit=1", "/srv/app"),
    "file:/data/site.db?connection_limit=1");
});

test("unsupported database backends and transient storage fail explicitly", () => {
  for (const value of ["postgresql://example/db", "libsql://example/db", "file:", "file::memory:"]) {
    assert.throws(() => resolveDatabaseUrl(value, "/srv/app"));
  }
});
