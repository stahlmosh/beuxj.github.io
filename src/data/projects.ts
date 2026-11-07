import { teaser, type ArtKind, type Project } from './site'

/**
 * Loads projects from src/content. Each project is a folder:
 *
 *   src/content/projects/<name>/project.json   (required)
 *   src/content/projects/<name>/cover.png      (optional: label art for the cartridge)
 *   src/content/projects/<name>/media.mp4      (optional: gameplay video / gif / image)
 *   src/content/projects/<name>/poster.png     (optional: video poster frame)
 *   src/content/projects/<name>/shot-1.png ... (optional: screenshots for the gallery)
 *
 * The physics engine lives in src/content/engine/ and works the same way.
 * Vite picks files up automatically, so adding a folder is all it takes.
 */

type Raw = Partial<Omit<Project, 'id'>> & { id?: string }

const projectFiles = import.meta.glob<Raw>('../content/projects/*/project.json', { eager: true, import: 'default' })
const engineFiles = import.meta.glob<Raw>('../content/engine/project.json', { eager: true, import: 'default' })
const assets = import.meta.glob<string>('../content/**/*.{png,jpg,jpeg,webp,gif,svg,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const PALETTE = ['#8fd6b4', '#ff7f6e', '#ffd36b', '#ffa66b']
/** Assets get cooler colours so they read as a different kind of cartridge. */
const ASSET_PALETTE = ['#7fc8e8', '#9fd8cf', '#b9a8f0', '#8fb7ee']
const ARTS: ArtKind[] = ['terrain', 'eye', 'orbit', 'cube']

const isUrl = (v: string) => /^(\/|https?:\/\/|data:)/.test(v)

function assetResolver(dir: string) {
  const prefix = `${dir}/`
  const names = Object.keys(assets).filter((k) => k.startsWith(prefix))
  return {
    /** A value from project.json: full URL, /public path, or a file name inside the project folder. */
    url(value?: string): string | undefined {
      if (!value) return undefined
      return isUrl(value) ? value : assets[`${prefix}${value}`]
    },
    /** Every file named shot-1.png, shot-2.jpg, ... in natural order. */
    autoAll(base: string): string[] {
      const re = new RegExp(`^${base}[-_ ]?\\d*$`, 'i')
      return names
        .filter((k) => re.test(k.slice(prefix.length).replace(/\.[^.]+$/, '')))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((k) => assets[k])
    },
    /** Convention: a file called cover.* / media.* / poster.* is picked up automatically. */
    auto(base: string): string | undefined {
      const hit = names.find((k) => k.slice(prefix.length).replace(/\.[^.]+$/, '').toLowerCase() === base)
      return hit ? assets[hit] : undefined
    },
  }
}

const mediaTypeOf = (src: string): Project['mediaType'] =>
  /\.(mp4|webm)(\?|$)/i.test(src) ? 'video' : /\.gif(\?|$)/i.test(src) ? 'gif' : 'image'

/** Stable pick from a list based on the folder name, so adding a game never changes the others' look. */
function pick<T>(list: T[], key: string): T {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return list[h % list.length]
}

function build(raw: Raw, dir: string, slug: string): Project | null {
  if (!raw.title || !raw.summary || !raw.type) {
    if (import.meta.env.DEV) console.warn(`[content] ${dir}/project.json needs "title", "summary" and "type". Skipped.`)
    return null
  }
  const files = assetResolver(dir)
  const mediaSrc = files.url(raw.mediaSrc) ?? files.auto('media')
  return {
    ...raw,
    id: raw.id ?? slug,
    coverImage: files.url(raw.coverImage) ?? files.auto('cover'),
    mediaSrc,
    mediaType: raw.mediaType ?? (mediaSrc ? mediaTypeOf(mediaSrc) : undefined),
    posterSrc: files.url(raw.posterSrc) ?? files.auto('poster'),
    shots: raw.shots?.length ? raw.shots.map((s) => files.url(s)).filter((s): s is string => !!s) : files.autoAll('shot'),
    accentColor: raw.accentColor ?? pick(raw.kind === 'asset' ? ASSET_PALETTE : PALETTE, slug),
    art: raw.art ?? pick(ARTS, slug),
  } as Project
}

const slugOf = (path: string) => path.split('/').slice(-2, -1)[0]
const dirOf = (path: string) => path.slice(0, path.lastIndexOf('/'))

/** Entries still marked "placeholder": true show in `npm run dev` only, never on the live site. */
const isLive = (p: Project) => import.meta.env.DEV || !p.placeholder

/** Library cartridges, in order. */
export const projects: Project[] = Object.entries(projectFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, raw]) => build(raw, dirOf(path), slugOf(path)))
  .filter((p): p is Project => p !== null && isLive(p))
  .sort((a, b) => (a.order ?? 1e6) - (b.order ?? 1e6))

/** The physics engine, shown in its own section with its own cartridge. */
export const engine: Project | undefined = Object.entries(engineFiles)
  .map(([path, raw]) => build({ variant: 'engine', art: 'physics', ...raw }, dirOf(path), 'physics-engine'))
  .find((p): p is Project => p !== null && isLive(p))

export const isAsset = (p?: Project) => p?.kind === 'asset'

/** The two shelves of the library. */
export const games: Project[] = projects.filter((p) => !isAsset(p))
export const assetProjects: Project[] = projects.filter(isAsset)

export const featuredProject: Project | undefined = games.find((p) => p.featured) ?? games[0]

export const findProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id) ?? (engine?.id === id ? engine : undefined)

/** The "???" cartridge shown after the real games. Only when a teaser is set (always in dev). */
export const mystery: Project | undefined =
  teaser || import.meta.env.DEV
    ? {
        id: 'mystery',
        title: '???',
        summary: teaser || 'Dev preview: write your teaser in src/data/site.ts (teaser).',
        type: 'Case open',
        art: 'mystery',
        accentColor: '#5b4a44',
        variant: 'mystery',
      }
    : undefined
