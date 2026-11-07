# Voice Workflow Demo Implementation Plan

> **For agentic workers:** Use native execution for this review prototype; use the executing-plans workflow and a final independent review.

**Goal:** A working, realistic voice-driven CT workflow demonstration for the Tattrex website.

**Architecture:** Native ES modules separate voxel rendering, deterministic command/state handling and browser speech/UI. A local server serves a compact, attributed demonstration volume; no clinical backend is called.

**Tech Stack:** JavaScript, Canvas 2D, Web Speech API, Node test runner, Playwright; Python/NumPy for preparing the public sample.

**Spec:** `docs/superpowers/specs/2026-11-07-voice-demo.md`

## Global constraints

- Work in `simulation/` on `codex/voice-workflow-demo`; retain existing Figma work.
- Brain WW/WL 80/40; bone 2000/500; MIP thickness is in millimetres.
- Real reconstructions from voxel data. Staged prioritisation and derived prior must be labelled.
- No microphone activation until a user clicks. Text and suggestion controls always work.
- No website publishing or connection to a live PACS.

## Review focus

Missing/failed volume download; commands before a case is open; commands in unexpected order; microphone denial/unavailability; repeated guided-playback start/pause/reset. Each must leave a usable UI and truthful status.

## Task 1: Volume operations

Files: `simulation/src/volume.js`, `simulation/scripts/prepare-volume.py`, `simulation/tests/volume.test.mjs`, `simulation/public/data/*`.

- [x] Write failing tests for `windowValue(hu,width,level)`, `slabIndices(center,spacing,thickness,count)`, `samplePlane(volume,axis,index,options)` and orientation mapping on an asymmetric tiny volume.
- [x] Run the tests and confirm the missing-module failure.
- [x] Implement NRRD ingestion/preparation, calibrated HU rendering, physical slabs and three orthogonal planes. Preserve source attribution and licence.
- [x] Pass the mathematical tests and inspect representative slices.

## Task 2: Commands and workflow state

Files: `simulation/src/commands.js`, `simulation/tests/commands.test.mjs`.

- [x] Write failing tests for the requested commands, number-word slab sizes, opening priority case, prereqs, unknown input, negation, prior/ROI/reset transitions and bounds.
- [x] Implement `parseCommand(text)` and `reduceCommand(state,command,meta)` returning state, feedback and side-effect descriptors.
- [x] Pass the tests; verify out-of-order commands never imply operations succeeded without a loaded case.

## Task 3: Interface, speech and review

Files: `simulation/index.html`, `simulation/src/cinema.js`, `simulation/src/speech.js`, `simulation/cinema.css`, `simulation/server.mjs`, `simulation/README.md`.

- [x] Build image-only scenes, the voice spectrum, changing instructions, linked comparison, timeline and responsive layout.
- [x] Add guarded speech recognition and optional synthesis, plus pauseable guided playback using the same command path.
- [x] Test the full priority → brain window → MIP 15 mm → MPR → priors → ventricular comparison path in Playwright, including pixel differences and state labels. Check mobile, keyboard, errors and playback cancellation.
- [x] Request a final independent code review, fix material findings, and record the actual verification results.

## Execution notes

User has explicitly requested the working simulation; proceed within that scope. Existing untracked design artifacts remain in place on a dedicated feature branch. This is a review prototype rather than the full marketing website implementation.
