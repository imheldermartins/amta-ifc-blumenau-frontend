/**
 * Incrementa a versão do pacote em +0.1 (0.1.0 → 0.2.0 → ... → 0.9.0 → 1.0.0):
 * atualiza packages/cubs-components/package.json e carimba o version.ts na
 * FONTE (src/shared/cubs-components). O dist é gerado no build/pack.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const libRoot = fileURLToPath(new URL('..', import.meta.url))
const pkgPath = join(libRoot, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

const previous = pkg.version
const [major, minor] = previous.split('.').map(Number)
const next = minor >= 9 ? `${major + 1}.0.0` : `${major}.${minor + 1}.0`

pkg.version = next
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

const versionPath = join(libRoot, '..', '..', 'src', 'shared', 'cubs-components', 'version.ts')
const versionSource = readFileSync(versionPath, 'utf8')
writeFileSync(
  versionPath,
  versionSource.replace(/CUBS_COMPONENTS_VERSION = '[^']*'/, `CUBS_COMPONENTS_VERSION = '${next}'`),
)

console.log(`cubs-components: ${previous} → ${next}`)
console.log('Para gerar o pacote instalável: npm run cubs-components:pack')
