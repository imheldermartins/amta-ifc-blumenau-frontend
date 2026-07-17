/**
 * Builda a lib a partir da FONTE (src/shared/cubs-database) direto para
 * packages/cubs-database/dist: JS (ESM) + .d.ts. É o dist que vai no tarball
 * do `npm pack` — outro projeto consome só o node_modules, sem TS.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const libRoot = fileURLToPath(new URL('..', import.meta.url))
const appRoot = join(libRoot, '..', '..')
const dist = join(libRoot, 'dist')
const pkg = JSON.parse(readFileSync(join(libRoot, 'package.json'), 'utf8'))

rmSync(dist, { recursive: true, force: true })

// tsc do app host (a lib não tem node_modules próprio)
const tsc = join(appRoot, 'node_modules', 'typescript', 'bin', 'tsc')
execFileSync(process.execPath, [tsc, '-p', join(libRoot, 'tsconfig.build.json')], {
  stdio: 'inherit',
})

// tsc emite imports relativos sem extensão; ESM (Node e exports map) exige
// './x.js' — corrige em .js e .d.ts para o pacote funcionar fora de bundler.
for (const file of readdirSync(dist)) {
  if (!file.endsWith('.js') && !file.endsWith('.d.ts')) continue
  const filePath = join(dist, file)
  const source = readFileSync(filePath, 'utf8')
  writeFileSync(
    filePath,
    source.replace(/(from\s+['"])(\.\.?\/[^'"]+?)(['"])/g, (match, before, spec, after) =>
      spec.endsWith('.js') ? match : `${before}${spec}.js${after}`,
    ),
  )
}

console.log(`cubs-database v${pkg.version}: dist gerado em packages/cubs-database/dist`)
