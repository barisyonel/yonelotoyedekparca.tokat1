# Cloudinary Static Assets Implementation Plan

> **For agentic workers:** Implement task-by-task. UI/layout must not change.

**Goal:** Move nearly all `public/` images to Cloudinary and serve them via a central asset map so the repo stays light.

**Architecture:** One-time signed upload script → `cloudinaryAssets.ts` path→URL map → replace hardcoded local paths → delete local binaries (keep favicon + non-image public files).

**Tech Stack:** Cloudinary Upload API, Next.js `next/image` (already allows res.cloudinary.com), Node script.

## Global Constraints

- No UI/CSS redesign.
- Keep `favicon.ico`, robots, google verify, `.htaccess`, `.well-known`.
- Do not upload `img/` screenshots.
- Do not migrate product DB images (already Cloudinary via admin).

---

### Task 1: Upload script + asset map

- [ ] `scripts/upload-static-to-cloudinary.mjs` reads `.env.local`, uploads images under `public/` (except favicon.ico), folder `yonel-static`, writes `src/lib/cloudinaryAssets.ts` with `staticAsset(path)` helper.

### Task 2: Wire code

- [ ] Update navbar, layout, page brands, blog, homeSliderDefaults, contact/organic-seo/product OG fallbacks, manifest.json to use `staticAsset(...)`.

### Task 3: Cleanup + verify

- [ ] Delete migrated image files from `public/`.
- [ ] `npm run build` passes.
- [ ] Aikido scan on changed source.
