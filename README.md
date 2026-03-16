# Our Family Heritage

A modern, interactive heritage website tracing four family lineages from **William Gordon Gemeny (1930-2017)** and **Mary Amelia Sanderson (1933-2016)** back through 520 years and three countries.

## The Four Branches

Starting from Gordon & Mary Amelia, the site traces four main lineages:

1. **Gemeny** — Anthony Gemini arrives in Salem, MA c.1755. A sea captain lost at sea. Pleasant View estate in Kinsale, VA. Civil War soldier. Deep English roots through the Tewksbury, Copp, and Rogers families back to Ralph Rogers (1506, Kent, England). Knights, Tudor-era Warwickshire, Puritan New England.

2. **Gordon / DuBois** — James Gordon immigrates from Ireland to Washington, DC. Marries into the DuBois line — French Huguenots who fled religious persecution, married in Mannheim, Germany, then founded New Paltz, NY in 1678. Louis Du Bois (1626, Wicres, France) is the patriarch. Dutch Van Kleek and Van Voorhees families of the Hudson Valley.

3. **Sanderson** — Joseph Sanderson (1720, Craven County, NC) through generations in Duplin County, NC. The Kennedy line has Irish roots. Thadius and Mary Elizabeth both die in Georgia, leaving their son Albert orphaned at 12. Albert marries Flora Burgess, dies at 41.

4. **Burgess** — Benjamin Burgess (1685, Port Tobacco, Charles County, MD) through generations in Charles County. Benjamin Franklin Burgess born in Baltimore, settles in Alexandria, VA. Eugene Speiden Burgess marries Amelia Bertha Recker. Garrison, Howdershell, Recker, and Schlichting sub-lines.

## By the Numbers

- **165 ancestors** documented with Ancestry.com timeline data
- **520 years** of family history (1506-2026)
- **3 countries** — England, France/Germany, America
- **9 generations** from Anthony Gemini to Brody & Aurora Gload
- **2 knights** — Sir Robert Rogers, Sir James Taylor
- **1 Huguenot founder** — Louis Du Bois, patentee of New Paltz 1678

## Browse the Site

- **Interactive Timeline** — 45+ events from 1621 to 2024, filterable by branch and event type
- **Animated Migration Map** — Watch 270 years of family migration unfold with play/pause controls
- **Story of the Americas / Story of England** — Dual maps tracing geographic roots
- **Burial Map** — Resting places from Congressional Cemetery to "Lost at Sea"
- **Stories** — Civil War memoir, Pleasant View narrative, Thomas Gemini origin essay, pickle recipe
- **Our Story** — Heritage timeline for Aurora & Brody, generation by generation
- **"This Day in History"** — Dynamic widget matching today's date to family events

## Tech

Plain HTML/CSS/JavaScript. No framework, no build step. Data stored as JSON flat files (165 person records) and Markdown content files. Designed to be simple, fast, and maintainable for decades.

## Data Structure

```
data/
  people/           165 JSON person records
  families/         7 family unit records
  events/           5 timeline events
  *-index.json      Auto-generated indexes

content/
  narratives/       Civil War memoir, Pleasant View story
  research/         Thomas Gemini origin essay
  oral-history/     Andrew "Pop" Gemeny recordings index
  recipes/          Lucy Pittman's Green Tomato Pickles

site/
  index.html        Main page with timeline, map, key figures
  stories/          4 standalone story pages
  heritage/         "Our Story" page for Aurora & Brody
  maps/             Interactive maps (Americas, England, Burials)
  css/              Stylesheets
  js/               JavaScript modules (SPA infrastructure)

scripts/
  build-indexes.js  Generates data index files
  batch-add-*.js    Bulk data import scripts
```

## Credits

- **Steven Evans Gemeny** — Original gemeny.com creator, genealogical researcher, audio preservationist
- **W. Gordon Gemeny** — Historical research, Thomas Gemini origin essay (2002)
- **Mary Gemeny (1836-1937)** — Author of "A Reminiscence of the War of the Rebellion" (1913)
- **Andrew "Pop" Gemeny (1896-1989)** — Oral history recordings, family storyteller
- **Colin Gload** — Project curator, modern site developer

---

*Audio recordings copyright 2008 Steven E. Gemeny. War memoir copyright 1997 Steven E. Gemeny. Licensed for personal use only.*
