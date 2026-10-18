# SecOps beginner guide

This guide explains the local demonstration, what each main area is for, and how to create a fictional attack incident and analyze it. It is written for learning and demonstrations—not for running attacks against real computers.

## Start the local demonstration

Prerequisites: Docker Desktop with Compose. This local setup runs Ollama in a container; no separate Windows Ollama install is needed. The configured model is `llama3.2:3b-instruct-q4_K_M` and is cached in a Docker volume.

1. In a terminal at the project root, start the demo stack with local Ollama and loopback-only anonymous demo settings:

   ```powershell
   docker compose -f docker-compose.demo.yml -f docker-compose.local-ollama.yml up -d --build
   ```

2. First boot starts the Ollama container and checks/pulls the model. The model weights persist in the `ollama_data` volume. To check the model list, run `docker compose -f docker-compose.demo.yml -f docker-compose.local-ollama.yml exec ollama ollama list`.
3. Open [http://localhost:3000](http://localhost:3000). In this local configuration, the application is intended for loopback-only access. Do not expose its ports to a public network: demo access has no login.
4. Check containers with `docker compose -f docker-compose.demo.yml -f docker-compose.local-ollama.yml ps`. View service output with `docker compose -f docker-compose.demo.yml -f docker-compose.local-ollama.yml logs -f api agents web ollama`.

To stop without deleting saved local data, run the same `docker compose ...` command with `down` instead of `up -d --build`. Avoid `down -v` unless you intentionally want to delete the demo database and volumes. The shortcut `pnpm aisoc:demo` uses only `docker-compose.demo.yml`; it is not the command for this local Ollama override/auth configuration.

## Why there are already incidents

The demo seed job loads example incidents so the console has something to inspect on first launch. The featured case, `INC-RT-001`, is a seeded ransomware scenario. Treat all seeded incident details, activity, and IOCs as demonstration material—not evidence of an attack on your computer or measured security telemetry. The local database persists between restarts; re-running the seed is not the same as clearing it.

The demo banner also identifies the content as demonstration data. A newly created case is saved to this local demo database and is not part of a real monitoring feed.

## Navigate the application

- **Dashboard** — starting overview. Counts and summaries are only meaningful to the extent their connected API data is available; do not interpret seeded counts as live monitoring.
- **Alerts** — individual detection records. Open an alert to inspect its description, severity, status, timestamps, affected entities, and any linked case. An alert is not necessarily a confirmed attack.
- **Cases** — investigation work items that group a suspected incident, its context, notes, tasks, and analysis. Use the **New Case** form to enter a fictional or authorized scenario.
- **Case → Overview** — description, severity, linked alerts, observables, comments, and case metadata.
- **Case → Investigation** — run status and the agent output. Start with **Investigate with agent** in the case header.
- **Case → Ledger** — recorded investigation steps and prior runs when available. An empty ledger means no run is recorded for that case; it is not an error by itself.
- **Case → Attack path** — relationships inferred from available case/graph data. It may be empty if no graph data/service is available; it does not discover a real network on its own.
- **Case → Report** — report output for the selected investigation, when one has completed.
- **Hunt** — run supported searches/hunts against the data sources actually connected to this deployment. The local slim demo is not a full telemetry lake.
- **Detection Rules / Detection Catalog / MITRE Coverage** — inspect and manage rule content and its ATT&CK mapping. A rule describes what to detect; merely viewing a rule does not run an attack.
- **Threat Intel** — inspect indicators and intelligence records available to this deployment.
- **Playbooks** — review response workflow definitions. Creating or viewing a playbook is distinct from carrying out a response action; check approvals and integrations before any real action.
- **Connectors** — configure supported sources in a fully configured deployment. A connector must be configured, authorized, enabled, and running before its data can flow.
- **Settings / Compliance / Audit** — configuration, control/evidence views, and recorded platform activity, depending on the enabled backend services and permissions.

Use the command palette with `Ctrl+K` (or `⌘K` on macOS) to navigate to a page quickly.

## The pipeline: from event to investigation

```text
Security tool / authorized test telemetry
                │
                ▼
       Connector or ingest API
                │  parse + normalize
                ▼
      Event stream (Kafka in full stack)
                │
                ▼
     Detection / alert and enrichment
                │
                ▼
       Case + observable evidence
                │
                ▼
 Agent investigation (local Ollama here)
    recon → forensic → responder → report
                │
                ▼
     Findings, steps, ledger, report
```

In plain language: a **source event** is what a security product observed; **normalization** converts vendor-specific fields into a shared shape; a **detection** decides whether activity matches a rule; an **alert** is a signal to review; a **case** is the analyst's workspace for a larger incident; an **observable** is an entity such as a host, account, IP address, domain, or file hash; an **investigation run** asks the agent workflow to analyze the case description/context; and the **ledger/report** presents the resulting steps and conclusions.

The agent pipeline in this project is recon (extract indicators and context), forensic (reason about timeline/root cause), responder (propose containment actions), then report writer. Ollama supplies the configured local language model to agent calls in this demo. In the case **Ledger**, `llm prompt` and `llm response` entries show model calls; selecting a run shows its model, and the per-model section reports call/token/latency details when available. The agent log also records each local model call. On a CPU-only machine, model startup and each stage can take tens of seconds. Agent conclusions are analysis suggestions, not proof. Review evidence and validate recommendations before acting.

### What this local stack actually runs

The slim demo Compose file starts PostgreSQL, Redis, Kafka/Zookeeper, API, agents, realtime, the seed job, and web. It does not start the separate Go `services/ingest` service or a real endpoint/SIEM connector. Therefore, entering a case and clicking **Investigate with agent** is the working way to demonstrate case analysis; it does not simulate endpoint telemetry arriving through the whole event pipeline. The full repository contains ingestion and connector services for a separately configured deployment.

## Create an attack scenario and analyze it

For a safe demonstration, describe a made-up or explicitly authorized tabletop/test event. Do not execute malware, exploit a public target, or paste credentials, personal information, or real sensitive logs into a demo. The form is enabled in this local loopback profile; other hosted/demo deployments may intentionally disable writes.

1. Open **Cases → New Case**.
2. Give it a clear title, for example `Tabletop: suspicious PowerShell on LAB-WIN-01`.
3. Describe only the scenario facts you want analyzed. Useful details: approximate UTC time, fictional host and account, what was observed, source of the observation, relevant process/command or event fields, and what is unknown. Mark it as simulated, e.g. `Fictional tabletop scenario; no command was executed and no endpoint telemetry was collected.`
4. Choose a severity. Severity is the analyst's prioritization—not an automatic verdict.
5. Create the case, then use **Investigate with agent** in the case header.
6. Watch the **Investigation** tab while it runs. It shows actual pipeline events as each stage finishes; the local 3B model on CPU can take tens of seconds per stage. Prompts and model responses are recorded in **Ledger** after they are saved, and **Report** opens the final report. Completed ledger events persist in the database, while the agents service's detailed live result is in memory and does not survive restarting that container.
7. Compare the output with the facts you supplied. Separate observed evidence from hypotheses, note missing data, and treat suggested containment as recommendations only.

Example fictional scenario text:

> SIMULATED tabletop event — no attack was executed. At 14:05 UTC, the fictional endpoint LAB-WIN-01 recorded PowerShell launched by the test user `analyst-lab`. The scenario says the command attempted to contact `updates.example.invalid`; there is no packet capture, process tree, or authentication log attached. Determine what can and cannot be concluded, list follow-up evidence to request, and suggest safe containment steps for review.

This creates a case from analyst-provided narrative. It does **not** create a real alert, run the command, contact the domain, or prove the event occurred. Any technical analysis is only as reliable as the provided context and configured model.

## Feeding real or generated telemetry (advanced)

The separate ingestion service accepts batches at `POST /v1/ingest/batch` with `X-Tenant-ID`. Its JSON request includes `connector_id`, `connector_type`, `source_format`, and `events`. It normalizes events and publishes them to Kafka. The local slim Compose stack does not start that service, and ingestion by itself is not a guarantee that a detection rule, alert, case, or investigation will be created: those downstream consumers must also be deployed, configured, and connected.

For real data, use only systems and accounts you are authorized to monitor; configure the matching connector and credentials through the documented setup for that connector. Do not expose this anonymous local demo publicly. For a classroom exercise, use fabricated events or telemetry from an isolated lab and label it as simulated.

## Common meanings

- **Severity**: estimated urgency/impact, commonly low, medium, high, or critical.
- **Status**: where the case is in its lifecycle (new/open, triaged/pending, investigating/in progress, contained, resolved, or closed; wording can differ between API and screen).
- **IOC**: indicator of compromise, such as a suspicious IP, domain, hash, account, or host. An IOC needs context; it is not automatically malicious.
- **MITRE ATT&CK technique**: a standardized label for an adversary behavior. A mapping is a classification, not proof that the behavior happened.
- **Confidence**: how strongly an analysis supports a conclusion. It does not replace validating underlying evidence.
- **Dry run / recommendation**: proposed action for an analyst to review; not confirmation that a host was isolated or an account was disabled.
- **Synthetic / seeded**: created as sample data for demonstration, rather than observed from a live protected environment.

## Troubleshooting

- **The site does not open:** confirm Docker Desktop is running and `web` is healthy with the Compose `ps` command above.
- **Ollama analysis fails or seems slow:** the Compose overlay runs Ollama in Docker at `http://localhost:11434`; check it with `docker compose -f docker-compose.demo.yml -f docker-compose.local-ollama.yml logs -f ollama agents`. The model is CPU-only in the default setup, so allow tens of seconds per stage.
- **Investigation errors or appears stuck:** inspect API/agents/realtime logs. An investigation failure is shown as a failure; seeded case content that remains visible is not analysis of the case you just entered.
- **Case is missing:** the seed job only inserts sample rows when it runs successfully. Check `docker compose ... logs seed` and `docker compose ... logs api`; do not delete database volumes casually, as they contain local state.
- **Page is empty:** the local stack lacks several optional integrations and the separate ingestion service. An empty area can mean there is no data/service for that feature, not that your scenario was detected.
