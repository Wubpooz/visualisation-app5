/* ==========================================================
   script.js — How Europe Spends Its Time
   ========================================================== */

// ===========================================================
// 1. EMBEDDED DATA
// ===========================================================

const DATA = {
  years: [2000, 2010, 2020],
  age_groups: ["10-24", "25-44", "45-64", "65+"],
  activity_categories: [
    "AC01","AC02 + AC021","AC812","AC72",
    "AC512_513_519","AC52","AC611","AC321",
    "AC382_383","AC910"
  ],
  values: {
    "2000": {
      "10-24": {
        shared_pct:24.332, alone_pct:74.429, other_pct:1.239,
        "AC01":{average_minutes:526.19},
        "AC02 + AC021":{average_minutes:51.381},
        "AC321":{average_minutes:14.19},
        "AC382_383":{average_minutes:4.929},
        "AC512_513_519":{average_minutes:22.543},
        "AC52":{average_minutes:10.167},
        "AC611":{average_minutes:14.048},
        "AC72":{average_minutes:12.167},
        "AC812":{average_minutes:7.238},
        "AC910":{average_minutes:21.262}
      },
      "25-44": {
        shared_pct:24.166, alone_pct:74.88, other_pct:0.954,
        "AC01":{average_minutes:497.81},
        "AC02 + AC021":{average_minutes:51.631},
        "AC321":{average_minutes:22.643},
        "AC382_383":{average_minutes:13.595},
        "AC512_513_519":{average_minutes:17.136},
        "AC52":{average_minutes:5.857},
        "AC611":{average_minutes:11.81},
        "AC72":{average_minutes:6.024},
        "AC812":{average_minutes:6.548},
        "AC910":{average_minutes:28.881}
      },
      "45-64": {
        shared_pct:25.198, alone_pct:73.732, other_pct:1.07,
        "AC01":{average_minutes:503},
        "AC02 + AC021":{average_minutes:54.155},
        "AC321":{average_minutes:27.238},
        "AC382_383":{average_minutes:2.524},
        "AC512_513_519":{average_minutes:16.432},
        "AC52":{average_minutes:4.452},
        "AC611":{average_minutes:15.381},
        "AC72":{average_minutes:3.81},
        "AC812":{average_minutes:8.595},
        "AC910":{average_minutes:20.976}
      },
      "65+": {
        shared_pct:30.147, alone_pct:68.429, other_pct:1.424,
        "AC01":{average_minutes:545.81},
        "AC02 + AC021":{average_minutes:55.869},
        "AC321":{average_minutes:31.024},
        "AC382_383":{average_minutes:1.429},
        "AC512_513_519":{average_minutes:18.951},
        "AC52":{average_minutes:3.548},
        "AC611":{average_minutes:23.81},
        "AC72":{average_minutes:2.286},
        "AC812":{average_minutes:10.5},
        "AC910":{average_minutes:2.048}
      }
    },
    "2010": {
      "10-24": {
        shared_pct:24.477, alone_pct:74.073, other_pct:1.45,
        "AC01":{average_minutes:536.472},
        "AC02 + AC021":{average_minutes:54.183},
        "AC321":{average_minutes:11.852},
        "AC382_383":{average_minutes:2.852},
        "AC512_513_519":{average_minutes:20.315},
        "AC52":{average_minutes:11.019},
        "AC611":{average_minutes:12.389},
        "AC72":{average_minutes:45.389},
        "AC812":{average_minutes:6.528},
        "AC910":{average_minutes:14.278}
      },
      "25-44": {
        shared_pct:24.325, alone_pct:74.632, other_pct:1.043,
        "AC01":{average_minutes:497.667},
        "AC02 + AC021":{average_minutes:56.685},
        "AC321":{average_minutes:21.722},
        "AC382_383":{average_minutes:18.148},
        "AC512_513_519":{average_minutes:17.556},
        "AC52":{average_minutes:7.444},
        "AC611":{average_minutes:9.611},
        "AC72":{average_minutes:22},
        "AC812":{average_minutes:5.796},
        "AC910":{average_minutes:29.704}
      },
      "45-64": {
        shared_pct:25.006, alone_pct:73.862, other_pct:1.132,
        "AC01":{average_minutes:499.574},
        "AC02 + AC021":{average_minutes:60.315},
        "AC321":{average_minutes:26.204},
        "AC382_383":{average_minutes:3.481},
        "AC512_513_519":{average_minutes:17.769},
        "AC52":{average_minutes:5.593},
        "AC611":{average_minutes:13.611},
        "AC72":{average_minutes:15.648},
        "AC812":{average_minutes:8.167},
        "AC910":{average_minutes:22.259}
      },
      "65+": {
        shared_pct:29.954, alone_pct:68.591, other_pct:1.455,
        "AC01":{average_minutes:544.407},
        "AC02 + AC021":{average_minutes:65.543},
        "AC321":{average_minutes:26.389},
        "AC382_383":{average_minutes:1.222},
        "AC512_513_519":{average_minutes:22.124},
        "AC52":{average_minutes:4.722},
        "AC611":{average_minutes:20.278},
        "AC72":{average_minutes:10.444},
        "AC812":{average_minutes:10.426},
        "AC910":{average_minutes:1.926}
      }
    },
    "2020": {
      "10-24": {
        shared_pct:25.838, alone_pct:72.488, other_pct:1.674,
        "AC01":{average_minutes:555.767},
        "AC02 + AC021":{average_minutes:49.75},
        "AC321":{average_minutes:10.167},
        "AC382_383":{average_minutes:3.083},
        "AC512_513_519":{average_minutes:41.267},
        "AC52":{average_minutes:9.133},
        "AC611":{average_minutes:12.733},
        "AC72":{average_minutes:12.775},
        "AC812":{average_minutes:7.817},
        "AC910":{average_minutes:9.2}
      },
      "25-44": {
        shared_pct:26.288, alone_pct:72.479, other_pct:1.233,
        "AC01":{average_minutes:505.603},
        "AC02 + AC021":{average_minutes:54.595},
        "AC321":{average_minutes:19.873},
        "AC382_383":{average_minutes:20.048},
        "AC512_513_519":{average_minutes:30.103},
        "AC52":{average_minutes:7.968},
        "AC611":{average_minutes:13.746},
        "AC72":{average_minutes:9.762},
        "AC812":{average_minutes:7.476},
        "AC910":{average_minutes:24.825}
      },
      "45-64": {
        shared_pct:24.827, alone_pct:73.923, other_pct:1.25,
        "AC01":{average_minutes:503.508},
        "AC02 + AC021":{average_minutes:57.357},
        "AC321":{average_minutes:19.937},
        "AC382_383":{average_minutes:3.476},
        "AC512_513_519":{average_minutes:26.349},
        "AC52":{average_minutes:5.683},
        "AC611":{average_minutes:15.54},
        "AC72":{average_minutes:8.397},
        "AC812":{average_minutes:9.619},
        "AC910":{average_minutes:23.127}
      },
      "65+": {
        shared_pct:29.179, alone_pct:69.425, other_pct:1.396,
        "AC01":{average_minutes:542.651},
        "AC02 + AC021":{average_minutes:65.968},
        "AC321":{average_minutes:23.254},
        "AC382_383":{average_minutes:0.206},
        "AC512_513_519":{average_minutes:29.476},
        "AC52":{average_minutes:4.952},
        "AC611":{average_minutes:23.667},
        "AC72":{average_minutes:6.262},
        "AC812":{average_minutes:15.317},
        "AC910":{average_minutes:2.492}
      }
    }
  }
};

// ===========================================================
// 2. CONSTANTS
// ===========================================================

const YEARS      = DATA.years;
const AGE_GROUPS  = DATA.age_groups;
const CATEGORIES  = DATA.activity_categories;

const CAT_LABELS = {
  "AC01":           "Sleeping",
  "AC02 + AC021":   "Eating",
  "AC812":          "Reading books",
  "AC72":           "Computing",
  "AC512_513_519":  "Socialising",
  "AC52":           "Entertainment & culture",
  "AC611":          "Walking & hiking",
  "AC321":          "Cleaning dwelling",
  "AC382_383":      "Childcare activities",
  "AC910":          "Commuting"
};

/* Colourblind-safe palette — Tol bright + muted, hand-tuned
   for maximum hue & luminance separation with 10 categories. */
const CAT_COLORS = {
  "AC01":           "#4477AA",
  "AC02 + AC021":   "#EE6677",
  "AC812":          "#228833",
  "AC72":           "#CCBB44",
  "AC512_513_519":  "#66CCEE",
  "AC52":           "#AA3377",
  "AC611":          "#EE8866",
  "AC321":          "#C47A53",
  "AC382_383":      "#44BB99",
  "AC910":          "#7A7B8D"
};

const AG_COLORS = {
  "10-24": "#E8575A",
  "25-44": "#3D5A99",
  "45-64": "#228833",
  "65+":   "#D4A843"
};

/* Categories shown in the line-chart selector (exclude stable ones) */
const LINE_CATS = CATEGORIES.filter(c => c !== "AC01" && c !== "AC02 + AC021");

const WAFFLE_COLORS = {
  alone:  "#D4764E",
  shared: "#5B8C5A",
  other:  "#9B95B0"
};

// ===========================================================
// 3. NARRATIVE ANNOTATIONS
// ===========================================================

const BUMP_NOTES = {
  "10-24": "For young Europeans the most dramatic shift was the <strong>explosion of computing time</strong> between 2000 and 2010, surging from under 2% to nearly 7% of tracked activities. By 2020 socialising time nearly doubled — possibly reflecting expanded digital social interactions — while commuting dropped sharply.",
  "25-44": "Working-age Europeans show the most balanced distribution. <strong>Computing rose sharply</strong> from 2000 to 2010, while commuting remained stubbornly high. <strong>Childcare activities peak</strong> in this group — five times more than any other cohort — and climbed further by 2020.",
  "45-64": "The 45–64 group show remarkable stability across two decades. <strong>Computing grew steadily</strong> from near-zero to a visible share, while social activities picked up in 2020. Household cleaning gradually declined, mirroring broader trends in domestic labour.",
  "65+":   "Retirees spend the most time walking and reading, and the least commuting. <strong>Walking remained high</strong> at over 3 % of tracked time — double that of younger groups. The most striking change was the quiet <strong>rise of computing</strong> from virtually zero in 2000 to a meaningful share by 2020."
};

const LINE_NOTES = {
  "AC72":           "<strong>Computing</strong> saw the most dramatic generational shift. Young Europeans surged from 12 to 45 min/day between 2000 and 2010, then dropped back by 2020 — likely as activities split into mobile and social categories. The 65+ group showed a quieter but steady rise throughout.",
  "AC812":          "<strong>Reading books</strong> declined across most age groups, but the 65+ cohort bucked the trend with an increase from 10.5 to 15.3 min/day by 2020. The gap between oldest and youngest readers widened dramatically.",
  "AC512_513_519":  "<strong>Socialising</strong> remained relatively stable until 2020, when all age groups — especially 10–24 year-olds — saw sharp increases, perhaps reflecting expanded survey definitions of social interaction.",
  "AC52":           "<strong>Entertainment and culture</strong> stayed remarkably stable across two decades and age groups, hovering between 4 and 11 min/day — a quiet constant amid rapid change.",
  "AC611":          "<strong>Walking & hiking</strong> shows a clear age gradient: older Europeans walk significantly more. The 65+ group consistently spent 20+ min/day walking, roughly double the rate of younger groups.",
  "AC321":          "<strong>Cleaning</strong> time gradually decreased for most groups, with the 65+ cohort maintaining the highest levels throughout. The decline is sharpest for 25–44-year-olds.",
  "AC382_383":      "<strong>Childcare activities</strong> peak sharply for the 25–44 group and are nearly zero for 65+. The 25–44 group saw a notable increase from 13.6 to 20 min/day by 2020.",
  "AC910":          "<strong>Commuting</strong> time is near-zero for retirees but substantial for working-age groups. Younger Europeans saw a marked decline by 2020, while the 25–44 group maintained the highest commute times."
};

// ===========================================================
// 4. STATE
// ===========================================================

const state = {
  bumpAge:    "10-24",
  lineCat:    "AC72",
  waffleAge:  "10-24",
  hoverCat:   null
};

// ===========================================================
// 5. HELPERS
// ===========================================================

function getMin(year, ag, cat) {
  const v = DATA.values[String(year)];
  return v?.[ag]?.[cat] ? v[ag][cat].average_minutes : 0;
}

function totalMin(year, ag) {
  return CATEGORIES.reduce((s, c) => s + getMin(year, ag, c), 0);
}

const DAY_MIN = 1440; /* 24 × 60 — denominator for all share calculations */

function share(year, ag, cat) {
  return getMin(year, ag, cat) / DAY_MIN * 100;
}

function fmt(n) { return n.toFixed(1); }

/* Largest-remainder rounding so values sum to 100 */
function roundTo100(vals) {
  const fl = vals.map(Math.floor);
  let rem = 100 - fl.reduce((a, b) => a + b, 0);
  const idx = vals.map((v, i) => ({ i, r: v - Math.floor(v) }))
                  .sort((a, b) => b.r - a.r);
  for (let j = 0; j < rem; j++) fl[idx[j].i]++;
  return fl;
}

/* CSS-safe class suffix */
function safeId(s) { return s.replaceAll(/[^a-zA-Z0-9]/g, "_"); }

/* Push overlapping labels apart (greedy top-down) */
function spreadLabels(positions, minGap) {
  positions.sort((a, b) => a.y - b.y);
  for (let i = 1; i < positions.length; i++) {
    const overlap = positions[i - 1].y + minGap - positions[i].y;
    if (overlap > 0) positions[i].y += overlap;
  }
  return positions;
}

let noteHeightResizeTimer = null;

function scrollToInstant(y) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  globalThis.scrollTo(0, y);
  root.style.scrollBehavior = prev;
}

function renderBumpNote(ag) {
  d3.select("#bump-note").html(BUMP_NOTES[ag] || "");
}

function lockBumpNoteHeight() {
  const note = document.getElementById("bump-note");
  if (!note) return;

  const width = note.getBoundingClientRect().width;
  if (!width) return;

  const currentHtml = note.innerHTML;
  const measure = note.cloneNode(false);
  measure.removeAttribute("id");
  measure.style.position = "absolute";
  measure.style.visibility = "hidden";
  measure.style.pointerEvents = "none";
  measure.style.left = "-99999px";
  measure.style.top = "0";
  measure.style.width = `${width}px`;
  measure.style.minHeight = "0";
  measure.style.height = "auto";

  document.body.appendChild(measure);

  let maxHeight = 0;
  Object.values(BUMP_NOTES).forEach(html => {
    measure.innerHTML = html;
    maxHeight = Math.max(maxHeight, Math.ceil(measure.getBoundingClientRect().height));
  });

  measure.remove();
  note.innerHTML = currentHtml;
  note.style.minHeight = `${maxHeight}px`;
}

function scheduleBumpNoteHeightLock() {
  if (noteHeightResizeTimer) globalThis.clearTimeout(noteHeightResizeTimer);
  noteHeightResizeTimer = globalThis.setTimeout(() => {
    noteHeightResizeTimer = null;
    lockBumpNoteHeight();
  }, 120);
}

function prefersReducedMotion() {
  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPreferredScrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

function getElementTipPoint(el) {
  const rect = el.getBoundingClientRect();
  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  };
}

function activationKeyPressed(ev) {
  return ev.key === "Enter" || ev.key === " ";
}

function announce(message) {
  d3.select("#a11y-status").text(message);
}

// ===========================================================
// 6. TOOLTIP
// ===========================================================

const tooltip = d3.select("#tooltip");

function showTip(html, ev) {
  tooltip.html(html).classed("visible", true);
  moveTip(ev);
}
function moveTip(ev) {
  if (!ev || typeof ev.clientX !== "number" || typeof ev.clientY !== "number") {
    tooltip.style("left", "14px").style("top", "14px");
    return;
  }

  const pad = 14;
  let x = ev.clientX + pad;
  let y = ev.clientY + pad;
  const rect = tooltip.node().getBoundingClientRect();
  if (x + rect.width > globalThis.innerWidth - pad) x = ev.clientX - rect.width - pad;
  if (y + rect.height > globalThis.innerHeight - pad) y = ev.clientY - rect.height - pad;
  tooltip.style("left", x + "px").style("top", y + "px");
}
function hideTip() { tooltip.classed("visible", false); }

// ===========================================================
// 7. AREA BUMP CHART
// ===========================================================

function drawBump() {
  const el = d3.select("#bump-chart");
  el.html("");

  const W = 960, H = 520;
  const m = { t: 30, r: 155, b: 42, l: 48 };
  const w = W - m.l - m.r, h = H - m.t - m.b;
  const ag = state.bumpAge;

  const svgRoot = el.append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("aria-labelledby", "bump-title bump-desc");

  svgRoot.append("title")
    .attr("id", "bump-title")
    .text(`The landscape of a day for age group ${ag}`);

  svgRoot.append("desc")
    .attr("id", "bump-desc")
    .text("Area bump chart where category width is square-root scaled from daily share. Use legend buttons or chart focus to inspect category values by year.");

  const svg = svgRoot.append("g").attr("transform", `translate(${m.l},${m.t})`);

  /* ---- compute snapshots at real years ---- */
  const snapshots = YEARS.map(year => {
    const entries = CATEGORIES.map(cat => ({
      cat, year, min: getMin(year, ag, cat)
    }));
    entries.forEach(d => {
      d.share = d.min / DAY_MIN * 100;
      d.dv = Math.sqrt(Math.max(d.share, 0));
    });
    const dvTot = d3.sum(entries, d => d.dv);
    entries.forEach(d => d.ds = dvTot > 0 ? d.dv / dvTot * 100 : 0);
    /* sort by display share and stack */
    entries.sort((a, b) => {
      const d = b.ds - a.ds;
      return Math.abs(d) < 0.005 ? CATEGORIES.indexOf(a.cat) - CATEGORIES.indexOf(b.cat) : d;
    });
    let cum = 0;
    entries.forEach((d, i) => { d.y0 = cum; d.y1 = cum + d.ds; d.rank = i; cum = d.y1; });
    return entries;
  });

  /* ---- scales ---- */
  const x = d3.scaleLinear().domain([2000, 2020]).range([0, w]);
  const y = d3.scaleLinear().domain([0, 100]).range([0, h]);

  /* ---- per-category ribbon data ---- */
  const catData = {};
  CATEGORIES.forEach(cat => {
    catData[cat] = snapshots.map(stack => {
      const entry = stack.find(d => d.cat === cat);
      return { year: entry.year, y0: entry.y0, y1: entry.y1, ds: entry.ds, rank: entry.rank };
    });
  });

  /* ---- ribbon path generator (cubic Bézier alluvial) ---- */
  function ribbonPath(cat) {
    const pts = catData[cat];
    let d = `M ${x(pts[0].year)},${y(pts[0].y0)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const x0 = x(pts[i].year), x1 = x(pts[i + 1].year);
      const mx = (x0 + x1) / 2;
      d += ` C ${mx},${y(pts[i].y0)} ${mx},${y(pts[i + 1].y0)} ${x1},${y(pts[i + 1].y0)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${x(last.year)},${y(last.y1)}`;
    for (let i = pts.length - 1; i > 0; i--) {
      const x0 = x(pts[i].year), x1 = x(pts[i - 1].year);
      const mx = (x0 + x1) / 2;
      d += ` C ${mx},${y(pts[i].y1)} ${mx},${y(pts[i - 1].y1)} ${x1},${y(pts[i - 1].y1)}`;
    }
    d += ' Z';
    return d;
  }

  /* ---- draw ribbons (bottom rank first so top overlays) ---- */
  const order = [...CATEGORIES].sort((a, b) => {
    const ar = catData[a][0].rank, br = catData[b][0].rank;
    return br - ar;
  });

  order.forEach((cat, i) => {
    const canSelect = cat !== "AC01" && cat !== "AC02 + AC021";
    const ariaSummary = YEARS.map(yr => `${yr}: ${fmt(share(yr, ag, cat))}%`).join(", ");

    svg.append("path")
      .attr("class", `bump-area ba-${safeId(cat)}`)
      .attr("d", ribbonPath(cat))
      .attr("fill", CAT_COLORS[cat])
      .attr("stroke", "#F7F3EB")
      .attr("stroke-width", 0.8)
      .attr("opacity", 0)
      .attr("tabindex", 0)
      .attr("role", canSelect ? "button" : "img")
      .attr("aria-label", canSelect
        ? `${CAT_LABELS[cat]}. ${ariaSummary}. Press Enter to open this activity in the deep-dive chart.`
        : `${CAT_LABELS[cat]}. ${ariaSummary}.`)
      .on("mouseenter", function (ev) { bumpHover(cat, ev); })
      .on("mousemove", function (ev) { moveTip(ev); })
      .on("mouseleave", function ()  { bumpUnhover(); })
      .on("focus", function () {
        bumpHover(cat, getElementTipPoint(this));
      })
      .on("blur", function () {
        bumpUnhover();
      })
      .on("keydown", function (ev) {
        if (canSelect && activationKeyPressed(ev)) {
          ev.preventDefault();
          selectCat(cat);
        }
      })
      .on("click", function () {
        if (canSelect) selectCat(cat);
      })
      .transition().delay(i * 35).duration(450).ease(d3.easeCubicOut)
      .attr("opacity", 0.82);
  });

  /* ---- year markers ---- */
  YEARS.forEach(yr => {
    svg.append("line")
      .attr("x1", x(yr)).attr("x2", x(yr))
      .attr("y1", 0).attr("y2", h)
      .attr("stroke", "#1A1612").attr("stroke-width", 1.8)
      .attr("stroke-opacity", 0.18);
    svg.append("text")
      .attr("x", x(yr)).attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("font-family", "'Playfair Display', serif")
      .attr("font-size", "15px").attr("font-weight", 600)
      .attr("fill", "#1A1612")
      .text(yr);
  });

  /* ---- end labels (with collision avoidance) ---- */
  const last = snapshots.at(-1);
  const labelPos = last.map(d => ({
    cat: d.cat,
    y: y((d.y0 + d.y1) / 2)
  }));
  spreadLabels(labelPos, 13);
  labelPos.forEach(({ cat, y: ly }) => {
    svg.append("text")
      .attr("x", w + 10).attr("y", ly)
      .attr("dy", "0.35em")
      .attr("font-size", "10.5px").attr("font-weight", 600)
      .attr("fill", CAT_COLORS[cat])
      .text(CAT_LABELS[cat]);
  });

  /* ---- scale note ---- */
  svg.append("text")
    .attr("x", 0).attr("y", h + 32)
    .attr("font-size", "10px").attr("fill", "#9B9488")
    .text("Band widths use a √ scale so small categories remain visible. Hover or focus for actual values.");
}

function bumpHover(cat, ev) {
  state.hoverCat = cat;
  d3.selectAll(".bump-area").classed("dimmed", true);
  d3.selectAll(`.ba-${safeId(cat)}`).classed("dimmed", false).classed("bright", true);

  /* find nearest year frame for tooltip data */
  const ag = state.bumpAge;
  const rows = YEARS.map(yr => {
    const m = getMin(yr, ag, cat);
    const s = share(yr, ag, cat);
    return `${yr}: <strong>${fmt(m)}</strong> min (${fmt(s)}%)`;
  }).join("<br>");

  showTip(`<div class="tt-title">${CAT_LABELS[cat]}</div>${rows}`, ev);

  /* dim legend */
  d3.selectAll("#bump-legend .legend-item").style("opacity", function () {
    return this.dataset.cat === cat ? 1 : 0.25;
  });
}

function bumpUnhover() {
  state.hoverCat = null;
  d3.selectAll(".bump-area").classed("dimmed", false).classed("bright", false);
  d3.selectAll("#bump-legend .legend-item").style("opacity", 1);
  hideTip();
}

// ===========================================================
// 8. LINE CHART
// ===========================================================

function drawLine() {
  const el = d3.select("#line-chart");
  el.html("");

  const W = 960, H = 400;
  const m = { t: 24, r: 105, b: 44, l: 58 };
  const w = W - m.l - m.r, h = H - m.t - m.b;
  const cat = state.lineCat;

  const svgRoot = el.append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("aria-labelledby", "line-title line-desc");

  svgRoot.append("title")
    .attr("id", "line-title")
    .text(`Activity deep dive for ${CAT_LABELS[cat]}`);

  svgRoot.append("desc")
    .attr("id", "line-desc")
    .text("Line chart comparing age groups from 2000 to 2020. Focus any data point to hear minutes and share values.");

  const svg = svgRoot.append("g").attr("transform", `translate(${m.l},${m.t})`);

  /* ---- data ---- */
  const lines = AGE_GROUPS.map(ag => ({
    ag,
    pts: YEARS.map(yr => ({
      year: yr,
      pct: share(yr, ag, cat),
      min: getMin(yr, ag, cat)
    }))
  }));

  /* ---- scales ---- */
  const allPct = lines.flatMap(l => l.pts.map(p => p.pct));
  const yMax = Math.max(d3.max(allPct) * 1.15, 1);

  const x = d3.scaleLinear().domain([2000, 2020]).range([0, w]);
  const yS = d3.scaleLinear().domain([0, yMax]).range([h, 0]).nice();

  /* ---- grid ---- */
  svg.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${h})`).call(
      d3.axisBottom(x).tickValues(YEARS).tickFormat(d3.format("d")).tickSize(0)
    ).call(g => g.select(".domain").attr("stroke", "#D4CFC4"));

  svg.append("g").attr("class", "axis").call(
    d3.axisLeft(yS).ticks(5).tickFormat(d => d.toFixed(0) + "%").tickSize(-w)
  ).call(g => {
    g.select(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "#E8E4DA");
    g.selectAll(".tick text").attr("x", -8);
  });

  /* ---- line generator ---- */
  const lineFn = d3.line()
    .x(d => x(d.year)).y(d => yS(d.pct))
    .curve(d3.curveMonotoneX);

  /* ---- draw per age group (collect end positions for label spread) ---- */
  const endPositions = [];

  lines.forEach(({ ag, pts }, gi) => {
    svg.append("path")
      .datum(pts)
      .attr("class", `line-path lp-${safeId(ag)}`)
      .attr("d", lineFn)
      .attr("stroke", AG_COLORS[ag]);

    /* dots */
    svg.selectAll(null).data(pts).join("circle")
      .attr("class", `line-dot ld-${safeId(ag)}`)
      .attr("cx", d => x(d.year)).attr("cy", d => yS(d.pct))
      .attr("r", 4.5)
      .attr("fill", AG_COLORS[ag])
      .attr("stroke", "#F7F3EB").attr("stroke-width", 2)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", d => `${ag}, ${d.year}. ${CAT_LABELS[cat]}: ${fmt(d.min)} minutes, ${fmt(d.pct)} percent.`)
      .on("mouseenter", function (ev, d) {
        showTip(
          `<div class="tt-title">${ag} · ${d.year}</div>` +
          `${CAT_LABELS[cat]}: <strong>${fmt(d.min)}</strong> min/day<br>` +
          `Share of tracked time: <strong>${fmt(d.pct)}%</strong>`, ev
        );
      })
      .on("focus", function (ev, d) {
        showTip(
          `<div class="tt-title">${ag} · ${d.year}</div>` +
          `${CAT_LABELS[cat]}: <strong>${fmt(d.min)}</strong> min/day<br>` +
          `Share of tracked time: <strong>${fmt(d.pct)}%</strong>`,
          getElementTipPoint(this)
        );
      })
      .on("keydown", function (ev, d) {
        if (!activationKeyPressed(ev)) return;

        ev.preventDefault();
        showTip(
          `<div class="tt-title">${ag} · ${d.year}</div>` +
          `${CAT_LABELS[cat]}: <strong>${fmt(d.min)}</strong> min/day<br>` +
          `Share of tracked time: <strong>${fmt(d.pct)}%</strong>`,
          getElementTipPoint(this)
        );
      })
      .on("blur", hideTip)
      .on("mousemove", moveTip)
      .on("mouseleave", hideTip);

    /* collect end position */
    const last = pts.at(-1);
    endPositions.push({ ag, y: yS(last.pct), color: AG_COLORS[ag] });
  });

  /* end labels with collision avoidance */
  spreadLabels(endPositions, 14);
  endPositions.forEach(({ ag, y: ly, color }) => {
    svg.append("text")
      .attr("x", x(2020) + 10).attr("y", ly)
      .attr("dy", "0.35em")
      .attr("font-size", "11.5px").attr("font-weight", 700)
      .attr("fill", color)
      .text(ag);
  });

  /* ---- hover overlay ---- */
  svg.append("rect")
    .attr("width", w).attr("height", h)
    .attr("fill", "transparent").attr("cursor", "crosshair")
    .on("mousemove", function (ev) {
      const [mx] = d3.pointer(ev, this);
      const yr = YEARS.reduce((p, c) => Math.abs(x.invert(mx) - c) < Math.abs(x.invert(mx) - p) ? c : p, YEARS[0]);
      lineHover(yr, ev);
    })
    .on("mouseleave", lineUnhover);

  /* vertical hover line (hidden initially) */
  svg.append("line").attr("class", "hover-rule")
    .attr("y1", 0).attr("y2", h)
    .attr("stroke", "#1A1612").attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 3").attr("opacity", 0);

  /* note */
  d3.select("#line-note").html(LINE_NOTES[cat] || "");
}

function lineHover(yr, ev) {
  const el = d3.select("#line-chart svg g");
  const x = d3.scaleLinear().domain([2000, 2020]).range([0, 960 - 58 - 105]);
  el.select(".hover-rule")
    .attr("x1", x(yr)).attr("x2", x(yr)).attr("opacity", 0.35);
}
function lineUnhover() {
  d3.select("#line-chart svg g .hover-rule").attr("opacity", 0);
  hideTip();
}

// ===========================================================
// 9. WAFFLE CHART
// ===========================================================

function drawWaffle() {
  const el = d3.select("#waffle-chart");
  el.html("");
  const ag = state.waffleAge;

  const row = el.append("div").attr("class", "waffle-row");

  YEARS.forEach(yr => {
    const vd = DATA.values[String(yr)][ag];
    const alone = vd.alone_pct, shared = vd.shared_pct, other = vd.other_pct;
    const sq = roundTo100([alone, shared, other]);

    /* build cell types */
    const cells = [];
    for (let i = 0; i < sq[0]; i++) cells.push("alone");
    for (let i = 0; i < sq[1]; i++) cells.push("shared");
    for (let i = 0; i < sq[2]; i++) cells.push("other");
    cells.reverse();       // alone at bottom

    const tipHtml =
      `<div class="tt-title">${yr} · ${ag}</div>` +
      `Alone: <strong>${fmt(alone)}%</strong><br>` +
      `Shared: <strong>${fmt(shared)}%</strong><br>` +
      `Other: <strong>${fmt(other)}%</strong>`;

    const col = row.append("div")
      .attr("class", "waffle-year")
      .attr("tabindex", 0)
      .attr("role", "img")
      .attr("aria-label", `${yr}, ${ag}. Alone ${fmt(alone)} percent, shared ${fmt(shared)} percent, other ${fmt(other)} percent.`)
      .on("focus", function () {
        showTip(tipHtml, getElementTipPoint(this));
      })
      .on("keydown", function (ev) {
        if (!activationKeyPressed(ev)) return;

        ev.preventDefault();
        showTip(tipHtml, getElementTipPoint(this));
      })
      .on("blur", hideTip);

    col.append("div").attr("class", "waffle-year-label").text(yr);

    const grid = col.append("div").attr("class", "waffle-grid");
    cells.forEach((type, i) => {
      grid.append("div")
        .attr("class", "waffle-cell")
        .attr("data-type", type)
        .style("background-color", WAFFLE_COLORS[type])
        .style("opacity", 0)
        .on("mouseenter", function (ev) {
          /* dim other types */
          d3.selectAll(".waffle-cell").classed("dimmed", function () {
            return this.dataset.type !== type;
          });
          showTip(tipHtml, ev);
        })
        .on("mousemove", moveTip)
        .on("mouseleave", function () {
          d3.selectAll(".waffle-cell").classed("dimmed", false);
          hideTip();
        })
        .transition().delay(i * 6).duration(300)
        .style("opacity", 1);
    });

    /* pct labels below grid */
    col.append("div").attr("class", "waffle-pcts").html(
      `<span style="color:${WAFFLE_COLORS.alone}">● ${fmt(alone)}%</span>` +
      `<span style="color:${WAFFLE_COLORS.shared}">● ${fmt(shared)}%</span>` +
      `<span style="color:${WAFFLE_COLORS.other}">● ${fmt(other)}%</span>`
    );
  });

  /* waffle legend */
  el.append("div").attr("class", "waffle-legend").html(
    `<div class="waffle-legend-item"><div class="waffle-legend-swatch" style="background:${WAFFLE_COLORS.alone}"></div>Alone</div>` +
    `<div class="waffle-legend-item"><div class="waffle-legend-swatch" style="background:${WAFFLE_COLORS.shared}"></div>Shared</div>` +
    `<div class="waffle-legend-item"><div class="waffle-legend-swatch" style="background:${WAFFLE_COLORS.other}"></div>Other</div>`
  );
}

// ===========================================================
// 10. LEGEND (BUMP)
// ===========================================================

function buildBumpLegend() {
  const el = d3.select("#bump-legend");
  el.html("");
  CATEGORIES.forEach(cat => {
    const canSelect = cat !== "AC01" && cat !== "AC02 + AC021";

    const item = el.append("button")
      .attr("type", "button")
      .attr("class", "legend-item legend-item-button")
      .attr("data-cat", cat)
      .attr("aria-label", canSelect
        ? `Highlight ${CAT_LABELS[cat]} and open it in the deep-dive chart`
        : `Highlight ${CAT_LABELS[cat]}`)
      .on("mouseenter", function (ev) { bumpHover(cat, ev); })
      .on("focus", function () {
        bumpHover(cat, getElementTipPoint(this));
      })
      .on("mouseleave", bumpUnhover)
      .on("blur", bumpUnhover)
      .on("click", function () {
        if (canSelect) selectCat(cat);
      });

    item.append("div").attr("class", "legend-swatch")
      .style("background", CAT_COLORS[cat]);
    item.append("span").text(CAT_LABELS[cat]);
  });
}

// ===========================================================
// 11. LINE LEGEND
// ===========================================================

function buildLineLegend() {
  const el = d3.select("#line-legend");
  el.html("");
  AGE_GROUPS.forEach(ag => {
    const item = el.append("div").attr("class", "legend-item");
    item.append("div").attr("class", "legend-swatch")
      .style("background", AG_COLORS[ag]);
    item.append("span").text(ag);
  });
}

// ===========================================================
// 12. TABS & BUTTONS
// ===========================================================

function buildTabs(containerId, groups, activeVal, onChange) {
  const el = d3.select(`#${containerId}`);
  el.html("");
  el.attr("role", "group")
    .attr(
      "aria-label",
      containerId === "bump-tabs"
        ? "Select age group for the landscape chart"
        : "Select age group for the alone, shared, or other chart"
    );

  groups.forEach(g => {
    el.append("button")
      .attr("type", "button")
      .attr("aria-pressed", g === activeVal ? "true" : "false")
      .text(g)
      .classed("active", g === activeVal)
      .on("click", function () {
        el.selectAll("button")
          .classed("active", false)
          .attr("aria-pressed", "false");

        d3.select(this)
          .classed("active", true)
          .attr("aria-pressed", "true");

        onChange(g);
      });
  });
}

function buildCatButtons() {
  const el = d3.select("#cat-buttons");
  el.html("");
  el.attr("role", "group").attr("aria-label", "Select activity category for deep-dive line chart");

  LINE_CATS.forEach(cat => {
    const btn = el.append("button")
      .attr("type", "button")
      .attr("aria-pressed", cat === state.lineCat ? "true" : "false")
      .classed("active", cat === state.lineCat)
      .on("click", function () {
        el.selectAll("button")
          .classed("active", false)
          .attr("aria-pressed", "false");

        d3.select(this)
          .classed("active", true)
          .attr("aria-pressed", "true");

        /* set bg colour on active */
        el.selectAll("button.active").each(function () {
          const c = this.dataset.cat;
          d3.select(this).style("background", CAT_COLORS[c]).style("border-color", CAT_COLORS[c]);
        });
        selectCat(cat);
      });
    btn.attr("data-cat", cat);
    btn.append("span").attr("class", "dot").style("background", CAT_COLORS[cat]);
    btn.append("span").text(CAT_LABELS[cat]);
  });
  /* style the initial active button */
  styleActiveBtn();
}

function styleActiveBtn() {
  d3.selectAll("#cat-buttons button").each(function () {
    const c = this.dataset.cat;
    if (d3.select(this).classed("active")) {
      d3.select(this).style("background", CAT_COLORS[c]).style("border-color", CAT_COLORS[c]);
    } else {
      d3.select(this).style("background", null).style("border-color", null);
    }
  });
}

function selectCat(cat) {
  state.lineCat = cat;

  d3.selectAll("#cat-buttons button")
    .classed("active", function () {
      return this.dataset.cat === cat;
    })
    .attr("aria-pressed", function () {
      return this.dataset.cat === cat ? "true" : "false";
    });

  styleActiveBtn();
  drawLine();

  /* scroll line section into view */
  document.getElementById("line-section").scrollIntoView({
    behavior: getPreferredScrollBehavior(),
    block: "start"
  });

  announce(`${CAT_LABELS[cat]} selected in activity deep dive.`);
}

/* Age-group change: sync bump + waffle */
function setAge(ag) {
  /* Save scroll — chart redraws cause micro layout shifts that can nudge the
     viewport; restore immediately after all synchronous DOM updates. */
  const savedY = globalThis.scrollY;

  state.bumpAge = ag;
  state.waffleAge = ag;

  /* update both tab sets */
  d3.selectAll("#bump-tabs button").classed("active", function () {
    return d3.select(this).text() === ag;
  }).attr("aria-pressed", function () {
    return d3.select(this).text() === ag ? "true" : "false";
  });

  d3.selectAll("#waffle-tabs button").classed("active", function () {
    return d3.select(this).text() === ag;
  }).attr("aria-pressed", function () {
    return d3.select(this).text() === ag ? "true" : "false";
  });

  drawBump();
  renderBumpNote(ag);
  drawWaffle();

  /* Keep the viewport locked even though the page uses smooth scrolling. */
  scrollToInstant(savedY);
  requestAnimationFrame(() => {
    scrollToInstant(savedY);
  });

  announce(`Age group ${ag} selected.`);
}

// ===========================================================
// 13. SCROLL REVEAL
// ===========================================================

function initReveal() {
  if (prefersReducedMotion()) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

// ===========================================================
// 14. INIT
// ===========================================================

function init() {
  /* tabs */
  buildTabs("bump-tabs",   AGE_GROUPS, state.bumpAge,   setAge);
  buildTabs("waffle-tabs", AGE_GROUPS, state.waffleAge,  setAge);

  /* category buttons for line chart */
  buildCatButtons();

  /* legends */
  buildBumpLegend();
  buildLineLegend();

  /* charts */
  drawBump();
  drawLine();
  drawWaffle();

  /* notes */
  renderBumpNote(state.bumpAge);
  lockBumpNoteHeight();

  globalThis.addEventListener("resize", scheduleBumpNoteHeightLock, { passive: true });
  if (globalThis.visualViewport) {
    globalThis.visualViewport.addEventListener("resize", scheduleBumpNoteHeightLock, { passive: true });
  }

  document.fonts?.ready?.then(() => {
    lockBumpNoteHeight();
  });

  /* scroll animations */
  initReveal();
}

document.addEventListener("DOMContentLoaded", init);
