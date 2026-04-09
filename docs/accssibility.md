# Accessibility Audit - demo/final3

Date: 2026-04-09
Target: WCAG 2.2 AA
Scope: demo/final3 static visualization page (index.html, style.css, script.js)

## 1. Accessibility Score

Overall score: 46/100

Reasoning:
- One automated scan found contrast failures.
- Manual checks found several high-impact keyboard and semantics issues that automated tools do not fully detect.
- Main data interactions are still strongly mouse-first.

## 2. Violation Report

| Severity | Issue | WCAG Criteria | Evidence | Why It Matters |
|---|---|---|---|---|
| High | Focus is intentionally removed from age tabs, breaking keyboard flow | 2.1.1 Keyboard, 2.4.3 Focus Order | [script.js](../demo/final3/script.js#L811), [script.js](../demo/final3/script.js#L812), [script.js](../demo/final3/script.js#L817) | Keyboard users cannot reliably operate the first control group.
| High | Interactive legend items are DIV elements with click handlers but no role/name/tab stop | 4.1.2 Name, Role, Value, 2.1.1 Keyboard | [script.js](../demo/final3/script.js#L765), [script.js](../demo/final3/script.js#L769), [script.js](../demo/final3/script.js#L787) | Screen reader and keyboard users cannot discover or activate these controls consistently.
| High | Chart marks expose information only on mouseenter/mouseleave | 2.1.1 Keyboard, 1.3.1 Info and Relationships | [script.js](../demo/final3/script.js#L473), [script.js](../demo/final3/script.js#L628), [script.js](../demo/final3/script.js#L719) | Important values are hidden from keyboard-only and many assistive technology users.
| High | SVG charts are unlabeled and have no title/desc pairing | 1.1.1 Non-text Content, 4.1.2 Name, Role, Value | [script.js](../demo/final3/script.js#L400), [script.js](../demo/final3/script.js#L563) | Screen reader users get weak context for complex visual content.
| High | Contrast failures in metadata/footer and multiple active category buttons | 1.4.3 Contrast (Minimum) | [style.css](../demo/final3/style.css#L10), [style.css](../demo/final3/style.css#L85), [style.css](../demo/final3/style.css#L176), [script.js](../demo/final3/script.js#L210), [script.js](../demo/final3/script.js#L211), [script.js](../demo/final3/script.js#L213), [script.js](../demo/final3/script.js#L215) | Low-vision users will struggle to read text and identify active state.
| Medium | Missing main landmark and skip link | 2.4.1 Bypass Blocks, 1.3.1 Info and Relationships | [index.html](../demo/final3/index.html#L13), [index.html](../demo/final3/index.html#L16), [index.html](../demo/final3/index.html#L23) | Navigation is slower and less predictable for assistive tech users.
| Medium | Motion preferences are not respected | 2.2.2 Pause, Stop, Hide (adjacent), best practice for reduced motion | [style.css](../demo/final3/style.css#L28), [style.css](../demo/final3/style.css#L393), [script.js](../demo/final3/script.js#L866) | Users sensitive to motion can experience discomfort.
| Medium | Narrative says width reflects share, while chart uses sqrt scaling | Understandability and data integrity risk | [index.html](../demo/final3/index.html#L26), [script.js](../demo/final3/script.js#L519) | Users can misread quantitative comparisons.
| Low | Footer copy says desktop-only design | Inclusive design communication risk | [index.html](../demo/final3/index.html#L70) | This signals reduced support for mobile and assistive use.

## 3. Test Results

### Automated (axe-core, WCAG 2A/2AA/2.1A/2.1AA)

Result summary:
- Violations: 1 rule
- Affected nodes: 2

Detected rule:
- color-contrast (serious)
	- .meta text contrast: 2.71:1 on #F7F3EB background (fails 4.5:1)
	- Active Computing category button label contrast: 1.95:1 (fails 4.5:1)

Note:
- This scan under-reports keyboard and semantic issues because many interactions are custom D3 interactions and hover-only affordances.

### Manual Verification

Keyboard:
- Pressing Tab from page start leaves focus on BODY for the first 4 steps due forced blur on age tabs.
- Legend items are not tabbable.
- Waffle cells (300) are not keyboard reachable.

Semantics and assistive technology:
- SVG charts are rendered without accessible names, titles, or descriptions.
- Interactive legend controls are DIVs without button semantics.

Contrast spot checks:
- Header meta and footer text: 2.72:1 (fail)
- Active category labels on bright fills:
	- Computing: 1.95:1 (fail)
	- Socialising: 1.84:1 (fail)
	- Walking and hiking: 2.52:1 (fail)
	- Childcare activities: 2.38:1 (fail)
	- Cleaning dwelling: 3.36:1 (fail for normal text)

## 4. Remediation Guide (Priority Order)

### P0 - Must Fix First

1. Remove forced blur and pointer suppression on tab controls.
2. Replace clickable legend DIVs with native BUTTON elements.
3. Add keyboard and screen-reader equivalent interaction for chart values.
4. Fix all text contrast failures to meet at least 4.5:1 for normal text.

### P1 - Strongly Recommended

5. Add a skip link and wrap primary content in MAIN.
6. Add accessible names and text alternatives for each SVG chart.
7. Respect prefers-reduced-motion and avoid forced smooth scrolling.

### P2 - Quality and Trust

8. Align chart narrative with sqrt scaling explanation where users first read it.
9. Remove desktop-only messaging from footer.

## 5. Code Examples

### A. Keep Tab Focus on Controls

```js
function buildTabs(containerId, groups, activeVal, onChange) {
	const el = d3.select(`#${containerId}`);
	el.html("");

	groups.forEach((g) => {
		el.append("button")
			.attr("type", "button")
			.text(g)
			.classed("active", g === activeVal)
			.on("click", function () {
				el.selectAll("button").classed("active", false);
				d3.select(this).classed("active", true);
				onChange(g);
			});
	});
}
```

### B. Semantic Legend Buttons

```js
function buildBumpLegend() {
	const el = d3.select("#bump-legend");
	el.html("");

	CATEGORIES.forEach((cat) => {
		const item = el.append("button")
			.attr("type", "button")
			.attr("class", "legend-item")
			.attr("data-cat", cat)
			.attr("aria-label", `Highlight ${CAT_LABELS[cat]}`)
			.on("focus", (ev) => bumpHover(cat, ev))
			.on("blur", bumpUnhover)
			.on("mouseenter", (ev) => bumpHover(cat, ev))
			.on("mouseleave", bumpUnhover)
			.on("click", () => {
				if (cat !== "AC01" && cat !== "AC02 + AC021") selectCat(cat);
			});

		item.append("span").attr("class", "legend-swatch").style("background", CAT_COLORS[cat]);
		item.append("span").text(CAT_LABELS[cat]);
	});
}
```

### C. Label SVG for Screen Readers

```js
const svgRoot = el.append("svg")
	.attr("viewBox", `0 0 ${W} ${H}`)
	.attr("role", "img")
	.attr("aria-labelledby", "bump-title bump-desc");

svgRoot.append("title").attr("id", "bump-title").text("Daily activity shares by year and age group");
svgRoot.append("desc").attr("id", "bump-desc").text(
	"Area bump chart with categories reordered by relative share. Use legend buttons to highlight categories and read values."
);

const svg = svgRoot.append("g").attr("transform", `translate(${m.l},${m.t})`);
```

### D. Respect Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
	html { scroll-behavior: auto; }

	.reveal,
	.reveal.visible,
	.waffle-cell,
	.line-path,
	.line-dot,
	.bump-area {
		transition: none !important;
		animation: none !important;
		transform: none !important;
	}
}
```

### E. Improve Contrast for Active Category Buttons

```css
.cat-buttons button.active {
	color: #1A1612; /* dark text on bright category fills */
}
```

If dark text is not acceptable for all categories, use per-category text color logic to guarantee minimum 4.5:1 contrast.