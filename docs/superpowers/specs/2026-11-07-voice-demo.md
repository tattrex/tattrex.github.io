# Tattrex voice workflow demonstration

The user explicitly requested a working website simulation after requesting more realistic scan imagery in the Figma design. Build a standalone, embeddable review prototype in `simulation/`, keeping the full marketing site at the Figma review stage.

The demo opens a fictional priority case with a staged AI notification. Spoken, typed and suggested commands use the same state transition path. Support opening the highest priority case, brain and bone window presets, a 15 mm maximum intensity slab, axial/coronal/sagittal MPR, prior retrieval, linked ventricular-region comparison, slice scrolling, zoom and reset. Include a guided playback with pause and restart. Add a switchable simulated acute infarct overlay that follows the 3D lesion in all views. Draft a reviewable report and append dictated findings as plain text.

Use actual voxel rendering from the MIT-licensed original Seg3D CTbrain50.nrrd sample. Its voxel spacing and intensity scale drive rendering. Generated Higgsfield scans belong in the marketing design, not as substitutes for volumetric operations. Current/prior demonstration data may be a clearly identified derived pair; do not describe it as real longitudinal data or claim clinical AI inference. The comparison highlights a demonstrator ROI and does not issue a diagnosis or validated measurement.

Reuse the platform's brain WW/WL 80/40 and bone 2000/500. Keep millimetres distinct from slice counts; sample MIP over physical slab thickness. MPR panels share one spatial crosshair and correct radiological orientation. Changing windowing remaps HU, not CSS brightness.

The visual design follows the existing Tattrex warm paper, charcoal, vermilion and Manrope system with the dot-free logo. Desktop provides worklist, viewer and assistant; mobile stacks them without horizontal overflow. Keyboard and touch have equivalents for viewer controls.

Speech starts only on user action. Web Speech support and errors are handled explicitly; typed commands remain available. Explain that the browser may process speech online. No patient data, external clinical inference, upload form or production PACS integration. Optional spoken responses and the guided tour start only after user action.

Implementation choice: small native ES modules and Canvas 2D rendering, with no application framework dependency. This keeps the review prototype easy to run and embed. Unit tests cover volume math, orientation and state handling; browser checks cover the full flow and responsive layout.

## Latest presentation direction

The user explicitly removed the full viewer from the animation. The final presentation shows only imaging, the existing voice spectrum motif and changing command/response text. MPR unfolds into three scan images; priors become a pair. No worklist, toolbars, viewer controls or report panel appear. The report step is narrative. Optional typed and speech input is behind a disclosure. Narration reads the commands; response text remains visible. Preserve the original sculptural hero and research art.

## Real reference imagery update

Superseded the synthetic lesion and source sample with CPAISD reference CT and expert core/penumbra annotations. See `2026-11-07-reference-masks.md` and `simulation/README.md` for current provenance and limits.
