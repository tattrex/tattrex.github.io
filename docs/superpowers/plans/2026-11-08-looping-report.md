# Continuous simulation and animated report

The owner requests continuous automatic playback, removal of custom instructions, and a report written on the right during the report chapter. This is an incremental change to the approved website, not a visual redesign. Keep the source CT/masks and silent waveform interaction intact.

Implementation choices: begin loading/playback when the simulation becomes visible; loop all eight chapters; suspend offscreen/in hidden tabs and resume on return; keep an accessible pause control that persists until deliberately resumed. Chapter selection continues from that chapter unless manually paused. Use an 18-second final chapter for writing and reading, then reset cleanly. Reduced motion shows the complete report immediately. No forced scrolling, sound, microphone or custom-instruction form.

The final chapter returns to the source infarct with its reference mask. A paper-coloured report appears to its right, and fits the image area on mobile. The report uses clinical information, technique, comparison, findings and impression, following ACR/ESR reporting structure. Its infarct statement is grounded in the CPAISD core annotation (entirely in the right hemisphere in the stored RAS volume). Do not invent haemorrhage exclusions, mass effect, measurements, real interval change, clinician signatures or communication events. Identify it as an illustrative draft for radiologist review.

Sources: [ACR communication practice parameter, revised 2025](https://gravitas.acr.org/PPTS/DownloadPreviewDocument?DocId=74&ReleaseId=2), [ESR reporting guidance](https://pmc.ncbi.nlm.nih.gov/articles/PMC3259387/), [RSNA report templates](https://www.rsna.org/practice-tools/data-tools-and-standards/radreport-reporting-templates).

1. Add clock-based report presentation in `simulation/src/report.js` and shared `simulation/report.css`. Reset/reveal/pause/completion must share the sequence clock; avoid independent typing timers.
2. Update `cinema.js` with idempotent start/visibility control, explicit manual pause, per-chapter duration and wraparound. Remove custom-input UI handlers. Give the report chapter a source-only infarct image.
3. Replace site lazy-on-click wiring with visibility-triggered import/autoplay, keeping retry and delayed-load navigation cancellation. Remove the form from both HTML routes. Integrate report markup/styles in the static build and standalone route.
4. Update browser checks for autoplay, loop boundaries, report typing/reading/reset, manual pause, offscreen/resume, retry, reduced motion, mobile layout and silence. Keep mathematical/provenance tests. Check existing image response motion with the new playback semantics.
5. Review the complete change once, commit/push, merge into main, deploy and verify the live behavior. User has authorized ongoing commits/pushes and GitHub Pages publication.

Review focus: delayed initial load while navigating away; no multiple playback timers; persistent manual pause; report no clipping at 360px; resetting report content on wraparound/interruption; unsupported clinical assertions; no audio API or initial hero-load volume requests.

Implementation and verification completed on 2026-11-08. All five implementation steps are complete through local verification; publication follows the owner's standing authorization. The report uses a single existing animation clock, with no extra typing timer. Both entrypoints remove custom instructions. The standalone regression entrypoints now share the maintained website sequence suite.

Final fresh-context review found one report overflow between 601px and 760px on the standalone route. Added a browser assertion that failed at 601px, aligned the standalone tablet layout with the website's stacked layout, then verified the assertion passes at 360, 601, 700, 760, 768, 900 and 1440px. No other findings or deferred items.

Validation: production build; all 25 unit/build tests; asset budgets; full browser suite (navigation/retry, deferred loading, two full loop cycles, utterance/mask/MIP/MPR/compare motion, report writing and reading dwell, interruption, pause/resume, reduced motion, five website report widths and seven standalone widths). No audio APIs or audio requests. Initial-view budget remains 283,446 bytes; entry JavaScript is 1,325 bytes gzip. Source CT, masks and artwork assets are unchanged.
