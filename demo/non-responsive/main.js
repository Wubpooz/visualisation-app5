const CATEGORY_META = {
  "AC01": { short: "Sleep", label: "Sleeping", color: "#111827" },
  "AC02 + AC021": { short: "Eating", label: "Eating", color: "#1d4ed8" },
  "AC812": { short: "Reading", label: "Reading books", color: "#7c3aed" },
  "AC72": { short: "Computing", label: "Computing", color: "#0f766e" },
  "AC512_513_519": { short: "Socialising", label: "Socialising with others", color: "#dc2626" },
  "AC52": { short: "Culture", label: "Entertainment and culture", color: "#ea580c" },
  "AC611": { short: "Walking", label: "Walking and hiking", color: "#059669" },
  "AC321": { short: "Cleaning", label: "Cleaning dwelling", color: "#6d28d9" },
  "AC382_383": { short: "Child time", label: "Teaching, reading, playing and talking with child", color: "#be123c" },
  "AC910": { short: "Commute", label: "Travel to/from work", color: "#9333ea" }
};

const AGE_META = {
  "10-24": { color: "#111827" },
  "25-44": { color: "#0f766e" },
  "45-64": { color: "#1d4ed8" },
  "65+": { color: "#b45309" }
};

const SOCIAL_META = [
  { key: "alonePct", label: "Alone", color: "#111827" },
  { key: "sharedPct", label: "Shared", color: "#0f766e" },
  { key: "otherPct", label: "Other", color: "#9ca3af" }
];

const MINUTES_PER_DAY = 1440;
const formatPercent = d3.format(".1f");

const state = {
  raw: null,
  years: [],
  ageGroups: [],
  categories: [],
  activityRecords: [],
  socialRecords: [],
  selectedBumpAge: null,
  selectedLineCategory: null,
  selectedSocialAge: null,
  ready: false
};

const elements = {
  statusMessage: document.getElementById("statusMessage"),
  bumpAgeTabs: document.getElementById("bumpAgeTabs"),
  socialAgeTabs: document.getElementById("socialAgeTabs"),
  categoryButtons: document.getElementById("categoryButtons"),
  bumpChart: document.getElementById("bumpChart"),
  lineChart: document.getElementById("lineChart"),
  socialChart: document.getElementById("socialChart"),
  categoryLegend: document.getElementById("categoryLegend"),
  ageLegend: document.getElementById("ageLegend"),
  socialLegend: document.getElementById("socialLegend"),
  bumpNarrative: document.getElementById("bumpNarrative"),
  lineNarrative: document.getElementById("lineNarrative"),
  socialNarrative: document.getElementById("socialNarrative")
};

window.addEventListener("DOMContentLoaded", init);

// Load the local JSON file and derive the percentage-based records used by all charts.
async function init() {
  setStatus("Chargement de age_activity_year_average.json...");

  try {
    const response = await fetch("./age_activity_year_average.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const raw = await response.json();
    buildState(raw);
    renderStaticUi();
    renderAll();
    state.ready = true;
    clearStatus();
  } catch (error) {
    const extra = window.location.protocol === "file:"
      ? " Ouvrez cette page via un petit serveur HTTP local pour autoriser fetch()."
      : "";
    setStatus(`Impossible de charger les donnees.${extra}`);
    console.error(error);
  }
}

// Convert the nested export to flat activity and social series.
function buildState(raw) {
  state.raw = raw;
  state.years = [...raw.years].sort((left, right) => left - right);
  state.ageGroups = [...raw.age_groups];
  state.categories = [...raw.activity_categories];
  state.activityRecords = [];
  state.socialRecords = [];

  state.years.forEach((year) => {
    const byAge = raw.values[String(year)] || {};

    state.ageGroups.forEach((ageGroup) => {
      const node = byAge[ageGroup];
      if (!node) {
        return;
      }

      const categoryRows = state.categories
        .map((categoryCode) => {
          const activityNode = node[categoryCode];
          if (!activityNode) {
            return null;
          }

          return {
            year,
            ageGroup,
            categoryCode,
            categoryLabel: getCategoryMeta(categoryCode).label,
            categoryShort: getCategoryMeta(categoryCode).short,
            averageMinutes: Number(activityNode.average_minutes),
            observationCount: Number(activityNode.observation_count)
          };
        })
        .filter(Boolean);

      categoryRows.forEach((row) => {
        // The activity charts use the real share of a 24h day, not a normalization across exported categories only.
        row.dayPct = (row.averageMinutes / MINUTES_PER_DAY) * 100;
        state.activityRecords.push(row);
      });

      state.socialRecords.push({
        year,
        ageGroup,
        alonePct: Number(node.alone_pct),
        sharedPct: Number(node.shared_pct),
        otherPct: Number(node.other_pct)
      });
    });
  });

  assignRanks();
  state.selectedBumpAge = state.ageGroups[0];
  state.selectedLineCategory = state.categories[0];
  state.selectedSocialAge = state.ageGroups[0];
}

// Ranking is computed independently for each age group and year.
function assignRanks() {
  const grouped = d3.groups(state.activityRecords, (row) => row.ageGroup, (row) => row.year);

  grouped.forEach(([, byYear]) => {
    byYear.forEach(([, rows]) => {
      rows
        .sort((left, right) => d3.descending(left.dayPct, right.dayPct))
        .forEach((row, index) => {
          row.rank = index + 1;
        });
    });
  });
}

function renderStaticUi() {
  renderTabs(elements.bumpAgeTabs, state.ageGroups, state.selectedBumpAge, (ageGroup) => {
    state.selectedBumpAge = ageGroup;
    renderBumpSection();
  });

  renderTabs(elements.socialAgeTabs, state.ageGroups, state.selectedSocialAge, (ageGroup) => {
    state.selectedSocialAge = ageGroup;
    renderSocialSection();
  });

  renderCategoryButtons();
  renderLegend(elements.categoryLegend, state.categories.map((categoryCode) => ({
    color: getCategoryMeta(categoryCode).color,
    label: `${categoryCode} ${getCategoryMeta(categoryCode).label}`
  })));
  renderLegend(elements.ageLegend, state.ageGroups.map((ageGroup) => ({
    color: getAgeColor(ageGroup),
    label: ageGroup
  })));
  renderLegend(elements.socialLegend, SOCIAL_META.map((item) => ({
    color: item.color,
    label: item.label
  })));
}

function renderCategoryButtons() {
  clearElement(elements.categoryButtons);

  state.categories.forEach((categoryCode) => {
    const meta = getCategoryMeta(categoryCode);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = categoryCode;

    if (categoryCode === state.selectedLineCategory) {
      button.classList.add("is-active");
    }

    const code = document.createElement("span");
    code.className = "category-button-code";
    code.textContent = categoryCode;

    const label = document.createElement("span");
    label.className = "category-button-label";
    label.textContent = meta.label;

    button.append(code, label);
    button.addEventListener("click", () => {
      state.selectedLineCategory = categoryCode;
      syncCategoryButtons();
      renderLineSection();
    });

    elements.categoryButtons.appendChild(button);
  });
}

function syncCategoryButtons() {
  elements.categoryButtons.querySelectorAll(".category-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === state.selectedLineCategory);
  });
}

function renderAll() {
  renderBumpSection();
  renderLineSection();
  renderSocialSection();
}

// Section 1: area-bump style ribbons with rank-driven vertical position.
function renderBumpSection() {
  const container = clearElement(elements.bumpChart);
  const data = state.activityRecords
    .filter((row) => row.ageGroup === state.selectedBumpAge)
    .sort((left, right) => left.year - right.year);

  const series = d3.groups(data, (row) => row.categoryCode)
    .map(([categoryCode, rows]) => ({
      categoryCode,
      rows: rows.sort((left, right) => left.year - right.year)
    }))
    .sort((left, right) => {
      const leftRank = left.rows[left.rows.length - 1]?.rank || 0;
      const rightRank = right.rows[right.rows.length - 1]?.rank || 0;
      return leftRank - rightRank;
    });

  const width = getChartWidth(container, 960);
  const margin = { top: 28, right: 180, bottom: 52, left: 74 };
  const height = margin.top + margin.bottom + state.categories.length * 50;
  const extent = d3.extent(data, (row) => row.dayPct);
  const minShare = extent[0] ?? 0;
  const maxShare = extent[1] ?? 1;
  const thickness = minShare === maxShare
    ? () => 18
    : d3.scaleSqrt().domain([minShare, maxShare]).range([12, 34]);

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear()
    .domain(d3.extent(state.years))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0.5, state.categories.length + 0.5])
    .range([margin.top, height - margin.bottom]);

  svg.append("g")
    .attr("class", "grid")
    .selectAll("line")
    .data(getYearTicks())
    .join("line")
    .attr("x1", (year) => x(year))
    .attr("x2", (year) => x(year))
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)
    .attr("stroke-dasharray", "3 5");

  svg.append("text")
    .attr("class", "annotation-text")
    .attr("x", margin.left)
    .attr("y", margin.top - 8)
    .text("Higher share");

  svg.append("text")
    .attr("class", "annotation-text")
    .attr("x", margin.left + 118)
    .attr("y", margin.top - 8)
    .text("Ribbon thickness = % of day spent");

  svg.append("text")
    .attr("class", "annotation-text")
    .attr("x", margin.left)
    .attr("y", height - margin.bottom + 34)
    .text("Lower share");

  const area = d3.area()
    .x((row) => x(row.year))
    .y0((row) => y(row.rank) - thickness(row.dayPct) / 2)
    .y1((row) => y(row.rank) + thickness(row.dayPct) / 2)
    .curve(d3.curveCatmullRom.alpha(0.55));

  const groups = svg.append("g");

  const ribbons = groups.selectAll("g")
    .data(series)
    .join("g");

  ribbons.append("path")
    .attr("class", "bump-ribbon")
    .attr("fill", (seriesItem) => getCategoryMeta(seriesItem.categoryCode).color)
    .attr("opacity", 0.9)
    .attr("d", (seriesItem) => area(seriesItem.rows))
    .append("title")
    .text((seriesItem) => seriesItem.rows
      .map((row) => `${row.year}: ${formatPercent(row.dayPct)}%`)
      .join(" | "));

  ribbons.selectAll("circle")
    .data((seriesItem) => seriesItem.rows.map((row) => ({ ...row, categoryCode: seriesItem.categoryCode })))
    .join("circle")
    .attr("cx", (row) => x(row.year))
    .attr("cy", (row) => y(row.rank))
    .attr("r", 3.5)
    .attr("fill", "#ffffff")
    .attr("stroke", (row) => getCategoryMeta(row.categoryCode).color)
    .attr("stroke-width", 1.2)
    .append("title")
    .text((row) => `${row.categoryLabel} | ${row.ageGroup} | ${row.year} | ${formatPercent(row.dayPct)}% of the day`);

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickValues(getYearTicks()).tickFormat(d3.format("d")));

  svg.append("text")
    .attr("class", "label-text")
    .attr("x", width - margin.right + 8)
    .attr("y", margin.top - 8)
    .text("Category");

  svg.append("g")
    .selectAll("text")
    .data(series)
    .join("text")
    .attr("class", "label-text")
    .attr("x", width - margin.right + 8)
    .attr("y", (seriesItem) => y(seriesItem.rows[seriesItem.rows.length - 1].rank) + 4)
    .attr("fill", (seriesItem) => getCategoryMeta(seriesItem.categoryCode).color)
    .attr("font-weight", 700)
    .text((seriesItem) => {
      const lastRow = seriesItem.rows[seriesItem.rows.length - 1];
      return `${getCategoryMeta(seriesItem.categoryCode).short} ${formatPercent(lastRow.dayPct)}%`;
    });

  elements.bumpNarrative.textContent = buildBumpNarrative(state.selectedBumpAge);
}

// Section 2: one line per age group for the selected category.
function renderLineSection() {
  const container = clearElement(elements.lineChart);
  const data = state.activityRecords
    .filter((row) => row.categoryCode === state.selectedLineCategory)
    .sort((left, right) => left.year - right.year);

  const width = getChartWidth(container, 960);
  const height = 380;
  const margin = { top: 24, right: 130, bottom: 52, left: 74 };
  const maxShare = d3.max(data, (row) => row.dayPct) || 0;

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear()
    .domain(d3.extent(state.years))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, Math.max(6, maxShare * 1.15)])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
      d3.axisLeft(y)
        .ticks(5)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat("")
    )
    .call((group) => group.select(".domain").remove());

  const line = d3.line()
    .x((row) => x(row.year))
    .y((row) => y(row.dayPct))
    .curve(d3.curveMonotoneX);

  const series = d3.groups(data, (row) => row.ageGroup)
    .map(([ageGroup, rows]) => ({ ageGroup, rows: rows.sort((left, right) => left.year - right.year) }));

  const groups = svg.append("g");

  groups.selectAll("path.line-outline")
    .data(series)
    .join("path")
    .attr("class", "line-outline")
    .attr("d", (seriesItem) => line(seriesItem.rows));

  groups.selectAll("path.line-stroke")
    .data(series)
    .join("path")
    .attr("class", "line-stroke")
    .attr("stroke", (seriesItem) => getAgeColor(seriesItem.ageGroup))
    .attr("d", (seriesItem) => line(seriesItem.rows));

  groups.selectAll("g.point-group")
    .data(series)
    .join("g")
    .selectAll("circle")
    .data((seriesItem) => seriesItem.rows.map((row) => ({ ...row, ageColor: getAgeColor(seriesItem.ageGroup) })))
    .join("circle")
    .attr("cx", (row) => x(row.year))
    .attr("cy", (row) => y(row.dayPct))
    .attr("r", 4)
    .attr("fill", (row) => row.ageColor)
    .append("title")
    .text((row) => `${row.categoryLabel} | ${row.ageGroup} | ${row.year} | ${formatPercent(row.dayPct)}% of the day`);

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickValues(getYearTicks()).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat((value) => `${formatPercent(value)}%`));

  svg.append("text")
    .attr("class", "label-text")
    .attr("x", margin.left)
    .attr("y", margin.top - 8)
    .text("Percent of the day spent on the selected category");

  drawLineEndLabels(svg, series, x, y, width, height, margin);
  elements.lineNarrative.textContent = buildLineNarrative(state.selectedLineCategory);
}

// Section 3: normalized stacked bars using the social percentages already present in the JSON.
function renderSocialSection() {
  const container = clearElement(elements.socialChart);
  const rows = state.socialRecords
    .filter((row) => row.ageGroup === state.selectedSocialAge)
    .sort((left, right) => left.year - right.year)
    .map((row) => ({
      year: row.year,
      alonePct: row.alonePct,
      sharedPct: row.sharedPct,
      otherPct: row.otherPct
    }));

  const width = getChartWidth(container, 820);
  const height = 330;
  const margin = { top: 24, right: 24, bottom: 56, left: 74 };

  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleBand()
    .domain(rows.map((row) => String(row.year)))
    .range([margin.left, width - margin.right])
    .padding(0.28);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  const stackedRows = rows.map((row) => {
    let runningTotal = 0;

    return SOCIAL_META.map((meta) => {
      const value = row[meta.key];
      const segment = {
        year: row.year,
        value,
        y0: runningTotal,
        y1: runningTotal + value,
        color: meta.color,
        label: meta.label
      };

      runningTotal += value;
      return segment;
    });
  });

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
      d3.axisLeft(y)
        .tickValues([0, 25, 50, 75, 100])
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat("")
    )
    .call((group) => group.select(".domain").remove());

  SOCIAL_META.forEach((meta, index) => {
    const group = svg.append("g");

    group.selectAll("rect")
      .data(stackedRows.map((segments) => segments[index]))
      .join("rect")
      .attr("x", (row) => x(String(row.year)))
      .attr("y", (row) => y(row.y1))
      .attr("width", x.bandwidth())
      .attr("height", (row) => y(row.y0) - y(row.y1))
      .attr("fill", meta.color)
      .append("title")
      .text((row) => `${row.label} | ${row.year} | ${formatPercent(row.value)}%`);
  });

  stackedRows.forEach((segments) => {
    segments.forEach((segment) => {
      const middle = segment.y0 + segment.value / 2;
      const segmentHeight = y(segment.y0) - y(segment.y1);

      svg.append("text")
        .attr("class", "label-text")
        .attr("x", x(String(segment.year)) + x.bandwidth() / 2)
        .attr("y", segmentHeight >= 20 ? y(middle) + 4 : y(segment.y1) - 6)
        .attr("text-anchor", "middle")
        .attr("fill", segmentHeight >= 20 ? "#ffffff" : segment.color)
        .attr("font-weight", 700)
        .text(`${formatPercent(segment.value)}%`);
    });
  });

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).tickValues([0, 25, 50, 75, 100]).tickFormat((value) => `${value}%`));

  svg.append("text")
    .attr("class", "label-text")
    .attr("x", margin.left)
    .attr("y", margin.top - 8)
    .text("Share of time by social context");

  elements.socialNarrative.textContent = buildSocialNarrative(state.selectedSocialAge);
}

function drawLineEndLabels(svg, series, x, y, width, height, margin) {
  const endpoints = series
    .map((seriesItem) => {
      const lastRow = seriesItem.rows[seriesItem.rows.length - 1];
      return {
        ageGroup: seriesItem.ageGroup,
        x: x(lastRow.year),
        y: y(lastRow.dayPct),
        labelY: y(lastRow.dayPct),
        color: getAgeColor(seriesItem.ageGroup)
      };
    })
    .sort((left, right) => left.y - right.y);

  const minGap = 18;
  const topBound = margin.top + 12;
  const bottomBound = height - margin.bottom - 8;

  endpoints.forEach((endpoint, index) => {
    if (index === 0) {
      endpoint.labelY = Math.max(endpoint.labelY, topBound);
      return;
    }

    endpoint.labelY = Math.max(endpoint.labelY, endpoints[index - 1].labelY + minGap);
  });

  if (endpoints.length > 0 && endpoints[endpoints.length - 1].labelY > bottomBound) {
    endpoints[endpoints.length - 1].labelY = bottomBound;

    for (let index = endpoints.length - 2; index >= 0; index -= 1) {
      endpoints[index].labelY = Math.min(endpoints[index].labelY, endpoints[index + 1].labelY - minGap);
    }
  }

  const labels = svg.append("g");

  labels.selectAll("line")
    .data(endpoints)
    .join("line")
    .attr("x1", (endpoint) => endpoint.x)
    .attr("x2", width - margin.right + 8)
    .attr("y1", (endpoint) => endpoint.y)
    .attr("y2", (endpoint) => endpoint.labelY)
    .attr("stroke", (endpoint) => endpoint.color)
    .attr("stroke-width", 1);

  labels.selectAll("text")
    .data(endpoints)
    .join("text")
    .attr("class", "label-text")
    .attr("x", width - margin.right + 12)
    .attr("y", (endpoint) => endpoint.labelY + 4)
    .attr("fill", (endpoint) => endpoint.color)
    .attr("font-weight", 700)
    .text((endpoint) => endpoint.ageGroup);
}

function buildBumpNarrative(ageGroup) {
  const rows = state.activityRecords.filter((row) => row.ageGroup === ageGroup);
  const firstYear = state.years[0];
  const lastYear = state.years[state.years.length - 1];
  const topStart = getTopCategory(rows, firstYear);
  const topEnd = getTopCategory(rows, lastYear);
  const deltas = state.categories.map((categoryCode) => {
    const first = rows.find((row) => row.year === firstYear && row.categoryCode === categoryCode);
    const last = rows.find((row) => row.year === lastYear && row.categoryCode === categoryCode);
    return {
      categoryCode,
      delta: (last?.dayPct || 0) - (first?.dayPct || 0)
    };
  });

  const biggestGain = deltas.reduce((best, current) => current.delta > best.delta ? current : best, deltas[0]);
  const biggestDrop = deltas.reduce((best, current) => current.delta < best.delta ? current : best, deltas[0]);

  return `Pour ${ageGroup}, ${getCategoryMeta(topStart.categoryCode).label} occupe le premier rang en ${firstYear} et ${getCategoryMeta(topEnd.categoryCode).label} en ${lastYear}. ${getCategoryMeta(biggestGain.categoryCode).label} gagne ${formatPercent(biggestGain.delta)} points de jour, tandis que ${getCategoryMeta(biggestDrop.categoryCode).label} perd ${formatPercent(Math.abs(biggestDrop.delta))} points. La largeur des rubans suit une echelle racine carree avec un minimum visuel de 12 px pour garder lisibles les petites categories.`;
}

function buildLineNarrative(categoryCode) {
  const rows = state.activityRecords.filter((row) => row.categoryCode === categoryCode);
  const firstYear = state.years[0];
  const lastYear = state.years[state.years.length - 1];
  const lastRows = rows.filter((row) => row.year === lastYear);
  const strongestLastYear = lastRows.reduce((best, current) => current.dayPct > best.dayPct ? current : best, lastRows[0]);
  const ageDeltas = state.ageGroups.map((ageGroup) => {
    const first = rows.find((row) => row.ageGroup === ageGroup && row.year === firstYear);
    const last = rows.find((row) => row.ageGroup === ageGroup && row.year === lastYear);
    return {
      ageGroup,
      delta: (last?.dayPct || 0) - (first?.dayPct || 0)
    };
  });

  const biggestGain = ageDeltas.reduce((best, current) => current.delta > best.delta ? current : best, ageDeltas[0]);
  const biggestDrop = ageDeltas.reduce((best, current) => current.delta < best.delta ? current : best, ageDeltas[0]);

  return `Pour ${getCategoryMeta(categoryCode).label}, ${strongestLastYear.ageGroup} affiche la part la plus elevee en ${lastYear}. Entre ${firstYear} et ${lastYear}, ${biggestGain.ageGroup} progresse de ${formatPercent(biggestGain.delta)} points de jour alors que ${biggestDrop.ageGroup} recule de ${formatPercent(Math.abs(biggestDrop.delta))} points. Le graphique utilise maintenant le vrai pourcentage du jour, calcule sur une base de 1440 minutes.`;
}

function buildSocialNarrative(ageGroup) {
  const rows = state.socialRecords.filter((row) => row.ageGroup === ageGroup).sort((left, right) => left.year - right.year);
  const firstRow = rows[0];
  const lastRow = rows[rows.length - 1];
  const sharedDelta = lastRow.sharedPct - firstRow.sharedPct;
  const aloneDelta = lastRow.alonePct - firstRow.alonePct;

  return `Pour ${ageGroup}, la part du temps passe seul reste majoritaire sur l'ensemble des vagues. Entre ${firstRow.year} et ${lastRow.year}, la part partagee varie de ${formatPercent(sharedDelta)} points et la part seule de ${formatPercent(aloneDelta)} points, tandis que la categorie "other" demeure marginale.`;
}

function getTopCategory(rows, year) {
  return rows
    .filter((row) => row.year === year)
    .reduce((best, current) => current.dayPct > best.dayPct ? current : best);
}

function renderTabs(container, values, selectedValue, onSelect) {
  clearElement(container);

  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.textContent = value;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(value === selectedValue));

    if (value === selectedValue) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      container.querySelectorAll(".tab-button").forEach((tab) => {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");
      onSelect(value);
    });

    container.appendChild(button);
  });
}

function renderLegend(container, items) {
  clearElement(container);

  items.forEach((item) => {
    const legendItem = document.createElement("span");
    legendItem.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.backgroundColor = item.color;

    const label = document.createElement("span");
    label.textContent = item.label;

    legendItem.append(swatch, label);
    container.appendChild(legendItem);
  });
}

function getChartWidth(container, minimumWidth) {
  const width = container.clientWidth || container.parentElement?.clientWidth || minimumWidth;
  return Math.max(minimumWidth, width);
}

function getCategoryMeta(categoryCode) {
  return CATEGORY_META[categoryCode] || {
    short: categoryCode,
    label: categoryCode,
    color: "#6b7280"
  };
}

function getAgeColor(ageGroup) {
  return AGE_META[ageGroup]?.color || "#6b7280";
}

function getYearTicks() {
  const minimumYear = d3.min(state.years);
  const maximumYear = d3.max(state.years);
  if (minimumYear === undefined || maximumYear === undefined) {
    return [];
  }

  const isContinuous = state.years.length === (maximumYear - minimumYear + 1);
  return isContinuous ? d3.range(minimumYear, maximumYear + 1) : state.years;
}

function clearElement(element) {
  element.replaceChildren();
  return element;
}

function setStatus(message) {
  elements.statusMessage.hidden = false;
  elements.statusMessage.textContent = message;
}

function clearStatus() {
  elements.statusMessage.hidden = true;
  elements.statusMessage.textContent = "";
}

function debounce(callback, delay) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

window.addEventListener("resize", debounce(() => {
  if (state.ready) {
    renderAll();
  }
}, 160));