# Engineering Portfolio
### From systems work to an inspectable interface

A personal engineering portfolio built with Next.js, React, TypeScript, Prisma, and SQLite. It combines project navigation, interactive technical visualizers, responsive themes, and a database-backed contact workflow.

**Next.js · React · TypeScript · Tailwind CSS · Prisma · SQLite · Framer Motion**

[Project brief](PROJECT_BRIEF.md) · [Deployment](DEPLOYMENT.md) · [Content guide](DATA_MANAGEMENT_GUIDE.md)

## What this source release demonstrates

- An engineering-studio landing page and navigable project detail views.
- Interactive illustrations of firmware, Linux desktop tools, and local AI.
- Responsive navigation, light/dark themes, and reduced-motion behavior.
- Server-rendered project content from a typed SQLite schema.
- An isolated database workflow and a health endpoint.

The visualizers are simulations. Their telemetry does not establish physical hardware performance.

## Public sample content

This export contains public project descriptions and synthetic demo values. It includes no production SQLite database, contact inbox, security logs, academic transcript, employment record, or certificates.


## Quick start

Use Node.js 24 and npm.

```bash
npm ci
npx prisma generate
cp .env.example .env
```

Initialize a **new demonstration database**:

```bash
export DATABASE_URL="file:$PWD/dev.db"
npx prisma db push
npm run db:sync
npm run check:ready
npm run dev -- --hostname 127.0.0.1
```

Open `http://127.0.0.1:3000`. The `db:sync` command replaces content tables; run it only against the new demo database in this walkthrough.

## Validate and present

```bash
npm run test:deployment
npm run lint
npx tsc --noEmit
npm run build
npm run demo
```

This public export uses system font stacks. Building does not require a Google Fonts download.

## Source map

| Path | Responsibility |
| :--- | :--- |
| `app/page.tsx` | Load structured portfolio data |
| `app/ClientPage.tsx` | Client navigation and interactive project views |
| `components/StudioHero.tsx` | Landing page and selected project entry points |
| `components/` | Project showcases and simulations |
| `prisma/schema.prisma` | Content, contact, and security-log schema |
| `lib/db-url.ts` | Consistent SQLite path resolution |
| `scripts/sync_data.ts` | Load reviewed content from the sample JSON |
| `app/api/health/route.ts` | Read-only database readiness response |

## Deployment contract

Use a Node host with a persistent writable disk and one application instance for this SQLite configuration. Set an absolute database URL outside the release directory, keep environment values and runtime databases out of Git, and back up the database before replacing a live release.

The contact form writes to SQLite. The public source is separate from a publicly hosted deployment; see [DEPLOYMENT.md](DEPLOYMENT.md) for the complete hosting and rehearsal steps.

## Dependencies and attribution

Third-party packages are declared in `package.json` and locked in `package-lock.json`. The document-viewer integration uses the `@docmentis/udoc-viewer` package; its upstream source is not presented as this portfolio's original work. Included NASA sample PDFs are document-rendering examples, not personal certificates.
