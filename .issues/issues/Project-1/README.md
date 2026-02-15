# Project-1: File Transfer Engine

**Parent:** [Repo-1](../../)
**Status:** active

## Description

Pure JavaScript, transport-agnostic, multi-runtime file transfer engine with pluggable adapters. The core component of SGraph Send — handles chunking, progress, resilience, retry, resume, streaming, compression, and all the complexity of getting files from A to B reliably.

## Phases

| Label | Title | Status |
|-------|-------|--------|
| [Phase-1](issues/Phase-1/) | Core Engine, CLI & Tests | active |

## Key Principles

1. **Encryption is a callback** — pluggable, not where the complexity lives
2. **Multi-runtime** — browser, Node.js, Deno, Bun from day one
3. **Compress before encrypt** — pipeline invariant
4. **Transfer manifest is truth** — single source of truth for every transfer
5. **Research before build** — understand platform capabilities before implementing
