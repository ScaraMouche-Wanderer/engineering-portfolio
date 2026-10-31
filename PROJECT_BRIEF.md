# Engineering Portfolio — project brief

**Problem:** give a reviewer a clear route from an engineering idea to a working interface, source code, and demonstration.

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, Framer Motion.

## Design decisions

| Decision | Reason | Tradeoff |
| :--- | :--- | :--- |
| Structured project data | Keep content separate from view components | Seed changes and the database must stay aligned |
| SQLite | Simple persistence for a single application instance | Requires persistent disk and a backup plan |
| Server-loaded content | Query project data near the rendered route | The prerendered home page requires a rebuild after content changes |
| Interactive simulations | Let a reviewer explore system behavior in a browser | Simulated values must be distinguished from hardware measurements |
| Reduced-motion support | Keep navigation usable across motion preferences | Every new animated component needs the same consideration |
| Isolated CI database | Validate builds without live contact data | Production data migration remains a separate task |

## Interview walkthrough

1. Show the landing page, navigation, and theme behavior.
2. Open a public project and follow its repository link.
3. Inspect a simulator and identify which values are synthetic.
4. Open the Prisma schema and explain the content/runtime-data boundary.
5. Show `lib/db-url.test.ts` and the CI database setup.

## Public release contents

The source includes a fresh sample seed. Original databases, messages, certificates, personal academic values, machine configuration, maintenance scripts, and vendored upstream source have been excluded or replaced.

