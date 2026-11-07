// Creates src/content/projects/<slug>/project.json so a new cartridge appears in the library.
// Usage (add --asset for something you sell or share, e.g. an environment pack): npm run new-project -- "My Game" --type Horror --engine Unreal --download https://...
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

const flags = {}
const words = []
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2)
    const next = args[i + 1]
    if (next === undefined || next.startsWith('--')) flags[key] = true
    else {
      flags[key] = next
      i++
    }
  } else words.push(args[i])
}

const title = words.join(' ').trim()
if (!title) {
  console.log('Usage: npm run new-project -- "Game title" [--asset] [--type Horror] [--engine Unreal] [--genre ...] [--role ...]')
  console.log('         [--duration ...] [--team ...] [--summary "..."] [--download URL] [--trailer URL] [--source URL] [--featured]')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
if (!slug) {
  console.log('Please use letters or numbers in the title.')
  process.exit(1)
}

const dir = join(root, 'src', 'content', 'projects', slug)
if (existsSync(dir)) {
  console.log(`A project called "${slug}" already exists: ${dir}`)
  process.exit(1)
}

// Put the new game last in the library: one step after the highest existing "order".
const projectsDir = join(root, 'src', 'content', 'projects')
let maxOrder = 0
for (const name of existsSync(projectsDir) ? readdirSync(projectsDir) : []) {
  try {
    const o = JSON.parse(readFileSync(join(projectsDir, name, 'project.json'), 'utf8')).order
    if (typeof o === 'number' && o > maxOrder) maxOrder = o
  } catch {
    /* no project.json in this folder, ignore */
  }
}

const str = (v) => (typeof v === 'string' ? v : undefined)
const data = {
  title,
  summary: str(flags.summary) ?? 'Write one or two sentences about the game.',
  type: str(flags.type) ?? (flags.asset ? 'Environment Asset' : 'Game'),
  kind: flags.asset ? 'asset' : undefined,
  genre: str(flags.genre),
  engine: str(flags.engine),
  role: str(flags.role),
  duration: str(flags.duration),
  teamSize: str(flags.team),
  downloadUrl: str(flags.download),
  trailerUrl: str(flags.trailer),
  sourceUrl: str(flags.source),
  featured: flags.featured ? true : undefined,
  order: maxOrder + 1,
}
const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))

mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'project.json'), JSON.stringify(clean, null, 2) + '\n')

console.log(`Created src/content/projects/${slug}/project.json`)
console.log('Next: edit that file, then drop cover.png (cartridge art) and media.mp4 / media.gif (gameplay) into the same folder.')
