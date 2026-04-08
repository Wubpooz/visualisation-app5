const DATA = {"years":[2000,2010,2020],"age_groups":["10-24","25-44","45-64","65+"],"activity_categories":["AC01","AC02 + AC021","AC812","AC72","AC512_513_519","AC52","AC611","AC321","AC382_383","AC910"],"values":{"2000":{"10-24":{"shared_pct":24.332,"alone_pct":74.429,"other_pct":1.239,"AC01":{"average_minutes":526.19,"observation_count":42},"AC02 + AC021":{"average_minutes":51.381,"observation_count":84},"AC321":{"average_minutes":14.19,"observation_count":42},"AC382_383":{"average_minutes":4.929,"observation_count":42},"AC512_513_519":{"average_minutes":22.543,"observation_count":81},"AC52":{"average_minutes":10.167,"observation_count":42},"AC611":{"average_minutes":14.048,"observation_count":42},"AC72":{"average_minutes":12.167,"observation_count":42},"AC812":{"average_minutes":7.238,"observation_count":42},"AC910":{"average_minutes":21.262,"observation_count":42}},"25-44":{"shared_pct":24.166,"alone_pct":74.88,"other_pct":0.954,"AC01":{"average_minutes":497.81,"observation_count":42},"AC02 + AC021":{"average_minutes":51.631,"observation_count":84},"AC321":{"average_minutes":22.643,"observation_count":42},"AC382_383":{"average_minutes":13.595,"observation_count":42},"AC512_513_519":{"average_minutes":17.136,"observation_count":81},"AC52":{"average_minutes":5.857,"observation_count":42},"AC611":{"average_minutes":11.81,"observation_count":42},"AC72":{"average_minutes":6.024,"observation_count":42},"AC812":{"average_minutes":6.548,"observation_count":42},"AC910":{"average_minutes":28.881,"observation_count":42}},"45-64":{"shared_pct":25.198,"alone_pct":73.732,"other_pct":1.07,"AC01":{"average_minutes":503.0,"observation_count":42},"AC02 + AC021":{"average_minutes":54.155,"observation_count":84},"AC321":{"average_minutes":27.238,"observation_count":42},"AC382_383":{"average_minutes":2.524,"observation_count":42},"AC512_513_519":{"average_minutes":16.432,"observation_count":81},"AC52":{"average_minutes":4.452,"observation_count":42},"AC611":{"average_minutes":15.381,"observation_count":42},"AC72":{"average_minutes":3.81,"observation_count":42},"AC812":{"average_minutes":8.595,"observation_count":42},"AC910":{"average_minutes":20.976,"observation_count":42}},"65+":{"shared_pct":30.147,"alone_pct":68.429,"other_pct":1.424,"AC01":{"average_minutes":545.81,"observation_count":42},"AC02 + AC021":{"average_minutes":55.869,"observation_count":84},"AC321":{"average_minutes":31.024,"observation_count":42},"AC382_383":{"average_minutes":1.429,"observation_count":42},"AC512_513_519":{"average_minutes":18.951,"observation_count":81},"AC52":{"average_minutes":3.548,"observation_count":42},"AC611":{"average_minutes":23.81,"observation_count":42},"AC72":{"average_minutes":2.286,"observation_count":42},"AC812":{"average_minutes":10.5,"observation_count":42},"AC910":{"average_minutes":2.048,"observation_count":42}}},"2010":{"10-24":{"shared_pct":24.477,"alone_pct":74.073,"other_pct":1.45,"AC01":{"average_minutes":536.472,"observation_count":108},"AC02 + AC021":{"average_minutes":54.183,"observation_count":213},"AC321":{"average_minutes":11.852,"observation_count":108},"AC382_383":{"average_minutes":2.852,"observation_count":108},"AC512_513_519":{"average_minutes":20.315,"observation_count":213},"AC52":{"average_minutes":11.019,"observation_count":108},"AC611":{"average_minutes":12.389,"observation_count":108},"AC72":{"average_minutes":45.389,"observation_count":108},"AC812":{"average_minutes":6.528,"observation_count":108},"AC910":{"average_minutes":14.278,"observation_count":108}},"25-44":{"shared_pct":24.325,"alone_pct":74.632,"other_pct":1.043,"AC01":{"average_minutes":497.667,"observation_count":54},"AC02 + AC021":{"average_minutes":56.685,"observation_count":108},"AC321":{"average_minutes":21.722,"observation_count":54},"AC382_383":{"average_minutes":18.148,"observation_count":54},"AC512_513_519":{"average_minutes":17.556,"observation_count":108},"AC52":{"average_minutes":7.444,"observation_count":54},"AC611":{"average_minutes":9.611,"observation_count":54},"AC72":{"average_minutes":22.0,"observation_count":54},"AC812":{"average_minutes":5.796,"observation_count":54},"AC910":{"average_minutes":29.704,"observation_count":54}},"45-64":{"shared_pct":25.006,"alone_pct":73.862,"other_pct":1.132,"AC01":{"average_minutes":499.574,"observation_count":54},"AC02 + AC021":{"average_minutes":60.315,"observation_count":108},"AC321":{"average_minutes":26.204,"observation_count":54},"AC382_383":{"average_minutes":3.481,"observation_count":54},"AC512_513_519":{"average_minutes":17.769,"observation_count":108},"AC52":{"average_minutes":5.593,"observation_count":54},"AC611":{"average_minutes":13.611,"observation_count":54},"AC72":{"average_minutes":15.648,"observation_count":54},"AC812":{"average_minutes":8.167,"observation_count":54},"AC910":{"average_minutes":22.259,"observation_count":54}},"65+":{"shared_pct":29.954,"alone_pct":68.591,"other_pct":1.455,"AC01":{"average_minutes":544.407,"observation_count":54},"AC02 + AC021":{"average_minutes":65.543,"observation_count":105},"AC321":{"average_minutes":26.389,"observation_count":54},"AC382_383":{"average_minutes":1.222,"observation_count":54},"AC512_513_519":{"average_minutes":22.124,"observation_count":105},"AC52":{"average_minutes":4.722,"observation_count":54},"AC611":{"average_minutes":20.278,"observation_count":54},"AC72":{"average_minutes":10.444,"observation_count":54},"AC812":{"average_minutes":10.426,"observation_count":54},"AC910":{"average_minutes":1.926,"observation_count":54}}},"2020":{"10-24":{"shared_pct":25.838,"alone_pct":72.488,"other_pct":1.674,"AC01":{"average_minutes":555.767,"observation_count":60},"AC02 + AC021":{"average_minutes":49.75,"observation_count":120},"AC321":{"average_minutes":10.167,"observation_count":60},"AC382_383":{"average_minutes":3.083,"observation_count":60},"AC512_513_519":{"average_minutes":41.267,"observation_count":120},"AC52":{"average_minutes":9.133,"observation_count":60},"AC611":{"average_minutes":12.733,"observation_count":60},"AC72":{"average_minutes":12.775,"observation_count":120},"AC812":{"average_minutes":7.817,"observation_count":60},"AC910":{"average_minutes":9.2,"observation_count":60}},"25-44":{"shared_pct":26.288,"alone_pct":72.479,"other_pct":1.233,"AC01":{"average_minutes":505.603,"observation_count":63},"AC02 + AC021":{"average_minutes":54.595,"observation_count":126},"AC321":{"average_minutes":19.873,"observation_count":63},"AC382_383":{"average_minutes":20.048,"observation_count":63},"AC512_513_519":{"average_minutes":30.103,"observation_count":126},"AC52":{"average_minutes":7.968,"observation_count":63},"AC611":{"average_minutes":13.746,"observation_count":63},"AC72":{"average_minutes":9.762,"observation_count":126},"AC812":{"average_minutes":7.476,"observation_count":63},"AC910":{"average_minutes":24.825,"observation_count":63}},"45-64":{"shared_pct":24.827,"alone_pct":73.923,"other_pct":1.25,"AC01":{"average_minutes":503.508,"observation_count":63},"AC02 + AC021":{"average_minutes":57.357,"observation_count":126},"AC321":{"average_minutes":19.937,"observation_count":63},"AC382_383":{"average_minutes":3.476,"observation_count":63},"AC512_513_519":{"average_minutes":26.349,"observation_count":126},"AC52":{"average_minutes":5.683,"observation_count":63},"AC611":{"average_minutes":15.54,"observation_count":63},"AC72":{"average_minutes":8.397,"observation_count":126},"AC812":{"average_minutes":9.619,"observation_count":63},"AC910":{"average_minutes":23.127,"observation_count":63}},"65+":{"shared_pct":29.179,"alone_pct":69.425,"other_pct":1.396,"AC01":{"average_minutes":542.651,"observation_count":63},"AC02 + AC021":{"average_minutes":65.968,"observation_count":126},"AC321":{"average_minutes":23.254,"observation_count":63},"AC382_383":{"average_minutes":0.206,"observation_count":63},"AC512_513_519":{"average_minutes":29.476,"observation_count":126},"AC52":{"average_minutes":4.952,"observation_count":63},"AC611":{"average_minutes":23.667,"observation_count":63},"AC72":{"average_minutes":6.262,"observation_count":126},"AC812":{"average_minutes":15.317,"observation_count":63},"AC910":{"average_minutes":2.492,"observation_count":63}}}}};

const CATEGORY_LABELS = {
  AC01: "Sleeping",
  "AC02 + AC021": "Eating",
  AC812: "Reading books",
  AC72: "Computing",
  AC512_513_519: "Socialising",
  AC52: "Entertainment & culture",
  AC611: "Walking & hiking",
  AC321: "Cleaning dwelling",
  AC382_383: "Child interaction",
  AC910: "Commuting"
};

const CATEGORY_COLORS = {
  AC01: "#2f6db2",
  "AC02 + AC021": "#4fb749",
  AC812: "#e8bc35",
  AC72: "#e85d75",
  AC512_513_519: "#8661c1",
  AC52: "#0ea5a6",
  AC611: "#7f9aa8",
  AC321: "#cf8c38",
  AC382_383: "#bd5b96",
  AC910: "#5d72e6"
};

const AGE_COLORS = {
  "10-24": "#6ad4ff",
  "25-44": "#f5a86b",
  "45-64": "#9fd96d",
  "65+": "#ff8f70"
};

const SHARE_COLORS = {
  alone: "#4f8ac9",
  shared: "#58b368",
  other: "#f2a541"
};

const SHARE_LABELS = {
  alone: "Alone",
  shared: "Shared",
  other: "Other"
};

const EXCLUDED_LINE_CATEGORIES = new Set(["AC01", "AC02 + AC021"]);

const years = [...DATA.years].map(Number).sort((a, b) => a - b);
const ageGroups = [...DATA.age_groups];
const activityCategories = [...DATA.activity_categories];

const totalMinutesCache = new Map();
const shareCache = new Map();

const state = {
  activeAgeGroup: ageGroups[0],
  activeCategory: null,
  hoveredCategory: null,
  hoveredAgeGroup: null
};

const defaultLineCategories = activityCategories.filter((category) => !EXCLUDED_LINE_CATEGORIES.has(category));
state.activeCategory = defaultLineCategories[0] ?? activityCategories[0];

const tooltip = d3.select("#tooltip");
const areaSvg = d3.select("#area-bump-chart");
const lineSvg = d3.select("#line-chart");
const waffleSvg = d3.select("#waffle-chart");

function categoryName(code) {
  return CATEGORY_LABELS[code] ?? code;
}

function asNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatPct(value) {
  return `${d3.format(".1f")(value)}%`;
}

function formatSigned(value) {
  return d3.format("+.1f")(value);
}

function getAgeYearBucket(year, ageGroup) {
  return DATA.values?.[String(year)]?.[ageGroup] ?? {};
}

function getCategoryMinutes(year, ageGroup, category) {
  const bucket = getAgeYearBucket(year, ageGroup);
  const minutes = bucket?.[category]?.average_minutes;
  return asNumber(minutes);
}

function getTotalMinutes(year, ageGroup) {
  const cacheKey = `${year}|${ageGroup}`;
  if (totalMinutesCache.has(cacheKey)) {
    return totalMinutesCache.get(cacheKey);
  }
  const total = d3.sum(activityCategories, (category) => getCategoryMinutes(year, ageGroup, category));
  totalMinutesCache.set(cacheKey, total);
  return total;
}

function getCategoryShare(year, ageGroup, category) {
  const cacheKey = `${year}|${ageGroup}|${category}`;
  if (shareCache.has(cacheKey)) {
    return shareCache.get(cacheKey);
  }
  const total = getTotalMinutes(year, ageGroup);
  const share = total > 0 ? getCategoryMinutes(year, ageGroup, category) / total : 0;
  shareCache.set(cacheKey, share);
  return share;
}

function getSocialShare(year, ageGroup, bucketKey) {
  const bucket = getAgeYearBucket(year, ageGroup);
  return asNumber(bucket[bucketKey]);
}

function getLineCategoryList() {
  const filtered = activityCategories.filter((category) => !EXCLUDED_LINE_CATEGORIES.has(category));
  const list = filtered.length ? filtered : [...activityCategories];
  if (state.activeCategory && !list.includes(state.activeCategory)) {
    return [state.activeCategory, ...list];
  }
  return list;
}

function setActiveAgeGroup(ageGroup) {
  if (!ageGroups.includes(ageGroup) || ageGroup === state.activeAgeGroup) {
    return;
  }
  state.activeAgeGroup = ageGroup;
  renderAgeTabs();
  renderAreaBumpChart();
  renderWaffleChart();
}

function setActiveCategory(category) {
  if (!activityCategories.includes(category) || category === state.activeCategory) {
    return;
  }
  state.activeCategory = category;
  renderCategorySelector();
  renderLineChart();
  applyCategoryFocusStyles();
}

function setHoveredCategory(category) {
  state.hoveredCategory = category;
  applyCategoryFocusStyles();
}

function setHoveredAgeGroup(ageGroup) {
  state.hoveredAgeGroup = ageGroup;
  applyAgeFocusStyles();
}

function showTooltip(event, html) {
  tooltip.html(html).classed("is-visible", true).attr("aria-hidden", "false");

  const node = tooltip.node();
  const rect = node.getBoundingClientRect();
  const offset = 14;
  let left = event.clientX + offset;
  let top = event.clientY + offset;

  if (left + rect.width > window.innerWidth - 12) {
    left = event.clientX - rect.width - offset;
  }
  if (top + rect.height > window.innerHeight - 12) {
    top = event.clientY - rect.height - offset;
  }

  tooltip.style("left", `${left}px`).style("top", `${top}px`);
}

function hideTooltip() {
  tooltip.classed("is-visible", false).attr("aria-hidden", "true");
}

function renderAgeTabs() {
  ["#age-tabs-primary", "#age-tabs-waffle"].forEach((selector) => {
    const container = d3.select(selector);
    const buttons = container.selectAll("button.tab-btn").data(ageGroups, (d) => d);

    buttons
      .join(
        (enter) => enter
          .append("button")
          .attr("type", "button")
          .attr("class", "tab-btn")
          .attr("data-age", (d) => d)
          .attr("role", "tab")
          .on("click", (_, ageGroup) => setActiveAgeGroup(ageGroup))
          .on("mouseenter", (_, ageGroup) => setHoveredAgeGroup(ageGroup))
          .on("mouseleave", () => setHoveredAgeGroup(null))
          .text((d) => d),
        (update) => update,
        (exit) => exit.remove()
      )
      .classed("is-active", (d) => d === state.activeAgeGroup)
      .classed("is-muted", (d) => state.hoveredAgeGroup && d !== state.hoveredAgeGroup);
  });
}

function renderCategoryLegend() {
  const legend = d3.select("#category-legend-top");
  const items = legend.selectAll("button.category-legend-item").data(activityCategories, (d) => d);

  const enter = items
    .enter()
    .append("button")
    .attr("type", "button")
    .attr("class", "legend-item category-legend-item")
    .attr("data-category", (d) => d)
    .on("mouseenter", (_, category) => setHoveredCategory(category))
    .on("mouseleave", () => setHoveredCategory(null))
    .on("click", (_, category) => setActiveCategory(category));

  enter.append("span").attr("class", "swatch");
  enter.append("span").attr("class", "legend-label");

  items
    .merge(enter)
    .select(".swatch")
    .style("background", (d) => CATEGORY_COLORS[d] ?? "#c7cde6");

  items
    .merge(enter)
    .select(".legend-label")
    .text((d) => categoryName(d));
}

function renderCategorySelector() {
  const categories = getLineCategoryList();
  const selector = d3.select("#category-selector");
  const chips = selector.selectAll("button.category-chip").data(categories, (d) => d);

  const enter = chips
    .enter()
    .append("button")
    .attr("type", "button")
    .attr("class", "category-chip")
    .attr("data-category", (d) => d)
    .style("--chip-color", (d) => CATEGORY_COLORS[d] ?? "#9ca3af")
    .on("click", (_, category) => setActiveCategory(category))
    .on("mouseenter", (_, category) => setHoveredCategory(category))
    .on("mouseleave", () => setHoveredCategory(null));

  enter.append("span");

  chips
    .merge(enter)
    .style("--chip-color", (d) => CATEGORY_COLORS[d] ?? "#9ca3af")
    .select("span")
    .text((d) => categoryName(d));

  chips.exit().remove();
  applyCategoryFocusStyles();
}

function renderAgeLegend() {
  const legend = d3.select("#age-legend");
  const items = legend.selectAll("button.age-legend-item").data(ageGroups, (d) => d);

  const enter = items
    .enter()
    .append("button")
    .attr("type", "button")
    .attr("class", "legend-item age-legend-item")
    .attr("data-age", (d) => d)
    .on("mouseenter", (_, ageGroup) => setHoveredAgeGroup(ageGroup))
    .on("mouseleave", () => setHoveredAgeGroup(null));

  enter.append("span").attr("class", "swatch");
  enter.append("span").attr("class", "legend-label");

  items.merge(enter).select(".swatch").style("background", (d) => AGE_COLORS[d] ?? "#d1d5db");
  items.merge(enter).select(".legend-label").text((d) => d);
}

function renderWaffleLegend() {
  const groups = ["alone", "shared", "other"];
  const legend = d3.select("#waffle-legend");
  const items = legend.selectAll("div.legend-item").data(groups, (d) => d);

  const enter = items.enter().append("div").attr("class", "legend-item");
  enter.append("span").attr("class", "swatch");
  enter.append("span").attr("class", "legend-label");

  items.merge(enter).select(".swatch").style("background", (d) => SHARE_COLORS[d]);
  items.merge(enter).select(".legend-label").text((d) => SHARE_LABELS[d]);
}

function stabilizeHeights(rawHeights, minHeight, targetTotal) {
  const heights = rawHeights.map((height) => Math.max(minHeight, height));
  const currentTotal = d3.sum(heights);

  if (currentTotal <= targetTotal) {
    return heights;
  }

  const flexible = heights.map((height) => Math.max(0, height - minHeight));
  const flexibleTotal = d3.sum(flexible);

  if (flexibleTotal <= 0) {
    const even = targetTotal / heights.length;
    return heights.map(() => even);
  }

  const excess = currentTotal - targetTotal;
  return heights.map((height, index) => {
    if (flexible[index] <= 0) {
      return height;
    }
    return height - (flexible[index] / flexibleTotal) * excess;
  });
}

function renderAreaBumpChart() {
  const width = 1180;
  const height = 430;
  const margin = { top: 26, right: 92, bottom: 28, left: 42 };
  const gap = 4;
  const bandCount = activityCategories.length;
  const innerHeight = height - margin.top - margin.bottom;
  const stackHeight = innerHeight - gap * (bandCount - 1);
  const minBandHeight = 8;

  areaSvg.attr("viewBox", `0 0 ${width} ${height}`);
  areaSvg.selectAll("*").remove();

  const x = d3.scalePoint().domain(years).range([margin.left, width - margin.right]).padding(0.4);
  const layoutByYear = {};

  years.forEach((year) => {
    const entries = activityCategories
      .map((category) => ({
        category,
        share: getCategoryShare(year, state.activeAgeGroup, category)
      }))
      .sort((a, b) => d3.descending(a.share, b.share));

    const rawHeights = entries.map((entry) => entry.share * stackHeight);
    const adjustedHeights = stabilizeHeights(rawHeights, minBandHeight, stackHeight);

    let cursor = margin.top;
    layoutByYear[year] = {};

    entries.forEach((entry, index) => {
      const y0 = cursor;
      const y1 = y0 + adjustedHeights[index];
      layoutByYear[year][entry.category] = {
        y0,
        y1,
        rank: index + 1,
        share: entry.share
      };
      cursor = y1 + gap;
    });
  });

  areaSvg
    .append("g")
    .selectAll("line")
    .data(years)
    .join("line")
    .attr("class", "year-guide-line")
    .attr("x1", (year) => x(year))
    .attr("x2", (year) => x(year))
    .attr("y1", margin.top - 2)
    .attr("y2", height - margin.bottom + 1);

  areaSvg
    .append("g")
    .selectAll("text")
    .data(years)
    .join("text")
    .attr("class", "year-guide-label")
    .attr("x", (year) => x(year))
    .attr("y", margin.top - 8)
    .text((year) => year);

  const ribbons = activityCategories
    .map((category) => {
      const points = years.map((year) => ({
        year,
        x: x(year),
        ...layoutByYear[year][category]
      }));
      return {
        category,
        points,
        meanShare: d3.mean(points, (point) => point.share) ?? 0
      };
    })
    .sort((a, b) => d3.descending(a.meanShare, b.meanShare));

  const areaGenerator = d3.area()
    .x((point) => point.x)
    .y0((point) => point.y0)
    .y1((point) => point.y1)
    .curve(d3.curveCatmullRom.alpha(0.66));

  areaSvg
    .append("g")
    .selectAll("path")
    .data(ribbons, (d) => d.category)
    .join("path")
    .attr("class", "area-ribbon")
    .attr("data-category", (d) => d.category)
    .attr("fill", (d) => CATEGORY_COLORS[d.category] ?? "#c4c9dd")
    .attr("d", (d) => areaGenerator(d.points))
    .on("mouseenter", (_, d) => setHoveredCategory(d.category))
    .on("mousemove", (event, d) => {
      const [pointerX] = d3.pointer(event, areaSvg.node());
      const nearestYear = years.reduce((nearest, current) => (
        Math.abs(x(current) - pointerX) < Math.abs(x(nearest) - pointerX) ? current : nearest
      ), years[0]);

      const point = d.points.find((candidate) => candidate.year === nearestYear);
      const minutes = getCategoryMinutes(nearestYear, state.activeAgeGroup, d.category);

      showTooltip(
        event,
        `<strong>${categoryName(d.category)}</strong><br>${state.activeAgeGroup} &middot; ${nearestYear}<br>${formatPct(point.share * 100)} share (${d3.format(".1f")(minutes)} min)`
      );
    })
    .on("mouseleave", () => {
      setHoveredCategory(null);
      hideTooltip();
    })
    .on("click", (_, d) => setActiveCategory(d.category));

  const finalYear = years[years.length - 1];
  const rightLabels = ribbons
    .map((ribbon) => {
      const lastPoint = ribbon.points.find((point) => point.year === finalYear);
      return {
        category: ribbon.category,
        y: (lastPoint.y0 + lastPoint.y1) / 2
      };
    })
    .sort((a, b) => a.y - b.y);

  areaSvg
    .append("g")
    .selectAll("text")
    .data(rightLabels)
    .join("text")
    .attr("x", x(finalYear) + 12)
    .attr("y", (d) => d.y + 4)
    .attr("fill", (d) => d3.color(CATEGORY_COLORS[d.category]).brighter(0.6))
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .text((d) => categoryName(d.category));

  applyCategoryFocusStyles();
  describeAreaTrend();
}

function describeAreaTrend() {
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const changes = activityCategories.map((category) => ({
    category,
    delta: (getCategoryShare(lastYear, state.activeAgeGroup, category) - getCategoryShare(firstYear, state.activeAgeGroup, category)) * 100
  }));

  const up = changes.reduce((best, current) => current.delta > best.delta ? current : best, changes[0]);
  const down = changes.reduce((best, current) => current.delta < best.delta ? current : best, changes[0]);

  d3.select("#area-annotation").text(
    `${state.activeAgeGroup}: ${categoryName(up.category)} climbs ${formatSigned(up.delta)} pts, while ${categoryName(down.category)} shifts ${formatSigned(down.delta)} pts (${firstYear} -> ${lastYear}).`
  );
}

function renderLineChart() {
  const width = 1180;
  const height = 380;
  const margin = { top: 22, right: 118, bottom: 46, left: 58 };
  const lineColorAccent = CATEGORY_COLORS[state.activeCategory] ?? "rgba(255,255,255,0.42)";
  document.getElementById("line-section").style.setProperty("--category-accent", lineColorAccent);

  lineSvg.attr("viewBox", `0 0 ${width} ${height}`);
  lineSvg.selectAll("*").remove();

  const series = ageGroups.map((ageGroup) => ({
    ageGroup,
    values: years.map((year) => ({
      year,
      sharePct: getCategoryShare(year, ageGroup, state.activeCategory) * 100
    }))
  }));

  const x = d3.scalePoint().domain(years).range([margin.left, width - margin.right]).padding(0.45);
  const yMax = d3.max(series, (line) => d3.max(line.values, (point) => point.sharePct)) ?? 0;
  const y = d3.scaleLinear()
    .domain([0, Math.max(5, yMax * 1.22)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  lineSvg
    .append("g")
    .selectAll("line")
    .data(y.ticks(5))
    .join("line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", (tick) => y(tick))
    .attr("y2", (tick) => y(tick))
    .attr("stroke", "rgba(190, 204, 249, 0.16)")
    .attr("stroke-dasharray", "3 6");

  lineSvg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  lineSvg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat((tick) => `${tick}%`));

  const lineGenerator = d3.line()
    .x((point) => x(point.year))
    .y((point) => y(point.sharePct))
    .curve(d3.curveMonotoneX);

  lineSvg
    .append("g")
    .selectAll("path")
    .data(series, (d) => d.ageGroup)
    .join("path")
    .attr("class", "line-series")
    .attr("data-age", (d) => d.ageGroup)
    .attr("stroke", (d) => AGE_COLORS[d.ageGroup] ?? "#e2e8f0")
    .attr("stroke-width", 3)
    .attr("d", (d) => lineGenerator(d.values))
    .on("mouseenter", (_, d) => setHoveredAgeGroup(d.ageGroup))
    .on("mousemove", (event, d) => {
      const [pointerX] = d3.pointer(event, lineSvg.node());
      const nearestYear = years.reduce((nearest, current) => (
        Math.abs(x(current) - pointerX) < Math.abs(x(nearest) - pointerX) ? current : nearest
      ), years[0]);
      const point = d.values.find((entry) => entry.year === nearestYear);
      showTooltip(
        event,
        `<strong>${d.ageGroup}</strong><br>${categoryName(state.activeCategory)} &middot; ${nearestYear}<br>${formatPct(point.sharePct)}`
      );
    })
    .on("mouseleave", () => {
      setHoveredAgeGroup(null);
      hideTooltip();
    });

  const points = series.flatMap((line) => line.values.map((point) => ({ ...point, ageGroup: line.ageGroup })));

  lineSvg
    .append("g")
    .selectAll("circle")
    .data(points)
    .join("circle")
    .attr("class", "line-point")
    .attr("data-age", (d) => d.ageGroup)
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.sharePct))
    .attr("r", 4)
    .attr("fill", (d) => AGE_COLORS[d.ageGroup] ?? "#e2e8f0")
    .on("mouseenter", (_, d) => setHoveredAgeGroup(d.ageGroup))
    .on("mousemove", (event, d) => {
      showTooltip(
        event,
        `<strong>${d.ageGroup}</strong><br>${categoryName(state.activeCategory)} &middot; ${d.year}<br>${formatPct(d.sharePct)}`
      );
    })
    .on("mouseleave", () => {
      setHoveredAgeGroup(null);
      hideTooltip();
    });

  const lastYear = years[years.length - 1];
  const lineEnds = series.map((line) => ({
    ageGroup: line.ageGroup,
    point: line.values[line.values.length - 1]
  }));

  lineSvg
    .append("g")
    .selectAll("text")
    .data(lineEnds)
    .join("text")
    .attr("class", "line-end-label")
    .attr("data-age", (d) => d.ageGroup)
    .attr("x", x(lastYear) + 10)
    .attr("y", (d) => y(d.point.sharePct) + 4)
    .attr("fill", (d) => AGE_COLORS[d.ageGroup] ?? "#e2e8f0")
    .text((d) => d.ageGroup);

  describeLineTrend(series);
  applyAgeFocusStyles();
}

function describeLineTrend(series) {
  const deltas = series.map((line) => ({
    ageGroup: line.ageGroup,
    delta: line.values[line.values.length - 1].sharePct - line.values[0].sharePct
  }));

  const up = deltas.reduce((best, current) => current.delta > best.delta ? current : best, deltas[0]);
  const down = deltas.reduce((best, current) => current.delta < best.delta ? current : best, deltas[0]);

  d3.select("#line-annotation").text(
    `${categoryName(state.activeCategory)}: strongest rise for ${up.ageGroup} (${formatSigned(up.delta)} pts), strongest shift for ${down.ageGroup} (${formatSigned(down.delta)} pts).`
  );
}

function toHundredCells(shares) {
  const keys = ["alone", "shared", "other"];
  const raw = keys.map((key) => clamp(asNumber(shares[key]), 0, 100));
  const sum = d3.sum(raw);
  const normalized = sum > 0 ? raw.map((value) => (value / sum) * 100) : [0, 0, 100];
  const base = normalized.map((value) => Math.floor(value));
  let remainder = 100 - d3.sum(base);

  const fractions = normalized
    .map((value, index) => ({ index, fraction: value - base[index] }))
    .sort((a, b) => d3.descending(a.fraction, b.fraction));

  for (let index = 0; index < remainder; index += 1) {
    base[fractions[index % fractions.length].index] += 1;
  }

  const cells = [];
  keys.forEach((key, index) => {
    for (let count = 0; count < base[index]; count += 1) {
      cells.push(key);
    }
  });

  while (cells.length < 100) {
    cells.push("other");
  }

  return cells.slice(0, 100);
}

function renderWaffleChart() {
  const width = 1180;
  const height = 340;
  const margin = { top: 30, right: 38, bottom: 58, left: 38 };
  const gridGap = 2;

  waffleSvg.attr("viewBox", `0 0 ${width} ${height}`);
  waffleSvg.selectAll("*").remove();

  const xBand = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).paddingInner(0.24);
  const cellSize = Math.max(8, Math.min(16, Math.floor((xBand.bandwidth() - 18) / 10)));
  const gridSize = cellSize * 10 + gridGap * 9;
  const gridTop = margin.top + 18;

  years.forEach((year) => {
    const shares = {
      alone: getSocialShare(year, state.activeAgeGroup, "alone_pct"),
      shared: getSocialShare(year, state.activeAgeGroup, "shared_pct"),
      other: getSocialShare(year, state.activeAgeGroup, "other_pct")
    };

    const yearGroup = waffleSvg.append("g");
    const left = xBand(year) + (xBand.bandwidth() - gridSize) / 2;
    const centerX = left + gridSize / 2;
    const cellBuckets = toHundredCells(shares);

    yearGroup
      .append("text")
      .attr("class", "waffle-year-label")
      .attr("x", centerX)
      .attr("y", margin.top - 2)
      .text(year);

    yearGroup
      .append("g")
      .selectAll("rect")
      .data(cellBuckets.map((bucket, index) => ({ bucket, index, year, shares })))
      .join("rect")
      .attr("class", "waffle-cell")
      .attr("x", (d) => left + (d.index % 10) * (cellSize + gridGap))
      .attr("y", (d) => gridTop + (9 - Math.floor(d.index / 10)) * (cellSize + gridGap))
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) => SHARE_COLORS[d.bucket])
      .on("mousemove", (event, d) => {
        showTooltip(
          event,
          `<strong>${state.activeAgeGroup} &middot; ${d.year}</strong><br>${SHARE_LABELS[d.bucket]}: ${formatPct(d.shares[d.bucket])}`
        );
      })
      .on("mouseleave", hideTooltip);

    yearGroup
      .append("text")
      .attr("class", "waffle-share-label")
      .attr("x", centerX)
      .attr("y", gridTop + gridSize + 18)
      .text(`A ${formatPct(shares.alone)} · S ${formatPct(shares.shared)} · O ${formatPct(shares.other)}`);
  });

  describeWaffleTrend();
}

function describeWaffleTrend() {
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const aloneDelta = getSocialShare(lastYear, state.activeAgeGroup, "alone_pct") - getSocialShare(firstYear, state.activeAgeGroup, "alone_pct");
  const sharedDelta = getSocialShare(lastYear, state.activeAgeGroup, "shared_pct") - getSocialShare(firstYear, state.activeAgeGroup, "shared_pct");
  const otherDelta = getSocialShare(lastYear, state.activeAgeGroup, "other_pct") - getSocialShare(firstYear, state.activeAgeGroup, "other_pct");

  d3.select("#waffle-annotation").text(
    `${state.activeAgeGroup}: alone ${formatSigned(aloneDelta)} pts, shared ${formatSigned(sharedDelta)} pts, other ${formatSigned(otherDelta)} pts (${firstYear} -> ${lastYear}). Grouping intent follows unified ACL notes (entries marked "none" ignored).`
  );
}

function applyCategoryFocusStyles() {
  const focusCategory = state.hoveredCategory || state.activeCategory;

  d3.selectAll(".area-ribbon")
    .classed("is-focused", function isFocused() {
      return focusCategory && this.dataset.category === focusCategory;
    })
    .classed("is-muted", function isMuted() {
      return focusCategory && this.dataset.category !== focusCategory;
    });

  d3.selectAll(".category-legend-item")
    .classed("is-active", function isActive() {
      return this.dataset.category === state.activeCategory;
    })
    .classed("is-muted", function isMuted() {
      return focusCategory && this.dataset.category !== focusCategory;
    });

  d3.selectAll(".category-chip")
    .classed("is-active", function isActive() {
      return this.dataset.category === state.activeCategory;
    })
    .classed("is-muted", function isMuted() {
      return focusCategory && this.dataset.category !== focusCategory;
    });
}

function applyAgeFocusStyles() {
  const focusAge = state.hoveredAgeGroup;

  d3.selectAll(".line-series")
    .classed("is-muted", function isMuted() {
      return focusAge && this.dataset.age !== focusAge;
    })
    .attr("stroke-width", function strokeWidth() {
      return focusAge && this.dataset.age === focusAge ? 4.2 : 3;
    });

  d3.selectAll(".line-point")
    .classed("is-muted", function isMuted() {
      return focusAge && this.dataset.age !== focusAge;
    })
    .attr("r", function pointRadius() {
      return focusAge && this.dataset.age === focusAge ? 5.2 : 4;
    });

  d3.selectAll(".line-end-label")
    .classed("is-muted", function isMuted() {
      return focusAge && this.dataset.age !== focusAge;
    });

  d3.selectAll(".age-legend-item")
    .classed("is-muted", function isMuted() {
      return focusAge && this.dataset.age !== focusAge;
    });

  d3.selectAll(".tab-btn")
    .classed("is-muted", function isMuted() {
      return focusAge && this.dataset.age !== focusAge;
    });
}

function setupRevealObserver() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -12px 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

function initialize() {
  renderAgeTabs();
  renderCategoryLegend();
  renderCategorySelector();
  renderAgeLegend();
  renderWaffleLegend();
  renderAreaBumpChart();
  renderLineChart();
  renderWaffleChart();
  applyCategoryFocusStyles();
  applyAgeFocusStyles();
  setupRevealObserver();
}

initialize();
