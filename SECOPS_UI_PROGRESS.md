# SecOps UI refactor progress

- [x] Inspected the Next.js application shell, public entry point, metadata, navigation, and global styles.
- [x] Replace the marketing root page with a direct operational entry point.
- [x] Simplify shared navigation and top bar; remove repository/promotional UI.
- [x] Rename user-facing application metadata and PWA manifest to SecOps.
- [x] Validate the web package with type-check, lint, tests, and production build.
- [x] Remove desktop demo sign-in and password auto-login; enable anonymous API access only in the loopback-only local demo override.
- [x] Verify the seeded showcase case is available without a bearer token and `/login` redirects to the console.
- [x] Remove Copilot launcher, navigation/actions, and embedded contextual prompts from operational screens; redirect the old route.
- [x] Enable a working case creation form for safe fictional/tabletop scenarios.
- [x] Add `howuse.md` with beginner navigation, pipeline, simulation-vs-live data explanation, local Ollama, and troubleshooting.
- [x] Remove hard-coded successful investigation output used when the agent request fails; show a genuine failure state instead.
- [x] Configure a containerized Ollama + persistent local model volume for the local demo; repair Ollama healthcheck and isolate Kafka's cluster metadata in a fresh local volume.
- [x] Fix duplicate investigation-status routes so case-launched run status/results resolve from the investigator service.
- [x] Make forensic output tolerate list-shaped local-model blast-radius responses instead of failing the entire run.
- [x] Fix case-creation SQL parameter casts so the new local demo form can persist cases.
- [x] Route case investigation start/status/report requests through Next.js to the agents service while retaining ledger reads through the core API.
- [x] Show real stage/event updates during local Ollama runs, with a clear wait message and no fabricated reasoning; restore in-progress event history when opening a run link.
- [x] Show the newest real investigation summaries and status in the case Overview; provide direct navigation to its investigation output.
- [x] Preserve the selected run in the case URL after completion and stop polling with an actionable error if status is lost for an extended period.
- [x] Configure the local Ollama overlay's internal realtime URL and build/restart the local web service with the corrected routes.

Validation notes: type-check passes; lint passes with five existing hook/export warnings; all 193 tests passed during the UI refactor; the current web production build passes with Webpack. Anonymous `GET /api/v1/cases` returns the seeded `INC-RT-001` case, `/login` redirects to `/dashboard`, and the loopback host bindings are active. The default Turbopack build cannot resolve the Next.js package from its inferred `src/app` root in this checkout, so the Docker build uses Webpack.

Latest work: local demo banner now identifies seeded/synthetic data and permits fictional demo writes; Copilot UI surfaces removed from operating screens and the old route redirects; case creation enabled; failed investigation requests now show failure instead of invented results. `howuse.md` documents the beginner workflow. Containerized Ollama is running with `llama3.2:3b-instruct-q4_K_M`. Fixed Next.js rewrites so case investigation start/status/report requests reach the agents service while persistent ledger reads remain on the core API. The investigation panel now names the current stage/event and explains local model wait time; deep links with a run ID restore real progress history. Corrected the agents-to-realtime internal URL. Overview now includes latest analysis summaries and a direct link to the detailed investigation; after completion the active run is kept in the URL, and a dead status poll times out clearly after 10 minutes. Validation: web type-check passed; all 193 tests passed; optimized production Docker build passed before the latest overview/status UX adjustment (rebuild pending); both agents-status and ledger API proxy routes returned 200. Real Ollama runs completed and emitted model prompt/response, evidence, and recon/forensic/responder events; model calls take roughly 30–55 seconds each on CPU. The older UI refactor lint produced five existing hook/export warnings.
