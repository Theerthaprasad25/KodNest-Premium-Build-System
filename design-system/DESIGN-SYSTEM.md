# KodNest Premium Build System

A design system for premium B2C SaaS. Calm, intentional, coherent, confident.

---

## Design Philosophy

- **Calm** — No flashy effects, no animation noise
- **Intentional** — Every decision has purpose
- **Coherent** — One mind designed it; no visual drift
- **Confident** — Generous spacing, clear hierarchy

**Avoid:** Gradients, glassmorphism, neon colors, bounce, parallax, hackathon-style visuals.

---

## Color System (4 colors max)

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#F7F6F3` | Page, cards, inputs |
| Primary text | `#111111` | Headings, body |
| Accent | `#8B0000` | Primary actions, links, focus |
| Success | `#5A6B5A` | Completed states, positive feedback |
| Warning | `#8B7942` | In-progress, caution |

Borders use `rgba(17, 17, 17, 0.12)`. Muted text uses `rgba(17, 17, 17, 0.6)`.

---

## Typography

| Role | Font | Size | Line height |
|------|------|------|-------------|
| Headings | Source Serif 4 | 2.5rem → 1.25rem | 1.3 |
| Body | Source Sans 3 | 16–18px | 1.6–1.8 |
| Small | Source Sans 3 | 14px | 1.6 |

- **Max text block width:** 720px
- **No decorative fonts.** No random sizes.

---

## Spacing System

Use only these values: **8px, 16px, 24px, 40px, 64px**

| Token | Value |
|-------|-------|
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-3` | 24px |
| `--space-4` | 40px |
| `--space-5` | 64px |

Never use 13px, 27px, or other arbitrary values. Whitespace is part of the design.

---

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
    ↓
[Context Header]
    ↓
[Primary Workspace (70%) | Secondary Panel (30%)]
    ↓
[Proof Footer]
```

### Top Bar
- **Left:** Project name
- **Center:** Progress (Step X / Y)
- **Right:** Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- One-line subtext
- Clear purpose, no hype language

### Primary Workspace
- Main product interaction
- Clean cards, predictable components
- No crowding

### Secondary Panel
- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer
Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed  
Each checkbox requires user proof input.

---

## Component Rules

| Component | Styling |
|-----------|---------|
| Primary button | Solid deep red |
| Secondary button | Outlined |
| Hover | Same effect everywhere (opacity 0.9) |
| Border radius | 4px everywhere |
| Inputs | Clean borders, no heavy shadows, clear focus |
| Cards | Subtle border, no drop shadows, balanced padding |

---

## Interaction Rules

- **Transitions:** 150–200ms, ease-in-out
- **No bounce, no parallax**

---

## Error & Empty States

**Errors:** Explain what went wrong + how to fix. Never blame the user.

**Empty states:** Provide next action. Never feel dead.

---

## File Structure

```
design-system/
├── index.css          # Main entry (import all)
├── variables.css      # Design tokens
├── reset.css          # Base styles
├── layout.css         # Page structure
├── components.css     # Buttons, inputs, cards
├── states.css         # Error, empty
└── DESIGN-SYSTEM.md   # This document
```

---

## Usage

```html
<link rel="stylesheet" href="design-system/index.css">
```

```html
<div class="kodnest-page">
  <header class="kodnest-topbar">...</header>
  <section class="kodnest-context-header">...</section>
  <main class="kodnest-main">
    <div class="kodnest-workspace">...</div>
    <aside class="kodnest-panel">...</aside>
  </main>
  <footer class="kodnest-footer">...</footer>
</div>
```

---

*KodNest Premium Build System — One mind. No drift.*
