# Stahlmosh — Game Cartridge Portfolio

Vite + React + TypeScript + Tailwind CSS v4. Fonts (Bowlby One, Archivo) are bundled locally via npm.

## Run it (VS Code terminal)

```
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build (http://localhost:4173)
```

## Add a game (it appears in the cartridge library automatically)

```
npm run new-project -- "Game Title" --type "Exploration" --engine Godot --download https://your-link --featured
```

This creates `src/content/projects/game-title/project.json`. Open it and fill in the details.
Drop optional files into the same folder and they are picked up by name:

- `cover.png` (or jpg/webp): art on the cartridge label and project page
- `media.mp4` / `media.gif` / `media.png`: gameplay clip or screenshot
- `poster.png`: poster frame for a video

`project.json` needs `title`, `summary`, `type`. Everything else is optional and simply hidden when empty:
`genre, engine, role, duration, teamSize, challenge, solution, details[], highlights[], downloadUrl, sourceUrl, trailerUrl, accentColor, art`.

- `featured: true` makes it the project shown in the hero ("Now playing"). Without one, the first project is used.
- `order` sets the library order (the scaffold command uses the next number). Without it, projects sort alphabetically after ordered ones.
- Arrows and dots in the library activate once there are more games than fit on a page (4 on desktop, 3 tablet, 1 phone).

## Physics engine

`src/content/engine/project.json` (same fields as a game, plus `details` for the brief). It has its own dark
hazard-stripe cartridge in the Physics section and opens its own project page.

## Contact and links

Set your `email` and the `socials` URLs in `src/data/site.ts`. Empty ones are hidden in the production build
(dashed placeholders show in `npm run dev` so you remember to fill them). Bio and skills are in the same file.

## Motion

All animation lives in `src/effects.css` (plus `src/effects.ts` for scroll reveal and the pointer tilt).
It is switched off automatically for visitors who have "reduce motion" turned on.

## Project page extras and previews

- **Screenshots:** add `shot-1.png`, `shot-2.png`, ... to a project folder. They appear as a gallery with a lightbox. Add `shotAlts` in `project.json` to describe each one.
- **What I'd do differently:** add a `reflection` sentence or two to `project.json`.
- **Next project:** every project page ends with a link to the next cartridge. Nothing to set up.
- **Hover preview:** if a project has `media.mp4` (or a gif), the cartridge in the library plays it on hover. Off on touch screens, with reduced motion and with data saver.

## Going live

- Copy `.env.example` to `.env` and set `VITE_SITE_URL` to your final address. The build then adds the share image and canonical link, so pasted links show a preview card.
- Icons, share image (`public/og-image.png`) and `site.webmanifest` are in `public/`.

## Links and navigation

- `#/project/<folder-name>` opens a game's page. The project page has a "Copy link to this page" button.
- `#/games/<folder-name>` scrolls to the games section with that cartridge loaded in the reader.
- A project link that matches nothing shows a "Game not found" page.
- The loading screen can be skipped (Skip button, click, Enter or Space). After the first game in a visit it plays a shorter version.
- The browser tab title follows the page.

## Before you publish: `npm run check`

Run `npm run check` to list what is still missing (email, real games, About text, links, covers, clips).

On the live site (`npm run build`), anything still marked as a placeholder is hidden:
- Games with `"placeholder": true` in their `project.json` (remove that line once the entry is real).
- The Physics section, until `src/content/engine/project.json` no longer has `"placeholder": true`.
- The About section, until you replace the bio and skills in `src/data/site.ts` and set `aboutReady = true`.
- The nav only lists sections that are showing.

`npm run dev` always shows everything, so you can see the full layout while you work.
The Reader/List switch only appears once you have more than 6 games.

## Interaction

- Library cartridges lean toward your mouse on hover.
- With a mouse or pen you can drag a cartridge into the reader (it glows and says "Drop to insert"). Dropping anywhere else springs it back. Click, keyboard and touch (tap, swipe) work as before.

## Mystery cartridge and toy box

- **Mystery cartridge:** a "???" cartridge at the end of the library. Loading it shows your teaser line and keeps Play locked. Set `teaser` in `src/data/site.ts` to show it on the live site (empty = hidden). `npm run dev` always shows it with a sample line.
- **Toy box:** under the library, your real games drop into a box as cartridges. Drag one to throw it, click one to open that game. It is decorative (hidden from screen readers; the library is the accessible way in), and it only appears when you have real games. Reduced motion shows them lined up instead.

Your socials (GitHub, itch.io, LinkedIn, Instagram, YouTube) are set in `socials` in `src/data/site.ts`; each stays hidden on the live site until you give it a `url`.

The GitHub, itch.io, LinkedIn, Instagram and YouTube marks in Contact are the services' own logos (icon paths from simple-icons, CC0), used only to show which service each link goes to.
