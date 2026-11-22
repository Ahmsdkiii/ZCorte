---
name: code-review-clean-code
description: Clean code principles, TypeScript strictness, MVVM modularity, layer boundaries, and maintainability rules.
---

# Clean Code & Code Review Standards

## Engineering Principles

1. **Modularity, File Size & Single Responsibility:**
   - Keep files cohesive and readable (practical target **<= 250 lines** per `prd/15-quality-security-testing.md` NFR-06). Extract sub-components or hooks based on responsibility, state, accessibility, or testing boundaries — never split mechanically just for line count.
   - Separate concerns cleanly:
     - **Model** (`src/models/`): pure domain types, rules, and mappers (no React, Next.js, Prisma, or HTTP).
     - **ViewModel** (`src/hooks/use<Feature>ViewModel.ts`): client interaction state, derived UI state, and semantic actions (no JSX or authoritative business rules).
     - **View** (`src/components/`): presentational and layout composition (no DB queries or pricing/stock rules).
     - **Server** (`src/actions/` -> `src/validators/` + `src/server/services/` -> `src/server/repositories/` + `src/server/integrations/`).
2. **TypeScript Strictness:**
   - Maintain `strict: true` and `noUncheckedIndexedAccess: true` in `tsconfig.json`.
   - Never use `any`. Use concrete types, bounded generics, or `unknown` with narrowing/Zod validation.
   - Avoid non-null assertions (`!`) and unsafe casts (`as`) unless an invariant is proven and documented.
3. **Naming, Imports & Constants:**
   - Use `PascalCase.tsx` for React components, `use<Feature>ViewModel.ts` for ViewModel hooks, and role suffixes (`*.service.ts`, `*.repository.ts`, `*.actions.ts`, `*.schema.ts`, `*.mapper.ts`) for server modules.
   - Import directly from concrete module paths; avoid wide barrel `index.ts` re-exports in client bundles that hurt tree-shaking or create circular imports.
   - Avoid magic numbers and magic strings; declare domain constants in `src/lib/constants.ts` or dedicated domain modules.
   - Keep code free of debug `console.log`, dead code, and untracked `TODO`s (required format: `TODO(<owner>): <context> [<FR-ID or issue>]`).
4. **CSS Class Merging:**
   - Always merge conditional Tailwind classes with the `cn(...)` utility (`clsx` + `tailwind-merge`).
