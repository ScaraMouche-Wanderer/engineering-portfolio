# Portfolio content

The public export uses synthetic/public content in data.json. No contact inbox,
production database, academic transcript, employment record, or certificates are
included. The SGPA visualizer uses synthetic sample values.

On a NEW demo database, use npm run db:sync to load the sample project metadata.
The sync command replaces content tables; do not run it against a live database
without reviewing the intended changes and taking a backup.

ContactMessage and SecurityLog are runtime-private tables. Keep all SQLite
files, environment files, webhook destinations, and real submissions outside Git.
See DEPLOYMENT.md for the persistent-disk hosting contract.
