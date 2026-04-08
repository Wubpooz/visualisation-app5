---
name: "Create APP5 D3 Visualization"
description: "Build a gorgeous static desktop HTML/CSS/JS (D3) page for the Europe time-use dataset using design.md: area bump, detailed line chart, and waffle chart."
argument-hint: "Optional extra creative direction (visual mood, storytelling tone, animation intensity)"
agent: "agent"
model: ['Claude Opus 4.5 (copilot)', 'Claude Sonnet 4.5 (copilot)']
---

Use the **feature-dev** skill for implementation rigor and **frontend-design** for high-quality visual design.

Build the visualization webpage using the following project files as source of truth:
- [Design spec](../../design.md)
- [Unified ACL grouping notes](../../docs/observations-count-by-unified-acl-codes.md)
- [Input data JSON](../../demo/final/age_activity_year_average.json)
- [Area bump inspiration image](../../image.png)

## Objective
Create a **static**, **desktop-first** (no mobile requirement) visualization experience in:
- `demo/final/index.html`
- `demo/final/style.css`
- `demo/final/script.js`

No npm tooling. Use plain HTML/CSS/JS and D3 from a CDN if needed.

The page must be visually polished, creative, and interactive, while remaining readable and faithful to the data.

## Data handling requirements
1. Use `demo/final/age_activity_year_average.json` as the data source.
2. Identify and use required fields directly from JSON:
   - `years`
   - `age_groups`
   - `activity_categories`
   - `values[year][ageGroup][category].average_minutes`
   - `values[year][ageGroup].alone_pct`
   - `values[year][ageGroup].shared_pct`
   - `values[year][ageGroup].other_pct`
3. Because data volume is small, **embed the JSON data inside `script.js`** as a JS constant/object (do not fetch at runtime).
4. Gracefully handle missing categories (for example if a designed category is not present in JSON).

## Required charts and layout order
Follow the order from `design.md` exactly:

1. **Top section**
   - Title and short explanatory subtitle.
   - Explicitly mention coverage is for the whole of Europe.

2. **Area bump chart (primary chart)**
   - Show category partition over years for a selected age group.
   - Age-group selector (tabs preferred).
   - Categories must reorder by yearly importance (rank), and stream thickness reflects share.
   - Ensure small categories stay visible against dominant categories (e.g., sleeping/eating).
   - Style should resemble the linked inspiration image while staying original.
   - Include legend and short trend annotation text.
   - Take inspiration from the provided image but create an original design that fits the data and is visually appealing.

3. **Detailed line chart (secondary chart)**
   - Category selector via button list.
   - X = year, Y = percentage share for selected category.
   - One line per age group, end labels for readability.
   - Include legend and concise trend commentary.
   - Exclude “stable/less-interesting” categories by default in selector (at least sleeping and eating), but keep logic easy to extend.

4. **Waffle chart section**
   - Show yearly repartition of `alone/shared/other`.
   - Age-group tabs under chart.
   - Always display shares as percentages.
   - Use grouping intent from `observations-count-by-unified-acl-codes.md`, ignoring entries marked `none`.

## Interaction requirements
Interactions should feel connected across the page:
- Tooltip on hover for all charts.
- Highlight/de-emphasize behavior for hovered category/age group.
- Consistent legends and color mapping across charts.
- Coordinated interactions when possible (shared active age group, shared category emphasis, etc.).
- Add tasteful scroll-triggered reveals/animations.

## Visual and accessibility requirements
- Use a colorblind-friendly palette with good contrast.
- Keep the **same color for the same category everywhere**.
- Maintain clear typography, spacing, and visual hierarchy.
- Keep static delivery simple (no build step), but make it look premium.

## Implementation constraints
- Prefer separated files (`index.html`, `style.css`, `script.js`).
- No npm unless absolutely unavoidable.
- Standard desktop browser compatibility.

## Output expectations
When done:
1. Write/update all three files in `demo/final/`.
2. Briefly summarize:
   - Data fields used
   - Derived calculations (category shares/ranks)
   - How interactions are synchronized
3. Include short “next enhancement ideas” list (optional).

If the user provided extra instructions in the prompt argument, integrate them without violating requirements above.