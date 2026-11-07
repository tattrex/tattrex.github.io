## Interaction motion refinement — V6

The image and voice sequence now follows utterance → emphasis → settling. All eight instructions have operation specific motion in the [live prototype](http://127.0.0.1:4173/), including a changing visual spectrum and simulated utterances, with no actual speech or microphone capture. The source CT and reference masks remain spatially aligned; the sculptural hero and Labs imagery are unchanged.

- [Figma motion direction](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-18497)
- [Figma motion prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A?node-id=27-13039&starting-point-node-id=27%3A13039&scaling=scale-down-width)
- 24 editable frame poses, 24 voice component variants, measured waveform key poses and Smart Animate connections. The live prototype is the timing reference for continuous spectra and canvas effects; Figma shows the key poses.
- Manifest: `figma/v6-motion-manifest.json`. Structure audit: `figma/v6-motion-audit.json`. Source: `figma/v6-interaction-motion.js`. Preview images: `previews/figma-motion-*-v6.png`.

# Tattrex website · Design review

## Latest imagery: real stroke CT and reference masks

[Review the source CT and separate masks](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-12921) · [Core and penumbra scene](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-12821)

The synthetic lesion has been replaced with an anonymized CPAISD stroke CT and its published expert annotations, licensed CC BY 4.0. The current scan receives no invented lesion or attenuation change. “Highlight acute infarct” displays the ischaemic-core reference mask; “show core and penumbra” adds the separately labelled penumbra. These are reference annotations, not Tattrex model predictions.

All 15 existing platform/sequence scenes use the new scan imagery. A reusable native Figma component has separate source CT, core and penumbra image layers with visibility properties. A source comparison board shows the unannotated CT, core-only overlay and both reference masks. The sculptural hero, Labs artwork and image/voice-only presentation are preserved.

The prior remains explicitly illustrative and derived because the dataset has no real longitudinal pair. Source citation, licence, modifications and hashes are included in `simulation/public/data/`. `figma/v5-source-verification.json` records zero CT or mask mismatches across 7,405,568 output voxels. The runtime's 20 unit tests and browser sequence checks pass, including separate core/penumbra projection through MIP slabs.

Source: Umerenkov, Kudin, Peksheva and Pavlov (2024), [CPAISD](https://zenodo.org/records/10892316), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Image and voice sequence

[Play the Figma sequence](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A?node-id=27-11430&starting-point-node-id=27%3A11430&scaling=scale-down-width) · [Editable sequence frames](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-11774)

The sculptural hero and research atlas are restored. Realistic imaging is concentrated in the platform sequence. Its presentation contains scan imagery, the existing voice spectrum and changing instructions. Viewer chrome, worklist, toolbar, prior inset and report panel have been removed from this sequence.

Eight native Figma voice component variants and eight linked scene frames cover prioritisation, brain windowing, a simulated acute infarct overlay, 15 mm MIP, MPR, priors, ventricular comparison and report drafting. The main desktop/tablet/mobile sections and their prototype copies are updated. Click the voice instrument to enter the sequence. Text, spectrum and layout remain editable; the medical image layers are rendered from the working volume prototype.

The [working interaction prototype](../simulation/README.md) runs at http://127.0.0.1:4173 with animated spectrum, image transitions, optional spoken commands, typed input, narration and pause/restart. This isolated section is implemented for interaction review; the full marketing site remains at the design stage. The prototype uses an attributed CT volume so MIP and MPR are genuine reconstructions. Priority, infarct, interval change and report outputs are explicitly staged.

Latest previews: `previews/figma-v4-27-7033.png` (desktop section), `previews/figma-v4-27-7270.png` (mobile section), `previews/figma-v4-27-12118.png` (MPR), and `previews/voice-mobile-v4.png` (live mobile animation). The sequence was reviewed in the isolated Playwright browser. Source and test details are in `simulation/README.md`.

## Base direction: Concept 03 · The living imaging atlas

[Open the revised Figma design](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-6128) · [Reference and review board](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-9954)

[Chapter storyboard](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A/Tattrex?node-id=27-9604&starting-point-node-id=27%3A9604&scaling=scale-down&hide-ui=1) · [Desktop prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A/Tattrex?node-id=27-8598&starting-point-node-id=27%3A8598&scaling=scale-down-width) · [Mobile prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A/Tattrex?node-id=27-9027&starting-point-node-id=27%3A9027&scaling=scale-down)

This revision responds to the seven reference sites. The detailed observations and their application are in [the reference study](references/reference-study.md). The work uses the requested `landing-page-design` and `figma-designer` skills, the existing token system and Manrope styles.

- A new porcelain tomography sculpture fills the opening. Large type sits low in the frame, balanced by the introduction and equal demo / Labs invitations above it. A precise chapter rail establishes **See → Work → Discover**.
- The platform becomes a layered reading room: anatomy, prior comparison, report context and a tactile voice instrument. The instrument has navigation, comparison, reporting, loading, empty and error variants. Its three workflow states animate in the storyboard.
- Labs returns to warm paper with a large research atlas beside an expandable index of clinical ideas, foundation models and novel biomarkers. The research scope remains clear and does not imply existing regulatory clearance.
- The partnership, statement, FAQ and contact sections retain the previous content and dot-free branding. Desktop, tablet and mobile each have nine sections.
- The chapter storyboard provides linked scene changes. The separate word reveal remains available in Figma. These demonstrate composition and timing; scroll coupled 3D rendering is not implemented yet.

The generated opening asset is `assets/tattrex-tomographic-sculpture-v3.png`, Higgsfield job `f7b381bb-4836-4e06-ace0-46ea5ee4b865`, GPT Image 2.6. Its direction is graphite and porcelain tomography sheets on warm ivory, one vermilion plane, no UI or text. It is artistic imagery, not a clinical scan. The previous dark hero film remains an alternative asset and is not presented as the film for this new light direction.

The native layout audit is saved in `figma/v3-audit-result.json`: all three layouts have named text styles, bound auto-layout spacing and no detected horizontal overflow among visible auto-layout children. Both logo masters have zero centre-dot nodes. The chapter transitions and voice progression were checked in the isolated Playwright browser, and the research CTA was verified to open its contact preview. Forms are design previews and send no data.

Current previews are in `previews/desktop-v3.png`, `previews/tablet-v3.png`, `previews/mobile-v3.png`, `previews/hero-v3.png`, `previews/mobile-hero-v3.png`, `previews/platform-v3.png` and `previews/labs-v3.png`. Browser playback captures are saved alongside them.

The full marketing website remains at the Figma review stage. The isolated image and voice sequence is implemented in `simulation/`. Earlier concepts remain available for comparison.

## Earlier revision: Concept 02 · Imaging observatory

[Open the revised Figma design](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=27-3665)

[Desktop prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A/Tattrex?node-id=27-5296&starting-point-node-id=27%3A5296&scaling=scale-down-width) · [Mobile prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A/Tattrex?node-id=27-5670&starting-point-node-id=27%3A5670&scaling=scale-down)

The user asked to remove the centre dot from the logo and add more awe to the visual direction. This revision makes both changes while retaining equal prominence for the platform and Labs.

- The shared light and dark logo masters have no centre dot. Exported SVGs are in `assets/tattrex-logo-light-dotless.svg` and `assets/tattrex-logo-dark-dotless.svg`. The source logo repository is unchanged.
- The hero features a monumental sliced-glass scan sculpture, a vermilion scan plane, a dark floating navigation bar and a voice-intent overlay.
- The platform section is an editable reading-room concept with a worklist, imaging viewport, prior comparison, report context and voice layer. It is explicitly illustrative and does not depict patient data or claim that every visual detail exists in v0.1.
- Labs uses a full-body spatial atlas with floating imaging planes, followed by the clinical ideas, foundation models and biomarker research directions.
- The partnership story steps across the page. A large dot-free scan symbol anchors the statement section, and an oversized original wordmark closes the page.
- Desktop, tablet and mobile layouts have been updated. A three-state voice sequence and a new four-word statement reveal are available as separate Figma prototype flows.

The earlier concept remains in the file for comparison. Revision 02 has been superseded by Concept 03 above; website implementation has not started.

### Cinematic motion

`assets/tattrex-hero-motion-v2.mp4` is a silent 1920 × 1080, 24 fps hero motion concept lasting 6.04 seconds. It uses subtle parallax and a travelling scan plane. Frame samples were inspected in `previews/hero-motion-contact-sheet-v2.png`. Exact seamless-loop quality should be checked during implementation.

The film is linked from the Figma review board instead of embedded because [Figma restricts video uploads in Starter files](https://developers.figma.com/docs/plugins/api/properties/figma-createvideoasync/). Static posters remain in the main designs. Reduced-motion implementation should use the poster and final statement without movement.

### Revision 02 assets and checks

Higgsfield generated the following assets for this revision:

- Scan sculpture: `26c00b68-1ce7-46d3-b18b-6f6f1333d6a1`, GPT Image 2.6. Prompt direction: monumental ivory glass tomography head, black negative space and one vermilion scan plane; no branding or UI.
- Research atlas: `a1789aa2-a776-479f-9289-aa428ecd164a`, GPT Image 2.6. Prompt direction: full-body point-cloud sculpture with spatially separated imaging planes on black; no branding or UI.
- Hero motion: `56dd5b43-54ad-4274-9a85-5fbf6c6a6324`, Seedance 2.5. Start and end references use the scan sculpture; restrained parallax, travelling scan plane, no audio.

All generated anatomy is artistic, not a clinical output. `figma/v2-audit-result.json` confirms nine sections at each of 1440, 768 and 390 widths, no detected horizontal overflow among visible auto-layout children, no unstyled visible text, and zero centre-dot nodes in either logo master. Prototype action bindings are present; presentation playback has not been verified end to end.

Latest previews: `previews/desktop-v2.png`, `previews/tablet-v2.png`, `previews/mobile-v2.png`, `previews/hero-v2.png`, `previews/platform-v2.png`, `previews/labs-v2.png`.

## Earlier direction: Concept 01

[Open the Figma design](https://www.figma.com/design/hpRVQjO1COQCePQYbLJj1A?node-id=7-2)

[Desktop prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A?node-id=15-2766&starting-point-node-id=15%3A2766&scaling=scale-down-width)

[Mobile prototype](https://www.figma.com/proto/hpRVQjO1COQCePQYbLJj1A?node-id=15-3076&starting-point-node-id=15%3A3076&scaling=scale-down)

This is a design review deliverable. Website implementation has not started. The JavaScript under `figma/` authors native Figma layers; it is not website source.

## Direction

**Reading room + research atlas.** A dark, cinematic introduction transitions into warm paper and editorial research content. The original Tattrex scan-focus logo, drawn wordmark and vermilion colour come from `../tattrex-logo/index.html`. Manrope is the single type family.

The platform and Labs receive equal prominence, as requested. Hero and final contact sections offer both **Request a demo** and **Bring an idea**.

## Page outline and copy

1. **Hero:** “Radiology, shaped by radiologists”. A voice and AI native platform for daily practice, and a research partner for what comes next. Proof line points to the v0.1 demo rather than invented clinical results.
2. **Two paths:** Tattrex platform and Tattrex Labs, presented equally.
3. **Platform:** “Stay with the study. Speak the next step.” An illustrative voice workflow and three benefits: navigate by voice, bring context together, and shape your routine.
4. **Labs:** Clinical ideas, foundation models and novel biomarkers. Research ambition spans modalities and the body; individual collaborations have a defined scope.
5. **Approach:** Define the question, develop and validate, work toward deployment.
6. **Statement:** “You bring the clinical insight. We build what comes next.” A separate prototype studies word-by-word activation. Implementation should respond to scroll, with the complete statement visible when reduced motion is preferred.
7. **FAQ:** Six questions covering the demo, workflow input, starting a research collaboration, research scope, productisation and regulatory status.
8. **Contact:** Equal paths to explore the platform or bring an idea.
9. **Footer:** Brand, positioning, and the intended privacy and terms destinations.

The layout follows a long-form story: it explains two related offerings and the partnership between them. No customer logos, performance statistics, testimonials, pricing, guarantees or approvals have been invented.

## Figma structure

- Foundations: shared Core Colors, semantic colours, spacing and radius variables, and named text styles with bound samples.
- Components: 25 button variants, 5 navigation states, 6 FAQ states, 14 input variants and 11 word-reveal states.
- Screens: complete 1440, 768 and 390 layouts, desktop and mobile prototype frames, contact previews, mobile navigation, motion study and review notes.

The Starter plan permits one variable mode per collection. Light and Dark therefore use separate semantic collections that alias the same Core Colors. These can be consolidated into two modes when the plan supports it. The plan also prevents multiple actions in one interaction, so mobile menu destinations use separate section preview screens.

Logo artwork retains imported vector frames to preserve its original geometry. Interface containers use auto layout. Do not rerun historical authoring scripts indiscriminately: node IDs refer to this specific Figma file.

## Verification

`figma/audit-result.json` records the current file inventory. All three page layouts have nine sections, no detected horizontal overflow among visible auto-layout children, and no unstyled visible text. Six FAQs resize correctly at all three widths. PNG exports are saved in `previews/` for visual review.

Prototype contact forms are visual only and do not submit information. Privacy and terms copy, contact routing, and the exact availability language need confirmation before implementation. Research and planned regulatory work are not represented as existing clinical clearance.

Prototype action bindings and flow entry points were inspected in the file. End-to-end presentation playback was not verified: Figma's presentation page remained blank in the isolated browser. The design exports rendered successfully.

## Asset provenance

- Logo: `/Users/ujjwal/code/tattrex-logo/index.html`, default scan-focus geometry and drawn wordmark.
- Product understanding: `/Users/ujjwal/code/agentic-pacs`, v0.1 demo. No patient data was uploaded or used.
- Cinematic artwork: Higgsfield generation `0294649b-1774-4bb0-be8c-8b0f2ad4048c`, saved as `assets/tattrex-volume-study.png`. This is illustrative artwork, not a clinical image or model result.
- Icons: Phosphor Core regular SVGs from the official `phosphor-icons/core` repository.

## Proposed search metadata

Index the eventual evergreen website.

- Title: **Tattrex | Voice and AI native radiology**
- Description: **A voice and AI native platform for radiology. Tattrex Labs partners with radiologists to develop clinical ideas, imaging models and novel biomarkers.**

Retain plain-text FAQ content for accessibility and search. Legal pages, form validation, metadata, a branded 404 and reduced-motion behaviour belong to implementation after the design review.
