# Stahlmosh — Game Cartridge Portfolio

Vite + React + TypeScript + Tailwind CSS v4. Fonts (Bowlby One, Archivo) are bundled locally via npm.

## Run it (VS Code integrated terminal)

```
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build (http://localhost:4173)
```

## Edit your content

Everything lives in **`src/data/site.ts`**: projects, links, resume, bio, skills and experiments.
Anything you leave out is simply not shown on the site.

Per project you can set: `title, summary, type, genre, engine, role, duration, teamSize, challenge, solution,
accentColor (cartridge colour), coverImage, mediaType + mediaSrc (+ posterSrc), downloadUrl, trailerUrl, sourceUrl`.

- Media files go in `public/` and are referenced as `/media/your-file.mp4`.
- Resume: put a PDF in `public/` and set `resume.url` (for example `/resume.pdf`).
- Palette: the `@theme` block at the top of `src/index.css`.
- Logo art: `public/stahlmosh.webp` (hero + about poster), `public/favicon.png`.
- In `npm run dev` you will see small grey notes where a link is missing (for example the Download button). They are hidden in the production build.

## How it works

Press a cartridge in the library to slot it into the reader, then press **Play**. A loading screen plays and
you land on that project's own page (`#/project/<id>`) with its art, details and download link. Back returns to
the same spot on the home page. "List" switches to a plain list of the same projects.
