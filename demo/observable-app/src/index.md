# Time Spend Analysis

*As a social species how is the loneliness epidemic happening and can we see it in the evolution of our time use?*

This visualisation explores how people across different age groups distribute their daily time across nine activity categories over three survey waves: 2000, 2010, and 2020.

Each data point encodes: the **activity category**, the **age group** (18-25, 25-35, 35-45), the **survey year**, the **total time spent** in hours, and the **social context** of that time (alone, shared with others, or other).

---

```js
// ─────────────────────────────────────────────────────────────
//  DATA GENERATION  (simulated database)
// ─────────────────────────────────────────────────────────────
const YEARS = [2000, 2010, 2020];
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

const CATEGORY_ICONS = {
  "eating":                           "🍽️",
  "study":                            "📚",
  "sleeping":                         "😴",
  "paid work":                        "💼",
  "household chores and family care": "🏠",
  "personal care":                    "🧴",
  "voluntary work":                   "🤝",
  "social life":                      "👥",
  "travel and leisure":               "✈️"
};

function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
const rand = seededRand(42);

function randPct3() {
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

function buildWaffleData(subset) {
  const tranchesAge = [...new Set(subset.map(d => d.age_gap))];
  const out = [];
  for (const age of tranchesAge) {
    const dataAge     = subset.filter(d => d.age_gap === age);
    const totalHeures = dataAge.reduce((s, d) => s + d.temps_total, 0);
    const withDec = dataAge.map(d => {
      const pctExact = (d.temps_total / totalHeures) * 100;
      return { ...d, entier: Math.floor(pctExact), reste: pctExact - Math.floor(pctExact) };
    });
    const sommeEntiers = withDec.reduce((s, d) => s + d.entier, 0);
    const reste = 100 - sommeEntiers;
    const sorted = [...withDec].sort((a, b) => b.reste - a.reste);
    sorted.forEach((d, i) => {
      out.push({ ...d, pct_temps: d.entier + (i < reste ? 1 : 0) });
    });
  }
  return out;
}
```

---

## Chart 1 — Time spent per activity over years

**Mark:** line + dot · **X:** survey year · **Y:** hours · **Color:** age group

```js
const selectedCategory = view(Inputs.radio(
  CATEGORIES,
  {
    label: "Category",
    value: "sleeping",
    format: cat => `${CATEGORY_ICONS[cat] ?? ""} ${cat}`
  }
));
```

```js
Plot.plot({
  title: `"${selectedCategory}" time spend`,
  marginRight: 90,
  y: { domain: [0, 10], label: "hours" },
  x: { tickFormat: "d", label: "years" },
  color: { legend: true },
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(data.filter(d => d.categorie === selectedCategory), {
      x: "annee",
      y: "temps_total",
      stroke: "age_gap"
    }),
    Plot.dot(data.filter(d => d.categorie === selectedCategory), {
      x: "annee",
      y: "temps_total",
      fill: "age_gap",
      r: 4,
      tip: true
    }),
    Plot.text(
      data.filter(d => d.categorie === selectedCategory),
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
})
```

---

## Chart 2 — Alone vs Shared over years

**Mark:** stacked barY · **X:** year · **Y:** % of time · **Color:** social context (Alone / Shared / Other)

```js
const selectedAgeGap = view(Inputs.select(
  AGE_GAPS,
  { label: "Age gap", value: "18-25" }
));
```

```js
const filteredChart2 = data.filter(d =>
  d.categorie === selectedCategory && d.age_gap === selectedAgeGap
);

const flatChart2 = filteredChart2.flatMap(d => [
  { annee: String(d.annee), type: "Alone",  valeur: d.pct_seul      },
  { annee: String(d.annee), type: "Shared", valeur: d.pct_collectif },
  { annee: String(d.annee), type: "Other",  valeur: d.pct_autre     }
]);

Plot.plot({
  title: "Time repartition : Alone vs Shared",
  x: { type: "band", label: "Years", domain: YEARS.map(String) },
  y: { domain: [0, 100], label: "% of the time" },
  color: { domain: ["Alone", "Shared", "Other"], legend: true },
  marks: [
    Plot.barY(flatChart2, {
      x: "annee",
      y: "valeur",
      fill: "type",
      tip: true
    }),
    Plot.ruleY([0])
  ]
})
```

---

## Chart 3 — Activity distribution (waffle) & Chart 4 — Pie chart

Both charts react to the year selector below.

**Waffle — Mark:** waffleY · **Pie — Mark:** arc · **Facet:** age group · **Color:** activity category

```js
const selectedYear = view(Inputs.select(
  YEARS,
  { label: "Year", value: 2020 }
));
```

```js
const waffleData = buildWaffleData(data.filter(d => d.annee === selectedYear));

Plot.plot({
  title: `Repartition of time spend (Year ${selectedYear})`,
  width: 800,
  fx: { label: "Age gap" },
  color: { legend: true, scheme: "Tableau10", columns: 3 },
  marks: [
    Plot.waffleY(waffleData, {
      fx: "age_gap",
      y: "pct_temps",
      fill: "categorie",
      sort: "categorie",
      tip: true,
      multiple: 10
    })
  ]
})
```

```js
// Pie chart via Plot.arc with precomputed angles using d3.pie()
const pieRows = [];
for (const age of AGE_GAPS) {
  const slices = waffleData.filter(d => d.age_gap === age);
  const arcs = d3.pie().value(d => d.pct_temps).sort(null)(slices);
  for (const a of arcs) {
    pieRows.push({
      age_gap:   a.data.age_gap,
      categorie: a.data.categorie,
      pct_temps: a.data.pct_temps,
      theta1:    a.startAngle,
      theta2:    a.endAngle
    });
  }
}

Plot.plot({
  title: `Activity distribution — pie chart (Year ${selectedYear})`,
  width: 860,
  height: 320,
  fx: { label: "Age gap" },
  color: { legend: true, scheme: "Tableau10", columns: 3 },
  marks: [
    Plot.arc(pieRows, {
      fx:          "age_gap",
      theta1:      "theta1",
      theta2:      "theta2",
      fill:        "categorie",
      outerRadius: 120,
      innerRadius: 0,
      tip:         true
    })
  ]
})
```
