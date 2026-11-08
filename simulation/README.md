# Tattrex — image and voice sequence

A review prototype for the platform section. The presentation contains scan imagery, a voice spectrum and changing instructions. There is no PACS viewer chrome, worklist, toolbar or report panel. The full marketing site integrates this module through a deferred import.

Run from the repository root:

```sh
node simulation/server.mjs
```

Open http://127.0.0.1:4173. The silent visual sequence plays automatically and loops while visible. Pause/restart or jump to a chapter at any time. An explicit pause persists when leaving and returning to the section. There is no narration, microphone control, speech recognition or audio playback.

The sequence covers priority case → brain window → acute infarct highlight → 15 mm MIP → MPR → priors → ventricular comparison → report draft. The animated spectrum uses stored speech cadence profiles (54 bands, 40 samples per second), with estimated word emphasis. These are visual data, not audio files. The final chapter writes an illustrative CT brain report beside the source infarct, with an 18-second chapter for writing and reading before the loop restarts. Reduced motion applies the final images and report immediately.

## Interaction motion

Each command has three beats: utterance → response → settling. The source image holds during the guided utterance. The change comes forward for about 0.7 seconds, settles over 1.5 seconds, then leaves quiet inspection time in the 7.5 second chapter.

- Brain window interpolates actual window width and level.
- Reference masks reveal their true boundary first, strengthen their fill briefly, then return to the exact ordinary mask rendering. Image and mask share every transform.
- MIP gathers two real neighbouring source planes into the computed projection.
- MPR reveals the three planes with staggered motion.
- The illustrative prior arrives alongside the source CT.
- Comparison briefly brackets the corresponding ventricular region in both images.
- Reporting brings the response forward while the study remains visible.

Chapter selection replays the simulated utterance and continues the loop, unless explicitly paused. Pause freezes image motion, waveform and report writing together. Hidden/offscreen sections suspend and automatically resume; chapter changes and restart cancel the previous animation.

The stored visual profiles can be regenerated offline on macOS with `python simulation/scripts/prepare-spectrum.py` (NumPy, `say`, ffmpeg). Temporary synthesis is used only to measure cadence; no sound files are retained or served. The website uses no browser audio or microphone APIs.

## Real abnormalities and reference masks

The main scan is a real anonymized non-contrast CT from [CPAISD v1](https://zenodo.org/records/10892316), with the published radiologist-drawn ischaemic-core and penumbra masks. Creators: Dmitriy Umerenkov, Stepan Kudin, Marina Peksheva and Denis Pavlov (2024). Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See `public/data/ATTRIBUTION.txt`, `LICENSE-CC-BY-4.0.txt` and `source-manifest.json`.

“Highlight acute infarct” displays the core reference annotation in coral. “Show core and penumbra” also shows the penumbra in gold. “Hide overlay” reveals the unannotated source image. These are expert dataset annotations, not live Tattrex predictions. The paper describes reference annotation informed by CT perfusion; a mask does not imply that every marked region is visually obvious on the native CT.

HU windowing, physical MIP slabs and orthogonal MPR operate on the source volume. Categorical masks project by union through a slab, keeping core and penumbra separate. The source CT receives no invented lesion or attenuation change. The priority flag and report actions remain scripted.

The dataset supplies no longitudinal pair. The companion in the prior/comparison step is therefore explicitly **illustrative and derived**, with a local ventricular deformation. It is not a real earlier exam, and no actual interval change is claimed. The current scan and its abnormality remain real.

## Preparation and provenance

Selected validation study: `2.25.292842437493243996825712901028408554321`, 113 slices. Original geometry: 512 × 512 × 113, 0.421875 × 0.421875 × 1.7 mm. DICOM slice thickness is 2 mm; actual inter-slice spacing is 1.7 mm, and that is what the volume operations use.

```sh
python simulation/scripts/prepare-cpaisd.py /path/to/extracted/CPAISD/case
```

Requires NumPy, SciPy and pydicom. The script verifies DICOM-to-published-image HU equality, matching mask dimensions, uniform slice spacing and axial orientation. CT and masks use exactly the same native voxel centres, sampled with stride 2 in plane, then flipped LPS → RAS. Output is 256 × 256 × 113 at 0.84375 × 0.84375 × 1.7 mm. CT stays Int16 HU; labels stay discrete Uint8 values 0, 1 and 2. The prior is encoded as a lossless XOR delta against the current study, then gzipped; the assets total about 9.3 MB. Decoded voxel values are verified against the original SHA-256. Original source-file hashes and archive identity are retained. Raw DICOM demographics are not served.

Brand vectors use the supplied dot-free Tattrex logo. Manrope is self-hosted with its OFL licence. Higgsfield artwork remains in the design asset collection; this sequence uses the open dataset for anatomically matched abnormalities and masks.

## Verification

```sh
node --test simulation/tests/*.test.mjs
npm run test:browser
```

The browser script connects to an isolated Playwright Chrome over CDP, default `http://127.0.0.1:9324`. Configure `BROWSER_CDP`, `SITE_URL` and `DEMO_URL` if needed. Serve the production build on port 4321; the suite also checks its standalone `/simulation/index.html` route. It creates and closes its own context.

23 unit tests cover volume math, physical slabs, orientation, multi-class reference masks, source provenance, command parsing, report data handling, voxel picking. Browser checks cover the complete visual sequence, pixel differences, mask extent, priors, cancellation/resumption, reduced motion, mobile overflow, failed image downloads. Additional browser checks verify intermediate mask emphasis, exact settled equality, changing spectra, real MIP echoes, pause/resume, cancelled reveals, reduced motion during playback, progressive report typing, reading dwell, repeated full loops and responsive report layout. The workflow also runs with all browser audio and speech APIs configured to throw; no audio requests are made.

This standalone route is a reference for the integrated marketing interaction, not a deployed clinical product.
