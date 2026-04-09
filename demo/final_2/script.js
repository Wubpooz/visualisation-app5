const DATA = {"years":[2000,2010,2020],"age_groups":["10-24","25-44","45-64","65+"],"activity_categories":["AC01","AC02 + AC021","AC812","AC72","AC512_513_519","AC52","AC611","AC321","AC382_383","AC910"],"values":{"2000":{"10-24":{"shared_pct":24.332,"alone_pct":74.429,"other_pct":1.239,"AC01":{"average_minutes":526.19,"observation_count":42},"AC02 + AC021":{"average_minutes":51.381,"observation_count":84},"AC321":{"average_minutes":14.19,"observation_count":42},"AC382_383":{"average_minutes":4.929,"observation_count":42},"AC512_513_519":{"average_minutes":22.543,"observation_count":81},"AC52":{"average_minutes":10.167,"observation_count":42},"AC611":{"average_minutes":14.048,"observation_count":42},"AC72":{"average_minutes":12.167,"observation_count":42},"AC812":{"average_minutes":7.238,"observation_count":42},"AC910":{"average_minutes":21.262,"observation_count":42}},"25-44":{"shared_pct":24.166,"alone_pct":74.88,"other_pct":0.954,"AC01":{"average_minutes":497.81,"observation_count":42},"AC02 + AC021":{"average_minutes":51.631,"observation_count":84},"AC321":{"average_minutes":22.643,"observation_count":42},"AC382_383":{"average_minutes":13.595,"observation_count":42},"AC512_513_519":{"average_minutes":17.136,"observation_count":81},"AC52":{"average_minutes":5.857,"observation_count":42},"AC611":{"average_minutes":11.81,"observation_count":42},"AC72":{"average_minutes":6.024,"observation_count":42},"AC812":{"average_minutes":6.548,"observation_count":42},"AC910":{"average_minutes":28.881,"observation_count":42}},"45-64":{"shared_pct":25.198,"alone_pct":73.732,"other_pct":1.07,"AC01":{"average_minutes":503,"observation_count":42},"AC02 + AC021":{"average_minutes":54.155,"observation_count":84},"AC321":{"average_minutes":27.238,"observation_count":42},"AC382_383":{"average_minutes":2.524,"observation_count":42},"AC512_513_519":{"average_minutes":16.432,"observation_count":81},"AC52":{"average_minutes":4.452,"observation_count":42},"AC611":{"average_minutes":15.381,"observation_count":42},"AC72":{"average_minutes":3.81,"observation_count":42},"AC812":{"average_minutes":8.595,"observation_count":42},"AC910":{"average_minutes":20.976,"observation_count":42}},"65+":{"shared_pct":30.147,"alone_pct":68.429,"other_pct":1.424,"AC01":{"average_minutes":545.81,"observation_count":42},"AC02 + AC021":{"average_minutes":55.869,"observation_count":84},"AC321":{"average_minutes":31.024,"observation_count":42},"AC382_383":{"average_minutes":1.429,"observation_count":42},"AC512_513_519":{"average_minutes":18.951,"observation_count":81},"AC52":{"average_minutes":3.548,"observation_count":42},"AC611":{"average_minutes":23.81,"observation_count":42},"AC72":{"average_minutes":2.286,"observation_count":42},"AC812":{"average_minutes":10.5,"observation_count":42},"AC910":{"average_minutes":2.048,"observation_count":42}}},"2010":{"10-24":{"shared_pct":24.477,"alone_pct":74.073,"other_pct":1.45,"AC01":{"average_minutes":536.472,"observation_count":108},"AC02 + AC021":{"average_minutes":54.183,"observation_count":213},"AC321":{"average_minutes":11.852,"observation_count":108},"AC382_383":{"average_minutes":2.852,"observation_count":108},"AC512_513_519":{"average_minutes":20.315,"observation_count":213},"AC52":{"average_minutes":11.019,"observation_count":108},"AC611":{"average_minutes":12.389,"observation_count":108},"AC72":{"average_minutes":45.389,"observation_count":108},"AC812":{"average_minutes":6.528,"observation_count":108},"AC910":{"average_minutes":14.278,"observation_count":108}},"25-44":{"shared_pct":24.325,"alone_pct":74.632,"other_pct":1.043,"AC01":{"average_minutes":497.667,"observation_count":54},"AC02 + AC021":{"average_minutes":56.685,"observation_count":108},"AC321":{"average_minutes":21.722,"observation_count":54},"AC382_383":{"average_minutes":18.148,"observation_count":54},"AC512_513_519":{"average_minutes":17.556,"observation_count":108},"AC52":{"average_minutes":7.444,"observation_count":54},"AC611":{"average_minutes":9.611,"observation_count":54},"AC72":{"average_minutes":22,"observation_count":54},"AC812":{"average_minutes":5.796,"observation_count":54},"AC910":{"average_minutes":29.704,"observation_count":54}},"45-64":{"shared_pct":25.006,"alone_pct":73.862,"other_pct":1.132,"AC01":{"average_minutes":499.574,"observation_count":54},"AC02 + AC021":{"average_minutes":60.315,"observation_count":108},"AC321":{"average_minutes":26.204,"observation_count":54},"AC382_383":{"average_minutes":3.481,"observation_count":54},"AC512_513_519":{"average_minutes":17.769,"observation_count":108},"AC52":{"average_minutes":5.593,"observation_count":54},"AC611":{"average_minutes":13.611,"observation_count":54},"AC72":{"average_minutes":15.648,"observation_count":54},"AC812":{"average_minutes":8.167,"observation_count":54},"AC910":{"average_minutes":22.259,"observation_count":54}},"65+":{"shared_pct":29.954,"alone_pct":68.591,"other_pct":1.455,"AC01":{"average_minutes":544.407,"observation_count":54},"AC02 + AC021":{"average_minutes":65.543,"observation_count":105},"AC321":{"average_minutes":26.389,"observation_count":54},"AC382_383":{"average_minutes":1.222,"observation_count":54},"AC512_513_519":{"average_minutes":22.124,"observation_count":105},"AC52":{"average_minutes":4.722,"observation_count":54},"AC611":{"average_minutes":20.278,"observation_count":54},"AC72":{"average_minutes":10.444,"observation_count":54},"AC812":{"average_minutes":10.426,"observation_count":54},"AC910":{"average_minutes":1.926,"observation_count":54}}},"2020":{"10-24":{"shared_pct":25.838,"alone_pct":72.488,"other_pct":1.674,"AC01":{"average_minutes":555.767,"observation_count":60},"AC02 + AC021":{"average_minutes":49.75,"observation_count":120},"AC321":{"average_minutes":10.167,"observation_count":60},"AC382_383":{"average_minutes":3.083,"observation_count":60},"AC512_513_519":{"average_minutes":41.267,"observation_count":120},"AC52":{"average_minutes":9.133,"observation_count":60},"AC611":{"average_minutes":12.733,"observation_count":60},"AC72":{"average_minutes":12.775,"observation_count":120},"AC812":{"average_minutes":7.817,"observation_count":60},"AC910":{"average_minutes":9.2,"observation_count":60}},"25-44":{"shared_pct":26.288,"alone_pct":72.479,"other_pct":1.233,"AC01":{"average_minutes":505.603,"observation_count":63},"AC02 + AC021":{"average_minutes":54.595,"observation_count":126},"AC321":{"average_minutes":19.873,"observation_count":63},"AC382_383":{"average_minutes":20.048,"observation_count":63},"AC512_513_519":{"average_minutes":30.103,"observation_count":126},"AC52":{"average_minutes":7.968,"observation_count":63},"AC611":{"average_minutes":13.746,"observation_count":63},"AC72":{"average_minutes":9.762,"observation_count":126},"AC812":{"average_minutes":7.476,"observation_count":63},"AC910":{"average_minutes":24.825,"observation_count":63}},"45-64":{"shared_pct":24.827,"alone_pct":73.923,"other_pct":1.25,"AC01":{"average_minutes":503.508,"observation_count":63},"AC02 + AC021":{"average_minutes":57.357,"observation_count":126},"AC321":{"average_minutes":19.937,"observation_count":63},"AC382_383":{"average_minutes":3.476,"observation_count":63},"AC512_513_519":{"average_minutes":26.349,"observation_count":126},"AC52":{"average_minutes":5.683,"observation_count":63},"AC611":{"average_minutes":15.54,"observation_count":63},"AC72":{"average_minutes":8.397,"observation_count":126},"AC812":{"average_minutes":9.619,"observation_count":63},"AC910":{"average_minutes":23.127,"observation_count":63}},"65+":{"shared_pct":29.179,"alone_pct":69.425,"other_pct":1.396,"AC01":{"average_minutes":542.651,"observation_count":63},"AC02 + AC021":{"average_minutes":65.968,"observation_count":126},"AC321":{"average_minutes":23.254,"observation_count":63},"AC382_383":{"average_minutes":0.206,"observation_count":63},"AC512_513_519":{"average_minutes":29.476,"observation_count":126},"AC52":{"average_minutes":4.952,"observation_count":63},"AC611":{"average_minutes":23.667,"observation_count":63},"AC72":{"average_minutes":6.262,"observation_count":126},"AC812":{"average_minutes":15.317,"observation_count":63},"AC910":{"average_minutes":2.492,"observation_count":63}}}}};

const DAY_MINUTES = 1440;

const CATEGORY_META = {
  AC01: { label: "Sleeping", color: "#2f6db3" },
  "AC02 + AC021": { label: "Eating", color: "#4cae4f" },
  AC72: { label: "Computing", color: "#d94f5c" },
  AC512_513_519: { label: "Socialising with others", color: "#8b5fbf" },
  AC52: { label: "Entertainment & culture", color: "#0f9e9b" },
  AC812: { label: "Reading books", color: "#e3b129" },
  AC611: { label: "Walking & hiking", color: "#6e8f8d" },
  AC321: { label: "Cleaning dwelling", color: "#b87938" },
  AC382_383: { label: "Child interaction", color: "#d66d97" },
  AC910: { label: "Travel to/from work", color: "#735e54" },
  AC1_2: { label: "Employment & study", color: "#5c6ed6" }
};

const AGE_META = {
  "10-24": { color: "#2267b5" },
  "25-44": { color: "#d17d37" },
  "45-64": { color: "#5f9a4a" },
  "65+": { color: "#bf5f5b" }
};

const SHARE_META = {
  alone: { label: "Alone", color: "#2f6db3" },
  shared: { label: "Shared", color: "#4cae4f" },
  other: { label: "Other", color: "#d9962a" }
};

const DESIRED_CATEGORY_ORDER = [
  "AC01",
  "AC02 + AC021",
  "AC72",
  "AC512_513_519",
  "AC52",
  "AC812",
  "AC611",
  "AC321",
  "AC382_383",
  "AC910",
  "AC1_2"
];

const EXCLUDED_LINE_CATEGORIES = new Set(["AC01", "AC02 + AC021"]);
const SOCIAL_BUCKETS = ["alone", "shared", "other"];

const years = [...DATA.years].map(Number).sort((a, b) => a - b);
const ageGroups = [...DATA.age_groups];
const activityCategories = [
  ...DESIRED_CATEGORY_ORDER.filter((category) => DATA.activity_categories.includes(category)),
  ...DATA.activity_categories.filter((category) => !DESIRED_CATEGORY_ORDER.includes(category))
];
const missingDesignedCategories = DESIRED_CATEGORY_ORDER.filter((category) => !DATA.activity_categories.includes(category));

const totalMinutesCache = new Map();
const normalizedShareCache = new Map();
const dayShareCache = new Map();

const state = {
  activeAgeGroup: ageGroups[0] ?? null,
  activeCategory: null,
  hoveredCategory: null,
  hoveredAgeGroup: null
};

const defaultLineCategories = activityCategories.filter((category) => !EXCLUDED_LINE_CATEGORIES.has(category));
state.activeCategory = defaultLineCategories[0] ?? activityCategories[0] ?? null;

const tooltip = d3.select("#tooltip");
const areaSvg = d3.select("#area-bump-chart");
const lineSvg = d3.select("#line-chart");
const waffleSvg = d3.select("#waffle-chart");

function categoryName(code) {
  return CATEGORY_META[code]?.label ?? code;
}

function categoryColor(code) {
  return CATEGORY_META[code]?.color ?? "#8791a8";
}

function ageColor(ageGroup) {
  return AGE_META[ageGroup]?.color ?? "#6b7280";
}

function shareName(bucket) {
  return SHARE_META[bucket]?.label ?? bucket;
}

function shareColor(bucket) {
  return SHARE_META[bucket]?.color ?? "#9ca3af";
}

function asNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatPct(value) {
  return `${d3.format(".1f")(value)}%`;
}

function formatMinutes(value) {
  return `${d3.format(".1f")(value)} min`;
}

function formatDelta(value) {
  const normalized = Math.abs(value) < 0.05 ? 0 : value;
  if (normalized === 0) {
    return "0.0 pts";
  }
  return `${d3.format("+.1f")(normalized)} pts`;
}

function formatAbsDelta(value) {
  const normalized = Math.abs(value) < 0.05 ? 0 : value;
  return `${d3.format(".1f")(Math.abs(normalized))} pts`;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getAgeYearBucket(year, ageGroup) {
  return DATA.values?.[String(year)]?.[ageGroup] ?? {};
}

function getCategoryMinutes(year, ageGroup, category) {
  return asNumber(getAgeYearBucket(year, ageGroup)?.[category]?.average_minutes);
}

function getDisplayTotalMinutes(year, ageGroup) {
  const key = `${year}|${ageGroup}`;
  if (totalMinutesCache.has(key)) {
    return totalMinutesCache.get(key);
  }

  const total = d3.sum(activityCategories, (category) => getCategoryMinutes(year, ageGroup, category));
  totalMinutesCache.set(key, total);
  return total;
}

function getNormalizedShare(year, ageGroup, category) {
  const key = `${year}|${ageGroup}|${category}`;
  if (normalizedShareCache.has(key)) {
    return normalizedShareCache.get(key);
  }

  const total = getDisplayTotalMinutes(year, ageGroup);
  const share = total > 0 ? getCategoryMinutes(year, ageGroup, category) / total : 0;
  normalizedShareCache.set(key, share);
  return share;
}

function getDaySharePct(year, ageGroup, category) {
  const key = `${year}|${ageGroup}|${category}`;
  if (dayShareCache.has(key)) {
    return dayShareCache.get(key);
  }

  const sharePct = (getCategoryMinutes(year, ageGroup, category) / DAY_MINUTES) * 100;
  dayShareCache.set(key, sharePct);
  return sharePct;
}

function getSocialShare(year, ageGroup, key) {
  return asNumber(getAgeYearBucket(year, ageGroup)?.[key]);
}

function getLineCategoryList() {
  const filtered = activityCategories.filter((category) => !EXCLUDED_LINE_CATEGORIES.has(category));
  if (!state.activeCategory) {
    return filtered;
  }
  return filtered.includes(state.activeCategory) ? filtered : [state.activeCategory, ...filtered];
}

function showTooltip(event, html) {
  tooltip.html(html).classed("is-visible", true).attr("aria-hidden", "false");
  const node = tooltip.node();
  const rect = node.getBoundingClientRect();
  const offset = 14;
  let left = event.clientX + offset;
  let top = event.clientY + offset;

  if (left + rect.width > window.innerWidth - 16) {
    left = event.clientX - rect.width - offset;
  }

  if (top + rect.height > window.innerHeight - 16) {
    top = event.clientY - rect.height - offset;
  }

  tooltip.style("left", `${left}px`).style("top", `${top}px`);
}

function hideTooltip() {
  tooltip.classed("is-visible", false).attr("aria-hidden", "true");
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
  renderCategoryLegend();
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

function updateCategoryAccent() {
  const accentCategory = state.hoveredCategory || state.activeCategory;
  document.documentElement.style.setProperty("--active-category-accent", categoryColor(accentCategory));
}

function renderAgeTabs() {
  ["#age-tabs-primary", "#age-tabs-waffle"].forEach((selector) => {
    const buttons = d3.select(selector)
      .selectAll("button.tab-btn")
      .data(ageGroups, (d) => d)
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
      );

    buttons
      .attr("aria-selected", (d) => (d === state.activeAgeGroup ? "true" : "false"))
      .attr("tabindex", (d) => (d === state.activeAgeGroup ? "0" : "-1"))
      .classed("is-active", (d) => d === state.activeAgeGroup)
      .classed("is-muted", (d) => Boolean(state.hoveredAgeGroup) && d !== state.hoveredAgeGroup);
  });
}

function renderCategoryLegend() {
  const items = d3.select("#category-legend-top")
    .selectAll("button.category-legend-item")
    .data(activityCategories, (d) => d)
    .join(
      (enter) => {
        const button = enter.append("button")
          .attr("type", "button")
          .attr("class", "legend-item category-legend-item")
          .attr("data-category", (d) => d)
          .on("mouseenter", (_, category) => setHoveredCategory(category))
          .on("mouseleave", () => setHoveredCategory(null))
          .on("click", (_, category) => setActiveCategory(category));

        button.append("span").attr("class", "swatch");
        button.append("span").attr("class", "legend-label");
        return button;
      },
      (update) => update,
      (exit) => exit.remove()
    );

  items.select(".swatch").style("background", (d) => categoryColor(d));
  items.select(".legend-label").text((d) => categoryName(d));
  applyCategoryFocusStyles();
}

function renderCategorySelector() {
  const categories = getLineCategoryList();
  const chips = d3.select("#category-selector")
    .selectAll("button.category-chip")
    .data(categories, (d) => d)
    .join(
      (enter) => {
        const button = enter.append("button")
          .attr("type", "button")
          .attr("class", "category-chip")
          .attr("data-category", (d) => d)
          .on("click", (_, category) => setActiveCategory(category))
          .on("mouseenter", (_, category) => setHoveredCategory(category))
          .on("mouseleave", () => setHoveredCategory(null));

        button.append("span");
        return button;
      },
      (update) => update,
      (exit) => exit.remove()
    );

  chips.style("--chip-color", (d) => categoryColor(d));
  chips.select("span").text((d) => categoryName(d));
  applyCategoryFocusStyles();
}

function renderAgeLegend() {
  const items = d3.select("#age-legend")
    .selectAll("button.age-legend-item")
    .data(ageGroups, (d) => d)
    .join(
      (enter) => {
        const button = enter.append("button")
          .attr("type", "button")
          .attr("class", "legend-item age-legend-item")
          .attr("data-age", (d) => d)
          .on("mouseenter", (_, ageGroup) => setHoveredAgeGroup(ageGroup))
          .on("mouseleave", () => setHoveredAgeGroup(null));

        button.append("span").attr("class", "swatch");
        button.append("span").attr("class", "legend-label");
        return button;
      },
      (update) => update,
      (exit) => exit.remove()
    );

  items.select(".swatch").style("background", (d) => ageColor(d));
  items.select(".legend-label").text((d) => d);
}

function renderWaffleLegend() {
  const items = d3.select("#waffle-legend")
    .selectAll("div.legend-item")
    .data(SOCIAL_BUCKETS, (d) => d)
    .join(
      (enter) => {
        const item = enter.append("div").attr("class", "legend-item");
        item.append("span").attr("class", "swatch");
        item.append("span").attr("class", "legend-label");
        return item;
      },
      (update) => update,
      (exit) => exit.remove()
    );

  items.select(".swatch").style("background", (d) => shareColor(d));
  items.select(".legend-label").text((d) => shareName(d));
}

function renderMissingCategoryNote() {
  const note = d3.select("#missing-category-note");
  if (!missingDesignedCategories.length) {
    note.text("");
    return;
  }

  const missingNames = missingDesignedCategories.map((category) => categoryName(category));
  const verb = missingNames.length === 1 ? "is" : "are";
  note.text(`${missingNames.join(", ")} ${verb} missing from this export, so the page omits ${missingNames.length === 1 ? "it" : "them"} automatically instead of failing.`);
}

function summarizeExtremes(up, down, labelAccessor) {
  const threshold = 0.05;
  const upLabel = labelAccessor(up);
  const downLabel = labelAccessor(down);

  if (up.delta > threshold && down.delta < -threshold) {
    return `${upLabel} gains ${formatAbsDelta(up.delta)}, while ${downLabel} loses ${formatAbsDelta(down.delta)}`;
  }

  if (up.delta > threshold) {
    return `${upLabel} shows the strongest gain at ${formatAbsDelta(up.delta)}, while ${downLabel} changes the least at ${formatAbsDelta(down.delta)}`;
  }

  if (down.delta < -threshold) {
    return `${downLabel} records the sharpest drop at ${formatAbsDelta(down.delta)}, while ${upLabel} stays closest to flat at ${formatAbsDelta(up.delta)}`;
  }

  return "Net movement stays modest across the period";
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
    return heights.map(() => targetTotal / heights.length);
  }

  const excess = currentTotal - targetTotal;
  return heights.map((height, index) => {
    if (flexible[index] <= 0) {
      return height;
    }
    return height - (flexible[index] / flexibleTotal) * excess;
  });
}

function spreadLabels(labels, minGap, minY, maxY) {
  const sorted = labels.map((label) => ({ ...label })).sort((a, b) => a.y - b.y);
  if (!sorted.length) {
    return sorted;
  }

  sorted[0].y = clamp(sorted[0].y, minY, maxY);
  for (let index = 1; index < sorted.length; index += 1) {
    sorted[index].y = Math.max(sorted[index].y, sorted[index - 1].y + minGap);
  }

  const overflow = sorted[sorted.length - 1].y - maxY;
  if (overflow > 0) {
    sorted[sorted.length - 1].y -= overflow;
    for (let index = sorted.length - 2; index >= 0; index -= 1) {
      sorted[index].y = Math.min(sorted[index].y, sorted[index + 1].y - minGap);
    }

    const underflow = minY - sorted[0].y;
    if (underflow > 0) {
      sorted[0].y += underflow;
      for (let index = 1; index < sorted.length; index += 1) {
        sorted[index].y = Math.max(sorted[index].y, sorted[index - 1].y + minGap);
      }
    }
  }

  return sorted;
}

function defineRibbonPatterns(svg) {
  const defs = svg.append("defs");

  activityCategories.forEach((category) => {
    const patternId = `ribbon-${slugify(category)}`;
    const base = d3.color(categoryColor(category));
    const dark = base ? base.darker(0.6).formatHex() : categoryColor(category);
    const light = base ? base.brighter(0.7).formatHex() : categoryColor(category);
    const pattern = defs.append("pattern")
      .attr("id", patternId)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 20)
      .attr("height", 20)
      .attr("patternTransform", "rotate(16)");

    pattern.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", categoryColor(category))
      .attr("opacity", 0.9);

    pattern.append("line")
      .attr("x1", 0)
      .attr("y1", 4)
      .attr("x2", 20)
      .attr("y2", 4)
      .attr("stroke", dark)
      .attr("stroke-opacity", 0.18)
      .attr("stroke-width", 2.2);

    pattern.append("line")
      .attr("x1", 0)
      .attr("y1", 14)
      .attr("x2", 20)
      .attr("y2", 14)
      .attr("stroke", dark)
      .attr("stroke-opacity", 0.12)
      .attr("stroke-width", 1.6);

    pattern.append("path")
      .attr("d", "M2 18 C6 11, 10 16, 16 7")
      .attr("fill", "none")
      .attr("stroke", light)
      .attr("stroke-opacity", 0.16)
      .attr("stroke-width", 1.8)
      .attr("stroke-linecap", "round");
  });
}

function renderAreaBumpChart() {
  if (!state.activeAgeGroup) {
    return;
  }

  const width = 1280;
  const height = 500;
  const margin = { top: 78, right: 238, bottom: 36, left: 52 };
  const gap = 6;
  const innerHeight = height - margin.top - margin.bottom;
  const stackHeight = innerHeight - gap * (activityCategories.length - 1);
  const minBandHeight = 10;

  areaSvg.attr("viewBox", `0 0 ${width} ${height}`);
  areaSvg.selectAll("*").remove();
  defineRibbonPatterns(areaSvg);

  const x = d3.scalePoint().domain(years).range([margin.left, width - margin.right]).padding(0.48);
  const layoutByYear = {};

  years.forEach((year) => {
    const entries = activityCategories
      .map((category) => ({
        category,
        normalizedShare: getNormalizedShare(year, state.activeAgeGroup, category),
        daySharePct: getDaySharePct(year, state.activeAgeGroup, category),
        minutes: getCategoryMinutes(year, state.activeAgeGroup, category)
      }))
      .sort((a, b) => d3.descending(a.normalizedShare, b.normalizedShare) || d3.descending(a.minutes, b.minutes));

    const rawHeights = entries.map((entry) => entry.normalizedShare * stackHeight);
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
        normalizedShare: entry.normalizedShare,
        daySharePct: entry.daySharePct,
        minutes: entry.minutes
      };
      cursor = y1 + gap;
    });
  });

  areaSvg.append("g")
    .selectAll("line")
    .data(years)
    .join("line")
    .attr("class", (year) => `year-rail${year === years[0] || year === years[years.length - 1] ? " year-rail--boundary" : ""}`)
    .attr("x1", (year) => x(year))
    .attr("x2", (year) => x(year))
    .attr("y1", margin.top - 18)
    .attr("y2", height - margin.bottom + 2);

  areaSvg.append("g")
    .selectAll("text")
    .data(years)
    .join("text")
    .attr("class", "year-guide-label")
    .attr("x", (year) => x(year))
    .attr("y", 42)
    .text((year) => String(year).slice(2));

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
        meanShare: d3.mean(points, (point) => point.normalizedShare) ?? 0
      };
    })
    .sort((a, b) => d3.descending(a.meanShare, b.meanShare));

  const areaGenerator = d3.area()
    .x((point) => point.x)
    .y0((point) => point.y0)
    .y1((point) => point.y1)
    .curve(d3.curveCatmullRom.alpha(0.65));

  areaSvg.append("g")
    .selectAll("path")
    .data(ribbons, (d) => d.category)
    .join("path")
    .attr("class", "area-ribbon")
    .attr("data-category", (d) => d.category)
    .attr("fill", (d) => `url(#ribbon-${slugify(d.category)})`)
    .attr("d", (d) => areaGenerator(d.points))
    .on("mouseenter", (_, d) => setHoveredCategory(d.category))
    .on("mousemove", (event, d) => {
      const [pointerX] = d3.pointer(event, areaSvg.node());
      const nearestYear = years.reduce((nearest, current) => (
        Math.abs(x(current) - pointerX) < Math.abs(x(nearest) - pointerX) ? current : nearest
      ), years[0]);

      const point = d.points.find((entry) => entry.year === nearestYear);
      showTooltip(
        event,
        `<strong>${categoryName(d.category)}</strong><br>${state.activeAgeGroup} · ${nearestYear}<br>${formatPct(point.normalizedShare * 100)} of displayed mix<br>${formatPct(point.daySharePct)} of day · ${formatMinutes(point.minutes)}`
      );
    })
    .on("mouseleave", () => {
      setHoveredCategory(null);
      hideTooltip();
    })
    .on("click", (_, d) => setActiveCategory(d.category));

  const finalYear = years[years.length - 1];
  const labels = spreadLabels(
    ribbons.map((ribbon) => {
      const lastPoint = ribbon.points.find((point) => point.year === finalYear);
      return {
        category: ribbon.category,
        sourceY: (lastPoint.y0 + lastPoint.y1) / 2,
        y: (lastPoint.y0 + lastPoint.y1) / 2
      };
    }),
    15,
    margin.top + 8,
    height - margin.bottom - 6
  );

  const labelGroup = areaSvg.append("g");
  labelGroup.selectAll("line")
    .data(labels)
    .join("line")
    .attr("class", "area-label-line")
    .attr("data-category", (d) => d.category)
    .attr("x1", x(finalYear) + 6)
    .attr("x2", x(finalYear) + 40)
    .attr("y1", (d) => d.sourceY)
    .attr("y2", (d) => d.y);

  labelGroup.selectAll("text")
    .data(labels)
    .join("text")
    .attr("class", "area-label")
    .attr("data-category", (d) => d.category)
    .attr("x", x(finalYear) + 46)
    .attr("y", (d) => d.y + 4)
    .attr("fill", (d) => {
      const color = d3.color(categoryColor(d.category));
      return color ? color.darker(0.8).formatHex() : categoryColor(d.category);
    })
    .text((d) => categoryName(d.category));

  applyCategoryFocusStyles();
  describeAreaTrend();
}

function describeAreaTrend() {
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const dominant = activityCategories
    .map((category) => ({ category, share: getNormalizedShare(lastYear, state.activeAgeGroup, category) }))
    .sort((a, b) => d3.descending(a.share, b.share));

  const deltas = activityCategories
    .map((category) => ({
      category,
      delta: getDaySharePct(lastYear, state.activeAgeGroup, category) - getDaySharePct(firstYear, state.activeAgeGroup, category)
    }))
    .sort((a, b) => d3.descending(a.delta, b.delta));

  const up = deltas[0];
  const down = [...deltas].sort((a, b) => d3.ascending(a.delta, b.delta))[0];
  const movementSummary = summarizeExtremes(up, down, (entry) => categoryName(entry.category));

  d3.select("#area-annotation").text(
    `${state.activeAgeGroup}: ${categoryName(dominant[0].category)} still anchors the top lane in ${lastYear}. ${movementSummary} from ${firstYear} to ${lastYear}.`
  );
}

function renderLineChart() {
  if (!state.activeCategory) {
    return;
  }

  const width = 1280;
  const height = 430;
  const margin = { top: 28, right: 180, bottom: 52, left: 74 };
  lineSvg.attr("viewBox", `0 0 ${width} ${height}`);
  lineSvg.selectAll("*").remove();

  const series = ageGroups.map((ageGroup) => ({
    ageGroup,
    values: years.map((year) => ({
      year,
      sharePct: getDaySharePct(year, ageGroup, state.activeCategory),
      minutes: getCategoryMinutes(year, ageGroup, state.activeCategory)
    }))
  }));

  const x = d3.scalePoint().domain(years).range([margin.left, width - margin.right]).padding(0.48);
  const yMax = d3.max(series, (line) => d3.max(line.values, (point) => point.sharePct)) ?? 0;
  const y = d3.scaleLinear()
    .domain([0, Math.max(4, yMax * 1.25)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  lineSvg.append("g")
    .selectAll("line")
    .data(y.ticks(5))
    .join("line")
    .attr("class", "grid-line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", (tick) => y(tick))
    .attr("y2", (tick) => y(tick));

  lineSvg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  lineSvg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat((tick) => `${tick}%`));

  lineSvg.append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left)
    .attr("y", margin.top - 10)
    .text("Share of day");

  const lineGenerator = d3.line()
    .x((point) => x(point.year))
    .y((point) => y(point.sharePct))
    .curve(d3.curveMonotoneX);

  lineSvg.append("g")
    .selectAll("path")
    .data(series, (d) => d.ageGroup)
    .join("path")
    .attr("class", "line-series")
    .attr("data-age", (d) => d.ageGroup)
    .attr("stroke", (d) => ageColor(d.ageGroup))
    .attr("stroke-width", 3.2)
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
        `<strong>${d.ageGroup}</strong><br>${categoryName(state.activeCategory)} · ${nearestYear}<br>${formatPct(point.sharePct)} of day · ${formatMinutes(point.minutes)}`
      );
    })
    .on("mouseleave", () => {
      setHoveredAgeGroup(null);
      hideTooltip();
    });

  const points = series.flatMap((line) => line.values.map((point) => ({ ...point, ageGroup: line.ageGroup })));

  lineSvg.append("g")
    .selectAll("circle")
    .data(points)
    .join("circle")
    .attr("class", "line-point")
    .attr("data-age", (d) => d.ageGroup)
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.sharePct))
    .attr("r", 4.2)
    .attr("fill", (d) => ageColor(d.ageGroup))
    .on("mouseenter", (_, d) => setHoveredAgeGroup(d.ageGroup))
    .on("mousemove", (event, d) => {
      showTooltip(
        event,
        `<strong>${d.ageGroup}</strong><br>${categoryName(state.activeCategory)} · ${d.year}<br>${formatPct(d.sharePct)} of day · ${formatMinutes(d.minutes)}`
      );
    })
    .on("mouseleave", () => {
      setHoveredAgeGroup(null);
      hideTooltip();
    });

  const finalYear = years[years.length - 1];
  const labels = spreadLabels(
    series.map((line) => ({
      ageGroup: line.ageGroup,
      sourceY: y(line.values[line.values.length - 1].sharePct),
      y: y(line.values[line.values.length - 1].sharePct)
    })),
    18,
    margin.top + 8,
    height - margin.bottom - 4
  );

  const labelGroup = lineSvg.append("g");
  labelGroup.selectAll("line")
    .data(labels)
    .join("line")
    .attr("class", "line-label-leader")
    .attr("data-age", (d) => d.ageGroup)
    .attr("x1", x(finalYear) + 4)
    .attr("x2", x(finalYear) + 36)
    .attr("y1", (d) => d.sourceY)
    .attr("y2", (d) => d.y);

  labelGroup.selectAll("text")
    .data(labels)
    .join("text")
    .attr("class", "line-end-label")
    .attr("data-age", (d) => d.ageGroup)
    .attr("x", x(finalYear) + 42)
    .attr("y", (d) => d.y + 4)
    .attr("fill", (d) => ageColor(d.ageGroup))
    .text((d) => d.ageGroup);

  describeLineTrend(series);
  applyAgeFocusStyles();
}

function describeLineTrend(series) {
  const peak = series
    .flatMap((line) => line.values.map((point) => ({ ageGroup: line.ageGroup, ...point })))
    .sort((a, b) => d3.descending(a.sharePct, b.sharePct))[0];

  const deltas = series.map((line) => ({
    ageGroup: line.ageGroup,
    delta: line.values[line.values.length - 1].sharePct - line.values[0].sharePct
  }));

  const up = [...deltas].sort((a, b) => d3.descending(a.delta, b.delta))[0];
  const down = [...deltas].sort((a, b) => d3.ascending(a.delta, b.delta))[0];
  const movementSummary = summarizeExtremes(up, down, (entry) => entry.ageGroup);

  d3.select("#line-annotation").text(
    `${categoryName(state.activeCategory)} peaks with ${peak.ageGroup} in ${peak.year} at ${formatPct(peak.sharePct)} of the day. ${movementSummary}.`
  );
}

function toHundredCells(shares) {
  const raw = SOCIAL_BUCKETS.map((bucket) => clamp(asNumber(shares[bucket]), 0, 100));
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
  SOCIAL_BUCKETS.forEach((bucket, index) => {
    for (let count = 0; count < base[index]; count += 1) {
      cells.push(bucket);
    }
  });

  while (cells.length < 100) {
    cells.push("other");
  }

  return cells.slice(0, 100);
}

function renderWaffleChart() {
  if (!state.activeAgeGroup) {
    return;
  }

  const width = 1280;
  const height = 390;
  const margin = { top: 44, right: 48, bottom: 76, left: 48 };
  const xBand = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).paddingInner(0.24);
  const gridGap = 3;
  const cellSize = Math.max(10, Math.min(16, Math.floor((xBand.bandwidth() - 22) / 10)));
  const gridSize = cellSize * 10 + gridGap * 9;
  const gridTop = margin.top + 18;

  waffleSvg.attr("viewBox", `0 0 ${width} ${height}`);
  waffleSvg.selectAll("*").remove();

  years.forEach((year) => {
    const shares = {
      alone: getSocialShare(year, state.activeAgeGroup, "alone_pct"),
      shared: getSocialShare(year, state.activeAgeGroup, "shared_pct"),
      other: getSocialShare(year, state.activeAgeGroup, "other_pct")
    };

    const yearGroup = waffleSvg.append("g");
    const left = xBand(year) + (xBand.bandwidth() - gridSize) / 2;
    const centerX = left + gridSize / 2;
    const cells = toHundredCells(shares);

    yearGroup.append("text")
      .attr("class", "waffle-year-label")
      .attr("x", centerX)
      .attr("y", margin.top - 2)
      .text(year);

    yearGroup.append("g")
      .selectAll("rect")
      .data(cells.map((bucket, index) => ({ bucket, index, year, shares })))
      .join("rect")
      .attr("class", "waffle-cell")
      .attr("x", (d) => left + (d.index % 10) * (cellSize + gridGap))
      .attr("y", (d) => gridTop + (9 - Math.floor(d.index / 10)) * (cellSize + gridGap))
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) => shareColor(d.bucket))
      .on("mousemove", (event, d) => {
        showTooltip(
          event,
          `<strong>${state.activeAgeGroup} · ${d.year}</strong><br>${shareName(d.bucket)}: ${formatPct(d.shares[d.bucket])}`
        );
      })
      .on("mouseleave", hideTooltip);

    yearGroup.append("text")
      .attr("class", "waffle-share-label")
      .attr("x", centerX)
      .attr("y", gridTop + gridSize + 22)
      .text(`Alone ${formatPct(shares.alone)} · Shared ${formatPct(shares.shared)} · Other ${formatPct(shares.other)}`);
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
    `${state.activeAgeGroup}: alone ${formatDelta(aloneDelta)}, shared ${formatDelta(sharedDelta)}, other ${formatDelta(otherDelta)} from ${firstYear} to ${lastYear}. Categories tagged as none in the ACL notes are excluded from this split.`
  );
}

function applyCategoryFocusStyles() {
  const focusCategory = state.hoveredCategory || state.activeCategory;
  updateCategoryAccent();

  d3.selectAll(".area-ribbon")
    .classed("is-focused", function isFocused() {
      return Boolean(focusCategory) && this.dataset.category === focusCategory;
    })
    .classed("is-muted", function isMuted() {
      return Boolean(focusCategory) && this.dataset.category !== focusCategory;
    });

  d3.selectAll(".area-label, .area-label-line")
    .classed("is-muted", function isMuted() {
      return Boolean(focusCategory) && this.dataset.category !== focusCategory;
    });

  d3.selectAll(".category-legend-item")
    .classed("is-active", function isActive() {
      return this.dataset.category === state.activeCategory;
    })
    .classed("is-muted", function isMuted() {
      return Boolean(focusCategory) && this.dataset.category !== focusCategory;
    });

  d3.selectAll(".category-chip")
    .classed("is-active", function isActive() {
      return this.dataset.category === state.activeCategory;
    })
    .classed("is-muted", function isMuted() {
      return Boolean(focusCategory) && this.dataset.category !== focusCategory;
    });
}

function applyAgeFocusStyles() {
  const focusAge = state.hoveredAgeGroup;

  d3.selectAll(".line-series")
    .classed("is-muted", function isMuted() {
      return Boolean(focusAge) && this.dataset.age !== focusAge;
    })
    .attr("stroke-width", function strokeWidth() {
      return focusAge && this.dataset.age === focusAge ? 4.4 : 3.2;
    });

  d3.selectAll(".line-point")
    .classed("is-muted", function isMuted() {
      return Boolean(focusAge) && this.dataset.age !== focusAge;
    })
    .attr("r", function pointRadius() {
      return focusAge && this.dataset.age === focusAge ? 5.4 : 4.2;
    });

  d3.selectAll(".line-end-label, .line-label-leader")
    .classed("is-muted", function isMuted() {
      return Boolean(focusAge) && this.dataset.age !== focusAge;
    });

  d3.selectAll(".age-legend-item")
    .classed("is-muted", function isMuted() {
      return Boolean(focusAge) && this.dataset.age !== focusAge;
    });

  d3.selectAll(".tab-btn")
    .classed("is-muted", function isMuted() {
      return Boolean(focusAge) && this.dataset.age !== focusAge;
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
    { threshold: 0.18, rootMargin: "0px 0px -24px 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

function initialize() {
  renderAgeTabs();
  renderCategoryLegend();
  renderCategorySelector();
  renderAgeLegend();
  renderWaffleLegend();
  renderMissingCategoryNote();
  renderAreaBumpChart();
  renderLineChart();
  renderWaffleChart();
  applyCategoryFocusStyles();
  applyAgeFocusStyles();
  setupRevealObserver();
  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);
}

initialize();