---
name: web-accessibility-a11y
description: WCAG 2.2 AA web accessibility standards, keyboard navigation, dialog focus trapping, ARIA semantics, and reduced-motion support.
---

# Web Accessibility (A11y) Standards — WCAG 2.2 AA

## Implementation Guidelines

1. **Semantic HTML & Native Elements:**
   - Prefer native HTML5 elements (`<button>`, `<dialog>`, `<nav>`, `<header>`, `<footer>`, `<details>`, `<summary>`) over generic `<div>` elements with event handlers.
2. **Keyboard Navigation & Focus Management:**
   - Provide a functional `<a href="#main" class="skip-link">Skip to main content</a>` as the first focusable element.
   - All interactive controls must be reachable via `Tab`, activatable via `Enter` / `Space`, and have a clearly visible focus indicator.
   - Modals and drawers must trap focus while open and restore focus to the trigger element on close (`Escape` key support).
   - Maintain adequate touch targets and responsive layout across 320, 390, 768, 1024, and 1440 px with zero horizontal overflow.
3. **ARIA States & Live Regions:**
   - Use `aria-pressed="true|false"` on toggle buttons (e.g. Size selector buttons).
   - Use `aria-expanded="true|false"` on drawer and menu triggers.
   - Use `aria-label` on all icon-only buttons (`Close`, `Menu`, `Bag`).
   - Use `aria-live="polite"` (or `role="status"` / `role="alert"`) for async feedback, form errors, toast notifications, and AI Shopping Assistant chat responses.
4. **Motion & Visual Preferences:**
   - Honor `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions and animations.
   - Ensure color contrast ratios meet or exceed 4.5:1 for body copy and 3:1 for large display headings.
