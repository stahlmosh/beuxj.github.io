/**
 * Site-wide settings: name, contact, social links, bio and skills.
 *
 * Projects are NOT in this file. Each project is a folder in
 * src/content/projects/<name>/ (see src/content/README.md). Add a folder and
 * a new cartridge appears in the library.
 *
 * Anything you leave empty is simply not shown on the live site.
 * (In `npm run dev`, missing links show as dashed placeholders so you can see where they go.)
 */

export type ArtKind = 'terrain' | 'eye' | 'orbit' | 'cube' | 'physics' | 'mystery'

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
  /** Optional honest note shown as "What I'd do differently". */
  reflection?: string
  /** Screenshots shown as a gallery with a lightbox. Auto-filled from files named shot-1.png, shot-2.jpg ... */
  shots?: string[]
  /** Alt text for each screenshot, in order (recommended). */
  shotAlts?: string[]
  /** Extra paragraphs shown under the summary on the project page. */
  details?: string[]
  /** Short bullet-style points shown as chips. */
  highlights?: string[]
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
  /** Show this project in the hero. If none is marked, the first project is used. */
  featured?: boolean
  /** Library order, lowest first. Projects without one go last, sorted by folder name. */
  order?: number

  kind?: 'game' | 'asset'
  /** "engine" gives the cartridge its dark dev-cartridge look (used by the physics engine). */
  variant?: 'engine' | 'mystery'
  /** Dev-only reminder (hidden on the live site). Remove when the entry is real. */
  placeholder?: boolean
}

export interface LinkItem {
  id: string
  label: string
  /** Leave empty until you have the real URL. */
  url?: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export const site = {
  name: 'Stahlmosh',
  descriptor: 'Game Developer / Designer',
  /** The "Open to work" strip in the hero. Flip this to true to show it, false to hide it. */
  showOpenTo: false,
  /** What you are open to. Example: 'Gameplay programming · Systems design · Tools' */
  openTo: '',
}

/**
 * The mystery cartridge: a "???" cartridge at the end of the library. Loading it shows this line and keeps Play locked.
 * Write a teaser to show it on the live site, e.g. 'Case still open.' Leave empty to hide it.
 * (In `npm run dev` it always shows, with a sample line, so you can see it.)
 */
export const teaser = 'The Replacement: Work in progress'

/** Optional: e.g. 'India' or 'the State of California, USA'. Leave empty to omit the "Governing law" clause. */
export const legal = {
  governingLaw: '',
}

/** Contact section. Leave `email` empty to hide the email button. */
export const contact = {
  email: 'stahlmosh.dev@gmail.com',
  line: 'Got a project in mind? Say hello.',
}

/** Social links. Fill in `url` for each. */
export const socials: LinkItem[] = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/stahlmosh' },
  { id: 'itch', label: 'itch.io', url: 'https://stahlmosh.itch.io' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ritvik-paul-022bb6386/' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/stahlmosh.dev/' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@Moshcreates' },
]

/** Links that are set, plus (in dev only) the missing ones so you can see where they go. */
export const visibleLinks = (links: LinkItem[]) => links.filter((l) => l.url || import.meta.env.DEV)

/**
 * The About section is hidden on the live site until you set this to true.
 * Replace the bio and skills below first. (In `npm run dev` it always shows, so you can see the layout.)
 */
export const aboutReady = true
export const showAbout = import.meta.env.DEV || aboutReady

export const bio = [
  'I\'m a Computer Science student exploring game development, learning through experimentation, mistakes, and building things from scratch. After years of playing games, I started craving something different. Eventually, I decided to stop looking for it and try creating it myself.',
  'My goal is to make something I\'d want to play. Hopefully, you\'ll want to play it too.',
]

/** PLACEHOLDER: groups mirror the areas named in the brief. Edit, add or remove freely. */
export const skillGroups: SkillGroup[] = [
  { title: 'Engines', items: ['Unreal Engine', 'Godot'] },
  { title: 'Programming', items: ['C++', 'GDScript', 'Python', 'HTML/CSS/JS'] },
  { title: '3D & art', items: ['Blender'] },
  { title: 'Physics', items: ['Physics engine'] },
]
