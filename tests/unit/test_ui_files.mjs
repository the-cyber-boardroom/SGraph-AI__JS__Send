import { describe, it }    from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath }   from 'node:url'
import { dirname, join }   from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const root       = join(__dirname, '..', '..')
const uiRoot     = join(root, 'sgraph_ai_send', 'v0', 'v0.1')

describe('UI file structure', () => {

    // ─── Required versions ──────────────────────────────────────────────
    const requiredVersions = ['v0.1.0', 'v0.1.4', 'v0.1.5', 'v0.1.6']

    for (const ver of requiredVersions) {
        it(`${ver} directory exists`, () => {
            assert.ok(existsSync(join(uiRoot, ver)), `Missing ${ver} directory`)
        })
    }

    // ─── v0.1.0 shared files ────────────────────────────────────────────
    const v010Files = [
        'js/crypto.js',
        'js/api-client.js',
        'css/common.css',
        'components/send-access-gate/send-access-gate.js',
        'components/send-upload/send-upload.js',
        'components/send-download/send-download.js',
        'components/send-transparency/send-transparency.js',
        'index.html',
        'download.html',
    ]

    for (const file of v010Files) {
        it(`v0.1.0/${file} exists`, () => {
            assert.ok(existsSync(join(uiRoot, 'v0.1.0', file)), `Missing v0.1.0/${file}`)
        })
    }

    // ─── v0.1.6 files ──────────────────────────────────────────────────
    const v016Files = [
        'js/i18n.js',
        'css/sg-design-system.css',
        'components/send-upload/send-upload.js',
        'components/send-download/send-download.js',
        'index.html',
        'download.html',
    ]

    for (const file of v016Files) {
        it(`v0.1.6/${file} exists`, () => {
            assert.ok(existsSync(join(uiRoot, 'v0.1.6', file)), `Missing v0.1.6/${file}`)
        })
    }

    // ─── v0.1.4 i18n translations ───────────────────────────────────────
    const i18nLocales = ['en.json', 'pt.json', 'pt-PT.json', 'tlh.json']

    for (const locale of i18nLocales) {
        it(`v0.1.4/i18n/${locale} exists and is valid JSON`, () => {
            const path = join(uiRoot, 'v0.1.4', 'i18n', locale)
            assert.ok(existsSync(path), `Missing v0.1.4/i18n/${locale}`)
            const content = readFileSync(path, 'utf-8')
            assert.doesNotThrow(() => JSON.parse(content), `Invalid JSON in ${locale}`)
        })
    }
})

describe('v0.1.6 HTML script references', () => {

    it('index.html references only existing files', () => {
        const html = readFileSync(join(uiRoot, 'v0.1.6', 'index.html'), 'utf-8')
        const srcPattern = /src="([^"]+\.js)"/g
        let match
        while ((match = srcPattern.exec(html)) !== null) {
            const relPath = match[1]
            const absPath = join(uiRoot, 'v0.1.6', relPath)
            assert.ok(existsSync(absPath), `index.html references missing file: ${relPath}`)
        }
    })

    it('download.html references only existing files', () => {
        const html = readFileSync(join(uiRoot, 'v0.1.6', 'download.html'), 'utf-8')
        const srcPattern = /src="([^"]+\.js)"/g
        let match
        while ((match = srcPattern.exec(html)) !== null) {
            const relPath = match[1]
            const absPath = join(uiRoot, 'v0.1.6', relPath)
            assert.ok(existsSync(absPath), `download.html references missing file: ${relPath}`)
        }
    })

    it('index.html references only existing CSS files', () => {
        const html = readFileSync(join(uiRoot, 'v0.1.6', 'index.html'), 'utf-8')
        const hrefPattern = /href="([^"]+\.css)"/g
        let match
        while ((match = hrefPattern.exec(html)) !== null) {
            const relPath = match[1]
            const absPath = join(uiRoot, 'v0.1.6', relPath)
            assert.ok(existsSync(absPath), `index.html references missing CSS: ${relPath}`)
        }
    })
})

describe('JS files are well-formed', () => {

    it('v0.1.0/js/crypto.js contains SendCrypto', () => {
        const content = readFileSync(join(uiRoot, 'v0.1.0', 'js', 'crypto.js'), 'utf-8')
        assert.ok(content.includes('SendCrypto'), 'crypto.js should define SendCrypto')
        assert.ok(content.includes('AES-GCM'), 'crypto.js should use AES-GCM')
    })

    it('v0.1.0/js/api-client.js contains ApiClient', () => {
        const content = readFileSync(join(uiRoot, 'v0.1.0', 'js', 'api-client.js'), 'utf-8')
        assert.ok(content.includes('ApiClient'), 'api-client.js should define ApiClient')
    })

    it('v0.1.6/js/i18n.js patches I18n strings', () => {
        const content = readFileSync(join(uiRoot, 'v0.1.6', 'js', 'i18n.js'), 'utf-8')
        assert.ok(content.includes('I18n.strings'), 'i18n.js should patch I18n.strings')
    })

    it('v0.1.6/components/send-upload patches SendUpload prototype', () => {
        const content = readFileSync(join(uiRoot, 'v0.1.6', 'components', 'send-upload', 'send-upload.js'), 'utf-8')
        assert.ok(content.includes('SendUpload.prototype'), 'should patch SendUpload.prototype')
    })

    it('v0.1.6/components/send-download patches SendDownload prototype', () => {
        const content = readFileSync(join(uiRoot, 'v0.1.6', 'components', 'send-download', 'send-download.js'), 'utf-8')
        assert.ok(content.includes('SendDownload.prototype'), 'should patch SendDownload.prototype')
    })
})

describe('package.json is configured for publishing', () => {

    it('has files field including sgraph_ai_send/', () => {
        const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))
        assert.ok(Array.isArray(pkg.files), 'package.json must have files array')
        assert.ok(pkg.files.includes('sgraph_ai_send/'), 'files should include sgraph_ai_send/')
    })

    it('has publishConfig with public access', () => {
        const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))
        assert.ok(pkg.publishConfig, 'package.json must have publishConfig')
        assert.equal(pkg.publishConfig.access, 'public')
    })

    it('has repository and homepage fields', () => {
        const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))
        assert.ok(pkg.repository, 'package.json must have repository')
        assert.ok(pkg.homepage, 'package.json must have homepage')
    })
})
