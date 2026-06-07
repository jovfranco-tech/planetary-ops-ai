# Planetary Operations — AI Command Center

**AI-native decision simulator for global digital infrastructure, cyber resilience, AI dependency resilience and business continuity.**

A portfolio-grade, single-page command center that renders global digital infrastructure on a cinematic 3D globe and lets an executive *simulate* incidents — submarine-cable cuts, cloud-region degradation, identity-provider outages, ransomware, and AI-provider failures — then see the projected impact on resilience, continuity, AI dependency and cyber risk, with board-ready decision options and a deterministic AI copilot.

> **Demo environment.** All infrastructure, providers, workflows and metrics are **simulated**. No real company-sensitive data is used, and there is no real-time production monitoring. AI recommendations are decision-support only; human validation is required for real operations.

---

## Why this exists

Most "ops dashboards" stop at telemetry. This project models the layer above telemetry — **executive crisis decisioning** — and treats **AI services as critical infrastructure** alongside cables, cloud and identity. The differentiators are provider-concentration risk, multi-model fallback strategy, and responsible-AI governance (human-in-the-loop, sensitivity gating) made visible at board level.

## Features

- **Cinematic 3D globe** — infrastructure nodes, submarine/backbone routes, cloud regions, AI service mesh, orbital layer and live incident rings, driven declaratively from application state.
- **Seven toggleable planetary layers** — space, backbone, cloud, enterprise, cyber, continuity and AI.
- **Scenario simulation engine** — eight pre-built incidents that re-project metrics, routes, regions and AI workflows in real time.
- **Executive War Room** — animated resilience / continuity / AI-dependency / cyber-risk metrics, posture and recommended decision.
- **AI Dependency Resilience module** — provider concentration bars, fallback readiness, and a workflow-continuity matrix with approval gating.
- **Executive Decision Board** — an always-present A / B / C decision matrix (Monitor · Partial continuity/AI fallback · Full DR/multi-provider failover) plus an auto-generated **Board Brief**.
- **Deterministic AI Copilot** — natural-language commands ("simulate OpenAI outage", "what requires human approval?") resolved by an intent matcher into structured executive reports. No real LLM; fully offline and reproducible.
- **Bilingual (EN / ES)** — every string localized; language persists across sessions.

## Architecture

Strict, typed, framework-agnostic core with a thin React view layer.

```
src/
├─ types/        Domain, scenario, AI and i18n type definitions
├─ data/         Simulated infrastructure, providers, workflows, scenarios, baseline
├─ engine/       Pure logic: scenario projection, risk, decisions, AI resilience,
│                briefing, dependency resolution, globe projection
├─ ai/           Deterministic copilot: command parser + report builders + async orchestrator
├─ i18n/         EN/ES catalogs (en is the source of truth for keys) + helpers
├─ store/        Zustand command-center store (single source of UI truth)
├─ utils/        Colors, scoring bands, formatting, geometry
├─ components/   View layer (globe, layout, panels, copilot, common)
└─ app/          App shell, providers, entry composition
```

Design principles:

- **Engine is pure and UI-free.** Components read state from the store and render the output of engine functions; they contain no business logic. The entire `types / data / engine / ai / i18n / utils` core compiles and is meaningful without React.
- **The copilot is swappable.** `runCopilot()` is `async` and returns a plain `CopilotResult` (never JSX). The deterministic logic is today's offline implementation; a future `/api/agent` backend can replace the body without touching a single component. See *Roadmap*.
- **Data honesty is built in.** A demo badge, disclaimer modal and footer pills make the simulated nature explicit throughout.

## Tech stack

React 18 · TypeScript (strict) · Vite · Zustand · react-globe.gl / three.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

> The 3D globe loads its earth textures from a public CDN at runtime and requires WebGL. If WebGL is unavailable, the globe degrades gracefully to a notice while all command layers, scenarios and decision intelligence remain fully operational.

## Deploy to Vercel

This is a standard Vite SPA and ships with `vercel.json`.

1. Push the repository to GitHub/GitLab.
2. Import it in Vercel — the framework auto-detects as **Vite**.
3. Build command `npm run build`, output directory `dist`. Deploy.

(Or run `vercel` from the project root with the Vercel CLI.)

## Roadmap — from deterministic demo to live copilot

The deterministic copilot is intentionally a drop-in for a real agent:

1. Stand up a `POST /api/agent` endpoint that accepts `{ text, lang, context }` and returns the same `CopilotResult` shape.
2. Replace the body of `runCopilot()` with a `fetch` to that endpoint; keep the deterministic builders as the offline fallback.
3. Optionally stream tokens into the copilot panel; the message model already separates `text` from structured `report`.

Further directions: real telemetry ingestion to replace simulated baselines, scenario authoring UI, and exportable board briefs (PDF).

## Release notes — v0.1.0-rc

First release candidate. The application is feature-complete against its scope: cinematic globe, seven infrastructure layers, eight simulated incident scenarios, Executive War Room, AI Dependency Resilience module, Executive Decision Board with auto-generated board brief, deterministic AI copilot, and full EN/ES localization.

Validated:

- **TypeScript (strict)** — strict-mode type-checks clean across the framework-agnostic core and the full React component layer.
- **Scenario engine** — all eight scenarios re-project metrics, affected regions/services/providers/workflows, board brief, decision options and globe state; recommended options resolve sensibly.
- **Copilot + i18n** — every supported command resolves to a structured report; EN/ES catalogs are at full key parity with no empty strings.
- **Reactivity fix** — the prior Zustand stale-state defect is resolved: derived state is exposed via reactive `useScenario()` / `useMetrics()` hooks, so all panels (War Room, AI Resilience, Decision Board, board brief, top-bar status) update immediately on scenario change, not just the globe.
- **Build pipeline** — uses the standard Vite solution-style TypeScript project references (`tsc -b && vite build`).
- **Security/privacy** — no secrets or API keys; no runtime network calls except the documented globe-texture CDN; globe labels are rendered via safe DOM construction (no `innerHTML` injection sink); `localStorage` stores only the language preference.

### Final local validation (run once before tagging)

Real dependency install, browser and WebGL behavior must be confirmed on a developer machine with network access:

```bash
npm install
npm run typecheck     # tsc -b — expect no errors
npm run build         # tsc -b && vite build — expect dist/ produced
npm run preview       # serve the production build, then open the printed URL
```

In the browser, confirm: globe renders and remains the visual hero (or the WebGL-fallback notice appears); layer toggles, scenario selection and EN/ES toggle work and the language persists across reload; running ≥3 scenarios updates **all** panels immediately; the AI-native scenarios (OpenAI degraded, GitHub Copilot degraded, multi-provider AI, AI governance lockdown) visibly impact AI providers and workflows; the copilot opens, closes and answers supported commands; demo/disclaimer affordances are visible; and the console shows no fatal errors and no network calls beyond the globe-texture CDN.

---

Built by **Jovan Franco — Technology Transformation Leader**.

