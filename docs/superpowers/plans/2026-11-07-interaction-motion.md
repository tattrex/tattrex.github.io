# Interaction motion implementation plan

> **For agentic workers:** Use superpowers:executing-plans for this scoped refinement.

**Goal:** Make every instruction visibly emerge and settle, with utterance specific voice motion.
**Architecture:** A cancellable timeline coordinates transcript, recorded spectrum, canvas emphasis and DOM transforms. Existing volume and command semantics remain intact.
**Tech stack:** Native ES modules, Canvas, Web Animations, local audio, Playwright.
**Spec:** `docs/superpowers/specs/2026-11-07-interaction-motion.md`.

## Constraints and review focus

- Preserve source voxels and mask alignment at every animation frame.
- No viewer chrome, synthetic lesion changes, or hero/Labs changes.
- Handle interruption mid utterance and mid reveal, pause/resume, blocked audio, rapid input, reduced motion and narrow screens.
- Animation must finish at exactly the ordinary rendering, with no residual glow or changed opacity.

## Tasks

- [x] Add timeline and waveform tests, observe failure, implement `src/motion.js` and recorded narration preparation.
- [x] Coordinate utterance, response and settling in `src/cinema.js`; implement operation specific canvas and layout emphasis.
- [x] Verify actual intermediate pixels, settled equality, changing spectrum, pause/resume, cancellation, reduced motion and mobile in Playwright.
- [x] Add editable Figma key poses and motion timings, inspect the live motion and screenshots, update documentation.
- [x] Run the unit and browser checks and one independent review of the changed motion code. Resolve material findings.


## Completion evidence

24 unit checks and all three browser suites passed. Pixel checks verify that emphasis settles to exactly the reduced-motion rendering, and interruption never reapplies a cancelled mask. Audio checks exercise a 1.1 second delayed recording, reduced-motion pause/resume, mute handoff and unavailable audio. Independent review found two audio timing defects; both were fixed and verified by the audio suite. Figma has 24 key poses and 24 voice variants with no missing text styles, auto layout or voice overflow in the scoped audit. No publication or commit was performed.


## User clarification: visual speech only

The user clarified that the website does not need actual speech. Removed narration playback, microphone capture, the sound/microphone controls, MP3 assets and their runtime modules/tests. The simulated spectrum, changing text, typed commands and all scan choreography remain. Stored cadence data now lives in `public/motion/spectrum.json`. Current verification is 21 unit tests and two browser suites; the workflow is tested with audio/speech APIs blocked. This correction supersedes the original narration scope above.
