# Gemeny Family Heritage

A modern, interactive heritage website tracing four family lineages from **William Gordon Gemeny (1930-2017)** and **Mary Amelia Sanderson (1933-2016)** back through 520 years and three countries.

**Live site:** [colingload.github.io/gemeny-heritage](https://colingload.github.io/gemeny-heritage/)

## The Four Branches

1. **Gemeny** — Anthony Gemini arrives in Salem, MA c.1755. A sea captain lost at sea. Pleasant View estate in Kinsale, VA. Civil War soldier. Deep English roots through Tewksbury, Copp, and Rogers families back to Ralph Rogers (1506). Knights, Tudor-era Warwickshire, Puritan New England.

2. **Gordon / DuBois** — James Gordon from Ireland to Washington, DC. French Huguenots who founded New Paltz, NY in 1678. Louis Du Bois (1626, France) is the patriarch. Dutch Van Kleek and Van Voorhees families.

3. **Sanderson** — Joseph Sanderson (1720, NC) through Duplin County. Kennedy line with Irish roots. Albert orphaned at 12, marries Flora Burgess, dies at 41.

4. **Burgess** — Benjamin Burgess (1685, Port Tobacco, MD). Benjamin Franklin Burgess in Alexandria, VA. Garrison, Howdershell, Recker, Schlichting sub-lines.

## By the Numbers

- **1,477 people** in the GEDCOM family tree
- **497 families** documented
- **520+ years** of history (1506-2026)
- **13 generations** from John Copp (1516) to Aurora & Brody Gload
- **22 military** service members (Revolution through modern)
- **11 Freemasons** across 7 lodges
- **22 DAR/SAR patriots** with Revolutionary War connections
- **29 immigrants** from England, France, Ireland, Switzerland, Netherlands, Hungary
- **68+ surnames** tracked across the tree

## Site Features

### Pages
- **Home** — Landing page with hero, key figures, scrollable 800+ event timeline, animated migration map, "This Day in History" (1,380 events), "Meet a Random Ancestor" widget
- **Full Tree** — Interactive canvas-based family tree of all 1,477 people with:
  - Pan, zoom, touch support
  - Expand/collapse branches (+GEN, ALL buttons)
  - Timeline slider (1500-2026) with play/pause animation
  - "How Am I Related?" tool (BFS path finder between any two people)
  - Auto-generated life stories in sidebar
  - Family name dropdown (68+ surnames with spelling variant merging)
  - Badge filters: Military, Freemason, DAR/SAR, Immigration
  - Grid/Tree view toggle
  - Branch color coding (Gemeny gold, Gordon blue, Sanderson terracotta, Burgess purple)
- **Your Story** — Search any name, get a curated editorial narrative walking through their ancestry generation by generation
- **Maps** — Interactive migration maps (Americas, England, Burials) with branch filtering and animated playback
- **Streaks** — Animated migration streak map: 580+ curved flight paths from parent birthplace to child birthplace, spanning 1500-2025 across US/UK/Europe
- **Data** — Comprehensive statistics dashboard with 15+ visualizations:
  - Most common first names and surnames
  - Birth month radar chart
  - Average lifespan by decade, age at death distribution (5-year + infant buckets)
  - Children per family, family population over time
  - Geographic distribution (states, countries of origin)
  - Badge/affiliation stats
  - Leaderboards (longest lived, largest families, most connected)
  - Branch comparison
  - Clickable data completeness with missing data lists and edit fields
  - All charts filterable by branch or surname
- **Stories** — Civil War memoir, Pleasant View narrative, Thomas Gemini origin essay, Green Tomato Pickles recipe

### Cross-Site Features
- Responsive hamburger menu on all pages (mobile)
- Desktop nav with Home, Maps, Your Story, Full Tree, Data, Streaks, Stories, About
- Steven Gemeny / Colin Gload credit on all pages
- GitHub Pages deployment via Actions workflow

## Tech

Plain HTML/CSS/JavaScript. No framework, no build step, no external libraries. All charts drawn with vanilla Canvas. Data stored as JSON flat files and Markdown content.

## Data Structure

```
data/
  gedcom-tree.json      1,477 people + 497 families from GEDCOM
  people/               177 detailed person JSON records
  families/             7 family unit records
  events/               5 timeline events
  on-this-day-events.json  1,380 date-matched events
  people-index.json     Summary index

content/
  narratives/           Civil War memoir, Pleasant View story
  research/             Thomas Gemini origin essay
  oral-history/         Andrew "Pop" Gemeny recordings
  recipes/              Lucy Pittman's Green Tomato Pickles

site/
  index.html            Main landing page
  network/              Interactive full tree
  heritage/             Your Story personalized narrative
  maps/                 Migration maps (Americas, England, Burials)
  streaks/              Animated migration streak map
  stats/                Data dashboard with charts
  stories/              4 standalone story pages
  css/                  Stylesheets
  js/                   JavaScript modules

scripts/
  parse-gedcom-network.js   GEDCOM → JSON parser with badge detection
  build-indexes.js          Generates data index files
```

## Credits

- **Steven Evans Gemeny** — Genealogical research, data compilation, original gemeny.com, audio preservation. Decades of dedicated work made this archive possible.
- **W. Gordon Gemeny** — Historical research, Thomas Gemini origin essay (2002)
- **Mary Gemeny (1836-1937)** — Author of "A Reminiscence of the War of the Rebellion" (1913)
- **Andrew "Pop" Gemeny (1896-1989)** — Oral history recordings, family storyteller
- **Colin Gload** — Website creation, modern site development, data visualization

---

*Audio recordings copyright 2008 Steven E. Gemeny. War memoir copyright 1997 Steven E. Gemeny. Licensed for personal use only.*
