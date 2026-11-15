---
name: web-accessibility-a11y
description: WCAG 2.1 AA web accessibility standards, keyboard navigation, dialog focus trapping, ARIA semantics, and reduced-motion support.
---

# Web Accessibility (A11y) Standards — WCAG 2.1 AA

## Implementation Guidelines

1. **Semantic HTML & Native Elements:**
   - Prefer native HTML5 elements (`<button>`, `<dialog>`, `<nav>`, `<header>`, `<footer>`, `<details>`, `<summary>`) over generic `<div>` elements with event handlers.
2. **Keyboard Navigation & Focus Management:**
   - Provide a functional `<a href="#main" class="skip-link">Skip to main content</a>` as the first focusable element.
   - All interactive controls must be reachable via `Tab` and activatable via `Enter` / `Space`.
   - Modals and drawers must trap focus while open and restore focus to trigger element on close (`Escape` key support).
3. **ARIA States & Attributes:**
   - Use `aria-pressed="true|false"` on toggle buttons (e.g. Size selector buttons).
   - Use `aria-expanded="true|false"` on drawer and menu triggers.
   - Use `aria-label` on all icon-only buttons (`Close`, `Menu`, `Bag`).
4. **Motion & Visual Preferences:**
   - Honor `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions and animations.
   - Ensure color contrast ratios meet or exceed 4.5:1 for body copy and 3:1 for large display headings.
