import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

export function version() {
    const versionFile = join(__dirname, 'version')
    return readFileSync(versionFile, 'utf-8').trim()
}
