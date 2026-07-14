# Palworld Guide Global Tailwind Theme

## Direction

The site uses a field-guide palette built from deep forest green, lake teal, warm yellow, cream surfaces, and restrained coral for warnings. The dark green and teal establish the product identity; yellow is reserved for primary emphasis and action. Cream and muted green surfaces keep long guide and database pages readable.

The pre-theme recovery point is Git tag `pre-global-tailwind-theme-2026-07-14`, targeting commit `08cf425`.

## Semantic color system

| Role | Tailwind token | Value |
| --- | --- | --- |
| Primary | `primary-900` | `#143f38` |
| Primary deep | `primary-950` | `#0e332f` |
| Secondary | `secondary-700` | `#176a70` |
| Secondary deep | `secondary-900` | `#0b4e55` |
| Accent | `accent` | `#ffcf63` |
| Page background | `background` | `#f5f3eb` |
| Surface | `surface` | `#fffdf8` |
| Muted surface | `surface-muted` | `#edf4e8` |
| Text | `foreground` | `#173f38` |
| Muted text | `muted` | `#6f8780` |
| Link | `link` | `#0b716b` |
| Border | `border` | `#ccddd6` |
| Warning/error | `danger` | `#d65f58` |

## Typography

Baloo 2 Variable is the display face for H1–H6. Nunito Variable is the body and control face. Heading sizes are fluid from mobile to desktop:

- H1: `clamp(2.75rem, 6vw, 5.5rem)`, spacing `1.25rem`
- H2: `clamp(2.15rem, 4.5vw, 4rem)`, spacing `1rem`
- H3: `clamp(1.55rem, 3vw, 2.35rem)`, spacing `.75rem`
- H4: `clamp(1.3rem, 2vw, 1.7rem)`, spacing `.6rem`
- H5: `1.125rem`, spacing `.6rem`
- H6: `.95rem`, spacing `.6rem`, uppercase

Page-specific hero headings may use a larger explicit size, but they inherit the same display font, foreground color, weight, and rhythm.

## Links and controls

Default links use `link` and darken to `link-hover`. Keyboard focus uses a three-pixel warm-yellow ring. Shared button classes are:

- `btn btn-primary`: forest green, inverse text
- `btn btn-secondary`: lake teal, inverse text
- `btn btn-accent`: warm yellow, forest text
- `btn btn-outline`: cream surface with teal border interaction

All variants share the same control radius, weight, vertical size, hover lift, and focus treatment. Existing specialized game-tool controls keep their component geometry while inheriting semantic colors.

## Application rules

`app/theme.css` is the single source of truth and is imported by `app/globals.css`. Every route receives it from the root layout. New pages and components should use semantic Tailwind utilities or `--theme-*` variables; raw palette values should be limited to illustrations, Pal-specific accents, or data visualization states.
