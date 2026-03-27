# Frokesy Portfolio

Personal portfolio for Ayanfeoluwa Akindele, positioned as a frontend interaction engineer with 5 years of professional experience.

This project aims to feel sleek, modern, and lightweight while using motion and 3D intentionally rather than decoratively.

## Vision

- Build a portfolio that feels engineered, not templated.
- Use `three.js` as a signature interaction layer, not as a distraction.
- Keep the site fast, responsive, accessible, and SEO-friendly.
- Showcase taste in motion, layout, and interaction design as much as frontend implementation skill.

## Experience Goals

- Clear personal positioning above the fold.
- Strong editorial layout with distinctive typography and spacing.
- Purposeful motion for hierarchy, feedback, and delight.
- One memorable `three.js` moment that strengthens the brand.
- Polished mobile experience without losing personality.

## Tech Direction

- `Astro` for the site shell and static rendering.
- `Tailwind CSS` for styling and design tokens.
- `Lenis` for smooth scrolling.
- `Framer Motion` for section transitions, hover states, and interaction choreography.
- `three.js` for a focused hero or showcase interaction.
- Optional supporting library only if a specific animation need is not covered cleanly by the stack above.

## Build Checklist

### 1. Strategy and Content

- [ ] Finalize portfolio positioning and tone of voice.
- [ ] Define the primary audience: recruiters, founders, agencies, and collaborators.
- [ ] Write hero copy that clearly communicates frontend interaction engineering.
- [ ] Rewrite the about section to feel sharper, more senior, and more intentional.
- [ ] Curate experience highlights with outcome-focused bullets.
- [ ] Select projects that best demonstrate interaction thinking, UI craft, and technical depth.
- [ ] Prepare contact links and resume access.

### 2. Visual System

- [ ] Choose a visual direction that avoids generic dark-portfolio patterns.
- [ ] Lock a color palette with primary, accent, surface, and text tokens.
- [ ] Choose a more distinctive typography pairing.
- [ ] Define spacing, border radius, shadows, and layout rhythm.
- [ ] Establish reusable design tokens in the codebase.

### 3. Information Architecture

- [ ] Finalize site sections and order.
- [ ] Design a compelling hero section with clear CTA.
- [ ] Structure about, experience, projects, and contact for quick scanning.
- [ ] Add a section that highlights interaction philosophy or craft.
- [ ] Ensure navigation reflects section progress and active state.

### 4. Core Frontend Build

- [ ] Refactor the current layout for a cleaner, responsive foundation.
- [ ] Replace hard-coded sizing with scalable layout rules.
- [ ] Build responsive navigation behavior for desktop and mobile.
- [ ] Create reusable section and card patterns.
- [ ] Remove debug code and legacy styling from the current implementation.

### 5. Motion System

- [ ] Define motion principles before implementing animations.
- [ ] Add entrance and scroll-reveal animations for content sections.
- [ ] Add refined hover and focus interactions for links, buttons, and cards.
- [ ] Create section transitions that feel smooth but lightweight.
- [ ] Support `prefers-reduced-motion` for major animated experiences.

### 6. Three.js Layer

- [ ] Decide the exact `three.js` role before implementation.
- [ ] Prototype one hero interaction with strong visual identity.
- [ ] Keep the 3D scene lightweight in geometry, shaders, and texture usage.
- [ ] Connect the 3D behavior to pointer movement, scroll, or section state.
- [ ] Ensure the 3D layer degrades gracefully on smaller or weaker devices.

### 7. Projects and Proof

- [ ] Build project cards that feel like mini case studies.
- [ ] Highlight problem, approach, and interaction outcome for each project.
- [ ] Add links to live demos and source where appropriate.
- [ ] Showcase at least one project with especially strong interaction design.

### 8. Quality and Performance

- [ ] Keep the DOM content accessible and semantic.
- [ ] Audit bundle size as animation libraries are introduced.
- [ ] Optimize canvas work and animation loops for performance.
- [ ] Test across mobile, tablet, and desktop breakpoints.
- [ ] Verify keyboard usability and focus visibility.
- [ ] Add metadata, Open Graph tags, and favicon polish.

### 9. Ship Readiness

- [ ] Remove placeholder copy and unfinished sections.
- [ ] Check interaction consistency across the full site.
- [ ] Do a final visual polish pass for spacing, contrast, and pacing.
- [ ] Confirm the portfolio feels memorable, fast, and credible.
- [ ] Ship only when the site clearly supports the "interaction engineer" positioning.

## Suggested Commit Phases

### Phase 1: Foundation

- [ ] Project planning and README roadmap
- [ ] Content structure and section architecture
- [ ] Base layout and responsive shell

### Phase 2: Visual Identity

- [ ] Design tokens, typography, and color system
- [ ] Hero redesign
- [ ] Navigation and section styling

### Phase 3: Motion

- [ ] Framer Motion integration
- [ ] Scroll choreography and micro-interactions
- [ ] Reduced-motion support

### Phase 4: 3D Signature

- [ ] `three.js` scene setup
- [ ] Hero interaction polish
- [ ] Performance tuning for 3D behavior

### Phase 5: Final Polish

- [x] SEO and metadata
- [x] Accessibility and performance audit
- [x] Content refinement and launch prep

## Definition of Done

- [ ] The site presents Ayanfeoluwa as a frontend interaction engineer with confidence and clarity.
- [ ] Motion feels precise and intentional rather than ornamental.
- [ ] `three.js` adds identity without hurting performance or usability.
- [ ] The experience is polished on both desktop and mobile.
- [ ] The final result is strong enough to serve as the primary personal portfolio.
