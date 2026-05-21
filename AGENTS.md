# AGENTS.md — deep-research

## Purpose

Open-source TypeScript library for multi-hop web-based deep research.
Built by JigsawStack as an open alternative to Perplexity / OpenAI Deep Research.
Combines an LLM-driven reasoning engine with web search (JigsawStack API) to
break complex questions into sub-queries, gather evidence, and produce cited
reports. Published as `deep-research` on npm.

## Status

Active, maintained. v0.1.4 — Apache 2.0 license. Single `main` branch.
Used as a library dependency; no CLI or web UI.

## Directory Layout

```
src/
  index.ts           — DeepResearch class (public API)
  process.ts         — Research pipeline (plan → search → reason → report)
  config/defaults.ts — Default configuration constants
  provider/
    aiProvider.ts    — Model provider abstraction (OpenAI, Gemini, OpenRouter, etc.)
    jigsaw.ts        — JigsawStack SDK wrapper
    webSearch.ts     — Web search provider
  prompts/prompts.ts — LLM prompt templates
  types/types.ts     — TypeScript type definitions
  utils/
    logger.ts        — Console logging utility
    utils.ts         — General helpers (URL dedup, number mapping)
examples/
  simple_research.ts
  advanced_research.ts
public/
  open_deep_research_diagram.png
.github/workflows/publish.yml — npm publish CI
```

## Commands

| Command           | Action                        |
|-------------------|-------------------------------|
| `npm i deep-research` | Install the library         |
| `yarn build`      | Build dist/ via pkgroll       |
| `yarn lint`       | Lint with Biome               |
| `yarn format`     | Auto-format with Biome        |
| `yarn dev`        | Run examples/simple_research.ts via tsx |
| `yarn add <pkg>`  | Add dependency                |

## Watchouts

- **JigsawStack API key required** — `JIGSAW_API_KEY` is mandatory; the library
  won't function without it. Also needs keys for chosen AI providers.
- **No tests** — No test runner or test files in the repo. Quality relies on the
  Biome linter and manual example runs.
- **`examples/` change API** — The examples in `examples/` were last updated on
  the `update/examples` branch (commit `91af1f2`, merged to `main` via PR #38 as
  commit `33edd18`). The version bump to v0.1.4 (commit `243996e`) happened after
  those changes, so example code may reference APIs from v0.1.3 that differ from
  the current release.
- **.env is gitignored** — Confirmed: `.env`, `.env.*`, `*.env` all in `.gitignore`.
  No secret files present in the repo.
- **Node >=18 required** — Package uses ESM (`"type": "module"`).
