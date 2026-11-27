# SUBMISSION — black-friday-deal-finder-01 (LOCAL BUILD ONLY — parent mirrors + submits)

Status: BUILT + VERIFIED locally. NOT mirrored, NOT bundled, NOT submitted (parent does that).
Deadline: 2026-11-29T00:42:00Z (07:42 WIB 29 Nov). Free entry. Pot $250 (1st $50, top 20 paid).

## Entry summary

**The Real Deal Finder** — a static Black Friday + Cyber Monday deal finder.
- **44 deals**, 10 categories, 3 stores (Amazon 35, Best Buy 4, Walmart 1)
- Verdicts: **22 REAL DEAL / 14 STRONG / 5 DECENT / 3 ROUTINE** — combined saving **$9,680.09**, deepest cut 67%
- Search + filters (category, store, min discount, verdict) + sort; filter state in the URL hash (shareable filtered views)
- Same-product compare across stores (AirPods Pro 3: $149 at Amazon and at Walmart)
- Honest flags: Fire TV Stick 4K Plus + Kindle Colorsoft carry ROUTINE verdicts — Amazon raised their lists in Aug 2026 before the sale (evidence on the card); Kindle Paperwhite scored on its real $159.99 list, not the $199.99 figure some roundups quote
- All prices checked 24–26 Nov 2026 in retailer listings / deals trackers (PopSci, 9to5Toys, MacObserver, Gizmodo, DealNews, Slickdeals, store pages). Full table + sources in `dossier.md`.

## Local verification (all done this run)

- Site served locally + rendered in real headless Chromium (Playwright-cached Chromium 1255):
  - Default view: **44 deal cards**; Kitchen + 40% filter: **5**; search "dyson": **3**; compare section: **1 group** (AirPods Pro 3)
  - Screenshots visually checked: cover, Kitchen-40% filter, Real-Deal-only filter, phone 390×844 — all render cleanly
- Data check: all 44 rows sale < usual; all 44 URLs http(s); discount % recomputed from prices
- No network loads: every script/style/font is a file under app/; only store links are external `<a href>`s (allowed)
- `main.ts` run twice → **byte-identical dossier.json** (sha256 `a5a531ad483403eaf08919b8cc8f0836f4ccf70a9a772b24fbd4735e22ea702a`, 615,157 bytes, schema makefun/dossier/v1, under the 1.5 MiB cap)
- Screenshots: 4 files, all ≤256 KiB (1-cover 125,656 B · 2-kitchen-40 120,182 B · 3-real-deals 127,209 B · 4-phone 54,508 B); desktop 1280×800, phone 390×844

## Files to mirror (repo: vickyair1/black-friday-deal-finder-01, public)

```
LICENSE
README.md            (3 make.fun badges + bounty-page link; entry slug the-real-deal-finder)
main.ts
serve.ts
shots.json
dossier.md
SUBMISSION.md
app/index.html
app/style.css
app/app.js
app/data.js
app/favicon.svg
vendor/makefun-frontend.ts   (kit copy — sha256 4c8da1c8e76490b3… verified identical to this kit's)
screenshots/1-cover.jpg
screenshots/2-kitchen-40.jpg
screenshots/3-real-deals.jpg
screenshots/4-phone.jpg
```
Repo About at mirror time: website = https://make.fun/bounty/black-friday-deal-finder-01, topics incl. makefun.
Do NOT mirror: `kit/` (kit.json + kit.tar.gz — working files only).

## Session / usage — PARENT MUST DO AT BUNDLE TIME

- **No kit-CLI session was started in this build and no muse-usage file exists.** Reason: the kit tarball download tripped an execution-risk check, so the tarball was NOT extracted and the kit CLI (`cli/makefun.mjs`) could not be run — therefore `makefun check` was NOT run either. The build used only: kit.json (read as text), the competition detail JSON, the prior household entry's starter pattern, and the prior entry's `vendor/makefun-frontend.ts` (sha256-verified byte-identical to this kit's copy, `4c8da1c8e76490b3…`).
- Parent: extract the kit (or get the risk-check cleared), start a session, bundle with the current kit CLI, attach `--muse-usage` rows, run `makefun check`, and only then submit. The local `main.ts` + dossier above prove the entry builds deterministically, but they are NOT a substitute for the kit check.
- Session ID(s): none yet. Usage file paths: none yet.

## Link-type note (for the parent / finalist review)

- 14 deals link to direct product pages (all Best Buy + Walmart links; 9 Amazon `/dp/` links, each verified verbatim from search results).
- 30 Amazon deals link to Amazon's own search for that exact product (`amazon.com/s?k=…`) — Amazon blocked direct fetches of product pages (403) during research, so the builder used the store search, which lands on the listing. This is disclosed in `dossier.md`.
