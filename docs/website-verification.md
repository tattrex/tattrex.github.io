# Website verification — 7 November 2026

Implemented the approved Figma layout using the native layer export and reference renders. Visually checked the porcelain hero, dark image-and-spectrum interaction, research atlas, stepped partnership, statement, FAQ, contact and oversized wordmark. Checked responsive layouts at 360, 390, 768 and 1440 pixels.

## Production performance

Lighthouse 13.6.0 against the production `dist/` build, served locally with Brotli. Separate temporary headless Chrome profiles were used; no personal browser profile was accessed.

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 0.8 s | 0.2 s |
| Largest contentful paint | 1.7 s | 0.4 s |
| Total blocking time | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |
| Total page resource weight during audit | 149 KiB | 149 KiB |

These are local laboratory results, not a live hosting or real-user measurement. Hosting, device and network conditions affect delivery. Main JavaScript is 1,556 bytes gzip; CSS is approximately 5.7 KB gzip. Fonts and artwork are self-hosted. The main page has no third-party runtime requests.

The clinical dataset is deferred until deliberate activation. Lossless prior-delta encoding reduces its compressed download from about 16.2 MB to 9.3 MB, saving 6,868,701 bytes without changing a decoded voxel. HU, geometry and reference masks remain intact.

## Behavior and accessibility

- 25 unit/build checks pass: physical image operations, mask classes, source provenance, lossless prior hash, incomplete-download rejection, command parsing, motion timing and production asset paths.
- Website browser checks pass: responsive overflow, keyboard disclosures, named mobile dialog/Escape, configured contact links, no initial volume requests, loading/retry, scan overlay, MPR, comparison and offscreen pause.
- Delayed-load regressions pass: leaving during Play or chapter activation never starts hidden motion or forces navigation back; returning allows a deliberate start. Failed module loading clears the busy state and can be retried.
- Standalone functional and motion checks pass: changing image pixels, aligned masks, exact settled rendering, MIP echoes, MPR unfolding, comparison emphasis, changing spectrum, interruption, pause/resume and live reduced-motion changes.
- Browser audio, speech and microphone APIs were configured to throw during functional checks; none were invoked and no audio files were requested.
- No-JavaScript content, navigation, native disclosures and the CT preview remain available.

Raw audit reports and screenshots are generated in ignored `artifacts/`. The source tests and size budgets are committed.

## Independent review and resolution

The independent review found no critical issue. It reproduced the delayed-load navigation race; the regression test failed before the visibility/intent fix and passed after it. The error-state busy flag and mobile dialog name were also corrected. The complete unit and website-browser suites passed after the fixes.

Visual fidelity and production audits were verified by the implementation owner. Live deployment and email delivery were outside this local verification. Both contact paths now open `demo@tattrex.com`, with separate platform and Labs subjects, as supplied by the owner. Opening a draft does not send email.

No deferred code-review findings remain. The website is built and pushed on `codex/voice-workflow-demo`; it has not been published to the production domain.
