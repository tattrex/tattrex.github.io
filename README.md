# Tattrex website

The finalized Tattrex design implemented as a static website: responsive porcelain hero, silent scan interaction, Labs research atlas, partnership, FAQ and contact paths. No client framework, analytics, remote font, microphone or audio dependency.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. This builds and serves the production files. Run `npm run build` again after editing a source file; refresh the page to see the result.

## Source and build

- `site/` — HTML, styles, enhancement module, responsive artwork and brand vectors.
- `simulation/` — the volume renderer, silent motion engine and real CPAISD source CT/masks. Its [documentation](simulation/README.md) records the dataset licence, preparation and illustrative prior.
- `scripts/build.mjs` — produces `dist/` with minified, content-hashed assets and gzip/Brotli text variants. No runtime server is required.
- `design/figma/final-site-design.json` — the approved native Figma layer structure; section references are in `design/previews/final-*.png`.

The main route loads a responsive WebP hero and a self-hosted Manrope font. The scan engine and all volumes load only after Play, chapter selection or opening the typed interaction. Below-fold artwork uses native lazy loading. Animations pause offscreen and respect reduced motion. The logo ring appears only while a study is actually loading.

Hero and Labs artwork use preserved **4096 × 2294** Higgsfield-upscaled masters, with quality-92 WebP variants up to 3840px wide. Responsive selection accounts for screen density and the atlas's full rendered width behind its crop. Logos and icons remain SVG; medical scans and masks are unchanged. Run `npm run prepare:artwork` to reproduce the exports (requires `cwebp`), and `npm run test:artwork` to verify 1x/2x/3x browser selection. Source job IDs and export settings are in `design/assets/artwork-4k-manifest.json`.

The comparison volume is encoded as a lossless XOR delta against the current study. The complete compressed volume payload is approximately 9.3 MB, fetched only on deliberate interaction. A test verifies the decoded prior against the original SHA-256; source HU and masks are unchanged.

## Contact setup

Both contact paths open `demo@tattrex.com` in the visitor's email app, with separate subject lines for platform demos and Labs ideas. To change the destinations, edit `demoContact` and `ideaContact` in `site/config.json`, then rebuild. A button opens an email draft; it does not silently send a message or claim delivery.

## Verification

```sh
npm run build
npm test
npm run check:budgets
npm run test:browser
```

Browser tests connect to an **isolated** Chrome CDP instance at `http://127.0.0.1:9324` and create their own contexts. Set `BROWSER_CDP` and `SITE_URL` to change the endpoints. The tests cover 360/390/768/1440 widths, mobile navigation, keyboard disclosures, deferred volumes, loading/retry, CT/MPR/masks/comparison, offscreen pause and absence of browser audio. Screenshots and measured transfer data go to ignored `artifacts/`.

## Hosting

Build with Node 22 or newer and upload the contents of `dist/` to a static host. The root route and standalone `/simulation/index.html` are self-contained. `.nojekyll`, sitemap and robots files are included. `_headers` supplies immutable caching for hashed assets on hosts that support it; other hosts should configure equivalent caching. Precompressed variants require host support, but the ordinary files work everywhere.

The deployment target is **https://tattrex.github.io**. `.github/workflows/pages.yml` builds, tests and publishes `dist/` on every push to `main`, and also supports manual runs. GitHub Pages must be enabled with GitHub Actions as its source. Feature-branch pushes do not publish. The public URL in `site/config.json` controls canonical, social, sitemap and robots URLs; contact remains `demo@tattrex.com`.

GitHub Pages manages its own caching and compression and does not apply the optional `_headers` file. See [verification results](docs/website-verification.md) for local measured performance and checks.
