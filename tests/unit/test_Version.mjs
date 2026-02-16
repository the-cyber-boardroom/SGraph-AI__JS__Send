import { describe, it }  from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync }       from 'node:fs'
import { fileURLToPath }    from 'node:url'
import { dirname, join }    from 'node:path'
import { version }          from '../../sgraph_ai_send/Version.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const versionFilePath = join(__dirname, '..', '..', 'sgraph_ai_send', 'version')

describe('Version', () => {

    it('version() returns a string', () => {
        const v = version()
        assert.equal(typeof v, 'string')
    })

    it('version() starts with v', () => {
        const v = version()
        assert.ok(v.startsWith('v'), `Expected version to start with "v", got "${v}"`)
    })

    it('version() matches semver pattern vX.Y.Z', () => {
        const v = version()
        const semverPattern = /^v\d+\.\d+\.\d+$/
        assert.match(v, semverPattern, `Expected version to match vX.Y.Z pattern, got "${v}"`)
    })

    it('version file exists and is readable', () => {
        assert.ok(existsSync(versionFilePath), `Version file not found at ${versionFilePath}`)
    })
})
