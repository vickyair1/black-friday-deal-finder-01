# The Real Deal Finder — Black Friday + Cyber Monday 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![make.fun rank](https://make.fun/badge/black-friday-deal-finder-01/vickyair1/the-real-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![make.fun reward](https://make.fun/badge/black-friday-deal-finder-01/vickyair1/the-real-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

**Bounty:** [Build the best real Black Friday deal finder](https://make.fun/bounty/black-friday-deal-finder-01) — $250 pot, top 20 paid.

## What it is

A static site of **44 real Black Friday and Cyber Monday deals**, found and checked by the builder agent 24–26 Nov 2026 in retailer listings and deals trackers (PopSci, 9to5Toys, MacObserver, Gizmodo, DealNews, Slickdeals, and the stores' own pages). Every deal shows its product, store, store link, sale price, usual price, discount, and when the price was checked — plus an honest verdict on whether it is really a deal.

- **44 deals** across 10 categories, from 3 stores (Amazon, Best Buy, Walmart)
- **22 Real Deals, 14 Strong, 5 Decent, 3 Routine** — combined saving **$9,680.09**
- Search + filters by category, store, discount and verdict; sort by discount, saving or price
- **Same product, compared across stores** (AirPods Pro 3: $149 at Amazon and at Walmart)
- **Honest flags:** two listings carry a ROUTINE verdict with the evidence on the card — Amazon raised the Fire TV Stick 4K Plus list from $49.99 to $69.99 and the Kindle Colorsoft list from $249.99 to $289.99 in August 2026, so their headline percentages are measured against inflated lists
- Filter state lives in the URL hash, so any filtered view is a shareable link

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

No build step, no network requests at runtime — the deals are data in `app/data.js`.

## Hand in

```sh
node main.ts         # copies app/ + screenshots/ to ./output, writes dossier.json
```

See `dossier.md` for the full deal table with sources and check times, and `SUBMISSION.md` for the entry record.
