/* The Real Deal Finder — rendering, search and filters.
   All data lives in data.js; nothing is fetched from the network.
   Filter state is mirrored in the URL hash (#cat=..&store=..&min=..&sort=..
   &verdict=..&q=..) so a filtered view is a shareable link — and so a
   screenshot can show a filter working. */

import { DEALS, CATEGORIES, VERDICTS, META, discountOf, savingOf } from "./data.js";

const VERDICT_RANK = { real: 0, strong: 1, decent: 2, routine: 3 };

const grid = document.getElementById("dealGrid");
const emptyState = document.getElementById("emptyState");
const resultLine = document.getElementById("resultLine");
const chipsBox = document.getElementById("categoryChips");
const compareList = document.getElementById("compareList");
const legendBox = document.getElementById("legend");
const statsBox = document.getElementById("stats");

const qInput = document.getElementById("q");
const storeSel = document.getElementById("store");
const minSel = document.getElementById("minDiscount");
const sortSel = document.getElementById("sort");
const verdictSel = document.getElementById("verdict");

function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function stateFromHash() {
  const params = new URLSearchParams((location.hash || "").replace(/^#\/?/, ""));
  return {
    q: params.get("q") || "",
    cat: params.get("cat") || "All",
    store: params.get("store") || "All",
    min: Number(params.get("min") || 0),
    sort: params.get("sort") || "discount",
    verdict: params.get("verdict") || "All",
  };
}

function stateToHash(s) {
  const params = new URLSearchParams();
  if (s.q) params.set("q", s.q);
  if (s.cat !== "All") params.set("cat", s.cat);
  if (s.store !== "All") params.set("store", s.store);
  if (s.min) params.set("min", String(s.min));
  if (s.sort !== "discount") params.set("sort", s.sort);
  if (s.verdict !== "All") params.set("verdict", s.verdict);
  const next = params.toString();
  history.replaceState(null, "", next ? "#/" + next : "#/");
}

function currentState() {
  return {
    q: qInput.value.trim(),
    cat: chipsBox.querySelector('[aria-pressed="true"]').dataset.cat,
    store: storeSel.value,
    min: Number(minSel.value),
    sort: sortSel.value,
    verdict: verdictSel.value,
  };
}

function applyState(s) {
  qInput.value = s.q;
  storeSel.value = s.store;
  minSel.value = String(s.min);
  sortSel.value = s.sort;
  verdictSel.value = s.verdict;
  for (const chip of chipsBox.querySelectorAll(".chip")) {
    chip.setAttribute("aria-pressed", String(chip.dataset.cat === s.cat));
  }
  render();
}

function filterDeals(s) {
  const needle = s.q.toLowerCase();
  let rows = DEALS.filter((d) => {
    if (s.cat !== "All" && d.cat !== s.cat) return false;
    if (s.store !== "All" && d.store !== s.store) return false;
    if (s.verdict !== "All" && d.verdict !== s.verdict) return false;
    if (discountOf(d) < s.min) return false;
    if (needle && !(d.name + " " + d.store + " " + d.cat).toLowerCase().includes(needle)) return false;
    return true;
  });
  const by = {
    discount: (a, b) => discountOf(b) - discountOf(a) || savingOf(b) - savingOf(a),
    saving: (a, b) => savingOf(b) - savingOf(a),
    priceAsc: (a, b) => a.sale - b.sale,
    priceDesc: (a, b) => b.sale - a.sale,
    verdict: (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountOf(b) - discountOf(a),
  };
  return rows.sort(by[s.sort] || by.discount);
}

function dealCard(d) {
  const el = document.createElement("article");
  el.className = "deal";
  const off = discountOf(d);
  const storeClass = d.store === "Walmart" ? "walmart" : d.store === "Best Buy" ? "bestbuy" : "";
  el.innerHTML =
    '<div class="deal-top"><span class="deal-cat"></span>' +
    '<span class="store-badge ' + storeClass + '"></span></div>' +
    "<h3></h3>" +
    '<div class="prices"><span class="sale"></span>' +
    '<span class="usual"></span>' +
    '<span class="off"></span></div>' +
    '<span class="verdict"></span>' +
    '<p class="why"></p>' +
    '<p class="note"></p>' +
    '<p class="deal-meta"></p>' +
    '<a class="deal-link" target="_blank" rel="noopener">View at <span class="store-name"></span> &rarr;</a>';
  el.querySelector(".deal-cat").textContent = d.cat;
  el.querySelector(".store-badge").textContent = d.store;
  el.querySelector("h3").textContent = d.name;
  el.querySelector(".sale").textContent = money(d.sale);
  el.querySelector(".usual").textContent = money(d.usual) + " usual";
  el.querySelector(".off").textContent = off + "% off";
  const badge = el.querySelector(".verdict");
  badge.textContent = VERDICTS[d.verdict].label;
  badge.classList.add(d.verdict);
  el.querySelector(".why").textContent = d.why;
  const note = el.querySelector(".note");
  if (d.note) note.textContent = d.note; else note.remove();
  el.querySelector(".deal-meta").textContent =
    "Checked " + d.checked + " · Source: " + d.source + " · You save " + money(savingOf(d));
  const link = el.querySelector(".deal-link");
  link.href = d.url;
  link.querySelector(".store-name").textContent = d.store;
  return el;
}

function render() {
  const s = currentState();
  const rows = filterDeals(s);
  grid.replaceChildren(...rows.map(dealCard));
  emptyState.hidden = rows.length > 0;
  const totalSaving = rows.reduce((sum, d) => sum + savingOf(d), 0);
  resultLine.textContent =
    rows.length + " of " + DEALS.length + " deals shown" +
    (rows.length ? " · combined saving " + money(totalSaving) : "") +
    (s.min ? " · " + s.min + "% off or more" : "") +
    (s.cat !== "All" ? " · " + s.cat : "") +
    (s.store !== "All" ? " · " + s.store : "") +
    (s.verdict !== "All" ? " · verdict: " + VERDICTS[s.verdict].label : "") +
    (s.q ? ' · matching "' + s.q + '"' : "");
  stateToHash(s);
}

function renderStats() {
  const totalSaving = DEALS.reduce((sum, d) => sum + savingOf(d), 0);
  const realCount = DEALS.filter((d) => d.verdict === "real").length;
  const maxOff = Math.max(...DEALS.map(discountOf));
  const facts = [
    ["Deals checked", String(DEALS.length)],
    ["Real Deals", String(realCount)],
    ["Deepest cut", maxOff + "% off"],
    ["Combined saving", money(totalSaving)],
    ["Stores", String(META.stores.length)],
  ];
  statsBox.replaceChildren(...facts.map(([k, v]) => {
    const wrap = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    wrap.append(dt, dd);
    return wrap;
  }));
}

function renderChips() {
  chipsBox.replaceChildren(...CATEGORIES.map((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.cat = cat;
    b.textContent = cat;
    b.setAttribute("aria-pressed", String(cat === "All"));
    b.addEventListener("click", () => {
      for (const chip of chipsBox.querySelectorAll(".chip")) {
        chip.setAttribute("aria-pressed", String(chip === b));
      }
      render();
    });
    return b;
  }));
}

function renderCompare() {
  const byName = new Map();
  for (const d of DEALS) {
    const key = d.name.toLowerCase();
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(d);
  }
  const groups = [...byName.values()].filter((g) => g.length > 1);
  if (!groups.length) {
    compareList.innerHTML = "<p class=\"section-note\">No product was found at more than one store this round.</p>";
    return;
  }
  compareList.replaceChildren(...groups.map((g) => {
    const row = document.createElement("div");
    row.className = "compare-row";
    const best = Math.min(...g.map((d) => d.sale));
    const name = document.createElement("span");
    name.className = "compare-name";
    name.textContent = g[0].name;
    row.append(name);
    for (const d of g) {
      const offer = document.createElement("span");
      offer.className = "compare-offer";
      offer.innerHTML = "";
      const store = document.createElement("b");
      store.textContent = d.store + " ";
      const price = document.createElement("b");
      price.textContent = money(d.sale);
      offer.append(store, price, document.createTextNode(" (" + discountOf(d) + "% off " + money(d.usual) + ")"));
      if (d.sale === best) {
        const tag = document.createElement("span");
        tag.className = "compare-tie";
        tag.textContent = " — lowest";
        offer.append(tag);
      }
      row.append(offer);
    }
    return row;
  }));
}

function renderLegend() {
  legendBox.replaceChildren(...Object.entries(VERDICTS).map(([key, v]) => {
    const li = document.createElement("li");
    const badge = document.createElement("span");
    badge.className = "verdict " + key;
    badge.textContent = v.label;
    li.append(badge, document.createTextNode(" — " + v.blurb));
    return li;
  }));
}

for (const el of [qInput, storeSel, minSel, sortSel, verdictSel]) {
  el.addEventListener(el === qInput ? "input" : "change", render);
}
window.addEventListener("hashchange", () => applyState(stateFromHash()));

renderStats();
renderChips();
renderLegend();
renderCompare();
applyState(stateFromHash());
