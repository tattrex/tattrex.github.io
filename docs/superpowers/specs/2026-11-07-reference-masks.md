# Reference pathology imagery

Replace the hand-created stroke lesion and mask with a real, anonymized CPAISD non-contrast CT and its published expert annotations. User explicitly requests real abnormalities and masks from an open dataset. Preserve the image-and-voice presentation, sculptural hero and surrounding marketing design.

Use CPAISD v1 (Zenodo 10892316), CC BY 4.0. Original CT intensities remain unaltered apart from display-size resampling; core/penumbra labels use nearest-neighbour sampling with the same coordinates. Sort by DICOM patient position and verify orientation and spacing before preparing the RAS volume. No predicted mask or new clinical inference is claimed. The overlay step displays the published core annotation. Optional “show core and penumbra” exposes both labelled classes.

The dataset has no genuine longitudinal pair. Preserve the existing requested comparison demonstration using an explicitly labelled derived prior, while keeping the current case and its abnormality real. Attribution states exactly which view is derived. No synthetic lesion is introduced into the source CT.

Update the live demo and existing Figma sequence assets/copy in place. Add meaningful tests for reference-mask provenance, multi-class projection and actual source-to-mask alignment; re-run existing interaction checks and visually inspect axial/MPR output on desktop and mobile.
