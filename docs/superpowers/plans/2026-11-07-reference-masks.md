# Reference mask update

Spec: `docs/superpowers/specs/2026-11-07-reference-masks.md`.

- [x] Verify an accessible source and licence: CPAISD v1, CC BY 4.0. Reject restricted or noncommercial sources for this website use.
- [x] Extract a complete study and its published masks, checking archive CRCs.
- [x] Verify source CT HU, per-slice geometry, class meanings, co-sampling and RAS orientation; preserve the original current-scan pathology.
- [x] Replace the synthetic ellipse with the core reference mask; support core plus penumbra; project labels by union in MIP.
- [x] Keep the source/derived comparison distinction explicit, update report language, attribution and source hashes.
- [x] Unit tests RED→GREEN: missing mask projection export, then 20/20 passed. Browser sequence and multi-class display passed.
- [x] Update existing Figma scenes and add separately editable source/core/penumbra layers.
- [x] Export and inspect the final desktop/mobile/Figma images and record the checks.

Decisions: CPAISD preserves the existing CT workflow and supplies real stroke annotations under an attribution licence. The comparison remains a clearly labelled derived prior because this source provides no real longitudinal pair. No new clinical inference is claimed.

Verification: all 7,405,568 exported CT samples and reference labels matched source data; 20/20 unit tests; browser full sequence, core/penumbra switching, failed download retry, speech fallback and mobile checks passed. Figma source board and MPR output visually inspected.
