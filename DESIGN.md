# DESIGN.md — 不舒服雷达探测器 Relationship Radar

> Version: 0.1 · Mobile-first web app · Target: 18-25 female users

## Visual Theme & Atmosphere

Warm, grounded, trustworthy. The feeling of a calm, capable older sister — not a clinical tool, not a cute toy. Clean surfaces with generous whitespace. Photography and content carry hierarchy, not decoration.

**Mood:** Self-care brand meets editorial clarity. Think Glossier meets The Cut.
**Density:** Airy — generous spacing, one thing at a time.
**Philosophy:** Only necessary elements. Every pixel earns its place.

---

## Color Palette & Roles

Warm neutrals as the canvas. One accent color used sparingly — moments of warmth, not saturation.

### Core

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#FAF8F5` | Page background — warm ivory, not cold white |
| `surface` | `#FFFFFF` | Cards, inputs, elevated surfaces |
| `surface-soft` | `#F5F0EB` | Subtle fills, tab backgrounds, divider bands |
| `ink` | `#2D2926` | Primary text — warm near-black, never pure black |
| `ink-secondary` | `#6B635B` | Secondary text, descriptions, meta info |
| `ink-muted` | `#A39E97` | Placeholder text, disabled states, timestamps |
| `hairline` | `#E8E3DD` | Borders, dividers, card outlines |
| `hairline-soft` | `#F0EBE5` | Subtle section separators |

### Accent

| Token | Hex | Role |
|---|---|---|
| `accent` | `#C4694A` | Primary CTA, active states, key indicators — warm terracotta |
| `accent-hover` | `#A8563B` | Hover/press state |
| `accent-soft` | `#F5E6DF` | Light accent fill for badges, tags, highlights |
| `on-accent` | `#FFFFFF` | Text on accent backgrounds |

### Signal (used in analysis results only)

| Token | Hex | Role |
|---|---|---|
| `signal-danger` | `#C45A5A` | High risk — muted red, not alarming |
| `signal-danger-soft` | `#FAEAEA` | Light danger background |
| `signal-warning` | `#C4944A` | Medium risk — warm amber |
| `signal-warning-soft` | `#FAF0E0` | Light warning background |
| `signal-safe` | `#5E8F6B` | Low risk / positive — sage green |
| `signal-safe-soft` | `#E8F2EB` | Light safe background |

---

## Typography Rules

**Font family:** `Inter, -apple-system, system-ui, 'Segoe UI', sans-serif`
Inter: clean, modern, readable at small sizes, friendly without being childish.

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display` | 28px | 600 | 1.2 | Page title "不舒服雷达探测器" |
| `heading-1` | 22px | 600 | 1.3 | Section titles (信号标注, 行为模式) |
| `heading-2` | 18px | 600 | 1.35 | Card titles, modal headers |
| `heading-3` | 16px | 600 | 1.4 | Sub-section titles |
| `body` | 15px | 400 | 1.6 | Primary body text |
| `body-medium` | 15px | 500 | 1.6 | Emphasized body (quotes, suggestions) |
| `small` | 13px | 400 | 1.5 | Meta info, timestamps, captions |
| `small-medium` | 13px | 500 | 1.5 | Tags, badges, labels |
| `button` | 15px | 500 | 1.3 | Button text |
| `micro` | 12px | 500 | 1.4 | Chip text, score labels |

### Typography Principles

- No type larger than 28px. Content is the hero, not the headline.
- Weight 600 for headings, 500 for interactive elements, 400 for body. No 700/bold.
- Line-height generous (1.5+) for body — this is a reading-heavy app.

---

## Component Stylings

### Buttons

| Variant | BG | Text | Radius | Padding | Height |
|---|---|---|---|---|---|
| `primary` | `#C4694A` | `#FFFFFF` | 12px | 16px 24px | 48px |
| `primary-hover` | `#A8563B` | `#FFFFFF` | 12px | — | — |
| `secondary` | `#FFFFFF` | `#2D2926` | 12px | 15px 23px | 48px |
| `secondary` border | 1px `#E8E3DD` | — | — | — | — |
| `ghost` | transparent | `#6B635B` | 8px | 8px 12px | auto |
| `chip` | `#F5F0EB` | `#6B635B` | 9999px | 8px 16px | 36px |
| `chip-active` | `#F5E6DF` | `#C4694A` | 9999px | 8px 16px | 36px |

All buttons: `cursor: pointer`, `transition: 150ms ease`. No shadows on buttons.

### Cards

| Variant | BG | Radius | Padding | Border |
|---|---|---|---|---|
| `card` | `#FFFFFF` | 16px | 20px | 1px `#E8E3DD` |
| `card-signal-danger` | `#FFFFFF` | 16px | 20px | 1px `#C45A5A` left-border 3px |
| `card-signal-warning` | `#FFFFFF` | 16px | 20px | 1px `#C4944A` left-border 3px |
| `card-signal-safe` | `#FFFFFF` | 16px | 20px | 1px `#5E8F6B` left-border 3px |

Cards have no shadow at rest. Hover: `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`.

### Tags / Badges

| Variant | BG | Text | Radius | Padding |
|---|---|---|---|---|
| `tag-danger` | `#FAEAEA` | `#C45A5A` | 6px | 4px 10px |
| `tag-warning` | `#FAF0E0` | `#C4944A` | 6px | 4px 10px |
| `tag-safe` | `#E8F2EB` | `#5E8F6B` | 6px | 4px 10px |
| `tag-neutral` | `#F5F0EB` | `#6B635B` | 6px | 4px 10px |

Font: `small-medium` (13px/500).

### Input / Textarea

| State | BG | Border | Radius | Padding | Height |
|---|---|---|---|---|---|
| `default` | `#FFFFFF` | 1px `#E8E3DD` | 12px | 14px 16px | 48px (input) |
| `focus` | `#FFFFFF` | 2px `#C4694A` | 12px | — | — |
| `textarea` | `#FFFFFF` | 1px `#E8E3DD` | 12px | 16px | 140px |

Placeholder text: `ink-muted` (#A39E97).

### Tab Switch

| State | BG | Text | Radius |
|---|---|---|---|
| `tab-container` | `#F5F0EB` | — | 12px |
| `tab-active` | `#FFFFFF` | `#2D2926` weight 500 | 10px |
| `tab-inactive` | transparent | `#A39E97` weight 400 | — |

Container padding: 4px. Tab padding: 10px 0. Shadow on active: `0 1px 3px rgba(0,0,0,0.06)`.

### Upload Area

Dashed border: 2px `#E8E3DD`. Radius: 16px. Padding: 40px. Hover: border-color `#C4694A`, bg `#FAF8F5`.
Icon: 48x48px, color `#A39E97`, hover `#C4694A`.

### Progress Bar

Track: `#F5F0EB`, height 6px, radius 3px.
Fill: gradient from `#C4694A` to `#D4836A`. Radius 3px.

### Score Display

Number: `display` (28px/600), color `accent`.
Label: `small` (13px/400), color `ink-secondary`.

---

## Layout Principles

### Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Inline icon gaps |
| `sm` | 8px | Tight element spacing |
| `md` | 12px | Card internal gaps |
| `base` | 16px | Default spacing between elements |
| `lg` | 24px | Section internal padding |
| `xl` | 32px | Between major sections |
| `xxl` | 48px | Page-level breathing room |

### Grid

- Max width: 420px (mobile viewport, centered)
- Page padding: 20px horizontal
- Card gap: 12px

### Whitespace Philosophy

Generous. Each section gets at least 32px vertical breathing room. Input and report are visually separated by a subtle divider or 48px gap. Never stack cards without spacing.

---

## Depth & Elevation

Flat by default. Depth is minimal and functional.

| Level | Shadow | Usage |
|---|---|---|
| 0 | none | Default — 95% of surfaces |
| 1 | `0 1px 3px rgba(0,0,0,0.06)` | Active tab, hover cards |
| 2 | `0 4px 12px rgba(0,0,0,0.08)` | Floating elements, sticky input bar |

No decorative shadows. Surface separation through border + background color difference.

---

## Do's and Don'ts

### Do
- Use warm terracotta accent sparingly — CTAs and key moments only
- Let whitespace do the work — resist filling empty space
- Use left-border color on signal cards instead of full background tint
- Keep signal colors muted — this is not an alarm system
- Use Inter at 15px body — comfortable reading size on mobile

### Don't
- Use emoji as icons (use Lucide SVG icons)
- Use pink — the accent is terracotta/coral, warm not sweet
- Add decorative elements (patterns, gradients, illustrations) unless they serve function
- Use shadows for visual interest — surfaces are flat
- Bold (700 weight) anything — max weight is 600

---

## Responsive Behavior

Mobile-first. Single breakpoint.

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Default — single column, full-width cards |
| Desktop | ≥ 640px | Content max-width 420px centered, no layout change |

### Touch Targets
- All buttons: min 48px height
- Chips/tags: min 36px height
- Input fields: min 48px height
- Upload area: min 120px height

---

## Agent Prompt Guide

**Quick color ref:**
- Page bg: `#FAF8F5` (warm ivory)
- Cards: `#FFFFFF` with `#E8E3DD` border
- Text: `#2D2926` primary, `#6B635B` secondary
- Accent: `#C4694A` (terracotta — NOT pink)
- Danger: `#C45A5A`, Warning: `#C4944A`, Safe: `#5E8F6B`

**Ready-to-use prompt:**
"Build a mobile-first page using Inter font, warm ivory background (#FAF8F5), white cards with subtle warm borders, terracotta accent (#C4694A) for CTAs only, generous whitespace, 16px rounded corners on cards, 12px on buttons. Flat surfaces, no decorative elements. Signal cards use colored left-border, not background fills."
