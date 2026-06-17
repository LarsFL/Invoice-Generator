# Invoice Generator

A free, open-source, privacy-first invoice generator that runs entirely in your browser.
No login, no server, no tracking, no limits, no watermarks. Fill in your details, watch
the live preview, and download a PDF.

> **Your data never leaves your device.** Everything is stored locally in your browser.
> Use the JSON export/import to back it up or move it to another device.

## Features

- 🇳🇱 / 🇬🇧 Dutch & English UI and invoice templates (i18n), with independent
  interface language, document language, and currency.
- 💶 Locale-correct currency & date formatting (native `Intl`).
- 🧾 VAT handling per line, multiple rates, and reverse-charge ("BTW verlegd") support.
- 🖼️ Optional company logo (stored locally).
- 🌓 Light / dark / system theme.
- 📄 Real vector PDF — the live preview and the download come from one source.
- 💾 Auto-save to `localStorage` + JSON export/import.

> This tool is an aid and does **not** provide tax advice. Verify each invoice meets
> the rules that apply to you.

## Tech stack

Vite + React + TypeScript · `@react-pdf/renderer` · `react-i18next` · Zustand.
See [`SPEC.md`](./SPEC.md) for the full design.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable
**Settings → Pages → Source: GitHub Actions** once. The Vite `base` is relative,
so it works from a project subpath without extra config.

## License

[MIT](./LICENSE)
