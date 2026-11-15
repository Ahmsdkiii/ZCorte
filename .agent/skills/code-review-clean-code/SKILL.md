---
name: code-review-clean-code
description: Clean code principles, TypeScript strictness, MVVM modularity, component size limits, barrel exports, and maintainability rules.
---

# Clean Code & Code Review Standards

## Engineering Principles

1. **Component Size & Single Responsibility:**
   - No React component should exceed ~150 lines of code. Split into smaller sub-components or extract logic into custom hooks.
   - Separate concerns: Presentation (View), State & Derived Logic (ViewModel hook), and Data Types/Services (Model).
2. **TypeScript Strictness:**
   - `strict: true` in `tsconfig.json`.
   - Never use `any`. Use strict interfaces, union types, and generics where appropriate.
   - Avoid non-null assertions (`!`) unless mathematically proven invariant.
3. **Naming & Barrel Exports:**
   - Consistent kebab-case or PascalCase matching folder structure.
   - Export public APIs through barrel `index.ts` files within feature modules.
   - Avoid magic numbers and magic strings; declare named constants in `src/lib/constants.ts`.
4. **CSS Class Merging:**
   - Always merge conditional classes with `cn(...)` utility (`clsx` + `tailwind-merge`).
