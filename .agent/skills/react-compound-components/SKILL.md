---
name: react-compound-components
description: Architectural rules and patterns for building scalable, flexible React compound components using Parent.Sub syntax and internal Context.
---

# React Compound Components Architecture

## Pattern Guidelines

1. **Parent.Sub Pattern Structure:**
   - Every complex component (e.g. `ProductCard`, `CinemaStory`, `CartDrawer`, `ProductGallery`, `QuickAddModal`) exposes sub-components attached to the parent namespace.
   - Example: `<ProductCard><ProductCard.Visual /><ProductCard.Meta /></ProductCard>`.
2. **Internal Context Sharing:**
   - Use an internal React Context to share state between parent and children without prop drilling.
   - Always export a custom hook with an invariant check:
     ```tsx
     function useProductCardContext() {
       const context = useContext(ProductCardContext);
       if (!context)
         throw new Error("ProductCard compound components must be rendered inside <ProductCard>");
       return context;
     }
     ```
3. **Composability & Separation:**
   - Sub-components must focus solely on presentation and rendering their specific fragment of the UI.
   - Allow consumer composition: consumers can reorder, omit, or wrap sub-components freely.
