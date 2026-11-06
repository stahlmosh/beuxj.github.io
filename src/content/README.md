# Content

## Add a game (a new cartridge)

Fastest way, from the VS Code terminal:

```
npm run new-project -- "My Game" --type Horror --engine Unreal --download https://example.com/my-game.zip
```

This creates `src/content/projects/my-game/project.json`. Open it, fill in the details, and the cartridge
appears in the library (the dev server updates by itself).

Or do it by hand: make a folder `src/content/projects/<name>/` with a `project.json` inside.

### Images and video

Drop files into the project's folder. These names are picked up automatically:

| File                       | Used for                                   |
| -------------------------- | ------------------------------------------ |
| `cover.png` / `.jpg` / `.webp` | the artwork on the cartridge label     |
| `media.mp4` / `.webm` / `.gif` / `.png` | gameplay shown on the project page |
| `poster.png`               | poster frame for a video                   |
| `shot-1.png`, `shot-2.jpg` ... | screenshots, shown as a gallery with a lightbox |

No file? A drawn placeholder is used.

### project.json fields

Required: `title`, `summary`, `type`.
Optional: `genre`, `engine`, `role`, `duration`, `teamSize`, `challenge`, `solution`, `details` (list of paragraphs),
`highlights` (list of short points), `downloadUrl`, `trailerUrl`, `sourceUrl`, `accentColor` (cartridge colour, e.g. `"#8fd6b4"`),
`reflection` (shown as "What I'd do differently"), `shotAlts` (list of alt texts for the screenshots, in order),
`featured` (`true` = shown in the hero), `order` (library order, lowest first).
Anything you leave out simply is not shown. Remove `"placeholder": true` when the entry is real.

## Physics engine

`src/content/engine/project.json`: same fields and the same image/video file names. It appears in its own section
with its own cartridge and opens a full brief page.
