/**
 * Builda o pacote a partir da FONTE (src/shared/cubs-components) direto para
 * packages/cubs-components/dist: JS (ESM) + .d.ts. É o dist que vai no tarball
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

// tsc do app host (o pacote não tem node_modules próprio)
const tsc = join(appRoot, 'node_modules', 'typescript', 'bin', 'tsc')
execFileSync(process.execPath, [tsc, '-p', join(libRoot, 'tsconfig.build.json')], {
  stdio: 'inherit',
})

/** Todos os .js/.d.ts do dist, RECURSIVO — o pacote tem subpasta (lib/). */
function* emittedFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* emittedFiles(full)
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')) {
      yield full
    }
  }
}

// tsc emite imports relativos sem extensão; ESM (Node e exports map) exige
// './x.js' — corrige em .js e .d.ts para o pacote funcionar fora de bundler.
for (const filePath of emittedFiles(dist)) {
  const source = readFileSync(filePath, 'utf8')
  writeFileSync(
    filePath,
    source.replace(/(from\s+['"])(\.\.?\/[^'"]+?)(['"])/g, (match, before, spec, after) =>
      spec.endsWith('.js') ? match : `${before}${spec}.js${after}`,
    ),
  )
}

console.log(`cubs-components v${pkg.version}: dist gerado em packages/cubs-components/dist`)
