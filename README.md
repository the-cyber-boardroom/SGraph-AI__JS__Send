# SGraph-AI__JS__Send

![release-v0.0.1](https://img.shields.io/badge/release-v0.0.1-blue)

**SG/Send** -- Zero-knowledge encrypted file sharing. Your files, your keys, your privacy.

This repo contains the JavaScript front-end components that power [send.sgraph.ai](https://send.sgraph.ai): Web Components for upload/download, client-side AES-256-GCM encryption, i18n, and the Aurora design system.

Published as [`@sgraph-ai/send`](https://www.npmjs.com/package/@sgraph-ai/send) on NPM.

## Live

- **Production:** [send.sgraph.ai](https://send.sgraph.ai)
- **Docs:** [docs.send.sgraph.ai](https://docs.send.sgraph.ai/)

## What's in the package

| Component | File | Description |
|-----------|------|-------------|
| **SendCrypto** | `v0.1.0/js/crypto.js` | AES-256-GCM encrypt/decrypt via Web Crypto API |
| **ApiClient** | `v0.1.0/js/api-client.js` | REST client for the SGraph Send backend |
| **I18n** | `v0.1.4/js/i18n.js` | Lightweight internationalisation (EN, PT, PT-PT, Klingon) |
| **SendUpload** | `v0.1.4/components/send-upload/` | Upload web component (drag/drop, text mode, SGMETA envelope) |
| **SendDownload** | `v0.1.4/components/send-download/` | Download web component (auto-decrypt, history) |
| **SendAccessGate** | `v0.1.4/components/send-access-gate/` | Access token gate web component |
| **SendTransparency** | `v0.1.0/components/send-transparency/` | Transparency panel ("what we stored / what we didn't") |
| **Design System** | `v0.1.6/css/sg-design-system.css` | Aurora theme (dark navy + teal accents) |

The code uses an **IFD (Incremental Feature Delivery)** layered override pattern: v0.1.0 defines the base, v0.1.4/v0.1.5/v0.1.6 surgically override specific methods and strings on top.

## Install

```bash
npm install @sgraph-ai/send
```

## Use via CDN

Once published, the files are available via unpkg and jsdelivr:

```html
<!-- unpkg -->
<script src="https://unpkg.com/@sgraph-ai/send/sgraph_ai_send/v0/v0.1/v0.1.0/js/crypto.js"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/@sgraph-ai/send/sgraph_ai_send/v0/v0.1/v0.1.0/js/crypto.js"></script>
```

The full upload page (with all layers applied) is at:

```
https://unpkg.com/@sgraph-ai/send/sgraph_ai_send/v0/v0.1/v0.1.6/index.html
```

## Use in HTML

Serve the `sgraph_ai_send/v0/` directory as static files, then load the v0.1.6 entry point:

```html
<!-- CSS -->
<link rel="stylesheet" href="v0/v0.1/v0.1.0/css/common.css">
<link rel="stylesheet" href="v0/v0.1/v0.1.6/css/sg-design-system.css">

<!-- Base layer -->
<script src="v0/v0.1/v0.1.4/js/i18n.js"></script>
<script src="v0/v0.1/v0.1.0/js/crypto.js"></script>
<script src="v0/v0.1/v0.1.0/js/api-client.js"></script>
<script src="v0/v0.1/v0.1.4/components/send-access-gate/send-access-gate.js"></script>
<script src="v0/v0.1/v0.1.4/components/send-upload/send-upload.js"></script>
<script src="v0/v0.1/v0.1.0/components/send-transparency/send-transparency.js"></script>

<!-- v0.1.5 overrides -->
<script src="v0/v0.1/v0.1.5/js/i18n.js"></script>
<script src="v0/v0.1/v0.1.5/components/send-upload/send-upload.js"></script>

<!-- v0.1.6 overrides (design-aware) -->
<script src="v0/v0.1/v0.1.6/js/i18n.js"></script>
<script src="v0/v0.1/v0.1.6/components/send-upload/send-upload.js"></script>
```

Then use the web components:

```html
<send-access-gate>
    <send-upload></send-upload>
</send-access-gate>
```

## Development

### Prerequisites

- Node.js 20 or 22

### Run tests

```bash
npm test
```

Tests verify: file structure integrity, HTML script reference validity, JS content correctness, and package.json publishing configuration. All 38 tests run via Node.js built-in test runner (zero dependencies).

### Project structure

```
sgraph_ai_send/                   # Published to NPM
  index.mjs                       # Package entry point
  Version.mjs                     # Version utility
  version                         # Version file (v0.0.1)
  v0/v0.1/                        # UI components (IFD layers)
    v0.1.0/                       # Base: crypto, api-client, components, CSS
    v0.1.4/                       # i18n, SGMETA envelope, access gate
    v0.1.5/                       # Timings, download history, auto-decrypt
    v0.1.6/                       # Aurora design system, dark theme

tests/unit/                       # Node.js test runner tests
  test_Version.mjs                # Version utility tests
  test_ui_files.mjs               # UI file structure + content tests

.github/
  workflows/
    ci-pipeline.yml               # Base: test (Node 20+22), tag, publish
    ci-pipeline__dev.yml           # Dev: patch bump, npm publish
    ci-pipeline__main.yml          # Main: minor bump, npm publish
  actions/
    git__increment-tag/action.yml  # Auto-tag + version file + package.json
```

### CI/CD pipeline

Every push triggers the full pipeline:

```
push to dev  --> tests --> version bump (patch) --> npm publish
push to main --> tests --> version bump (minor) --> npm publish
```

The auto-tagging action updates three places atomically:
- `sgraph_ai_send/version` (with `v` prefix: `v0.0.2`)
- `package.json` version field (without `v` prefix: `0.0.2`)
- `README.md` release badge

### Version

```javascript
import { version } from '@sgraph-ai/send/version'
console.log(version())  // "v0.0.1"
```

## Related repos

- [`SGraph-AI__App__Send`](https://github.com/the-cyber-boardroom/SGraph-AI__App__Send) -- Full SGraph Send application (Python/FastAPI backend)

## License

MIT
