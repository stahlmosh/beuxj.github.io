// Lists what is still missing before you publish.  Run: npm run check
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const blockers = []
const optional = []

const siteSrc = readFileSync(join(root, 'src/data/site.ts'), 'utf8')
const str = (re) => re.exec(siteSrc)?.[1]?.trim() ?? ''

if (!str(/email:\s*'([^']*)'/)) blockers.push('Set your email in src/data/site.ts (contact.email).')
if (!/aboutReady\s*=\s*true/.test(siteSrc)) blockers.push('About section is hidden: replace the bio and skills in src/data/site.ts, then set aboutReady = true.')
for (const m of siteSrc.matchAll(/\{\s*id:\s*'(\w+)',\s*label:\s*'([^']+)',\s*url:\s*'([^']*)'/g))
  if (!m[3]) optional.push(`${m[2]} link is empty, so it is hidden (src/data/site.ts).`)
if (/showOpenTo:\s*true/.test(siteSrc) && !str(/openTo:\s*'([^']*)'/)) blockers.push('showOpenTo is true but openTo is empty.')

const listProjects = (dir) =>
  existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => join(dir, d.name)) : []

let live = 0
for (const dir of listProjects(join(root, 'src/content/projects'))) {
  const file = join(dir, 'project.json')
  if (!existsSync(file)) continue
  const name = dir.split(/[\\/]/).pop()
  const raw = readFileSync(file, 'utf8')
  const data = JSON.parse(raw)
  if (data.placeholder || /PLACEHOLDER/i.test(raw)) {
    optional.push(`Project "${name}" is still a placeholder, so it is hidden on the live site. Fill it in and remove "placeholder": true.`)
    continue
  }
  live++
  const files = readdirSync(dir).map((f) => f.replace(/\.[^.]+$/, '').toLowerCase())
  if (!files.includes('cover')) optional.push(`Project "${name}": no cover.png (a drawn placeholder is used).`)
  if (!files.includes('media')) optional.push(`Project "${name}": no media.mp4 (no gameplay clip, no hover preview).`)
  if (!files.some((f) => /^shot[-_ ]?\d*$/.test(f))) optional.push(`Project "${name}": no shot-1.png screenshots.`)
  if (!data.downloadUrl) optional.push(`Project "${name}": no downloadUrl.`)
  if (!data.role) optional.push(`Project "${name}": no role (recruiters look for this).`)
}
if (live === 0) blockers.push('No real games yet: every project is still a placeholder. Run: npm run new-project -- "Game title"')

const engineFile = join(root, 'src/content/engine/project.json')
if (existsSync(engineFile)) {
  const raw = readFileSync(engineFile, 'utf8')
  if (JSON.parse(raw).placeholder || /PLACEHOLDER/i.test(raw))
    optional.push('Physics engine brief is still a placeholder, so the Physics section is hidden on the live site.')
}

const print = (title, list) => {
  if (!list.length) return
  console.log(`\n${title}`)
  for (const l of list) console.log(`  - ${l}`)
}
print(`Fix before launch (${blockers.length})`, blockers)
print(`Nice to have (${optional.length})`, optional)
if (!blockers.length) console.log('\nNothing blocking. You are ready to publish.')
process.exit(blockers.length ? 1 : 0)
