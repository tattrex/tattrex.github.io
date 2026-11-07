# Tattrex website implementation plan

> **For agentic workers:** Use superpowers:executing-plans for this approved-design implementation.

**Goal:** Deliver the finalized website as a fast, accessible static build, with the silent scan interaction.
**Architecture:** Static semantic sections and responsive CSS; small progressive-enhancement module; user-triggered scan module; optimized responsive image assets; deterministic static production output. Keep the existing simulation available as a standalone reference.
**Tech stack:** HTML, CSS, native ES modules, Node build/preview scripts, Playwright. No runtime framework.
**Spec:** `docs/superpowers/specs/2026-11-07-website-implementation.md`.

## Review focus

Hero art cropping and responsive geometry; no initial scan payload; simulation cancellation/resumption; accessible mobile navigation/accordions/contact; actual destination handling; production asset paths and size; no actual speech.

## Steps

- [x] Export/read the final Figma layer structure, text, styles and hero/section reference renders; prepare responsive original imagery.
- [x] Build all nine approved sections and responsive navigation; commit/push the first recognizable implementation.
- [x] Integrate lazy scan interaction and rotating-logo load/retry state. Add contact destinations, native disclosures and restrained scroll motion.
- [x] Build production output; run meaningful browser checks for responsive layouts, keyboard interactions, loading/cancellation, no audio and deferred data.
- [x] Measure image/JS/CSS/transfer budgets and Lighthouse locally; correct observed issues. Obtain one independent final code review.
- [x] Compare the implementation against Figma, finish documentation, commit/push the verified result and leave a working preview.
