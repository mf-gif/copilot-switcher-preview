# Chat reaction glyphs — manifest

Branded reaction-emoji set for the AI-assistant chat (`docs/mockups/chat-prototype.html`).
Cinema-themed glyphs replacing system emoji. Labels are the ratified hover-tooltips
(#274 SoT). One PNG per reaction; the prototype loads them as `glyphs/<name>.png`.

## Set — file → reaction / purpose

### Quick-row (the 4 always-visible reactions in the hover bar)
| File | Reaction key | Tooltip label (#274) |
|------|--------------|----------------------|
| `love.png`        | love        | Love at first frame |
| `like.png`        | like        | Director's thumbs-up |
| `fire.png`        | fire        | Fire on set |
| `heart-eyes.png`  | heart-eyes  | Can't look away |

### Rest (the full picker — revealed via ⋯ / more)
| File | Reaction key | Tooltip label (#274) |
|------|--------------|----------------------|
| `clap.png`    | clap   | Standing ovation |
| `wow.png`     | wow    | Plot twist |
| `bold.png`    | bold   | Bold choice |
| `wrap.png`    | wrap   | That's a wrap! |
| `brief.png`   | brief  | Nailed the brief |
| `poster.png`  | poster | Poster-worthy |
| `eye.png`     | eye    | Good eye |
| `cut.png`     | cut    | Cutting-room floor |
| `idea.png`    | idea   | A Cameron-level idea |

13 glyphs total = `QUICK` (4) + `REST` (9), matching the `NAME` map in the prototype.

## Asset state (read before porting)

- **Render:** `.gly { width:20px; height:20px; object-fit:contain }` — each glyph is
  contained into a 20×20 box. Raised 18→20px (owner «20 ок» 2026-06-26 — no
  undersizing reactions).
- **Source dimensions (UNIFORM):** all 13 = **160×160 RGBA**, transparent, equal
  optical height, centred in the square — the owner-ratified slice (contact-sheet
  poштучно-approved 2026-06-26). Replaces the earlier non-uniform dark-baked cut
  («ужасная нарезка, всё поехало» — owner).
- **Background:** **transparent (alpha)** — sits clean on any surface (dark chat,
  light, on-media glass). Byte-identical to the app slices in
  `sceneos-platform/public/reactions/` (#2024).

## Provenance
Owner-authorized branded set (2026-06-25). Source iterations live in
`olive/mockups/glyphs-*.png` (exploration, not canon). This folder is the handoff set.
