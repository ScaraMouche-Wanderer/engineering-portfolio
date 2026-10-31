# Portfolio deployment and presentation

## Rehearse locally

Use Node.js 24 LTS and run commands from the project root. On a new checkout,
install the locked dependencies with `npm ci` and generate the client with
`npx prisma generate`. Preserve an existing `.env` and database.

```bash
npm run check:ready
npm run test:deployment
npm run build
npm run demo
```

Open `http://127.0.0.1:3000`. `demo` serves the optimized production build on
loopback, reducing development-server overhead. Ctrl+C stops it. To use another
port, run `npm run demo -- --port 3001`.

`GET /api/health` returns 200 only when the Project table can be read, or 503
otherwise. It does not return database paths, environment values or contact
messages. `check:ready` also verifies that projects and navigation have content;
a successful health response alone does not validate every page or contact delivery.

## Database contract

The Prisma schema uses **SQLite**. PostgreSQL and libSQL/Turso URLs are not
supported without changing the schema/client/adapter integration.

App and data-maintenance scripts resolve `file:./dev.db` from the project root.
For compatibility, the old `file:../dev.db` value also maps to the project's root
`dev.db`. Other relative paths are resolved from the project root normally.
Prisma CLI commands resolve relative paths from the schema directory instead;
use an **absolute URL** for deployment and all schema initialization commands.

For a NEW database only (do not run the seed against live data without review):

```bash
export DATABASE_URL="file:$PWD/dev.db"
npx prisma generate
npx prisma db push
# Review data.json before this command: it replaces portfolio content tables.
npm run db:sync
npm run check:ready
```

An existing database should be backed up with SQLite's backup API or the
`.backup` command, especially when the app is serving writes. Do not casually
copy only a live database file if it is using WAL. Contact messages and security
logs are private; exclude them from public demo fixtures and repositories.

## Hosting target

Use a Node host or VM with a persistent writable disk and one app instance for
this SQLite configuration. The default ephemeral filesystem of a serverless
host will not preserve contact submissions. Choose the hosting target before
adding a service definition or deploying.

1. Place the database outside the release directory, with permissions for the app user.
2. Set `DATABASE_URL=file:/absolute/persistent/path/site.db` in the host environment.
3. Install dependencies and generate the Prisma client.
4. Check database schema/content, then build against the intended database.
5. Start the production server on loopback behind the host's HTTPS reverse proxy.
6. Verify `/api/health`, home, project, education and certification pages.
7. Submit one intentional contact-form test and verify its storage/delivery privately.
8. Keep the preceding release and a matching database backup for rollback.

The home page is prerendered during `npm run build`; content updates require a
rebuild to appear there. Detail routes read data at request time. Do not seed or
reset the database automatically on every server start.

## Presentation script

Show the hero and engineering focus, open an actual project detail page, then
show the interactive simulator and contact workflow. Distinguish simulations
from hardware measurements. Rehearse at the target screen size and check the
browser console, links and contact form before sharing a public URL.

This public export uses system font stacks, so building does not require
a Google Fonts download. Dependency installation still needs the npm registry.

## Engineering studio interface

The home page uses `StudioHero` with responsive selected-system cards and the
existing interactive microchip. The continuously animated particle background is
no longer mounted on the home page. Reduced-motion users receive minimal CSS
transitions and no custom cursor tracking. Desktop navigation switches to the
compact bottom navigation on narrower screens; theme preferences remain supported.
