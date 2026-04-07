// ─────────────────────────────────────────────────────────────
//  1. DATA GENERATION  (imitation de la base de données)
// ─────────────────────────────────────────────────────────────
const YEARS      = [2000, 2010, 2020];
const CATEGORIES = [
  "eating",
  "study",
  "sleeping",
  "paid work",
  "household chores and family care",
  "personal care",
  "voluntary work",
  "social life",
  "travel and leisure"
];
const AGE_GAPS = ["18-25", "25-35", "35-45"];

// Seeded pseudo-random (so the page stays deterministic on reload)
function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
const rand = seededRand(42);

function randPct3() {
  // Returns [a, b, c] with a+b+c = 100, all ≥ 5
  const a = Math.floor(rand() * 70) + 10;
  const b = Math.floor(rand() * (90 - a)) + 5;
  const c = 100 - a - b;
  return [a, b, c];
}

const data = [];
for (const y of YEARS) {
  for (const c of CATEGORIES) {
    for (const a of AGE_GAPS) {
      const total = Math.floor(rand() * 8) + 1;
      const [pct_seul, pct_collectif, pct_autre] = randPct3();
      data.push({
        annee: y,
        categorie: c,
        age_gap: a,
        temps_total: total,
        pct_seul,
        pct_collectif,
        pct_autre
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  2. WAFFLE DATA PREPARATION  (distribution en %)
// ─────────────────────────────────────────────────────────────
function buildWaffleData(subset) {
  const tranchesAge = [...new Set(subset.map(d => d.age_gap))];
  const out = [];

  for (const age of tranchesAge) {
    const dataAge      = subset.filter(d => d.age_gap === age);
    const totalHeures  = dataAge.reduce((s, d) => s + d.temps_total, 0);

    // Exact percentages + integer + decimal remainder
    const withDec = dataAge.map(d => {
      const pctExact = (d.temps_total / totalHeures) * 100;
      return { ...d, entier: Math.floor(pctExact), reste: pctExact - Math.floor(pctExact) };
    });

    const sommeEntiers = withDec.reduce((s, d) => s + d.entier, 0);
    const reste        = 100 - sommeEntiers;

    // Give the remaining % points to items with the biggest decimal parts
    const sorted = [...withDec].sort((a, b) => b.reste - a.reste);
    sorted.forEach((d, i) => {
      out.push({ ...d, pct_temps: d.entier + (i < reste ? 1 : 0) });
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
//  3. FILTER STATE
// ─────────────────────────────────────────────────────────────
let selectedCategory = "sleeping";   // default (same as Observable)
let selectedAgeGap   = "18-25";
let selectedYear     = 2020;

// ─────────────────────────────────────────────────────────────
//  4. BUILD RADIO BUTTONS
// ─────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  "eating":                              "🍽️",
  "study":                               "📚",
  "sleeping":                            "😴",
  "paid work":                           "💼",
  "household chores and family care":    "🏠",
  "personal care":                       "🧴",
  "voluntary work":                      "🤝",
  "social life":                         "👥",
  "travel and leisure":                  "✈️"
};

const radioContainer = document.getElementById("categoryRadio");
CATEGORIES.forEach(cat => {
  const lbl = document.createElement("label");
  lbl.dataset.value = cat;
  if (cat === selectedCategory) lbl.classList.add("selected");

  const icon = document.createElement("span");
  icon.className = "cat-icon";
  icon.textContent = CATEGORY_ICONS[cat] || "";

  const text = document.createElement("span");
  text.className = "cat-text";
  text.textContent = cat;

  lbl.appendChild(icon);
  lbl.appendChild(text);

  lbl.addEventListener("click", () => {
    selectedCategory = cat;
    document.querySelectorAll("#categoryRadio label").forEach(l =>
      l.classList.toggle("selected", l.dataset.value === cat)
    );
    render();
  });
  radioContainer.appendChild(lbl);
});

document.getElementById("ageGapSelect").addEventListener("change", e => {
  selectedAgeGap = e.target.value;
  render();
});

document.getElementById("yearSelect").addEventListener("change", e => {
  selectedYear = Number(e.target.value);
  render();
});

// ─────────────────────────────────────────────────────────────
//  5. CHART RENDERING
// ─────────────────────────────────────────────────────────────
function clearChart(id) {
  const el = document.getElementById(id);
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

function renderChart1() {
  const container = clearChart("chart1");
  document.getElementById("chart1Title").textContent =
    `"${selectedCategory}" time spend`;

  const filtered = data.filter(d => d.categorie === selectedCategory);

  const chart = Plot.plot({
    marginRight: 80,
    y: { domain: [0, 10], label: "hours" },
    x: { tickFormat: "d", label: "years" },
    color: { legend: true },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(filtered, {
        x: "annee",
        y: "temps_total",
        stroke: "age_gap"
      }),
      Plot.dot(filtered, {
        x: "annee",
        y: "temps_total",
        fill: "age_gap",
        r: 4,
        tip: true
      }),
      Plot.text(
        filtered,
        Plot.selectLast({
          x: "annee",
          y: "temps_total",
          text: "age_gap",
          fill: "age_gap",
          dx: 8,
          textAnchor: "start"
        })
      )
    ]
  });

  container.appendChild(chart);
}

function renderChart2() {
  const container = clearChart("chart2");

  // Filter by category AND selected age gap
  const filtered = data.filter(d =>
    d.categorie === selectedCategory && d.age_gap === selectedAgeGap
  );

  // Flatten into alone / shared / other rows
  const flat = filtered.flatMap(d => [
    { annee: String(d.annee), type: "Alone",  valeur: d.pct_seul       },
    { annee: String(d.annee), type: "Shared", valeur: d.pct_collectif  },
    { annee: String(d.annee), type: "Other",  valeur: d.pct_autre      }
  ]);

  const chart = Plot.plot({
    x: {
      type: "band",
      label: "Years",
      domain: YEARS.map(String)
    },
    y: { domain: [0, 100], label: "% of the time" },
    color: {
      domain: ["Alone", "Shared", "Other"],
      legend: true
    },
    marks: [
      Plot.barY(flat, {
        x: "annee",
        y: "valeur",
        fill: "type",
        tip: true
      }),
      Plot.ruleY([0])
    ]
  });

  container.appendChild(chart);
}

function renderChart3() {
  const container = clearChart("chart3");
  document.getElementById("chart3Title").textContent =
    `Repartition of time spend (Year ${selectedYear})`;

  const dataByYear    = data.filter(d => d.annee === selectedYear);
  const dataWafflePct = buildWaffleData(dataByYear);

  // waffleY is available in Plot ≥ 0.6.2
  if (typeof Plot.waffleY !== "function") {
    container.textContent = "Waffle chart requires @observablehq/plot ≥ 0.6.2";
    return;
  }

  const chart = Plot.plot({
    width: 820,
    fx: { label: "Age gap" },
    color: {
      legend: true,
      scheme: "Tableau10",
      columns: 3
    },
    marks: [
      Plot.waffleY(dataWafflePct, {
        fx: "age_gap",
        y: "pct_temps",
        fill: "categorie",
        sort: "categorie",
        tip: true,
        multiple: 10
      })
    ]
  });

  container.appendChild(chart);
}

function render() {
  renderChart1();
  renderChart2();
  renderChart3();
}

// Initial render
render();
