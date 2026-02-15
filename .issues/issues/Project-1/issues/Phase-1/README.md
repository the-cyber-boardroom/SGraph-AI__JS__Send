# Phase-1: Core Engine, CLI & Tests

**Parent:** [Project-1](../../)
**Status:** active

## Description

Build the foundational transfer engine: adapter interfaces, core engine (chunking, manifest, retry, resume, progress events), Node.js adapters, basic S3 adapter, CLI tool, and comprehensive test suite. Research platform capabilities before building.

## Research Items (P1)

| Label | Title | Status | Owner(s) |
|-------|-------|--------|----------|
| R1 | Platform-native large file upload (S3 multipart, presigned URLs, JS SDK) | proposed | Architect + DevOps |
| R2 | Existing libraries evaluation (tus, Uppy, Resumable.js) | proposed | Architect + Dev |
| R3 | Browser storage APIs (IndexedDB, OPFS, per-browser limits) | proposed | Dev |
| R4 | S3 rate limits, multipart constraints, cost modelling | proposed | DevOps + Architect |
| R5 | Adapter interface design for multi-runtime | proposed | Architect + Dev |

## Implementation Tasks

| Label | Title | Status | Owner | Depends On |
|-------|-------|--------|-------|------------|
| T1 | Define all 6 adapter interfaces | backlog | Architect | R5 |
| T2 | Implement core engine (chunking, manifest, retry, resume, progress) | backlog | Dev | T1 |
| T3 | Implement Node.js adapters (FS, crypto, CLI output) | backlog | Dev | T1 |
| T4 | Implement basic S3 adapter (presigned URL, multipart) | backlog | Dev | T1, R1, R4 |
| T5 | Build CLI tool (sgraph-send) | backlog | Dev | T2, T3 |
| T6 | Write test suite (command-line, no browser) | backlog | Dev | T2, T3 |
| T7 | Security review of crypto adapter | backlog | AppSec | T3 |
| T8 | Set up CI pipeline with multi-runtime testing | backlog | DevOps | T6 |
| T9 | Security review of transfer manifest schema | backlog | AppSec | T2 |
