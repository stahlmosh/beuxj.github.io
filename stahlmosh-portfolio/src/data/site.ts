/**
 * All editable portfolio content lives in this file.
 *
 * Entries marked PLACEHOLDER are examples so the layout can be seen. Replace
 * them with real information. Any optional field you leave out is simply not
 * shown on the site; nothing is invented for you.
 *
 * Media files: put them in /public (for example public/media/mossfall.mp4) and
 * reference them with a leading slash ("/media/mossfall.mp4").
 */

export type ArtKind = 'terrain' | 'eye' | 'orbit' | 'cube'

export interface Project {
  id: string
  title: string
  summary: string
  /** Project type shown on the cartridge stripe, e.g. "Exploration", "Horror". */
  type: string
  genre?: string
  engine?: string
  role?: string
  duration?: string
  teamSize?: string
  challenge?: string
  solution?: string
  /** Label artwork for the cartridge. Falls back to a drawn placeholder (see `art`). */
  coverImage?: string
  /** Gameplay media shown on the project page. */
  mediaType?: 'video' | 'gif' | 'image'
  mediaSrc?: string
  /** Poster frame for click-to-play video. */
  posterSrc?: string
  mediaAlt?: string
  /** Where people can download the game. */
  downloadUrl?: string
  sourceUrl?: string
  trailerUrl?: string
  /** Cartridge shell colour. Pastel / mid-light colours look best. */
  accentColor?: string
  /** Which drawn placeholder artwork to use when there is no coverImage. */
  art?: ArtKind
  /** Dev-only reminder (hidden in the production build). Remove when the entry is real. */
  placeholder?: boolean
}

export interface LinkItem {
  id: string
  label: string
  /** Leave empty until you have the real URL. A placeholder is shown instead. */
  url?: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface Experiment {
  id: string
  title: string
  summary: string
  url?: string
}

/* ------------------------------------------------------------------ */

export const site = {
  name: 'Stahlmosh',
  descriptor: 'Game Developer / Designer',
}

/** Social links. Fill in `url` for each; missing ones render as clearly marked placeholders. */
export const socials: LinkItem[] = [
  { id: 'github', label: 'GitHub', url: '' },
  { id: 'itch', label: 'itch.io', url: '' },
  { id: 'linkedin', label: 'LinkedIn', url: '' },
]

/** Resume: point `url` at a PDF in /public (e.g. "/resume.pdf") or any link. */
export const resume = {
  label: 'Resume',
  url: '',
}

export const bio = [
  'PLACEHOLDER: write two or three sentences about who you are and what you make.',
  'Mention the kinds of worlds you like building and the systems you like digging into.',
]

/** PLACEHOLDER: groups mirror the areas named in the brief. Edit, add or remove freely. */
export const skillGroups: SkillGroup[] = [
  { title: 'Game design', items: ['Systems design', 'Level & environment design'] },
  { title: 'Engines', items: ['Unreal Engine', 'Godot'] },
  { title: '3D & art', items: ['Blender'] },
  { title: 'Programming', items: ['Gameplay code', 'Tools'] },
  { title: 'Physics', items: ['Physics engine'] },
]

/**
 * Featured projects (3-4 look best). PLACEHOLDER entries: replace titles,
 * summaries, links and media with real ones.
 *
 * Optional fields to add per project:
 *   genre, role, duration, teamSize, challenge, solution,
 *   coverImage, mediaType + mediaSrc (+ posterSrc), mediaAlt,
 *   downloadUrl, sourceUrl, trailerUrl
 */
export const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Untitled Exploration',
    summary: 'Placeholder for an exploration game. Replace this with a sentence or two about the project.',
    type: 'Exploration',
    engine: 'Godot',
    accentColor: '#8fd6b4',
    art: 'terrain',
    placeholder: true,
  },
  {
    id: 'project-02',
    title: 'Untitled Horror',
    summary: 'Placeholder for a horror project. Replace this with a sentence or two about the project.',
    type: 'Horror',
    engine: 'Unreal',
    accentColor: '#ff7f6e',
    art: 'eye',
    placeholder: true,
  },
  {
    id: 'project-03',
    title: 'Untitled Physics',
    summary: 'Placeholder for a physics-driven project. Replace this with a sentence or two about the project.',
    type: 'Physics',
    engine: 'Custom',
    accentColor: '#ffd36b',
    art: 'orbit',
    placeholder: true,
  },
  {
    id: 'project-04',
    title: 'Untitled Prototype',
    summary: 'Placeholder for a prototype. Replace this with a sentence or two about the project.',
    type: 'Prototype',
    engine: 'Godot',
    accentColor: '#ffa66b',
    art: 'cube',
    placeholder: true,
  },
]

/** Technical experiments shown in the Experiments section. */
export const experiments: Experiment[] = [
  { id: 'physics-engine', title: 'Physics engine', summary: 'PLACEHOLDER: what you are building and what you are learning from it.' },
  { id: 'experiment-02', title: 'Experiment slot', summary: 'PLACEHOLDER: a prototype, tool or technique worth showing.' },
  { id: 'experiment-03', title: 'Experiment slot', summary: 'PLACEHOLDER: another prototype, tool or technique.' },
]

/** Header links, in order. Resume is appended from the `resume` config. */
export const headerLinks: LinkItem[] = [...socials, { id: 'resume', label: resume.label, url: resume.url }]
