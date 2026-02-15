# SGraph Send JS — Agent Guidance

**Read this before starting any task.** This file is the single source of truth for all agents and roles working on the SGraph Send JS file transfer engine.

---

## Project

**SGraph Send JS** — the pure JavaScript file transfer engine at the heart of [SGraph Send](https://send.sgraph.ai).

This is the core component that handles getting files from A to B: chunking, progress, resilience, retry, resume, streaming, and compression. The key insight: **encryption is just a callback** — it's a business decision layered on top of the real engineering challenge, which is reliable file transfer.

**Related repos:**
- `SGraph-AI__App__Send` — the full SGraph Send application (Python/FastAPI backend, Web Components frontend)
- This repo — the JavaScript transfer engine, designed to be extracted as a standalone NPM package

---

## MEMORY.md Policy

**Do NOT use MEMORY.md** (the auto-memory at `~/.claude/projects/.../memory/MEMORY.md`). All persistent project knowledge is maintained in the repo itself — in team reviews, briefs, and this CLAUDE.md. If you need to record something, add it to the appropriate location in `team/roles/` or request the Conductor to route it.

---

## Team Structure: Explorer and Villager

The project operates with **two teams** based on Wardley Maps methodology:

| Team | Focus | Wardley Stage | Output |
|------|-------|---------------|--------|
| **Explorer** | Discover, experiment, build first versions | Genesis → Custom-Built | Minor versions (IFD) |
| **Villager** | Stabilise, harden, deploy to production | Custom-Built → Product | Major versions (IFD releases) |

**Session-specific instructions** live in `.claude/explorer/CLAUDE.md` and `.claude/villager/CLAUDE.md`. When starting a new Claude Code session, the human will indicate which team context applies. Read the team-specific CLAUDE.md for your session's rules.

### Key Separation Rules

1. **Villagers do NOT add features.** Functionality is frozen at the Explorer's final version.
2. **Villagers do NOT fix bugs that change behaviour.** Bugs go back to Explorer.
3. **Explorers do NOT deploy to production.** Production is Villager territory.
4. **Explorers do NOT optimise for performance.** That's the Villager's job.
5. **Distinct environments.** Explorer and Villager operate in separate infrastructure.

### Current State

**This repo is entirely Explorer territory right now.** The file transfer engine is at Genesis stage — everything is research, experimentation, and first implementations. There is nothing to hand over to Villager yet.

---

## Architecture

### Core Principle: Multi-Runtime from Day One

The transfer engine is **pure JavaScript**, designed to run in:
- **Browser** — for the web product
- **Node.js** — for CLI tools, server-side processing, automated testing
- **Deno** — alternative runtime
- **Bun** — alternative runtime (fastest)

The core engine has **zero platform-specific imports**. Every platform capability is injected via adapters.

### Adapter Architecture

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  CORE ENGINE (pure JS, no browser/Node APIs)       │
│                                                    │
│  Chunking, checksums, manifest management,         │
│  retry logic, progress events, transfer protocol   │
│                                                    │
├──────────────────────────────────────────────────┤
│                                                    │
│  PLUGGABLE ADAPTERS                                │
│                                                    │
│  Storage:      S3 | Azure | GCP | Local FS | Memory│
│  Crypto:       Web Crypto | Node crypto | none     │
│  Compression:  zstd | lz4 | brotli | none         │
│  Transport:    Fetch | Node HTTP | WebRTC          │
│  UI:           DOM events | CLI output | silent    │
│  Cache:        IndexedDB | FS | Memory             │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Pipeline Invariant

**compress → encrypt → upload** and **download → decrypt → decompress**

This order is **non-negotiable**. Encrypted data does not compress. Violating this order wastes bandwidth and storage. This invariant must be enforced in code, not just documented.

### Transfer Manifest

Every transfer is governed by a **transfer manifest** — a JSON document that is the single source of truth for the transfer's state. The manifest enables progress visibility from both sides, resume capability, integrity verification, and real-time streaming.

---

## Stack

| Layer | Technology | Rule |
|-------|-----------|------|
| Language | JavaScript (ESM) | Pure JS, no TypeScript (for now) |
| Core engine | Zero dependencies on platform APIs | No `fs`, no `window`, no `Deno` in core |
| Adapters | Platform-specific code isolated here | Each adapter implements a defined interface |
| Testing | Node.js test runner / Jest | Tests run from command line, no browser required |
| Package | NPM (`@sgraph/transfer-engine` or similar) | ESM-first, publishable |
| CI/CD | GitHub Actions | Test across runtimes on every push |
| Encryption | AES-256-GCM via Web Crypto / Node crypto | Client-side only, adapter-based |
| Compression | fflate / zstd-wasm / brotli | Evaluated by benchmarks, adapter-based |

---

## Key Rules

### Code Patterns

1. **No platform-specific code in core engine** — all platform access goes through adapters
2. **Adapter interfaces are contracts** — defined by Architect, implemented by Dev
3. **Compress before encrypt** — pipeline invariant, enforced in code
4. **Transfer manifest is single source of truth** — no side-channel state for transfers
5. **Test in Node.js first** — by the time code runs in a browser, we already know it works
6. **No mocks for core functionality** — use in-memory adapters for testing
7. **Chunk checksums on encrypted data** — never on plaintext (leaks content patterns)

### Security

8. **Server never sees plaintext** — encryption happens client-side via crypto adapter
9. **No decryption keys on server** — key stays with sender, shared out-of-band
10. **Wrapped keys only in manifest** — per-file symmetric key wrapped with passphrase-derived key
11. **Fresh IV per encryption operation** — 12 bytes, cryptographically secure random, never reused
12. **Standard key derivation** — PBKDF2 (>=600,000 iterations) or Argon2id

### File Naming

13. **Review files:** `team/roles/{role}/reviews/YY-MM-DD/{version}__{description}.md`
14. **Brief files:** `team/roles/{role}/briefs/{version}__{description}.md`
15. **Version prefix** on all review/doc files

### Git

16. **Default branch:** `master`
17. **Feature branches** from `master` or `dev`
18. **Branch naming:** `claude/{description}-{session-id}`
19. **Always push with:** `git push -u origin {branch-name}`

---

## Repo Structure

```
.claude/                          # Claude Code session configuration
  CLAUDE.md                       # This file — shared guidance for all sessions
  explorer/CLAUDE.md              # Explorer team session instructions
  villager/CLAUDE.md              # Villager team session instructions

.issues/                          # Issues FS (file-based issue tracking)
  config/                         # Node types and link types
  issues/Project-1/               # File Transfer Engine project
    issues/Phase-1/               # Core Engine, CLI & Tests

team/                             # Team structure
  roles/                          # AI team member roles
    architect/                    # Adapter interfaces, platform research, boundaries
    dev/                          # Core engine implementation, adapters, CLI, tests
    appsec/                       # Crypto review, manifest security, pipeline invariant
    devops/                       # CI/CD, NPM publishing, AWS research, cost modelling
    conductor/                    # Orchestration, task routing, priority management
  humans/dinis_cruz/briefs/       # Human stakeholder briefs

src/                              # Application source code (to be created)
  core/                           # Core engine (pure JS, no platform imports)
  adapters/                       # Platform-specific adapter implementations
  cli/                            # CLI tool (sgraph-send)

tests/                            # Tests (to be created)
```

---

## Team Structure

### Roles

| Role | Mission | Location |
|------|---------|----------|
| **Conductor** | Orchestrate workflow, track research/tasks, maintain priorities | `team/roles/conductor/` |
| **Architect** | Define adapter interfaces, own manifest schema, guard boundaries | `team/roles/architect/` |
| **Dev** | Implement core engine, adapters, CLI, tests | `team/roles/dev/` |
| **AppSec** | Verify encryption pipeline, audit manifest, enforce security | `team/roles/appsec/` |
| **DevOps** | CI/CD, NPM publishing, AWS research, cost modelling | `team/roles/devops/` |

### Human Stakeholder

**Dinis Cruz** is the human stakeholder, decision-maker, and project owner. His briefs in `team/humans/dinis_cruz/briefs/` drive the team's priorities.

### Before Starting Work

1. Read the latest human brief in `team/humans/dinis_cruz/briefs/`
2. Read the Conductor brief in `team/roles/conductor/briefs/`
3. Read your role's previous reviews in `team/roles/{your-role}/reviews/`
4. Check `.issues/` for current task states

---

## Issues FS

This project uses **Issues FS** — a file-system based issue tracking system that works natively with Git.

### Structure

```
.issues/
├── issue.json                    (Git repo root node)
├── README.md                     (Navigation)
├── config/
│   ├── node-types.json           (Available node types and statuses)
│   └── link-types.json           (Available link types and relationships)
└── issues/
    └── Project-1/
        ├── issue.json            (Project node)
        └── issues/
            └── Phase-1/
                ├── issue.json    (Phase node)
                └── issues/       (Features, tasks, research items)
```

### Node Types

| Type | Statuses | Use For |
|------|----------|---------|
| `task` | backlog, todo, in-progress, review, done | Units of implementation work |
| `research` | proposed, in-progress, completed, inconclusive | Research investigations |
| `feature` | proposed, approved, in-progress, released | High-level capabilities |
| `bug` | backlog, confirmed, in-progress, testing, resolved, closed | Defects |
| `security-review` | proposed, in-progress, completed, accepted | Security assessments |
| `question` | open, answered, closed | Inter-role questions |

### Link Types

| Verb | Inverse | Use For |
|------|---------|---------|
| `depends-on` | `dependency-of` | Task/research ordering |
| `blocks` | `blocked-by` | Identifying blockers |
| `has-task` | `task-of` | Feature → task hierarchy |
| `assigned-to` | `assignee-of` | Role assignments |
| `relates-to` | `relates-to` | General associations |

### Conventions

- Each role also has a `.issues/` tracker in `team/roles/{role}/.issues/`
- Issue JSON files follow the schema in `.issues/config/node-types.json`
- When creating a link, also create the inverse link
- README.md files at each level provide GitHub-navigable tables

---

## Implementation Phases

### Phase 1: Core Engine and CLI (Current)

- Define the 6 adapter interfaces (Storage, Crypto, Compression, Transport, UI, Cache)
- Implement core engine (chunking, manifest, retry, resume, progress events)
- Implement Node.js adapters (FS storage, Node crypto, CLI output)
- Implement basic S3 adapter (presigned URL upload, multipart)
- Build the CLI tool (`sgraph-send`)
- Write the test suite — runs entirely from command line

### Phase 2: Browser Integration

- Browser adapters (Fetch, Web Crypto, IndexedDB, DOM events)
- SGraph Send UI integration
- Three-level progress display
- Pause/resume/cancel controls

### Phase 3: Advanced Features

- Compression pipeline
- Streaming mode (download before upload finishes)
- Live upload progress on download page
- Bandwidth throttling
- WebRTC peer-to-peer option

### Phase 4: Optimisation and Scale

- Content-addressable chunks (deduplication)
- Multi-file bundling
- Platform-native optimisations
- Folder sync

---

## Research Items (from v0.3.2 Brief)

| # | Item | Priority | Owner(s) |
|---|------|----------|----------|
| R1 | S3 multipart, Transfer Acceleration, presigned URLs, JS SDK | **P1** | Architect + DevOps |
| R2 | tus protocol, Uppy, Resumable.js — evaluate as foundations | **P1** | Architect + Dev |
| R3 | Browser storage: IndexedDB limits, OPFS capabilities | **P1** | Dev |
| R4 | S3 rate limits, multipart constraints, cost per operation | **P1** | DevOps + Architect |
| R5 | Adapter interface design for multi-runtime | **P1** | Architect + Dev |
| R6 | Azure Blob, GCP Cloud Storage, R2, B2 capabilities | **P2** | Architect |
| R7 | WebRTC data channels for P2P file transfer | **P2** | Architect |
| R8 | Compression algorithms: fflate, zstd-wasm, brotli benchmarks | **P2** | Dev |
| R9 | Lambda streaming responses via Web Adapter | **P3** | DevOps + Architect |
| R10 | Content-addressable storage and delta/diff feasibility | **P3** | Architect |

---

## Key Documents

| Document | Location |
|---|---|
| File transfer engine brief | `team/humans/dinis_cruz/briefs/02/15/v0.3.2__briefs__file-transfer-engine-architecture-and-research.md` |
| Conductor kickoff brief | `team/roles/conductor/briefs/v0.3.2__conductor-brief__transfer-engine-kickoff.md` |
| Explorer session guide | `.claude/explorer/CLAUDE.md` |
| Villager session guide | `.claude/villager/CLAUDE.md` |
| Issues FS | `.issues/` |
| Architect role | `team/roles/architect/ROLE.md` |
| Dev role | `team/roles/dev/ROLE.md` |
| AppSec role | `team/roles/appsec/ROLE.md` |
| DevOps role | `team/roles/devops/ROLE.md` |
| Conductor role | `team/roles/conductor/ROLE.md` |
